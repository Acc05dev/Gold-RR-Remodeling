"use server";

import { headers } from "next/headers";
import { z } from "zod";
import { business } from "@/data/business";

export type EstimateResult =
  | { ok: true }
  | { ok: false; error: "validation"; fields: string[] }
  | { ok: false; error: "rate" | "server" }
  | { ok: false; error: "fallback"; mailto: string };

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  phone: z
    .string()
    .trim()
    .max(40)
    .refine((v) => v.replace(/\D/g, "").length >= 10),
  email: z.union([z.literal(""), z.email().max(160)]),
  city: z.string().trim().max(80),
  property: z.string().trim().max(40),
  services: z.array(z.string().max(80)).min(1).max(12),
  description: z.string().trim().max(4000),
  contact: z.enum(["call", "text", "email"]),
  language: z.enum(["en", "es"]),
  source: z.string().max(60),
});

// Basic per-IP limit, in memory. Enough to blunt bursts; it resets when the function instance recycles.
const WINDOW = 10 * 60 * 1000;
const LIMIT = 5;
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > LIMIT;
}

const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

export async function submitEstimate(form: FormData): Promise<EstimateResult> {
  // Honeypot: real visitors never see or fill this field. Bots get a quiet success.
  if (String(form.get("company") ?? "") !== "") return { ok: true };

  const h = await headers();
  const ip = (h.get("x-forwarded-for") ?? "unknown").split(",")[0].trim();
  if (limited(ip)) return { ok: false, error: "rate" };

  const str = (k: string) => String(form.get(k) ?? "");
  const parsed = schema.safeParse({
    name: str("name"),
    phone: str("phone"),
    email: str("email").trim(),
    city: str("city"),
    property: str("property"),
    services: form.getAll("services").map(String).filter(Boolean),
    description: str("description"),
    contact: str("contact") || "call",
    language: str("language") || "en",
    source: str("source") || "website",
  });
  if (!parsed.success) {
    return { ok: false, error: "validation", fields: [...new Set(parsed.error.issues.map((i) => String(i.path[0])))] };
  }
  const d = parsed.data;

  const photos = form
    .getAll("photos")
    .filter((f): f is File => f instanceof File && f.size > 0 && f.type.startsWith("image/"))
    .slice(0, 5)
    .filter((f) => f.size <= 1.5 * 1024 * 1024);

  const rows: [string, string][] = [
    ["Name", d.name],
    ["Phone", d.phone],
    ["Email", d.email || "(not given)"],
    ["City", d.city || "(not given)"],
    ["Property", d.property || "(not given)"],
    ["Services", d.services.join(", ")],
    ["Preferred contact", d.contact],
    ["Preferred language", d.language === "es" ? "Español" : "English"],
    ["Sent from", d.source],
    ["Project", d.description || "(no description)"],
  ];
  const subject = `New estimate request: ${d.services[0]}${d.city ? ` in ${d.city}` : ""} (${d.name})`;
  const text = rows.map(([k, v]) => `${k}: ${v}`).join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    // No mail provider configured yet: hand the request back so the visitor's own mail app can send it.
    return {
      ok: false,
      error: "fallback",
      mailto: `mailto:${business.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`,
    };
  }

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(key);
    const attachments = await Promise.all(
      photos.map(async (f, i) => ({ filename: f.name || `photo-${i + 1}.jpg`, content: Buffer.from(await f.arrayBuffer()) })),
    );
    const { error } = await resend.emails.send({
      from: process.env.LEAD_FROM_EMAIL ?? "Gold R.R Website <onboarding@resend.dev>",
      to: process.env.LEAD_TO_EMAIL ?? business.email,
      replyTo: d.email || undefined,
      subject,
      text,
      html: `<table cellpadding="8" style="font:15px/1.5 Arial,sans-serif;border-collapse:collapse">${rows
        .map(
          ([k, v]) =>
            `<tr><td style="border-bottom:1px solid #eee;color:#6b4f17;font-weight:bold;vertical-align:top;white-space:nowrap">${esc(k)}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`,
        )
        .join("")}</table>`,
      attachments,
    });
    if (error) {
      console.error("[estimate] resend error", error);
      return { ok: false, error: "server" };
    }
    return { ok: true };
  } catch (e) {
    console.error("[estimate] send failed", e);
    return { ok: false, error: "server" };
  }
}
