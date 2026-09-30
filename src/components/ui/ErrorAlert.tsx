import { useState, useEffect } from "react";

interface ErrorAlertProps {
  mensaje: string;
  tipo?: "error" | "warning" | "info";
  autoDismiss?: number; // en milisegundos
  onClose?: () => void;
}

export default function ErrorAlert({
  mensaje,
  tipo = "error",
  autoDismiss,
  onClose,
}: ErrorAlertProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismiss) {
      const timer = setTimeout(() => {
        setVisible(false);
        onClose?.();
      }, autoDismiss);
      return () => clearTimeout(timer);
    }
  }, [autoDismiss, onClose]);

  if (!visible) return null;

  const styles = {
    error: "border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
    warning: "border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
    info: "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400",
  };

  const iconos = {
    error: "⚠️",
    warning: "⚡",
    info: "ℹ️",
  };

  return (
    <div
      className={`border rounded-lg p-4 flex items-start gap-3 ${styles[tipo]}`}
      role="alert"
    >
      <span className="text-xl flex-shrink-0">{iconos[tipo]}</span>
      <div className="flex-1">
        <p className="font-medium">{mensaje}</p>
      </div>
      <button
        onClick={() => {
          setVisible(false);
          onClose?.();
        }}
        className="flex-shrink-0 text-xl opacity-60 hover:opacity-100 transition"
        aria-label="Cerrar"
      >
        ✕
      </button>
    </div>
  );
}
