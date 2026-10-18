import { useEffect, useState, type FormEvent } from "react";
import { useAuth } from "../../context/authState";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { handleApiError } from "../../services/api";
import { editarUsuario, getUsuario } from "../../services/backend";
import { isInstitutionalEmail, normalizeEmail } from "../../utils/email";

function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [nombre, setNombre] = useState(user?.name || "");
  const [telefono, setTelefono] = useState(user?.telefono || "");
  const [correo, setCorreo] = useState(user?.email || "");
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [loading, setLoading] = useState(Boolean(user?.id));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    let cancelled = false;

    getUsuario(user.id)
      .then((profile) => {
        if (cancelled) return;
        setNombre(profile.nombre || user.name);
        setTelefono(profile.telefono || "");
        setCorreo(profile.correo || user.email);
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
  }, [user?.id, user?.name, user?.email]);

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user?.id) return;
    setError("");
    setSuccess("");

    if (nuevaContrasenia !== confirmarContrasenia) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!isInstitutionalEmail(correo)) {
      setError("Debes usar un correo @ucundinamarca.edu.co.");
      return;
    }

    setSaving(true);
    try {
      const updated = await editarUsuario(user.id, {
        nombre: nombre.trim(),
        telefono: telefono.trim(),
        correo: normalizeEmail(correo),
        contrasenia: nuevaContrasenia,
      });
      const nextName = updated.nombre || nombre.trim();
      const nextEmail = normalizeEmail(updated.correo || correo);
      const nextPhone = updated.telefono || telefono.trim();
      setNombre(nextName);
      setCorreo(nextEmail);
      setTelefono(nextPhone);
      updateProfile({ name: nextName, email: nextEmail, telefono: nextPhone });
      setNuevaContrasenia("");
      setConfirmarContrasenia("");
      setSuccess("Tus datos se actualizaron correctamente.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl space-y-6 text-[#152e21]">
      <header className="border-b border-[#d5dfd7] pb-5">
        <h1 className="text-3xl font-bold text-[#0f2a1d]">Mi perfil</h1>
        <p className="mt-2 text-[#506557]">Actualiza los datos de tu cuenta.</p>
      </header>

      {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}
      {success && <ErrorAlert mensaje={success} tipo="success" autoDismiss={5000} onClose={() => setSuccess("")} />}

      {loading ? (
        <p role="status" className="text-sm text-[#506557]">Cargando perfil...</p>
      ) : (
        <form onSubmit={(event) => void saveProfile(event)} className="space-y-5 border border-[#d5dfd7] bg-white p-5 sm:p-6">
          <label className="block text-sm font-semibold text-[#294535]">
            Nombre completo
            <input required maxLength={150} autoComplete="name" value={nombre} onChange={(event) => setNombre(event.target.value)} disabled={saving} className="mt-2 w-full rounded-md border border-[#cbd9ce] p-3 text-black outline-none focus:border-[#56a875]" />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block text-sm font-semibold text-[#294535]">
              Teléfono
              <input required type="tel" autoComplete="tel" value={telefono} onChange={(event) => setTelefono(event.target.value)} disabled={saving} className="mt-2 w-full rounded-md border border-[#cbd9ce] p-3 text-black outline-none focus:border-[#56a875]" />
            </label>
            <label className="block text-sm font-semibold text-[#294535]">
              Correo
              <input required type="email" pattern=".+@ucundinamarca\.edu\.co" title="Usa un correo @ucundinamarca.edu.co." autoComplete="email" value={correo} onChange={(event) => setCorreo(event.target.value)} disabled={saving} className="mt-2 w-full rounded-md border border-[#cbd9ce] p-3 text-black outline-none focus:border-[#56a875]" />
            </label>
          </div>
          <fieldset className="grid gap-5 border-t border-[#edf2ee] pt-5 sm:grid-cols-2">
            <legend className="px-1 text-sm font-semibold text-[#294535]">Nueva contraseña</legend>
            <label className="block text-sm font-medium text-[#52665a]">
              Contraseña (mínimo 8 caracteres)
              <input required type="password" minLength={8} maxLength={100} autoComplete="new-password" value={nuevaContrasenia} onChange={(event) => setNuevaContrasenia(event.target.value)} disabled={saving} className="mt-2 w-full rounded-md border border-[#cbd9ce] p-3 text-black outline-none focus:border-[#56a875]" />
            </label>
            <label className="block text-sm font-medium text-[#52665a]">
              Confirmar contraseña
              <input required type="password" minLength={8} maxLength={100} autoComplete="new-password" value={confirmarContrasenia} onChange={(event) => setConfirmarContrasenia(event.target.value)} disabled={saving} className="mt-2 w-full rounded-md border border-[#cbd9ce] p-3 text-black outline-none focus:border-[#56a875]" />
            </label>
          </fieldset>
          <div className="flex justify-end border-t border-[#edf2ee] pt-4">
            <button type="submit" disabled={saving} className="rounded-md bg-[#087344] px-5 py-2.5 font-semibold text-white hover:bg-[#075d38] disabled:cursor-not-allowed disabled:opacity-60">
              {saving ? "Guardando cambios..." : "Guardar cambios"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default ProfilePage;