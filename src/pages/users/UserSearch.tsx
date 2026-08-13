import { Search } from "lucide-react";

interface UserSearchProps {
  value: string;
  onChange: (value: string) => void;
  onNew: () => void;
}

function UserSearch({ value, onChange, onNew }: UserSearchProps) {
  return (
    <div className="surface-card p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-4 top-4 text-gray-400" />
          <input
            value={value}
            onChange={(event) => onChange(event.target.value)}
            placeholder="Buscar usuario..."
            className="w-full h-12 rounded-xl border border-gray-200 pl-12 outline-none focus:border-[#007B3E]"
          />
        </div>

        <button
          type="button"
          onClick={onNew}
          className="h-12 rounded-xl bg-[#007B3E] px-6 text-white hover:bg-[#006536]"
        >
          Nuevo Usuario
        </button>
      </div>
    </div>
  );
}

export default UserSearch;
