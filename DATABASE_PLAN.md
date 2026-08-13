# Plan de Frontend basado en Base de Datos StudyPlanner11

## 📊 Análisis de la Base de Datos

La BD tiene 20+ tablas organizadas en estos módulos:

### 1. **Gestión de Usuarios** ✅
- **Tabla:** USUARIO, ROL, ESTADO_ACTIVIDAD
- **Estado:** 70% listo
- **Pendiente:**
  - Integrar contraseña hasheada desde backend
  - Validar permisos por rol desde BD
  - Actualizar estado de usuarios

### 2. **Programa e Institución** ✅
- **Tablas:** PROGRAMA, FACULTAD, SEDE_UNIVERSIDAD, TIPO_UNIVERSIDAD
- **Estado:** 60% listo
- **Pendiente:**
  - Conectar con datos reales de BD
  - Mostrar direcciones y teléfono de sedes
  - Listar programas por facultad

### 3. **Núcleos Temáticos (Materias)** ⏳
- **Tablas:** NUCLEO_TEMATICO, UBICACION_SEMESTRAL, PRERREQUISITO
- **Estado:** 20% listo
- **Importante:**
  - **Código de materia:** ING-101
  - **Cupos disponibles:** campo crítico
  - **Créditos y horas:** para validar carga
  - **Prerrequisitos:** bloquear selección si no cumple
  - **Semestre:** mostrar por ubicación semestral
  
**Próxima pantalla a crear:**
```
┌─────────────────────────────────┐
│ Catálogo de Materias            │
├─────────────────────────────────┤
│ Filtros:                        │
│  - Por semestre                 │
│  - Por programa                 │
│  - Por jornada                  │
├─────────────────────────────────┤
│ Código │ Nombre │ Créditos │ Cupos
│ ING101 │ ...    │ 4        │ 18
│ ING205 │ ...    │ 3        │ 7
└─────────────────────────────────┘
```

### 4. **Horarios (CORE del proyecto)** ⏳
- **Tablas:** HORARIO, NUCLEO_HORARIO, HORARIO_NUCLEO, HORAS, DIA_SEMANA, JORNADA
- **Estado:** 5% listo
- **Crítico:**
  - Mostrar grilla de horarios por día/hora
  - Detectar conflictos de horarios
  - Calcular total de créditos
  - Calcular total de horas semanales
  - Permitir simular inscripción sin guardar en BD

**Próxima pantalla a crear:**
```
┌────────────────────────────────────────────┐
│ Simulador de Horarios                      │
├────────────────────────────────────────────┤
│ Créditos: 14/16 │ Horas: 28/30             │
├────────────────────────────────────────────┤
│      │ Lunes    │ Martes   │ Miércoles    │
├─────┼──────────┼──────────┼──────────────┤
│ 7am │ ING101   │          │ ING205       │
│ 9am │ (Prof)   │ ING310   │ (Aula 103)   │
├─────┼──────────┼──────────┼──────────────┤
│ Conflictos: ❌ NINGUNO
│ [ Agregar materia ] [ Guardar simulación ]
└────────────────────────────────────────────┘
```

### 5. **Grupos y Jornadas** ⏳
- **Tablas:** GRUPO, JORNADA
- **Estado:** 0% listo
- **Pendiente:**
  - Selector de jornada (Mañana/Tarde/Noche)
  - Mostrar grupos disponibles
  - Asociar con horarios

### 6. **Espacios Educativos** ⏳
- **Tablas:** ESPECIO_EDUCATIVO, TIPO_ESPACIOAULA
- **Estado:** 0% listo
- **Pendiente:**
  - Mostrar disponibilidad de aulas
  - Mostrar capacidad
  - Mostrar equipos disponibles

### 7. **Avisos (Notificaciones)** ⏳
- **Tabla:** AVISO_INFORMATIVO
- **Estado:** 20% listo
- **Pendiente:**
  - Mostrar avisos por tipo
  - Filtrar por usuario
  - Marcar como leído
  - Sistema de notificaciones en tiempo real

### 8. **Auditoría** ⏳
- **Tabla:** AUDITORIA
- **Estado:** 0% listo
- **Pendiente:**
  - Panel de auditoría (solo admin)
  - Registrar acciones de usuarios
  - Filtros por fecha, usuario, acción
  - Exportar reportes

### 9. **Historial Académico** ⏳
- **Tabla:** NUCLEOS_VISTOS
- **Estado:** 0% listo
- **Pendiente:**
  - Mostrar materias vistas
  - Mostrar notas
  - Mostrar estado (aprobado/reprobado)
  - Calcular promedio

---

## 📋 Prioridad de Implementación

### 🔴 Crítico (MVP)
1. **Simulador de horarios** - Es el core del proyecto
2. **Catálogo de materias avanzado** - Con filtros y cupos
3. **Validación de prerequisitos** - Seguridad académica
4. **Cálculo automático** - Créditos y horas

### 🟡 Importante
5. Flujo de inscripción simulada
6. Panel de historial académico
7. Gestión de avisos

### 🟢 Complementario
8. Espacios educativos
9. Auditoría
10. Jornadas y grupos

---

## 🛠️ Interfaces TypeScript Creadas

Todas las entidades de la BD ya tienen interfaces TypeScript en:
`src/interfaces/Database.ts`

Úsalas para:
- Tipado seguro en componentes
- Respuestas del backend
- Validaciones

---

## 📌 Siguiente Paso Recomendado

**Implementar el Simulador de Horarios** porque:
- Es lo único que realmente diferencia este proyecto
- Los estudiantes vienen por esto
- Es para tu grado, así que debe ser muy bueno
- Todo lo demás es CRUD estándar
