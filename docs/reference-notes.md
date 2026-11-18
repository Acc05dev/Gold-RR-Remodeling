# Reference notes: five earlier agency sites

Studied 2026-11-18 for the Gold R.R Remodeling build. Research only, no site code.

**Method.** All five home pages were fetched as raw server HTML (HTTP 200 for all five), plus their linked CSS files and page-level JS chunks, plus inner pages for the two multi-page sites. Values below (hex, px, keyframes, class names) are copied from those files, not estimated. What I could not observe: the hydrated DOM after JavaScript runs, real rendering at different viewports, and anything behind interaction. Where a statement depends on that, it says so.

**Reuse rule.** Per-site sections name the source brands so the notes are traceable. The final section, "Patterns to reuse", is brand-free and contains no source marketing copy. Do not lift text from sections 1-5 into the new site.

Tailwind spacing conversions used below: 1 unit = 4px (`px-5` = 20px, `mt-8` = 32px, `h-11` = 44px, `h-32` = 128px).

---

## 1. vantrex-construction.vercel.app (black + gold contractor, single page)

**Stack.** Next.js App Router, webpack build, one hand-written CSS file (no Tailwind), one client component for the whole page. No animation library: IntersectionObserver plus CSS transitions.

**Tokens (`:root`).**

| Token | Value |
|---|---|
| `--bk` page background | `#000` |
| `--ink`, `--ink2` | `#0c0c0c`, `#161616` |
| `--pap` light section | `#f5f3ee` |
| `--g1` / `--g2` / `--g3` gold | `#ebcb6a` / `#c9a227` / `#9a7a1e` |
| `--gg` gold gradient | `linear-gradient(135deg, g1, g2 55%, g3)` |
| `--grey`, `--dk` | `#8e8c86`, `#55534e` |
| `--rl` light rule | `hsla(0,0%,100%,.1)` |
| `--rd` dark rule | `rgba(0,0,0,.1)` |

Container: `.wrap{width:min(1240px,100% - 48px)}`. Sections: `padding:120px 0` (80px under 960px). Headings: weight 800, uppercase, `line-height:1.05`, `letter-spacing:-.01em`; `h2{font-size:clamp(32px,4.2vw,54px)}`, with a `<span>` inside the h2 coloured gold. Eyebrow: 11px, weight 700, `letter-spacing:.32em`, gold, preceded by a 32x2px gold rule. Square corners everywhere (no border radius except circles).

**Primary button.** `padding:16px 28px`, 13px, weight 700, `letter-spacing:.08em`, uppercase, black text on the gold gradient, parallelogram via `clip-path:polygon(10px 0,100% 0,calc(100% - 10px) 100%,0 100%)`. Hover: `filter:brightness(1.08)` and `translateY(-2px)`. Outline variant: transparent with `box-shadow:inset 0 0 0 2px hsla(0,0%,100%,.7)`, hover turns ring and text gold.

**Structure top to bottom.**

1. Loader: fixed black overlay with the wordmark in gradient text, pulsing; removed after 900ms.
2. Scroll progress bar: fixed, 3px, gold gradient, width = scroll percent.
3. **Top bar** (`.top`, fixed, black, 12px, weight 600, `#bbb`, gold icons, `padding:9px 0`): left = pin icon + city/state; right = clock icon + hours, star icon + "free estimates" claim, mail icon + email as `mailto:`. Hidden under 960px. Slides away (`translateY(-100%)`) once scrolled past 60px.
4. **Nav** (`.nav`, fixed at `top:37px`, becomes `top:0` solid `rgba(0,0,0,.96)` after 60px): logo mark 46px + wordmark in gradient text + small spaced subline; five anchor links (12px, weight 700, `.1em`, underline grows from left on hover); **EN/ES toggle**; phone button; burger under 960px.
5. **Hero** (`min-height:100svh`): three stacked background images crossfading every 5500ms (`opacity` 1.6s) with a slow zoom (`kb` 16s to `scale(1.12)`); dark left-to-right gradient overlay; a gold diagonal wedge on the right (`clip-path:polygon(72% 0,100% 0,100% 100%,40% 100%)`, 38% wide, hidden on mobile). Grid `1.2fr .8fr`, gap 40px.
   - Left: small bordered tag above the H1 (diamond bullet + spaced caps), H1 `clamp(46px,6.8vw,104px)` weight 900 with one gold `<em>`, lead 17px, two CTAs (anchor to estimate form; phone).
   - Right: **quote card** (`.hcard`): `rgba(0,0,0,.72)`, `backdrop-filter:blur(10px)`, 1px white/15 border, **4px gold top border**, `padding:34px`, `width:min(100%,380px)`. Contents: h3, one-line response-time promise, name, phone, service `<select>` (10 options), full-width submit. Hidden under 960px.
   - Bottom of hero: **trust band** (`.band`), absolutely positioned, `rgba(0,0,0,.92)`, 3px gold top border, three columns each with a 44px white circle icon, a bold spaced-caps title and a one-line description. Stacks under 960px.
