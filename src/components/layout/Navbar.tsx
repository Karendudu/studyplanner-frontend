import { useMemo, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Search, UserCircle2 } from "lucide-react";
import { useAuth } from "../../context/authState";
import { roleLabel } from "../../constants/roles";
import { menuItems } from "../../constants/menu";
import NoticeBell from "./NoticeBell";

function Navbar() {
  const { user, canAccess } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  const results = useMemo(() => {
    const query = search.trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (!query) return [];
    return menuItems
      .filter((item) => canAccess(item.path))
      .filter((item) => {
        const searchable = `${item.title} ${item.path}`.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        return searchable.includes(query);
      })
      .slice(0, 6);
  }, [canAccess, search]);

  const openFirstResult = () => {
    if (!results[0]) return;
    void navigate(results[0].path);
    setSearch("");
    setSearchOpen(false);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      setSearchOpen(false);
      setSearch("");
    } else if (event.key === "Enter") {
      event.preventDefault();
      openFirstResult();
    }
  };

  return (
    <header className="relative z-50 h-20 border-b border-[#e3ebe6] bg-white/90 px-8 backdrop-blur-sm">

      <div className="flex h-full items-center justify-between gap-4">

        <div className="relative w-full max-w-md">

          <Search
            size={18}
            className="absolute left-4 top-4 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onFocus={() => setSearchOpen(true)}
            onKeyDown={handleSearchKeyDown}
            onBlur={(event) => {
              if (!event.currentTarget.parentElement?.contains(event.relatedTarget as Node | null)) {
                setSearchOpen(false);
              }
            }}
            placeholder="Buscar secciones..."
            role="combobox"
            aria-label="Buscar secciones"
            aria-autocomplete="list"
            aria-expanded={searchOpen && search.trim().length > 0}
            aria-controls="navbar-search-results"
            className="h-12 w-full rounded-xl border border-[#d6e3db] bg-[#f9fcfa] pl-12 text-[#2a4235] outline-none transition-colors duration-300 focus:border-cundi-400"
          />

          {searchOpen && search.trim() && (
            <div id="navbar-search-results" role="listbox" className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto border border-[#d5dfd7] bg-white py-1 text-[#152e21] shadow-xl">
              {results.length > 0 ? results.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.path}
                    type="button"
                    role="option"
                    aria-selected="false"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      void navigate(item.path);
                      setSearch("");
                      setSearchOpen(false);
                    }}
                    className="flex min-h-12 w-full items-center gap-3 bg-white px-4 py-3 text-left text-sm text-[#152e21] transition hover:bg-[#edf5ef] focus-visible:bg-[#edf5ef] focus-visible:outline-none"
                  >
                    <Icon size={18} className="shrink-0 text-[#087344]" />
                    <span className="text-[#152e21]">{item.title}</span>
                  </button>
                );
              }) : (
                <p className="px-4 py-3 text-sm text-[#63766a]">No se encontraron secciones disponibles.</p>
              )}
            </div>
          )}

        </div>

        <div className="flex items-center gap-6">

          <NoticeBell />

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