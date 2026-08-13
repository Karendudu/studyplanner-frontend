import { type User } from "../interfaces/User";

export const users: User[] = [
  {
    id: 1,
    nombre: "Karen",
    apellido: "Gómez",
    correo: "karen@gmail.com",
    documento: "1001234567",
    telefono: "3001234567",
    rol: "Administrador",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan@gmail.com",
    documento: "1012345678",
    telefono: "3111234567",
    rol: "Docente",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "Laura",
    apellido: "Rodríguez",
    correo: "laura@gmail.com",
    documento: "1023456789",
    telefono: "3209876543",
    rol: "Estudiante",
    estado: "Inactivo",
  },
];