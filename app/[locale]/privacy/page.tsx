import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { privacy } from "@/data/legal";
import type { Locale } from "@/data/types";
import { pageMeta } from "@/lib/seo";
import { LegalPage } from "@/components/LegalPage";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  return pageMeta({ locale, path: "/privacy", title: t("privacyTitle"), description: t("privacyDescription") });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LegalPage locale={locale} doc={privacy} path="/privacy" />;
}
