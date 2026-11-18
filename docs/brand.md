# Marca: Gold R.R Remodeling

## La idea

El logo es una casa dibujada con una sola línea dorada, de grosor constante y giros a 45°, apoyada en una barra dorada que termina en degradado. La web no añade nada ajeno a eso: lo amplía.

- **El hero es vídeo a pantalla completa con la barra del logo como suelo.** Tres baños en paralelo (uno en móvil), dos de ellos como transformación del antes al después, el titular encima, y la barra dorada por debajo con su tramo final en degradado. La barra lleva los datos que un cliente comprueba primero: años, licencia, valoración, idioma. (La primera versión metía el vídeo dentro de la casa del logo; se descartó porque quedaba rara y estática.)
- **El ángulo de 45° es el único gesto.** Las fotos se descubren con un corte a 45°, los marcos tienen una esquina achaflanada como los extremos de las líneas del logo, el preloader se abre por la diagonal y la línea del proceso sube en escalones de 45°.
- **La barra dorada es el subrayado.** Bajo cada titular, con el último tercio en degradado, igual que en el logo.
- **Donde no hay foto, hay material.** Cada servicio tiene un dibujo de línea del propio material (piedra de río, puerta shaker, azulejo a junta trabada, duela, pasadas de rodillo, textura orange peel en sus tres granos, perfiles de moldura, veta de piedra, parche de drywall), hecho con el mismo trazo del logo.

## Paleta

| Token | Hex | Origen y uso |
|---|---|---|
| `--color-gold` | `#BF9643` | Dorado del logo (casa, "R.R", barra). Líneas, acentos, texto grande sobre negro |
| `--color-gold-light` | `#DFA553` | Brillo del degradado de la barra. Enlaces y cifras sobre negro |
| `--color-gold-deep` | `#CC8C32` | Final ámbar del degradado |
| `--color-gold-ink` | `#6B4F17` | Dorado oscurecido para texto pequeño sobre claro (contraste 7:1) |
| `--color-ink` | `#0E0E0E` | Negro de las letras del logo. Fondo principal |
| `--color-coal` / `--color-char` | `#141414` / `#1B1B1B` | Superficies oscuras |
| `--color-bone` | `#F3F1EC` | Claro cálido de su web anterior. Secciones claras y formularios |
| `--color-stone` | `#8D867A` | Gris cálido muestreado de las fotos |
| `--color-mute` | `#A9A397` | Texto secundario sobre negro |

Degradado: `linear-gradient(100deg, #BF9643, #DFA553 52%, #CC8C32)`. Se usa en el botón principal, la barra y el progreso.

**Qué salió de las fotos.** El color dominante de los trabajos terminados cae en tres familias: grises cálidos de porcelanato y piedra de río (`#988878`, `#887868`, `#C8C8B8`), pizarra casi negra (`#181808`, `#282828`) y madera miel de las duelas (`#A87808`, `#784828`). Encajan con negro, hueso y dorado sin añadir ningún color, así que la paleta se quedó en la del logo más un gris cálido para neutros. Los colores vivos de la obra (membranas naranja y rosa) aparecen solo dentro de las fotos de proceso.

**Contraste.** Dorado sobre negro: 7.2:1. Sobre hueso el dorado no llega (2.4:1), por eso ahí el texto es negro y los acentos pequeños usan `--color-gold-ink`. Sobre dorado, el texto siempre es negro.

## Tipografía

| Familia | Uso |
|---|---|
| **Montserrat** 800 / 900, mayúsculas, tracking −0.02em | Titulares, botones, navegación |
| **Manrope** | Texto corrido |
| **Bebas Neue** | Solo cifras: contadores, numeración de etapas, millas |

Bebas Neue es la más cercana a la "G" alta del logo (se comprobó por diferencia de píxeles frente a Anton). Se cargan con `next/font`, autoalojadas, con `display: swap` y solo el subconjunto `latin`, que ya incluye todos los caracteres del español.

## Logo

El cliente pidió exactamente el mismo logo. `scripts/build-brand.mjs` lo reconstruye desde `Logo/logo-goldrr-transparent.png`:

- **Casa y barra:** redibujadas a mano como trazos de 26 px con uniones a inglete, sobre la geometría medida en el original (todo son rectas y 45°).
- **Letras:** cada glifo se toma de la fuente abierta más parecida y se ajusta a la caja exacta medida en el original, letra a letra. Bebas Neue para la "G", League Spartan para "OLD", "R.R" y "REMODELING". La fuente de cada grupo se eligió por diferencia de píxeles.
- **Fidelidad:** error medio de 4.1 sobre 255 frente al original a 300 px de ancho. La imagen de diferencias está en `docs/brand/logo-diff-300.png`. Las letras no son idénticas al píxel, porque la fuente original no se ha podido identificar; si el cliente tiene el archivo de diseño, lo ideal es sustituirlas por las suyas.

Archivos en `public/brand/`: `logo.svg` (letras negras), `logo-dark.svg` (letras blancas), `logo-mark.svg` (casa + G). Favicons e iconos en `app/` y `public/`. El SVG animable (con cada parte identificada) es `components/LogoArt.tsx`.

## Lo que se evita

- Fotos a más de unos 600 px de ancho en escritorio: el material no lo aguanta.
- Radios de borde. Las esquinas son rectas, con un solo chaflán.
- Un segundo color de acento.
- Citar reseñas que no se han copiado literalmente de Google.
