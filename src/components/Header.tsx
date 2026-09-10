"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { siteConfig } from "../../site.config";

/**
 * Header nav, redesigned for breathing room.
 *
 * Rules that keep it from ever squishing again:
 * - Six top-level items max (Careers added per the client); everything
 *   else lives in the footer.
 * - Locations is a single dropdown holding both states + their cities,
 *   so adding a state or city never adds a top-level item.
 * - Every nav label, the phone, and the CTA pill are whitespace-nowrap —
 *   wrapping was the original bug.
 * - The phone number renders as text only at xl (1280px+); from lg to xl
 *   it collapses to a round phone-icon button so the CTA never gets
 *   squeezed at 1024px.
 */

const primaryNav = [
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
];

const secondaryNav = [
  { href: "/insurance", label: "Insurance" },
  { href: "/careers", label: "Careers" },
];

/** The Resources dropdown: the parent-help library + its sibling funnels.
 *  Keeps the header at six top-level items (its hard rule) while giving
 *  the guides a front-door. */
const resourcesNav = [
  {
    href: "/resources",
    label: "Parent guides",
    blurb: "Plain-words guides, from “what is ABA” to your first session",
  },
  {
    href: "/questions",
    label: "Parent questions",
    blurb: "Straight answers to the questions families call us with",
  },
  {
    href: "/get-a-diagnosis",
    label: "Get a diagnosis",
    blurb: "Does my child have autism? Evaluation help, state by state",
  },
];

const locationGroups = [
  { state: siteConfig.states.kansas, href: "/kansas" },
  { state: siteConfig.states.colorado, href: "/colorado" },
] as const;

function PhoneIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

