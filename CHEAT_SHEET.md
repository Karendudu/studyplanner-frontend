# 🚀 CHEAT SHEET - Servicios Frontend StudyPlanner

Guía rápida de importaciones y usos comunes.

## 📥 Importaciones Más Usadas

```typescript
// Servicios
import { loginUsuario, getHorarios, getNucleos, getUsuario } from '@/services/backend';

// Manejo de errores
import { handleApiError, getErrorMessageByStatus } from '@/services/api';

// Componentes
import ErrorAlert from '@/components/ui/ErrorAlert';
import ResponseDisplay from '@/components/ui/ResponseDisplay';
import Button from '@/components/ui/Button';

// Context
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';

// Tipos
import type { ResponseLoginDto, Horario, NucleoTematico, Usuario } from '@/services/types';
```

---

## 🔐 Login (Autenticación)

### Opción 1: Hook de Context (Recomendado)
```typescript
import { useAuth } from '@/context/AuthContext';

function LoginForm() {
  const { login } = useAuth();
  
  const handleLogin = async (email, password) => {
    const result = await login(email, password);
    if (result.ok) {
      console.log("Éxito");
    } else {
      console.log(result.error); // Mensaje amigable
    }
  };
}
```

### Opción 2: Servicio Directo
```typescript
import { loginUsuario } from '@/services/backend';

const response = await loginUsuario({
  correo: "usuario@ucundinamarca.edu.co",
  contrasenia: "password"
});

console.log(response.token);
```

---

## 📅 Horarios

```typescript
import { getHorarios, crearHorario, editarHorario, eliminarHorario } from '@/services/backend';

// Obtener todos
const horarios = await getHorarios(); // Horario[]

// Obtener uno
const horario = await getHorarioById(1);

// Crear
await crearHorario({
  idUsuario: 10,
  totalCreditos: 18,
  totalHorasSemanales: 25,
  idNucleoHorario: 100
});

// Actualizar
await editarHorario(1, { idNucleoHorario: 101 });

// Eliminar
await eliminarHorario(1);
```

---

## 🎓 Núcleos Temáticos

```typescript
import { getNucleos, getNucleosPorSemestre, actualizarCupo } from '@/services/backend';

// Todos los núcleos
const nucleos = await getNucleos(); // NucleoTematico[]

// Por semestre
const nucleosSemestre = await getNucleosPorSemestre();

// Ordenados por cupo
const nucleosCupo = await getNucleosOrdenadosPorCupo();

// Cantidad por programa
const cantidad = await getCantidadNucleosPorPrograma(5);

// Actualizar cupo
await actualizarCupo("PROG101", { cupos: 20 });
```

---

## 👥 Usuarios

```typescript
import { getUsuario, crearUsuario, editarUsuario, eliminarUsuario, contarUsuarios } from '@/services/backend';

// Obtener usuario
const usuario = await getUsuario(10); // Usuario

// Crear usuario
await crearUsuario({
  idPrograma: 5,
  nombre: "Juan Pérez",
  correo: "juan@ucundinamarca.edu.co",
  contrasenia: "Password123*",
  telefono: "3001234567"
});

// Editar
await editarUsuario(10, {
  nombre: "Juan Carlos",
  telefono: "3009876543"
});

// Eliminar
await eliminarUsuario(10);

// Contar usuarios
const stats = await contarUsuarios();
console.log(stats.totalEstudiantes, stats.totalAdministradores);
```

---

## 📧 Email

```typescript
import { enviarHorarioUsuario } from '@/services/backend';

await enviarHorarioUsuario({
  destino: "usuario@ucundinamarca.edu.co",
  asunto: "Tu Horario",
  mensaje: "Adjunto tu horario para este semestre",
  rutaPdf: "/pdfs/horario.pdf"
});
```

---

## 📚 Período de Matrícula

```typescript
import { 
  getPeriodoMatriculaActivo, 
  getEstadoMatriculaEstudiante,
  actualizarEstadoMatricula 
} from '@/services/backend';

// Período activo
const periodo = await getPeriodoMatriculaActivo();

// Estado de estudiante
const estado = await getEstadoMatriculaEstudiante(10);

// Actualizar
await actualizarEstadoMatricula(10);
```

