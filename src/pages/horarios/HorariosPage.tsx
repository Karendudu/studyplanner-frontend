import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Eye, Mail, Pencil, Plus, Trash2 } from "lucide-react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import Modal from "../../components/ui/Modal";
import { handleApiError } from "../../services/api";
import {
  crearHorario,
  editarHorario,
  eliminarHorario,
  enviarHorarioUsuario,
  getHorarioById,
  getHorarios,
} from "../../services/backend";
import type { Horario } from "../../services/types";
import { useAuth } from "../../context/authState";

interface ScheduleForm {
  totalCreditos: string;
  totalHorasSemanales: string;
  idNucleoHorario: string;
}

interface EmailForm {
  destino: string;
  asunto: string;
  mensaje: string;
  rutaPdf: string;
}

const emptySchedule: ScheduleForm = {
  totalCreditos: "",
  totalHorasSemanales: "",
  idNucleoHorario: "",
};

function HorariosPage() {
  const { user } = useAuth();
  const canManageSchedules = user?.role !== "student";
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [scheduleModal, setScheduleModal] = useState(false);
  const [editing, setEditing] = useState<Horario | null>(null);
  const [details, setDetails] = useState<Horario | null>(null);
  const [emailSchedule, setEmailSchedule] = useState<Horario | null>(null);
  const [deleteSchedule, setDeleteSchedule] = useState<Horario | null>(null);
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>(emptySchedule);
  const [emailForm, setEmailForm] = useState<EmailForm>({
    destino: user?.email || "",
    asunto: "Mi horario académico",
    mensaje: "Te comparto mi horario académico.",
    rutaPdf: "",
  });

  const refreshSchedules = async () => {
    const data = await getHorarios();
    setHorarios(data);
  };

  useEffect(() => {
    let cancelled = false;
    getHorarios()
      .then((data) => {
        if (!cancelled) setHorarios(data);
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
    setScheduleForm(emptySchedule);
    setScheduleModal(true);
  };

  const openEdit = async (horario: Horario) => {
    if (!horario.idHorario) return;
    setError("");
    setSaving(true);
    try {
      const fullSchedule = await getHorarioById(horario.idHorario);
      setEditing(fullSchedule);
      setScheduleForm({
        totalCreditos: String(fullSchedule.totalCreditos ?? ""),
        totalHorasSemanales: String(fullSchedule.totalHorasSemanales ?? ""),
        idNucleoHorario: String(fullSchedule.idNucleoHorario ?? ""),
      });
      setScheduleModal(true);
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  const showDetails = async (horario: Horario) => {
    if (!horario.idHorario) return;
    setSaving(true);
    setError("");
    try {
      setDetails(await getHorarioById(horario.idHorario));
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  const saveSchedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (!user?.id) {
      setError("No se encontró el usuario autenticado para asociar el horario.");
      return;
    }

    const idNucleoHorario = Number(scheduleForm.idNucleoHorario);
    if (!Number.isFinite(idNucleoHorario) || idNucleoHorario <= 0) {
      setError("Ingresa un ID de núcleo horario válido.");
      return;
    }

    setSaving(true);
    try {
      if (editing?.idHorario) {
        await editarHorario(editing.idHorario, { idNucleoHorario });
      } else {
        await crearHorario({
          idUsuario: user.id,
          totalCreditos: Number(scheduleForm.totalCreditos),
          totalHorasSemanales: Number(scheduleForm.totalHorasSemanales),
          idNucleoHorario,
        });
      }
      await refreshSchedules();
      setScheduleModal(false);
      setSuccess(editing?.idHorario ? "Horario actualizado correctamente." : "Horario creado correctamente.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteSchedule?.idHorario) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await eliminarHorario(deleteSchedule.idHorario);
      setHorarios((current) => current.filter((item) => item.idHorario !== deleteSchedule.idHorario));
      setDeleteSchedule(null);
      setSuccess("Horario eliminado correctamente.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  const sendSchedule = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await enviarHorarioUsuario({
        destino: emailForm.destino,
        asunto: emailForm.asunto,
        mensaje: emailForm.mensaje,
        rutaPdf: emailForm.rutaPdf || undefined,
      });
      setEmailSchedule(null);
      setSuccess("Horario enviado correctamente por correo.");
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
          <h1 className="text-3xl font-bold text-[#0f2a1d]">Horarios</h1>
          <p className="mt-2 text-[#506557]">Consulta, organiza y comparte horarios académicos.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {canManageSchedules && (
            <>
              <Link to="/dashboard/horarios/generar" className="inline-flex items-center gap-2 rounded-lg border border-[#a8bdae] bg-white px-4 py-2.5 font-semibold text-[#183c29] hover:bg-[#edf5ef]">
                Generar horarios
              </Link>
              <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#087344] px-4 py-2.5 font-semibold text-white hover:bg-[#075d38]">
                <Plus size={18} /> Crear horario
              </button>
            </>
          )}
        </div>
      </header>

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}
      {success && <ErrorAlert mensaje={success} tipo="success" autoDismiss={5000} onClose={() => setSuccess("")} />}

      {loading ? (
        <p role="status" className="text-sm text-[#506557]">Cargando horarios...</p>
      ) : horarios.length === 0 ? (
        <p className="border border-[#d5dfd7] bg-white px-4 py-3 text-sm text-[#506557]">No hay horarios disponibles.</p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {horarios.map((horario, index) => (
            <article key={horario.idHorario ?? index} className="border border-[#d5dfd7] bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-[#0f2a1d]">Horario #{horario.idHorario ?? "—"}</h2>
                  <p className="text-sm text-[#52665a]">Usuario: {horario.idUsuario ?? "Sin asignar"}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" title="Ver detalle" onClick={() => void showDetails(horario)} className="rounded-md border border-[#c8d8cd] p-2 text-[#183c29] hover:bg-[#eff6f1]"><Eye size={17} /></button>
                  {canManageSchedules && (
                    <>
                      <button type="button" title="Editar horario" onClick={() => void openEdit(horario)} className="rounded-md border border-[#c8d8cd] p-2 text-[#183c29] hover:bg-[#eff6f1]"><Pencil size={17} /></button>
                      <button type="button" title="Enviar por correo" onClick={() => { setEmailSchedule(horario); setEmailForm((current) => ({ ...current, destino: user?.email || current.destino })); }} className="rounded-md border border-[#c8d8cd] p-2 text-[#183c29] hover:bg-[#eff6f1]"><Mail size={17} /></button>
                      <button type="button" title="Eliminar horario" onClick={() => setDeleteSchedule(horario)} className="rounded-md border border-[#e7c8c5] p-2 text-[#9e302b] hover:bg-[#fff1ef]"><Trash2 size={17} /></button>
                    </>
                  )}
                </div>
              </div>
              <dl className="mt-4 grid grid-cols-3 gap-3 text-sm">
                <div><dt className="text-[#66776b]">Créditos</dt><dd className="font-semibold">{horario.totalCreditos ?? "—"}</dd></div>
                <div><dt className="text-[#66776b]">Horas/semana</dt><dd className="font-semibold">{horario.totalHorasSemanales ?? "—"}</dd></div>
                <div><dt className="text-[#66776b]">Núcleo horario</dt><dd className="font-semibold">{horario.idNucleoHorario ?? "—"}</dd></div>
              </dl>
            </article>
          ))}
        </div>
      )}

      <Modal open={scheduleModal} onClose={() => setScheduleModal(false)} title={editing ? "Editar horario" : "Crear horario"}>
        <form className="space-y-4" onSubmit={saveSchedule}>
          {!editing && <label className="block text-sm font-medium text-[#294535]">Total de créditos<input required min="0" type="number" value={scheduleForm.totalCreditos} onChange={(event) => setScheduleForm({ ...scheduleForm, totalCreditos: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>}
          {!editing && <label className="block text-sm font-medium text-[#294535]">Horas semanales<input required min="0" type="number" value={scheduleForm.totalHorasSemanales} onChange={(event) => setScheduleForm({ ...scheduleForm, totalHorasSemanales: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>}
          <label className="block text-sm font-medium text-[#294535]">ID de núcleo horario<input required min="1" type="number" value={scheduleForm.idNucleoHorario} onChange={(event) => setScheduleForm({ ...scheduleForm, idNucleoHorario: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <div className="flex justify-end gap-2"><button type="button" onClick={() => setScheduleModal(false)} className="rounded-md border border-[#bac9bd] px-4 py-2 text-black">Cancelar</button><button type="submit" disabled={saving} className="rounded-md bg-[#087344] px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Guardando..." : "Guardar"}</button></div>
        </form>
      </Modal>

      <Modal open={Boolean(details)} onClose={() => setDetails(null)} title={`Detalle horario #${details?.idHorario ?? ""}`}>
        {details && (
          <div className="max-h-[65vh] space-y-6 overflow-y-auto text-[#183c29]">
            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#52665a]">Resumen</h3>
              <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="border border-[#d5dfd7] p-3">
                  <dt className="text-xs text-[#66776b]">Estudiante (ID)</dt>
                  <dd className="mt-1 font-semibold">{details.idUsuario ?? "No disponible"}</dd>
                </div>
                <div className="border border-[#d5dfd7] p-3">
                  <dt className="text-xs text-[#66776b]">Créditos</dt>
                  <dd className="mt-1 font-semibold">{details.totalCreditos ?? "No disponible"}</dd>
                </div>
                <div className="border border-[#d5dfd7] p-3">
                  <dt className="text-xs text-[#66776b]">Horas semanales</dt>
                  <dd className="mt-1 font-semibold">{details.totalHorasSemanales ?? "No disponible"}</dd>
                </div>
                <div className="border border-[#d5dfd7] p-3">
                  <dt className="text-xs text-[#66776b]">ID núcleo horario</dt>
                  <dd className="mt-1 font-semibold">{details.idNucleoHorario ?? "No disponible"}</dd>
                </div>
              </dl>
            </section>

            <section>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-[#52665a]">Información académica</h3>
              {details.idNucleoHorarioNavigation ? (
                <div className="space-y-3">
                  <dl className="grid gap-3 sm:grid-cols-2">
                    <div className="border border-[#d5dfd7] p-3">
                      <dt className="text-xs text-[#66776b]">Materia / núcleo</dt>
                      <dd className="mt-1 font-medium">{details.idNucleoHorarioNavigation.idNucleoTematicoNavigation?.nombre ?? "No disponible"}</dd>
                    </div>
                    <div className="border border-[#d5dfd7] p-3">
                      <dt className="text-xs text-[#66776b]">Grupo</dt>
                      <dd className="mt-1 font-medium">{details.idNucleoHorarioNavigation.idGrupoNavigation?.nombreGrupo ?? "No disponible"}</dd>
                    </div>
                    <div className="border border-[#d5dfd7] p-3">
                      <dt className="text-xs text-[#66776b]">Jornada</dt>
                      <dd className="mt-1 font-medium">{details.idNucleoHorarioNavigation.idGrupoNavigation?.idJornadaNavigation?.jornada ?? "No disponible"}</dd>
                    </div>
                    <div className="border border-[#d5dfd7] p-3">
                      <dt className="text-xs text-[#66776b]">Espacio</dt>
                      <dd className="mt-1 font-medium">{details.idNucleoHorarioNavigation.idEspacioEducativoNavigation?.nombre ?? "No disponible"}</dd>
                    </div>
                  </dl>
                  {details.idNucleoHorarioNavigation.horarios?.length ? (
                    <ul className="divide-y divide-[#d5dfd7] border border-[#d5dfd7]">
                      {details.idNucleoHorarioNavigation.horarios.map((session, index) => (
                        <li key={`${session}-${index}`} className="px-3 py-2 text-sm">{session}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="border border-dashed border-[#c8d8cd] px-3 py-3 text-sm text-[#52665a]">
                      El servicio no devolvió días ni horas para este horario.
                    </p>
                  )}
                </div>
              ) : (
                <p className="border border-dashed border-[#c8d8cd] px-3 py-3 text-sm text-[#52665a]">
                  El servicio devolvió los datos generales, pero no incluyó el detalle de materias, días y horas.
                </p>
              )}
            </section>
          </div>
        )}
      </Modal>

      <Modal open={Boolean(emailSchedule)} onClose={() => setEmailSchedule(null)} title="Enviar horario por correo">
        <form className="space-y-4" onSubmit={sendSchedule}>
          <label className="block text-sm font-medium text-[#294535]">Destinatario<input required type="email" value={emailForm.destino} onChange={(event) => setEmailForm({ ...emailForm, destino: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <label className="block text-sm font-medium text-[#294535]">Asunto<input required value={emailForm.asunto} onChange={(event) => setEmailForm({ ...emailForm, asunto: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <label className="block text-sm font-medium text-[#294535]">Mensaje<textarea required value={emailForm.mensaje} onChange={(event) => setEmailForm({ ...emailForm, mensaje: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <label className="block text-sm font-medium text-[#294535]">URL del PDF (opcional)<input type="url" value={emailForm.rutaPdf} onChange={(event) => setEmailForm({ ...emailForm, rutaPdf: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <div className="flex justify-end"><button type="submit" disabled={saving} className="rounded-md bg-[#087344] px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Enviando..." : "Enviar"}</button></div>
        </form>
      </Modal>

      <Modal open={Boolean(deleteSchedule)} onClose={() => setDeleteSchedule(null)} title="Eliminar horario">
        <p className="text-sm text-[#344b3b]">¿Confirmas eliminar el horario #{deleteSchedule?.idHorario}?</p>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDeleteSchedule(null)} className="rounded-md border border-[#bac9bd] px-4 py-2 text-black">Cancelar</button><button type="button" onClick={() => void confirmDelete()} disabled={saving} className="rounded-md bg-[#a6332d] px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Eliminando..." : "Eliminar"}</button></div>
      </Modal>
    </section>
  );
}

export default HorariosPage;
