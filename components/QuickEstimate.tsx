"use client";

import { useId, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitEstimate } from "@/app/actions/estimate";
import { track } from "@/lib/analytics";
import { business } from "@/data/business";
import type { Locale } from "@/data/types";

/** The three-field card in the hero: name, phone, service. Posts to the same action as the full form. */
export function QuickEstimate({ options, source = "hero-card" }: { options: { value: string; label: string }[]; source?: string }) {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const id = useId();
  const [pending, start] = useTransition();
  const [state, setState] = useState<"idle" | "sent">("idle");
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.set("language", locale);
    form.set("contact", "call");
    form.set("source", source);
    setErrors([]);
    setMessage("");
    start(async () => {
      const res = await submitEstimate(form);
      if (res.ok) {
        track("form_submit", { form: source });
        setState("sent");
      } else if (res.error === "validation") {
        setErrors(res.fields);
      } else if (res.error === "fallback") {
        track("form_submit", { form: `${source}-mailto` });
        setMessage(t("form.errors.fallback"));
        window.location.href = res.mailto;
      } else {
        setMessage(t(`form.errors.${res.error}`));
      }
    });
  }

  if (state === "sent") {
    return (
      <div className="qcard chamfer on-bone" role="status">
        <p className="qcard__title">{t("form.successTitle")}</p>
        <p>{t("quick.sent")}</p>
        <p className="qcard__lic">{business.licenseLabel}</p>
      </div>
    );
  }

  const bad = (f: string) => errors.includes(f);
  return (
    <form className="qcard chamfer on-bone" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-t`}>
      <p className="qcard__title" id={`${id}-t`}>
        {t("quick.title")}
      </p>
      <p className="qcard__lead">{t("quick.lead")}</p>
      <div className="field">
        <label htmlFor={`${id}-n`}>{t("quick.name")}</label>
        <input id={`${id}-n`} name="name" autoComplete="name" required aria-invalid={bad("name")} aria-describedby={bad("name") ? `${id}-ne` : undefined} />
        {bad("name") && (
          <p className="field__err" id={`${id}-ne`}>
            {t("form.errors.name")}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor={`${id}-p`}>{t("quick.phone")}</label>
        <input id={`${id}-p`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={bad("phone")} aria-describedby={bad("phone") ? `${id}-pe` : undefined} />
        {bad("phone") && (
          <p className="field__err" id={`${id}-pe`}>
            {t("form.errors.phone")}
          </p>
        )}
      </div>
      <div className="field">
        <label htmlFor={`${id}-s`}>{t("quick.service")}</label>
        <select id={`${id}-s`} name="services" defaultValue="" required aria-invalid={bad("services")} aria-describedby={bad("services") ? `${id}-se` : undefined}>
          <option value="" disabled>
            {t("quick.choose")}
          </option>
          {options.map((o) => (
            <option key={o.value} value={o.label}>
              {o.label}
            </option>
          ))}
          <option value={t("quick.other")}>{t("quick.other")}</option>
        </select>
        {bad("services") && (
          <p className="field__err" id={`${id}-se`}>
            {t("form.errors.service")}
          </p>
        )}
      </div>
      {/* honeypot */}
      <div className="hp" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <button className="btn btn--gold btn--block" disabled={pending}>
        {pending ? t("quick.sending") : t("quick.submit")}
      </button>
      {message && (
        <p className="field__err" role="alert">
          {message}
        </p>
      )}
      <p className="qcard__consent">{t("quick.consent")}</p>
    </form>
  );
}
