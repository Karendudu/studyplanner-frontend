import { createContext, useContext, useLayoutEffect, useMemo, useState, type ReactNode } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme] = useState<ThemeMode>("light");

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.classList.remove("dark");
  }, [theme]);

  const toggleTheme = () => {
    // Tema oscuro deshabilitado por decisión de diseño.
  };

  const setTheme = () => {
    // Tema oscuro deshabilitado por decisión de diseño.
  };

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme }),
    [theme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
