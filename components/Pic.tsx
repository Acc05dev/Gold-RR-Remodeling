import Image from "next/image";
import { photo } from "@/data/media";
import type { Locale } from "@/data/types";

/**
 * A client photo by key. Dimensions, blur placeholder and localized alt text come from
 * data/media.generated.ts, so layout never shifts and alt text is never forgotten.
 * The originals are 768 px wide: keep `sizes` honest and never show them wider than ~600 CSS px.
 */
export function Pic({
  k,
  locale,
  sizes,
  className,
  priority,
  fill,
  alt,
}: {
  k: string;
  locale: Locale;
  sizes: string;
  className?: string;
  priority?: boolean;
  fill?: boolean;
  alt?: string;
}) {
  const p = photo(k);
  return (
    <Image
      src={p.src}
      alt={alt ?? p.alt[locale]}
      {...(fill ? { fill: true } : { width: p.width, height: p.height })}
      sizes={sizes}
      quality={75}
      placeholder="blur"
      blurDataURL={p.blur}
      priority={priority}
      className={className}
    />
  );
}
