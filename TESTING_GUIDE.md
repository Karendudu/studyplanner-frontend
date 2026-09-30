  "respuesta": 1,
  "rol": "2",
# 🎯 Guía de Pruebas de Servicios del Backend

## ¿Qué es esto?

Esta guía te ayudará a probar todos los servicios del backend del StudyPlanner directamente desde el frontend, sin necesidad de usar herramientas externas como Postman o cURL.

---

## 📍 Acceso a la Página de Pruebas

### Opción 1: Agregar ruta al router (Recomendado)

Edita `src/router/AppRouter.tsx` y agrega:

```typescript
import ServiciosTestPage from '../pages/ServiciosTestPage';

// Dentro de las rutas, agrega:
{
  path: "/test-servicios",
  element: <ServiciosTestPage />,
  requiereLogin: false
}
```

Luego accede a: `http://localhost:5174/test-servicios`

### Opción 2: Acceso directo en el navegador (alternativa rápida)

Si tienes el proyecto corriendo, importa y renderiza directamente en un componente.

---

## 🧪 Cómo Probar los Servicios

### 1️⃣ **Pruebas de Autenticación**

```
1. Ingresa tu correo: prueba@correo.com
2. Ingresa tu contraseña: Prueba123*
3. Haz clic en "Probar Login"
```

**Respuesta Esperada:**
```json
{
  "idUsuario": 1,
  "idUsuario": 1006099999,
  "respuesta": 1,
    "rol": "2",
  "mensaje": "Login exitoso",
  "correo": "prueba@correo.com",
  "token": "jwt-token-aqui",
  "tiempoExpiracion": "2026-09-18T15:30:00",
  "nombreUsuario": "Juan Pérez",
  "rol": "Estudiante",
  "requiereVerificacion2FA": false,
  "metodoVerificacion2FA": null
}
```

**¿Qué verificar?**
- ✅ Se obtiene un token válido
- ✅ El nombre de usuario es correcto
- ✅ El rol asignado es correcto
- ✅ No hay mensajes de error en la consola

---

### 2️⃣ **Pruebas de Horarios**

Haz clic en **"Obtener Horarios"**

**Respuesta Esperada:**
```json
[
  {
    "idHorario": 1,
    "idUsuario": 10,
    "totalCreditos": 18,
    "totalHorasSemanales": 25,
    "idNucleoHorario": 100
  }
]
```

**¿Qué verificar?**
- ✅ Se recibe un array de horarios
- ✅ Cada horario tiene los campos necesarios
- ✅ Los valores numéricos son correctos

---

### 3️⃣ **Pruebas de Núcleos Temáticos**

Haz clic en **"Obtener Núcleos"**

**Respuesta Esperada:**
```json
[
  {
    "idCodigoNucleo": "PROG101",
    "nombre": "Introducción a la Programación",
    "idUbicacionSemestral": 1,
    "idPrograma": 5,
    "cupos": 30,
    "creditos": 3,
    "horasSemanales": 4
  }
]
```

**¿Qué verificar?**
- ✅ Se listan todos los núcleos disponibles
- ✅ Cada núcleo tiene información de créditos y horas
- ✅ Los cupos se muestran correctamente

---

### 4️⃣ **Pruebas de Usuarios**

1. Ingresa el ID del usuario (ej: 1)
2. Haz clic en **"Obtener Usuario"**

**Respuesta Esperada:**
```json
{
  "idDocumento": 1098765432,
  "idRol": 3,
  "idPrograma": 5,
  "nombre": "Juan Pérez",
  "telefono": "3001234567",
  "correo": "juan@ucundinamarca.edu.co",
  "idEstado": 1,
  "horarios": [],
  "nucleosVistos": []
}
```

**¿Qué verificar?**
- ✅ Se obtienen los datos del usuario
- ✅ El correo está correctamente almacenado
- ✅ Se incluyen relaciones (horarios, núcleos vistos)

---

### 5️⃣ **Pruebas de Conteo de Usuarios**

Haz clic en **"Contar Usuarios"**

**Respuesta Esperada:**
```json
{
  "totalEstudiantes": 150,
  "totalAdministradores": 5,
  "mensaje": "Conteo exitoso"
}
```

**¿Qué verificar?**
- ✅ Se obtiene el total de estudiantes
- ✅ Se obtiene el total de administradores
- ✅ Los números son mayores a 0

