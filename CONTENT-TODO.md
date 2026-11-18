# Pendiente de confirmar con el cliente

Todo lo que la web da por bueno sin tener confirmación, y lo que falta. Ordenado por lo que más bloquea la publicación.

## Antes de publicar

- [ ] **Dominio definitivo.** Ahora es el placeholder `https://www.goldrrremodeling.com`. Se cambia con la variable `NEXT_PUBLIC_SITE_URL` en Vercel y en `links/site.config.json`.
- [ ] **`RESEND_API_KEY` y dominio verificado en Resend.** Sin la clave, el formulario no envía nada por servidor: abre el correo del visitante con la solicitud escrita. Hay que definir también `LEAD_FROM_EMAIL` con un remitente del dominio verificado.
- [ ] **Texto literal de las reseñas de Google** (Eric Falk y Kevin Collins). No se pudo copiar desde la ficha. Hasta entonces las tarjetas describen el tema de la reseña y enlazan a Google, sin entrecomillar nada. Pegar el texto en `data/reviews.ts`.
- [ ] **Licencia #1149164 en cslb.ca.gov.** Comprobar que está activa, a nombre de quién y su clasificación. La web enlaza a la ficha de la CSLB desde el pie, la sección de datos y la página "About".
- [ ] **"El dueño trabaja en la obra él mismo."** Lo dicen varias páginas de servicio y "About" ("las personas que le dan el presupuesto son las mismas que hacen el trabajo"). Se dedujo de las reseñas, que nombran a José. Si no es así, hay que quitarlo de `data/services/*.ts` y de `aboutPage.story` en `messages/`.
- [ ] **Revisión legal de Privacidad y Términos** (`data/legal.ts`). Son una plantilla razonable con aviso CCPA y condiciones de SMS, no un texto revisado por un abogado. El texto de privacidad afirma que las fotos de clientes no se publican sin permiso: confirmar que es así.

## Datos del negocio

- [ ] **Horario completo.** Solo consta que abren a las 8:00. Rellenar `business.hours.days` en `data/business.ts`.
- [ ] **Nombre completo del dueño** (¿José…?) y si quiere aparecer con nombre y foto. La web no lo nombra en ningún sitio.
- [ ] **Seguro y bond.** La web no dice "insured" ni "bonded" en ninguna parte. Si los tienen, se puede añadir "Licensed & Insured".
- [ ] **Email profesional.** ¿Se mantiene el Gmail?
- [ ] **Link directo para dejar reseña** (panel de Google Business Profile, "Ask for reviews"). Ahora el botón lleva a la ficha. Va en `business.google.review`.
- [ ] **Redes sociales** (Instagram, Facebook, TikTok, Yelp, Nextdoor) y URL de Pro Referral de Home Depot. Ninguna encontrada.
- [ ] **Ciudades exactas del área de servicio.** Hay 11, sacadas de la ficha de Google. Se ajustan en `data/areas.ts`.
- [ ] **ID de GA4**, si quieren Google Analytics además de Vercel Analytics.

## Contenido redactado a partir de supuestos

Los textos de servicios y ciudades están escritos con conocimiento general del oficio y de la zona. No inventan reseñas, precios, plazos, garantías, seguros ni marcas, pero conviene que el cliente los lea.

- [ ] **Proceso de trabajo en las páginas de servicio.** Detalles como cubrir suelos, cortar azulejo fuera, retirar escombros, aclimatar la madera o pintar gabinetes son prácticas habituales, no confirmadas una a una.
- [ ] **Countertops.** El texto dice que los instalan y coordinan, que un taller corta las piezas de piedra, y menciona cuarzo, granito, laminado, butcher block y azulejo como materiales posibles.
- [ ] **Carpintería.** Los ejemplos (repisas, molduras de pared) y materiales (MDF, pino, álamo) son genéricos.
- [ ] **Pintura exterior.** Se mencionan superficies como siding y estuco.
- [ ] **Páginas de ciudad.** Nombres de urbanizaciones sin verificar: Vintage Ranch, La Vigne, Rancho Del Mar, Lawler Ranch, Peterson Ranch, North Village, Southtown. Las millas y los tiempos de trayecto son estimaciones. Algunas páginas avisan de pintura con plomo en casas anteriores a 1978 y de posibles revisiones municipales en distritos históricos: quitarlo si el cliente no quiere entrar en eso.
- [ ] **Tiempos y precios.** No se muestran. Si quieren dar rangos, se añaden en el campo `timeline` de cada servicio y en `data/faqs.ts`.
- [ ] **Marcas de materiales.** No se nombra ninguna en los textos. En algunas fotos de obra se leen marcas en los propios materiales.