---

## ⚠️ Manejo de Errores

```typescript
import { handleApiError } from '@/services/api';

try {
  const resultado = await loginUsuario({...});
} catch (error) {
  const apiError = handleApiError(error);
  
  // apiError tiene:
  // - statusCode: número (500, 401, etc)
  // - mensaje: string amigable
  // - detalles: stack trace para debugging
  // - respuesta: código de respuesta del backend
  
  console.log(apiError.mensaje); // Mostrar al usuario
  console.log(apiError.statusCode); // Para logging
}
```

---

## 🎨 Componentes de UI

### ErrorAlert
```typescript
import ErrorAlert from '@/components/ui/ErrorAlert';

<ErrorAlert
  mensaje="Algo salió mal"
  tipo="error"  // 'error', 'warning', 'info'
  autoDismiss={5000}  // Auto cerrar en 5s
  onClose={() => setError("")}
/>
```

### ResponseDisplay
```typescript
import ResponseDisplay from '@/components/ui/ResponseDisplay';

<ResponseDisplay
  title="Horarios"
  data={horarios}
  isLoading={loading}
  error={error}
/>
```

### Button
```typescript
import Button from '@/components/ui/Button';

<Button
  onClick={handleClick}
  disabled={loading}
  variant="primary"  // 'primary', 'secondary', 'danger'
  size="lg"  // 'sm', 'md', 'lg'
>
  Click me
</Button>
```

---

## 🎯 Patrón Completo: Cargar Datos

```typescript
import { useState, useEffect } from 'react';
import { getHorarios } from '@/services/backend';
import { handleApiError } from '@/services/api';
import ErrorAlert from '@/components/ui/ErrorAlert';
import ResponseDisplay from '@/components/ui/ResponseDisplay';

function MisHorarios() {
  const [horarios, setHorarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargar = async () => {
      try {
        const datos = await getHorarios();
        setHorarios(datos);
      } catch (err) {
        const apiError = handleApiError(err);
        setError(apiError.mensaje);
      } finally {
        setLoading(false);
      }
    };
    
    cargar();
  }, []);

  return (
    <>
      {error && <ErrorAlert mensaje={error} tipo="error" />}
      <ResponseDisplay
        title="Mis Horarios"
        data={horarios}
        isLoading={loading}
        error={error}
      />
    </>
  );
}

export default MisHorarios;
```

---

## 🧪 Página de Pruebas

Accede a: `http://localhost:5174/test-servicios`

Requiere agregar en `AppRouter.tsx`:
```typescript
import ServiciosTestPage from '../pages/ServiciosTestPage';

{
  path: "/test-servicios",
  element: <ServiciosTestPage />,
}
```

---

## 🔍 Debugging

```javascript
// En Console del navegador (F12)

// Ver token actual
localStorage.getItem('studyplanner-token')

// Ver usuario
JSON.parse(localStorage.getItem('studyplanner-user'))

// Limpiar todo
localStorage.clear()

// Enviar una solicitud de prueba
fetch('https://studyplanner-v0t3.onrender.com/api/Usuarios/contar-usuarios')
  .then(r => r.json())
  .then(d => console.log(d))
```

---

## 📋 Checklist Rápido

Antes de push a producción:

- [ ] `npm run build` sin errores
- [ ] Todos los servicios probados
- [ ] Errores se muestran amigables
- [ ] Token se guarda en localStorage
- [ ] Login funciona
- [ ] Variables .env configuradas
- [ ] Página de pruebas eliminada
- [ ] No hay datos sensibles en console logs

---

## 🆘 Problemas Comunes

| Problema | Solución |
|----------|----------|
| "Error 500" | Verifica que el backend esté corriendo |
| "No se pudo conectar" | Verifica VITE_API_URL en .env |
| Token es null | Debes hacer login primero |
| Compilación falla | Ejecuta `npm install` nuevamente |
| Datos no se actualizan | Verifica que no estén en caché |

---

**Última actualización:** 18 de Septiembre de 2026  
**Versión:** 1.0
