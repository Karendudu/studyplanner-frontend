import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { handleApiError } from "../../services/api";
import { generarHorarios } from "../../services/backend";

function GenerarHorariosPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<unknown>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const data = await generarHorarios();
      setResult(data);
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 text-[#152e21]">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#d5dfd7] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#0f2a1d]">Generar horarios</h1>
          <p className="mt-2 text-[#506557]">Ejecuta la generación automática de horarios según la lógica de reglas.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/horarios")}
          className="rounded-lg border border-[#a8bdae] bg-white px-4 py-2.5 font-semibold text-[#183c29] hover:bg-[#edf5ef]"
        >
          Volver a horarios
        </button>
      </header>

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}

      <div className="border border-[#d5dfd7] bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-[#0f2a1d]">Generación automática</h2>
            <p className="mt-1 text-sm text-[#506557]">El backend construye los horarios según las reglas de matrícula configuradas.</p>
          </div>
          <button
            type="button"
            onClick={() => void handleGenerate()}
            disabled={loading}
            className="rounded-lg bg-[#087344] px-4 py-2.5 font-semibold text-white hover:bg-[#075d38] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Generando..." : "Generar horarios"}
          </button>
        </div>

        <div className="mt-6">
          {result === null ? (
            <p className="text-sm text-[#506557]">Aún no se ha generado ninguna respuesta del backend.</p>
          ) : (
            <pre className="max-h-[70vh] overflow-auto rounded-xl bg-[#f3f7f4] p-4 text-sm text-[#183c29]">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </section>
  );
}

export default GenerarHorariosPage;
