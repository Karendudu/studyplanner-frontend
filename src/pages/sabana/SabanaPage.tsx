import { Fragment, useEffect, useState, type ChangeEvent } from "react";
import { FileText, Info, Upload, X } from "lucide-react";
import { Link } from "react-router-dom";
import { handleApiError } from "../../services/api";
import { subirSabana } from "../../services/backend";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

interface MateriaProcesada {
  periodo?: string;
  codigo: string;
  nombre: string;
  nota: number;
  estado: boolean;
  tipo: string;
  creditos?: number;
  ponderacion?: number;
  componentes?: ComponenteProcesado[];
}

interface ComponenteProcesado {
  codigo: string;
  nombre: string;
  nota: number;
  estado: boolean;
  tipo: string;
}

interface ResumenSabana {
  total_nucleos_unicos?: number;
  aprobados?: number;
  no_aprobados?: number;
  diagnosticos?: number;
  profundizaciones?: number;
  componentes_banco?: number;
  creditos_registrados?: number;
}

interface SabanaProcesada {
  materias: MateriaProcesada[];
  resumen: ResumenSabana;
}

interface ResumenCargaSabana {
  mensaje?: string;
  estudiante: {
    cedula: string;
    nombre: string;
    semestre_actual: number;
  };
  materiasEncontradas: number;
  materiasGuardadas: number;
  materiasSinNucleo: number;
  materiasOmitidas: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getResumenCarga(value: unknown): ResumenCargaSabana | null {
  let parsed = value;
  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed) as unknown;
    } catch {
      return null;
    }
  }

  if (!isRecord(parsed) || !isRecord(parsed.estudiante)) return null;
  const student = parsed.estudiante;
  const counts = [
    parsed.materiasEncontradas,
    parsed.materiasGuardadas,
    parsed.materiasSinNucleo,
    parsed.materiasOmitidas,
  ];
  if (
    typeof student.cedula !== "string"
    || typeof student.nombre !== "string"
    || typeof student.semestre_actual !== "number"
    || !counts.every((count) => typeof count === "number")
  ) return null;

  return parsed as unknown as ResumenCargaSabana;
}

function isMateriaProcesada(value: unknown): value is MateriaProcesada {
  return isRecord(value)
    && typeof value.codigo === "string"
    && typeof value.nombre === "string"
    && typeof value.nota === "number"
    && typeof value.estado === "boolean"
    && typeof value.tipo === "string";
}

function getSabanaProcesada(value: unknown): SabanaProcesada | null {
  let root = value;
  if (typeof root === "string") {
    try {
      root = JSON.parse(root) as unknown;
    } catch {
      return null;
    }
  }

  const pending: unknown[] = [root];
  const visited = new Set<object>();
  while (pending.length > 0) {
    const current = pending.shift();
    if (!isRecord(current) || visited.has(current)) continue;
    visited.add(current);

    const resumen = current.resumen;
    const materias = Object.values(current).find(
      (entry) => Array.isArray(entry) && entry.some(isMateriaProcesada)
    );
    if (isRecord(resumen) && Array.isArray(materias)) {
      return {
        resumen: resumen as ResumenSabana,
        materias: materias.filter(isMateriaProcesada),
      };
    }

    pending.push(...Object.values(current));
  }

  return null;
}

