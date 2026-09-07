"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig, type StateSlug } from "../../site.config";

/**
 * KS/CO toggle locator with city chips (Style Bible signature component #5)
 * — the "clinicians who live here" local trust story.
 */
export default function Locator() {
  const [active, setActive] = useState<StateSlug>("kansas");
  const state = siteConfig.states[active];

  return (
    <section className="bg-sun-wash">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl">
            Care from clinicians who live here
          </h2>
          <p className="mt-3 text-ink-soft">
            Two states, one local team. Pick your state to see the metro areas
            we serve — and if your town isn&rsquo;t listed, ask us anyway.
            Service areas grow around families, not the other way.
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Choose your state"
          className="mt-8 inline-flex rounded-full bg-white p-1.5 shadow-card"
        >
          {(Object.keys(siteConfig.states) as StateSlug[]).map((slug) => {
            const s = siteConfig.states[slug];
            const selected = active === slug;
            return (
              <button
                key={slug}
                role="tab"
                id={`locator-tab-${slug}`}
                aria-selected={selected}
                aria-controls={`locator-panel-${slug}`}
                onClick={() => setActive(slug)}
                className={`rounded-full px-6 py-2.5 text-[15px] font-bold transition-colors ${
                  selected
                    ? "bg-ink text-white"
                    : "text-ink-soft hover:text-ink"
                }`}
              >
                {s.name}
              </button>
            );
          })}
        </div>

        <div
          role="tabpanel"
          id={`locator-panel-${active}`}
          aria-labelledby={`locator-tab-${active}`}
          className="mt-6 rounded-3xl bg-white p-6 shadow-card sm:p-8"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h3 className="font-display text-2xl">
              ABA therapy across {state.name}
            </h3>
            <Link
              href={`/${state.slug}`}
              className="text-[15px] font-bold text-brand-teal hover:underline"
            >
              {state.name} coverage guide →
            </Link>
          </div>
          <ul className="mt-5 flex flex-wrap gap-2.5">
            {state.cities.map((city) => (
              <li key={city.slug}>
                <Link
                  href={`/${state.slug}/${city.slug}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-line bg-cream px-4 py-2.5 text-[15px] font-semibold text-ink transition-colors hover:border-brand-teal hover:bg-white hover:text-brand-teal"
                >
                  <svg
                    aria-hidden="true"
                    width="13"
                    height="13"
                    viewBox="0 0 13 13"
                    fill="currentColor"
                    className="text-brand-teal"
                  >
                    <path d="M6.5 0a4.7 4.7 0 0 1 4.7 4.7c0 3.2-4.7 8.3-4.7 8.3S1.8 7.9 1.8 4.7A4.7 4.7 0 0 1 6.5 0Zm0 6.3a1.7 1.7 0 1 0 0-3.3 1.7 1.7 0 0 0 0 3.3Z" />
                  </svg>
                  {city.name}
                  {"displaySuffix" in city && city.displaySuffix
                    ? `, ${city.displaySuffix}`
                    : ""}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[15px] text-ink-soft">
            Not seeing your area? In-home coverage reaches beyond these metros,
            and telehealth reaches everywhere in {state.name}.{" "}
            <a
              href={siteConfig.phoneHref}
              className="font-bold text-brand-teal hover:underline"
            >
              Call {siteConfig.phone}
            </a>{" "}
            and ask.
          </p>
        </div>
      </div>
    </section>
  );
}
