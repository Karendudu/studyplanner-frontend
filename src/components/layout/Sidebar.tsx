import { NavLink } from "react-router-dom";
import { menuItems } from "../../constants/menu";
import { useAuth } from "../../context/authState";
import { roleLabel } from "../../constants/roles";

function Sidebar() {
  const { user, logout, canAccess } = useAuth();

  return (
    <aside className="sticky top-0 flex h-screen w-72 flex-col bg-[#e6f0ea] text-black shadow-xl transition-colors duration-300">

      <div className="h-20 flex items-center justify-center border-b border-[#c6d8ca]">

        <h1 className="text-3xl font-bold text-[#0f2a1d]">

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
                      ? "bg-[#cce5d4] text-black shadow-sm"
                      : "text-black hover:bg-[#d5eadb] hover:text-black"
                  }`
                }
              >
                <Icon size={22} />
                <span className="font-medium">{item.title}</span>
              </NavLink>
            );
          })}

      </nav>

      <div className="mt-auto border-t border-[#c6d8ca] p-6">
        <NavLink to="/dashboard/perfil" className="block truncate font-semibold text-black hover:text-[#087344] hover:underline" title="Mi perfil">
          {user?.name ?? "Invitado"}
        </NavLink>
        {user?.email && <div className="truncate text-xs text-[#52665a]">{user.email}</div>}
        <div className="text-sm text-[#33483a]">{user ? roleLabel(user.role) : "Invitado"}</div>
        <button onClick={logout} className="mt-3 rounded-lg border border-[#63816b] px-3 py-2 text-sm text-black hover:bg-[#d5eadb]">
          Cerrar sesión
        </button>
      </div>

    </aside>
  );
}

export default Sidebar;