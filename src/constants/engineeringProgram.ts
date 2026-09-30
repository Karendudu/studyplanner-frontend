const universityBase = "https://www.ucundinamarca.edu.co";

export const engineeringProgram = {
  name: "Ingeniería de Sistemas y Computación",
  faculty: "Facultad de Ingeniería",
  level: "Pregrado presencial",
  credits: 153,
  semesters: 9,
  banner: `${universityBase}/images/2025/banner/INGENIERIA_DE_SISTEMAS_Y_COMPUTACION.jpg`,
  officialUrl: `${universityBase}/index.php/programas/pregrado/facultad-de-ingenieria/ingenieria-de-sistemas-y-computacion`,
};

export const engineeringLearningPaths = [
  {
    label: "Fusagasugá y Facatativá",
    url: `${universityBase}/documents/facultades/ingenieria/ruta-aprendizaje-sistemas-computacion.pdf`,
  },
  {
    label: "Chía",
    url: `${universityBase}/documents/facultades/ingenieria/ruta-aprendizaje-sistemas-computacion-chia.pdf`,
  },
] as const;

export const engineeringLocations = [
  { name: "Sede Fusagasugá", snies: "109964", phone: "+57 (1) 828 1483, ext. 145" },
  { name: "Extensión Facatativá", snies: "109965", phone: "+57 (1) 892 0706 / 0707" },
  { name: "Extensión Chía", snies: "111350", phone: "+57 (1) 870 9797" },
  { name: "Seccional Ubaté", snies: "116385", phone: "+57 (1) 855 3055 / 3056" },
] as const;