6. Brand strip: white band listing material brands as spaced caps text.
7. About: two-image collage (one corner clipped, one with a 10px paper-coloured frame, a gold badge with a big number, an offset gold outline frame), six-item two-column checklist with black circle + gold tick, signature row.
8. Services: 4-column grid of 8 cards, `aspect-ratio:3/4`, image + gradient, number top-left ("01"), h3, description revealed on hover (always visible when `hover:none`), gold arrow circle. All link to the estimate anchor.
9. **Before/after slider** (`.cmp`): two absolutely stacked images; the "after" image has `clip-path:inset(0 0 0 var(--x,50%))`; a 3px white line at `left:var(--x)` with a 56px gold circular knob. Logic: `onPointerDown` calls `setPointerCapture`, `onPointerMove` (ignored when no button is pressed) sets `--x` to the pointer percentage clamped to 4-96. CSS has `touch-action:none; user-select:none; cursor:ew-resize`. Labels bottom-left and bottom-right. Framed with a 1px gold border, 8px dark outline and a gold ring shadow. Beside it: a three-item numbered list describing the stages of that one project.
10. **"Inside the house" room selector**: a cutaway house illustration (`casa.png`) with an SVG overlay (`viewBox="0 0 100 75"`, `preserveAspectRatio="none"`). Six polygons, one per room, hard-coded as point strings. A full-size dim rect uses an SVG mask that cuts out the active polygon, so the selected room stays bright and the rest darkens (`fill:rgba(0,0,0,.42)`). Active polygon gets a gold stroke. Selection changes on `pointerdown`, and on `mouseenter` only when `(hover:hover)` matches. A tag bottom-left names the active room. Right panel (`.hsp`, black, 5px gold top border): "02 / 06" counter, h3, paragraph, three bullet items (gold diamonds), CTA to the estimate form, and a row of six pill buttons that select the same rooms (horizontal scroll on mobile).
11. **Counters** (`.strip`): gold gradient band with slanted top and bottom edges, four columns, number `clamp(44px,5.4vw,74px)` weight 900, label 12px caps. Each counter is a component that starts at state 0 and animates over 1600ms with cubic ease-out once 50% visible.
12. **4-step process** (`.steps`): four columns joined by a dashed gold line (`repeating-linear-gradient`), each with a 72px black circle, gold number, 4px paper border and a 2px gold ring; h4 + paragraph. 2 columns under 960px, 1 under 400px.
13. "Why us": four glass cards over a faint background photo, large ghost number, gold circle icon, bottom line that grows on hover.
14. Service area chips (16 cities, plain spans, not links) beside an FAQ built from native `<details>`/`<summary>` with a + / - circle.
15. CTA band with a skewed gold block behind a large phone number.
16. Estimate section: contact rows, an hours table, and the full form (name, phone, email, property type, service, details).
17. Footer: four columns; legal links to `/privacy` and `/terms`.
18. Floating WhatsApp button, back-to-top button.
19. **Mobile fixed bottom bar** (`.bar`, shown under 960px): `grid-template-columns:1fr 1fr 1.3fr`, black, 1px top rule; links are `padding:16px 8px`, 12px, weight 800, `.1em`, uppercase. Order: Call (`tel:`), Text (`sms:`), Estimate (anchor, gold gradient background, black text). Footer gets `padding-bottom:130px` and the WhatsApp button moves up to clear it.

**EN/ES toggle.** Two buttons in a 1px bordered box, 11px weight 800; active is solid gold with black text. All copy lives in one object keyed by `en` / `es`; a `useState("en")` picks the dictionary. Choice is written to `localStorage` under one key.

**Reveal animation.** `.rv{opacity:0;transform:translateY(28px);transition:opacity .8s cubic-bezier(.2,.7,.2,1),transform .8s ...}`, `.rv.in` resets; stagger classes `.d1`-`.d4` add .1s-.4s delay; IntersectionObserver threshold .12. Has a `prefers-reduced-motion` block that removes all transitions and shows `.rv` content.

**Forms.** Neither form posts anywhere. On submit they build a text message and navigate to an `sms:` link with a `body=` parameter (`&body=` on Apple devices, `?body=` elsewhere). On desktop this does nothing useful.

**JSON-LD.** One block, `HomeAndConstructionBusiness`, with name, telephone, email, a `PostalAddress` holding only locality and region, `areaServed` as a string, `priceRange`, and `makesOffer` as a plain string array. No `@id`, no `url`, no `image`, no opening hours.

**Head.** Title + description, OG title/description/image/type, Twitter large card. No canonical. No robots meta.

**Problems seen here (do not repeat).**

- Counters render as `0+`, `0+`, `0%`, `0.0` in the server HTML. Confirmed.
- Hours disagree: top bar says Mon-Sat 7am-6pm; the hours table says Mon-Fri 7-6, Saturday 8-4, Sunday closed. Confirmed.
- The Google Fonts link in the head loads Fraunces and Manrope, but the stylesheet asks for Montserrat and Kaushan Script. Neither requested family is loaded by anything in the HTML or CSS I fetched, so text falls back to system fonts.
- Language is client state only: `<html lang>` stays `en`, the Spanish copy is not in the server HTML, there is no `hreflang`, and the page chunk writes the language to `localStorage` but contains no read of it.
- `og:image` points to a different domain than the one serving the page; no canonical.
- Footer service and company links are `href="#"`. Service area chips are not links.
- Decorative and content images alike have `alt=""`, including service cards.
- Ten images are preloaded in the head, including below-the-fold ones.

---

## 2. aeva-detailing.vercel.app (video hero, scroll-driven)

**Stack.** Next.js App Router (Turbopack), Tailwind v4, GSAP + ScrollTrigger (with the React `useGSAP` hook), Lenis, Leaflet for the area map, Formspree for the form. Font: Montserrat 300-800 through a Google Fonts `<link>`.

**Tokens.** `--color-ink-navy:#0a1733`, `--color-soft:#0e1e45`, `--color-cream:#f4efe6`, `--color-gold:#c9a35c`, `--color-ink:#f2f2f2`, `--color-mute:#9a9aa0`, `--color-line:#2a2a2d`. `theme-color` meta `#0A1733`. `.wrap{max-width:1280px}` with 20px side padding (40px from the `md` breakpoint). `h1,h2,h3`: weight 800, uppercase, `line-height:.9`, `letter-spacing:-.02em`. Eyebrow: 13px, `.25em`, gold. Buttons are 48px tall pills, 14px, weight 500, 28px side padding. Cards use 24px radius (`rounded-3xl`).

**Lenis.** `new Lenis({lerp:.14, anchors:{offset:-80}})`, skipped entirely when `(pointer: coarse)` matches. Driven from the GSAP ticker (`lenis.on("scroll", ScrollTrigger.update)`, `gsap.ticker.add(t => lenis.raf(t*1000))`, `lagSmoothing(0)`).

**Structure.**

