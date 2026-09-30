// ==================== Auth ====================
export interface ReqLogin {
  correo: string;
  contrasenia: string;
}

export interface ResponseLoginDto {
  idUsuario: number;
  respuesta: number;
  mensaje?: string;
  correo?: string;
  token?: string;
  tiempoExpiracion?: string;
  nombreUsuario?: string;
  rol?: string;
  requiereVerificacion2FA?: boolean;
  metodoVerificacion2FA?: string | null;
}

// ==================== Email ====================
export interface ReqEnviarEmail {
  destino: string;
  asunto: string;
  mensaje: string;
  rutaPdf?: string;
}

export interface ResponseEmail {
  success: boolean;
  mensaje?: string;
}

// ==================== Horario ====================
export interface Horario {
  idHorario?: number;
  idUsuario?: number;
  totalCreditos?: number;
  totalHorasSemanales?: number;
  idNucleoHorario?: number;
  idNucleoHorarioNavigation?: NucleoHorario;
  idUsuarioNavigation?: Usuario;
}

export interface ReqCrearHorario {
  idHorario?: number;
  idUsuario?: number;
  totalCreditos?: number;
  totalHorasSemanales?: number;
  idNucleoHorario?: number;
}

export interface ReqEditarHorario {
  idNucleoHorario?: number;
}

export interface NucleoHorario {
  idNucleoH?: number;
  idGrupo?: number;
  idNucleoTematico?: string;
  idHorarioNucleo?: number;
  idEspacioEducativo?: number;
  horarios?: string[];
  idEspacioEducativoNavigation?: EspacioEducativo;
  idGrupoNavigation?: Grupo;
  idHorarioNucleoNavigation?: HorarioNucleo;
  idNucleoTematicoNavigation?: NucleoTematico;
}

export interface EspacioEducativo {
  idSalon?: number;
  nombre?: string;
  bloque?: string;
  capacidad?: number;
  equipos?: boolean;
  disponibilidad?: boolean;
  tipoEspacio?: number;
  idSedeUniversidad?: number;
  tipoEspacioNavigation?: TipoEspacio;
  nucleoHorarios?: NucleoHorario[];
}

export interface TipoEspacio {
  idTipoEspacioAula?: number;
  nombreEspacio?: string;
  especioEducativos?: EspacioEducativo[];
}

export interface Grupo {
  idGrup?: number;
  nombreGrupo?: string;
  idJornada?: number;
  idJornadaNavigation?: Jornada;
  nucleoHorarios?: NucleoHorario[];
}

export interface Jornada {
  idJornada?: number;
  jornada?: string;
  grupos?: Grupo[];
}

export interface HorarioNucleo {
  idHorarioN?: number;
  idDiaSemana?: number;
  idHoras?: number;
  idDiaSemanaNavigation?: DiaSemana;
  idHorasNavigation?: Horas;
  nucleoHorarios?: NucleoHorario[];
}

export interface DiaSemana {
  idDiaSemana?: number;
  dia?: string;
  horarioNucleos?: HorarioNucleo[];
}

export interface Horas {
  idHoras?: number;
  horaInicio?: string;
  horaFin?: string;
  horarioNucleos?: HorarioNucleo[];
}

// ==================== Nucleo Temático ====================
export interface NucleoTematico {
  idCodigoNucleo?: string;
  nombre?: string;
  idUbicacionSemestral?: number;
  idPrograma?: number;
  idPrerrequisito?: number;
  cupos?: number;
  creditos?: number;
  horasSemanales?: number;
  idPrerrequisitoNavigation?: Prerequisito;
  idProgramaNavigation?: Programa;
  idUbicacionSemestralNavigation?: UbicacionSemestral;
  nucleoHorarios?: NucleoHorario[];
  nucleosVistos?: NucleoVisto[];
}

export interface Prerequisito {
  idPrerrequisito?: number;
  nucleoPrecede?: string;
  nucleoTematicos?: NucleoTematico[];
}

export interface UbicacionSemestral {
  idUbicacion?: number;
  ubicacion?: string;
  nucleoTematicos?: NucleoTematico[];
}

export interface ReqActualizarCupo {
  cupos: number;
}

// ==================== Período de Matrícula ====================
export interface PeriodoMatricula {
  idPeriodoMatricula?: number;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: boolean;
  activo?: boolean;
}

export interface EstadoMatriculaEstudiante {
  idEstudiante?: number;
  estado?: string;
  periodo?: PeriodoMatricula;
}

// ==================== Usuario ====================
export interface Usuario {
  idDocumento?: number;
  idRol?: number;
  idPrograma?: number;
  nombre?: string;
  telefono?: string;
  correo?: string;
  contrasenia?: string;
  idEstado?: number;
  avisoInformativos?: AvisoInformativo[];
  horarios?: Horario[];
  idEstadoNavigation?: Estado;
  idPrograma1?: Programa;
  idProgramaNavigation?: Auditoria;
  idRolNavigation?: Rol;
  nucleosVistos?: NucleoVisto[];
}

export interface AvisoInformativo {
  idPasarela?: number;
  idUsuario?: number;
  tipoAviso?: string;
  informacion?: string;
  idUsuarioNavigation?: Usuario;
}

export interface Estado {
  idEstado?: number;
  estadoRol?: boolean;
  usuarios?: Usuario[];
}

export interface Programa {
  idPrograma?: number;
  nombrePrograma?: string;
  idSedeUniversidad?: number;
  idFacult?: number;
  idFacultNavigation?: Facultad;
  idSedeUniversidadNavigation?: SedeUniversidad;
  nucleoTematicos?: NucleoTematico[];
  usuarios?: Usuario[];
}

export interface Facultad {
  idFacult?: number;
  nombreFacult?: string;
  programas?: Programa[];
}

export interface SedeUniversidad {
  idSedeUniversidad?: number;
  nombreSede?: string;
  idTipoUniversidad?: number;
  direccion?: string;
  telefono?: string;
  ciudadMunicipio?: string;
  especioEducativos?: EspacioEducativo[];
  idTipoUniversidadNavigation?: TipoUniversidad;
  programas?: Programa[];
}

export interface TipoUniversidad {
  idTipoUniversidad?: number;
  tipoUniversidad1?: string;
  sedeUniversidads?: SedeUniversidad[];
}

export interface Rol {
  idRol?: number;
  nombreRol?: string;
  usuarios?: Usuario[];
}

export interface Auditoria {
  idAuditoria?: number;
  idUsuario?: number;
  accion?: string;
  fecha?: string;
  usuarios?: Usuario[];
}

export interface NucleoVisto {
  idNucleosVistos?: number;
  idNucleoTematico?: string;
  nota?: number;
  estado?: boolean;
  idUsuario?: number;
  idNucleoTematicoNavigation?: NucleoTematico;
  idUsuarioNavigation?: Usuario;
}

export interface ReqCrearUsuario {
  idPrograma?: number;
  idCodigoUsuario?: string;
  nombre?: string;
  telefono?: string;
  correo?: string;
  contrasenia?: string;
}

export interface ReqEditarUsuario {
  nombre?: string;
  telefono?: string;
  correo?: string;
  contrasenia?: string;
}

export interface ResponseCantiUsuarios {
  totalEstudiantes: number;
  totalAdministradores: number;
  mensaje?: string;
}

// ==================== Respuestas Generales ====================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  mensaje?: string;
  error?: string;
  statusCode?: number;
}
