import { useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { ThemeContext, type ThemeMode } from "./themeState";

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



