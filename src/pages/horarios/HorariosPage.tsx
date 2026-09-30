import { useEffect, useState } from "react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { getHorarios } from "../../services/backend";
import { handleApiError } from "../../services/api";
import type { Horario } from "../../services/types";

function HorariosPage() {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHorarios = async () => {
      try {
        const datos = await getHorarios();
        setHorarios(datos);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.mensaje);
        console.error("Error al cargar horarios:", apiError);
      } finally {
        setLoading(false);
      }
    };

    cargarHorarios();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Horarios</h1>
        <p className="text-gray-500">Ve la disponibilidad de grupos y crea tu esquema de horario.</p>
      </div>

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : horarios.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay horarios disponibles</p>
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {horarios.map((horario) => (
            <div key={horario.idHorario} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:bg-slate-900 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[#00482B] dark:text-white">
                  Horario #{horario.idHorario}
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {horario.idUsuario ? `Usuario: ${horario.idUsuario}` : "Sin asignar"}
                </span>
              </div>

              <div className="mt-4 grid gap-2 text-sm text-gray-700 dark:text-gray-300">
                <p><strong>Total Créditos:</strong> {horario.totalCreditos || "N/A"}</p>
                <p><strong>Horas Semanales:</strong> {horario.totalHorasSemanales || "N/A"}</p>
                <p><strong>Núcleo Horario:</strong> {horario.idNucleoHorario || "No asignado"}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default HorariosPage;
