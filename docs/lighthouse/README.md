# Lighthouse

> **Estas cifras son anteriores al cambio de hero.** Después de medir, la home pasó a un hero a pantalla completa con tres vídeos en escritorio y se añadieron secciones fijadas al scroll. La home no se ha vuelto a medir; las otras páginas no cambiaron. Repetir con `bash scripts/lighthouse.sh`.

Medido el 18 de noviembre de 2026 contra `next start` en local (sin CDN), con `bash scripts/lighthouse.sh`. Informes HTML y JSON en esta carpeta; resumen en `summary.json`.

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Ciudad, escritorio | 100 | 100 | 96 | 92 | 0.4 s | 0 | 0 ms |
| Ciudad, móvil | 99 | 100 | 96 | 92 | 1.7 s | 0 | 30 ms |
| Servicio, escritorio | 100 | 100 | 96 | 92 | 0.5 s | 0 | 0 ms |
| Servicio, móvil | 98 | 100 | 96 | 92 | 1.9 s | 0 | 20 ms |
| Contacto, escritorio | 100 | 100 | 96 | 92 | 0.4 s | 0 | 0 ms |
| Contacto, móvil | **75** | 100 | 96 | 92 | 7.6 s | 0 | 50 ms |
| Home, escritorio | 93 | 100 | 96 | 92 | 1.7 s | 0 | 0 ms |
| Home, móvil | **71** | 100 | 96 | 92 | 9.1 s | 0 | 50 ms |

## Lo que no llega al objetivo de 90

**Home y contacto en móvil dan 71 y 75 en la medición estándar.** El objetivo era 90 o más. Lo que se sabe:

- El LCP *observado* en esas dos páginas es de 0.5 s y 0.4 s. Los 9.1 s y 7.6 s son la *simulación* de red lenta de Lighthouse, no una medida.
- En las dos páginas el elemento LCP es una imagen (el póster del hero en la home, el fondo de la cabecera en contacto). En las páginas donde el LCP es texto, con el mismo JavaScript, la simulación da 1.7 a 1.9 s.
- Repitiendo la prueba con la limitación de red y CPU aplicada de verdad (`--throttling-method=devtools`, informes `*-applied-throttling`), salen **87 en la home (LCP 2.9 s) y 94 en contacto (LCP 2.4 s)**.
- En esta medición local Lighthouse contabilizó el HTML y el CSS sin comprimir (300 KB y 72 KB). El servidor sí los comprime: 54 KB y 16 KB con gzip.

No está comprobado cuánto dará en producción. **Hay que volver a medir sobre la URL de Vercel**, con CDN y Brotli, antes de dar el objetivo por cumplido o no. Si la home sigue por debajo de 90, lo primero que probaría es aligerar el documento (pesa 300 KB sin comprimir, la mitad es el payload de React con los marcadores borrosos de 58 imágenes).

## Lo que es de la medición en local

- **SEO 92:** falla solo "canonical no válido", porque el canonical apunta al dominio de producción y la prueba corre en `localhost`.
- **Buenas prácticas 96:** falla solo "errores en consola", por el script de Vercel Analytics (`/_vercel/insights/script.js`), que solo existe desplegado en Vercel.

## Core Web Vitals

CLS 0 en todas las páginas. TBT entre 0 y 50 ms en la medición estándar.
