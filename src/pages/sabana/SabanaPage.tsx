import { useEffect, useState, type ChangeEvent } from "react";
import { FileText, Info, Upload, X } from "lucide-react";

const MAX_FILE_SIZE = 15 * 1024 * 1024;

function SabanaPage() {
  const [pdf, setPdf] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [error, setError] = useState("");

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
    setPdf(selectedFile);
    setPreviewUrl(URL.createObjectURL(selectedFile));
  };

  const clearFile = () => {
    setPdf(null);
    setPreviewUrl("");
    setError("");
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d9e5dd] pb-5">
        <div>
          <p className="text-sm font-semibold uppercase text-[#40704f]">Planeación académica</p>
          <h1 className="mt-1 text-3xl font-bold text-[#0f2a1d]">Mi sábana académica</h1>
          <p className="mt-2 max-w-2xl text-sm text-[#52665a]">
            Carga tu sábana de notas en PDF para revisar el documento antes de continuar.
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
        <p>La vista previa se genera en este navegador. El PDF todavía no se envía ni se analiza porque el backend no tiene habilitado ese servicio.</p>
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