import { useMemo, useState } from "react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { crearUsuario, crearUsuarioUdec, editarUsuario, eliminarUsuario } from "../../services/backend";
import { handleApiError } from "../../services/api";
import type { ReqCrearUsuario, ReqEditarUsuario } from "../../services/types";
import type { User } from "../../interfaces/User";
import UserSearch from "./UserSearch";
import UserTable from "./UserTable";
import UserModal from "./UserModal";

type UserRow = User;

function UsersPage() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [loading] = useState(false);
  const [error, setError] = useState("");

  const filteredUsers = useMemo(
    () =>
      users.filter((user) =>
        [user.nombre, user.apellido, user.correo, user.documento.toString(), user.rol]
          .join(" ")
          .toLowerCase()
          .includes(searchText.toLowerCase())
      ),
    [searchText, users]
  );

  const handleAddUser = async (
    newUser: Omit<UserRow, "id" | "estado"> & { contrasenia: string }
  ) => {
    try {
      if (editingUser) {
        const payload: ReqEditarUsuario = {
          nombre: newUser.nombre,
          correo: newUser.correo,
        };
        await editarUsuario(editingUser.id, payload);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? { ...u, ...newUser, estado: "Activo" }
              : u
          )
        );
        setEditingUser(null);
      } else {
        const payload: ReqCrearUsuario = {
          idPrograma: 1,
          idCodigoUsuario: newUser.documento.toString(),
          nombre: `${newUser.nombre} ${newUser.apellido}`.trim(),
          telefono: newUser.telefono,
          correo: newUser.correo,
          contrasenia: newUser.contrasenia,
        };
        const createdUser = newUser.rol === "Udec"
          ? await crearUsuarioUdec(payload)
          : await crearUsuario(payload);
        const [nombre, ...apellidos] = (createdUser.nombre || newUser.nombre).split(" ");
        setUsers((prev) => [
          ...prev,
          {
            ...newUser,
            id: createdUser.idDocumento ?? Number(newUser.documento),
            documento: String(createdUser.idDocumento ?? newUser.documento),
            nombre,
            apellido: apellidos.join(" ") || newUser.apellido,
            correo: createdUser.correo || newUser.correo,
            telefono: createdUser.telefono || newUser.telefono,
            rol: createdUser.idRolNavigation?.nombreRol || newUser.rol,
            estado: "Activo",
          },
        ]);
      }
      setOpenModal(false);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.mensaje);
    }
  };

  const handleEditUser = (user: UserRow) => {
    setEditingUser(user);
    setOpenModal(true);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await eliminarUsuario(userId);
      setUsers((prev) => prev.filter((user) => user.id !== userId));
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.mensaje);
    }
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

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <UserSearch value={searchText} onChange={setSearchText} onNew={() => setOpenModal(true)} />
          {users.length === 0 && (
            <p className="border border-[#d8e4db] bg-[#f7faf7] px-4 py-3 text-sm text-[#52665a]">
              El backend aún no ofrece un endpoint para consultar el listado completo de usuarios.
            </p>
          )}
          <UserTable users={filteredUsers} onDelete={handleDeleteUser} onEdit={handleEditUser} />
        </>
      )}

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
          telefono: "",
          rol: editingUser.rol,
        } : undefined}
        title={editingUser ? "Editar Usuario" : undefined}
      />
    </div>
  );
}

export default UsersPage;
