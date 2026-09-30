import { NavLink } from "react-router-dom";
import { menuItems } from "../../constants/menu";
import { useAuth } from "../../context/authState";
import { roleLabel } from "../../constants/roles";

function Sidebar() {
  const { user, logout, canAccess } = useAuth();

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col bg-cundi-500 shadow-xl transition-colors duration-300">

      <div className="h-20 flex items-center justify-center border-b border-cundi-700">

        <h1 className="text-3xl font-bold text-white">

          StudyPlanner

        </h1>

      </div>

      <nav className="mt-8 flex-1 overflow-y-auto pb-6">

        {menuItems
          .filter((item) => canAccess(item.path))
          .map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.title}
                to={item.path}
                className={({ isActive }) =>
                  `mx-3 mb-2 flex items-center gap-4 rounded-xl px-5 py-4 transition-all duration-300 ${
                    isActive
                      ? "bg-cundi-700 text-white shadow-lg"
                      : "text-cundi-900 hover:bg-cundi-700 hover:text-white"
                  }`
                }
              >
                <Icon size={22} />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            );
          })}

      </nav>

      <div className="mt-auto border-t border-green-900 p-6">
        <div className="text-white font-semibold">{user?.name ?? "Invitado"}</div>
        <div className="text-green-200 text-sm">{user ? roleLabel(user.role) : "Invitado"}</div>
        <button onClick={logout} className="mt-3 rounded-lg border border-green-700 px-3 py-2 text-sm text-white hover:bg-[#006536]">
          Cerrar sesión
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;