## Fotos y vídeo

- [ ] **Dos de los tres vídeos del hero están generados con IA** (Google Flow), a partir de la foto real del antes y la del después de cada baño. El primer y el último fotograma son reales; la obra intermedia es inventada. No presentarlos como grabación de la obra. La galería y los reels siguen siendo solo material real.
- [ ] **El vídeo del baño de pasillo tiene un fallo visible:** durante unos tres segundos las losetas del piso aparecen como piezas de rompecabezas. Conviene regenerarlo en Flow. Añadir al prompt: "The floor tiles are plain rectangular porcelain tiles with straight edges, laid in a simple grid. No puzzle pieces, no interlocking shapes."
- [ ] **En el vídeo de la tina,** el azulejo nuevo sube por el muro mientras la tina vieja sigue en su sitio, y aparece un rollo rosa con letras sin sentido. Se nota menos, pero un cliente del oficio puede verlo.
- [ ] **Falta el tercer vídeo generado** (regadera azul). Los fotogramas están en `flow-frames/` (`3-blue-tile-shower_START` y `_END`). Mientras tanto ese panel usa el vídeo real de esa regadera.

- [ ] **Faltan fotos propias de cocinas, pintura, drywall, carpintería y countertops.** Cocina no tiene ninguna: su tarjeta muestra un dibujo del material y su página avisa de que las fotos están en camino. Los otros cuatro usan fotos reales de sus obras donde se ve ese trabajo (la recámara resanada y repintada, las habitaciones con zoclo y moldura nuevos, las cubiertas de los muebles de baño, la demolición), pero no son fotos hechas para ese servicio. Confirmar con el cliente que esos trabajos los hicieron ellos y pedir fotos específicas. Se cambian en `scripts/media-map.mjs` y `data/services.ts`.
- [ ] **Material en mejor calidad.** Todo lo recibido son exportaciones de WhatsApp (fotos de 768×1024, vídeos de 576×1024 en vertical). Con originales del móvil, y algún vídeo en horizontal, mejoraría mucho.
- [ ] **Foto del edificio de apartamentos** (`Img/Nueva carpeta (20)`). No se usa porque no se sabe qué trabajo se hizo ahí.
- [ ] **Personas que aparecen.** El trabajador que corta azulejo sale en la home, en "About" y en un reel. Confirmar quién es y que está de acuerdo. En algunas fotos de "antes" se ve reflejado en el espejo quien hace la foto.
- [ ] **Ubicación de los trabajos.** Los textos alternativos dicen "by Gold R.R Remodeling, Vallejo, CA" (la empresa es de Vallejo), no que la obra esté en Vallejo. Si se sabe la ciudad de cada proyecto, se puede indicar.

## Lo que no se hizo de lo pedido

- **Animación del logo exportada como vídeo.** No está hecha. Existe en la web (preloader), no como archivo MP4/WebM.
- **Vídeos generados a partir de fotos.** Hechos solo para el hero, con Google Flow (ver arriba). No hay Ken Burns ni barridos antes→después para la galería.
- **Selector de estancias (baño, cocina, suelos, pintura, drywall, carpintería).** Sustituido por "What goes in before the tile": la misma mecánica (contador 01/06, transición por máscara), pero recorriendo las seis etapas de un baño real, del que sí hay fotos de principio a fin. Con cuatro de las seis estancias sin fotos, el selector original habría quedado vacío.
- **Hero con un solo vídeo a pantalla completa.** En escritorio la pantalla se llena con tres vídeos verticales en paralelo, porque el material es vertical y de 576 px de ancho; estirar uno solo se vería borroso. En móvil sí es un único vídeo a pantalla completa.
- **Capturas de todas las páginas.** `docs/screenshots/` cubre las páginas representativas en 390, 768 y 1440 px, no las 56.
