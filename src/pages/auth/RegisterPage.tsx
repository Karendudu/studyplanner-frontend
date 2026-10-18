import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import ErrorAlert from "../../components/ui/ErrorAlert";
import { handleApiError } from "../../services/api";
import { crearUsuario } from "../../services/backend";
import { isInstitutionalEmail, normalizeEmail } from "../../utils/email";

function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    documento: "",
    telefono: "",
    contrasenia: "",
    confirmarContrasenia: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    if (form.contrasenia !== form.confirmarContrasenia) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!isInstitutionalEmail(form.correo)) {
      setError("Debes usar un correo @ucundinamarca.edu.co.");
      return;
    }
    setLoading(true);
    try {
      await crearUsuario({
        idPrograma: 1,
        idCodigoUsuario: form.documento.trim(),
        nombre: form.nombre.trim(),
        telefono: form.telefono.trim(),
        correo: normalizeEmail(form.correo),
        contrasenia: form.contrasenia,
      });
      setSuccess("Tu cuenta fue creada. Ya puedes iniciar sesión con tu correo y contraseña.");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell min-h-screen flex items-center justify-center px-6 py-10">
      <div className="ambient-grid" aria-hidden />
      <div className="ambient-orb ambient-orb-1" aria-hidden />
      <div className="ambient-orb ambient-orb-2" aria-hidden />
      <div className="ambient-orb ambient-orb-3" aria-hidden />

      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-surface/95 border border-surface p-8 shadow-xl backdrop-blur dark:bg-[#0D1D16]/90 dark:border-[#21402C]">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-[#00482B] dark:text-[#E5E7EB]">Crear cuenta</h1>
          <p className="text-gray-500">Regístrate como estudiante con tu información institucional.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Nombre completo
              <input
                value={form.nombre}
                onChange={(event) => handleChange("nombre", event.target.value)}
                autoComplete="name"
                maxLength={150}
                placeholder="Nombre y apellidos"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              Documento
              <input
                value={form.documento}
                onChange={(event) => handleChange("documento", event.target.value)}
                autoComplete="off"
                inputMode="numeric"
                pattern="[0-9]{5,15}"
                title="Ingresa entre 5 y 15 dígitos."
                placeholder="Número de documento"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Correo institucional
              <input
                type="email"
                value={form.correo}
                onChange={(event) => handleChange("correo", event.target.value)}
                autoComplete="email"
                pattern=".+@ucundinamarca\.edu\.co"
                title="Usa un correo @ucundinamarca.edu.co."
                placeholder="usuario@ucundinamarca.edu.co"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              Teléfono
              <input
                type="tel"
                value={form.telefono}
                onChange={(event) => handleChange("telefono", event.target.value)}
                autoComplete="tel"
                inputMode="tel"
                maxLength={20}
                placeholder="Número de contacto"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Contraseña
              <input
                type="password"
                value={form.contrasenia}
                onChange={(event) => handleChange("contrasenia", event.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={100}
                placeholder="Mínimo 8 caracteres"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              Confirmar contraseña
              <input
                type="password"
                value={form.confirmarContrasenia}
                onChange={(event) => handleChange("confirmarContrasenia", event.target.value)}
                autoComplete="new-password"
                minLength={8}
                maxLength={100}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>
          </div>

          <div className="rounded-xl border border-[#dce7e1] bg-[#f6fbf8] px-4 py-3 text-sm text-[#315641]">
            Tipo de cuenta: <strong>Estudiante</strong> · Programa: <strong>Ingeniería de Sistemas y Computación</strong>
          </div>

          {error && <ErrorAlert mensaje={error} tipo="error" onClose={() => setError("")} />}
          {success && <ErrorAlert mensaje={success} tipo="info" onClose={() => setSuccess("")} />}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-sm text-[#007B3E] hover:underline">
                Ya tengo una cuenta
              </Link>
              <Button type="button" variant="outline" size="sm" onClick={() => navigate("/login")}>
                Volver al login
              </Button>
            </div>
            <Button
              type="submit"
              disabled={loading || Boolean(success)}
              className="rounded-2xl border border-[#79C000]/40 bg-gradient-to-r from-[#007B3E] to-[#005A2A] shadow-lg"
              variant="primary"
              size="lg"
            >
              {loading ? "Registrando..." : success ? "Cuenta creada" : "Registrarme"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
