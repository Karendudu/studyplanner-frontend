import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { Activity, Calendar, Users } from "lucide-react";

function HomePage() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="page-shell relative min-h-screen bg-app overflow-hidden">
      <div className="ambient-grid" aria-hidden />
      <div className="ambient-orb ambient-orb-1" aria-hidden />
      <div className="ambient-orb ambient-orb-2" aria-hidden />
      <div className="ambient-orb ambient-orb-3" aria-hidden />

      <header className="relative z-10 pt-12 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-cundi-700 dark:text-white">StudyPlanner</h1>

          <div className="flex items-center gap-3">
            <label className="text-sm">Tema</label>
            <select value={theme} onChange={(e) => setTheme(e.target.value as any)} className="rounded-md border border-surface p-1">
              <option value="light">Claro</option>
              <option value="dark">Oscuro</option>
            </select>
            <button onClick={() => navigate('/login')} className="rounded-lg bg-primary px-4 py-2 text-white">Ingresar</button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex items-center justify-center py-16">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="text-5xl font-bold mb-4 text-cundi-700 dark:text-white">Organiza tu tiempo. Aprende mejor.</h2>
          <p className="text-lg text-cundi-700/80 dark:text-gray-200 mb-8">StudyPlanner ayuda a estudiantes y docentes a gestionar horarios, usuarios y notificaciones con una experiencia pensada para la Universidad.</p>

          <div className="flex items-center justify-center gap-6 mb-12">
            <button onClick={() => navigate('/login')} className="rounded-2xl border border-surface px-6 py-3 bg-white/90 hover:scale-105 transition shadow-sm">Ingreso institucional</button>
            <button onClick={() => navigate('/register')} className="rounded-2xl border border-surface px-6 py-3 bg-primary text-white hover:scale-105 transition shadow-sm">Regístrate</button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="feature-card surface-card p-6">
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary text-white">
                <Calendar />
              </div>
              <h3 className="font-semibold mb-2">Horarios dinámicos</h3>
              <p className="text-sm text-cundi-700/80 dark:text-gray-300">Organiza y visualiza tus horarios con filtrado por programa y bloque horario.</p>
            </div>

            <div className="feature-card surface-card p-6">
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-secondary text-white">
                <Users />
              </div>
              <h3 className="font-semibold mb-2">Gestión de usuarios</h3>
              <p className="text-sm text-cundi-700/80 dark:text-gray-300">Crea, edita y asigna roles con validación institucional de correo.</p>
            </div>

            <div className="feature-card surface-card p-6">
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-yellow text-white">
                <Activity />
              </div>
              <h3 className="font-semibold mb-2">Notificaciones y avisos</h3>
              <p className="text-sm text-cundi-700/80 dark:text-gray-300">Mantente al día con avisos importantes y acciones rápidas desde el panel.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-8">
        <div className="max-w-6xl mx-auto text-center text-sm login-credits">Universidad de Cundinamarca — Realizado por Jhon Sebastian Rojas Triana &amp; Juana Valentina Cortes Salazar — 2026</div>
      </footer>
    </div>
  );
}

export default HomePage;
