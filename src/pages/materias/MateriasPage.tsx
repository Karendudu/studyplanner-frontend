import { useEffect, useState } from "react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { getNucleos } from "../../services/backend";
import { handleApiError } from "../../services/api";
import type { NucleoTematico } from "../../services/types";

function MateriasPage() {
  const [nucleos, setNucleos] = useState<NucleoTematico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarNucleos = async () => {
      try {
        const datos = await getNucleos();
        setNucleos(datos);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.mensaje);
        console.error("Error al cargar núcleos:", apiError);
      } finally {
        setLoading(false);
      }
    };

    cargarNucleos();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Materias</h1>
        <p className="text-gray-500">Consulta cupos, semestres y disponibilidad para planificar tu horario.</p>
      </div>

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}

      {loading ? (
        <div className="grid gap-4 xl:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-40 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : nucleos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay materias disponibles</p>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {nucleos.map((nucleo) => (
            <div key={nucleo.idCodigoNucleo} className="rounded-2xl border border-[#d5dfd7] bg-white p-5 text-[#152e21] shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-[#0f2a1d]">
                    {nucleo.nombre || "Materia sin nombre"}
                  </h2>
                  <p className="text-sm text-[#5b6d60]">
                    {nucleo.idCodigoNucleo} · Programa: {nucleo.idPrograma}
                  </p>
                </div>
                <span className="rounded-full bg-[#e4f0e7] px-3 py-1 text-sm font-medium text-[#245c39]">
                  Semestre {nucleo.idUbicacionSemestral || "N/A"}
                </span>
              </div>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg bg-[#f2f7f3] p-3 text-sm text-[#344b3b]">
                  Créditos: <strong>{nucleo.creditos || "N/A"}</strong>
                </div>
                <div className="rounded-lg bg-[#f2f7f3] p-3 text-sm text-[#344b3b]">
                  Cupos: <strong>{nucleo.cupos || "N/A"}</strong>
                </div>
              </div>

              <div className="mt-4 text-sm text-[#506557]">
                Horas semanales: <strong>{nucleo.horasSemanales || "N/A"}</strong>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MateriasPage;
