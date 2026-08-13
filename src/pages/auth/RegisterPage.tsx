import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type Role } from "../../context/AuthContext";

const roles: Array<{ value: Role; label: string }> = [
  { value: "student", label: "Estudiante" },
  { value: "teacher", label: "Docente" },
  { value: "admin", label: "Administrativo" },
];

function RegisterPage() {
  const { register, verifyAccount } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    documento: "",
    telefono: "",
    role: "student" as Role,
    faculty: "",
    semester: "",
  });

  const [error, setError] = useState("");
  const [registrationResult, setRegistrationResult] = useState<{
    email: string;
    password: string;
    code: string;
    emailBody?: string;
  } | null>(null);
  const [verificationCode, setVerificationCode] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");
  const [isVerified, setIsVerified] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setVerificationMessage("");
    setIsVerified(false);

    const result = register({
      name: `${form.name.trim()} ${form.lastName.trim()}`,
      role: form.role,
      email: form.email.trim(),
      documento: form.documento.trim(),
      telefono: form.telefono.trim(),
      faculty: form.faculty.trim() || undefined,
      semester: form.semester.trim() || undefined,
    });

    if (!result.ok) {
      setError(result.message ?? "No se pudo crear la cuenta.");
      return;
    }

    setRegistrationResult({
      email: form.email.trim().toLowerCase(),
      password: result.password ?? "",
      code: result.code ?? "",
      emailBody: result.emailBody,
    });
    setForm({ name: "", lastName: "", email: "", documento: "", telefono: "", role: "student", faculty: "", semester: "" });
  };

  const handleVerify = () => {
    if (!registrationResult) {
      return;
    }

    const result = verifyAccount(registrationResult.email, verificationCode.trim());
    setVerificationMessage(result.message);
    setIsVerified(result.ok);
  };

  return (
    <div className="page-shell min-h-screen flex items-center justify-center px-6 py-10">
      <div className="ambient-grid" aria-hidden />
      <div className="ambient-orb ambient-orb-1" aria-hidden />
      <div className="ambient-orb ambient-orb-2" aria-hidden />
      <div className="ambient-orb ambient-orb-3" aria-hidden />

      <div className="relative z-10 w-full max-w-3xl rounded-3xl bg-surface/95 border border-surface p-8 shadow-xl backdrop-blur dark:bg-[#0D1D16]/90 dark:border-[#21402C]">
        <div className="mb-8 space-y-2">
          <h1 className="text-4xl font-bold text-[#00482B] dark:text-[#E5E7EB]">Registro</h1>
          <p className="text-gray-500">Regístrate con tu correo institucional @ucundinamarca.edu.co para usar StudyPlanner.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Nombre
              <input
                value={form.name}
                onChange={(event) => handleChange("name", event.target.value)}
                placeholder="Nombre"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              Apellido
              <input
                value={form.lastName}
                onChange={(event) => handleChange("lastName", event.target.value)}
                placeholder="Apellido"
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
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="usuario@ucundinamarca.edu.co"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              Documento
              <input
                value={form.documento}
                onChange={(event) => handleChange("documento", event.target.value)}
                placeholder="Cédula"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Teléfono
              <input
                value={form.telefono}
                onChange={(event) => handleChange("telefono", event.target.value)}
                placeholder="3001234567"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                required
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              Rol
              <select
                value={form.role}
                onChange={(event) => handleChange("role", event.target.value)}
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
              >
                {roles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <label className="space-y-2 text-sm font-medium text-gray-700">
              Facultad
              <input
                value={form.faculty}
                onChange={(event) => handleChange("faculty", event.target.value)}
                placeholder="Ingeniería"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              Semestre
              <input
                value={form.semester}
                onChange={(event) => handleChange("semester", event.target.value)}
                placeholder="Semestre 5"
                className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
              />
            </label>
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Link to="/login" className="text-sm text-[#007B3E] hover:underline">
              Ya tengo una cuenta
            </Link>
            <button className="rounded-xl bg-[#007B3E] px-6 py-3 text-white hover:bg-[#006536]">
              Registrarme
            </button>
          </div>
        </form>

        {registrationResult ? (
          <div className="mt-8 rounded-3xl border border-green-200 bg-green-50 p-6">
            <h2 className="text-xl font-semibold text-[#00482B]">Registro exitoso</h2>
            <p className="mt-2 text-gray-700">
              Se ha enviado un código de verificación a tu correo institucional.
            </p>
            <p className="mt-3 text-sm text-gray-600">
              Contraseña provisional: <strong>{registrationResult.password}</strong>
            </p>
            <p className="mt-1 text-sm text-gray-600">
              Código de verificación (simulado): <strong>{registrationResult.code}</strong>
            </p>

            <div className="mt-6 space-y-4">
              <label className="space-y-2 text-sm font-medium text-gray-700">
                Código de verificación
                <input
                  value={verificationCode}
                  onChange={(event) => setVerificationCode(event.target.value)}
                  className="w-full rounded-xl border border-gray-200 p-3 outline-none focus:border-[#007B3E]"
                />
              </label>

              <button
                type="button"
                onClick={handleVerify}
                className="rounded-xl bg-[#007B3E] px-6 py-3 text-white hover:bg-[#006536]"
              >
                Verificar cuenta
              </button>

              {registrationResult?.emailBody ? (
                <div className="rounded-2xl border border-green-200 bg-white p-4 text-sm text-gray-700">
                  <p className="font-semibold text-[#00482B]">Correo simulado enviado:</p>
                  <pre className="whitespace-pre-wrap break-words text-sm text-gray-600 mt-2">{registrationResult.emailBody}</pre>
                </div>
              ) : null}
              {verificationMessage ? (
                <p className={`text-sm ${isVerified ? "text-green-700" : "text-red-600"}`}>
                  {verificationMessage}
                </p>
              ) : null}

              {isVerified ? (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="rounded-xl border border-[#007B3E] px-6 py-3 text-[#007B3E] hover:bg-[#E8F8ED]"
                >
                  Ir a iniciar sesión
                </button>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default RegisterPage;
