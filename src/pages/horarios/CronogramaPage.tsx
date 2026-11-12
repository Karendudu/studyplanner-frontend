import { useEffect, useState, type FormEvent } from "react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { handleApiError } from "../../services/api";
import { getCronogramaPorPrograma, getMiCronograma } from "../../services/backend";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeKey(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

function formatLabel(value: string): string {
  const key = normalizeKey(value);
  const labels: Record<string, string> = {
    codigo: "Código",
    creditos: "Créditos",
    horasemanales: "Horas semanales",
    materias: "Materias",
    nucleos: "Materias",
    nucleotematicos: "Materias",
    nombre: "Nombre",
    nombreprograma: "Programa",
    programa: "Programa",
    semestre: "Semestre",
    semestres: "Semestres",
  };
  if (labels[key]) return labels[key];

  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function findField(
  record: Record<string, unknown>,
  aliases: string[]
): [string, unknown] | undefined {
  const normalizedAliases = aliases.map(normalizeKey);
  return Object.entries(record).find(([key]) => normalizedAliases.includes(normalizeKey(key)));
}

function displayScalar(value: unknown): string {
  if (typeof value !== "string" && typeof value !== "number" && typeof value !== "boolean") {
    return "—";
  }
  if (typeof value === "boolean") return value ? "Sí" : "No";
  return String(value);
}

function CronogramaValue({ value, label }: { value: unknown; label?: string }) {
  if (value === null || value === undefined) {
    return <p className="text-sm text-[#687b6e]">Sin información disponible.</p>;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return <p className="text-sm text-[#687b6e]">No hay elementos para mostrar.</p>;
    }

    return (
      <section className="space-y-3">
        {label && <h3 className="text-base font-semibold text-[#183c29]">{formatLabel(label)}</h3>}
        <div className="grid gap-3 sm:grid-cols-2">
          {value.map((item, index) => (
            <CronogramaValue
              key={index}
              value={item}
              label={isRecord(item) ? undefined : `Elemento ${index + 1}`}
            />
          ))}
        </div>
      </section>
    );
  }

  if (isRecord(value)) {
    const programName = findField(value, ["nombrePrograma", "programaNombre"]);
    const semesters = findField(value, ["semestres", "semesters"]);
    if (programName && semesters && Array.isArray(semesters[1])) {
      const programId = findField(value, ["idPrograma", "programId"]);
      return (
        <section className="space-y-5">
          <header className="rounded-xl bg-[#e8f4ec] p-5">
            <p className="text-sm font-medium text-[#52665a]">Programa académico</p>
            <div className="mt-1 flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-xl font-bold text-[#0f2a1d]">{displayScalar(programName[1])}</h3>
              {programId && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#087344]">
                  ID {displayScalar(programId[1])}
                </span>
              )}
            </div>
          </header>
          <div className="space-y-4">
            {semesters[1].length > 0 ? (
              semesters[1].map((semester, index) => (
                <CronogramaValue
                  key={index}
                  value={semester}
                  label={`Semestre ${index + 1}`}
                />
              ))
            ) : (
              <p className="rounded-lg bg-[#f3f7f4] p-4 text-sm text-[#52665a]">
                Este programa todavía no tiene semestres registrados.
              </p>
            )}
          </div>
        </section>
      );
    }

    const semesterName = findField(value, ["semestre", "nombreSemestre"]);
    const subjects = findField(value, ["materias", "nucleos", "nucleosTematicos"]);
    if (semesterName && subjects && Array.isArray(subjects[1])) {
      const semesterId = findField(value, ["idUbicacion", "idSemestre"]);
      const totalCredits = findField(value, ["creditosTotales", "totalCreditos"]);
      return (
        <section className="space-y-4 rounded-xl border border-[#d5dfd7] bg-[#fbfdfb] p-4 sm:p-5">
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e2ebe4] pb-3">
            <div>
              <h4 className="text-lg font-bold text-[#0f2a1d]">{displayScalar(semesterName[1])}</h4>
              {semesterId && (
                <p className="mt-1 text-xs text-[#687b6e]">Semestre {displayScalar(semesterId[1])}</p>
              )}
            </div>
            {totalCredits && (
              <span className="rounded-full bg-[#e5f4ed] px-3 py-1.5 text-sm font-semibold text-[#087344]">
                {displayScalar(totalCredits[1])} créditos totales
              </span>
            )}
          </header>
          {subjects[1].length > 0 ? (
            <CronogramaValue value={subjects[1]} label="Materias" />
          ) : (
            <p className="text-sm text-[#687b6e]">No hay materias registradas para este semestre.</p>
          )}
        </section>
      );
    }

    const name = findField(value, ["nombre", "name", "materia", "asignatura"]);
    const code = findField(value, ["codigo", "code"]);
    const credits = findField(value, ["creditos", "credits"]);
    const weeklyHours = findField(value, ["horasSemanales", "weeklyHours"]);
    const displayedFields = new Set(
      [name, code, credits, weeklyHours]
        .filter((field): field is [string, unknown] => Boolean(field))
        .map(([key]) => key)
    );
    const scalarFields = Object.entries(value).filter(
      ([key, fieldValue]) =>
        !displayedFields.has(key) &&
        (typeof fieldValue === "string" ||
          typeof fieldValue === "number" ||
          typeof fieldValue === "boolean")
    );
    const nestedFields = Object.entries(value).filter(
      ([, fieldValue]) =>
        fieldValue !== null &&
        typeof fieldValue === "object"
    );

    return (
      <article className="space-y-3 rounded-xl border border-[#dce7df] bg-white p-4 shadow-sm">
        {name && code ? (
          <div className="flex flex-wrap items-start justify-between gap-2">
            <h4 className="font-semibold leading-snug text-[#0f2a1d]">{displayScalar(name[1])}</h4>
            <span className="rounded-full bg-[#e5f4ed] px-3 py-1 text-xs font-semibold text-[#087344]">
              {displayScalar(code[1])}
            </span>
          </div>
        ) : label ? (
          <h4 className="font-semibold text-[#183c29]">{formatLabel(label)}</h4>
        ) : null}

        {(credits || weeklyHours || scalarFields.length > 0) && (
          <dl className="grid gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
            {credits && (
              <div>
                <dt className="text-xs text-[#687b6e]">Créditos</dt>
                <dd className="font-medium text-[#304b39]">{displayScalar(credits[1])}</dd>
              </div>
            )}
            {weeklyHours && (
              <div>
                <dt className="text-xs text-[#687b6e]">Horas semanales</dt>
                <dd className="font-medium text-[#304b39]">{displayScalar(weeklyHours[1])}</dd>
              </div>
            )}
            {scalarFields.map(([key, fieldValue]) => (
              <div key={key}>
                <dt className="text-xs text-[#687b6e]">{formatLabel(key)}</dt>
                <dd className="font-medium text-[#304b39]">{displayScalar(fieldValue)}</dd>
              </div>
            ))}
          </dl>
        )}

        {nestedFields.map(([key, fieldValue]) => (
          <CronogramaValue key={key} value={fieldValue} label={key} />
        ))}
      </article>
    );
  }

  return (
    <p className="text-sm text-[#304b39]">
      {label ? <span className="font-medium">{formatLabel(label)}: </span> : null}
      {displayScalar(value)}
    </p>
  );
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
          <CronogramaValue value={miCronograma} label="Cronograma" />
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
          <CronogramaValue value={cronogramaPrograma} label="Cronograma" />
        )}
      </section>
    </section>
  );
}

export default CronogramaPage;
