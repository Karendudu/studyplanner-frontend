import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/authState";
import { getAvisosInformativos } from "../../services/backend";
import type { AvisoInformativo } from "../../services/types";

function RecentNotices() {
    const { user } = useAuth();
    const [avisos, setAvisos] = useState<AvisoInformativo[]>([]);
    const [loading, setLoading] = useState(true);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (user?.role !== "udec" && user?.role !== "student") return;

        let cancelled = false;
        getAvisosInformativos()
            .then((data) => {
                if (!cancelled) setAvisos(data.slice(0, 3));
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [user?.role]);

    if (user?.role !== "udec" && user?.role !== "student") return null;

    return (
        <section className="border border-[#d5dfd7] bg-white p-5 text-[#152e21]">
            <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-[#0f2a1d]">Avisos recientes</h2>
                <Link to="/dashboard/avisos" className="text-sm font-semibold text-[#087344] hover:underline">Ver todos</Link>
            </div>
            {loading ? (
                <p role="status" className="text-sm text-[#63766a]">Cargando avisos...</p>
            ) : failed ? (
                <p className="text-sm text-[#8f2824]">No fue posible cargar los avisos.</p>
            ) : avisos.length === 0 ? (
                <p className="text-sm text-[#63766a]">No hay avisos publicados.</p>
            ) : (
                <ul className="divide-y divide-[#edf2ee]">
                    {avisos.map((aviso, index) => (
                        <li key={aviso.idPasarela ?? index} className="py-3 first:pt-0 last:pb-0">
                            <h3 className="text-sm font-semibold text-[#183c29]">{aviso.tipoAviso || "Aviso institucional"}</h3>
                            <p className="mt-1 line-clamp-2 whitespace-pre-wrap text-sm text-[#52665a]">{aviso.informacion || "Sin contenido."}</p>
                        </li>
                    ))}
                </ul>
            )}
        </section>
    );
}

export default RecentNotices;