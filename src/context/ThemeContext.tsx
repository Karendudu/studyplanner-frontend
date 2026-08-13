import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextValue {
  theme: ThemeMode;
  toggleTheme: () => void;
  setTheme: (theme: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);
const themeStorageKey = "studyplanner-theme";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem(themeStorageKey) as ThemeMode | null;
    return saved === "dark" ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    localStorage.setItem(themeStorageKey, theme);
  }, [theme]);

  const toggleTheme = () => setThemeState((current) => (current === "light" ? "dark" : "light"));

  const value = useMemo(
    () => ({ theme, toggleTheme, setTheme: setThemeState }),
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
