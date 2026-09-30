import { useEffect, useMemo, useState, type ReactNode } from "react";
import { AuthContext, type AuthUser } from "./authState";
import { menuItems } from "../constants/menu";
import type { Role } from "../constants/roles";
import { loginUsuario } from "../services/backend";

function normalizeRole(value?: string): Role | null {
  const normalized = value?.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
  if (normalized === "udec") return "udec";
  if (normalized === "1") return "student";
  if (normalized === "2") return "admin";
  if (normalized === "3") return "udec";
  if (normalized === "admin" || normalized === "administrador") return "admin";
  if (normalized === "student" || normalized === "estudiante") return "student";
  return null;
}

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("studyplanner-token");
    const saved = localStorage.getItem("studyplanner-user");
    if (!token || token === "local-admin-token" || !saved) {
      localStorage.removeItem("studyplanner-token");
      localStorage.removeItem("studyplanner-user");
      return null;
    }
    try {
      const parsed = JSON.parse(saved) as AuthUser;
      const role = normalizeRole(parsed.role);
      if (!role) {
        localStorage.removeItem("studyplanner-token");
        localStorage.removeItem("studyplanner-user");
        return null;
      }
      return { ...parsed, role };
    } catch {
      localStorage.removeItem("studyplanner-user");
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("studyplanner-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("studyplanner-user");
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      const result = await loginUsuario({
        correo: email.trim().toLowerCase(),
        contrasenia: password,
      });
      if (result.respuesta !== 1 || !result.token) {
        return { ok: false, error: result.mensaje || "Credenciales inválidas." };
      }
      localStorage.setItem("studyplanner-token", result.token);
      const role = normalizeRole(result.rol);
      if (!role) {
        localStorage.removeItem("studyplanner-token");
        return {
          ok: false,
          error: "La autenticación fue exitosa, pero el backend devolvió un ID de rol no reconocido.",
        };
      }

      setUser({
        id: result.idUsuario,
        name: result.nombreUsuario || result.correo || email,
        email: result.correo || email.trim().toLowerCase(),
        role,
      });
      return { ok: true };
    } catch (error) {
      localStorage.removeItem("studyplanner-token");
      return {
        ok: false,
        error: error instanceof Error ? error.message : "No fue posible iniciar sesión.",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("studyplanner-token");
  };

  const canAccess = useMemo(
    () => (path: string) => {
      const normalized = normalizePath(path);
      const menuEntry = menuItems.find((item) => item.path === normalized);

      if (!user || !menuEntry) return false;
      return !menuEntry.allowedRoles || menuEntry.allowedRoles.includes(user.role);
    },
    [user]
  );

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      canAccess,
    }),
    [user, canAccess]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

