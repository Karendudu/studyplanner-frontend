import { useState } from "react";
import type { FormEvent } from "react";
import { isInstitutionalEmail, normalizeEmail } from "../../utils/email";

interface UserFormProps {
  onSubmit: (data: {
    nombre: string;
    apellido: string;
    correo: string;
    documento: string;
    telefono: string;
    rol: string;
    contrasenia: string;
  }) => Promise<boolean>;
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
  const [form, setForm] = useState(() => ({
    nombre: initialData?.nombre || "",
    apellido: initialData?.apellido || "",
    correo: initialData?.correo || "",
    documento: initialData?.documento || "",
    telefono: initialData?.telefono || "",
    rol: initialData?.rol || "Estudiante",
    contrasenia: "",
  }));
  const [error, setError] = useState("");

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    if (!form.nombre.trim() || !form.apellido.trim()) {
      setError("Nombre y apellido son obligatorios.");
      return;
    }

    if (form.contrasenia.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    const email = normalizeEmail(form.correo);
    if (!isInstitutionalEmail(email)) {
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

    const saved = await onSubmit(form);
    if (saved) {
      setForm({ nombre: "", apellido: "", correo: "", documento: "", telefono: "", rol: "Estudiante", contrasenia: "" });
    }
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
          pattern=".+@ucundinamarca\.edu\.co"
          title="Usa un correo @ucundinamarca.edu.co."
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
            required
          />
        </label>
      </div>

      {initialData ? (
        <p className="text-sm font-medium text-[#33483a]">Rol actual: {form.rol}</p>
      ) : (
        <label className="space-y-2 font-medium text-gray-700">
        Rol
        <select
          value={form.rol}
          onChange={(event) => handleChange("rol", event.target.value)}
          className="w-full mt-2 border rounded-xl p-3"
        >
          <option>Estudiante</option>
          <option>Udec</option>
        </select>
      </label>
      )}

        <label className="block space-y-2 font-medium text-gray-700">
          {initialData ? "Nueva contraseña" : "Contraseña inicial"}
          <input
            type="password"
            autoComplete="new-password"
            minLength={8}
            value={form.contrasenia}
            onChange={(event) => handleChange("contrasenia", event.target.value)}
            className="mt-2 w-full rounded-xl border p-3"
            required
          />
      </label>

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <div className="flex justify-end gap-4 pt-5">
        <button type="button" onClick={onCancel} className="border px-6 py-3 rounded-xl">
          Cancelar
        </button>

        <button type="submit" className="bg-[#007B3E] text-white px-6 py-3 rounded-xl">Guardar</button>
      </div>
    </form>
  );
}

export default UserForm;