export default function Header() {
  const [open, setOpen] = useState(false);
  const [locationsOpen, setLocationsOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const locationsRef = useRef<HTMLDivElement>(null);
  const resourcesRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

  // Close all menus on navigation.
  useEffect(() => {
    setOpen(false);
    setLocationsOpen(false);
    setResourcesOpen(false);
  }, [pathname]);

  // Close open dropdowns on outside click or Escape.
  useEffect(() => {
    if (!locationsOpen && !resourcesOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!locationsRef.current?.contains(e.target as Node)) {
        setLocationsOpen(false);
      }
      if (!resourcesRef.current?.contains(e.target as Node)) {
        setResourcesOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setLocationsOpen(false);
        setResourcesOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [locationsOpen, resourcesOpen]);

  const navLinkClass =
    "whitespace-nowrap rounded-lg px-2.5 py-2 text-[16px] font-bold text-ink transition-colors hover:bg-sun-wash xl:px-3.5";

  return (
    <header className="sticky top-0 z-40 bg-white shadow-[0_1px_0_rgba(15,58,71,0.06)]">
      <div className="mx-auto flex h-[76px] max-w-[87rem] items-center justify-between gap-3 px-4 sm:px-6 lg:h-[96px]">
        <Link
          href="/"
          className="flex shrink-0 items-center"
          aria-label={`${siteConfig.brandName} — home`}
        >
          {/* Real Sunbird lockup: line-drawn sunbird mark + wordmark (public/brand/) */}
          <Logo />
        </Link>

        <nav className="hidden items-center lg:flex" aria-label="Main">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}

          {/* Locations dropdown — both states + their city pages */}
          <div ref={locationsRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setLocationsOpen(!locationsOpen);
                setResourcesOpen(false);
              }}
              aria-expanded={locationsOpen}
              aria-haspopup="true"
              className={`${navLinkClass} flex items-center gap-1 ${
                locationsOpen ? "bg-sun-wash text-ink" : ""
              }`}
            >
              Locations
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${locationsOpen ? "rotate-180" : ""}`}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" />
              </svg>
            </button>

            {locationsOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-[30rem] -translate-x-1/2 rounded-3xl border border-line bg-white p-6 shadow-card-lg">
                <div className="grid grid-cols-2 gap-6">
                  {locationGroups.map(({ state, href }) => (
                    <div key={href}>
                      <Link
                        href={href}
                        className="font-display block text-lg text-ink hover:text-brand-teal"
                      >
                        {state.name}
                      </Link>
                      <ul className="mt-3 space-y-1">
                        {state.cities.map((city) => (
                          <li key={city.slug}>
                            <Link
                              href={`${href}/${city.slug}`}
                              className="block rounded-lg px-2 py-1 text-[15px] font-semibold text-ink-soft hover:bg-sun-wash hover:text-ink"
                            >
                              {city.name}
                              {"displaySuffix" in city && city.displaySuffix
                                ? `, ${city.displaySuffix}`
                                : ""}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link
                        href={href}
                        className="mt-2 inline-block px-2 text-[14px] font-bold text-brand-teal hover:underline"
                      >
                        All of {state.name} →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Resources dropdown — parent guides, questions, diagnosis help */}
          <div ref={resourcesRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setResourcesOpen(!resourcesOpen);
                setLocationsOpen(false);
              }}
              aria-expanded={resourcesOpen}
              aria-haspopup="true"
              className={`${navLinkClass} flex items-center gap-1 ${
                resourcesOpen ? "bg-sun-wash text-ink" : ""
              }`}
            >
              Resources
              <svg
                aria-hidden="true"
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform ${resourcesOpen ? "rotate-180" : ""}`}
              >
                <path d="M2.5 4.5L6 8l3.5-3.5" />
              </svg>
            </button>

            {resourcesOpen && (
              <div className="absolute left-1/2 top-full z-50 mt-2 w-[24rem] -translate-x-1/2 rounded-3xl border border-line bg-white p-4 shadow-card-lg">
                <ul className="space-y-1">
                  {resourcesNav.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="block rounded-2xl px-4 py-3 hover:bg-sun-wash"
                      >
                        <span className="font-display block text-[1.05rem] text-ink">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-[13.5px] leading-snug text-ink-soft">
                          {item.blurb}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {secondaryNav.map((item) => (
            <Link key={item.href} href={item.href} className={navLinkClass}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {/* Phone: full number at xl+, icon-only from lg to xl so nothing squeezes at 1024. */}
          <a
            href={siteConfig.phoneHref}
            className="hidden whitespace-nowrap rounded-full border border-line px-4 py-2 text-[15px] font-bold text-brand-teal transition-colors hover:border-brand-teal xl:inline-block"
          >
            {siteConfig.phone}
          </a>
          <a
            href={siteConfig.phoneHref}
            aria-label={`Call ${siteConfig.phone}`}
            title={`Call ${siteConfig.phone}`}
            className="hidden h-10 w-10 place-items-center rounded-full border border-line text-brand-teal transition-colors hover:border-brand-teal lg:grid xl:hidden"
          >
            <PhoneIcon />
          </a>
          <Link
            href="/getting-started"
            className="btn-pill hidden h-11 items-center gap-2 whitespace-nowrap rounded-full bg-brand-teal px-6 text-[15px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep sm:inline-flex"
          >
            Get started
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 3l5 5-5 5" />
            </svg>
          </Link>
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="mobile-nav"
            className="grid h-10 w-10 place-items-center rounded-lg border border-line lg:hidden"
          >
            <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
            <svg
              aria-hidden="true"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-line bg-white px-4 pb-6 pt-2 lg:hidden"
        >
          {[...primaryNav, ...secondaryNav].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-sun-wash"
            >
              {item.label}
            </Link>
          ))}

          <p className="mt-3 px-3 text-[13px] font-bold tracking-wide text-ink-soft">
            Resources
          </p>
          <div className="mt-1">
            {resourcesNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2 text-base font-semibold text-ink hover:bg-sun-wash"
              >
                {item.label}
              </Link>
            ))}
          </div>

          <p className="mt-3 px-3 text-[13px] font-bold tracking-wide text-ink-soft">
            Locations
          </p>
          <div className="mt-1 grid grid-cols-2 gap-x-2">
            {locationGroups.map(({ state, href }) => (
              <div key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-2 text-base font-bold text-ink hover:bg-sun-wash"
                >
                  {state.name}
                </Link>
                {state.cities.map((city) => (
                  <Link
                    key={city.slug}
                    href={`${href}/${city.slug}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-lg px-3 py-1.5 text-[15px] font-semibold text-ink-soft hover:bg-sun-wash"
                  >
                    {city.name}
                  </Link>
                ))}
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-2.5 border-t border-line pt-4">
            <Link
              href="/getting-started"
              onClick={() => setOpen(false)}
              className="block rounded-full bg-brand-teal px-4 py-3 text-center text-base font-bold text-white"
            >
              Get started
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="block rounded-full border border-line px-4 py-3 text-center text-base font-bold text-brand-teal"
            >
              Call {siteConfig.phone}
            </a>
          </div>
        </nav>
      )}
    </header>
  );
}
