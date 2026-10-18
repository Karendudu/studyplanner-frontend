import { useEffect, useState, type FormEvent } from "react";
import { Plus, Pencil, Megaphone } from "lucide-react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import Modal from "../../components/ui/Modal";
import { useAuth } from "../../context/authState";
import { handleApiError } from "../../services/api";
import {
  crearAvisoInformativo,
  editarAvisoInformativo,
  getAvisoInformativo,
  getAvisosInformativos,
} from "../../services/backend";
import type { AvisoInformativo } from "../../services/types";

interface AvisoForm {
  tipoAviso: string;
  informacion: string;
}

const emptyForm: AvisoForm = { tipoAviso: "General", informacion: "" };

function AvisosPage() {
  const { user } = useAuth();
  const canManage = user?.role === "udec";
  const [avisos, setAvisos] = useState<AvisoInformativo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<AvisoInformativo | null>(null);
  const [selected, setSelected] = useState<AvisoInformativo | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [form, setForm] = useState<AvisoForm>(emptyForm);

  const loadAvisos = async () => {
    setLoading(true);
    setError("");
    try {
      setAvisos(await getAvisosInformativos());
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let cancelled = false;
    getAvisosInformativos()
      .then((data) => {
        if (!cancelled) setAvisos(data);
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

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = async (aviso: AvisoInformativo) => {
    if (!aviso.idPasarela) return;
    setError("");
    setSaving(true);
    try {
      const full = await getAvisoInformativo(aviso.idPasarela);
      setEditing(full);
      setForm({ tipoAviso: full.tipoAviso || "General", informacion: full.informacion || "" });
      setFormOpen(true);
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  const openDetail = async (aviso: AvisoInformativo) => {
    if (!aviso.idPasarela) {
      setSelected(aviso);
      return;
    }
    setLoadingDetail(true);
    setError("");
    try {
      setSelected(await getAvisoInformativo(aviso.idPasarela));
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setLoadingDetail(false);
    }
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) return;
    setSaving(true);
    setError("");
    setSuccess("");
    const payload = {
      idUsuario: user.id,
      tipoAviso: form.tipoAviso.trim(),
      informacion: form.informacion.trim(),
    };
    try {
      if (editing?.idPasarela) await editarAvisoInformativo(editing.idPasarela, payload);
      else await crearAvisoInformativo(payload);
      await loadAvisos();
      setFormOpen(false);
      setEditing(null);
      setSuccess(editing?.idPasarela ? "Aviso actualizado correctamente." : "Aviso publicado correctamente.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="space-y-6 text-[#152e21]">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d5dfd7] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#0f2a1d]">Avisos</h1>
          <p className="mt-2 text-[#506557]">Comunicados institucionales para la comunidad académica.</p>
        </div>
        {canManage && (
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-md bg-[#087344] px-4 py-2.5 font-semibold text-white hover:bg-[#075d38]">
            <Plus size={18} /> Crear aviso
          </button>
        )}
      </header>

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}
      {success && <ErrorAlert mensaje={success} tipo="success" autoDismiss={5000} onClose={() => setSuccess("")} />}

      {loading ? (
        <p role="status" className="text-sm text-[#506557]">Cargando avisos...</p>
      ) : avisos.length === 0 ? (
        <p className="border border-[#d5dfd7] bg-white px-4 py-3 text-sm text-[#506557]">No hay avisos publicados.</p>
      ) : (
        <div className="space-y-3">
          {avisos.map((aviso, index) => (
            <article key={aviso.idPasarela ?? index} className="border border-[#d5dfd7] bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex min-w-0 gap-3">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center bg-[#e4f0e7] text-[#28613c]">
                    <Megaphone size={18} />
                  </span>
                  <div className="min-w-0">
                    <h2 className="font-semibold text-[#0f2a1d]">{aviso.tipoAviso || "Aviso institucional"}</h2>
                    <p className="mt-1 whitespace-pre-wrap text-sm text-[#42594b]">{aviso.informacion || "Sin contenido."}</p>
                  </div>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button type="button" onClick={() => void openDetail(aviso)} className="rounded-md border border-[#bac9bd] px-3 py-1.5 text-sm font-medium text-[#294535] hover:bg-[#f1f7f3]">
                    {loadingDetail ? "Cargando..." : "Detalle"}
                  </button>
                  {canManage && (
                    <button type="button" disabled={saving} onClick={() => void openEdit(aviso)} title="Editar aviso" className="rounded-md border border-[#bac9bd] p-2 text-[#294535] hover:bg-[#f1f7f3] disabled:opacity-60">
                      <Pencil size={17} />
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Editar aviso" : "Crear aviso"}>
        <form className="space-y-4" onSubmit={(event) => void submitForm(event)}>
          <label className="block text-sm font-medium text-[#294535]">
            Tipo de aviso
            <input required maxLength={100} value={form.tipoAviso} onChange={(event) => setForm({ ...form, tipoAviso: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" />
          </label>
          <label className="block text-sm font-medium text-[#294535]">
            Información
            <textarea required rows={6} maxLength={4000} value={form.informacion} onChange={(event) => setForm({ ...form, informacion: event.target.value })} className="mt-1 w-full resize-y rounded-md border border-[#cbd9ce] p-2.5 text-black" />
          </label>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-[#bac9bd] px-4 py-2 text-[#294535]">Cancelar</button>
            <button type="submit" disabled={saving} className="rounded-md bg-[#087344] px-4 py-2 font-semibold text-white disabled:opacity-60">
              {saving ? "Guardando..." : editing ? "Guardar cambios" : "Publicar aviso"}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={Boolean(selected)} onClose={() => setSelected(null)} title={selected?.tipoAviso || "Detalle del aviso"}>
        {selected && <p className="whitespace-pre-wrap text-sm leading-6 text-[#344b3b]">{selected.informacion || "Sin contenido."}</p>}
      </Modal>
    </section>
  );
}

export default AvisosPage;
