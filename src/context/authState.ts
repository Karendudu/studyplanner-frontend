import { createContext, useContext } from "react";
import type { Role } from "../constants/roles";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  faculty?: string;
  semester?: string;
  documento?: string;
  password?: string;
}

export interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  canAccess: (path: string) => boolean;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}