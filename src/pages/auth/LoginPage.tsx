import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

function LoginPage() {
  const [email, setEmail] = useState("jvalentinacortes@ucundinamarca.edu.co");
  const [password, setPassword] = useState("12345");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const ok = login(email, password);
    if (ok) {
      navigate("/");
      return;
    }
    setError("Credenciales inválidas. Usa tu correo institucional y la contraseña provisional o 12345 para cuentas de demo.");
  };

  return (
    <div className="page-shell relative flex min-h-screen items-center justify-center bg-app p-6">
      <div className="ambient-grid" aria-hidden />
      <div className="ambient-orb ambient-orb-1" aria-hidden />
      <div className="ambient-orb ambient-orb-2" aria-hidden />
      <div className="ambient-orb ambient-orb-3" aria-hidden />

      <div className="relative z-10 w-full max-w-md rounded-3xl bg-surface/95 border border-surface p-8 shadow-xl backdrop-blur dark:bg-[#0D1D16]/90 dark:border-[#21402C] login-card">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-cundi-700 dark:text-[#E5E7EB]">Iniciar sesión</h1>
          <div className="flex items-center gap-2">
            <label className="text-sm">Tema</label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value as "light" | "dark")}
              className="rounded-md border border-surface p-1"
            >
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
          </div>
        </div>
        <p className="mt-2 text-cundi-700/80 dark:text-gray-400">Prueba local para ver permisos por rol.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-cundi-700">Correo</label>
            <input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-xl border border-surface p-3 outline-none focus:border-cundi-600"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-cundi-700">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-xl border border-surface p-3 outline-none focus:border-cundi-600"
            />
          </div>

          {error ? <p className="text-sm text-red-600">{error}</p> : null}

          <button className="w-full rounded-xl bg-primary px-4 py-3 font-semibold text-white hover:brightness-95">
            Cargando StudyPlanner...
          </button>
        </form>

        <div className="mt-6 rounded-xl bg-brand-soft p-4 text-sm text-cundi-700">
          <p className="font-semibold">Usuarios de prueba</p>
          <ul className="mt-2 space-y-1">
            <li>jvalentinacortes@ucunidnamarca.edu.co / 12345 / admin</li>
            <li>ojgomez@ucundinamarca.edu.co / 12345 / docente</li>
            <li>jhonsebastianrojas@ucundinamarca.edu.co / 12345 / estudiante</li>
          </ul>
        </div>

        <div className="mt-6 text-center text-sm text-cundi-700">
          ¿No tienes cuenta? <Link to="/register" className="font-semibold text-primary hover:underline">Regístrate aquí</Link>
        </div>

        {/* credits moved to Home page footer */}
      </div>
    </div>
  );
}

export default LoginPage;
