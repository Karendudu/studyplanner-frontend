import {
  Bell,
  Search,
  UserCircle2,
  Moon,
  Sun,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function Navbar() {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="h-20 bg-surface dark:bg-[#0B1410] border-b border-surface dark:border-cundi-700 px-8 flex items-center justify-between backdrop-blur-sm transition-colors duration-300">

      <div className="flex items-center gap-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-4 text-gray-400 dark:text-gray-400"
          />

          <input
            type="text"
            placeholder="Buscar..."
            className="w-96 h-12 rounded-xl border border-gray-200 bg-surface pl-12 text-gray-700 outline-none transition-colors duration-300 focus:border-cundi-400 dark:border-cundi-700 dark:bg-[#0F1F16] dark:text-gray-100 dark:placeholder:text-gray-500"
          />

        </div>

      </div>

      <div className="flex items-center gap-6">

        <button
          type="button"
          onClick={toggleTheme}
          className="flex h-12 w-12 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-600 transition-all duration-300 hover:bg-gray-100 dark:border-gray-700 dark:bg-[#11221a] dark:text-gray-200 dark:hover:bg-[#173022]"
        >
          {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        <button className="relative">

          <Bell
            size={24}
            className="text-gray-600"
          />

          <span className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">

            3

          </span>

        </button>

        <div className="flex items-center gap-3">

          <UserCircle2
            size={42}
            className="text-[#007B3E] dark:text-[#79C000]"
          />

          <div>

            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {user?.name ?? "Invitado"}
            </h3>

            <p className="text-gray-500 text-sm dark:text-gray-300">
              {user?.role === "admin"
                ? "Administrador"
                : user?.role === "teacher"
                ? "Docente"
                : "Estudiante"}
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;