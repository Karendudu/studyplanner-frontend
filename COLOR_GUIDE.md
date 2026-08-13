# Guía de Colores - Universidad de Cundinamarca

## Paleta Oficial

Este documento describe la paleta de colores oficial de la Universidad de Cundinamarca utilizados en el proyecto StudyPlanner.

### Colores Primarios

| Color | Nombre | Hex | Uso |
|-------|--------|-----|-----|
| ![#0F2A1D](https://via.placeholder.com/30/0F2A1D/0F2A1D) | Verde Oscuro | `#0F2A1D` | Fondos oscuros, encabezados |
| ![#375534](https://via.placeholder.com/30/375534/375534) | Verde Medio | `#375534` | Elementos interactivos |
| ![#6B9071](https://via.placeholder.com/30/6B9071/6B9071) | Verde | `#6B9071` | Texto secundario |
| ![#AEC3B0](https://via.placeholder.com/30/AEC3B0/AEC3B0) | Verde Claro | `#AEC3B0` | Bordes, divisores |
| ![#E3EED4](https://via.placeholder.com/30/E3EED4/E3EED4) | Crema | `#E3EED4` | Fondos claros |

### Colores Secundarios

| Color | Nombre | Hex | Pantone |
|-------|--------|-----|---------|
| ![#F7931E](https://via.placeholder.com/30/F7931E/F7931E) | Naranja | `#F7931E` | PANTONE 144 C |
| ![#79C000](https://via.placeholder.com/30/79C000/79C000) | Verde Lima | `#79C000` | PANTONE 3561 C |
| ![#00A99D](https://via.placeholder.com/30/00A99D/00A99D) | Turquesa | `#00A99D` | PANTONE 7716 C |
| ![#FBE122](https://via.placeholder.com/30/FBE122/FBE122) | Amarillo | `#FBE122` | PANTONE 107 C |
| ![#4D4D4D](https://via.placeholder.com/30/4D4D4D/4D4D4D) | Gris | `#4D4D4D` | PANTONE 425 C |

### Colores Neutros

| Color | Nombre | Hex | Uso |
|-------|--------|-----|-----|
| ![#FFFFFF](https://via.placeholder.com/30/FFFFFF/FFFFFF) | Blanco | `#FFFFFF` | Fondos principales |
| ![#F7F9F8](https://via.placeholder.com/30/F7F9F8/F7F9F8) | Fondo | `#F7F9F8` | Fondo de página |
| ![#E5E7EB](https://via.placeholder.com/30/E5E7EB/E5E7EB) | Borde | `#E5E7EB` | Líneas divisoras |
| ![#6B7280](https://via.placeholder.com/30/6B7280/6B7280) | Gris claro | `#6B7280` | Texto secundario |
| ![#1F2937](https://via.placeholder.com/30/1F2937/1F2937) | Texto | `#1F2937` | Texto principal |

## Uso en el Proyecto

### CSS Variables

Los colores están disponibles como variables CSS en todo el proyecto:

```css
/* Acceso en archivos CSS */
background-color: var(--color-primary);
color: var(--color-text);
border-color: var(--color-border);
```

### Tailwind CSS

Los colores también están integrados en Tailwind:

```html
<!-- Clases de Tailwind -->
<button class="bg-primary-600 text-white">Botón principal</button>
<div class="border-forest-300">Contenedor</div>
<span class="text-accent-orange">Texto naranja</span>
```

### TypeScript / React

Importa desde constantes:

```typescript
import { COLORS } from "@/constants/colors";

// Uso
style={{ backgroundColor: COLORS.primary }}
style={{ color: COLORS.darkGreen }}
```

## Directrices de Uso

- **Primario Oscuro (#0F2A1D)**: Barras laterales, encabezados principales
- **Primario (#007B3E)**: Botones principales, enlaces activos
- **Verdes degradados**: Para jerarquía visual y profundidad
- **Secundarios**: Acentos, advertencias, información importante
- **Neutros**: Fondos, texto, bordes

## Manual de Imagen Institucional

Referencia: Manual de Imagen Institucional ECO0002V 17 - Universidad de Cundinamarca
