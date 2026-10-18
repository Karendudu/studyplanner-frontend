import { useEffect, useMemo, useState } from "react";
import ErrorAlert from "../../components/ui/ErrorAlert";
import Modal from "../../components/ui/Modal";
import { crearUsuario, crearUsuarioUdec, editarUsuario, eliminarUsuario, getEstudiantes, getEstudiantesPorPrograma, getUsuario } from "../../services/backend";
import { handleApiError } from "../../services/api";
import type { EstudiantesPorPrograma, ReqCrearUsuario, ReqEditarUsuario, Usuario } from "../../services/types";
import type { User } from "../../interfaces/User";
import UserSearch from "./UserSearch";
import UserTable from "./UserTable";
import UserModal from "./UserModal";

type UserRow = User;

function roleName(idRol?: number) {
  if (idRol === 1) return "Estudiante";
  if (idRol === 2) return "Administrador";
  if (idRol === 3) return "Udec";
  return "Sin rol";
}

function toUserRow(usuario: Usuario): UserRow {
  const [nombre = "", ...apellidos] = (usuario.nombre || "").trim().split(/\s+/);
  return {
    id: usuario.idDocumento ?? 0,
    nombre,
    apellido: apellidos.join(" "),
    correo: usuario.correo || "Sin correo",
    documento: String(usuario.idDocumento ?? ""),
    telefono: usuario.telefono || "No registrado",
    rol: roleName(usuario.idRol),
    estado: usuario.idEstado == null ? "Sin dato" : usuario.idEstado === 1 ? "Activo" : "Inactivo",
  };
}

function UsersPage() {
  const [searchText, setSearchText] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [users, setUsers] = useState<UserRow[]>([]);
  const [editingUser, setEditingUser] = useState<UserRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [programReport, setProgramReport] = useState<EstudiantesPorPrograma[] | null>(null);
  const [loadingProgramReport, setLoadingProgramReport] = useState(false);
  useEffect(() => {
    let cancelled = false;

    getEstudiantes()
      .then((data) => {
        if (!cancelled) setUsers(data.map(toUserRow));
      })
      .catch((requestError: unknown) => {
        if (!cancelled) setError(handleApiError(requestError).mensaje);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

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
  ): Promise<boolean> => {
    setError("");
    setSuccess("");
    try {
      if (editingUser) {
        const payload: ReqEditarUsuario = {
          nombre: `${newUser.nombre} ${newUser.apellido}`.trim(),
          telefono: newUser.telefono,
          correo: newUser.correo,
          contrasenia: newUser.contrasenia,
        };
        await editarUsuario(editingUser.id, payload);
        setUsers((prev) =>
          prev.map((u) =>
            u.id === editingUser.id
              ? {
                  ...u,
                  nombre: newUser.nombre,
                  apellido: newUser.apellido,
                  correo: newUser.correo,
                  telefono: newUser.telefono,
                  rol: newUser.rol,
                }
              : u
          )
        );
        setEditingUser(null);
        setSuccess("Usuario actualizado correctamente.");
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
            id: createdUser.idDocumento ?? Number(newUser.documento),
            documento: String(createdUser.idDocumento ?? newUser.documento),
            nombre,
            apellido: apellidos.join(" ") || newUser.apellido,
            correo: createdUser.correo || newUser.correo,
            telefono: createdUser.telefono || newUser.telefono,
            rol: roleName(createdUser.idRol) || newUser.rol,
            estado: createdUser.idEstado == null ? "Sin dato" : createdUser.idEstado === 1 ? "Activo" : "Inactivo",
          },
        ]);
        setSuccess("Usuario creado correctamente.");
      }
      setOpenModal(false);
      return true;
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.mensaje);
      return false;
    }
  };

  const handleEditUser = async (user: UserRow) => {
    setError("");
    try {
      const details = await getUsuario(user.id);
      setEditingUser({ ...user, ...toUserRow(details), id: user.id });
      setOpenModal(true);
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    }
  };

  const handleDeleteUser = (userId: number) => {
    const user = users.find((current) => current.id === userId);
    if (user) setDeleteTarget(user);
  };

  const confirmDeleteUser = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    setError("");
    setSuccess("");
    try {
      await eliminarUsuario(deleteTarget.id);
      setUsers((prev) => prev.filter((user) => user.id !== deleteTarget.id));
      setSuccess("Usuario eliminado correctamente.");
      setDeleteTarget(null);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.mensaje);
    } finally {
      setDeleting(false);
    }
  };

  const loadProgramReport = async () => {
    setLoadingProgramReport(true);
    setError("");
    try {
      setProgramReport(await getEstudiantesPorPrograma());
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setLoadingProgramReport(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[#0f2a1d]">Gestión de Usuarios</h1>
          <p className="text-gray-600">Estudiantes registrados en el backend.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => void loadProgramReport()} disabled={loadingProgramReport} className="h-12 rounded-xl border border-[#a8bdae] px-4 font-semibold text-[#183c29] hover:bg-[#edf5ef] disabled:opacity-60">
            {loadingProgramReport ? "Consultando..." : "Estudiantes por programa"}
          </button>
        </div>
      </div>

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}
      {success && <ErrorAlert mensaje={success} tipo="success" autoDismiss={5000} onClose={() => setSuccess("")} />}
      {programReport !== null && (
        <section className="border border-[#d8e4db] bg-white p-4 text-[#152e21]">
          <h2 className="mb-3 font-semibold">Estudiantes por programa</h2>
          {programReport.length === 0 ? (
            <p className="text-sm text-[#52665a]">No hay programas para mostrar.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[420px] text-left text-sm">
                <thead className="border-b border-[#d8e4db] text-[#52665a]">
                  <tr>
                    <th className="px-3 py-2 font-semibold">Programa</th>
                    <th className="px-3 py-2 text-right font-semibold">Estudiantes</th>
                  </tr>
                </thead>
                <tbody>
                  {programReport.map((program) => (
                    <tr key={program.idPrograma} className="border-b border-[#edf2ee] last:border-0">
                      <td className="px-3 py-3">{program.nombre}</td>
                      <td className="px-3 py-3 text-right font-semibold">{program.cantidadEstudiantes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 dark:bg-slate-700 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          <UserSearch value={searchText} onChange={setSearchText} onNew={() => setOpenModal(true)} />
          {users.length === 0 && !error && (
            <p className="border border-[#d8e4db] bg-[#f7faf7] px-4 py-3 text-sm text-[#52665a]">
              No hay estudiantes para mostrar.
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
          telefono: editingUser.telefono,
          rol: editingUser.rol,
        } : undefined}
        title={editingUser ? "Editar Usuario" : undefined}
      />

      <Modal open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} title="Eliminar usuario">
        <p className="text-sm text-[#344b3b]">
          ¿Seguro que deseas eliminar a <strong>{deleteTarget?.nombre} {deleteTarget?.apellido}</strong>? Esta acción no se puede deshacer.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button type="button" disabled={deleting} onClick={() => setDeleteTarget(null)} className="rounded-md border border-[#bac9bd] px-4 py-2 text-[#294535] disabled:opacity-60">Cancelar</button>
          <button type="button" disabled={deleting} onClick={() => void confirmDeleteUser()} className="rounded-md bg-[#a6332d] px-4 py-2 font-semibold text-white disabled:opacity-60">
            {deleting ? "Eliminando..." : "Sí, eliminar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default UsersPage;
