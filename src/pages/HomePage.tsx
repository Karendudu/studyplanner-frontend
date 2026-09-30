import { useNavigate } from "react-router-dom";
import { Activity, Calendar, Users } from "lucide-react";
import Button from "../components/ui/Button";

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="page-shell relative min-h-screen bg-app overflow-hidden">
      <div className="ambient-grid" aria-hidden />
      <div className="ambient-orb ambient-orb-1" aria-hidden />
      <div className="ambient-orb ambient-orb-2" aria-hidden />
      <div className="ambient-orb ambient-orb-3" aria-hidden />

      <header className="relative z-10 pt-12 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <h1 className="text-4xl font-extrabold text-cundi-700">StudyPlanner</h1>

          <div className="flex items-center gap-3">
            <Button onClick={() => navigate("/login")} size="sm" variant="primary">
              Ingresar
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 flex items-center justify-center py-16">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h2 className="hero-title text-5xl font-extrabold mb-4 text-[#0F2A1D]">Organiza tu tiempo. Aprende mejor.</h2>
          <p className="hero-copy text-lg mb-8">StudyPlanner ayuda a estudiantes y docentes a gestionar horarios, usuarios y notificaciones con una experiencia pensada para la Universidad.</p>

          <div className="flex items-center justify-center gap-6 mb-12 flex-wrap">
            <Button variant="outline" size="lg" onClick={() => navigate("/login")} className="min-w-[180px]">
              Ingreso institucional
            </Button>
            <Button variant="primary" size="lg" onClick={() => navigate("/register")} className="min-w-[180px]">
              Regístrate
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="feature-card surface-card p-6 text-left">
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#007B3E] text-white shadow-lg shadow-[#007B3E]/20">
                <Calendar />
              </div>
              <h3 className="font-semibold mb-2 text-[#152E21]">Horarios dinámicos</h3>
              <p className="text-sm text-[#4F6254]">Organiza y visualiza tus horarios con filtrado por programa y bloque horario.</p>
            </div>

            <div className="feature-card surface-card p-6 text-left">
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#00A99D] text-white shadow-lg shadow-[#00A99D]/20">
                <Users />
              </div>
              <h3 className="font-semibold mb-2 text-[#152E21]">Gestión de usuarios</h3>
              <p className="text-sm text-[#4F6254]">Crea, edita y asigna roles con validación institucional de correo.</p>
            </div>

            <div className="feature-card surface-card p-6 text-left">
              <div className="mb-4 inline-flex items-center justify-center w-14 h-14 rounded-full bg-[#FBE122] text-[#152E21] shadow-lg shadow-[#FBE122]/20">
                <Activity />
              </div>
              <h3 className="font-semibold mb-2 text-[#152E21]">Notificaciones y avisos</h3>
              <p className="text-sm text-[#4F6254]">Mantente al día con avisos importantes y acciones rápidas desde el panel.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-8">
        <div className="max-w-6xl mx-auto text-center text-sm text-[#4F6254] login-credits">Universidad de Cundinamarca — Realizado por Jhon Sebastian Rojas Triana &amp; Juana Valentina Cortes Salazar — 2026</div>
      </footer>
    </div>
  );
}

export default HomePage;
