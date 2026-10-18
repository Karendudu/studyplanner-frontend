export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://studyplanner-v0t3.onrender.com";

export interface ApiError {
  statusCode: number;
  mensaje: string;
  detalles?: string;
  respuesta?: number;
}

interface ApiRequestError extends Error {
  statusCode?: number;
  response?: unknown;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function formatFieldName(field: string) {
  const normalized = field.replace(/^\$\./, "").toLowerCase();
  const labels: Record<string, string> = {
    correo: "Correo",
    contrasenia: "Contraseña",
    contraseña: "Contraseña",
  };
  return labels[normalized] || normalized;
}

function getApiErrorMessage(payload: unknown, status: number): string {
  let data = payload;
  if (typeof data === "string") {
    const text = data;
    try {
      data = JSON.parse(data) as unknown;
    } catch {
      return text.trim() || getErrorMessageByStatus(status);
    }
  }

  if (!isRecord(data)) return getErrorMessageByStatus(status);

  if (isRecord(data.errors)) {
    const validationMessages = Object.entries(data.errors).flatMap(([field, messages]) => {
      const fieldMessages = Array.isArray(messages)
        ? messages.filter((message): message is string => typeof message === "string")
        : typeof messages === "string" ? [messages] : [];
      return fieldMessages.map((message) => `${formatFieldName(field)}: ${message}`);
    });
    if (validationMessages.length > 0) return validationMessages.join(" ");
  }

  for (const key of ["mensaje", "message", "detail"]) {
    if (typeof data[key] === "string" && data[key].trim()) return data[key];
  }

  if (typeof data.title === "string" && data.title !== "One or more validation errors occurred.") {
    return data.title;
  }

  return getErrorMessageByStatus(status);
}

/**
 * Maneja errores de la API de forma amigable
 */
export function handleApiError(error: unknown): ApiError {
  if (error instanceof Error) {
    const apiError = error as ApiRequestError;
    const statusCode = apiError.statusCode;
    if (statusCode) {
      return {
        statusCode,
        mensaje: getApiErrorMessage(apiError.response ?? error.message, statusCode),
        detalles: error.stack,
      };
    }

    // Error de conexión o de red
    if (error.message.includes("Failed to fetch") || error.message.includes("NetworkError")) {
      return {
        statusCode: 0,
        mensaje: "No se pudo leer la respuesta del backend. Puede ser CORS o un error del servidor.",
        detalles: error.message,
      };
    }

    // Intenta parsear JSON de respuesta de error
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.mensaje) {
        return {
          statusCode: parsed.respuesta || 500,
          mensaje: parsed.mensaje,
          respuesta: parsed.respuesta,
        };
      }
    } catch {
      // No es JSON, continúa
    }

    // Error genérico
    return {
      statusCode: 500,
      mensaje: error.message || "Ocurrió un error inesperado",
      detalles: error.stack,
    };
  }

  return {
    statusCode: 500,
    mensaje: "Ocurrió un error desconocido",
  };
}

/**
 * Obtiene un mensaje de error amigable según el código de estado HTTP
 */
export function getErrorMessageByStatus(status: number): string {
  const messages: Record<number, string> = {
    0: "No se pudo conectar con el servidor",
    400: "Los datos enviados no son válidos",
    401: "Tu sesión ha expirado. Inicia sesión de nuevo",
    403: "No tienes permiso para realizar esta acción",
    404: "El recurso no fue encontrado",
    409: "Hay un conflicto con los datos (posiblemente duplicados)",
    422: "No se pueden procesar los datos enviados",
    429: "Se han hecho demasiadas solicitudes. Intenta más tarde",
    500: "Error interno del servidor",
    503: "El servidor no está disponible. Intenta más tarde",
  };

  return messages[status] || `Error ${status}: Ocurrió un problema`;
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("studyplanner-token");
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;

  const defaultHeaders: Record<string, string> = isFormData
    ? {}
    : { "Content-Type": "application/json" };

  if (token) {
    defaultHeaders.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        ...defaultHeaders,
        ...(options.headers || {}),
      },
      ...options,
    });

    const contentType = response.headers.get("content-type") || "";
    const isJsonResponse = contentType.includes("application/json") || contentType.includes("+json");

    // Manejo de respuestas no-JSON
    if (!isJsonResponse) {
      if (!response.ok) {
        const text = await response.text().catch(() => "");
        const error = new Error(getApiErrorMessage(text, response.status)) as ApiRequestError;
        error.statusCode = response.status;
        error.response = text;
        throw error;
      }
      return (await response.text()) as unknown as T;
    }

    // Parsear respuesta JSON
    const data = await response.json();

    // Si no es exitosa, lanzar error
    if (!response.ok) {
      const error = new Error(getApiErrorMessage(data, response.status)) as ApiRequestError;
      error.statusCode = response.status;
      error.response = data;
      throw error;
    }

    return data as T;
  } catch (error) {
    // Re-lanzar errores conocidos
    if (error instanceof Error && (error as ApiRequestError).statusCode) {
      throw error;
    }

    // Manejar errores de conexión
    if (error instanceof TypeError) {
      throw new Error(
        "No se pudo leer la respuesta del backend. Puede ser CORS o un error del servidor.",
        { cause: error }
      );
    }

    throw error;
  }
}
