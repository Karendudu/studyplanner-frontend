import { useEffect, useState, type FormEvent } from "react";
import { Eye, Pencil, Plus, Trash2 } from "lucide-react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import Modal from "../../components/ui/Modal";
import { useAuth } from "../../context/authState";
import { handleApiError } from "../../services/api";
import {
  actualizarCupo,
  crearNucleo,
  editarNucleo,
  eliminarNucleo,
  getCantidadNucleosPorPrograma,
  getMisNucleosVistos,
  getNucleoById,
  getNucleos,
  getNucleosOrdenadosPorCupo,
  getNucleosPorSemestre,
} from "../../services/backend";
import type { NucleoTematico, ReqCrearNucleo, ReqEditarNucleo } from "../../services/types";

interface NucleoForm {
  idCodigoNucleo: string;
  nombre: string;
  idPrograma: string;
  idUbicacionSemestral: string;
  idPrerrequisito: string;
  idCreditos: string;
  creditos: string;
  cupos: string;
  horasSemanales: string;
}

interface NucleoVistoItem {
  periodo?: string;
  codigo: string;
  nombre: string;
  nota?: number;
  estado?: boolean;
  tipo?: string;
  creditos?: number;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function toNucleoVisto(value: unknown): NucleoVistoItem | null {
  if (!isRecord(value)) return null;
  const relatedNucleo = isRecord(value.idNucleoTematicoNavigation)
    ? value.idNucleoTematicoNavigation
    : {};
  const codigo = value.codigo ?? value.idNucleoTematico ?? relatedNucleo.idCodigoNucleo;
  const nombre = value.nombre ?? relatedNucleo.nombre;
  if (typeof codigo !== "string" || typeof nombre !== "string") return null;
  if (typeof value.tipo === "string" && value.tipo !== "NUCLEO") return null;

  return {
    periodo: typeof value.periodo === "string" ? value.periodo : undefined,
    codigo,
    nombre,
    nota: typeof value.nota === "number" ? value.nota : undefined,
    estado: typeof value.estado === "boolean" ? value.estado : undefined,
    tipo: typeof value.tipo === "string" ? value.tipo : undefined,
    creditos: typeof value.creditos === "number" ? value.creditos : undefined,
  };
}

function getNucleosVistos(value: unknown): NucleoVistoItem[] | null {
  if (Array.isArray(value)) return value.map(toNucleoVisto).filter((item): item is NucleoVistoItem => item !== null);
  if (!isRecord(value)) return null;

  for (const key of ["nucleosVistos", "misNucleosVistos", "nucleos", "data", "resultado", "result"]) {
    if (key in value) {
      const parsed = getNucleosVistos(value[key]);
      if (parsed) return parsed;
    }
  }
  return null;
}

function formatNota(nota?: number) {
  if (nota === undefined) return "—";
  const value = nota > 10 ? nota / 10 : nota;
  return value.toLocaleString("es-CO", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
}

const emptyForm: NucleoForm = {
  idCodigoNucleo: "",
  nombre: "",
  idPrograma: "",
  idUbicacionSemestral: "",
  idPrerrequisito: "",
  idCreditos: "",
  creditos: "",
  cupos: "",
  horasSemanales: "",
};

function MateriasPage() {
  const { user } = useAuth();
  const canManage = user?.role === "admin" || user?.role === "udec";
  const canQueryProgramCount = canManage || user?.role === "student";
  const [nucleos, setNucleos] = useState<NucleoTematico[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<NucleoTematico | null>(null);
  const [details, setDetails] = useState<NucleoTematico | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<NucleoTematico | null>(null);
  const [form, setForm] = useState<NucleoForm>(emptyForm);
  const [capacityDrafts, setCapacityDrafts] = useState<Record<string, string>>({});
  const [programId, setProgramId] = useState("");
  const [programCount, setProgramCount] = useState<number | null>(null);
  const [nucleosVistos, setNucleosVistos] = useState<NucleoVistoItem[]>([]);
  const [loadingVistos, setLoadingVistos] = useState(user?.role === "student");

  const loadNucleos = async () => {
    setLoading(true);
    setError("");
    try {
      setNucleos(await getNucleos());
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    if (user?.role !== "student") return;

    let cancelled = false;
    getMisNucleosVistos()
      .then((response) => {
        if (cancelled) return;
        const parsed = getNucleosVistos(response);
        if (parsed) setNucleosVistos(parsed);
        else setError("El backend devolvió un formato no reconocido para los núcleos vistos.");
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(handleApiError(requestError).mensaje);
      })
      .finally(() => {
        if (!cancelled) setLoadingVistos(false);
      });

    return () => {
      cancelled = true;
    };
  }, [user?.role]);

  const runFilter = async (filter: () => Promise<NucleoTematico[]>) => {
    setLoading(true);
    setError("");
    try {
      setNucleos(await filter());
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setLoading(false);
    }
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormOpen(true);
  };

  const openEdit = async (nucleo: NucleoTematico) => {
    if (!nucleo.idCodigoNucleo) return;
    setSaving(true);
    setError("");
    try {
      const full = await getNucleoById(nucleo.idCodigoNucleo);
      setEditing(full);
      setForm({
        idCodigoNucleo: full.idCodigoNucleo || "",
        nombre: full.nombre || "",
        idPrograma: String(full.idPrograma ?? ""),
        idUbicacionSemestral: String(full.idUbicacionSemestral ?? ""),
        idPrerrequisito: String(full.idPrerrequisito ?? ""),
        idCreditos: String(full.idCreditos ?? ""),
        creditos: String(full.creditos ?? ""),
        cupos: String(full.cupos ?? ""),
        horasSemanales: String(full.horasSemanales ?? ""),
      });
      setFormOpen(true);
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  const submitForm = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    const payload: ReqCrearNucleo = {
      idCodigoNucleo: form.idCodigoNucleo.trim(),
      nombre: form.nombre.trim(),
      idPrograma: Number(form.idPrograma),
      idUbicacionSemestral: Number(form.idUbicacionSemestral),
      idPrerrequisito: form.idPrerrequisito ? Number(form.idPrerrequisito) : null,
      idCreditos: Number(form.idCreditos),
      creditos: Number(form.creditos),
      cupos: Number(form.cupos),
      horasSemanales: Number(form.horasSemanales),
    };
    try {
      if (editing?.idCodigoNucleo) {
        const update: ReqEditarNucleo = {
          nombre: payload.nombre,
          idPrograma: payload.idPrograma,
          idUbicacionSemestral: payload.idUbicacionSemestral,
          idPrerrequisito: payload.idPrerrequisito,
          creditos: payload.creditos,
          cupos: payload.cupos,
          horasSemanales: payload.horasSemanales,
        };
        await editarNucleo(editing.idCodigoNucleo, update);
      } else {
        await crearNucleo(payload);
      }
      await loadNucleos();
      setFormOpen(false);
      setSuccess(editing?.idCodigoNucleo ? "Núcleo actualizado correctamente." : "Núcleo creado correctamente.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  const removeNucleo = async () => {
    if (!deleteTarget?.idCodigoNucleo) return;
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await eliminarNucleo(deleteTarget.idCodigoNucleo);
      setNucleos((current) => current.filter((item) => item.idCodigoNucleo !== deleteTarget.idCodigoNucleo));
      setDeleteTarget(null);
      setSuccess("Núcleo eliminado correctamente.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  const saveCapacity = async (nucleo: NucleoTematico) => {
    if (!nucleo.idCodigoNucleo) return;
    const cupos = Number(capacityDrafts[nucleo.idCodigoNucleo] ?? nucleo.cupos);
    if (!Number.isFinite(cupos) || cupos < 0) {
      setError("Ingresa una cantidad de cupos válida.");
      return;
    }
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      await actualizarCupo(nucleo.idCodigoNucleo, { cupos });
      setNucleos((current) => current.map((item) => item.idCodigoNucleo === nucleo.idCodigoNucleo ? { ...item, cupos } : item));
      setSuccess("Cupos actualizados correctamente.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  const countByProgram = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const id = Number(programId);
    if (!Number.isInteger(id) || id <= 0) return;
    setError("");
    try {
      setProgramCount(await getCantidadNucleosPorPrograma(id));
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    }
  };

  return (
    <section className="space-y-6 text-[#152e21]">
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[#d5dfd7] pb-5">
        <div>
          <h1 className="text-3xl font-bold text-[#0f2a1d]">Materias</h1>
          <p className="mt-2 text-[#506557]">Consulta, filtra y administra núcleos temáticos.</p>
        </div>
        {canManage && <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-lg bg-[#087344] px-4 py-2.5 font-semibold text-white hover:bg-[#075d38]"><Plus size={18} /> Crear núcleo</button>}
      </header>

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}
      {success && <ErrorAlert mensaje={success} tipo="success" autoDismiss={5000} onClose={() => setSuccess("")} />}

      {user?.role === "student" && (
        <section className="space-y-3">
          <header className="flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <h2 className="text-xl font-semibold text-[#0f2a1d]">Núcleos vistos</h2>
              <p className="text-sm text-[#506557]">Historial académico asociado a tu sábana.</p>
            </div>
            {!loadingVistos && <span className="text-sm text-[#506557]">{nucleosVistos.length} registros</span>}
          </header>
          {loadingVistos ? (
            <p role="status" className="text-sm text-[#506557]">Cargando núcleos vistos...</p>
          ) : nucleosVistos.length === 0 ? (
            <p className="border border-[#d5dfd7] bg-white px-4 py-3 text-sm text-[#506557]">Aún no hay núcleos vistos registrados.</p>
          ) : (
            <div className="overflow-x-auto border border-[#d5dfd7] bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-[#edf5ef] text-[#344b3b]">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Período</th>
                    <th className="px-4 py-3 font-semibold">Código</th>
                    <th className="px-4 py-3 font-semibold">Núcleo</th>
                    <th className="px-4 py-3 text-right font-semibold">Nota</th>
                    <th className="px-4 py-3 text-right font-semibold">Créditos</th>
                    <th className="px-4 py-3 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {nucleosVistos.map((item, index) => (
                    <tr key={`${item.codigo}-${item.periodo ?? index}`} className="border-t border-[#edf2ee]">
                      <td className="whitespace-nowrap px-4 py-3">{item.periodo || "—"}</td>
                      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">{item.codigo}</td>
                      <td className="px-4 py-3 font-medium text-[#183c29]">{item.nombre}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{formatNota(item.nota)}</td>
                      <td className="px-4 py-3 text-right tabular-nums">{item.creditos ?? "—"}</td>
                      <td className="px-4 py-3">
                        {item.estado === undefined ? "—" : item.estado ? "Aprobado" : "No aprobado"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={() => void runFilter(getNucleos)} className="rounded-md border border-[#b8cbbd] px-3 py-2 text-sm text-black hover:bg-[#e7f2ea]">Todos</button>
        <button type="button" onClick={() => void runFilter(getNucleosPorSemestre)} className="rounded-md border border-[#b8cbbd] px-3 py-2 text-sm text-black hover:bg-[#e7f2ea]">Por semestre</button>
        <button type="button" onClick={() => void runFilter(getNucleosOrdenadosPorCupo)} className="rounded-md border border-[#b8cbbd] px-3 py-2 text-sm text-black hover:bg-[#e7f2ea]">Ordenar por cupos</button>
        {canQueryProgramCount && (
          <form onSubmit={countByProgram} className="ml-auto flex items-center gap-2">
            <label htmlFor="program-count" className="text-sm text-[#344b3b]">Núcleos del programa</label>
            <input id="program-count" type="number" min="1" required value={programId} onChange={(event) => setProgramId(event.target.value)} className="w-24 rounded-md border border-[#bac9bd] px-2 py-2 text-black" />
            <button type="submit" className="rounded-md bg-[#e4f0e7] px-3 py-2 text-sm font-semibold text-black hover:bg-[#d5eadb]">Consultar</button>
            {programCount !== null && <output className="text-sm font-semibold text-black">{programCount}</output>}
          </form>
        )}
      </div>

      {loading ? (
        <p role="status" className="text-sm text-[#506557]">Cargando materias...</p>
      ) : nucleos.length === 0 ? (
        <p className="border border-[#d5dfd7] bg-white px-4 py-3 text-sm text-[#506557]">No hay materias disponibles.</p>
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          {nucleos.map((nucleo, index) => {
            const key = nucleo.idCodigoNucleo || `nucleo-${index}`;
            return (
              <article key={key} className="space-y-4 border border-[#d5dfd7] bg-white p-5 text-[#152e21] shadow-sm">
                <header className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[#0f2a1d]">{nucleo.nombre || "Materia sin nombre"}</h2>
                    <p className="text-sm text-[#5b6d60]">{nucleo.idCodigoNucleo || "Sin código"} · Programa {nucleo.idPrograma ?? "—"}</p>
                  </div>
                  <span className="rounded-full bg-[#e4f0e7] px-3 py-1 text-sm font-medium text-[#245c39]">Semestre {nucleo.idUbicacionSemestral ?? "—"}</span>
                </header>
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <p>Créditos: <strong>{nucleo.creditos ?? "—"}</strong></p>
                  <p>Cupos: <strong>{nucleo.cupos ?? "—"}</strong></p>
                  <p>Horas: <strong>{nucleo.horasSemanales ?? "—"}</strong></p>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e1e9e3] pt-3">
                  {canManage && (
                    <label className="flex items-center gap-2 text-sm text-[#344b3b]">Actualizar cupos<input type="number" min="0" value={capacityDrafts[key] ?? nucleo.cupos ?? ""} onChange={(event) => setCapacityDrafts((current) => ({ ...current, [key]: event.target.value }))} className="w-20 rounded-md border border-[#bac9bd] px-2 py-1.5 text-black" /></label>
                  )}
                  <div className="flex gap-2">
                    <button type="button" title="Ver detalle" onClick={async () => { try { setDetails(await getNucleoById(key)); } catch (requestError) { setError(handleApiError(requestError).mensaje); } }} className="rounded-md border border-[#bac9bd] p-2 text-black hover:bg-[#e7f2ea]"><Eye size={17} /></button>
                    {canManage && (
                      <>
                        <button type="button" title="Editar núcleo" onClick={() => void openEdit(nucleo)} className="rounded-md border border-[#bac9bd] p-2 text-black hover:bg-[#e7f2ea]"><Pencil size={17} /></button>
                        <button type="button" title="Eliminar núcleo" onClick={() => setDeleteTarget(nucleo)} className="rounded-md border border-[#e7c8c5] p-2 text-[#9e302b] hover:bg-[#fff1ef]"><Trash2 size={17} /></button>
                        <button type="button" disabled={saving} onClick={() => void saveCapacity(nucleo)} className="rounded-md bg-[#e4f0e7] px-3 py-1.5 text-sm font-semibold text-black hover:bg-[#d5eadb] disabled:opacity-60">Guardar cupos</button>
                      </>
                    )}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}

      <Modal open={formOpen} onClose={() => setFormOpen(false)} title={editing ? "Editar núcleo" : "Crear núcleo"}>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={submitForm}>
          <label className="text-sm font-medium text-[#294535]">Código<input required disabled={Boolean(editing)} value={form.idCodigoNucleo} onChange={(event) => setForm({ ...form, idCodigoNucleo: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black disabled:bg-gray-100" /></label>
          <label className="text-sm font-medium text-[#294535]">Nombre<input required value={form.nombre} onChange={(event) => setForm({ ...form, nombre: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <label className="text-sm font-medium text-[#294535]">ID de programa<input required min="1" type="number" value={form.idPrograma} onChange={(event) => setForm({ ...form, idPrograma: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <label className="text-sm font-medium text-[#294535]">ID de ubicación semestral<input required min="1" type="number" value={form.idUbicacionSemestral} onChange={(event) => setForm({ ...form, idUbicacionSemestral: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          {!editing && <label className="text-sm font-medium text-[#294535]">ID de créditos<input required min="1" type="number" value={form.idCreditos} onChange={(event) => setForm({ ...form, idCreditos: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>}
          <label className="text-sm font-medium text-[#294535]">Créditos<input required min="0" type="number" value={form.creditos} onChange={(event) => setForm({ ...form, creditos: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <label className="text-sm font-medium text-[#294535]">Cupos<input required min="0" type="number" value={form.cupos} onChange={(event) => setForm({ ...form, cupos: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <label className="text-sm font-medium text-[#294535]">Horas semanales<input required min="0" type="number" value={form.horasSemanales} onChange={(event) => setForm({ ...form, horasSemanales: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <label className="text-sm font-medium text-[#294535] sm:col-span-2">ID de prerrequisito (opcional)<input min="1" type="number" value={form.idPrerrequisito} onChange={(event) => setForm({ ...form, idPrerrequisito: event.target.value })} className="mt-1 w-full rounded-md border border-[#cbd9ce] p-2.5 text-black" /></label>
          <div className="flex justify-end gap-2 sm:col-span-2"><button type="button" onClick={() => setFormOpen(false)} className="rounded-md border border-[#bac9bd] px-4 py-2 text-black">Cancelar</button><button type="submit" disabled={saving} className="rounded-md bg-[#087344] px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Guardando..." : "Guardar"}</button></div>
        </form>
      </Modal>

      <Modal open={Boolean(details)} onClose={() => setDetails(null)} title="Detalle del núcleo">
        {details && (
          <div className="max-h-[70vh] space-y-6 overflow-y-auto text-[#152e21]">
            <header className="border-b border-[#d5dfd7] pb-4">
              <h3 className="text-xl font-semibold text-[#0f2a1d]">{details.nombre || "Núcleo temático"}</h3>
              <p className="mt-1 font-mono text-sm text-[#52665a]">{details.idCodigoNucleo || "Sin código"}</p>
            </header>

            <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
              <div>
                <dt className="text-xs font-medium text-[#63766a]">Semestre</dt>
                <dd className="mt-1 font-medium">{details.idUbicacionSemestralNavigation?.ubicacion ?? details.idUbicacionSemestral ?? "No informado"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#63766a]">Programa</dt>
                <dd className="mt-1 font-medium">{details.idProgramaNavigation?.nombrePrograma ?? (details.idPrograma ? `Programa ${details.idPrograma}` : "No informado")}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#63766a]">Créditos</dt>
                <dd className="mt-1 font-medium">{details.creditos ?? "No informados"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#63766a]">Cupos</dt>
                <dd className="mt-1 font-medium">{details.cupos ?? "No informados"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#63766a]">Horas semanales</dt>
                <dd className="mt-1 font-medium">{details.horasSemanales ?? "No informadas"}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-[#63766a]">Prerrequisito</dt>
                <dd className="mt-1 font-medium">
                  {details.idPrerrequisitoNavigation?.nucleoPrecede ?? (details.idPrerrequisito ? `ID ${details.idPrerrequisito}` : "Ninguno")}
                </dd>
              </div>
            </dl>

            {details.nucleoHorarios && details.nucleoHorarios.length > 0 && (
              <section className="border-t border-[#d5dfd7] pt-4">
                <h4 className="font-semibold text-[#0f2a1d]">Grupos y horarios</h4>
                <ul className="mt-3 divide-y divide-[#edf2ee]">
                  {details.nucleoHorarios.map((slot, index) => (
                    <li key={slot.idNucleoH ?? index} className="space-y-1 py-3 first:pt-0">
                      <p className="text-sm font-medium">
                        Grupo {slot.idGrupoNavigation?.nombreGrupo || slot.idGrupo || "No asignado"}
                      </p>
                      {slot.horarios && slot.horarios.length > 0 && (
                        <p className="text-sm text-[#52665a]">{slot.horarios.join(" · ")}</p>
                      )}
                      {slot.idEspacioEducativoNavigation && (
                        <p className="text-sm text-[#52665a]">
                          {slot.idEspacioEducativoNavigation.nombre || "Espacio educativo"}
                          {slot.idEspacioEducativoNavigation.bloque ? ` · Bloque ${slot.idEspacioEducativoNavigation.bloque}` : ""}
                        </p>
                      )}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </Modal>

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Eliminar núcleo">
        <p className="text-sm text-[#344b3b]">¿Confirmas eliminar “{deleteTarget?.nombre}”?</p>
        <div className="mt-5 flex justify-end gap-2"><button type="button" onClick={() => setDeleteTarget(null)} className="rounded-md border border-[#bac9bd] px-4 py-2 text-black">Cancelar</button><button type="button" disabled={saving} onClick={() => void removeNucleo()} className="rounded-md bg-[#a6332d] px-4 py-2 font-semibold text-white disabled:opacity-60">{saving ? "Eliminando..." : "Eliminar"}</button></div>
      </Modal>
    </section>
  );
}

export default MateriasPage;
