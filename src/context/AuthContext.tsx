import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { menuItems } from "../constants/menu";

export type Role = "admin" | "teacher" | "student";

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

interface RegisterPayload {
  name: string;
  role: Role;
  email: string;
  documento: string;
  telefono: string;
  faculty?: string;
  semester?: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  canAccess: (path: string) => boolean;
  register: (payload: RegisterPayload) => {
    ok: boolean;
    message?: string;
    password?: string;
    code?: string;
    emailBody?: string;
  };
  verifyAccount: (email: string, code: string) => { ok: boolean; message: string };
}

const demoUsers: AuthUser[] = [
  {
    id: 1,
    name: "Juana Valentina Cortes Salazar",
    email: "jvalentinacortes@ucundinamarca.edu.co",
    role: "admin",
    faculty: "Ingeniería",
    documento: "1098765432",
    password: "12345",
  },
  {
    id: 2,
    name: "Oscar Gómez",
    email: "ojgomez@ucundinamarca.edu.co",
    role: "teacher",
    faculty: "Ingeniería",
    documento: "1076543210",
    password: "12345",
  },
  {
    id: 3,
    name: "Jhon Sebastián Rojas",
    email: "jhonsebastianrojas@ucundinamarca.edu.co",
    role: "student",
    semester: "Semestre 5",
    documento: "1087654321",
    password: "12345",
  },
];

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function normalizePath(path: string) {
  if (!path || path === "/") return "/";
  return path.startsWith("/") ? path : `/${path}`;
}

const verificationCodesKey = "studyplanner-verification-codes";

function getSavedVerificationCodes(): Record<string, string> {
  const saved = localStorage.getItem(verificationCodesKey);
  return saved ? JSON.parse(saved) : {};
}

function saveVerificationCode(email: string, code: string) {
  const codes = getSavedVerificationCodes();
  localStorage.setItem(verificationCodesKey, JSON.stringify({ ...codes, [email]: code }));
}

function removeVerificationCode(email: string) {
  const codes = getSavedVerificationCodes();
  delete codes[email];
  localStorage.setItem(verificationCodesKey, JSON.stringify(codes));
}

function createMockEmailBody(email: string, password: string, code: string) {
  return `Hola,\n\nTu registro en StudyPlanner ha sido exitoso.\n\nUsuario: ${email}\nContraseña provisional: ${password}\nCódigo de verificación: ${code}\n\nUsa el código para activar tu cuenta y luego inicia sesión con la contraseña provisional.\n\nSaludos,\nEquipo StudyPlanner`;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    const saved = localStorage.getItem("studyplanner-user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("studyplanner-user", JSON.stringify(user));
    } else {
      localStorage.removeItem("studyplanner-user");
    }
  }, [user]);

  const login = (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const found = demoUsers.find((candidate) => candidate.email === normalizedEmail);

    if (found && found.password === password) {
      setUser(found);
      return true;
    }

    return false;
  };

  const logout = () => setUser(null);

  const canAccess = (path: string) => {
    const normalized = normalizePath(path);
    const menuEntry = menuItems.find((item) => item.path === normalized);

    if (!menuEntry) {
      return true;
    }

    if (!menuEntry.allowedRoles) {
      return true;
    }

    return menuEntry.allowedRoles.includes(user?.role ?? "student");
  };

  const register = (payload: RegisterPayload) => {
    const normalizedEmail = payload.email.trim().toLowerCase();
    if (!normalizedEmail.endsWith("@ucundinamarca.edu.co")) {
      return { ok: false, message: "Debe usar un correo institucional @ucundinamarca.edu.co." };
    }

    if (demoUsers.some((existing) => existing.email === normalizedEmail)) {
      return { ok: false, message: "El correo ya está registrado." };
    }

    const password = Math.random().toString(36).slice(-8);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const newUser: AuthUser = {
      id: demoUsers.length + 1,
      name: payload.name,
      email: normalizedEmail,
      role: payload.role,
      faculty: payload.faculty,
      semester: payload.semester,
      password,
    };

    demoUsers.push(newUser);
    saveVerificationCode(normalizedEmail, code);

    return {
      ok: true,
      password,
      code,
      emailBody: createMockEmailBody(normalizedEmail, password, code),
    };
  };

  const verifyAccount = (email: string, code: string) => {
    const codes = getSavedVerificationCodes();
    const normalizedEmail = email.trim().toLowerCase();
    const targetCode = codes[normalizedEmail];

    if (!targetCode) {
      return { ok: false, message: "No se encontró registro de verificación para este correo." };
    }

    if (targetCode !== code) {
      return { ok: false, message: "Código de verificación incorrecto." };
    }

    removeVerificationCode(normalizedEmail);
    return { ok: true, message: "Cuenta verificada correctamente. Ya puedes iniciar sesión con tu contraseña provisional." };
  };

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
      canAccess,
      register,
      verifyAccount,
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
