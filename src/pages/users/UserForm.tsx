import { useEffect, useState } from "react";
import type { FormEvent } from "react";

interface UserFormProps {
  onSubmit: (data: {
    nombre: string;
    apellido: string;
    correo: string;
    documento: string;
    telefono: string;
    rol: string;
  }) => void;
  onCancel: () => void;
  initialData?: {
    nombre?: string;
    apellido?: string;
    correo?: string;
    documento?: string;
    telefono?: string;
    rol?: string;
  };
}

function UserForm({ onSubmit, onCancel, initialData }: UserFormProps) {
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    correo: "",
    documento: "",
    telefono: "",
    rol: "Administrador",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setForm((prev) => ({ ...prev, ...initialData }));
    }
  }, [initialData]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError("Nombre y apellido son obligatorios.");
      return;
    }

    const email = form.correo.trim().toLowerCase();
    if (!email.endsWith("@ucundinamarca.edu.co")) {
      setError("El correo debe ser institucional @ucundinamarca.edu.co.");
      return;
    }

    if (!/^[0-9]{7,10}$/.test(form.documento.trim())) {
      setError("Documento debe contener entre 7 y 10 dígitos.");
      return;
    }

    if (!/^[0-9]{7,10}$/.test(form.telefono.trim())) {
      setError("Teléfono debe contener entre 7 y 10 dígitos.");
      return;
    }

    onSubmit(form);
    setForm({ nombre: "", apellido: "", correo: "", documento: "", telefono: "", rol: "Administrador" });
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-5">
        <label className="space-y-2 font-medium text-gray-700">
          Nombre
          <input
            value={form.nombre}
            onChange={(event) => handleChange("nombre", event.target.value)}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </label>

        <label className="space-y-2 font-medium text-gray-700">
          Apellido
          <input
            value={form.apellido}
            onChange={(event) => handleChange("apellido", event.target.value)}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </label>
      </div>

      <label className="space-y-2 font-medium text-gray-700">
        Correo
        <input
          type="email"
          value={form.correo}
          onChange={(event) => handleChange("correo", event.target.value)}
          className="w-full mt-2 border rounded-xl p-3"
        />
      </label>

      <div className="grid grid-cols-2 gap-5">
        <label className="space-y-2 font-medium text-gray-700">
          Documento
          <input
            value={form.documento}
            onChange={(event) => handleChange("documento", event.target.value)}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </label>

        <label className="space-y-2 font-medium text-gray-700">
          Teléfono
          <input
            value={form.telefono}
            onChange={(event) => handleChange("telefono", event.target.value)}
            className="w-full mt-2 border rounded-xl p-3"
          />
        </label>
      </div>

      <label className="space-y-2 font-medium text-gray-700">
        Rol
        <select
          value={form.rol}
          onChange={(event) => handleChange("rol", event.target.value)}
          className="w-full mt-2 border rounded-xl p-3"
        >
          <option>Administrador</option>
          <option>Docente</option>
          <option>Estudiante</option>
        </select>
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex justify-end gap-4 pt-5">
        <button type="button" onClick={onCancel} className="border px-6 py-3 rounded-xl">
          Cancelar
        </button>

        <button className="bg-[#007B3E] text-white px-6 py-3 rounded-xl">Guardar</button>
      </div>
    </form>
  );
}

export default UserForm;
