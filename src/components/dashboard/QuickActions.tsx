import {
    Users,
    GraduationCap,
    Calendar,
    Bell
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const actions = [

    {
        title: "Usuarios",
        icon: <Users size={28} />,
        path: "/usuarios",
    },

    {
        title: "Programas",
        icon: <GraduationCap size={28} />,
        path: "/programas",
    },

    {
        title: "Horarios",
        icon: <Calendar size={28} />,
        path: "/horarios",
    },

    {
        title: "Avisos",
        icon: <Bell size={28} />,
        path: "/avisos",
    }

];

function QuickActions() {
    const navigate = useNavigate();

    return (

        <div className="surface-card p-6">

            <h2 className="text-xl font-bold text-primary mb-6">

                Acciones rápidas

            </h2>

            <div className="grid grid-cols-4 gap-5">

                {

                    actions.map(action => (

                        <button
                            key={action.title}
                            onClick={() => navigate(action.path)}
                            className="rounded-xl border border-surface bg-surface text-gray-700 hover:bg-cundi-600 hover:text-white duration-300 p-6 flex flex-col items-center gap-3 shadow-sm dark:bg-[#102618] dark:border-cundi-700 dark:text-gray-200"
                        >

                            {action.icon}

                            <span>

                                {action.title}

                            </span>

                        </button>

                    ))

                }

            </div>

        </div>

    )

}

export default QuickActions;