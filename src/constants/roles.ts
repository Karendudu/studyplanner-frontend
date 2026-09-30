export type Role = "admin" | "student" | "udec";

export function roleLabel(role: Role) {
  if (role === "admin") return "Administrador";
  if (role === "udec") return "Udec";
  return "Estudiante";
}