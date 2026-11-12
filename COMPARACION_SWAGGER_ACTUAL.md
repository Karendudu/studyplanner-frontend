# Comparación actual: Swagger y frontend

Fecha de revisión: 12 de noviembre de 2026
Fuente: [Swagger UI de StudyPlanner](https://studyplanner-v0t3.onrender.com/swagger/index.html) y `src/services/backend.ts`.

El listado compartido expone **44 operaciones**. El frontend tiene wrappers para **42**; faltan los de oferta académica y búsqueda de núcleos por código. La carga de sábana usa la ruta publicada y envía el archivo como `multipart/form-data`. La cobertura de servicios no garantiza que Render autorice o ejecute correctamente cada operación para cada rol.

## Estado por módulo

| Módulo | Operaciones | Flujo de interfaz |
|---|---:|---|
| Autenticación | 2/2 | `/api/Auth/login` principal y `/api/Usuarios/inicioSesion` como fallback ante fallo de red/servidor; solo se acepta éxito con token. |
| Avisos | 4/4 | Udec crea y edita; Udec y estudiantes listan y consultan el detalle. Dashboard muestra los tres más recientes. Confirmar autorización GET para estudiantes en backend. |
| Cronograma | 2/2 | Consulta del programa del usuario y consulta por ID desde la página Cronograma. Las respuestas se muestran sin transformar porque Swagger no describe su esquema. |
| Horarios y correo | 6/6 | Listar, ver detalle, crear, editar, eliminar y enviar por correo desde Horarios. |
| Núcleos | 10/12 | CRUD, filtros y consulta de núcleos vistos; faltan oferta académica y búsqueda por código. |
| Período de matrícula | 4/4 | Período activo, estado, actualización y edición desde la vista administrativa. Las consultas personales se ejecutan solo para rol estudiante. |
| Recuperación de contraseña | 3/3 | Flujo público desde Login: solicitar código, verificarlo y cambiar contraseña. |
| Reglas | 2/2 | Materias permitidas y generación de horarios conectadas a sus respectivas pantallas. |
| Sábana PDF | 1/1 | La página permite seleccionar un PDF y lo envía en el campo `archivo` como `multipart/form-data` a `/api/Sabana/subir`. |
| Usuarios | 8/8 | Consulta/creación/edición/eliminación de usuarios, creación de cuenta Udec, listado de estudiantes, conteo y estudiantes por programa. El login alternativo está contado en autenticación. |
| **Total** | **42/44** | Faltan los dos endpoints de núcleos indicados arriba. |

El listado `/api/Usuarios/estudiantes` devuelve estudiantes, no un listado general de todos los roles. Para editar, el frontend consulta el detalle y envía nombre, teléfono, correo y contraseña nueva, los campos requeridos por el PUT.

## Rutas o capacidades pendientes

| Necesidad del frontend | Estado |
|---|---|
| Avisos | Udec gestiona y estudiantes consultan. No hay eliminación publicada; confirmar en backend que los GET permitan lectura estudiantil. |
| Cronograma | Los dos GET están disponibles en una página; falta confirmar el contrato de respuesta para sustituir la visualización genérica por componentes tipados. |
| Auditoría | No hay endpoint publicado; se retiró del menú y de las pantallas activas. Las rutas antiguas redirigen al dashboard. |
| Listado general de usuarios | Solo está publicado el listado de estudiantes. |
| CRUD independiente de programas, facultades o sedes | No hay endpoints específicos; Núcleos incluye relaciones de programa cuando el backend las devuelve. La ficha de Ingeniería y sus sedes usa información oficial estática. |
| Recuperación de contraseña | Tres endpoints conectados; hace falta prueba de extremo a extremo con correo real y código válido. |
| Generación de horarios | Integrada en la página de generación desde Horarios. |
| Edición de período de matrícula | Integrada en la vista administrativa de períodos. |
| Persistencia de núcleos desde la sábana | La respuesta del análisis ya se presenta en la página de sábana y la página Materias consulta los núcleos vistos. Falta probar una carga autenticada y confirmar que después el GET devuelve esos registros. |

## Incidencias observadas en producción

- `GET /api/Horario/listar` devuelve HTTP 500 para la cuenta Udec. La respuesta 500 no incluye CORS y el navegador además muestra el aviso de CORS; hay que corregir el error interno en los logs de Render.
- `GET /api/NucleoTematicoes` devolvió 401 para un estudiante con el mensaje de que el backend no pudo identificar al usuario autenticado. Revisar cómo el backend interpreta el ID de usuario del JWT.

Que el endpoint esté documentado y tenga wrapper en frontend no garantiza que esté autorizado ni operativo para cada rol. Estos dos errores deben resolverse en el backend.