1. Loader: full-screen navy with the logo fading in (blur 6px and scale .92 to clear, .8s).
2. Header (fixed, transparent, 80px / 96px tall): social icons left, logo absolutely centred, "Menu" label + two-line icon right.
3. **Fullscreen menu**: fixed overlay revealed by animating `clip-path` from `inset(0 0 100% 0)` to full, `.7s cubic-bezier(.77,0,.18,1)`. A muted looping video sits behind at 25% opacity. Left: nine links as very large uppercase text (`8.2vw` on phones, up to 60px), each a row with a bottom rule and an arrow, fading up with staggered delays. Right column (288px): small label, phone number, hours, Call / Get a quote buttons, six social circles, privacy and terms.
4. **Video hero** (`h-[100svh]`): `<video autoplay muted loop playsinline preload="auto" poster>` with two `<source>` elements, the first gated by `media="(max-width: 767px)"` for a lighter mobile file. On desktop only the section is pinned for `+=240%` with `scrub:1`: the H1 fades up and out, then a second headline animates in word by word. H1 is `10.5vw` on phones and `4.6vw` on desktop, split into one inline-block span per word. Sub-line sits at the bottom. A 1px white progress line at the bottom of the viewport scales with page scroll.
5. Intro block: an image "window" that opens via `clip-path:inset(30% 32% 30% 32%)` to `inset(0)` while the image scales 1.35 to 1 (scrubbed). Over it runs the **marquee**: a flex track with the item list duplicated once, `animation:35s linear infinite` translating to `-50%`, edges faded with a `mask-image` linear gradient (transparent, black 12%, black 88%, transparent).
6. **Stepped process**: three consecutive `position:sticky; top:0; height:100svh` panels, so each slides over the previous one. Each panel: blurred, desaturated copy of the step image as background; a square image window; "01 / 03" counter; huge h3; one paragraph; a bordered CTA.
7. Statement paragraph with per-word spans (scroll-lit), then a bento **services grid** (`md:grid-cols-3`, `auto-rows:300px`, first card spans 2x2, last spans 3), each card a link to its own service page.
8. Split section with a 9:16 looping video.
9. Package comparison: three cards with a definition list, a "most chosen" label on the middle one, a request button that prefills the form message, and a "Text us" link using `sms:` with a prefilled body.
10. **Video reels carousel**: six 9:16 `<video muted loop playsinline preload="metadata">`. On desktop a horizontal `overflow-x:auto` scroll-snap row (300px wide items, hidden scrollbar, drag cursor) with prev/next buttons calling `scrollBy({left:±360, behavior:"smooth"})`. On mobile a 2-column grid. An IntersectionObserver (threshold .4) plays each video when visible and pauses it otherwise.
11. Two opposing auto-scrolling photo rows.
12. Reviews: star row + h2, with two buttons side by side ("read on Google" solid, "leave a review" outline); cards in a 2-3 column masonry on desktop, a snap carousel at 85% width on mobile. Each card: stars, Google mark, quote, initial avatar, name, source.
13. Areas: two-column list of city links (each to `/areas/[slug]`) beside a sticky Leaflet map.
14. **FAQ accordion**: button rows; the answer wrapper animates `grid-template-rows` from `0fr` to `1fr` over 300ms with the inner paragraph `overflow:hidden`; the + rotates.
15. Contact: phone, email, hours, Text / Call buttons, and the form.
16. Footer, plus a mobile-only fixed bottom bar with two equal buttons (Call, Get a quote).

**Form and SMS consent (what is actually there).** Fields: full name (required), phone (required), email, vehicle, service select (required), message. Submits with `fetch` to Formspree as `FormData`, then swaps to a thank-you block. Under the submit button, at 12px in the muted colour, one sentence:

> By sending this form you agree to be contacted by phone or text about your request.

Structure of that sentence: **[trigger: sending the form] + [agreement verb] + [channels: phone or text] + [scope: about your request]**. There is no checkbox.

The privacy page carries the longer block under a "Text messaging" heading:

> By texting us or submitting your number, you agree to receive conversational messages about your quote or appointment. Message and data rates may apply. Reply STOP at any time to opt out.

Structure: **[trigger: texting or submitting a number] + [agreement to receive] + [message type: conversational] + [scope: quote or appointment] + [rates disclosure] + [STOP opt-out]**.

What the pair does not include: the business name inside the consent sentence, message frequency, a HELP keyword, a statement that consent is not a condition of purchase, a link to the privacy policy and terms next to the form, and an unticked checkbox. See "Patterns to reuse" for a fuller template.

**SEO.** Every page has its own title, description and canonical. JSON-LD on every page: one business node (`AutoWash`) with `@id` ending `/#business`, url, image, logo, telephone, email, priceRange, `PostalAddress` (locality, region, country), `areaServed` as 15 `City` objects, `openingHoursSpecification`, `sameAs`, and `hasOfferCatalog`. Inner pages add `BreadcrumbList`; service, area and FAQ pages add `FAQPage`. `sitemap.xml` and `robots.txt` exist.

**Known mistakes, checked.**

