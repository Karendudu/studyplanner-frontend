import { Pencil, Trash2 } from "lucide-react";
import Badge from "../../components/ui/Badge";
import type { User } from "../../interfaces/User";

interface UserTableProps {
  users: User[];
  onEdit?: (user: User) => void;
  onDelete?: (id: number) => void;
}

function UserTable({ users, onEdit, onDelete }: UserTableProps) {
  return (
    <div className="surface-card overflow-hidden">
      <table className="w-full">
        <thead className="bg-[#00482B] text-white">
          <tr>
            <th className="p-4 text-left">Nombre</th>
            <th className="text-left">Correo</th>
            <th className="text-left">Documento</th>
            <th className="text-left">Rol</th>
            <th className="text-left">Estado</th>
            <th className="text-left">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b hover:bg-cundi-100 dark:hover:bg-[#173022]">
              <td className="p-4">{user.nombre} {user.apellido}</td>
              <td>{user.correo}</td>
              <td>{user.documento}</td>
              <td>{user.rol}</td>
              <td>
                <Badge
                  text={user.estado}
                  color={user.estado === "Activo" ? "green" : "red"}
                />
              </td>
              <td>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit?.(user)}
                    className="bg-yellow-400 hover:bg-yellow-500 p-2 rounded-lg"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete?.(user.id)}
                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UserTable;
