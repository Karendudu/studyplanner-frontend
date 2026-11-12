import { apiRequest } from "./api";
import type {
  Horario,
  ReqCrearHorario,
  ReqCrearNucleo,
  NucleoTematico,
  Usuario,
  ResponseCantiUsuarios,
  ResponseLoginDto,
  ReqLogin,
  ReqEnviarEmail,
  ResponseEmail,
  PeriodoMatricula,
  EstadoMatriculaEstudiante,
  ReqCrearUsuario,
  ReqEditarUsuario,
  ReqEditarHorario,
  ReqEditarNucleo,
  ReqActualizarCupo,
  EstudiantesPorPrograma,
  AvisoInformativo,
  ReqEditarPeriodoMatricula,
  ReqCrearAvisoInformativo,
  ReqEditarAvisoInformativo,
  ReqSolicitarRecuperacion,
  ReqVerificarCodigoRecuperacion,
  ReqCambiarContraseniaRecuperacion,
} from "./types";

// ==================== Auth Endpoints ====================
/**
 * Login del usuario con correo y contraseña
 * Retorna token y datos del usuario
 */
export async function loginUsuario(payload: ReqLogin): Promise<ResponseLoginDto> {
  return apiRequest<ResponseLoginDto>("/api/Auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Login alternativo de usuarios
 */
export async function inicioSesionUsuario(payload: ReqLogin): Promise<ResponseLoginDto> {
  return apiRequest<ResponseLoginDto>("/api/Usuarios/inicioSesion", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==================== Recuperación de contraseña ====================
export async function solicitarRecuperacionContrasenia(
  payload: ReqSolicitarRecuperacion
): Promise<unknown> {
  return apiRequest<unknown>("/api/RecuperacionContrasena/solicitar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function verificarCodigoRecuperacion(
  payload: ReqVerificarCodigoRecuperacion
): Promise<unknown> {
  return apiRequest<unknown>("/api/RecuperacionContrasena/verificar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function cambiarContraseniaRecuperacion(
  payload: ReqCambiarContraseniaRecuperacion
): Promise<unknown> {
  return apiRequest<unknown>("/api/RecuperacionContrasena/cambiar", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==================== Email Endpoints ====================
/**
 * Envío de horario al usuario por correo
 */
export async function enviarHorarioUsuario(payload: ReqEnviarEmail): Promise<ResponseEmail> {
  return apiRequest<ResponseEmail>("/api/Email/Envio de horario al usuario", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

// ==================== Cronograma ====================
export async function getCronogramaPorPrograma(idPrograma: number): Promise<unknown> {
  return apiRequest<unknown>(`/api/Cronograma/programa/${idPrograma}`);
}

export async function getMiCronograma(): Promise<unknown> {
  return apiRequest<unknown>("/api/Cronograma/mi-programa");
}

// ==================== Avisos Informativos ====================
export async function getAvisosInformativos(): Promise<AvisoInformativo[]> {
  return apiRequest<AvisoInformativo[]>("/api/AvisoInformativo");
}

export async function getAvisoInformativo(id: number): Promise<AvisoInformativo> {
  return apiRequest<AvisoInformativo>(`/api/AvisoInformativo/${id}`);
}

export async function crearAvisoInformativo(
  payload: ReqCrearAvisoInformativo
): Promise<AvisoInformativo> {
  return apiRequest<AvisoInformativo>("/api/AvisoInformativo", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function editarAvisoInformativo(
  id: number,
  payload: ReqEditarAvisoInformativo
): Promise<AvisoInformativo> {
  return apiRequest<AvisoInformativo>(`/api/AvisoInformativo/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ==================== Horario Endpoints ====================
/**
 * Obtiene lista de todos los horarios
 */
export async function getHorarios(): Promise<Horario[]> {
  return apiRequest<Horario[]>("/api/Horario/listar");
}

/**
 * Obtiene un horario específico por ID
 */
export async function getHorarioById(id: number): Promise<Horario> {
  return apiRequest<Horario>(`/api/Horario/${id}`);
}

/**
 * Crea un nuevo horario
 */
export async function crearHorario(payload: ReqCrearHorario): Promise<unknown> {
  return apiRequest<unknown>(`/api/Horario/crear`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Edita un horario existente
 */
export async function editarHorario(
  idHorario: number,
  payload: ReqEditarHorario
): Promise<unknown> {
  return apiRequest<unknown>(`/api/Horario/editar/${idHorario}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Elimina un horario
 */
export async function eliminarHorario(idHorario: number): Promise<unknown> {
  return apiRequest<unknown>(`/api/Horario/eliminar`, {
    method: "DELETE",
    body: JSON.stringify({ idHorario }),
  });
}

// ==================== Nucleo Tematico Endpoints ====================
/**
 * Obtiene lista de todos los núcleos temáticos
 */
export async function getNucleos(): Promise<NucleoTematico[]> {
  return apiRequest<NucleoTematico[]>(`/api/NucleoTematicoes`);
}

/** Obtiene los núcleos vistos asociados al usuario autenticado. */
export async function getMisNucleosVistos(): Promise<unknown> {
  return apiRequest<unknown>(`/api/NucleoTematicoes/mis-nucleos-vistos`);
}

/**
 * Obtiene un núcleo temático específico por ID
 */
export async function getNucleoById(id: string): Promise<NucleoTematico> {
  return apiRequest<NucleoTematico>(`/api/NucleoTematicoes/${id}`);
}

/**
 * Crea un nuevo núcleo temático
 */
export async function crearNucleo(payload: ReqCrearNucleo): Promise<NucleoTematico> {
  return apiRequest<NucleoTematico>(`/api/NucleoTematicoes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Edita un núcleo temático existente
 */
export async function editarNucleo(
  id: string,
  payload: ReqEditarNucleo
): Promise<NucleoTematico> {
  return apiRequest<NucleoTematico>(`/api/NucleoTematicoes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Elimina un núcleo temático
 */
export async function eliminarNucleo(id: string): Promise<unknown> {
  return apiRequest<unknown>(`/api/NucleoTematicoes/${id}`, {
    method: "DELETE",
  });
}

/**
 * Obtiene núcleos por semestre
 */
export async function getNucleosPorSemestre(): Promise<NucleoTematico[]> {
  return apiRequest<NucleoTematico[]>(
    `/api/NucleoTematicoes/nucleos-por-semestre`
  );
}

/**
 * Obtiene cantidad de núcleos por programa
 */
export async function getCantidadNucleosPorPrograma(
  idPrograma: number
): Promise<number> {
  return apiRequest<number>(
    `/api/NucleoTematicoes/cantidad-nucleos-programa?idPrograma=${idPrograma}`
  );
}

/**
 * Obtiene núcleos ordenados por cupo disponible
 */
export async function getNucleosOrdenadosPorCupo(): Promise<NucleoTematico[]> {
  return apiRequest<NucleoTematico[]>(
    `/api/NucleoTematicoes/nucleos-ordenados-por-cupo`
  );
}

/**
 * Actualiza el cupo de un núcleo temático
 */
export async function actualizarCupo(
  id: string,
  payload: ReqActualizarCupo
): Promise<unknown> {
  return apiRequest<unknown>(`/api/NucleoTematicoes/${id}/cupo`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ==================== Período de Matrícula Endpoints ====================
/**
 * Obtiene el período de matrícula activo
 */
export async function getPeriodoMatriculaActivo(): Promise<PeriodoMatricula> {
  return apiRequest<PeriodoMatricula>("/api/PeriodoMatricula/activo");
}

/**
 * Obtiene el estado de matrícula de un estudiante
 */
export async function getEstadoMatriculaEstudiante(
  idEstudiante: number
): Promise<EstadoMatriculaEstudiante> {
  return apiRequest<EstadoMatriculaEstudiante>(
    `/api/PeriodoMatricula/estado/${idEstudiante}`
  );
}

export async function getMateriasPermitidas(idUsuario: number): Promise<unknown> {
  return apiRequest<unknown>(`/api/ReglasMatricula/materias-permitidas/${idUsuario}`);
}

/** Genera los horarios según las reglas de matrícula. */
export async function generarHorarios(): Promise<unknown> {
  return apiRequest<unknown>("/api/ReglasMatricula/generar-horarios");
}

/** Sube una sábana académica en PDF para procesarla en el backend. */
export async function subirSabana(archivo: File): Promise<unknown> {
  const formData = new FormData();
  formData.append("archivo", archivo);
  return apiRequest<unknown>("/api/Sabana/subir", {
    method: "POST",
    body: formData,
  });
}

/**
 * Actualiza el estado de matrícula de un estudiante
 */
export async function actualizarEstadoMatricula(
  idEstudiante: number
): Promise<unknown> {
  return apiRequest<unknown>(
    `/api/PeriodoMatricula/actualizar/${idEstudiante}`,
    {
      method: "PUT",
    }
  );
}

/** Edita un periodo de matrícula existente. */
export async function editarPeriodoMatricula(
  idPeriodoMatricula: number,
  payload: ReqEditarPeriodoMatricula
): Promise<PeriodoMatricula> {
  return apiRequest<PeriodoMatricula>(`/api/PeriodoMatricula/editar/${idPeriodoMatricula}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

// ==================== Usuarios Endpoints ====================
export async function getEstudiantes(): Promise<Usuario[]> {
  return apiRequest<Usuario[]>(`/api/Usuarios/estudiantes`);
}

/**
 * Obtiene datos de un usuario específico
 */
export async function getUsuario(id: number): Promise<Usuario> {
  return apiRequest<Usuario>(`/api/Usuarios/${id}`);
}

/**
 * Crea un nuevo usuario
 */
export async function crearUsuario(payload: ReqCrearUsuario): Promise<Usuario> {
  return apiRequest<Usuario>(`/api/Usuarios`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function crearUsuarioUdec(payload: ReqCrearUsuario): Promise<Usuario> {
  return apiRequest<Usuario>(`/api/Usuarios/crear-udec`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * Edita los datos de un usuario
 */
export async function editarUsuario(
  id: number,
  payload: ReqEditarUsuario
): Promise<Usuario> {
  return apiRequest<Usuario>(`/api/Usuarios/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

/**
 * Elimina un usuario
 */
export async function eliminarUsuario(id: number): Promise<unknown> {
  return apiRequest<unknown>(`/api/Usuarios/${id}`, {
    method: "DELETE",
  });
}

/**
 * Obtiene la cantidad de estudiantes y administradores
 */
export async function contarUsuarios(): Promise<ResponseCantiUsuarios> {
  return apiRequest<ResponseCantiUsuarios>(`/api/Usuarios/contar-usuarios`);
}

/**
 * Obtiene cantidad de estudiantes por programa
 */
export async function getEstudiantesPorPrograma(): Promise<EstudiantesPorPrograma[]> {
  return apiRequest<EstudiantesPorPrograma[]>(`/api/Usuarios/estudiantes-por-programa`);
}
