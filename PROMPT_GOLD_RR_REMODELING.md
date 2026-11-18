# PROMPT PARA CLAUDE CODE — Web de GOLD R.R REMODELING (Vallejo, CA)

> Lee este archivo completo antes de escribir una sola línea de código. Eres el responsable de TODO: estudiar las referencias, procesar las fotos y vídeos, crear el logo vectorial, generar animaciones y vídeos, construir la web, optimizarla para SEO local en EE. UU. y dejarla lista para desplegar en Vercel. No te detengas a preguntar por datos que falten: usa un placeholder claro, apúntalo en `CONTENT-TODO.md` y sigue.

---

## 0. Objetivo

Construir la web oficial de **GOLD R R REMODELING**, contratista de remodelación (baños, cocinas, azulejo, suelos, pintura, drywall, carpintería de acabado) con base en **Vallejo, CA 94591**. Su web actual (Google Sites) está obsoleta y se sustituye por completo.

La web debe:
1. Estar al nivel visual y técnico de mis webs anteriores (ver §2) — mismo ADN, misma calidad, **animaciones salvajes**.
2. Rankear en Google para búsquedas locales del tipo *"bathroom remodeling Vallejo CA"*, *"kitchen remodel contractor Napa"*, *"tile installer Fairfield CA"*.
3. Convertir: llamadas, SMS y solicitudes de presupuesto gratuito.
4. Ir acompañada de su **página de links** (link-in-bio), igual que todas mis webs (ver §9).

Idioma del contenido de la web: **inglés de EE. UU.** (principal) + **español** como versión secundaria (el dueño es latino y atiende en español). Este prompt está en español solo para mí.

---

## 1. Datos reales del negocio (extraídos de su ficha de Google y su web vieja)

| Campo | Valor |
|---|---|
| Nombre comercial | **GOLD R R REMODELING** (en el logo: "GOLD R.R REMODELING"). Usa "Gold R.R Remodeling" en textos corridos |
| Nombre en Google Business Profile | `Contractor \| GOLD R R REMODELING \| Handyman` (no copies este formato en la web; solo el nombre) |
| Categoría | Remodeling contractor / General contractor / Handyman |
| Licencia | **CA Contractor License #1149164** (mostrarla en header/footer; verificar en cslb.ca.gov → TODO) |
| Ubicación | Vallejo, CA 94591 — **negocio de área de servicio** (no publica dirección: NO inventes calle) |
| Teléfono (llamada y SMS) | **(707) 430-8295** → `tel:+17074308295` / `sms:+17074308295` |
| Email | **goldrrremodeling2@gmail.com** |
| Horario | Abre a las 8:00 AM (resto del horario sin confirmar → TODO) |
| Experiencia | **Más de 13 años** |
| Google | ⭐ **4.7** con 3 reseñas (no hardcodear el número de reseñas; ver §6.4) |
| Ficha de Google (link corto) | https://maps.app.goo.gl/RfiixBxeqjtmqqDeA |
| Ficha de Google (link estable por CID) | https://maps.google.com/?cid=15158176856236819516 |
| Atributos de Google | Latino-owned business · LGBTQ+ friendly · Online estimates · Assistance in other languages |
| Web vieja (solo referencia de contenido) | https://sites.google.com/view/goldrrremodeling/ y `/services` |
| Otros perfiles | Aparece en "Pro Referral" (Home Depot) según la web vieja → URL sin confirmar (TODO). Redes sociales: ninguna encontrada (TODO) |
| Dueño / jefe de obra | Las reseñas mencionan a **José** → confirmar nombre completo antes de publicarlo (TODO) |
| Dominio | Sin confirmar → usa `https://www.goldrrremodeling.com` como placeholder en una sola constante (`SITE_URL`) |

**Área de servicio** (la ficha de Google marca Solano + Napa + Sonoma; la web vieja dice "Solano area and all California"):
Vallejo (base), Benicia, American Canyon, Fairfield, Suisun City, Vacaville, Napa, Sonoma, Petaluma, Santa Rosa, Rohnert Park. Déjalo en un único archivo de datos (`data/areas.ts`) para poder ajustarlo.

