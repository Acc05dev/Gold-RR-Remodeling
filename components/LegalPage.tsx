import { getTranslations } from "next-intl/server";
import type { LegalDoc, Locale } from "@/data/types";
import { PageHero } from "./PageHero";

export async function LegalPage({ locale, doc, path }: { locale: Locale; doc: LegalDoc; path: string }) {
  const t = await getTranslations({ locale });
  const date = new Intl.DateTimeFormat(locale === "es" ? "es-US" : "en-US", { dateStyle: "long", timeZone: "UTC" }).format(new Date(doc.updated));
  return (
    <>
      <PageHero
        locale={locale}
        title={doc.title[locale]}
        crumbs={[
          { name: t("common.home"), path: "/" },
          { name: doc.title[locale], path },
        ]}
      />
      <section className="sec on-bone">
        <div className="wrap">
          <div className="legal">
            <p className="legal__date">{t("legal.updated", { date })}</p>
            {doc.sections[locale].map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                {s.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </section>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
