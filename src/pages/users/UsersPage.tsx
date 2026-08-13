import { useMemo, useState } from "react";
import UserSearch from "./UserSearch";
import UserTable from "./UserTable";
import UserModal from "./UserModal";
import { users as initialUsers } from "../../services/userService";
import type { User } from "../../interfaces/User";

function UsersPage() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        [user.nombre, user.apellido, user.correo, user.documento, user.rol]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ),
    [searchText, users]
  );

  const handleAddUser = (newUser: Omit<User, "id" | "estado">) => {
    if (editingUser) {
      // update existing
      setUsers((prev) => prev.map((u) => (u.id === editingUser.id ? { ...u, ...newUser } : u)));
      setEditingUser(null);
      setOpenModal(false);
      return;
    }

    const nextId = users.length ? Math.max(...users.map((user) => user.id)) + 1 : 1;
    setUsers((prev) => [
      ...prev,
      { ...newUser, id: nextId, estado: "Activo" as const },
    ]);
    setOpenModal(false);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleDeleteUser = (userId: number) => {
    setUsers((prev) => prev.filter((user) => user.id !== userId));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#00482B]">Gestión de Usuarios</h1>
          <p className="text-gray-500">Administración de usuarios del sistema.</p>
        </div>

        <button
          type="button"
          onClick={() => setOpenModal(true)}
          className="h-12 rounded-xl bg-[#007B3E] px-6 text-white hover:bg-[#006536]"
        >
          Nuevo Usuario
        </button>
      </div>

      <UserSearch value={searchText} onChange={setSearchText} onNew={() => setOpenModal(true)} />

      <UserTable users={filteredUsers} onDelete={handleDeleteUser} onEdit={handleEditUser} />

      <UserModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditingUser(null);
        }}
        onSubmit={handleAddUser}
        initialData={editingUser ? {
          nombre: editingUser.nombre,
          apellido: editingUser.apellido,
          correo: editingUser.correo,
          documento: editingUser.documento,
          telefono: editingUser.telefono,
          rol: editingUser.rol,
        } : undefined}
        title={editingUser ? "Editar Usuario" : undefined}
      />
    </div>
  );
}

export default UsersPage;
