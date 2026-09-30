  respuesta: 1,  // El backend desplegado devuelve 1 cuando autentica correctamente
  rol: "2",  // El login puede devolver el ID del rol; consultar el perfil para su nombre
# 📚 Documentación de Servicios del Frontend - StudyPlanner

Este documento describe todos los servicios disponibles en el frontend para conectar con el backend de StudyPlanner.

## 📋 Tabla de Contenido

1. [Configuración Base](#configuración-base)
2. [Servicios de Autenticación](#servicios-de-autenticación)
3. [Servicios de Email](#servicios-de-email)
4. [Servicios de Horarios](#servicios-de-horarios)
5. [Servicios de Núcleos Temáticos](#servicios-de-núcleos-temáticos)
6. [Servicios de Período de Matrícula](#servicios-de-período-de-matrícula)
7. [Servicios de Usuarios](#servicios-de-usuarios)
8. [Manejo de Errores](#manejo-de-errores)
9. [Componentes UI](#componentes-ui)

---

## 🔧 Configuración Base

### Variables de Entorno
```env
VITE_API_URL=https://studyplanner-v0t3.onrender.com
VITE_USE_MOCK_DATA=false  # Cambiar a true para usar datos de demostración
```

### Token de Autenticación
El token se almacena automáticamente en `localStorage` con la clave `studyplanner-token`.

---

## 🔐 Servicios de Autenticación

### 1. **Login Principal**
```typescript
import { loginUsuario } from '@/services/backend';

const response = await loginUsuario({
  correo: "usuario@ucundinamarca.edu.co",
  contrasenia: "Contraseña123*"
});

// Respuesta esperada:
{
  idUsuario: 1,
  idUsuario: 1006099999,
  respuesta: 1,  // 1 = autenticación exitosa
    rol: "2",  // 1 = Estudiante, 2 = Administrador, 3 = Udec
  mensaje: "Login exitoso",
  correo: "usuario@ucundinamarca.edu.co",
  token: "jwt-token-aqui",
  tiempoExpiracion: "2026-09-18T15:30:00",
  nombreUsuario: "Juan Pérez",
  rol: "Estudiante",
  requiereVerificacion2FA: false,
  metodoVerificacion2FA: null
}
```

### 2. **Login Alternativo (Usuarios)**
```typescript
import { inicioSesionUsuario } from '@/services/backend';

const response = await inicioSesionUsuario({
  correo: "usuario@ucundinamarca.edu.co",
  contrasenia: "Contraseña123*"
});
```

### 3. **Hook de Autenticación (Recomendado)**
```typescript
import { useAuth } from '@/context/AuthContext';

function MiComponente() {
  const { user, isAuthenticated, login, logout } = useAuth();
  
  const handleLogin = async () => {
    const result = await login("correo@ucundinamarca.edu.co", "password");
    if (result.ok) {
      console.log("Login exitoso");
    } else {
      console.error(result.error);
    }
  };
  
  const handleLogout = () => logout();
  
  return (
    <div>
      {isAuthenticated ? (
        <p>Bienvenido {user?.name}</p>
      ) : (
        <button onClick={handleLogin}>Inicia sesión</button>
      )}
    </div>
  );
}
```

---

## 📧 Servicios de Email

### **Enviar Horario al Usuario**
```typescript
import { enviarHorarioUsuario } from '@/services/backend';

const response = await enviarHorarioUsuario({
  destino: "usuario@ucundinamarca.edu.co",
  asunto: "Tu horario de clases",
  mensaje: "Adjunto encontrarás tu horario para este semestre",
  rutaPdf: "/pdfs/horario-2026-1.pdf"
});

// Respuesta esperada:
{
  success: true,
  mensaje: "Email enviado exitosamente"
}
```

---

## 📅 Servicios de Horarios

### 1. **Obtener Todos los Horarios**
```typescript
import { getHorarios } from '@/services/backend';

const horarios = await getHorarios();

// Respuesta: Horario[]
[
  {
    idHorario: 1,
    idUsuario: 10,
    totalCreditos: 18,
    totalHorasSemanales: 25,
    idNucleoHorario: 100
  }
]
```

### 2. **Obtener un Horario Específico**
```typescript
const horario = await getHorarioById(1);
```

### 3. **Crear Nuevo Horario**
```typescript
const response = await crearHorario({
  idUsuario: 10,
  totalCreditos: 18,
  totalHorasSemanales: 25,
  idNucleoHorario: 100
});
```

### 4. **Editar Horario**
```typescript
const response = await editarHorario(1, {
  idNucleoHorario: 101
});
```

### 5. **Eliminar Horario**
```typescript
const response = await eliminarHorario(1);
```

---

## 🎓 Servicios de Núcleos Temáticos

### 1. **Obtener Todos los Núcleos**
```typescript
import { getNucleos } from '@/services/backend';

const nucleos = await getNucleos();

// Respuesta: NucleoTematico[]
[
  {
    idCodigoNucleo: "PROG101",
    nombre: "Introducción a la Programación",
    idUbicacionSemestral: 1,
    idPrograma: 5,
    cupos: 30,
    creditos: 3,
    horasSemanales: 4
  }
]
```

### 2. **Obtener Núcleos por Semestre**
```typescript
const nucleos = await getNucleosPorSemestre();
```

### 3. **Obtener Cantidad de Núcleos por Programa**
```typescript
const cantidad = await getCantidadNucleosPorPrograma(5);
// Retorna: number
```

### 4. **Obtener Núcleos Ordenados por Cupo**
```typescript
const nucleos = await getNucleosOrdenadosPorCupo();
```

### 5. **Crear Núcleo**
```typescript
const response = await crearNucleo({
  idCodigoNucleo: "PROG102",
  nombre: "Programación Avanzada",
  idPrograma: 5,
  cupos: 25,
  creditos: 4,
  horasSemanales: 5
});
```

### 6. **Actualizar Cupo de Núcleo**
```typescript
const response = await actualizarCupo("PROG101", {
  cupos: 20
});
```

---

## 📚 Servicios de Período de Matrícula

### 1. **Obtener Período Activo**
```typescript
import { getPeriodoMatriculaActivo } from '@/services/backend';

const periodo = await getPeriodoMatriculaActivo();

// Respuesta: PeriodoMatricula
{
  idPeriodoMatricula: 1,
  fechaInicio: "2026-08-01",
  fechaFin: "2026-12-31",
  estado: true,
  activo: true
}
```

### 2. **Obtener Estado de Matrícula de Estudiante**
```typescript
const estado = await getEstadoMatriculaEstudiante(10);

// Respuesta: EstadoMatriculaEstudiante
{
  idEstudiante: 10,
  estado: "Activo",
  periodo: { /* PeriodoMatricula */ }
}
```

### 3. **Actualizar Estado de Matrícula**
```typescript
const response = await actualizarEstadoMatricula(10);
```

---

## 👥 Servicios de Usuarios

### 1. **Obtener Datos de Usuario**
```typescript
import { getUsuario } from '@/services/backend';

const usuario = await getUsuario(10);

// Respuesta: Usuario (estructura completa con relaciones)
{
  idDocumento: 1098765432,
  idRol: 3,
  idPrograma: 5,
  nombre: "Juan Pérez",
  telefono: "3001234567",
  correo: "juan@ucundinamarca.edu.co",
  idEstado: 1,
  horarios: [],
  nucleosVistos: []
}
```

### 2. **Crear Usuario**
```typescript
const response = await crearUsuario({
  idPrograma: 5,
  idCodigoUsuario: "2024001",
  nombre: "María García",
  telefono: "3111234567",
  correo: "maria@ucundinamarca.edu.co",
  contrasenia: "Contraseña123*"
});
```

### 3. **Editar Usuario**
```typescript
const response = await editarUsuario(10, {
  nombre: "Juan Carlos Pérez",
  telefono: "3009876543",
  correo: "juancarlos@ucundinamarca.edu.co"
});
```

### 4. **Eliminar Usuario**
```typescript
const response = await eliminarUsuario(10);
```

### 5. **Contar Usuarios**
```typescript
const conteo = await contarUsuarios();

// Respuesta: ResponseCantiUsuarios
{
  totalEstudiantes: 150,
  totalAdministradores: 5,
  mensaje: "Conteo exitoso"
}
```

### 6. **Obtener Estudiantes por Programa**
```typescript
const estudiantes = await getEstudiantesPorPrograma();
```

---

## ⚠️ Manejo de Errores

### Función Auxiliar de Errores
```typescript
import { handleApiError, getErrorMessageByStatus } from '@/services/api';

try {
  const response = await loginUsuario({ correo: "...", contrasenia: "..." });
} catch (error) {
  const apiError = handleApiError(error);
  console.log(apiError.mensaje);      // "Error: No se pudo conectar..."
  console.log(apiError.statusCode);   // 500, 401, etc.
  console.log(apiError.detalles);     // Detalles adicionales
}
```

### Códigos de Estado y Mensajes
```typescript
// Automáticamente mapeados a mensajes amigables:
200: OK
400: Los datos enviados no son válidos
401: Tu sesión ha expirado. Inicia sesión de nuevo
403: No tienes permiso para realizar esta acción
404: El recurso no fue encontrado
500: Error interno del servidor
503: El servidor no está disponible
```

---

## 🎨 Componentes UI

### 1. **ErrorAlert** - Mostrar Errores
```typescript
import ErrorAlert from '@/components/ui/ErrorAlert';

function MiComponente() {
  const [error, setError] = useState("");
  
  return (
    <>
      {error && (
        <ErrorAlert
          mensaje={error}
          tipo="error"  // 'error', 'warning', 'info'
          autoDismiss={5000}
          onClose={() => setError("")}
        />
      )}
    </>
  );
}
```

### 2. **ResponseDisplay** - Mostrar Respuestas
```typescript
import ResponseDisplay from '@/components/ui/ResponseDisplay';

function MiComponente() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  return (
    <ResponseDisplay
      title="Datos del Horario"
      data={data}
      isLoading={loading}
      error={error}
    >
      {/* Contenido personalizado opcional */}
      {data && (
        <div className="space-y-2">
          <p><strong>Total Créditos:</strong> {data.totalCreditos}</p>
          <p><strong>Horas Semanales:</strong> {data.totalHorasSemanales}</p>
        </div>
      )}
    </ResponseDisplay>
  );
}
```

---

## 📝 Ejemplo Completo de Uso

```typescript
import { useState } from 'react';
import { getHorarios } from '@/services/backend';
import { handleApiError } from '@/services/api';
import ErrorAlert from '@/components/ui/ErrorAlert';
import ResponseDisplay from '@/components/ui/ResponseDisplay';

function ListadoHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const cargarHorarios = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getHorarios();
      setHorarios(response);
    } catch (err) {
      const apiError = handleApiError(err);
      setError(apiError.mensaje);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <button onClick={cargarHorarios} disabled={loading}>
        {loading ? "Cargando..." : "Cargar Horarios"}
      </button>

      {error && (
        <ErrorAlert
          mensaje={error}
          tipo="error"
          onClose={() => setError("")}
        />
      )}

      <ResponseDisplay
        title="Tus Horarios"
        data={horarios}
        isLoading={loading}
        error={error}
      >
        {horarios.length > 0 && (
          <div className="space-y-3">
            {horarios.map((h) => (
              <div key={h.idHorario} className="border p-3 rounded">
                <p><strong>Créditos:</strong> {h.totalCreditos}</p>
                <p><strong>Horas:</strong> {h.totalHorasSemanales}</p>
              </div>
            ))}
          </div>
        )}
      </ResponseDisplay>
    </div>
  );
}
```

---

## 🚀 Próximos Pasos

1. ✅ Todos los tipos TypeScript están definidos
2. ✅ Todos los servicios están implementados
3. ✅ Manejo de errores amigable activado
4. ⏳ Actualizar componentes de dashboard para usar servicios reales
5. ⏳ Implementar validación de permisos según rol
6. ⏳ Agregar paginación en listados

---

**Última actualización:** 18 de Septiembre de 2026  
**Versión:** 1.0
