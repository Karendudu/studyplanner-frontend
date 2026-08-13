/**
 * Interfaces TypeScript para mapear la Base de Datos StudyPlanner11
 * Aseguran tipado fuerte y facilitan integración con backend
 */

// ============ ENTIDADES PRINCIPALES ============

export interface Usuario {
  idDocumento: number;
  idRol: number;
  idPrograma: number;
  nombre: string;
  telefono: string;
  correo: string;
  contrasenia: string;
  idEstado: number;
}

export interface Rol {
  idRol: number;
  nombreRol: "admin" | "teacher" | "student";
}

export interface Programa {
  idPrograma: number;
  nombrePrograma: string;
  idSedeUniversidad: number;
  idFacult: number;
}

export interface Facultad {
  idFacult: number;
  nombreFacult: string;
}

export interface SedeUniversidad {
  idSedeUniversidad: number;
  nombreSede: string;
  idTipoUniversidad: number;
  direccion: string;
  telefono: string;
  ciudadMunicipio: string;
}

export interface TipoUniversidad {
  idTipoUniversidad: number;
  tipoUniversidad: string;
}

// ============ NÚCLEOS Y MATERIAS ============

export interface NucleoTematico {
  idCodigoNucleo: string;
  nombre: string;
  idUbicacionSemestral: number;
  idPrerrequisito: number | null;
  cupos: number;
  idPrograma: number;
  creditos: number;
  horasSemanales: number;
}

export interface UbicacionSemestral {
  idUbicacion: number;
  ubicacion: string; // "Semestre 1", "Semestre 2", etc
}

export interface NucleoVisto {
  idNucleosVistos: number;
  idNucleoTematico: string;
  nota: number;
  estado: boolean;
  idUsuario: number;
}

export interface Prerrequisito {
  idPrerrequisito: number;
  nucleoPrecede: string | null;
}

// ============ HORARIOS ============

export interface Horario {
  idHorario: number;
  idUsuario: number;
  totalCreditos: number;
  totalHorasSemanales: number;
  idNucleoHorario: number;
}

export interface NucleoHorario {
  idNucleoH: number;
  idGrupo: number;
  idNucleoTematico: string;
  idHorarioNucleo: number;
  idEspacioEducativo: number | null;
}

export interface HorarioNucleo {
  idHorarioN: number;
  idDiaSemana: number;
  idHoras: number;
}

export interface DiaSemana {
  idDiaSemana: number;
  dia: string;
}

export interface Horas {
  idHoras: number;
  horaInicio: string; // formato time
  horaFin: string;
}

// ============ GRUPOS Y JORNADAS ============

export interface Grupo {
  idGrup: number;
  nombreGrupo: string;
  idJornada: number;
}

export interface Jornada {
  idJornada: number;
  jornada: string; // "Mañana", "Tarde", "Noche"
}

// ============ ESPACIOS EDUCATIVOS ============

export interface EspacioEducativo {
  idSalon: number;
  nombre: string;
  bloque: string;
  capacidad: number;
  equipos: boolean;
  disponibilidad: boolean;
  tipoEspacio: number;
  idSedeUniversidad: number;
}

export interface TipoEspacioAula {
  idTipoEspacioAula: number;
  nombreEspacio: string;
}

// ============ NOTIFICACIONES Y AUDITORÍA ============

export interface AvisoInformativo {
  idPasarela: number;
  idUsuario: number;
  tipoAviso: string;
  informacion: string;
}

export interface Auditoria {
  idAuditoria: number;
  idUsuario: number;
  accion: string;
  fecha: Date;
}

export interface EstadoActividad {
  idEstado: number;
  estadoRol: boolean;
}
