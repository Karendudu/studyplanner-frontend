import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Colores primarios - Universidad de Cundinamarca
        cundi: {
          50: "#E3EED4",
          100: "#AEC3B0",
          200: "#6B9071",
          300: "#375534",
          400: "#0F2A1D",
          500: "#00482B",
          600: "#007B3E",
          700: "#009F60",
          800: "#00A99D",
        },
        brand: {
          yellow: "#FBE122",
          gold: "#DAA00",
          green: "#79C000",
          teal: "#00A99D",
          dark: "#00482B",
        },
      },
      backgroundColor: {
        page: "#F7F9F8",
      },
    },
  },
  plugins: [],
};

export default config;
