import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, LoaderCircle, MailCheck } from "lucide-react";
import Button from "../../components/ui/Button";
import { handleApiError } from "../../services/api";
import {
  cambiarContraseniaRecuperacion,
  solicitarRecuperacionContrasenia,
  verificarCodigoRecuperacion,
} from "../../services/backend";
import { isInstitutionalEmail, normalizeEmail } from "../../utils/email";

type RecoveryStep = "request" | "verify" | "change" | "complete";

function PasswordRecoveryPage() {
  const [step, setStep] = useState<RecoveryStep>("request");
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [nuevaContrasenia, setNuevaContrasenia] = useState("");
  const [confirmarContrasenia, setConfirmarContrasenia] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const requestCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isInstitutionalEmail(correo)) {
      setError("Ingresa tu correo @ucundinamarca.edu.co.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await solicitarRecuperacionContrasenia({ correo: normalizeEmail(correo) });
      setNotice("Si el correo corresponde a una cuenta registrada, recibirás instrucciones para recuperar tu contraseña.");
      setStep("verify");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSubmitting(false);
    }
  };

  const verifyCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await verificarCodigoRecuperacion({ correo: normalizeEmail(correo), codigo: codigo.trim() });
      setNotice("Código verificado. Ahora define tu nueva contraseña.");
      setStep("change");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSubmitting(false);
    }
  };

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (nuevaContrasenia !== confirmarContrasenia) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await cambiarContraseniaRecuperacion({
        correo: normalizeEmail(correo),
        codigo: codigo.trim(),
        nuevaContrasenia,
      });
      setNotice("Tu contraseña fue actualizada. Ya puedes iniciar sesión.");
      setStep("complete");
    } catch (requestError) {
      setError(handleApiError(requestError).mensaje);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell relative flex min-h-screen items-center justify-center bg-app p-4 sm:p-6">
      <div className="ambient-grid" aria-hidden />
      <div className="ambient-orb ambient-orb-1" aria-hidden />
      <div className="ambient-orb ambient-orb-2" aria-hidden />
      <div className="relative z-10 w-full max-w-xl rounded-3xl border border-[#dbe8e1] bg-white p-6 shadow-[0_30px_95px_rgba(21,46,33,0.14)] sm:p-9">
        <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-[#315641] hover:underline">
          <ArrowLeft size={16} /> Volver al inicio de sesión
        </Link>

        <header className="mt-7">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#2f6a4b]">Recuperación de cuenta</p>
          <h1 className="mt-2 text-3xl font-black text-[#0f2a1d]">{step === "complete" ? "Contraseña actualizada" : "Recuperar contraseña"}</h1>
          {step !== "complete" && (
            <p className="mt-2 text-sm text-[#4f6254]">
              {step === "request" && "Te enviaremos un código al correo asociado a tu cuenta."}
              {step === "verify" && "Escribe el código que recibiste por correo."}
              {step === "change" && "Verificamos el código. Ahora crea una contraseña nueva."}
            </p>
          )}
        </header>

        {notice && (
          <div role="status" className="mt-5 flex gap-3 border border-[#b8d7c3] bg-[#f1f8f3] px-4 py-3 text-sm text-[#155b37]">
            {step === "complete" ? <CheckCircle2 size={18} className="mt-0.5 shrink-0" /> : <MailCheck size={18} className="mt-0.5 shrink-0" />}
            <p>{notice}</p>
          </div>
        )}

        {error && <p role="alert" className="mt-5 border border-[#e6b7b3] bg-[#fff3f2] px-4 py-3 text-sm text-[#8f2824]">{error}</p>}

        {step === "request" && (
          <form className="mt-6 space-y-5" onSubmit={(event) => void requestCode(event)}>
            <label className="block text-sm font-semibold text-[#1f3b2d]">
              Correo de tu cuenta
              <input type="email" required pattern=".+@ucundinamarca\.edu\.co" title="Usa un correo @ucundinamarca.edu.co." autoComplete="email" value={correo} onChange={(event) => setCorreo(event.target.value)} disabled={submitting} className="mt-2 w-full rounded-xl border border-[#d6e3db] bg-white px-4 py-3 text-sm text-[#152e21] outline-none focus:border-[#56a875] focus:ring-4 focus:ring-[#79c000]/20" />
            </label>
            <Button type="submit" disabled={submitting} className="w-full rounded-xl" size="lg">
              {submitting ? <><LoaderCircle size={18} className="mr-2 animate-spin" />Enviando código...</> : "Enviar código"}
            </Button>
          </form>
        )}

        {step === "verify" && (
          <form className="mt-6 space-y-5" onSubmit={(event) => void verifyCode(event)}>
            <p className="text-sm text-[#52665a]">Código enviado a <strong>{correo}</strong></p>
            <label className="block text-sm font-semibold text-[#1f3b2d]">
              Código de verificación
              <input type="text" required inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" maxLength={6} value={codigo} onChange={(event) => setCodigo(event.target.value.replace(/\D/g, "").slice(0, 6))} disabled={submitting} className="mt-2 w-full rounded-xl border border-[#d6e3db] bg-white px-4 py-3 text-sm tracking-[0.25em] text-[#152e21] outline-none focus:border-[#56a875] focus:ring-4 focus:ring-[#79c000]/20" />
            </label>
            <Button type="submit" disabled={submitting} className="w-full rounded-xl" size="lg">
              {submitting ? <><LoaderCircle size={18} className="mr-2 animate-spin" />Verificando...</> : "Verificar código"}
            </Button>
            <button type="button" disabled={submitting} onClick={() => { setStep("request"); setError(""); setNotice(""); }} className="w-full text-sm font-medium text-[#315641] hover:underline">Usar otro correo</button>
          </form>
        )}

        {step === "change" && (
          <form className="mt-6 space-y-5" onSubmit={(event) => void changePassword(event)}>
            <label className="block text-sm font-semibold text-[#1f3b2d]">
              Nueva contraseña
              <input type="password" required minLength={8} maxLength={100} autoComplete="new-password" value={nuevaContrasenia} onChange={(event) => setNuevaContrasenia(event.target.value)} disabled={submitting} className="mt-2 w-full rounded-xl border border-[#d6e3db] bg-white px-4 py-3 text-sm text-[#152e21] outline-none focus:border-[#56a875] focus:ring-4 focus:ring-[#79c000]/20" />
            </label>
            <label className="block text-sm font-semibold text-[#1f3b2d]">
              Confirmar contraseña
              <input type="password" required minLength={8} maxLength={100} autoComplete="new-password" value={confirmarContrasenia} onChange={(event) => setConfirmarContrasenia(event.target.value)} disabled={submitting} className="mt-2 w-full rounded-xl border border-[#d6e3db] bg-white px-4 py-3 text-sm text-[#152e21] outline-none focus:border-[#56a875] focus:ring-4 focus:ring-[#79c000]/20" />
            </label>
            <Button type="submit" disabled={submitting} className="w-full rounded-xl" size="lg">
              {submitting ? <><LoaderCircle size={18} className="mr-2 animate-spin" />Actualizando...</> : "Cambiar contraseña"}
            </Button>
          </form>
        )}

        {step === "complete" && (
          <Link to="/login" className="mt-6 inline-flex w-full items-center justify-center rounded-xl bg-[#087344] px-5 py-3.5 font-semibold text-white hover:bg-[#075d38]">
            Ir a iniciar sesión
          </Link>
        )}
      </div>
    </main>
  );
}

export default PasswordRecoveryPage;