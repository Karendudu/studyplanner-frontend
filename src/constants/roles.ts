export type Role = "admin" | "student" | "udec";

export const routePermissions: Record<string, readonly Role[]> = {
  "/dashboard/usuarios": ["admin", "udec"],
  "/dashboard/programas": ["admin", "udec", "student"],
  "/dashboard/facultades": ["admin", "udec", "student"],
  "/dashboard/sedes": ["admin", "udec", "student"],
  "/dashboard/horarios": ["admin", "udec", "student"],
  "/dashboard/cronograma": ["admin", "udec", "student"],
  "/dashboard/matricula": ["admin", "udec", "student"],
  "/dashboard/materias": ["admin", "udec", "student"],
  "/dashboard/avisos": ["udec", "student"],
  "/dashboard/sabana": ["student"],
};

export function canAccessPath(path: string, role: Role): boolean {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const allowedRoles = routePermissions[normalized];
  return !allowedRoles || allowedRoles.includes(role);
}

export function roleLabel(role: Role) {
  if (role === "admin") return "Administrador";
  if (role === "udec") return "Udec";
  return "Estudiante";
}