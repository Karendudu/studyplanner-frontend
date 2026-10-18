# Comparación actual: Swagger y frontend

Fecha de revisión: 30 de septiembre de 2026
Fuente: [Swagger UI de StudyPlanner](https://studyplanner-v0t3.onrender.com/swagger/index.html) y `src/services/backend.ts`.

El Swagger compartido expone **40 operaciones**. El frontend cubre **38 (95%)** mediante servicios y pantallas; esto no garantiza que Render las autorice o ejecute correctamente para cada rol. Los contratos nuevos deben confirmarse al probar cada flujo contra el backend.

## Estado por módulo

| Módulo | Operaciones | Flujo de interfaz |
|---|---:|---|
| Autenticación | 2/2 | `/api/Auth/login` principal y `/api/Usuarios/inicioSesion` como fallback ante fallo de red/servidor; solo se acepta éxito con token. |
| Avisos | 4/4 | Udec crea y edita; Udec y estudiantes listan y consultan el detalle. Dashboard muestra los tres más recientes. Confirmar autorización GET para estudiantes en backend. |
| Horarios y correo | 6/6 | Listar, ver detalle, crear, editar, eliminar y enviar por correo desde Horarios. |
| Núcleos | 10/10 | CRUD, filtros y consulta de núcleos vistos; los vistos se muestran al estudiante en Materias. |
| Período de matrícula | 3/4 | Período activo, estado y actualización; falta editar período. Las consultas personales se ejecutan solo para rol estudiante. |
| Recuperación de contraseña | 3/3 | Flujo público desde Login: solicitar código, verificarlo y cambiar contraseña. |
| Reglas | 1/2 | Materias permitidas conectadas; falta generar horarios. |
| Sábana PDF | 1/1 | Se envía `archivo` como `multipart/form-data`; se muestran resumen, materias y componentes de la respuesta procesada. Falta confirmar que el backend persista los núcleos vistos para que aparezcan en la consulta personal. |
| Usuarios | 8/8 | Listar estudiantes, consultar/crear/editar/eliminar usuarios, crear cuenta Udec, contar usuarios y consultar estudiantes por programa. |
| **Total** | **38/40 (95%)** | Quedan dos operaciones publicadas sin integrar. |

El listado `/api/Usuarios/estudiantes` devuelve estudiantes, no un listado general de todos los roles. Para editar, el frontend consulta el detalle y envía nombre, teléfono, correo y contraseña nueva, los campos requeridos por el PUT.

## Rutas o capacidades pendientes

| Necesidad del frontend | Estado |
|---|---|
| Avisos | Udec gestiona y estudiantes consultan. No hay eliminación publicada; confirmar en backend que los GET permitan lectura estudiantil. |
| Auditoría | No hay endpoint publicado; se retiró del menú y de las pantallas activas. Las rutas antiguas redirigen al dashboard. |
| Listado general de usuarios | Solo está publicado el listado de estudiantes. |
| CRUD independiente de programas, facultades o sedes | No hay endpoints específicos; Núcleos incluye relaciones de programa cuando el backend las devuelve. La ficha de Ingeniería y sus sedes usa información oficial estática. |
| Recuperación de contraseña | Tres endpoints conectados; hace falta prueba de extremo a extremo con correo real y código válido. |
| Generación de horarios | Endpoint publicado; falta integrarlo en una acción de interfaz. |
| Edición de período de matrícula | Endpoint publicado; falta integrarlo en una vista administrativa. |
| Persistencia de núcleos desde la sábana | La respuesta del análisis ya se presenta en la página de sábana y la página Materias consulta los núcleos vistos. Falta probar una carga autenticada y confirmar que después el GET devuelve esos registros. |

## Incidencias observadas en producción

- `GET /api/Horario/listar` devuelve HTTP 500 para la cuenta Udec. La respuesta 500 no incluye CORS y el navegador además muestra el aviso de CORS; hay que corregir el error interno en los logs de Render.
- `GET /api/NucleoTematicoes` devolvió 401 para un estudiante con el mensaje de que el backend no pudo identificar al usuario autenticado. Revisar cómo el backend interpreta el ID de usuario del JWT.

Que el endpoint esté documentado y tenga wrapper en frontend no garantiza que esté autorizado ni operativo para cada rol. Estos dos errores deben resolverse en el backend.
