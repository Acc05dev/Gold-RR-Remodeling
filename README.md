# Gold R.R Remodeling — web + página de links

Web oficial de **GOLD R R REMODELING** (Vallejo, CA) y su página de links. Dos proyectos desplegables por separado en Vercel:

| Proyecto | Carpeta | Qué es |
|---|---|---|
| Web | raíz del repo | Next.js 16 (App Router, TypeScript), Tailwind v4, next-intl, GSAP + Lenis |
| Links | `links/` | HTML estático generado por `links/build.mjs`, sin dependencias |

Lo que falta por confirmar con el cliente está en [CONTENT-TODO.md](CONTENT-TODO.md). Las decisiones de marca, en [docs/brand.md](docs/brand.md).

## Arrancar en local

Requiere Node 20 o superior y pnpm (`npm i -g pnpm`, o usa `npx pnpm`).

```bash
pnpm install
cp .env.example .env.local   # opcional, ver "Variables de entorno"
pnpm dev                     # http://localhost:3000
```

Otros comandos:

| Comando | Qué hace |
|---|---|
| `pnpm build` / `pnpm start` | Build de producción y servidor |
| `pnpm lint` / `pnpm typecheck` | ESLint y TypeScript |
| `pnpm media` | Vuelve a procesar las fotos y vídeos de `Img/`. Necesita ffmpeg: `pnpm rebuild ffmpeg-static` o tenerlo en el PATH |
| `pnpm links:assets` / `pnpm links:build` | Regenera las imágenes y el HTML de la página de links |
| `pnpm brand` | Regenera el logo SVG, favicons y OG por defecto desde `Logo/` |
| `pnpm qa` | Auditoría SEO de todas las páginas (con `pnpm start -p 3105` en marcha) |
| `bash scripts/lighthouse.sh` | Informes Lighthouse en `docs/lighthouse/` |
| `pnpm screenshots` | Capturas 390 / 768 / 1440 en `docs/screenshots/` (antes: `npx playwright install chromium`) |

## Variables de entorno

Todas son opcionales para que la web funcione. Están documentadas en `.env.example`.

| Variable | Para qué |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Dominio público, sin barra final. Alimenta canonicals, sitemap, JSON-LD y OG. Por defecto `https://www.goldrrremodeling.com` (placeholder) |
| `RESEND_API_KEY` | Envío del formulario por Resend. **Sin ella, el formulario abre el correo del visitante** (`mailto:`) con la solicitud ya escrita |
| `LEAD_TO_EMAIL` | Destinatario de las solicitudes. Por defecto el Gmail del negocio |
| `LEAD_FROM_EMAIL` | Remitente. Tiene que ser de un dominio verificado en Resend |
| `NEXT_PUBLIC_GA_ID` | ID de GA4. Si está vacío no se carga Google Analytics |

Vercel Analytics ya está integrado y no necesita variables.

## Desplegar en Vercel

**Web.** Importa el repo, directorio raíz `/`, framework Next.js. No hace falta configurar nada más. Añade las variables de entorno y, cuando haya dominio, pon `NEXT_PUBLIC_SITE_URL`. El archivo `.vercelignore` deja fuera `Img/`, `Logo/`, `media-masters/` y `links/`.

**Links.** Crea un segundo proyecto en Vercel con el mismo repo y **Root Directory = `links`**. `links/vercel.json` ya define el build (`node build.mjs`) y la carpeta de salida (`public`). Nombre sugerido: `goldrr-remodeling-links`. Si cambia la URL de la web o la del propio proyecto de links, edita `links/site.config.json`.

## Dónde se cambia cada cosa

Todo el contenido que puede cambiar vive en `data/` y `messages/`. Ningún dato del negocio está escrito a mano dentro de un componente.

| Quiero cambiar… | Archivo |
|---|---|
| Teléfono, email, licencia, horario, link de Google, redes | `data/business.ts` |
| Textos de un servicio | `data/services/<slug>.ts` |
| Qué fotos usa cada servicio | `data/services.ts` (lista `photos`) |
| Ciudades del área de servicio | `data/areas.ts` y un archivo por ciudad en `data/areas/` |
| Reseñas de Google | `data/reviews.ts` |
| Preguntas frecuentes de la home | `data/faqs.ts` |
| Parejas antes/después y la secuencia de obra | `data/media.ts` |
| Textos de interfaz y de la home (EN / ES) | `messages/en.json`, `messages/es.json` |
| Privacidad y términos | `data/legal.ts` |
| Página de links | `links/site.config.json` |

**Horario.** Solo está confirmado que abren a las 8:00. Cuando se sepa el horario completo, rellena `business.hours.days` y aparecerá también en el JSON-LD.

**Redes sociales.** Añádelas a `business.social`; salen en el pie y en `sameAs`. En la página de links, en `social` dentro de `site.config.json`.

**Reseñas.** Mientras `text` sea `null`, la tarjeta dice de qué trata la reseña y enlaza a Google, sin comillas. Al pegar el texto literal en `text`, pasa a mostrarse como cita.

## Fotos y vídeos

Los originales del cliente están en `Img/` y no se tocan. El mapa entre originales y archivos de la web es `scripts/media-map.mjs`; `pnpm media` genera:

- `public/media/photos/*.jpg` con nombres SEO, orientación corregida, balance de blancos y contraste suaves, y escalado Lanczos 1.5×
- `public/media/video/*` con el reel del hero (bucle de 12 s) y cinco reels verticales, en MP4 y WebM, estabilizados y con pósters
- `media-manifest.json` con el inventario completo (original, categoría, dimensiones, pesos)
- `data/media.generated.ts`, que es lo que importa la web

