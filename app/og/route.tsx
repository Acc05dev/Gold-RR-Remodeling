import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { business } from "@/data/business";

/**
 * Open Graph image for any page: /og?title=...&kicker=...
 * Ink ground, the roof lines and gold bar from the logo, the logo itself, and the page title.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = (searchParams.get("title") ?? business.name).slice(0, 90);
  const kicker = (searchParams.get("kicker") ?? `${business.address.locality}, ${business.address.region}`).slice(0, 60);
  const root = process.cwd();
  const [black, bold, logo] = await Promise.all([
    readFile(join(root, "assets/fonts/montserrat-900.woff")),
    readFile(join(root, "assets/fonts/montserrat-700.woff")),
    readFile(join(root, "public/brand/logo-dark.svg"), "utf8"),
  ]);
  const size = title.length > 46 ? 58 : title.length > 28 ? 70 : 86;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: "#0E0E0E", color: "#F3F1EC", fontFamily: "Montserrat", position: "relative" }}>
        <svg width="1200" height="630" viewBox="0 0 1200 630" style={{ position: "absolute", left: 0, top: 0 }}>
          <path d="M60 574V250L250 60L420 230" fill="none" stroke="#BF9643" strokeWidth="18" />
          <path d="M286 74L300 60L560 320" fill="none" stroke="#BF9643" strokeWidth="18" />
          <rect x="51" y="556" width="780" height="18" fill="#BF9643" />
          <rect x="830" y="556" width="310" height="18" fill="#DFA553" />
          <rect x="1040" y="556" width="100" height="18" fill="#CC8C32" />
        </svg>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "0 70px 96px 130px", width: "100%" }}>
          <div style={{ display: "flex", fontSize: 26, fontWeight: 700, color: "#DFA553", marginBottom: 18 }}>{kicker}</div>
          <div style={{ display: "flex", fontSize: size, fontWeight: 900, lineHeight: 0.98, letterSpacing: -2, textTransform: "uppercase", maxWidth: 960 }}>{title}</div>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={`data:image/svg+xml;base64,${Buffer.from(logo).toString("base64")}`} width={250} height={150} style={{ position: "absolute", right: 60, top: 54 }} />
        <div style={{ position: "absolute", right: 60, bottom: 26, display: "flex", gap: 34, fontSize: 20, fontWeight: 700, color: "#A9A397" }}>
          <span>{business.phone.display}</span>
          <span>{business.licenseLabel}</span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Montserrat", data: black, weight: 900, style: "normal" },
        { name: "Montserrat", data: bold, weight: 700, style: "normal" },
      ],
      headers: { "Cache-Control": "public, max-age=86400, s-maxage=31536000, stale-while-revalidate=86400" },
    },
  );
}
