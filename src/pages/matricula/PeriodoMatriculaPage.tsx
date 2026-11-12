import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { handleApiError } from "../../services/api";
import { editarPeriodoMatricula, getPeriodoMatriculaActivo } from "../../services/backend";
import type { PeriodoMatricula, ReqEditarPeriodoMatricula } from "../../services/types";

function PeriodoMatriculaPage() {
  const navigate = useNavigate();
  const [periodo, setPeriodo] = useState<PeriodoMatricula | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({
    nombre: "",
    fechaInicioRegistro: "",
    fechaFinRegistro: "",
    periodoAcademico: "",
    activo: true,
  });

  useEffect(() => {
    let cancelled = false;

    getPeriodoMatriculaActivo()
      .then((data) => {
        if (cancelled) return;
        setPeriodo(data);
        setForm({
          nombre: data.nombre || "",
          fechaInicioRegistro: data.fechaInicioRegistro || data.fechaInicio || "",
          fechaFinRegistro: data.fechaFinRegistro || data.fechaFin || "",
          periodoAcademico: data.periodoAcademico || "",
          activo: Boolean(data.activo ?? data.estado ?? true),
        });
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

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!periodo?.idPeriodoMatricula) {
      setError("No hay un período de matrícula activo para editar.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const payload: ReqEditarPeriodoMatricula = {
      nombre: form.nombre.trim(),
      fechaInicioRegistro: form.fechaInicioRegistro,
      fechaFinRegistro: form.fechaFinRegistro,
      periodoAcademico: form.periodoAcademico.trim(),
      activo: form.activo,
    };

    try {
      const updated = await editarPeriodoMatricula(periodo.idPeriodoMatricula, payload);
      setPeriodo(updated);
      setSuccess("Período de matrícula actualizado correctamente.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6 text-[#152e21]">
      <header className="flex items-center justify-between gap-4 border-b border-[#d5dfd7] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#0f2a1d]">Período de matrícula</h1>
          <p className="mt-2 text-[#506557]">Administra la vigencia del período académico actual.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/matricula")}
          className="rounded-lg border border-[#a8bdae] bg-white px-4 py-2.5 font-semibold text-[#183c29] hover:bg-[#edf5ef]"
        >
          Volver a matrícula
        </button>
      </header>

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}
      {success && <ErrorAlert mensaje={success} tipo="success" autoDismiss={5000} onClose={() => setSuccess("")} />}

      {loading ? (
        <p className="text-sm text-[#506557]">Cargando período...</p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 border border-[#d5dfd7] bg-white p-5 sm:p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold text-[#294535]">
              Nombre del período
              <input
                value={form.nombre}
                onChange={(event) => setForm((current) => ({ ...current, nombre: event.target.value }))}
                className="mt-2 w-full rounded-md border border-[#cbd9ce] p-3 text-black outline-none focus:border-[#56a875]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#294535]">
              Período académico
              <input
                value={form.periodoAcademico}
                onChange={(event) => setForm((current) => ({ ...current, periodoAcademico: event.target.value }))}
                className="mt-2 w-full rounded-md border border-[#cbd9ce] p-3 text-black outline-none focus:border-[#56a875]"
                required
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-semibold text-[#294535]">
              Fecha de inicio de registro
              <input
                type="date"
                value={form.fechaInicioRegistro}
                onChange={(event) => setForm((current) => ({ ...current, fechaInicioRegistro: event.target.value }))}
                className="mt-2 w-full rounded-md border border-[#cbd9ce] p-3 text-black outline-none focus:border-[#56a875]"
                required
              />
            </label>

            <label className="block text-sm font-semibold text-[#294535]">
              Fecha fin de registro
              <input
                type="date"
                value={form.fechaFinRegistro}
                onChange={(event) => setForm((current) => ({ ...current, fechaFinRegistro: event.target.value }))}
                className="mt-2 w-full rounded-md border border-[#cbd9ce] p-3 text-black outline-none focus:border-[#56a875]"
                required
              />
            </label>
          </div>

          <label className="flex items-center gap-3 text-sm font-semibold text-[#294535]">
            <input
              type="checkbox"
              checked={form.activo}
              onChange={(event) => setForm((current) => ({ ...current, activo: event.target.checked }))}
              className="h-4 w-4 rounded border-[#cbd9ce] accent-[#087344]"
            />
            Período activo
          </label>

          <div className="flex justify-end border-t border-[#edf2ee] pt-4">
            <button
              type="submit"
              disabled={saving || !periodo?.idPeriodoMatricula}
              className="rounded-md bg-[#087344] px-5 py-2.5 font-semibold text-white hover:bg-[#075d38] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default PeriodoMatriculaPage;
