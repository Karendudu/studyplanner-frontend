import { BookOpen, Users } from "lucide-react";
import { useEffect, useState } from "react";
import QuickActions from "../../components/dashboard/QuickActions";
import RecentNotices from "../../components/dashboard/RecentNotices";
import WeeklySchedule from "../../components/dashboard/WeeklySchedule";
import StatCard from "../../components/ui/StatCard";
import { useAuth } from "../../context/authState";
import { contarUsuarios, getNucleos } from "../../services/backend";

function Dashboard() {
    const { user } = useAuth();
    const canSeeUsers = user?.role === "admin" || user?.role === "udec";
    const [stats, setStats] = useState<{ totalUsuarios: number | string; totalNucleos: number | string }>({
        totalUsuarios: "—",
        totalNucleos: "—",
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        const cargarEstadisticas = async () => {
            const [usuarios, nucleos] = await Promise.allSettled([
                canSeeUsers ? contarUsuarios() : Promise.resolve(null),
                getNucleos(),
            ]);
            if (cancelled) return;

            setStats({
                totalUsuarios: usuarios.status === "fulfilled" && usuarios.value
                    ? usuarios.value.totalEstudiantes + usuarios.value.totalAdministradores
                    : "—",
                totalNucleos: nucleos.status === "fulfilled" ? nucleos.value.length : "—",
            });
            setLoading(false);
        };

        void cargarEstadisticas();
        return () => {
            cancelled = true;
        };
    }, [canSeeUsers]);

    return (
        <div className="space-y-8 text-black">
            <header>
                <h1 className="text-4xl font-bold text-[#0f2a1d]">Dashboard</h1>
                <p className="mt-2 text-[#152e21]">Bienvenido a StudyPlanner.</p>
            </header>

            <RecentNotices />

            {loading ? (
                <div className="grid max-w-3xl gap-6 md:grid-cols-2">
                    {Array.from({ length: canSeeUsers ? 2 : 1 }, (_, item) => (
                        <div key={item} className="h-32 animate-pulse rounded-xl bg-gray-200" />
                    ))}
                </div>
            ) : (
                <div className="grid max-w-3xl gap-6 md:grid-cols-2">
                    {canSeeUsers && <StatCard title="Usuarios" value={stats.totalUsuarios} color="#007B3E" icon={<Users size={30} />} />}
                    <StatCard title="Núcleos y Materias" value={stats.totalNucleos} color="#00A99D" icon={<BookOpen size={30} />} />
                </div>
            )}

            <WeeklySchedule />
            <QuickActions />
        </div>
    );
}

export default Dashboard;