---

### 6️⃣ **Pruebas de Período de Matrícula**

Haz clic en **"Período Activo"**

**Respuesta Esperada:**
```json
{
  "idPeriodoMatricula": 1,
  "fechaInicio": "2026-08-01",
  "fechaFin": "2026-12-31",
  "estado": true,
  "activo": true
}
```

**¿Qué verificar?**
- ✅ Existe un período activo
- ✅ Las fechas tienen formato correcto
- ✅ El estado es activo

---

## 📊 Interpretación de Errores

### Error 500 - Error Interno del Servidor
```
❌ Mensaje: "Error interno del servidor"
✓ Solución: Verifica que el backend está corriendo correctamente
```

### Error 401 - No Autorizado
```
❌ Mensaje: "Tu sesión ha expirado. Inicia sesión de nuevo"
✓ Solución: Ingresa credenciales válidas y obtén un token
```

### Error 404 - Recurso No Encontrado
```
❌ Mensaje: "El recurso no fue encontrado"
✓ Solución: Verifica que el ID del recurso es correcto
```

### Error de Conexión
```
❌ Mensaje: "No se pudo conectar con el servidor"
✓ Solución: 
   1. Verifica que el backend está en ejecución
   2. Verifica la URL en VITE_API_URL
   3. Verifica tu conexión a internet
```

---

## 🔍 Debugging Tips

### 1. Abre la Consola del Navegador
- Presiona `F12` en tu navegador
- Ve a la pestaña "Console"
- Aquí verás detalles de errores

### 2. Ve a Network Tab
- Presiona `F12` y ve a "Network"
- Realiza una prueba
- Haz clic en la solicitud para ver:
  - Headers (encabezados)
  - Response (respuesta del backend)
  - Status (código de estado HTTP)

### 3. Verifica el Token
- Abre Console y escribe: `localStorage.getItem('studyplanner-token')`
- Si es `null`, debes hacer login primero

### 4. Variables de Entorno
Verifica que en tu `.env` o `.env.local` tengas:
```
VITE_API_URL=https://studyplanner-v0t3.onrender.com
VITE_USE_MOCK_DATA=false
```

---

## ✅ Checklist de Pruebas

Use esta lista para verificar que todo funciona:

### Autenticación
- [ ] Login devuelve token válido
- [ ] Token se almacena en localStorage
- [ ] Error 401 cuando credenciales son inválidas
- [ ] Mensaje de error es amigable

### Horarios
- [ ] Se listan todos los horarios
- [ ] Cada horario tiene estructura correcta
- [ ] Los datos son numéricos válidos
- [ ] Se maneja error si no hay horarios

### Núcleos Temáticos
- [ ] Se listan todos los núcleos
- [ ] Se puede filtrar por semestre
- [ ] Se puede ordenar por cupo
- [ ] Actualizar cupo funciona

### Usuarios
- [ ] Se obtiene usuario por ID
- [ ] Se puede crear nuevo usuario
- [ ] Se puede editar usuario
- [ ] Se puede eliminar usuario
- [ ] Conteo de usuarios funciona

### Período de Matrícula
- [ ] Se obtiene período activo
- [ ] Estado de matrícula es correcto
- [ ] Se puede actualizar estado

---

## 🚀 Próxima Integración

Una vez que todos los servicios pasen las pruebas:

1. **Actualizar Componentes Principales**
   - Reemplazar datos mock con llamadas reales
   - Actualizar Dashboard, Pages, etc.

2. **Agregar Validaciones**
   - Verificar permisos según rol
   - Validar formularios antes de enviar

3. **Mejorar UX**
   - Agregar loading states
   - Agregar confirmaciones de acciones
   - Agregar undo/redo en operaciones críticas

4. **Producción**
   - Eliminar página de pruebas
   - Configurar logging correcto
   - Implementar error tracking (Sentry, etc.)

---

## 📞 Soporte

Si encuentras errores:

1. **Revisa el error en Console**
2. **Consulta SERVICIOS_FRONTEND.md**
3. **Verifica que el backend responde**
4. **Prueba con curl/Postman el endpoint directo**

---

**Última actualización:** 18 de Septiembre de 2026  
**Estado:** ✅ Listo para producción (después de pruebas)