**Servicios** (de su web vieja, con su descripción):
- **Bathroom Remodeling** — renovaciones completas de baño: espacios modernos, funcionales y cómodos.
- **Kitchen Remodeling** — mejoras de cocina adaptadas a necesidad y estilo.
- **Tile Installation** — suelos, paredes, cocinas y baños con acabados limpios y precisos.
- **Flooring Installation** — tile, vinyl, LVP, madera.
- **Interior & Exterior Painting** — pintura que renueva y protege la propiedad.
- **Drywall** — instalación, reparación y acabado: smooth, orange peel fine / medium / heavy.
- **Finish Carpentry** — baseboards, crown molding, puertas, trim, detalles en madera.
- **Countertops** y **Custom Carpentry**.
- **Restoration, Repairs & Demolition** (+ trabajos tipo handyman).

**Mensajes y tono de marca** (suyos, reutilízalos pulidos en inglés):
- "More than a service — an experience."
- "Let's make your dream a reality. Let's work together."
- "Every project is completed using the appropriate materials."
- "Keeping the work area clean is one of our priorities."
- Por qué elegirlos: 13+ years of experience · On-time and reliable · Clean and detailed work · Commitment to quality · Personalized customer service · Free estimates.
- El dueño cierra sus mensajes con "God bless" → puedes incluir un toque discreto de valores/fe en About, nunca forzado.

**Reseñas reales de Google** (usa solo estas, con enlace a Google; no inventes otras):
- **Eric Falk** — José transformó su baño anticuado en uno moderno; rediseñó el baño principal, que tenía mucho espacio desaprovechado.
- **Kevin Collins** — remodelación de baño impecable de principio a fin; contratista hábil y fiable.
- Copia el texto original en inglés directamente desde Google (abre la ficha) y cita literalmente; si no puedes acceder, deja un placeholder `[[REVIEW_TEXT]]` y anótalo en `CONTENT-TODO.md`.

---

## 2. Referencias de diseño (mis webs — estúdialas antes de empezar)

Abre cada una (WebFetch, y si tienes Playwright/Chrome, navégalas, haz scroll completo, captura desktop 1440px y móvil 390px y lee su HTML/CSS). Toma de ellas estructura, ritmo, tipografía, microinteracciones y nivel de animación. **No copies textos ni marcas.**

| Web | Qué tomar |
|---|---|
| https://vantrex-construction.vercel.app | **La más cercana en estética: negro + dorado**, Montserrat. Top bar (ciudad · horario · free estimates · email), hero con tarjeta de "Get your free quote" a la derecha, franja diagonal dorada, chips de confianza, slider **before/after** arrastrable, selector de estancias "Inside the house" (02/06), contadores, proceso en 4 pasos, toggle EN/ES, barra fija inferior en móvil (Call · Text · Estimate), botón WhatsApp, JSON-LD `HomeAndConstructionBusiness` |
| https://aeva-detailing.vercel.app | Hero cinematográfico a pantalla completa con vídeo en loop y titular enorme en mayúsculas, logo centrado, menú hamburguesa a pantalla completa, **Lenis** smooth scroll, marquee infinito, proceso en carrusel por pasos (01/03), carrusel de **reels de vídeo**, galería, FAQ acordeón, formulario con consentimiento de SMS |
| https://www.vista-painting.com | **Arquitectura SEO multipágina** (`/services`, `/areas`, `/areas/[ciudad]`, `/about`, `/contact`, `/privacy`, `/terms`), JSON-LD con `@id`, OG completo, jerarquía H1→H4 limpia, sección de redes + CTA de reseña en Google, áreas de servicio por ciudad |
| https://colombia-parce.vercel.app | Interactividad: filtros por categoría, configurador por pasos con resumen en vivo, barra inferior de acciones, toggle EN/ES |
| https://brightcoat-painting-links.vercel.app | **Plantilla exacta de la página de links** (ver §9) |

Stack detectado en mis webs (mantenlo): **Next.js (App Router) en Vercel, Lenis, fuentes Montserrat / Manrope / Archivo**.

Errores que vi en mis referencias y que **NO** debes repetir:
- Dos `<h1>` en la misma página (aeva) → exactamente un H1 por página.
- Contadores que en el HTML renderizado muestran "0+" (vantrex) → el valor final debe estar en el HTML del servidor; la animación de conteo solo ocurre en cliente.
- Canonical apuntando a un dominio distinto del que usan los enlaces internos (aeva) → un único `SITE_URL`.
- Horarios inconsistentes entre secciones (vantrex) → un único origen de datos (`data/business.ts`).

---

## 3. Assets disponibles en esta carpeta

