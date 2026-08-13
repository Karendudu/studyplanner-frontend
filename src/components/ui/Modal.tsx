import { type ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

function Modal({
  open,
  title,
  children,
  onClose,
}: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">

      <div className="surface-card w-full max-w-2xl">

        <div className="flex justify-between items-center border-b border-surface p-6">

          <h2 className="text-2xl font-bold text-primary">
            {title}
          </h2>

          <button onClick={onClose}>

            <X size={24} />

          </button>

        </div>

        <div className="p-6">

          {children}

        </div>

      </div>

    </div>
  );
}

export default Modal;