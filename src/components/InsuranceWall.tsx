"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig, type StateSlug, stateSlugs } from "../../site.config";

/**
 * Coverage wall under the hero — a state selector plus a row of plan pills.
 * Each state's Medicaid program is a public fact and always shows; named
 * commercial payers appear only once site.config.ts confirms credentialing.
 * Until then the wall renders honest, clearly-labeled pending slots.
 */
export default function InsuranceWall() {
  const [active, setActive] = useState<StateSlug>("kansas");
  const cov = siteConfig.coverage[active];
  const stateName = siteConfig.states[active].name;

  return (
    <section aria-label="Insurance coverage" className="border-b border-line/60 bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-[15px] font-bold">
          <span>Coverage we work with in</span>
          <label className="sr-only" htmlFor="coverage-state">
            Choose your state
          </label>
          <select
            id="coverage-state"
            value={active}
            onChange={(e) => setActive(e.target.value as StateSlug)}
            className="rounded-full border border-line bg-white px-4 py-1.5 text-[15px] font-bold text-ink shadow-chip focus:border-brand-teal"
          >
            {stateSlugs.map((slug) => (
              <option key={slug} value={slug}>
                {siteConfig.states[slug].name}
              </option>
            ))}
          </select>
          <Link
            href="/insurance"
            className="font-bold text-brand-teal underline decoration-2 underline-offset-4 hover:text-brand-teal-deep"
          >
            How coverage works
          </Link>
        </div>

        <ul className="mt-5 flex flex-wrap items-stretch justify-center gap-2.5">
          <li className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-bold">
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 14 14" fill="none" className="text-meadow" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7.5l3 3 6-7" />
            </svg>
            {cov.medicaid}
          </li>
          <li className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-bold">
            <svg aria-hidden="true" width="13" height="13" viewBox="0 0 14 14" fill="none" className="text-meadow" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2.5 7.5l3 3 6-7" />
            </svg>
            State-regulated commercial plans
            <span className="hidden font-semibold text-ink-soft sm:inline">
              — {stateName} requires ABA coverage
            </span>
          </li>
          {cov.payers.map((p) => (
            <li
              key={p}
              className="inline-flex items-center rounded-full border border-line bg-white px-4 py-2 text-[14px] font-bold"
            >
              {p}
            </li>
          ))}
          {cov.payers.length === 0 &&
            Array.from({ length: cov.pendingSlots }).map((_, i) => (
              <li
                key={i}
                aria-hidden="true"
                className="hidden w-28 rounded-full border-2 border-dashed border-line bg-white/50 lg:block"
              />
            ))}
        </ul>

        <p className="mt-4 text-center text-[13px] text-ink-soft">
          Named in-network plans are published here as each payer&rsquo;s
          credentialing is confirmed. Not sure about yours? Send us your card —
          we check it free, usually within a business day.
        </p>
      </div>
    </section>
  );
}
