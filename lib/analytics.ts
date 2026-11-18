"use client";

import { track as vercelTrack } from "@vercel/analytics";

export type TrackEvent = "click_call" | "click_text" | "click_email" | "form_submit" | "click_directions" | "click_review";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Sends one conversion event to Vercel Analytics and, if configured, GA4. */
export function track(event: TrackEvent, props: Record<string, string> = {}) {
  try {
    vercelTrack(event, props);
    window.gtag?.("event", event, props);
  } catch {
    /* analytics must never break the page */
  }
}