### 3.1 Fotos y vídeos del cliente
Busca recursivamente todas las imágenes (`jpg/jpeg/png/heic/webp`) y vídeos (`mp4/mov/m4v`) del proyecto (probablemente en una carpeta tipo `media/`, `fotos/`, `videos/` o `assets/`).
- **Nunca modifiques los originales.** Trabaja sobre copias en `public/media/` (procesadas) y guarda un `media-manifest.json` con: archivo original, categoría, descripción, dimensiones, duración, uso asignado.
- **Mira cada imagen** y clasifícala: bathroom, kitchen, tile, flooring, painting, drywall, carpentry, exterior, before, after, team, other. Detecta parejas before/after.
- Renombra con nombres SEO: `bathroom-remodel-vallejo-ca-01.avif`, etc.
- Corrige orientación EXIF, endereza, recorta, ajusta exposición/balance de blancos de forma sutil (sin que parezca editado). Si hay fotos de baja resolución, escálalas con el mejor método disponible (Real-ESRGAN si lo puedes instalar; si no, `sharp` lanczos3 + sharpen suave) y nunca las uses más grandes de lo que aguantan.

### 3.2 Logo (el cliente quiere **exactamente el mismo logo**, sin rediseño)
En `brand/`:
- `logo-original-rect.png` — captura del logo de su web vieja (con su fondo gris geométrico).
- `logo-original-square.png` — versión cuadrada (la que usa como icono).
- `logo-goldrr-transparent.png` — ya recortado y con fondo transparente (texto negro) → para fondos claros.
- `logo-goldrr-on-dark.png` — misma versión con "GOLD" y "REMODELING" en blanco → para fondos oscuros.
- `logo-preview-on-dark.png` — vista previa.

Tareas de logo:
1. **Vectoriza el logo a SVG** fiel al original: las líneas de la casa son geometría simple (polilíneas de grosor constante) → redibújalas a mano como `<path>`; el texto ("G" condensada tipo Bebas/Anton, "OLD", "R.R" en sans geométrica extra-bold, "REMODELING" en sans bold) → identifica la fuente más cercana o vectoriza con potrace/vtracer por capa de color. Superpón el SVG sobre el PNG original y compara (diff de píxeles) hasta que sea indistinguible a 300px de ancho.
2. Exporta: `logo.svg` (claro), `logo-dark.svg` (texto blanco), `logo-mark.svg` (solo la casa + "G" para favicon), favicons (`favicon.ico`, `icon.svg`, `apple-icon.png` 180, `icon-192/512.png`), `og-default.jpg` 1200×630.
3. Prepara el SVG con grupos/ids separados (`#roof-outer`, `#roof-inner`, `#letter-g`, `#text-old`, `#text-rr`, `#text-remodeling`, `#gold-bar`) para animarlo (ver §5).
4. La barra dorada inferior tiene un degradado en su último tramo: replícalo.

Si no tienes `brand/`, la fuente del logo es la web vieja: https://sites.google.com/view/goldrrremodeling/ (las URLs directas de las imágenes de Google Sites devuelven 403 sin el referer del sitio).

---

## 4. Identidad visual

### 4.1 Paleta (base sacada del logo — ajústala con las fotos)
| Token | Hex | Origen |
|---|---|---|
| `--gold` | `#BF9643` | Dorado principal del logo (casa, "R.R", barra) |
| `--gold-light` | `#DFA553` | Brillo del degradado de la barra |
| `--gold-deep` | `#CC8C32` | Final ámbar del degradado |
| `--ink` | `#0E0E0E` | Negro del texto del logo |
| `--surface` | `#141414` / `#1B1B1B` | Superficies oscuras (derivadas) |
| `--bone` | `#F3F1EC` | Claro cálido (fondo de su web vieja) |

Después **extrae la paleta dominante de las fotos del cliente** (p. ej. `node-vibrant` o histograma con `sharp`) y úsala para afinar neutros y acentos (piedra, mármol, madera, latón suelen salir en remodelaciones de baño). Su foto principal de Google es un baño con azulejo oscuro, grifería dorada y mueble de madera: encaja perfecto con negro + dorado. Documenta la paleta final en `docs/brand.md`.

Reglas: contraste WCAG AA (dorado sobre negro OK para texto grande; para texto pequeño sobre dorado usa `--ink`). Usa el degradado dorado (`--gold` → `--gold-light` → `--gold-deep`) en CTAs principales, subrayados y la barra de progreso, con un **shimmer** animado sutil.

