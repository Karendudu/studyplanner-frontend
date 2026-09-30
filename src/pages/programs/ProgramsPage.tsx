import { useEffect, useState } from "react";
import { getNucleos } from "../../services/backend";
import { handleApiError } from "../../services/api";
import type { NucleoTematico } from "../../services/types";

function ProgramsPage() {
  const [nucleos, setNucleos] = useState<NucleoTematico[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getNucleos()
      .then((data) => {
        if (!cancelled) setNucleos(data);
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(handleApiError(requestError).mensaje);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-[#00482B]">Núcleos y materias</h1>
        <p className="text-gray-500">Materias disponibles agrupadas por el programa reportado por el backend.</p>
      </div>

      {error && <p role="alert" className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      {loading ? (
        <p className="text-sm text-gray-500">Cargando materias...</p>
      ) : nucleos.length === 0 && !error ? (
        <p className="border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600">El backend no devolvió materias para mostrar.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {nucleos.map((nucleo, index) => (
          <div key={nucleo.idCodigoNucleo || `${nucleo.idPrograma ?? "programa"}-${index}`} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[#00482B]">{nucleo.nombre || "Materia sin nombre"}</h2>
              <span className="rounded-full bg-green-100 px-3 py-1 text-sm text-[#007B3E]">{nucleo.idCodigoNucleo || "Sin código"}</span>
            </div>
            <p className="mt-3 text-sm text-gray-600">Programa: {nucleo.idProgramaNavigation?.nombrePrograma || "No informado"}</p>
            <p className="text-sm text-gray-600">Créditos: {nucleo.creditos ?? "No informado"}</p>
            <p className="text-sm text-gray-600">Semestre: {nucleo.idUbicacionSemestralNavigation?.ubicacion || "No informado"}</p>
            <p className="text-sm text-gray-600">Cupos disponibles: {nucleo.cupos ?? "No informado"}</p>
          </div>
        ))}
        </div>
      )}
    </div>
  );
}

export default ProgramsPage;
