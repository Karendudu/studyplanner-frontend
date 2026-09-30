# 📚 StudyPlanner Frontend

Sistema de planificación académica de la Universidad de Cundinamarca.

## 🎯 Descripción

StudyPlanner es una aplicación web que permite a estudiantes, docentes y administradores gestionar:
- 📅 Horarios de clases
- 🎓 Núcleos temáticos (materias)
- 📊 Información de usuarios
- 📝 Avisos informativos
- 🏫 Sedes universitarias

## 🚀 Inicio Rápido

### Requisitos
- Node.js 18+
- npm o yarn

### Instalación

```bash
# Clonar repositorio
git clone <repo-url>
cd studyplanner-frontend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env

# Iniciar servidor de desarrollo
npm run dev
```

El servidor estará disponible en: `http://localhost:5174`

### Build para Producción

```bash
npm run build
npm run preview
```

## 📋 Documentación

- **[SERVICIOS_FRONTEND.md](SERVICIOS_FRONTEND.md)** - Documentación completa de todos los servicios
- **[TESTING_GUIDE.md](TESTING_GUIDE.md)** - Guía para probar los servicios
- **[DATABASE_PLAN.md](DATABASE_PLAN.md)** - Estructura de la base de datos
- **[COLOR_GUIDE.md](COLOR_GUIDE.md)** - Guía de colores corporativos

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes React reutilizables
│   ├── common/         # Componentes globales
│   ├── dashboard/      # Componentes del dashboard
│   ├── layout/         # Layout principal
│   └── ui/             # Componentes UI (Button, Card, etc)
├── context/            # Contextos React (Auth, Theme)
├── interfaces/         # Tipos e interfaces TypeScript
├── layouts/            # Layouts de páginas
├── pages/              # Páginas de la aplicación
├── router/             # Configuración del router
├── services/           # Servicios de API y datos
│   ├── api.ts          # Configuración base de fetch
│   ├── backend.ts      # Servicios del backend
│   ├── types.ts        # Tipos TypeScript
│   └── ...
└── utils/              # Utilidades y helpers
```

## 🔑 Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

```env
# API Backend
VITE_API_URL=https://studyplanner-v0t3.onrender.com

# Modo desarrollo
VITE_USE_MOCK_DATA=false
```

## 🔐 Autenticación

### Usuarios de Demo

Para probar con datos mock, activa `VITE_USE_MOCK_DATA=true` en `.env`:

| Email | Contraseña | Rol |
|-------|-----------|-----|
| jvalentinacortes@ucundinamarca.edu.co | 12345 | Admin |
| ojgomez@ucundinamarca.edu.co | 12345 | Docente |
| jhonsebastianrojas@ucundinamarca.edu.co | 12345 | Estudiante |

### Login Real

Para conectar con el backend real:
1. Usa `VITE_USE_MOCK_DATA=false`
2. Proporciona credenciales registradas en el backend
3. Se obtendrá un JWT token válido

## 📱 Roles y Permisos

| Rol | Permisos |
|-----|---------|
| **Admin** | Acceso completo, gestión de usuarios, reportes |
| **Docente** | Ver horarios, crear avisos, calificar |
| **Estudiante** | Ver horario personal, ver núcleos, avisos |

## 🛠️ Stack Tecnológico

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Build**: Vite
- **State Management**: Context API + React Hooks
- **Routing**: React Router v6
- **HTTP Client**: Fetch API (nativa)

## 📊 Servicios Disponibles

### ✅ Completamente Implementados

- ✓ Autenticación (Login/Logout)
- ✓ Gestión de Horarios (CRUD)
- ✓ Gestión de Núcleos Temáticos (CRUD)
- ✓ Gestión de Usuarios (CRUD)
- ✓ Conteo de usuarios
- ✓ Período de matrícula
- ✓ Envío de emails
- ✓ Manejo de errores amigable

### 🧪 Cómo Probar

1. Accede a `/test-servicios` (requiere agregar ruta al router)
2. Prueba cada servicio con datos reales
3. Observa las respuestas formateadas

Ver [TESTING_GUIDE.md](TESTING_GUIDE.md) para más detalles.

## 🎨 Temas y Estilos

La aplicación soporta dos temas:
- 🌙 **Oscuro** (por defecto)
- ☀️ **Claro**

Cambia el tema en el selector en la esquina superior derecha.

### Colores Corporativos

Los colores se definen en `src/constants/colors.ts`:
- Verde principal: `#1F8E59`
- Verde oscuro: `#0F2A1D`
- Amarillo: `#79C000`

Ver [COLOR_GUIDE.md](COLOR_GUIDE.md) para palette completa.

## 🐛 Debugging

### Console del Navegador
```javascript
// Ver token actual
localStorage.getItem('studyplanner-token')

// Ver usuario en sesión
localStorage.getItem('studyplanner-user')

// Limpiar datos locales
localStorage.clear()
```

### Network Tab (F12)
1. Abre DevTools (F12)
2. Ve a "Network"
3. Realiza una acción
4. Inspecciona la solicitud HTTP

## 📝 Buenas Prácticas

### Agregar un Nuevo Servicio

1. Agrega el tipo en `src/services/types.ts`
2. Crea la función en `src/services/backend.ts`
3. Importa y usa en tu componente
4. Maneja errores con `handleApiError`

```typescript
// types.ts
export interface MiRespuesta {
  datos: string;
}

// backend.ts
export async function miServicio(): Promise<MiRespuesta> {
  return apiRequest<MiRespuesta>("/api/endpoint", { method: "POST" });
}

// Componente
try {
  const resultado = await miServicio();
} catch (err) {
  const error = handleApiError(err);
  setError(error.mensaje);
}
```

### Crear un Componente

1. Coloca en `src/components/` según su categoría
2. Exporta en `index.ts` si es necesario
3. Usa TypeScript e interfaces
4. Prioriza accesibilidad (aria-labels, etc)

## 🚀 Despliegue

### Vercel (Recomendado)

```bash
# Deploy automático desde GitHub
# Solo push a main y Vercel se encarga
```

### Manual

```bash
npm run build
# Subir carpeta 'dist' a tu servidor
```

## 📞 Soporte y Contacto

Para reportar bugs o sugerencias:
1. Abre una issue en el repositorio
2. Describe el problema con detalles
3. Incluye capturas de pantalla si es relevante

## 📄 Licencia

Este proyecto es propiedad de la Universidad de Cundinamarca.

---

**Versión**: 1.0  
**Última actualización**: 18 de Septiembre de 2026  
**Estado**: ✅ Producción
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