**Vídeos del hero.** Los tres paneles se eligen en `HERO_PANELS`, en `scripts/media-map.mjs`. Un panel puede ser un vídeo generado (`{ flow: "<parte del nombre del archivo>" }`, buscado en `Img/VIdeoFlow/`) o uno de los reels reales (`{ reel: "<clave>" }`). El primero es el único que se carga en móvil. Tras cambiar un archivo: `node scripts/process-media.mjs --panels`. Cada vídeo generado se convierte en un bucle que abre y termina en el baño acabado, así el póster es el resultado final y no el "antes".

Los fotogramas de inicio y final para generar esos vídeos (foto real del antes y del después, en 9:16) se preparan con `node scripts/build-flow-frames.mjs` y quedan en `flow-frames/`.

Para añadir fotos nuevas: cópialas en una carpeta dentro de `Img/`, añade una línea por foto en `PHOTOS` de `scripts/media-map.mjs` (carpeta, posición, categoría, etapa, proyecto y texto alternativo en los dos idiomas) y ejecuta `pnpm media`.

**Límite real del material.** Las fotos son exportaciones de WhatsApp de 768×1024 y los vídeos, de 576×1024 en vertical. Por eso el diseño nunca muestra una foto a más de unos 600 px de ancho en escritorio, y el hero de escritorio llena la pantalla con **tres vídeos verticales en paralelo** en lugar de estirar uno solo (en móvil va uno, a pantalla completa). Dos de esos tres son transformaciones antes→después generadas con Google Flow a partir de fotos reales; ver [CONTENT-TODO.md](CONTENT-TODO.md).

## Estructura

```
app/[locale]/          páginas (EN en la raíz, ES bajo /es)
app/actions/           server action del formulario (Zod, honeypot, límite por IP, Resend)
app/og/                imagen Open Graph dinámica por página
components/            componentes; los de la home en components/home/
data/                  única fuente de datos del negocio
i18n/ + proxy.ts       enrutado de idiomas con next-intl
lib/gsap.ts            carga diferida de GSAP y hook useGsap
lib/seo.ts             metadata, canonicals, hreflang y JSON-LD
messages/              textos EN y ES
scripts/               media, marca, QA, Lighthouse, capturas
links/                 página de links (proyecto aparte)
```

## Animación

GSAP, ScrollTrigger y SplitText se cargan después de hidratar (`lib/gsap.ts`), nunca en el primer render. `components/Animate.tsx` aplica la coreografía por atributos (`data-split`, `data-wipe`, `data-stagger`, `data-scrub-words`, `data-count`, `data-draw`), así el HTML del servidor está completo y es legible sin JavaScript.

Se usa un hook propio `useGsap` en lugar de `useGSAP` de `@gsap/react`: hace lo mismo (contexto con ámbito y limpieza al desmontar) pero permite cargar GSAP de forma diferida. `@gsap/react` sigue instalado por si se prefiere en componentes nuevos.

Lo que se mueve con el scroll: el hero (los tres paneles de vídeo salen a distinta velocidad), el carril de servicios (se fija y las tarjetas pasan), "What goes in before the tile" (se fija y el scroll recorre las seis etapas), el texto que se va oscureciendo palabra a palabra, la línea del proceso que se dibuja, los contadores, la galería con columnas a distinta velocidad, la marquesina que acelera con el scroll y la barra dorada de progreso arriba.

### Modo sin animaciones (importante al revisar la web)

Si el sistema del visitante pide reducir el movimiento, la web entra en **modo calmado**: sin preloader, sin secciones fijadas, sin parallax ni scroll suave; el contenido aparece con un fundido. Siguen moviéndose solos el vídeo del hero (tiene botón de pausa) y la banda de servicios bajo el hero (más lenta, y no se detiene al pasar el ratón).

En Windows eso ocurre con *Configuración › Accesibilidad › Efectos visuales › Efectos de animación* **desactivado**. Con esa opción apagada **no verás las animaciones**, aunque estén ahí.

Para revisar sin tocar Windows, añade un parámetro a la URL (se recuerda en ese navegador):

| URL | Efecto |
|---|---|
| `/?motion=full` | Fuerza la versión completa |
| `/?motion=reduced` | Fuerza el modo calmado |
| `/?motion=auto` | Vuelve a seguir al sistema |

La decisión se toma antes del primer pintado, en el script `BOOT` de `app/[locale]/layout.tsx`, y se expone como `html[data-reduced]`.

## SEO

- Una sola constante de dominio: `SITE_URL` en `data/business.ts`
- Metadata por página con canonical absoluto, `hreflang` `en-US` / `es-US` / `x-default`, Open Graph y Twitter
- JSON-LD: `HomeAndConstructionBusiness` + `GeneralContractor` con `@id` en todas las páginas, `Service` en servicios, `BreadcrumbList` en interiores, `FAQPage` donde hay preguntas, `WebSite` en la home. No se emite `AggregateRating` de las reseñas propias
- `sitemap.xml` con alternates de idioma, `robots.txt`, `manifest.webmanifest`
- `node scripts/qa.mjs` comprueba todo esto en las 56 páginas leyendo el HTML del servidor; el último resultado está en `docs/qa-report.json`

## Resultados de QA

- `pnpm build`, ESLint y TypeScript sin errores
- Auditoría SEO: 56 de 56 páginas correctas
- Lighthouse en local, sin CDN: accesibilidad 100 y CLS 0 en las ocho mediciones; rendimiento 93 a 100 en escritorio y 98 a 99 en móvil para servicio y ciudad. **Home y contacto en móvil dan 71 y 75** en la medición estándar (87 y 94 con la limitación aplicada de verdad). Hay que volver a medir en Vercel. Detalle en [docs/lighthouse/README.md](docs/lighthouse/README.md)
- Capturas de 12 páginas a 390, 768 y 1440 px en `docs/screenshots/`, sin errores de consola
