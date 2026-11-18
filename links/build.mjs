// Builds the link-in-bio page. No dependencies: `node build.mjs` writes public/index.html and the vCard.
// Everything that can change (URLs, phone, social profiles) lives in site.config.json.
// Images in public/img are produced from the client's photos by ../scripts/build-links-assets.mjs.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const DIR = path.dirname(fileURLToPath(import.meta.url));
const c = JSON.parse(fs.readFileSync(path.join(DIR, "site.config.json"), "utf8"));
const OUT = path.join(DIR, "public");
fs.mkdirSync(OUT, { recursive: true });

const sms = `sms:${c.phoneE164}?&body=${encodeURIComponent("Hi Gold R.R, I'd like a free estimate.")}`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");

const icon = {
  phone: '<path d="M5 3h4l2 5-2.500 1.500a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/>',
  estimate: '<path d="M5 3h10l4 4v14H5z"/><path d="M9 12h6M9 16h6M9 8h3"/>',
  text: '<path d="M3 4h18v13H10l-5 4v-4H3z"/><path d="M8 9h8M8 12.500h5"/>',
  web: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3.200 3 14.800 0 18M12 3c-3 3.200-3 14.800 0 18"/>',
  star: '<path d="m12 3 2.800 5.900 6.400.800-4.700 4.500 1.200 6.500L12 17.500 6.300 20.700l1.200-6.500L2.800 9.700l6.400-.8z"/>',
  contact: '<path d="M5 3h14v18H5z"/><circle cx="12" cy="10" r="3"/><path d="M8 17c.8-2 2.300-3 4-3s3.200 1 4 3"/>',
  social: '<rect x="4" y="4" width="16" height="16" rx="4"/><circle cx="12" cy="12" r="3.500"/><path d="M17 7h.01"/>',
};
const svg = (d) => `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
const chevron = '<svg class="chev" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7"/></svg>';

const buttons = [
  { label: "Call us", sub: c.phoneDisplay, href: `tel:${c.phoneE164}`, icon: icon.phone, primary: true },
  { label: "Get a free estimate", sub: "Tell us about your project", href: `${c.siteUrl}/contact`, icon: icon.estimate },
  { label: "Text us", sub: "Send photos of the space", href: sms, icon: icon.text },
  { label: "Visit our website", sub: c.siteUrl.replace(/^https?:\/\/(www\.)?/, ""), href: c.siteUrl, icon: icon.web },
  { label: "Google reviews", sub: "★★★★★ Read or leave a review", href: c.googleProfile, icon: icon.star, blank: true },
  ...c.social.map((s) => ({ label: s.label, sub: s.handle ?? "", href: s.href, icon: icon.social, blank: true })),
  { label: "Save our contact", sub: "Add Gold R.R to your phone", href: "/goldrr-remodeling.vcf", icon: icon.contact, download: true },
];
const tags = ["Bathrooms", "Kitchens", "Tile", "Flooring", "Painting", "Drywall", "Carpentry"];
const hero = [
  ["walk-in-tile-shower", "Walk-in tile shower with pebble floor by Gold R.R Remodeling"],
  ["bathroom-vanity-lit-mirror", "Remodeled bathroom with navy vanity and backlit mirror"],
  ["slate-tile-bathroom", "Slate tile bathroom with mosaic border"],
];

const title = `${c.name} | Links`;
const description = `Call, text or request a free estimate from ${c.name}, licensed remodeling contractor in ${c.city}, ${c.region}. Bathrooms, kitchens, tile and flooring. Se habla español.`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}">
<link rel="canonical" href="${c.linksUrl}/">
<meta name="theme-color" content="#0E0E0E">
<meta property="og:type" content="website">
<meta property="og:url" content="${c.linksUrl}/">
<meta property="og:site_name" content="${esc(c.name)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${c.linksUrl}/img/og.jpg">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(description)}">
<meta name="twitter:image" content="${c.linksUrl}/img/og.jpg">
<link rel="icon" href="/icon.svg" type="image/svg+xml">
<link rel="icon" href="/img/icon-512.png" sizes="512x512" type="image/png">
<link rel="apple-touch-icon" href="/img/apple-icon.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;700;800;900&display=swap" rel="stylesheet">
<link rel="preload" as="image" href="/img/${hero[0][0]}.webp" type="image/webp" fetchpriority="high">
<style>
:root{--ink:#0e0e0e;--card:#171717;--paper:#f3f1ec;--gold:#bf9643;--gold-l:#dfa553;--gold-d:#cc8c32;--gold-text:#dfa553;
--fill:linear-gradient(#ecc478 0%,#dfa553 38%,#bf9643 70%,#a67a2c 100%)}
*{box-sizing:border-box;margin:0;padding:0}
html{background:var(--ink);color:var(--paper);-webkit-text-size-adjust:100%}
body{font-family:Montserrat,system-ui,sans-serif;-webkit-font-smoothing:antialiased}
a{color:inherit;text-decoration:none}
img{display:block;max-width:100%}
:focus-visible{outline:2px solid var(--gold-l);outline-offset:3px}
main{margin-inline:auto;min-height:100svh;max-width:448px;overflow:hidden;background:var(--ink);padding-bottom:calc(40px + env(safe-area-inset-bottom))}
.hero{position:relative;height:34svh;min-height:240px;overflow:hidden}
.hero__pan{position:absolute;inset:-24px;transition:transform .5s ease-out}
.hero img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity 1.5s}
.hero img.on{opacity:1;animation:kb 7s ease-out both}
.hero::before{content:"";position:absolute;inset:0;z-index:1;background:linear-gradient(to bottom,rgba(14,14,14,.3),transparent,rgba(14,14,14,.7))}
.hero::after{content:"";position:absolute;left:0;right:0;bottom:-1px;z-index:2;height:48px;background:var(--ink);border-radius:50% 50% 0 0/100% 100% 0 0}
.id{position:relative;z-index:3;margin-top:-80px;padding-inline:20px;text-align:center}
.id::before{content:"";position:absolute;left:50%;top:16px;width:288px;height:160px;margin-left:-144px;background:rgba(14,14,14,.85);filter:blur(40px)}
.logo{position:relative;display:inline-block;transition:transform .3s ease-out}
.logo img{height:128px;width:auto;filter:drop-shadow(0 8px 30px rgba(0,0,0,.6))}
.logo-shine{pointer-events:none;position:absolute;inset:0;background:linear-gradient(105deg,transparent 40%,rgba(255,244,214,.75) 50%,transparent 60%) 150% 0/250% 100% no-repeat;
-webkit-mask:url(/logo.svg) center/contain no-repeat;mask:url(/logo.svg) center/contain no-repeat;animation:shine 3.6s ease-in-out 1.4s infinite}
h1{position:relative;margin-top:16px;font-size:1.35rem;font-weight:900;text-transform:uppercase;line-height:1.25;letter-spacing:-.025em}
.gold-text{background:linear-gradient(#ecc478,#bf9643);-webkit-background-clip:text;background-clip:text;color:transparent}
.sub{position:relative;margin-top:8px;font-size:14px;line-height:20px;font-weight:500;color:rgba(243,241,236,.72)}
nav{margin-top:32px;padding-inline:20px;display:grid;gap:12px}
.btn{position:relative;display:flex;align-items:center;gap:16px;padding:16px;border-radius:12px;background:var(--card);border:1px solid rgba(255,255,255,.1);transition:border-color .15s,transform .15s,box-shadow .3s}
.btn:hover{border-color:rgba(191,150,67,.65);box-shadow:0 0 0 1px rgba(191,150,67,.25),0 10px 34px rgba(191,150,67,.14)}
.btn:active{transform:scale(.98)}
.chip{flex:none;display:grid;place-items:center;width:44px;height:44px;border-radius:50%;background:var(--fill);color:#111}
.txt{flex:1;min-width:0;text-align:left}
.lab{display:block;font-size:.95rem;font-weight:800;text-transform:uppercase;letter-spacing:.01em}
.sublab{display:block;margin-top:2px;font-size:12px;font-weight:500;color:rgba(243,241,236,.62);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.chev{flex:none;opacity:.6;transition:transform .2s}
.btn:hover .chev{transform:translateX(4px)}
.btn.primary{background:var(--fill);color:#111;border-color:transparent;overflow:hidden;box-shadow:0 10px 30px rgba(191,150,67,.28)}
.btn.primary .chip{background:var(--ink);color:var(--gold-text)}
.btn.primary .sublab{color:rgba(14,14,14,.78);font-weight:700}
.btn.primary::after{content:"";pointer-events:none;position:absolute;inset:0;transform:translate(-120%);background:linear-gradient(105deg,transparent 35%,rgba(255,255,255,.55) 50%,transparent 65%);animation:sheen 3.6s ease-in-out 2.2s infinite}
.tags{margin-top:32px;padding-inline:20px;display:flex;flex-wrap:wrap;justify-content:center;gap:8px;list-style:none}
.tags li{padding:6px 12px;border:1px solid rgba(191,150,67,.38);border-radius:9999px;font-size:.7rem;font-weight:700;text-transform:uppercase;color:var(--gold-text)}
footer{margin-top:32px;padding-inline:20px;text-align:center;font-size:.7rem;font-weight:500;color:rgba(243,241,236,.55)}
footer p+p{margin-top:8px;display:flex;justify-content:center;gap:16px}
footer a{text-decoration:underline;text-underline-offset:2px}
footer a:hover{color:var(--gold-text)}
.rise{opacity:0;animation:rise .7s cubic-bezier(.2,.8,.2,1) forwards;animation-delay:var(--d,0s)}
.flipin{animation:flipin 1.1s cubic-bezier(.2,.8,.2,1) both}
@keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:none}}
@keyframes kb{from{transform:scale(1.12)}to{transform:scale(1)}}
@keyframes flipin{from{opacity:0;transform:perspective(800px) rotateX(-75deg) translateY(30px)}to{opacity:1;transform:none}}
@keyframes shine{0%{background-position:150% 0}55%,to{background-position:-60% 0}}
@keyframes sheen{55%,to{transform:translate(120%)}}
@media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important}.rise{opacity:1}}
</style>
</head>
<body>
<main>
  <div class="hero" aria-hidden="true">
    <div class="hero__pan" id="pan">
${hero.map(([f, alt], i) => `      <picture><source srcset="/img/${f}.webp" type="image/webp"><img src="/img/${f}.jpg" alt="${esc(alt)}" width="944" height="640"${i === 0 ? ' class="on" fetchpriority="high"' : ' loading="lazy"'} decoding="async"></picture>`).join("\n")}
    </div>
  </div>

  <header class="id">
    <div class="flipin"><div class="logo" id="logo"><img src="/logo.svg" alt="${esc(c.name)}" width="636" height="381"><span class="logo-shine"></span></div></div>
    <h1 class="rise" style="--d:.1s">Remodeling <span class="gold-text">North Bay</span> homes, done right</h1>
    <p class="sub rise" style="--d:.18s">Serving ${esc(c.city)} &amp; the North Bay<br>Free estimates. Se habla español.</p>
  </header>

  <nav aria-label="Contact ${esc(c.name)}">
${buttons
  .map(
    (b, i) =>
      `    <a class="btn rise${b.primary ? " primary" : ""}" style="--d:${(0.25 + i * 0.07).toFixed(2)}s" href="${esc(b.href)}"${b.blank ? ' target="_blank" rel="noopener"' : ""}${b.download ? " download" : ""}><span class="chip">${svg(b.icon)}</span><span class="txt"><span class="lab">${esc(b.label)}</span><span class="sublab">${esc(b.sub)}</span></span>${chevron}</a>`,
  )
  .join("\n")}
  </nav>

  <ul class="tags rise" style="--d:.8s" aria-label="Services">
${tags.map((t) => `    <li>${t}</li>`).join("\n")}
  </ul>

  <footer class="rise" style="--d:.9s">
    <p>© <span id="y">${new Date().getFullYear()}</span> ${esc(c.legalName)}. CA Lic. #${c.license}</p>
    <p><a href="${c.siteUrl}/privacy">Privacy</a><a href="${c.siteUrl}/terms">Terms</a></p>
  </footer>
</main>
<script>
(function(){
  document.getElementById("y").textContent=new Date().getFullYear();
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  var imgs=document.querySelectorAll(".hero img"),i=0;
  setInterval(function(){imgs[i].classList.remove("on");i=(i+1)%imgs.length;imgs[i].classList.add("on")},4500);
  var pan=document.getElementById("pan"),logo=document.getElementById("logo");
  function tilt(x,y){pan.style.transform="translate("+(-18*x)+"px,"+(-18*y)+"px)";logo.style.transform="perspective(700px) rotateY("+(14*x)+"deg) rotateX("+(-14*y)+"deg)"}
  addEventListener("mousemove",function(e){tilt(e.clientX/innerWidth-.5,e.clientY/innerHeight-.5)},{passive:true});
  addEventListener("deviceorientation",function(e){if(e.gamma==null)return;var c=function(v){return Math.max(-1,Math.min(1,v))/2};tilt(c(e.gamma/30),c((e.beta-45)/30))},{passive:true});
})();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(OUT, "index.html"), html);

// vCard 3.0 with the logo embedded (public/img/vcard-logo.b64 is written by the assets script)
const b64Path = path.join(OUT, "img/vcard-logo.b64");
const photo = fs.existsSync(b64Path) ? `PHOTO;ENCODING=b;TYPE=PNG:${fs.readFileSync(b64Path, "utf8").trim()}\r\n` : "";
const vcf =
  [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:;${c.name};;;`,
    `FN:${c.name}`,
    `ORG:${c.legalName}`,
    "TITLE:Remodeling Contractor",
    `TEL;TYPE=WORK,VOICE,CELL:${c.phoneE164}`,
    `EMAIL;TYPE=WORK:${c.email}`,
    `URL:${c.siteUrl}`,
    `ADR;TYPE=WORK:;;;${c.city};${c.region};${c.postalCode};USA`,
    `NOTE:CA Contractor License #${c.license}. Free estimates. Se habla español.`,
  ].join("\r\n") +
  "\r\n" +
  photo +
  "END:VCARD\r\n";
fs.writeFileSync(path.join(OUT, "goldrr-remodeling.vcf"), vcf);
console.log("links page built →", path.relative(process.cwd(), OUT));
