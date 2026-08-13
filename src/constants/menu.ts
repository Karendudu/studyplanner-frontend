import {
  LayoutDashboard,
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

interface MenuItem {
  title: string;
  path: string;
  icon: LucideIcon;
  allowedRoles?: Array<"admin" | "teacher" | "student">;
}

export const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Usuarios",
    path: "/usuarios",
    icon: Users,
    allowedRoles: ["admin", "teacher"],
  },
  {
    title: "Programas",
    path: "/programas",
    icon: GraduationCap,
    allowedRoles: ["admin", "teacher", "student"],
  },
  {
    title: "Facultades",
    path: "/facultades",
    icon: School,
    allowedRoles: ["admin"],
  },
  {
    title: "Sedes",
    path: "/sedes",
    icon: Building2,
    allowedRoles: ["admin"],
  },
  {
    title: "Horarios",
    path: "/horarios",
    icon: Calendar,
    allowedRoles: ["admin", "teacher", "student"],
  },
  {
    title: "Materias",
    path: "/materias",
    icon: BookOpen,
    allowedRoles: ["admin", "teacher", "student"],
  },
  {
    title: "Avisos",
    path: "/avisos",
    icon: Bell,
    allowedRoles: ["admin", "teacher", "student"],
  },
  {
    title: "Auditoría",
    path: "/auditoria",
    icon: ShieldCheck,
    allowedRoles: ["admin"],
  },
];