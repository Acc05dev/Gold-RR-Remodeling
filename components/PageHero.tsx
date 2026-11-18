import { Link } from "@/i18n/navigation";
import type { Locale } from "@/data/types";
import { breadcrumbLd, url } from "@/lib/seo";
import { JsonLd } from "./JsonLd";

export type Crumb = { name: string; path: string };

/**
 * Header for every inner page: visible breadcrumbs (and their JSON-LD), the single H1,
 * an optional lead and actions, the roof drawn large behind, and the gold floor underneath.
 */
export function PageHero({
  locale,
  crumbs,
  title,
  lead,
  meta,
  children,
}: {
  locale: Locale;
  crumbs: Crumb[];
  title: string;
  lead?: string;
  meta?: string[];
  children?: React.ReactNode;
}) {
  return (
    <header className="phero on-ink">
      <JsonLd data={breadcrumbLd(crumbs.map((c) => ({ name: c.name, url: url(c.path, locale) })))} />
      <div className="wrap phero__in">
        <svg className="phero__roof" viewBox="0 0 400 240" aria-hidden="true">
          <path d="M7 240V157L147 17L290 160" />
          <path d="M173.6 27.4L184 17L386 219" />
        </svg>
        <nav className="crumbs" aria-label="Breadcrumb">
          <ol>
            {crumbs.map((c, i) =>
              i === crumbs.length - 1 ? (
                <li key={c.path} aria-current="page">
                  {c.name}
                </li>
              ) : (
                <li key={c.path}>
                  <Link href={c.path}>{c.name}</Link>
                </li>
              ),
            )}
          </ol>
        </nav>
        <h1 className="display h1--page">{title}</h1>
        {meta?.length ? (
          <ul className="phero__meta">
            {meta.map((m) => (
              <li key={m}>{m}</li>
            ))}
          </ul>
        ) : null}
        {lead ? <p className="lead">{lead}</p> : null}
        {children ? <div className="phero__cta">{children}</div> : null}
      </div>
      <div className="phero__floor" />
    </header>
  );
}
