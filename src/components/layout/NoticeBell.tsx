import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Bell } from "lucide-react";
import { useAuth } from "../../context/authState";
import { getAvisosInformativos } from "../../services/backend";
import type { AvisoInformativo } from "../../services/types";

function NoticeBell() {
  const { user } = useAuth();
  const canReadNotices = user?.role === "udec" || user?.role === "student";
  const [avisos, setAvisos] = useState<AvisoInformativo[]>([]);
  const [loading, setLoading] = useState(canReadNotices);
  const [failed, setFailed] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!canReadNotices) return;

    let cancelled = false;
    const loadAvisos = async () => {
      try {
        const data = await getAvisosInformativos();
        if (!cancelled) {
          setAvisos(data);
          setFailed(false);
        }
      } catch {
        if (!cancelled) setFailed(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadAvisos();
    const interval = window.setInterval(() => void loadAvisos(), 60_000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [canReadNotices]);

  if (!canReadNotices) return null;

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative grid size-11 place-items-center rounded-full text-[#42594b] transition hover:bg-[#edf5ef] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#087344]"
        aria-label={`Avisos${avisos.length ? `, ${avisos.length} publicados` : ""}`}
        aria-expanded={open}
        aria-haspopup="true"
        title="Avisos"
      >
        <Bell size={22} aria-hidden="true" />
        {avisos.length > 0 && (
          <span className="absolute right-0 top-0 grid min-h-5 min-w-5 place-items-center rounded-full bg-[#b42318] px-1 text-[11px] font-semibold leading-none text-white">
            {avisos.length > 99 ? "99+" : avisos.length}
          </span>
        )}
      </button>

      {open && (
        <section className="absolute right-0 top-full z-50 mt-2 w-[min(22rem,calc(100vw-2rem))] border border-[#d5dfd7] bg-white text-[#152e21] shadow-xl" aria-label="Notificaciones de avisos">
          <header className="flex items-center justify-between border-b border-[#edf2ee] px-4 py-3">
            <h2 className="font-semibold text-[#0f2a1d]">Avisos recientes</h2>
            <span className="text-xs text-[#63766a]">{avisos.length}</span>
          </header>
          {loading ? (
            <p role="status" className="px-4 py-5 text-sm text-[#63766a]">Cargando avisos...</p>
          ) : failed ? (
            <p className="px-4 py-5 text-sm text-[#8f2824]">No se pudieron cargar los avisos.</p>
          ) : avisos.length === 0 ? (
            <p className="px-4 py-5 text-sm text-[#63766a]">No hay avisos publicados.</p>
          ) : (
            <ul className="max-h-80 divide-y divide-[#edf2ee] overflow-y-auto">
              {avisos.slice(0, 5).map((aviso, index) => (
                <li key={aviso.idPasarela ?? index}>
                  <Link to="/dashboard/avisos" onClick={() => setOpen(false)} className="block px-4 py-3 transition hover:bg-[#f6fbf8]">
                    <h3 className="text-sm font-semibold text-[#183c29]">{aviso.tipoAviso || "Aviso institucional"}</h3>
                    <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm text-[#52665a]">{aviso.informacion || "Sin contenido."}</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
          <Link to="/dashboard/avisos" onClick={() => setOpen(false)} className="block border-t border-[#edf2ee] px-4 py-3 text-center text-sm font-semibold text-[#087344] hover:bg-[#f6fbf8]">
            Ver todos los avisos
          </Link>
        </section>
      )}
    </div>
  );
}

export default NoticeBell;