- Two h1 on one page: **not visible in what I fetched.** Home and ten inner pages each have exactly one `<h1>` in the server HTML (the production domain's home page too). The hero does stack two headlines in the same spot, the first an h1 and the second an h2, which is the likely site of the earlier bug. I did not run the page in a browser, so a second h1 injected after hydration would not show up in this check.
- Canonical on a different domain: **confirmed, in this form.** Canonical, `og:url`, sitemap entries and JSON-LD all use the bare domain, while the bare domain answers with a 308 redirect to the `www.` host. So every canonical points at a URL that redirects. On the vercel.app deployment the canonical also names a different host from the one the relative internal links resolve to.
- Also seen: `/privacy` and `/terms` both declare the home page as canonical; their titles repeat the brand twice; the contact line at the bottom of both legal pages has an empty address slot ("Brand, . email").

---

## 3. www.vista-painting.com (multi-page SEO architecture)

**Stack.** Next.js App Router (Turbopack), hand-written CSS, GSAP + ScrollTrigger, Lenis, Leaflet, Formspree. Fonts: Archivo 600/800 (headings) and Manrope 400/500/700 (body) via one Google Fonts `<link>`.

**Tokens.** `--navy:#0e1f3d`, `--ink:#0b0b0c`, `--beige:#ede4d3`, `--sand:#f7f2e8`, `--red:#c8202f`, `--line:#0e1f3d24`. `.wrap{width:min(1200px,100% - 2.5rem)}`. `section{padding:clamp(4rem,9vw,7.5rem) 0}`. `h1{font-size:clamp(2rem,7vw,5rem)}`, `h2{font-size:clamp(1.8rem,4.2vw,3rem);max-width:20ch}`, both weight 800, `line-height:1.06`, `letter-spacing:-.02em`. Radius 4-8px. Sticky white header 76px tall.

**Routes.** `/`, `/services` (one page, six sections with ids used as `#anchors`), `/areas`, `/areas/[city]` (19 cities), `/about`, `/contact`, `/privacy`, `/terms`. Sitemap lists all of them; city pages get priority 0.8, same as `/services`. `robots.txt` allows all and names the sitemap. No per-service pages.

**Head, per page.** Unique `<title>` in the pattern `Page topic | Qualifier | Brand`, unique description, `robots: index, follow`, self-referencing canonical on the `www` host, `og:url` equal to the canonical, `og:site_name`, `og:locale`, `og:image` 1200x600 with type, width, height and alt, Twitter large card. Internal links are all relative and the site is served on the same host as the canonical, so nothing conflicts.

**JSON-LD.** On every page, one business node: `@type: HousePainter`, `@id: https://{host}/#business`, name, url, telephone, email, `sameAs`, image, logo, description, `openingHours: "Mo-Sa 07:00-18:00"`, `areaServed` as 19 `City` objects named "City, ST", and `hasOfferCatalog` with six `Offer > Service` entries (name + description). City pages add a second block, `BreadcrumbList` (Home > Service Areas > City, ST), with absolute URLs.

**Heading hierarchy.**

- Home: one h1, then eight h2 (one per section), h3 under process steps and "why" items.
- `/services`: h1, then one h2 per service, then the process h2 with h3 steps.
- `/areas`: h1, h2 for the selector, then one h2 per region each over a list of city links.
- City page: see below.
- Footer column titles are h4 on every page.

**City page template** (`/areas/[city]`), in order:

1. Dark page header: region name as the small tag, **h1 "{Trade plural} in {City}, {ST}."**, one-sentence lead naming the city.
2. Split section: tag "{Trade} contractor in {City}", h2 with the city, two paragraphs, text link to `/contact` whose label includes the city; tall image whose alt text names the city.
3. Services in the city: h2 "What we {verb} in {City}", then a 3-column grid of six link cards, each with **h3 "{Service} in {City}"** and the service's one-line description, linking to `/services#{id}`.
4. The shared four-step process block.
5. "Nearby cities": six pill links to sibling city pages in the same region plus a link back to `/areas`.
6. The shared FAQ (`<details>`), same six questions as the home page.
7. The shared CTA band.

The title pattern is "{Trade plural} in {City}, {ST} | {Service summary} | Brand", and the description names the city and the region.

**Areas index.** Region tabs + city pill buttons + a Leaflet map (`role="img"` with an aria-label; tiles filtered to near-greyscale). Under it, three plain lists of crawlable `<a>` links, one per region, with anchor text "{Trade plural} in {City}, {ST}".

**Review CTA.** In the social section, under four brand-coloured social tiles, a full-width navy card (`.rev`): Google mark, a bold question line, a small instruction line, and a white pill reading "Write a review". It links to the Google Business review short link (`g.page/r/.../review`) with `target="_blank" rel="noopener noreferrer"`. Hover lifts it 4px with a shadow. The same link appears as plain text in the footer's "Follow us" column.

**Contact form.** Labels above fields, 2-column grid, sand background with a 6px navy top border. Fields: name, phone, email (all required, with `autocomplete`), city select (the 19 cities + Other), service select, details textarea. Fine print under the button says the visitor agrees to be contacted about the request and links to the privacy policy. No mention of text messages.

**Animation hooks.** `data-reveal` (optional numeric delay as the value), `data-wipe` on image wrappers, `data-draw` on rules that scale in from the left. Page headers use a beige "curtain" that scales away and h1 lines wrapped as `.line > span` for a masked rise. Home hero cycles four short videos.

**Problems seen here (do not repeat).**

- City pages are the same text with the city name substituted. Only the name, region tag and nearby-city list change. That is thin, near-duplicate content.
- The business JSON-LD `image` is a relative path; there is no `PostalAddress`.
- City pages show an FAQ but emit no `FAQPage` JSON-LD.
- `/privacy` and `/terms` jump from h1 to h3, and reuse the home page's meta description.
- The home page's area selector is made of buttons, so only one city page is linked from the home page's HTML at a time. The rest are reachable only through `/areas` and the sitemap.

---

## 4. colombia-parce.vercel.app (filters + configurator)

**Stack.** Next.js App Router (Turbopack), hand-written CSS, GSAP + ScrollTrigger, Lenis, a `<canvas>` scroll sequence in the hero. Fonts: Archivo variable (width 62-125, weight 400-900), DM Mono 500, Shrikhand.

**Tokens.** `--black:#0b0b0b`, `--cream:#f5f1e8`, `--gold:#dcb862`, `--blue:#2f5bb7`, `--red:#d63b3b`. Section theme classes (`.dark`, `.light`, `.gold`, `.blue`) each redefine a small set of local variables: `--muted`, `--line`, `--btn-bg`, `--btn-fg`, `--hl`. Components read only those, so one button or label style works on any background. `.wrap{max-width:1200px;padding:0 24px}`, `section{padding:110px 0}`. Buttons: 52px tall, 2px border, 10px radius, 14px weight 800 uppercase.

**Category filters.** `<div class="tabs" role="tablist">` with `<button role="tab" aria-selected>` items. Row is `display:flex; gap:30px; overflow-x:auto; scrollbar-width:none` with a 1px bottom rule. Tab: 14px, weight 800, uppercase, `.06em`, muted colour, `border-bottom:3px solid transparent; margin-bottom:-1px; padding-bottom:14px`. Active: full-strength text and a coloured bottom border. First tab is "All". Filtering is a plain array filter in state; no animation library involved.

**Filtered list.** Rows, not cards: `grid-template-columns:76px minmax(0,1fr) auto; gap:24px; padding:24px 0; border-bottom:1px solid`. Thumbnail, then name + dotted leader + small category label on one line with the description under it, then an outlined action pill on the right. Hover: row `padding-left:14px`, thumbnail scales 1.4 and tilts -8deg, pill inverts. Items that can be customised link to the configurator anchor and preselect that base on click; the others go to ordering.

**Step configurator.** Two columns, `grid-template-columns:1.15fr .85fr; gap:56px`.

- Left, three `.step` blocks, each headed by a small mono caps h3 numbered "1.", "2.", "3.":
  1. Base: four image buttons in a `repeat(4,1fr)` grid, single choice. Square image, 8px radius, `outline:3px solid transparent; outline-offset:3px`; the selected one gets a solid outline. Each has `aria-pressed`.
  2. Main options: multi-select rows in two columns. Each is a `<button aria-pressed>` with a 22px square box (2px border, 4px radius) that fills and shows a tick drawn with two borders rotated -45deg; rows are separated by a 1.5px bottom rule, 17px weight 700.
  3. Extras: same control, but the option list depends on the chosen base.
- Right, the **live summary** (`<aside class="ticket">`): `position:sticky; top:104px` (static on mobile), cream card, 12px radius, `box-shadow:0 0 0 3px` as the frame. Contents: image of the selected base (16:10), small label, h4 with the base name, a `<ul>` in the mono font listing each choice as "+ item" with dashed separators (or a single "nothing added yet" line), a full-width action button, and one line of fine print saying final options and price are confirmed at the next step.

All state is three `useState` values (base, array of mains, array of extras). The summary is derived, not stored.

**Bottom action bar** (`.mbar`, shown at `max-width:860px`): fixed to the bottom, `padding:10px 12px calc(10px + env(safe-area-inset-bottom,0px))`, black, 1px top rule, `display:flex; gap:8px`. Three links, each 48px tall, 2px cream border, 10px radius, 13px weight 800 uppercase. Order: Call, Directions, Order; the last is solid gold with `flex:1.4`. It slides out (`translateY(110%)`, .35s) while the hero scroll sequence is on screen, by toggling a class on `<body>`.

**Other.** EN/ES toggle of the same two-button shape as site 1. Focus style is set globally: `:focus-visible{outline:3px solid var(--gold);outline-offset:3px}`.

**Problems seen here.** No canonical, no Open Graph tags, no JSON-LD. Primary action links are `href="#"`.

---

## 5. brightcoat-painting-links.vercel.app (link-in-bio) - the one to replicate

**Stack.** Next.js App Router (Turbopack), Tailwind v4, one client component. No animation library; everything is CSS keyframes plus two small effects in React state. Font: Montserrat 400/500/600/700/800/900 from a Google Fonts `<link>` with `display=swap` and both preconnects.

### 5.1 Tokens

| Token | Value | Used for |
|---|---|---|
| `--color-ink` | `#0c0c0d` | page and column background |
| `--color-ink-2` | `#161618` | secondary button background |
| `--color-paper` | `#f3eee4` | body text |
| `--color-gold` | `#d6a63a` | borders (tags, hover) |
| `.text-gold` override | `#e0b24a` | gold text and the primary button's icon. An unlayered rule overrides the utility, so gold text is this lighter value while gold borders use `#d6a63a`. |
| `--font-display` | `"Montserrat", sans-serif` | everything |
| `--radius-xl` | `.75rem` (12px) | buttons |
| `--container-md` | `28rem` (448px) | column width |

`body{background:#0c0c0d; color:#f3eee4; font-family:Montserrat; -webkit-font-smoothing:antialiased}`.

Custom classes:

```css
.gold{color:#111;background-image:linear-gradient(#f6dc8a 0%,#e2b64c 38%,#c9952c 70%,#a8781c 100%)}   /* vertical, top to bottom */
.gold-text{color:transparent;background:linear-gradient(#f6dc8a,#c9952c);-webkit-background-clip:text;background-clip:text}
.rise{opacity:0;animation:.7s cubic-bezier(.2,.8,.2,1) forwards rise}
@keyframes rise{0%{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
.kb{animation:7s ease-out forwards kb}
@keyframes kb{0%{transform:scale(1.12)}to{transform:scale(1)}}
.flipin{animation:1.1s cubic-bezier(.2,.8,.2,1) both flipin}
@keyframes flipin{0%{opacity:0;transform:perspective(800px) rotateX(-75deg) translateY(30px)}to{opacity:1;transform:none}}
.logo-wrap{transform-style:preserve-3d;position:relative}
.logo-shine{pointer-events:none;position:absolute;inset:0;
  background:linear-gradient(105deg,transparent 40%,#ffffffd9 50%,transparent 60%) 0 0/260% 100%;
  animation:3.6s ease-in-out 1.4s infinite shine;
  -webkit-mask:url(/logo.png) 50%/contain no-repeat;mask:url(/logo.png) 50%/contain no-repeat}
@keyframes shine{0%{background-position:150% 0}55%,to{background-position:-60% 0}}
.sheen:after{content:"";pointer-events:none;position:absolute;inset:0;transform:translate(-120%);
  background:linear-gradient(105deg,transparent 35%,#ffffff8c 50%,transparent 65%);
  animation:3.6s ease-in-out 2.2s infinite sheen}
@keyframes sheen{55%,to{transform:translate(120%)}}
```

### 5.2 Structure, top to bottom

**Column.** `<main>`: `margin-inline:auto; min-height:100svh; max-width:448px; overflow:hidden; background:#0c0c0d; padding-bottom:40px`. On desktop it is a single centred 448px column on the same ink background.

**A. Hero image block.** `position:relative; height:34svh; min-height:240px; overflow:hidden`. Full width of the column, no border radius on the images.

- The three images are **not a collage**. They are stacked on top of each other in the same box and **crossfade as a slideshow**: each is `position:absolute; inset:0; width:100%; height:100%; object-fit:cover; transition:opacity 1500ms`; the active one has `opacity:1`, the other two `opacity:0`. A `setInterval` advances the index every **4500ms**.
- The active image also carries `.kb` (7s zoom from 1.12 to 1), so each slide slowly settles as it appears.
- The three images sit in an inner wrapper with `inset:-24px` (so it overhangs by 24px on every side) and `transition:transform 500ms ease-out`. Its transform is `translate(-18*x px, -18*y px)` where x and y range -0.5 to 0.5 from `mousemove` (pointer position over the window) or `deviceorientation` (`gamma/30` and `(beta-45)/30`, clamped to ±1, halved). Net movement is up to 9px each way: a light parallax.
- Overlay 1: `position:absolute; inset:0; background:linear-gradient(to bottom, rgba(12,12,13,.3), transparent, rgba(12,12,13,.7))`.
- Overlay 2, the **curved bottom edge**: `position:absolute; left:0; right:0; bottom:-1px; height:48px; background:#0c0c0d; border-radius:50% 50% 0 0 / 100% 100% 0 0`. This is the only rounded shape in the hero; it makes the photo end in a dome-shaped ink cap.
- Markup: plain `<img>` with `alt=""`, no `srcset`, no lazy loading.
- Source files: two at 2600x1950 (4:3) and one at 2600x1463 (16:9), JPEG.

**B. Identity block.** `position:relative; margin-top:-80px; display:flex; flex-direction:column; align-items:center; padding-inline:20px; text-align:center`. It overlaps the hero by 80px, so the logo sits across the curved edge.

- Glow behind the logo: `position:absolute; left:50%; top:16px; width:288px; height:160px; translate:-50%; border-radius:9999px; background:rgba(12,12,13,.85); filter:blur(40px); pointer-events:none`.
- **Logo**: centred `<img>` at `height:128px; width:auto` with `filter:drop-shadow(0 8px 30px rgba(0,0,0,.6))`. Source PNG is 1561x1008, so it renders about 198px wide. Wrapped in `.flipin` (entrance) and `.logo-wrap` with `transition:transform 300ms ease-out` and an inline transform `perspective(700px) rotateY(14*x deg) rotateX(-14*y deg)` (tilts up to ±7deg with the same pointer / device-tilt values). A `.logo-shine` span on top sweeps a highlight masked to the logo's own shape.
- **H1**: `margin-top:16px; font-size:1.35rem (21.6px); font-weight:900; text-transform:uppercase; line-height:1.25; letter-spacing:-.025em`. One line of positioning copy with a single keyword wrapped in `.gold-text`. `.rise` with `animation-delay:.1s`.
- **Subtitle** `<p>`: `margin-top:8px; font-size:14px; line-height:20px; color:rgba(243,238,228,.7)`. Two facts separated by a middle dot (service area, then availability). `.rise`, delay `.18s`.

**C. Buttons.** `<nav>`: `margin-top:32px; padding-inline:20px`, children separated by 12px. Seven `<a>` elements, all sharing:

`display:flex; align-items:center; gap:16px; border-radius:12px; padding:16px; transition: all .15s cubic-bezier(.4,0,.2,1)`; `:active{scale:.98}`; `.rise` with `animation-delay: .25s + .07s * index` (so .25, .32, .39, .46, .53, .60, .67).

Inside each, left to right:

1. Icon chip: `44x44px; border-radius:50%; display:grid; place-items:center; flex-shrink:0`.
2. Text block, `flex:1; text-align:left`: label `font-size:.95rem (15.2px); font-weight:800; text-transform:uppercase; letter-spacing:-.025em`; sublabel `font-size:12px; line-height:16px`.
3. Chevron: 18x18 SVG, path `M9 6l6 6-6 6`, `stroke-width:2.5`, `opacity:.6`, moves `translateX(4px)` when the button is hovered.

Icons are all inline 20x20 SVGs on a 24 viewBox: `fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round`. Simple line glyphs, one per button.

Two visual variants:

- **Primary (first button only)**: class `.gold` (the four-stop vertical gradient, text `#111`), `position:relative; overflow:hidden`, `box-shadow:0 10px 30px rgba(214,166,58,.25)`, plus `.sheen` (the diagonal highlight sweeping across every 3.6s after a 2.2s delay). Its icon chip is inverted: `background:#0c0c0d` with the icon in gold `#e0b24a`. Its sublabel is `rgba(12,12,13,.75)`.
- **Secondary (the other six)**: `background:#161618; border:1px solid rgba(255,255,255,.1)`; on hover (inside `@media (hover:hover)`) the border becomes `rgba(214,166,58,.6)`. Icon chip uses the `.gold` gradient with a `#111` icon. Sublabel is `rgba(243,238,228,.6)`.

Order, label, sublabel pattern, icon, target:

| # | Label | Sublabel pattern | Icon | Target |
|---|---|---|---|---|
| 1 (primary) | Call us | formatted phone number | phone handset | `tel:+1...` |
| 2 | Get a free quote | short prompt to send project details | document with lines | main site `/contact` |
| 3 | Text us | short reason texting is fastest | speech bubble | `sms:+1...` |
| 4 | Visit our website | bare domain | globe | main site home |
| 5 | Google reviews | five star characters + "read or leave a review" | star outline | Google Maps short link, new tab, `rel="noreferrer"` |
| 6 | Instagram | @handle | rounded square + circle + dot | profile URL, new tab, `rel="noreferrer"` |
| 7 | Save our contact | "Add {short brand} to your phone" | person + plus | `/{brand}.vcf` with a `download` attribute |

The vCard is version 3.0 with `N`, `FN`, `ORG`, `TEL;TYPE=WORK,VOICE`, `EMAIL;TYPE=WORK`, `URL`, `ADR;TYPE=WORK` (city, state, country only) and a one-line `NOTE`; served as `text/x-vcard`.

**D. Service tags.** `margin-top:32px; display:flex; flex-wrap:wrap; justify-content:center; gap:8px; padding-inline:20px`; `.rise` delay `.8s`. Five `<span>` pills, not links: `border-radius:9999px; border:1px solid rgba(214,166,58,.3); padding:6px 12px; font-size:.7rem (11.2px); font-weight:700; text-transform:uppercase; color:#e0b24a`. Each is a one- or two-word service name.

**E. Footer.** `margin-top:32px; text-align:center; font-size:.7rem; color:rgba(243,238,228,.4)`; `.rise` delay `.9s`. Line 1: copyright symbol, year, legal entity name. Line 2 (`margin-top:8px; display:flex; justify-content:center; gap:16px`): two underlined links (`text-underline-offset:2px`, gold on hover) to `/privacy` and `/terms`.

### 5.3 Legal sub-pages

`/privacy` and `/terms` exist on the same deployment. Layout: `<section>` with `padding-top:64px; padding-bottom:96px` (128px from 1024px up), inner `max-width:768px; padding-inline:20px`. A gold uppercase "back" link with a left arrow, an h1 (`font-size:clamp(2rem,4vw,3.2rem)`, weight 900, uppercase, `line-height:1`, `letter-spacing:-.02em`, white), a "last updated" line at 14px in paper/60, then blocks spaced 32px apart, each an h2 (18px, weight 800, uppercase, gold) over a paragraph (`line-height:1.625`, paper/80). The privacy page has a "Text messages" block: replies may come by phone or text, rates may apply, reply STOP to opt out.

### 5.4 Head

- `<html lang="en">`, `charset`, `viewport: width=device-width, initial-scale=1`.
- `<title>`: "{Brand} | Links".
- `description`: one sentence listing the actions on the page, then brand and city/state.
- `og:title` (brand), `og:description` (one positioning line), `og:image` (absolute URL of the first hero photo).
- `twitter:card = summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image` (same values).
- `icon` 512x512 PNG, `apple-touch-icon` 180x180 PNG.
- Not present: canonical, robots, `theme-color`, `og:url`, `og:type`, JSON-LD.

### 5.5 Weak points to fix in the replica

- Hero JPEGs are 0.5-1.7MB each and the logo PNG is 1.26MB, served unresized to a 448px column.
- No `prefers-reduced-motion` rule, though the page has five looping or entrance animations.
- No `:focus-visible` style.
- `deviceorientation` is used without the iOS permission request, so the tilt effect does nothing on iPhones.
- No `theme-color`, so mobile browser chrome does not match the ink background.

---

## Patterns to reuse

Brand-free. Values are from the references unless marked "recommendation".

### A. Visual system (black + gold, from sites 1 and 5)

- Backgrounds: near-black `#0c0c0d` for the page, `#161618` for raised cards, a warm off-white (`#f3eee4` to `#f5f3ee`) for text on dark and for light sections.
- Gold as a ramp, not one colour: a light, mid and deep stop. Two tested ramps: `#f6dc8a / #e2b64c / #c9952c / #a8781c` (vertical, soft, metallic) and `#ebcb6a / #c9a227 / #9a7a1e` (135deg, sharper). Use the gradient for fills and a single mid-tone (`#d6a63a` or `#c9a227`) for borders, with a slightly lighter tone (`#e0b24a`) for gold text on black.
- Gold on black: text and borders. Black `#111` on gold: button labels and icon glyphs.
- Headings: heavy (800-900), uppercase, tight leading (1.05-1.25), slightly negative tracking, with one gold-highlighted phrase per heading.
- Eyebrow above each h2: 11-13px, weight 700, tracking .25-.32em, gold.
- Hairlines on dark: white at 10% opacity. Gold top borders (3-5px) mark cards that matter (quote card, form, summary panel).
- Section theming by local variables (site 4): each background class sets `--muted`, `--line`, `--btn-bg`, `--btn-fg`, `--hl`; components read only those.

### B. Home page building blocks (site 1 order, with site 2-4 refinements)

1. Top bar: location, hours, one trust claim, email. Hide on mobile; slide away after 60px of scroll.
2. Nav: logo, 4-5 links, language toggle, phone button. Solid background after 60px.
3. Hero: H1 with one gold word, one-paragraph lead, two CTAs (estimate, phone), quote card on the right with three fields and a gold top border, trust chips along the bottom (icon in a circle, bold caps title, one-line description).
4. Services grid of image cards numbered 01, 02... Each should link to a real destination.
5. Before/after slider: two stacked images, `clip-path:inset(0 0 0 var(--x))` on the top one, pointer capture, clamp 4-96%, `touch-action:none`. Recommendation: also make it keyboard-operable (`role="slider"`, arrow keys), which the reference is not.
6. Room selector: illustration + SVG polygon overlay in a percentage viewBox + mask to dim unselected rooms + side panel with counter, title, text, three bullets, CTA + a row of pill buttons mirroring the polygons.
7. Counters band. Render the final number on the server and animate only as an enhancement (see D).
8. Four-step process: numbered circles on a dashed connector; 2 columns on tablets, 1 on small phones.
9. Service-area list and FAQ (native `<details>` is enough; for animated open, transition `grid-template-rows` 0fr to 1fr).
10. Full estimate form with contact rows and hours beside it.
11. Mobile fixed bottom bar: three actions (Call, Text, Estimate), the last one gold and wider (`1fr 1fr 1.3fr` or `flex:1.4`), 48px touch targets, `padding-bottom` including `env(safe-area-inset-bottom)`, and extra bottom padding on the footer so nothing is covered.

Optional, from the other sites: category tabs over a filterable project or service list (`role="tablist"`, underline-style active state, horizontal scroll on mobile); a step configurator for "describe your project" (single-choice image tiles, multi-select check rows with `aria-pressed`, sticky live summary card whose button carries the choices into the estimate form); a marquee with a duplicated track and masked edges; a snap-scroll reel row that plays videos only while visible.

### C. Multi-page SEO skeleton (site 3, with fixes)

- Routes: `/`, `/services` (or `/services/[slug]` as site 2 does), `/areas`, `/areas/[city]`, `/about`, `/contact`, `/privacy`, `/terms`, plus `sitemap.xml` and `robots.txt`.
- Every page: unique title ("Topic | Qualifier | Brand"), unique description, self-referencing canonical, `og:url` equal to the canonical, `og:image` 1200x630 with alt, Twitter large card. Legal pages get their own description too.
- One host, decided up front (www or bare). Canonical, `og:url`, sitemap, JSON-LD `@id` / `url`, and internal links must all use it, and it must answer 200, not a redirect.
- JSON-LD on every page: one business node with a stable `@id` (`https://{host}/#business`), a specific `@type` (for a remodeler, `GeneralContractor` or `HomeAndConstructionBusiness`), name, absolute `url` / `image` / `logo`, telephone, `PostalAddress` (at least locality, region, country), `areaServed` as `City` objects, `openingHoursSpecification`, `sameAs`, and `hasOfferCatalog` of `Offer > Service`. Inner pages add `BreadcrumbList`. Any page with visible FAQ adds `FAQPage` matching the visible text.
- Headings: exactly one h1 per page; h2 per section; h3 inside sections; no skipped levels; footer column titles as non-heading elements or a consistent lower level.
- City page skeleton: region tag; h1 "{Trade} in {City}, {ST}"; intro with a city-specific CTA label; grid of "{Service} in {City}" link cards; process; nearby-city links + link back to the index; FAQ; CTA band. Recommendation: give each city page content of its own (neighbourhoods, housing stock, permit notes, local projects, a city-specific FAQ item) instead of name substitution.
- Areas index: an interactive selector is fine, but always include a plain list of `<a>` links to every city page, grouped by region, and link the top cities from the home page as real links.
- Review CTA: a distinct card with the Google mark, a short question line, a smaller instruction line and a button, linking to the Google Business "write a review" short link in a new tab. Repeat as a text link in the footer. A "read reviews" + "leave a review" button pair works beside the testimonials heading.

### D. Mistakes in the references that must not be repeated

| Mistake | Site | Seen in what I fetched? | Rule for the new site |
|---|---|---|---|
| Two h1 on one page | 2 | No. One h1 on every page checked (server HTML only). The hero stacks an h1 and an h2 in the same spot. | When a hero swaps between two headlines, only one may be an h1. |
| Counters show "0+" in server HTML | 1 | Yes | Server-render the final value; start the count-up from the client only, and only when motion is allowed. |
| Canonical on a different domain than internal links | 2 | Yes: canonical uses the bare domain, which 308-redirects to `www`; on the preview host it names another host entirely. Legal pages canonicalise to the home page. | One host constant feeds canonical, OG, sitemap and JSON-LD. Each page canonicalises to itself. |
| Opening hours differ between sections | 1 | Yes: top bar vs hours table | Keep hours in one data object; render the top bar, contact section, footer and JSON-LD from it. |
| Font link does not match the CSS font families | 1 | Yes | Load exactly the families and weights the CSS names. |
| Language toggle is client-only | 1, 4 | Yes | If Spanish matters for search, give it real URLs and `hreflang`; at minimum update `<html lang>` and restore the saved choice. |
| Placeholder `href="#"` links | 1, 4 | Yes | Every link goes somewhere. |
| Near-duplicate city pages | 3 | Yes | Unique content per city. |
| Relative `image` in JSON-LD, no address | 3 | Yes | Absolute URLs; include the address. |
| Empty address slot in legal text | 2 | Yes | Fill every template slot or remove it. |
| Multi-megabyte images | 5 | Yes | Resize and compress to the rendered size. |
| No reduced-motion handling | 5 | Yes | Add a `prefers-reduced-motion` rule that shows content and stops loops. |

### E. SMS / phone consent line (recommendation)

The reference uses a passive sentence under the submit button plus a "text messaging" block in the privacy policy (structures quoted in section 2). For a form that will lead to text messages, a fuller pattern is standard. This is a drafting template, not legal advice; the agency owner should have it confirmed.

Elements, in order:

1. An **unticked checkbox** that is not required to submit the form (or, if texts are essential to the service, a clearly worded required one).
2. Who is sending: the business's legal or trade name.
3. What: the kind of messages (estimate, scheduling, project updates).
4. Where: "at the number provided".
5. Frequency: "message frequency varies".
6. Cost: "message and data rates may apply".
7. Exit and help: "reply STOP to opt out, HELP for help".
8. "Consent is not a condition of purchase."
9. Links to the privacy policy and terms.

Template:

> [ ] I agree to receive text messages and calls from {Business name} at the number provided about my estimate request, scheduling and project updates. Message frequency varies. Message and data rates may apply. Reply STOP to opt out or HELP for help. Consent is not a condition of purchase. See our Privacy Policy and Terms.

Mirror it in the privacy policy with a short "Text messages" section that repeats the STOP / HELP / rates wording and states that mobile opt-in data is not shared with third parties for marketing. Provide a Spanish version of the same line if the form is offered in Spanish.

### F. Link-in-bio page

Build from section 5 directly: 448px column, 34svh crossfading hero with a curved ink cap, logo overlapping by 80px, h1 + subtitle, seven buttons (first one gold), five tags, footer. Keep the structure and values; replace every asset, label detail and line of copy with the new brand's own, and apply the fixes in 5.5.
