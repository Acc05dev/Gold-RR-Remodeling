import { notFound } from "next/navigation";

// The locale is still limited to en/es by the layout; only the rest of the path is open-ended.
export const dynamicParams = true;

// Any unknown path inside a locale renders app/[locale]/not-found.tsx with the full site chrome.
export default function CatchAll() {
  notFound();
}
