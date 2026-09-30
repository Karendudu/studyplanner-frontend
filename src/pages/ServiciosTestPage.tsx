import { useState } from "react";
import {
  loginUsuario,
  getHorarios,
  getNucleos,
  contarUsuarios,
  getUsuario,
  getPeriodoMatriculaActivo,
} from "../services/backend";
import { handleApiError } from "../services/api";
import ErrorAlert from "../components/ui/ErrorAlert";
import Button from "../components/ui/Button";

/**
 * PÁGINA DE PRUEBA DE SERVICIOS
 * 
 * Esta página permite probar todos los servicios del backend
 * en tiempo real y ver las respuestas formateadas de forma amigable.
 * 
 * IMPORTANTE: Solo usar en desarrollo. Eliminar en producción.
 */

export default function ServiciosTestPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);

  // Estados para formularios
  const [loginForm, setLoginForm] = useState({
    correo: "prueba@correo.com",
    contrasenia: "Prueba123*",
  });
  const [usuarioId, setUsuarioId] = useState("1");

  const handleError = (err: unknown, context: string) => {
    const apiError = handleApiError(err);
    setError(`[${context}] ${apiError.mensaje}`);
    console.error(`Error en ${context}:`, apiError);
  };

  // Tests de Auth
  const testLogin = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const result = await loginUsuario(loginForm);
      if (result.respuesta !== 1 || !result.token) {
        setError(result.mensaje || "El backend no confirmó la autenticación ni devolvió un token.");
        setResponse({
          titulo: "Login rechazado por el backend",
          datos: result,
        });
        return;
      }

      setResponse({
        titulo: "✅ Autenticación confirmada por el backend",
        datos: result,
      });
    } catch (err) {
      handleError(err, "Login");
    } finally {
      setLoading(false);
    }
  };

  // Tests de Horarios
  const testGetHorarios = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const result = await getHorarios();
      setResponse({
        titulo: "📅 Horarios",
        cantidad: result.length,
        datos: result,
      });
    } catch (err) {
      handleError(err, "Get Horarios");
    } finally {
      setLoading(false);
    }
  };

  // Tests de Núcleos
  const testGetNucleos = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const result = await getNucleos();
      setResponse({
        titulo: "🎓 Núcleos Temáticos",
        cantidad: result.length,
        datos: result,
      });
    } catch (err) {
      handleError(err, "Get Núcleos");
    } finally {
      setLoading(false);
    }
  };

  // Tests de Usuarios
  const testGetUsuario = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const id = parseInt(usuarioId);
      const result = await getUsuario(id);
      setResponse({
        titulo: "👤 Datos del Usuario",
        datos: result,
      });
    } catch (err) {
      handleError(err, "Get Usuario");
    } finally {
      setLoading(false);
    }
  };

  // Tests de Conteos
  const testContarUsuarios = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const result = await contarUsuarios();
      setResponse({
        titulo: "📊 Conteo de Usuarios",
        datos: result,
      });
    } catch (err) {
      handleError(err, "Contar Usuarios");
    } finally {
      setLoading(false);
    }
  };

  // Tests de Período
  const testGetPeriodo = async () => {
    setLoading(true);
    setError("");
    setResponse(null);
    try {
      const result = await getPeriodoMatriculaActivo();
      setResponse({
        titulo: "📚 Período de Matrícula Activo",
        datos: result,
      });
    } catch (err) {
      handleError(err, "Get Período");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            🧪 Centro de Pruebas de Servicios
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Prueba todos los servicios del backend en tiempo real
          </p>
        </div>

        {error && (
          <div className="mb-6">
            <ErrorAlert
              mensaje={error}
              tipo="error"
              onClose={() => setError("")}
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Panel de Controles */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 sticky top-8 space-y-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                🎮 Controles
              </h2>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                  🔐 Autenticación
                </h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Correo"
                    value={loginForm.correo}
                    onChange={(e) =>
                      setLoginForm({ ...loginForm, correo: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm"
                  />
                  <input
                    type="password"
                    placeholder="Contraseña"
                    value={loginForm.contrasenia}
                    onChange={(e) =>
                      setLoginForm({
                        ...loginForm,
                        contrasenia: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm"
                  />
                  <Button
                    onClick={testLogin}
                    disabled={loading}
                    className="w-full text-sm"
                  >
                    {loading ? "Probando..." : "Probar Login"}
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                  📅 Horarios
                </h3>
                <Button
                  onClick={testGetHorarios}
                  disabled={loading}
                  className="w-full text-sm"
                  variant="secondary"
                >
                  {loading ? "Cargando..." : "Obtener Horarios"}
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                  🎓 Núcleos
                </h3>
                <Button
                  onClick={testGetNucleos}
                  disabled={loading}
                  className="w-full text-sm"
                  variant="secondary"
                >
                  {loading ? "Cargando..." : "Obtener Núcleos"}
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                  👤 Usuarios
                </h3>
                <input
                  type="number"
                  placeholder="ID Usuario"
                  value={usuarioId}
                  onChange={(e) => setUsuarioId(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-sm"
                />
                <Button
                  onClick={testGetUsuario}
                  disabled={loading}
                  className="w-full text-sm"
                  variant="secondary"
                >
                  {loading ? "Cargando..." : "Obtener Usuario"}
                </Button>
                <Button
                  onClick={testContarUsuarios}
                  disabled={loading}
                  className="w-full text-sm"
                  variant="secondary"
                >
                  {loading ? "Cargando..." : "Contar Usuarios"}
                </Button>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-slate-700 dark:text-slate-300">
                  📚 Período
                </h3>
                <Button
                  onClick={testGetPeriodo}
                  disabled={loading}
                  className="w-full text-sm"
                  variant="secondary"
                >
                  {loading ? "Cargando..." : "Período Activo"}
                </Button>
              </div>
            </div>
          </div>

          {/* Panel de Respuestas */}
          <div className="lg:col-span-2">
            {response ? (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-6 space-y-4">
                <div>
                  <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {response.titulo}
                  </h2>
                  {response.cantidad && (
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Total de registros: <strong>{response.cantidad}</strong>
                    </p>
                  )}
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg overflow-auto max-h-96 border border-slate-200 dark:border-slate-700">
                  <pre className="text-xs text-slate-700 dark:text-slate-300 font-mono whitespace-pre-wrap break-words">
                    {JSON.stringify(response.datos, null, 2)}
                  </pre>
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Respuesta recibida: {new Date().toLocaleTimeString()}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700 p-12 flex items-center justify-center min-h-96">
                <div className="text-center">
                  <p className="text-slate-600 dark:text-slate-400 mb-2">
                    📤 Selecciona un servicio para ver la respuesta aquí
                  </p>
                  {loading && (
                    <div className="inline-block mt-4">
                      <div className="animate-spin">
                        <div className="h-8 w-8 border-4 border-slate-300 border-t-slate-900 dark:border-t-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-700 dark:text-blue-300">
          <strong>ℹ️ Nota:</strong> Esta página es solo para desarrollo y pruebas. 
          Se debe eliminar en producción. Consulta{" "}
          <code className="bg-white dark:bg-slate-900 px-2 py-1 rounded">
            SERVICIOS_FRONTEND.md
          </code>{" "}
          para documentación completa.
        </div>
      </div>
    </div>
  );
}
