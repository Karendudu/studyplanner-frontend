import { useEffect, useState } from "react";
import {
    Users,
    GraduationCap,
    BookOpen,
    Bell
} from "lucide-react";

import StatCard from "../../components/ui/StatCard";
import { contarUsuarios, getNucleos } from "../../services/backend";
import QuickActions from "../../components/dashboard/QuickActions";
import WeeklySchedule from "../../components/dashboard/WeeklySchedule";
import RecentNotices from "../../components/dashboard/RecentNotices";

const LOCAL_FALLBACK_STATS = {
    totalUsuarios: 24,
    totalPrograms: 8,
    totalMaterias: 36,
    totalAvisos: 5,
};

function Dashboard() {
    const [stats, setStats] = useState({
        totalUsuarios: 0,
        totalPrograms: 0,
        totalMaterias: 0,
        totalAvisos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const cargarEstadisticas = async () => {
            try {
                const [usuariosData, nucleosData] = await Promise.all([
                    contarUsuarios(),
                    getNucleos()
                ]);

                setStats({
                    totalUsuarios: usuariosData.totalEstudiantes + usuariosData.totalAdministradores,
                    totalPrograms: 8, // TODO: agregar endpoint
                    totalMaterias: nucleosData.length,
                    totalAvisos: 5, // TODO: agregar endpoint
                });
            } catch (err) {
                // Evita ruido visual cuando el backend está caído.
                setStats(LOCAL_FALLBACK_STATS);
                console.warn("Dashboard en modo local sin backend.", err);
            } finally {
                setLoading(false);
            }
        };

        cargarEstadisticas();
    }, []);

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-[#00482B]">
                    Dashboard
                </h1>
                <p className="text-cundi-700 mt-2 dark:text-gray-400">
                    Bienvenido a StudyPlanner.
                </p>
            </div>

            {loading ? (
                <div className="grid lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-32 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid lg:grid-cols-4 gap-6">
                    <StatCard
                        title="Usuarios"
                        value={stats.totalUsuarios}
                        color="#007B3E"
                        icon={<Users size={30} />}
                    />

                    <StatCard
                        title="Programas"
                        value={stats.totalPrograms}
                        color="#79C000"
                        icon={<GraduationCap size={30} />}
                    />

                    <StatCard
                        title="Materias"
                        value={stats.totalMaterias}
                        color="#00A99D"
                        icon={<BookOpen size={30} />}
                    />

                    <StatCard
                        title="Avisos"
                        value={stats.totalAvisos}
                        color="#F7931E"
                        icon={<Bell size={30} />}
                    />
                </div>
            )}

            <div className="grid lg:grid-cols-2 gap-6 mt-8">
                <WeeklySchedule />
                <RecentNotices />
            </div>

            <div className="mt-8">
                <QuickActions />

            </div>

        </div>

    )

}

export default Dashboard;