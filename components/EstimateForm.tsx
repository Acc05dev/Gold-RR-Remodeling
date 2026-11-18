"use client";

import { useEffect, useId, useRef, useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { submitEstimate } from "@/app/actions/estimate";
import { track } from "@/lib/analytics";
import type { Locale } from "@/data/types";
import { CloseIcon } from "./Icons";

const MAX_PHOTOS = 5;

/** Downscale to 1600 px JPEG in the browser so five phone photos fit comfortably in one request. */
async function compress(file: File): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, "image/jpeg", 0.78));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function EstimateForm({ services }: { services: { value: string; label: string }[] }) {
  const t = useTranslations("form");
  const locale = useLocale() as Locale;
  const id = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, start] = useTransition();
  const [photos, setPhotos] = useState<File[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState<null | "call" | "text" | "email">(null);

  // Arriving from a service page (/contact?service=tile-installation) ticks that service.
  useEffect(() => {
    const slug = new URLSearchParams(window.location.search).get("service");
    const box = slug ? formRef.current?.querySelector<HTMLInputElement>(`input[data-slug="${CSS.escape(slug)}"]`) : null;
    if (box) box.checked = true;
  }, []);

  async function addPhotos(list: FileList | null) {
    if (!list) return;
    const next = [...photos];
    for (const f of Array.from(list)) {
      if (!f.type.startsWith("image/")) continue;
      if (next.length >= MAX_PHOTOS) {
        setMessage(t("errors.tooManyPhotos"));
        break;
      }
      next.push(await compress(f));
    }
    setPhotos(next);
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    form.delete("photos");
    photos.forEach((p) => form.append("photos", p));
    form.set("source", "contact-form");
    const method = (form.get("contact") as "call" | "text" | "email") ?? "call";
    setErrors([]);
    setMessage("");
    start(async () => {
      const res = await submitEstimate(form);
      if (res.ok) {
        track("form_submit", { form: "contact-form" });
        setSent(method);
      } else if (res.error === "validation") {
        setErrors(res.fields);
        formRef.current?.querySelector<HTMLElement>("[aria-invalid='true']")?.focus();
      } else if (res.error === "fallback") {
        track("form_submit", { form: "contact-form-mailto" });
        setMessage(t("errors.fallback"));
        window.location.href = res.mailto;
      } else {
        setMessage(t(`errors.${res.error}`));
      }
    });
  }

  if (sent) {
    const method = { call: t("prefCall"), text: t("prefText"), email: t("prefEmail") }[sent].toLowerCase();
    return (
      <div className="form form--done" role="status">
        <h2 className="h3">{t("successTitle")}</h2>
        <p>{t("success", { method })}</p>
        <button
          type="button"
          className="link"
          onClick={() => {
            setSent(null);
            setPhotos([]);
          }}
        >
          {t("another")}
        </button>
      </div>
    );
  }

  const bad = (f: string) => errors.includes(f);
  const err = (f: string, key: string) =>
    bad(f) ? (
      <p className="field__err" id={`${id}-${f}-e`}>
        {t(`errors.${key}`)}
      </p>
    ) : null;
  const opt = <span className="field__opt">({t("optional")})</span>;

  return (
    <form ref={formRef} className="form" onSubmit={onSubmit} noValidate aria-labelledby={`${id}-title`}>
      <h2 className="h3" id={`${id}-title`}>
        {t("title")}
      </h2>

      <div className="form__row">
        <div className="field">
          <label htmlFor={`${id}-name`}>{t("name")}</label>
          <input id={`${id}-name`} name="name" autoComplete="name" required aria-invalid={bad("name")} aria-describedby={bad("name") ? `${id}-name-e` : undefined} />
          {err("name", "name")}
        </div>
        <div className="field">
          <label htmlFor={`${id}-phone`}>{t("phone")}</label>
          <input id={`${id}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required aria-invalid={bad("phone")} aria-describedby={bad("phone") ? `${id}-phone-e` : undefined} />
          {err("phone", "phone")}
        </div>
      </div>

      <div className="form__row">
        <div className="field">
          <label htmlFor={`${id}-email`}>
            {t("email")} {opt}
          </label>
          <input id={`${id}-email`} name="email" type="email" autoComplete="email" aria-invalid={bad("email")} aria-describedby={bad("email") ? `${id}-email-e` : undefined} />
          {err("email", "email")}
        </div>
        <div className="field">
          <label htmlFor={`${id}-city`}>
            {t("city")} {opt}
          </label>
          <input id={`${id}-city`} name="city" autoComplete="address-level2" placeholder={t("cityPlaceholder")} />
        </div>
      </div>

      <div className="field">
        <label htmlFor={`${id}-property`}>
          {t("property")} {opt}
        </label>
        <select id={`${id}-property`} name="property" defaultValue="">
          <option value="">—</option>
          {(["house", "condo", "apartment", "commercial", "other"] as const).map((k) => (
            <option key={k} value={t(`propertyOptions.${k}`)}>
              {t(`propertyOptions.${k}`)}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="field" aria-invalid={bad("services")} aria-describedby={`${id}-services-h`}>
        <legend>{t("services")}</legend>
        <p className="field__hint" id={`${id}-services-h`}>
          {t("servicesHint")}
        </p>
        <div className="checks">
          {services.map((s) => (
            <label key={s.value} className="check">
              <input type="checkbox" name="services" value={s.label} data-slug={s.value} />
              <span>{s.label}</span>
            </label>
          ))}
        </div>
        {err("services", "service")}
      </fieldset>

      <div className="field">
        <label htmlFor={`${id}-desc`}>
          {t("description")} {opt}
        </label>
        <textarea id={`${id}-desc`} name="description" rows={5} placeholder={t("descriptionPlaceholder")} />
      </div>

      <div className="field">
        <span className="field__label" id={`${id}-photos-l`}>
          {t("photos")}
        </span>
        <p className="field__hint">{t("photosHint")}</p>
        <div className="photos">
          {photos.map((p, i) => (
            <span className="photos__item" key={`${p.name}-${i}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={URL.createObjectURL(p)} alt="" width={72} height={72} />
              <button type="button" aria-label={t("remove", { name: p.name })} onClick={() => setPhotos(photos.filter((_, j) => j !== i))}>
                <CloseIcon />
              </button>
            </span>
          ))}
          {photos.length < MAX_PHOTOS && (
            <label className="photos__add">
              <input type="file" accept="image/*" multiple className="sr" aria-labelledby={`${id}-photos-l`} onChange={(e) => { addPhotos(e.target.files); e.target.value = ""; }} />
              <span>{t("addPhotos")}</span>
            </label>
          )}
        </div>
      </div>

      <div className="form__row">
        <fieldset className="field">
          <legend>{t("contactPref")}</legend>
          <div className="segs">
            {(["call", "text", "email"] as const).map((k, i) => (
              <label key={k} className="seg">
                <input type="radio" name="contact" value={k} defaultChecked={i === 0} />
                <span>{t(k === "call" ? "prefCall" : k === "text" ? "prefText" : "prefEmail")}</span>
              </label>
            ))}
          </div>
        </fieldset>
        <fieldset className="field">
          <legend>{t("language")}</legend>
          <div className="segs">
            {(["en", "es"] as const).map((k) => (
              <label key={k} className="seg">
                <input type="radio" name="language" value={k} defaultChecked={k === locale} />
                <span>{t(k === "en" ? "english" : "spanish")}</span>
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="hp" aria-hidden="true">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <button className="btn btn--gold" disabled={pending}>
        {pending ? t("sending") : t("submit")}
      </button>
      {message && (
        <p className="field__err" role="alert">
          {message}
        </p>
      )}
      <p className="form__consent">{t("consent")}</p>
    </form>
  );
}
