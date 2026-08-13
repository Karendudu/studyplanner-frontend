import Modal from "../../components/ui/Modal";
import UserForm from "./UserForm";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: {
    nombre: string;
    apellido: string;
    correo: string;
    documento: string;
    telefono: string;
    rol: string;
  }) => void;
  initialData?: {
    nombre?: string;
    apellido?: string;
    correo?: string;
    documento?: string;
    telefono?: string;
    rol?: string;
  };
  title?: string;
}

function UserModal({ open, onClose, onSubmit, initialData, title }: Props) {
  return (
    <Modal open={open} onClose={onClose} title={title ?? "Nuevo Usuario"}>
      <UserForm onSubmit={onSubmit} onCancel={onClose} initialData={initialData} />
    </Modal>
  );
}

export default UserModal;
