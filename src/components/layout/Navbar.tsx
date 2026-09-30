import {
  Bell,
  Search,
  UserCircle2,
} from "lucide-react";
import { useAuth } from "../../context/authState";
import { roleLabel } from "../../constants/roles";

function Navbar() {
  const { user } = useAuth();

  return (
    <header className="h-20 border-b border-[#e3ebe6] bg-white/90 px-8 backdrop-blur-sm">

      <div className="flex h-full items-center justify-between gap-4">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-4 top-4 text-gray-400"
          />

          <input
            type="text"
            placeholder="Buscar..."
            className="h-12 w-96 rounded-xl border border-[#d6e3db] bg-[#f9fcfa] pl-12 text-[#2a4235] outline-none transition-colors duration-300 focus:border-cundi-400"
          />

        </div>

        <div className="flex items-center gap-6">

          <button className="relative">

            <Bell
              size={24}
              className="text-gray-600"
            />

            <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">

              3

            </span>

          </button>

          <div className="flex items-center gap-3">

            <UserCircle2
              size={42}
              className="text-[#007B3E]"
            />

            <div>

              <h3 className="font-semibold text-gray-900">
                {user?.name ?? "Invitado"}
              </h3>

              <p className="text-sm text-gray-500">
                {user ? roleLabel(user.role) : "Invitado"}
              </p>

            </div>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Navbar;