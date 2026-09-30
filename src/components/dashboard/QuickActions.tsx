import { Link } from "react-router-dom";
import { menuItems } from "../../constants/menu";
import { useAuth } from "../../context/authState";

function QuickActions() {
    const { canAccess } = useAuth();
    const actions = menuItems.filter(
        (item) => item.path !== "/dashboard" && canAccess(item.path)
    );

    return (
        <section className="surface-card p-6">
            <h2 className="mb-6 text-xl font-bold text-[#0f2a1d]">Acciones rápidas</h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                        <Link
                            key={action.path}
                            to={action.path}
                            className="group flex flex-col items-center gap-3 rounded-2xl border border-[#dce7e1] bg-white p-5 text-[#152e21] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#6cb68a] hover:bg-[#f4fbf7] hover:shadow-[0_14px_28px_rgba(15,42,29,0.12)]"
                        >
                            <Icon size={26} aria-hidden="true" />
                            <span className="text-center font-medium">{action.title}</span>
                        </Link>
                    );
                })}
            </div>
        </section>
    );
}

export default QuickActions;