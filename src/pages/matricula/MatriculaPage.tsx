import { useEffect, useState } from "react";
import { handleApiError } from "../../services/api";
import {
  actualizarEstadoMatricula,
  getEstadoMatriculaEstudiante,
  getMateriasPermitidas,
  getPeriodoMatriculaActivo,
} from "../../services/backend";
import type { EstadoMatriculaEstudiante, PeriodoMatricula } from "../../services/types";
import { useAuth } from "../../context/authState";

function formatDate(value?: string) {
  if (!value) return "No informado";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString("es-CO");
}

function MatriculaPage() {
  const { user } = useAuth();
  const isStudent = user?.role === "student";
  const [periodo, setPeriodo] = useState<PeriodoMatricula | null>(null);
  const [estado, setEstado] = useState<EstadoMatriculaEstudiante | null>(null);
  const [materiasPermitidas, setMateriasPermitidas] = useState<unknown>(null);
  const [loading, setLoading] = useState(Boolean(user?.id));
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;
    if (!user?.id) {
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      const [periodResults, studentResults] = await Promise.all([
        Promise.allSettled([getPeriodoMatriculaActivo()]),
        isStudent
          ? Promise.allSettled([
              getEstadoMatriculaEstudiante(user.id),
              getMateriasPermitidas(user.id),
            ])
          : Promise.resolve(null),
      ]);
      const [periodResult] = periodResults;

      if (!cancelled) {
        const failures: string[] = [];
        if (periodResult.status === "fulfilled") setPeriodo(periodResult.value);
        else failures.push(`Período: ${handleApiError(periodResult.reason).mensaje}`);
        if (studentResults) {
          const [statusResult, subjectsResult] = studentResults;
          if (statusResult.status === "fulfilled") setEstado(statusResult.value);
          else failures.push(`Estado: ${handleApiError(statusResult.reason).mensaje}`);
          if (subjectsResult.status === "fulfilled") setMateriasPermitidas(subjectsResult.value);
          else failures.push(`Materias permitidas: ${handleApiError(subjectsResult.reason).mensaje}`);
        } else {
          setEstado(null);
          setMateriasPermitidas(null);
        }
        setError(failures.join(" "));
        setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, [user?.id, isStudent]);

  const actualizarEstado = async () => {
    if (!user?.id) return;
    setUpdating(true);
    setError("");
    setSuccess("");
    try {
      await actualizarEstadoMatricula(user.id);
      setEstado(await getEstadoMatriculaEstudiante(user.id));
      setSuccess("Estado de matrícula actualizado correctamente.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <section className="mx-auto max-w-5xl space-y-6 text-[#152e21]">
      <header className="border-b border-[#d5dfd7] pb-5">
        <h1 className="text-3xl font-bold text-[#0f2a1d]">Matrícula</h1>
        <p className="mt-2 text-[#506557]">Consulta el período, tu estado y las materias habilitadas.</p>
      </header>

      {error && <p role="alert" className="border border-[#e6b7b3] bg-[#fff3f2] px-4 py-3 text-sm text-[#8f2824]">{error}</p>}
      {success && <p role="status" className="border border-[#b8d7c3] bg-[#f1f8f3] px-4 py-3 text-sm text-[#155b37]">{success}</p>}
      {loading ? (
        <p role="status" className="text-sm text-[#506557]">Consultando información de matrícula...</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          <section className="border border-[#d5dfd7] bg-white p-5">
            <h2 className="text-lg font-semibold text-[#0f2a1d]">Período activo</h2>
            {periodo ? (
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between gap-3"><dt>Inicio</dt><dd className="font-medium">{formatDate(periodo.fechaInicio)}</dd></div>
                <div className="flex justify-between gap-3"><dt>Fin</dt><dd className="font-medium">{formatDate(periodo.fechaFin)}</dd></div>
                <div className="flex justify-between gap-3"><dt>Estado</dt><dd className="font-medium">{(periodo.activo ?? periodo.estado) ? "Activo" : "Inactivo"}</dd></div>
              </dl>
            ) : <p className="mt-3 text-sm text-[#63766a]">No hay información del período.</p>}
          </section>

          {isStudent && (
            <>
              <section className="border border-[#d5dfd7] bg-white p-5">
                <h2 className="text-lg font-semibold text-[#0f2a1d]">Mi estado</h2>
                <p className="mt-3 text-sm text-[#42594b]">{estado?.estado || "Sin estado reportado"}</p>
                <button type="button" disabled={updating} onClick={() => void actualizarEstado()} className="mt-4 rounded-md bg-[#087344] px-4 py-2 text-sm font-semibold text-white hover:bg-[#075d38] disabled:opacity-60">
                  {updating ? "Actualizando..." : "Actualizar estado"}
                </button>
              </section>

              <section className="border border-[#d5dfd7] bg-white p-5 md:col-span-2">
                <h2 className="text-lg font-semibold text-[#0f2a1d]">Materias permitidas</h2>
                {materiasPermitidas === null ? (
                  <p className="mt-3 text-sm text-[#63766a]">No hay respuesta de reglas para mostrar.</p>
                ) : (
                  <pre className="mt-3 max-h-80 overflow-auto bg-[#f2f7f3] p-4 text-sm text-[#183c29]">{JSON.stringify(materiasPermitidas, null, 2)}</pre>
                )}
              </section>
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default MatriculaPage;