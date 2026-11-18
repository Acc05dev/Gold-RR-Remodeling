"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { business, mailto, tel, sms, defaultSms } from "@/data/business";
import type { Locale } from "@/data/types";
import { PhoneIcon, TextIcon } from "./Icons";

const NAV = [
  { href: "/services", key: "services" },
  { href: "/gallery", key: "gallery" },
  { href: "/service-areas", key: "areas" },
  { href: "/about", key: "about" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const t = useTranslations();
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const burger = useRef<HTMLButtonElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Hide on the way down, return on the way up
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 24);
      document.documentElement.toggleAttribute("data-past-hero", y > window.innerHeight * 0.7);
      if (Math.abs(y - last) > 6) {
        setHidden(y > last && y > 320);
        last = y;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menu: lock scroll, Escape closes, focus moves in and back out
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (!open) return;
    document.body.style.overflow = "hidden";
    lenis?.stop();
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    const trigger = burger.current;
    return () => {
      document.body.style.overflow = "";
      lenis?.start();
      window.removeEventListener("keydown", onKey);
      trigger?.focus();
    };
  }, [open]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  const langSwitch = (
    <div className="lang" role="group" aria-label={t("nav.language")}>
      {(["en", "es"] as const).map((l) =>
        l === locale ? (
          <span key={l} aria-current="true">
            {l.toUpperCase()}
          </span>
        ) : (
          <Link key={l} href={pathname} locale={l} hrefLang={l} aria-label={`${l.toUpperCase()}: ${t("nav.switchTo")}`} onClick={() => setOpen(false)}>
            {l.toUpperCase()}
          </Link>
        ),
      )}
    </div>
  );

  return (
    <>
      <header className="site-head" data-hidden={hidden && !open} data-solid={solid}>
        <div className="topbar">
          <div className="wrap">
            <ul>
              <li>{t("topbar.location")}</li>
              <li>{t("common.license")}</li>
              <li>{t("topbar.estimates")}</li>
              <li>{t("common.seHabla")}</li>
            </ul>
            <a href={mailto} data-track="click_email" data-track-at="topbar">
              {business.email}
            </a>
          </div>
        </div>
        <div className="header">
          <div className="wrap">
            <Link href="/" className="brand" aria-label={`${business.name}, ${t("common.home")}`}>
              <Image src="/brand/logo-dark.svg" alt="" width={636} height={381} priority unoptimized />
            </Link>
            <nav className="nav" aria-label={t("nav.main")}>
              <ul>
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} aria-current={isCurrent(n.href) ? "page" : undefined}>
                      {t(`nav.${n.key}`)}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
            <div className="head-actions">
              {langSwitch}
              <a className="head-phone" href={tel} data-track="click_call" data-track-at="header">
                <PhoneIcon />
                {business.phone.display}
              </a>
              <Link href="/contact" className="btn btn--gold btn--sm head-cta" data-magnetic>
                {t("common.freeEstimate")}
              </Link>
              <button
                ref={burger}
                className="burger"
                aria-label={t("nav.menu")}
                aria-expanded={open}
                aria-controls="site-menu"
                onClick={() => setOpen(true)}
              >
                <i />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="menu" id="site-menu" data-open={open} role="dialog" aria-modal="true" aria-label={t("nav.menu")} inert={!open}>
        <div className="menu__top">
          <Image src="/brand/logo-dark.svg" alt="" width={636} height={381} unoptimized />
          <button ref={closeBtn} className="menu__close" aria-label={t("nav.closeMenu")} onClick={() => setOpen(false)} />
        </div>
        <nav aria-label={t("nav.main")}>
          {[{ href: "/", key: "home" } as const, ...NAV].map((n, i) => (
            <Link
              key={n.href}
              href={n.href}
              style={{ "--i": i } as React.CSSProperties}
              aria-current={n.href === "/" ? (pathname === "/" ? "page" : undefined) : isCurrent(n.href) ? "page" : undefined}
              onClick={() => setOpen(false)}
            >
              {n.key === "home" ? t("common.home") : t(`nav.${n.key}`)}
            </Link>
          ))}
        </nav>
        <div className="menu__foot">
          <div className="row">
            <a className="btn btn--line" href={tel} data-track="click_call" data-track-at="menu">
              <PhoneIcon />
              {t("common.call")}
            </a>
            <a className="btn btn--line" href={sms(defaultSms[locale])} data-track="click_text" data-track-at="menu">
              <TextIcon />
              {t("common.text")}
            </a>
          </div>
          <Link href="/contact" className="btn btn--gold btn--block" onClick={() => setOpen(false)}>
            {t("common.getEstimate")}
          </Link>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ fontSize: ".82rem", color: "var(--color-mute)" }}>{t("common.license")}</span>
            {langSwitch}
          </div>
        </div>
      </div>
    </>
  );
}
