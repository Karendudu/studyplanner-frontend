export const mockPrograms = [
  {
    code: "ING-101",
    name: "Ingeniería de Software I",
    credits: 4,
    semester: "Primer semestre",
    availability: 18,
  },
  {
    code: "ING-205",
    name: "Bases de Datos",
    credits: 3,
    semester: "Tercer semestre",
    availability: 7,
  },
  {
    code: "ING-310",
    name: "Diseño de Interfaces",
    credits: 2,
    semester: "Quinto semestre",
    availability: 12,
  },
];

export const mockSubjects = [
  {
    code: "MAT-101",
    name: "Cálculo Diferencial",
    program: "Ingeniería de Software",
    semester: "Primer semestre",
    credits: 4,
    capacity: 60,
    availability: 15,
    instructor: "Dr. Pérez",
  },
  {
    code: "INF-205",
    name: "Estructuras de Datos",
    program: "Ingeniería de Software",
    semester: "Tercer semestre",
    credits: 3,
    capacity: 45,
    availability: 7,
    instructor: "Ing. Gómez",
  },
  {
    code: "INF-310",
    name: "Bases de Datos Avanzadas",
    program: "Ingeniería de Software",
    semester: "Quinto semestre",
    credits: 3,
    capacity: 40,
    availability: 10,
    instructor: "Dra. Fernández",
  },
  {
    code: "ADM-101",
    name: "Introducción a la Administración",
    program: "Ciencias Administrativas",
    semester: "Primer semestre",
    credits: 3,
    capacity: 50,
    availability: 18,
    instructor: "Mtra. Ramírez",
  },
];

export const mockFaculties = [
  { name: "Ingeniería", headcount: 320, programs: 12 },
  { name: "Ciencias Administrativas", headcount: 180, programs: 8 },
  { name: "Ciencias Básicas", headcount: 240, programs: 10 },
];

export const mockHeadquarters = [
  { name: "Sede Norte", capacity: 450, active: true },
  { name: "Sede Sur", capacity: 320, active: true },
  { name: "Sede Virtual", capacity: 600, active: false },
];

export const mockSchedules = [
  {
    day: "Lunes",
    time: "07:00 - 09:00",
    subject: "Programación",
    group: "G1",
    location: "Aula 205",
    availability: 8,
  },
  {
    day: "Martes",
    time: "09:00 - 11:00",
    subject: "Bases de Datos",
    group: "G2",
    location: "Aula 308",
    availability: 5,
  },
  {
    day: "Miércoles",
    time: "11:00 - 13:00",
    subject: "Diseño de Interfaces",
    group: "G1",
    location: "Aula 112",
    availability: 12,
  },
];

export const mockNotices = [
  { title: "Inscripciones abiertas", detail: "La inscripción para el próximo semestre inicia el 15 de agosto." },
  { title: "Cambio de horario", detail: "Se ajustaron los horarios de bases de datos para la sede Norte." },
  { title: "Nueva aula disponible", detail: "Se habilitó el aula 405 para materias de grupo G2." },
];

export const mockAudits = [
  {
    id: 1,
    user: "admin@studyplanner.com",
    action: "Creó usuario",
    date: "2026-07-12 10:15",
    details: "Usuario estudiante@ucundinamarca.edu.co registrado con rol Estudiante.",
  },
  {
    id: 2,
    user: "docente@studyplanner.com",
    action: "Actualizó horario",
    date: "2026-07-13 08:40",
    details: "Se ajustaron los grupos de Diseño de Interfaces.",
  },
  {
    id: 3,
    user: "admin@studyplanner.com",
    action: "Publicó aviso",
    date: "2026-07-13 16:20",
    details: "Se publicó aviso de inscripciones abiertas.",
  },
];