### 4.2 Tipografía
Montserrat (titulares en mayúsculas, peso 800/900, tracking ajustado) + Manrope o Inter para cuerpo. Una fuente condensada (Bebas Neue / Anton) solo para números grandes y detalles que hagan eco de la "G" del logo. Carga con `next/font` (self-hosted, `display: swap`, subset latin + latin-ext).

### 4.3 Dirección de arte
Lujo de obra: oscuro, cinematográfico, mucho aire, fotos enormes, líneas finas doradas que imitan las líneas de la casa del logo (úsalas como motivo gráfico: separadores, marcos que se dibujan, esquinas de tarjetas). Grano/ruido sutil sobre el negro. Nada de plantillas genéricas.

---

## 5. Animaciones (nivel "salvaje", pero rápidas y accesibles)

Stack: **GSAP + ScrollTrigger + SplitText** (todos los plugins de GSAP son gratuitos, uso comercial incluido) con `@gsap/react` (`useGSAP`), **Lenis** para smooth scroll sincronizado con ScrollTrigger. Framer Motion solo si algo concreto lo pide.

Imprescindibles:
1. **Preloader de logo**: las líneas de la casa se dibujan (stroke-dashoffset), la "G" cae con rebote, "OLD" y "R.R" se revelan con máscara, "REMODELING" letra a letra y la **barra dorada actúa como barra de progreso real** de carga. Termina con un *curtain split* (dos paneles que se abren) hacia el hero. Máx. 2.2 s, solo en la primera visita de la sesión (`sessionStorage`).
2. **Hero**: vídeo a pantalla completa en loop (montaje de sus mejores clips, ver §7), overlay degradado negro→transparente, H1 con SplitText por palabras/letras, parallax del vídeo al hacer scroll, línea dorada que dibuja un marco alrededor del contenido, indicador de scroll animado.
3. **Servicios en scroll horizontal pinned** (desktop): tarjetas grandes con imagen/vídeo que hace *scale + clip-path reveal*; en móvil, carrusel con snap.
4. **Before/After**: slider arrastrable (teclado incluido) que al entrar en viewport hace una demo automática de ida y vuelta.
5. **Selector de estancias** tipo vantrex (Bathroom · Kitchen · Floors · Painting · Drywall · Carpentry) con transición de imagen por máscara y contador 01/06.
6. **Proceso** en 4 pasos con una línea SVG dorada que se dibuja con el scroll y conecta los pasos.
7. **Contadores** (solo datos reales: 13+ years, 4.7★ Google, CA License #1149164, Free estimates) con el valor final ya en el HTML.
8. **Galería**: masonry con reveals escalonados, lightbox con navegación y swipe; **reels de vídeo** en carrusel (autoplay muted al estar en viewport, pausa fuera).
9. **Marquee** infinito con los servicios (y velocidad que reacciona a la velocidad de scroll).
10. Microinteracciones: botones magnéticos, shimmer dorado en CTAs, cursor personalizado solo en desktop con puntero fino, hover de imágenes con zoom suave, header que se oculta al bajar y aparece al subir, transiciones de página (View Transitions API o cortina dorada).
11. Texto con efecto *scrub* (opacidad por palabra ligada al scroll) en el bloque "About".

Reglas de rendimiento/accesibilidad de las animaciones:
- `prefers-reduced-motion: reduce` → sin preloader, sin parallax, sin pin; solo fades.
- Anima solo `transform` y `opacity` (y `clip-path` puntual). Nada de layout thrashing.
- Carga GSAP de forma diferida en componentes cliente; el contenido debe ser legible y completo sin JS (SEO).
- `ScrollTrigger.refresh()` tras cargar imágenes/fuentes; limpia todo al desmontar.
- 60 fps en un móvil medio. Si una animación baja de eso, simplifícala en móvil.

---

## 6. Arquitectura, contenido y SEO local

### 6.1 Stack
Next.js (última versión estable, App Router, TypeScript estricto), Tailwind CSS v4, `next/image`, `next/font`, `next-intl` (i18n), GSAP, Lenis, Zod, Resend (formularios), `@vercel/analytics` + GA4 opcional (`@next/third-parties`). pnpm. ESLint + Prettier. Desplegable en Vercel sin configuración extra.

Datos centralizados (un único origen de verdad): `data/business.ts` (NAP, licencia, horario, links), `data/services.ts`, `data/areas.ts`, `data/reviews.ts`, `data/faqs.ts`.

### 6.2 Mapa del sitio
```
/                                   Home
/services                           Índice de servicios
/services/bathroom-remodeling
/services/kitchen-remodeling
/services/tile-installation
/services/flooring-installation
/services/interior-exterior-painting
/services/drywall-repair-texture
/services/finish-carpentry
/services/countertops
/services/repairs-restoration       (repairs, restoration, demolition, handyman)
/service-areas                      Índice + mapa
/service-areas/vallejo-ca            (+ una por ciudad de data/areas.ts)
/gallery                            Proyectos con filtros + before/after + reels
/about
/contact                            Formulario "Free Estimate" + llamada/SMS/email
/privacy  /terms                    (incluye aviso CCPA de California y consentimiento SMS)
/es/...                             Versión en español de todo lo anterior
```

### 6.3 Home (orden de secciones)
1. **Top bar**: Vallejo, CA · CA Lic. #1149164 · Free Estimates · email.
2. **Header**: logo, nav, toggle EN/ES, botón de teléfono dorado, CTA "Free Estimate". Menú móvil a pantalla completa animado.
3. **Hero**: H1 con keyword + ciudad (p. ej. "Bathroom & Kitchen Remodeling in Vallejo, CA"), subtítulo con el tagline "More than a service — an experience.", CTAs "Get a Free Estimate" y "Call (707) 430-8295", tarjeta de presupuesto rápido (nombre, teléfono, servicio) y chips de confianza: 13+ Years · Licensed CA Contractor · 4.7★ on Google · Latino-owned · Se habla español.
4. **Marquee** de servicios.
5. **About teaser** (13+ años, limpieza en obra, atención personalizada, materiales adecuados para cada proyecto).
6. **Servicios** (scroll horizontal pinned).
7. **Before/After** destacado (el mejor baño).
8. **Selector de estancias**.
9. **Proceso**: Call or Text → Free On-Site Estimate → Build (clean job site every day) → Final Walkthrough.
10. **Stats** (solo reales).
11. **Galería + reels**.
12. **Reseñas reales de Google** + botón "Leave us a review".
13. **Áreas de servicio** con mapa (iframe de Google Maps cargado solo al interactuar o con fachada estática, para no penalizar el rendimiento).
14. **FAQ** acordeón (free estimates, licencia, áreas, español, tipos de proyecto; tiempos y precios → TODO, no inventar).
15. **CTA final**: "Let's make your dream a reality. Let's work together."
16. **Footer** con NAP idéntico a Google, licencia, links, horario, redes (cuando existan), privacy/terms.
17. **Barra fija inferior en móvil**: Call · Text · Estimate (+ botón WhatsApp/SMS flotante en desktop).

### 6.4 Reglas de contenido (importantes)
- **No inventes** reseñas, testimonios, número de proyectos, años distintos de 13+, seguros ("insured"), garantías, certificaciones, precios, marcas de pintura/materiales ni premios. Lo que no esté en §1 → placeholder + `CONTENT-TODO.md`.
- Las reseñas se muestran citando a Google, con nombre tal como aparece y enlace a la ficha.
- Escribe copy original, natural y específico para cada página de servicio (600–1.000 palabras: qué incluye, proceso, materiales/acabados, tiempos como rango "a confirmar", FAQs propias, galería filtrada de ese servicio, CTA).
- **Páginas de ciudad**: contenido realmente local y distinto en cada una (barrios/tipos de vivienda de la zona, distancia desde Vallejo, servicios más pedidos, proyectos de esa zona si las fotos lo permiten). Nada de páginas clonadas cambiando el nombre de la ciudad (eso es doorway spam y Google lo penaliza).
- Versión en español: traducción natural (español neutro de EE. UU.), no literal.

### 6.5 SEO técnico
- Metadata por página con la Metadata API: `title` ≤ 60 caracteres con servicio + ciudad + marca, `description` ≤ 155, canonical absoluto desde `SITE_URL`, `alternates.languages` (hreflang `en-US`, `es-US`, `x-default`), Open Graph y Twitter `summary_large_image`.
- **OG images dinámicas** por página con `next/og` (fondo negro, línea dorada, logo, título).
- **JSON-LD** (componente reutilizable):
  - `HomeAndConstructionBusiness` (+ `GeneralContractor`) con `@id` `SITE_URL/#business`, `name`, `url`, `logo`, `image`, `telephone` `+1-707-430-8295`, `email`, `address` solo con `addressLocality: Vallejo`, `addressRegion: CA`, `postalCode: 94591`, `addressCountry: US`, `areaServed` (lista de ciudades como `City`), `hasMap` (link CID), `sameAs` (ficha de Google y redes cuando existan), `openingHoursSpecification` (cuando se confirme), `knowsLanguage: ["en","es"]`, `hasCredential` con la licencia.
  - `Service` en cada página de servicio (`provider` → `#business`, `areaServed`).
  - `BreadcrumbList` en páginas internas. `FAQPage` en las FAQs. `WebSite` en la home.
  - **No** añadas `AggregateRating`/`Review` de las reseñas de Google sobre el propio negocio (Google no muestra rich results de reseñas propias en LocalBusiness y puede verse como manipulación).
- `app/sitemap.ts` (con alternates de idioma) y `app/robots.ts`. `manifest.webmanifest`, `theme-color` `#0E0E0E`.
- Un H1 por página, jerarquía H2/H3 limpia, HTML semántico, enlaces internos entre servicios ↔ ciudades ↔ galería.
- `alt` descriptivo con contexto local en cada imagen ("Walk-in tile shower with brass fixtures — bathroom remodel in Vallejo, CA").
- NAP **idéntico** al de Google en todo el sitio.
- Breadcrumbs visibles. 404 personalizado con CTA.

### 6.6 Rendimiento (objetivo Lighthouse móvil ≥ 90 en todo, Core Web Vitals en verde)
- LCP < 2.5 s: el LCP del hero es el **poster** del vídeo (AVIF/WebP, `priority`), el vídeo se carga después.
- CLS < 0.1 (dimensiones fijas en media, fuentes con `size-adjust`). INP < 200 ms.
- Imágenes AVIF/WebP con `sizes` correctos; vídeos con `preload="none"` salvo el hero (`metadata`), lazy por IntersectionObserver.
- JS de animación diferido; nada bloqueante en el render.

### 6.7 Formularios y conversión
- Formulario "Free Estimate": nombre, teléfono, email, ciudad, tipo de propiedad, servicio(s), descripción, subida de fotos opcional (máx. 5, comprimidas en cliente), preferencia de contacto (call/text/email), idioma preferido.
- Server Action + Zod + honeypot + rate limit básico. Envío por **Resend** a `goldrrremodeling2@gmail.com` (variables `RESEND_API_KEY`, `LEAD_TO_EMAIL` en `.env.example`). Si falta la key, fallback a `mailto:` y lo apuntas en TODO.
- Texto de consentimiento de contacto por teléfono/SMS (TCPA), como en aeva.
- Links de SMS con mensaje precargado por servicio ("Hi Gold R.R, I'd like a free estimate for a bathroom remodel…").
- Eventos de analítica: `click_call`, `click_text`, `click_email`, `form_submit`, `click_directions`, `click_review`.

---

## 7. Vídeos y animaciones generadas a partir de sus fotos y vídeos

Prioridad: **máxima calidad** visual, peso razonable. Usa `ffmpeg` (y `sharp`); Remotion es opcional (revisa su licencia según el tamaño de la empresa que lo use).

1. **Inventario** con `ffprobe`: resolución, fps, duración, orientación, audio. Descarta clips movidos o borrosos.
2. **Hero reel** (8–14 s, loop perfecto, sin audio): mejores tomas, cortes al ritmo, ligera gradación de color cálida y coherente con la paleta, estabilización si hace falta (`vidstabdetect/vidstabtransform`). Exporta:
   - Desktop 1920×1080 → H.264 (`-preset slow -crf 20`, `-movflags +faststart`, `yuv420p`) + WebM (VP9 o AV1).
   - Móvil 1080×1920 o 720p recortado vertical → versión ligera.
   - Poster AVIF/WebP del primer frame.
   - Objetivo: hero ≤ 4 MB desktop, ≤ 2 MB móvil.
3. **Vídeos a partir de fotos** (cuando falten clips): movimiento cinematográfico tipo Ken Burns / dolly con `zoompan` a alta resolución (escala la foto ×2–3 antes del zoompan para evitar temblor), transiciones `xfade`, y **barridos before→after** con máscara dorada. Si tienes acceso a un modelo image-to-video, úsalo; si no, no lo simules con trucos de baja calidad.
4. **Reels verticales** (9:16, 6–12 s) por servicio para el carrusel de la galería.
5. **Animación del logo** también exportada como vídeo (MP4 + WebM con alfa si es posible) para redes y para el cliente.
6. Todo lo generado va a `public/media/` y se registra en `media-manifest.json`. Los masters sin comprimir en `media-masters/` (fuera de `public/`, añadido a `.gitignore` si pesa mucho).

---

## 8. Accesibilidad y calidad
WCAG 2.1 AA: foco visible dorado, navegación por teclado (menú, acordeón, slider before/after, lightbox, carruseles), `aria-*` correctos, contraste verificado, vídeos sin audio o con controles, textos de botón descriptivos. Sin errores en consola. Sin warnings de hidratación.

---

## 9. Página de links (obligatoria, igual que en todas mis webs)

Réplica fiel de https://brightcoat-painting-links.vercel.app adaptada a Gold R.R Remodeling. Proyecto **separado** en `links/` (deployable como `goldrr-remodeling-links.vercel.app`):
- Fondo negro, tarjetas oscuras con borde sutil, botón principal en degradado dorado, iconos en círculo dorado, chevron a la derecha, entrada escalonada (stagger) y brillo dorado al hover. Fuente Montserrat.
- 3 imágenes hero (las mejores fotos), logo, H1 (p. ej. "Remodeling North Bay homes, done right"), subtítulo "Serving Vallejo & the North Bay · Free estimates · Se habla español".
- Botones (label + sublabel): **Call us** (707) 430-8295 · **Get a free estimate** (→ /contact de la web) · **Text us** (sms) · **Visit our website** · **Google reviews** ★★★★★ Read or leave a review (→ ficha de Google) · redes cuando existan · **Save our contact** (archivo `goldrr-remodeling.vcf` con nombre, teléfono, email, web, logo) · Privacy · Terms.
- Tags de servicios (Bathrooms · Kitchens · Tile · Flooring · Painting · Drywall · Carpentry).
- Meta/OG/Twitter completos, favicon del logo, footer "© {año} GOLD R R REMODELING".

---

## 10. Plan de trabajo (ejecútalo en este orden y marca cada fase al terminar)

1. **Referencias**: estudia las 5 webs de §2 y escribe `docs/reference-notes.md` (patrones que vas a reutilizar).
2. **Media**: inventario, clasificación, optimización → `media-manifest.json`.
3. **Marca**: logo SVG + variantes + favicons + paleta final → `docs/brand.md`.
4. **Scaffold**: Next.js + Tailwind + i18n + datos centralizados + layout + design tokens.
5. **Páginas y contenido** (EN primero, luego ES).
6. **Animaciones** (§5).
7. **Vídeos generados** (§7).
8. **SEO técnico** (§6.5) + formularios (§6.7).
9. **Página de links** (§9).
10. **QA**: `pnpm build` sin errores; Lighthouse móvil y desktop de Home, un servicio, una ciudad y contacto (guarda informes en `docs/lighthouse/`); capturas Playwright 390/768/1440 px de todas las páginas en `docs/screenshots/`; valida que cada JSON-LD es JSON válido con los tipos correctos; prueba con `prefers-reduced-motion`; revisa que el HTML sin JS contiene todo el contenido y los valores finales de los contadores.
11. **Entrega**: `README.md` (cómo correr, variables de entorno, cómo desplegar ambos proyectos en Vercel, cómo cambiar datos en `data/`) y `CONTENT-TODO.md` con todo lo que falta confirmar con el cliente.

---

## 11. Lista inicial para `CONTENT-TODO.md`
- Dominio definitivo y email profesional (¿mantener el Gmail?).
- Horario completo.
- Nombre completo del dueño (¿José…?) y foto del equipo.
- Confirmar licencia #1149164 (clasificación CSLB) y si tienen seguro/bond para poder decir "Licensed & Insured".
- Ciudades exactas del área de servicio.
- Redes sociales (Instagram, Facebook, TikTok, Yelp, Nextdoor) y URL de Pro Referral.
- Link directo para dejar reseña ("Ask for reviews" desde el panel de Google Business Profile).
- Texto literal de las reseñas en inglés.
- Rangos de tiempos/precios si quieren mostrarlos.
- Marcas de materiales que usan habitualmente.
- `RESEND_API_KEY` y ID de GA4.
