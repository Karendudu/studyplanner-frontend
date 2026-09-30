import {
  LayoutDashboard,
  FileUp,
  Users,
  GraduationCap,
  School,
  Building2,
  Calendar,
  BookOpen,
  Bell,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Role } from "./roles";

interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  allowedRoles?: Role[];
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    path: "/dashboard/usuarios",
    icon: Users,
    allowedRoles: ["admin", "udec"],
  },
  {
    title: "Núcleos y Materias",
    path: "/dashboard/programas",
    icon: GraduationCap,
    allowedRoles: ["admin", "udec", "student"],
  },
  {
    title: "Facultades",
    path: "/dashboard/facultades",
    icon: School,
    allowedRoles: ["admin", "udec", "student"],
  },
  {
    title: "Sedes",
    path: "/dashboard/sedes",
    icon: Building2,
    allowedRoles: ["admin", "udec", "student"],
  },
  {
    title: "Horarios",
    path: "/dashboard/horarios",
    icon: Calendar,
    allowedRoles: ["admin", "udec", "student"],
  },
  {
    title: "Materias",
    path: "/dashboard/materias",
    icon: BookOpen,
    allowedRoles: ["admin", "udec", "student"],
  },
  {
    title: "Avisos",
    path: "/dashboard/avisos",
    icon: Bell,
    allowedRoles: ["admin", "udec", "student"],
  },
  {
    title: "Auditoría",
    path: "/dashboard/auditoria",
    icon: ShieldCheck,
    allowedRoles: ["admin", "udec"],
  },
  {
    title: "Mi sábana",
    path: "/dashboard/sabana",
    icon: FileUp,
    allowedRoles: ["student"],
  },
];