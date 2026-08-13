import {
    Users,
    GraduationCap,
    BookOpen,
    Bell
} from "lucide-react";

import StatCard from "../../components/ui/StatCard";

import QuickActions from "../../components/dashboard/QuickActions";

import WeeklySchedule from "../../components/dashboard/WeeklySchedule";

import RecentNotices from "../../components/dashboard/RecentNotices";

function Dashboard() {

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

            <div className="grid lg:grid-cols-4 gap-6">

                <StatCard
                    title="Usuarios"
                    value={24}
                    color="#007B3E"
                    icon={<Users size={30} />}
                />

                <StatCard
                    title="Programas"
                    value={8}
                    color="#79C000"
                    icon={<GraduationCap size={30} />}
                />

                <StatCard
                    title="Materias"
                    value={138}
                    color="#00A99D"
                    icon={<BookOpen size={30} />}
                />

                <StatCard
                    title="Avisos"
                    value={5}
                    color="#F7931E"
                    icon={<Bell size={30} />}
                />

            </div>

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