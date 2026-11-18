import type { Metadata, Viewport } from "next";
import { Montserrat, Manrope, Bebas_Neue } from "next/font/google";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { SITE_URL, business } from "@/data/business";
import type { Locale } from "@/data/types";
import { businessLd } from "@/lib/seo";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MobileBar } from "@/components/MobileBar";
import { Preloader } from "@/components/Preloader";
import { SiteEffects } from "@/components/SiteEffects";
import { JsonLd } from "@/components/JsonLd";
import "../globals.css";
import "../sections.css";
import "../pages.css";

// Self-hosted by next/font with size-adjusted fallbacks (no layout shift).
// The "latin" subset already contains every character English and Spanish need (á é í ó ú ñ ü ¿ ¡),
// so latin-ext is not shipped: it would add three more preloaded files to every page.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  display: "swap",
  variable: "--font-montserrat",
});
const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});
// Numerals only, always below the fold: loaded on demand rather than preloaded.
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
  variable: "--font-bebas",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: business.name,
  authors: [{ name: business.name }],
  formatDetection: { telephone: true, address: false, email: true },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#0E0E0E",
  colorScheme: "dark",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}
// Only /en and /es exist. Anything else in this position (for example a request for a missing
// file such as /foo.png, which skips the proxy) is a plain 404 and never renders a page.
export const dynamicParams = false;

// Runs before first paint. Decides the motion mode for this visit and whether it gets the preloader.
//   • html[data-reduced] is set when the visitor's system asks for reduced motion
//     (Windows: Settings › Accessibility › Visual effects › Animation effects off).
//     In that mode there is no preloader, pin, parallax or smooth scroll: content fades in.
//   • ?motion=full forces the full experience on this device (remembered), ?motion=reduced forces
//     the calm one, ?motion=auto goes back to following the system. Handy for reviewing the site.
const BOOT = `(function(){try{var d=document.documentElement;d.classList.add("js");var q=new URLSearchParams(location.search).get("motion");if(q){if(q==="auto")localStorage.removeItem("grr-motion");else if(q==="full"||q==="reduced")localStorage.setItem("grr-motion",q)}var m=localStorage.getItem("grr-motion");var r=m==="reduced"||(m!=="full"&&matchMedia("(prefers-reduced-motion: reduce)").matches);if(r)d.setAttribute("data-reduced","");if(!r&&!sessionStorage.getItem("grr-loaded"))d.classList.add("preloading")}catch(e){}})()`;

export default async function LocaleLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const ga = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale === "es" ? "es-US" : "en-US"} suppressHydrationWarning className={`${montserrat.variable} ${manrope.variable} ${bebas.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
      </head>
      <body>
        <NextIntlClientProvider>
          <a className="skip" href="#main">
            {locale === "es" ? "Ir al contenido" : "Skip to content"}
          </a>
          <Preloader />
          <Header />
          <main id="main">{children}</main>
          <Footer locale={locale as Locale} />
          <MobileBar locale={locale as Locale} />
          <SiteEffects />
        </NextIntlClientProvider>
        <JsonLd data={businessLd(locale as Locale)} />
        <Analytics />
        {ga ? (
          <>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga}`} strategy="lazyOnload" />
            <Script id="ga4" strategy="lazyOnload">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}window.gtag=gtag;gtag("js",new Date());gtag("config","${ga}");`}
            </Script>
          </>
        ) : null}
      </body>
    </html>
  );
}
