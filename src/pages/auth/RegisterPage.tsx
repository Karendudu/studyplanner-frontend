import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import ErrorAlert from "../../components/ui/ErrorAlert";

const roles = [
  { value: "student", label: "Estudiante" },
  { value: "teacher", label: "Docente" },
  { value: "admin", label: "Administrativo" },
];

function RegisterPage() {
  const navigate = useNavigate();
  const fixedFaculty = "Ingeniería";

  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    documento: "",
    telefono: "",
    role: "student",
    faculty: fixedFaculty,
    semester: "1",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setError("Registro temporalmente deshabilitado mientras el backend está en mantenimiento. Ingresa con el usuario administrador de prueba.");
    }, 300);
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
                readOnly
                className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 p-3 text-gray-600"
              />
            </label>

            <label className="space-y-2 text-sm font-medium text-gray-700">
              Semestre: <span className="font-bold text-[#007B3E]">{form.semester}</span>
              <input
                type="range"
                min={1}
                max={10}
                step={1}
                value={form.semester}
                onChange={(event) => handleChange("semester", event.target.value)}
                className="w-full accent-[#007B3E]"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>Sem 1</span>
                <span>Sem 10</span>
              </div>
            </label>
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
              disabled={loading}
              className="rounded-2xl border border-[#79C000]/40 bg-gradient-to-r from-[#007B3E] to-[#005A2A] shadow-lg"
              variant="primary"
              size="lg"
            >
              {loading ? "Registrando..." : "Registrarme"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
