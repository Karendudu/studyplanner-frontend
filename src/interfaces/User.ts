export interface User {
  id: number;
  nombre: string;
  apellido: string;
  correo: string;
  documento: string;
  telefono: string;
  rol: string;
  estado: "Activo" | "Inactivo";
}