function formatNota(nota: number) {
  const value = nota > 10 ? nota / 10 : nota;
  return value.toLocaleString("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

function agruparPorPeriodo(materias: MateriaProcesada[]) {
  const grupos = new Map<string, MateriaProcesada[]>();
  materias.forEach((materia) => {
    const periodo = materia.periodo || "Período no informado";
    grupos.set(periodo, [...(grupos.get(periodo) || []), materia]);
  });
  return Array.from(grupos, ([periodo, asignaturas]) => ({ periodo, asignaturas }));
}

function SabanaPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const uploadSummary = uploaded ? getResumenCarga(result) : null;
  const parsedResult = uploaded ? getSabanaProcesada(result) : null;

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    event.currentTarget.value = "";
    if (!selectedFile) return;

    const hasPdfType = selectedFile.type === "application/pdf";
    const hasPdfExtension = selectedFile.name.toLowerCase().endsWith(".pdf");

    if ((!hasPdfType && !(selectedFile.type === "" && hasPdfExtension)) || !hasPdfExtension) {
      setError("Selecciona un archivo PDF válido.");
      setPdf(null);
      setPreviewUrl("");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("El archivo supera el límite de 15 MB.");
      setPdf(null);
      setPreviewUrl("");
      return;
    }

    setError("");
    setResult(null);
    setUploaded(false);
    setPdf(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const clearFile = () => {
    setPdf(null);
    setPreviewUrl("");
    setError("");
    setResult(null);
    setUploaded(false);
  };

  const handleUpload = async () => {
    if (!pdf) return;
    setUploading(true);
    setError("");
    setResult(null);
    setUploaded(false);
    try {
      setResult(await subirSabana(pdf));
      setUploaded(true);
    } catch (uploadError) {
      setError(handleApiError(uploadError).mensaje);
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d9e5dd] pb-5">
        <div>
          <p className="text-sm font-semibold uppercase text-[#40704f]">Planeación académica</p>
          <h1 className="mt-1 text-3xl font-bold text-[#0f2a1d]">Mi sábana académica</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#52665a]">
            Carga tu sábana de notas en PDF para que el sistema la procese.
          </p>
        </div>
        {pdf && (
          <button
            type="button"
            onClick={clearFile}
            className="inline-flex items-center gap-2 rounded-md border border-[#cbd9cf] px-3 py-2 text-sm font-medium text-[#315641] hover:bg-[#f1f7f3]"
          >
            <X size={16} /> Quitar archivo
          </button>
        )}
      </header>

      <div className="flex items-start gap-3 border-l-4 border-[#00a99d] bg-[#eff9f7] px-4 py-3 text-sm text-[#285b57]">
        <Info size={18} className="mt-0.5 shrink-0" />
        <p>El PDF se enviará al backend para su procesamiento. La vista previa se genera en este navegador.</p>
      </div>

      <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center gap-3 border-2 border-dashed border-[#9bb8a3] bg-[#f7faf7] px-5 py-8 text-center transition hover:border-[#34764b] hover:bg-[#f1f7f3]">
        <span className="grid size-11 place-items-center rounded-full bg-[#e4f0e7] text-[#28613c]">
          {pdf ? <FileText size={22} /> : <Upload size={22} />}
        </span>
        <span className="font-semibold text-[#193b28]">{pdf ? pdf.name : "Seleccionar sábana en PDF"}</span>
        <span className="text-sm text-[#63766a]">PDF · máximo 15 MB</span>
        <input
          type="file"
          accept="application/pdf,.pdf"
          onChange={handleFileChange}
          className="sr-only"
        />
      </label>

      {error && <p role="alert" className="text-sm font-medium text-[#b42318]">{error}</p>}

      {pdf && (
        <button
          type="button"
          onClick={() => void handleUpload()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-md bg-[#087344] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#075d38] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Upload size={17} /> {uploading ? "Procesando..." : "Enviar sábana"}
        </button>
      )}

      {uploaded && uploadSummary && (
        <section className="space-y-4 border border-[#b8d7c3] bg-[#f1f8f3] p-5" aria-live="polite">
          <header className="border-b border-[#d5dfd7] pb-3">
            <h2 className="text-xl font-semibold text-[#155b37]">Sábana procesada correctamente</h2>
            <p className="mt-1 text-sm text-[#315641]">
              {uploadSummary.estudiante.nombre} · Semestre actual {uploadSummary.estudiante.semestre_actual}
            </p>
            {uploadSummary.mensaje && <p className="mt-1 text-sm text-[#52665a]">{uploadSummary.mensaje}</p>}
          </header>
          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {([
              ["Materias encontradas", uploadSummary.materiasEncontradas],
              ["Materias guardadas", uploadSummary.materiasGuardadas],
              ["Sin núcleo asociado", uploadSummary.materiasSinNucleo],
              ["Omitidas", uploadSummary.materiasOmitidas],
            ] as const).map(([label, count]) => (
              <div key={label} className="border border-[#d5dfd7] bg-white px-4 py-3">
                <dt className="text-xs font-medium text-[#63766a]">{label}</dt>
                <dd className="mt-1 text-xl font-semibold text-[#155b37]">{count}</dd>
              </div>
            ))}
          </dl>
          <Link to="/dashboard/materias" className="inline-flex rounded-md bg-[#087344] px-4 py-2 text-sm font-semibold text-white hover:bg-[#075d38]">
            Consultar núcleos vistos
          </Link>
        </section>
      )}

      {uploaded && !uploadSummary && (
        parsedResult ? (
          <section className="space-y-5" aria-live="polite">
            <header className="border-b border-[#d5dfd7] pb-3">
              <h2 className="text-xl font-semibold text-[#0f2a1d]">Historial académico procesado</h2>
              <p className="mt-1 text-sm text-[#52665a]">{parsedResult.materias.length} registros académicos encontrados.</p>
            </header>

            <section aria-label="Resumen académico" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {([
                ["Núcleos únicos", parsedResult.resumen.total_nucleos_unicos],
                ["Aprobados", parsedResult.resumen.aprobados],
                ["No aprobados", parsedResult.resumen.no_aprobados],
                ["Diagnósticos", parsedResult.resumen.diagnosticos],
                ["Profundizaciones", parsedResult.resumen.profundizaciones],
                ["Componentes", parsedResult.resumen.componentes_banco],
                ["Créditos registrados", parsedResult.resumen.creditos_registrados],
              ] as const).filter(([, value]) => typeof value === "number").map(([label, value]) => (
                <div key={label} className="border border-[#d5dfd7] bg-white px-4 py-3">
                  <p className="text-xs font-medium text-[#63766a]">{label}</p>
                  <p className="mt-1 text-xl font-semibold text-[#155b37]">{value}</p>
                </div>
              ))}
            </section>

            <div className="space-y-5">
              {agruparPorPeriodo(parsedResult.materias).map(({ periodo, asignaturas }) => (
                <section key={periodo} className="overflow-hidden border border-[#d5dfd7] bg-white">
                  <h3 className="border-b border-[#d5dfd7] bg-[#edf5ef] px-4 py-3 font-semibold text-[#183c29]">{periodo}</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-left text-sm">
                      <thead className="bg-[#f7faf7] text-[#52665a]">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Código</th>
                          <th className="px-4 py-3 font-semibold">Campo de aprendizaje</th>
                          <th className="px-4 py-3 font-semibold">Tipo</th>
                          <th className="px-4 py-3 text-right font-semibold">Nota</th>
                          <th className="px-4 py-3 text-right font-semibold">Créditos / ponderación</th>
                          <th className="px-4 py-3 font-semibold">Estado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {asignaturas.map((materia, index) => (
                          <Fragment key={`${materia.codigo}-${index}`}>
                            <tr className="border-t border-[#edf2ee]">
                              <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{materia.codigo}</td>
                              <td className="px-4 py-3 font-medium text-[#183c29]">{materia.nombre}</td>
                              <td className="px-4 py-3">{materia.tipo}</td>
                              <td className="px-4 py-3 text-right tabular-nums">{formatNota(materia.nota)}</td>
                              <td className="px-4 py-3 text-right tabular-nums">{materia.creditos ?? materia.ponderacion ?? "—"}</td>
                              <td className="px-4 py-3">
                                <span className={materia.estado ? "font-medium text-[#087344]" : "font-medium text-[#b42318]"}>
                                  {materia.estado ? "Aprobada" : "No aprobada"}
                                </span>
                              </td>
                            </tr>
                            {materia.componentes?.map((componente) => (
                              <tr key={`${materia.codigo}-${componente.codigo}`} className="border-t border-[#edf2ee] bg-[#f7faf7] text-[#52665a]">
                                <td className="whitespace-nowrap px-4 py-2 pl-8 font-mono text-xs">{componente.codigo}</td>
                                <td className="px-4 py-2">{componente.nombre}</td>
                                <td className="px-4 py-2">Componente</td>
                                <td className="px-4 py-2 text-right tabular-nums">{formatNota(componente.nota)}</td>
                                <td className="px-4 py-2 text-right">—</td>
                                <td className="px-4 py-2">{componente.estado ? "Aprobada" : "No aprobada"}</td>
                              </tr>
                            ))}
                          </Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              ))}
            </div>
          </section>
        ) : (
          <section className="border border-[#b8d7c3] bg-[#f1f8f3] p-4" aria-live="polite">
            <h2 className="font-semibold text-[#155b37]">Sábana procesada</h2>
            <p className="mt-1 text-sm text-[#315641]">El backend respondió, pero la estructura no coincide con los datos académicos esperados.</p>
            <details className="mt-3">
              <summary className="cursor-pointer text-sm font-medium text-[#315641]">Ver respuesta técnica</summary>
              <pre className="mt-2 max-h-80 overflow-auto bg-white p-4 text-sm text-[#183c29]">
                {typeof result === "string" ? result : JSON.stringify(result, null, 2) ?? "Procesamiento completado."}
              </pre>
            </details>
          </section>
        )
      )}

      {previewUrl && (
        <section aria-label="Vista previa del PDF" className="overflow-hidden border border-[#d4e0d7] bg-white">
          <div className="flex items-center gap-2 border-b border-[#d4e0d7] px-4 py-3 text-sm font-semibold text-[#284b35]">
            <FileText size={17} /> Vista previa
          </div>
          <iframe
            title={`Vista previa de ${pdf?.name ?? "la sábana académica"}`}
            src={previewUrl}
            className="h-[68vh] min-h-[420px] w-full"
          />
        </section>
      )}
    </section>
  );
}

export default SabanaPage;