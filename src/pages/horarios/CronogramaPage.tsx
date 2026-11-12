import { useEffect, useState, type FormEvent } from "react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { handleApiError } from "../../services/api";
import { getCronogramaPorPrograma, getMiCronograma } from "../../services/backend";

function formatResponse(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value, null, 2) ?? String(value);
}

function CronogramaPage() {
  const [miCronograma, setMiCronograma] = useState<unknown>(null);
  const [miCronogramaLoaded, setMiCronogramaLoaded] = useState(false);
  const [miCronogramaLoading, setMiCronogramaLoading] = useState(true);
  const [miCronogramaError, setMiCronogramaError] = useState("");
  const [idPrograma, setIdPrograma] = useState("");
  const [cronogramaPrograma, setCronogramaPrograma] = useState<unknown>(null);
  const [cronogramaProgramaLoaded, setCronogramaProgramaLoaded] = useState(false);
  const [cronogramaProgramaLoading, setCronogramaProgramaLoading] = useState(false);
  const [cronogramaProgramaError, setCronogramaProgramaError] = useState("");

  useEffect(() => {
    let cancelled = false;

    getMiCronograma()
      .then((data) => {
        if (!cancelled) {
          setMiCronograma(data);
          setMiCronogramaLoaded(true);
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) setMiCronogramaError(handleApiError(error).mensaje);
      })
      .finally(() => {
        if (!cancelled) setMiCronogramaLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const consultarPorPrograma = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const parsedId = Number(idPrograma);
    if (!Number.isInteger(parsedId) || parsedId < 1 || parsedId > 2147483647) {
      setCronogramaProgramaError("Ingresa un ID de programa válido.");
      setCronogramaProgramaLoaded(false);
      return;
    }

    setCronogramaProgramaLoading(true);
    setCronogramaProgramaError("");
    setCronogramaProgramaLoaded(false);

    try {
      const data = await getCronogramaPorPrograma(parsedId);
      setCronogramaPrograma(data);
      setCronogramaProgramaLoaded(true);
    } catch (error: unknown) {
      setCronogramaProgramaError(handleApiError(error).mensaje);
    } finally {
      setCronogramaProgramaLoading(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 text-[#152e21]">
      <header className="border-b border-[#d5dfd7] pb-5">
        <h1 className="text-3xl font-bold text-[#0f2a1d]">Cronograma académico</h1>
        <p className="mt-2 text-[#506557]">
          Consulta el cronograma de tu programa o busca el de otro programa por su ID.
        </p>
      </header>

      <section className="space-y-4 rounded-xl border border-[#d5dfd7] bg-white p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#0f2a1d]">Mi programa</h2>
          <p className="mt-1 text-sm text-[#506557]">Cronograma asociado a tu usuario.</p>
        </div>

        {miCronogramaError && (
          <ErrorAlert
            mensaje={miCronogramaError}
            tipo="error"
            onClose={() => setMiCronogramaError("")}
          />
        )}
        {miCronogramaLoading ? (
          <p className="text-sm text-[#506557]" role="status">Cargando cronograma...</p>
        ) : miCronogramaLoaded ? (
          <pre className="max-h-[60vh] overflow-auto rounded-lg bg-[#f3f7f4] p-4 text-sm text-[#183c29]">
            {formatResponse(miCronograma)}
          </pre>
        ) : null}
      </section>

      <section className="space-y-4 rounded-xl border border-[#d5dfd7] bg-white p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-semibold text-[#0f2a1d]">Consultar por programa</h2>
          <p className="mt-1 text-sm text-[#506557]">Ingresa el ID numérico del programa.</p>
        </div>

        <form onSubmit={(event) => void consultarPorPrograma(event)} className="flex flex-wrap items-end gap-3">
          <label className="flex min-w-56 flex-col gap-1 text-sm font-medium text-[#183c29]">
            ID del programa
            <input
              type="number"
              min="1"
              max="2147483647"
              step="1"
              value={idPrograma}
              onChange={(event) => setIdPrograma(event.target.value)}
              className="rounded-lg border border-[#a8bdae] px-3 py-2.5"
              required
            />
          </label>
          <button
            type="submit"
            disabled={cronogramaProgramaLoading}
            className="rounded-lg bg-[#087344] px-4 py-2.5 font-semibold text-white hover:bg-[#075d38] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {cronogramaProgramaLoading ? "Consultando..." : "Consultar"}
          </button>
        </form>

        {cronogramaProgramaError && (
          <ErrorAlert
            mensaje={cronogramaProgramaError}
            tipo="error"
            onClose={() => setCronogramaProgramaError("")}
          />
        )}
        {cronogramaProgramaLoaded && (
          <pre className="max-h-[60vh] overflow-auto rounded-lg bg-[#f3f7f4] p-4 text-sm text-[#183c29]">
            {formatResponse(cronogramaPrograma)}
          </pre>
        )}
      </section>
    </section>
  );
}

export default CronogramaPage;
