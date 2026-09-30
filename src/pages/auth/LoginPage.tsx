import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import { useAuth } from "../../context/authState";
import Button from "../../components/ui/Button";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError("");
    const result = await login(email, password);
    if (result.ok) {
      navigate("/dashboard");
      return;
    }
    setError(result.error || "Credenciales inválidas.");
  };

  return (
    <div className="page-shell relative flex min-h-screen items-center justify-center bg-app p-4 sm:p-6">
      <div className="ambient-grid" aria-hidden />
      <div className="ambient-orb ambient-orb-1" aria-hidden />
      <div className="ambient-orb ambient-orb-2" aria-hidden />
      <div className="ambient-orb ambient-orb-3" aria-hidden />

      <div className="relative z-10 w-full max-w-5xl overflow-hidden rounded-[34px] border border-[#dbe8e1] bg-white shadow-[0_30px_95px_rgba(21,46,33,0.14)]">
        <div className="grid lg:grid-cols-[1.1fr_1fr]">
          <section className="relative overflow-hidden border-b border-[#e7efe9] bg-[linear-gradient(150deg,#0f2a1d_0%,#184531_45%,#1f6b44_100%)] px-7 pb-8 pt-8 text-white lg:border-b-0 lg:border-r lg:border-r-[#2c6b4f] lg:px-9 lg:pb-10 lg:pt-10">
            <div className="absolute -right-20 -top-20 h-60 w-60 rounded-full bg-[#79c000]/20 blur-3xl" aria-hidden />
            <div className="absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[#00a99d]/20 blur-3xl" aria-hidden />

            <div className="relative">
              <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[#daf4df]">
                <Sparkles size={14} />
                StudyPlanner
              </p>

              <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-[-0.04em] text-white sm:text-[2.65rem]">
                Un acceso más claro,
                <span className="block text-[#b9f08c]">rápido y elegante</span>
              </h1>

              <p className="mt-4 max-w-md text-sm leading-relaxed text-[#d6eadb] sm:text-base">
                Ingresa con tu cuenta institucional y continúa según los permisos asignados a tu rol.
              </p>

              <div className="mt-8 space-y-3">
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <ShieldCheck size={18} className="text-[#b9f08c]" />
                  <p className="text-sm text-[#e8f7ec]">Acceso con la cuenta institucional asignada.</p>
                </div>
                <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-sm">
                  <ArrowRight size={18} className="text-[#b9f08c]" />
                  <p className="text-sm text-[#e8f7ec]">Diseño optimizado para desktop y móvil.</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-[linear-gradient(180deg,#ffffff_0%,#f8fcfa_100%)] px-6 pb-7 pt-7 sm:px-8 sm:pb-8 sm:pt-8">
            <div className="mb-6">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2f6a4b]">Acceso institucional</p>
              <h2 className="mt-2 text-3xl font-black tracking-[-0.03em] text-[#0f2a1d]">Iniciar sesión</h2>
              <p className="mt-2 text-sm text-[#4f6254]">Usa el correo y la contraseña de tu cuenta.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f3b2d]">Correo</label>
                <input
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full rounded-2xl border border-[#d6e3db] bg-white px-4 py-3.5 text-sm text-[#152e21] shadow-[inset_0_1px_2px_rgba(8,34,20,0.05)] outline-none transition focus:border-[#56a875] focus:ring-4 focus:ring-[#79c000]/20"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#1f3b2d]">Contraseña</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Ingresa tu contraseña"
                    className="w-full rounded-2xl border border-[#d6e3db] bg-white px-4 py-3.5 pr-12 text-sm text-[#152e21] shadow-[inset_0_1px_2px_rgba(8,34,20,0.05)] outline-none transition focus:border-[#56a875] focus:ring-4 focus:ring-[#79c000]/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl p-2 text-[#4f6254] transition hover:bg-[#eef6f1]"
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error ? <p className="rounded-xl border border-[#ffd8d5] bg-[#fff3f2] px-3 py-2 text-sm text-[#b42318]">{error}</p> : null}

              <Button
                type="submit"
                className="group w-full rounded-2xl border-0 bg-[linear-gradient(135deg,#0f7f46_0%,#12a15a_70%,#1ebc6b_100%)] text-white shadow-[0_14px_34px_rgba(22,135,79,0.34)]"
                variant="primary"
                size="lg"
              >
                <span className="inline-flex items-center gap-2">
                  Entrar al panel
                  <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </Button>
            </form>

            <div className="mt-6 space-y-3 border-t border-[#e6eee8] pt-5 text-center text-sm text-[#4f6254]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => navigate("/")}
                className="w-full rounded-2xl border border-[#d6e3db] bg-white text-[#18482f] hover:bg-[#f6fbf8]"
              >
                Volver al inicio
              </Button>

              <p>¿Necesitas una cuenta? Solicítala al administrador de StudyPlanner.</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
