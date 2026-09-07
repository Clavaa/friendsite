"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig, type StateSlug, stateSlugs } from "../../site.config";

/**
 * Coverage strip under the hero — centered selector line, then one
 * horizontal row of plan pills (scrollable, edge-faded). Each state's
 * Medicaid program is a public fact and always shows; named commercial
 * payers appear only once site.config.ts confirms credentialing. Until
 * then the row renders honest, clearly-labeled pending slots.
 */
export default function InsuranceWall() {
  const [active, setActive] = useState<StateSlug>("kansas");
  const cov = siteConfig.coverage[active];
  const stateName = siteConfig.states[active].name;

  const pill =
    "inline-flex h-[54px] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-ink/10 bg-white px-7 text-[15px] font-bold shadow-[0_1px_2px_rgba(15,58,71,0.04)]";

  return (
    <section aria-label="Insurance coverage" className="bg-cream">
      <div className="mx-auto max-w-[87rem] px-4 py-9 sm:px-6">
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 text-[15px] font-bold">
          <span>Coverage we work with in</span>
          <label className="sr-only" htmlFor="coverage-state">
            Choose your state
          </label>
          <select
            id="coverage-state"
            value={active}
            onChange={(e) => setActive(e.target.value as StateSlug)}
            className="h-10 rounded-full border border-ink/15 bg-white px-4 text-[15px] font-bold text-ink shadow-chip focus:border-brand-teal"
          >
            {stateSlugs.map((slug) => (
              <option key={slug} value={slug}>
                {siteConfig.states[slug].name}
              </option>
            ))}
          </select>
          <Link href="/insurance" className="link-grow font-bold text-ink-soft">
            How coverage works
          </Link>
        </div>

        <div className="edge-fade no-scrollbar mt-6 overflow-x-auto">
          <ul className="flex w-max items-center gap-3 px-6 pb-1 lg:mx-auto lg:justify-center">
            <li className={pill}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-meadow" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 7.5l3 3 6-7" />
              </svg>
              {cov.medicaid}
            </li>
            <li className={pill}>
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-meadow" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 7.5l3 3 6-7" />
              </svg>
              State-regulated commercial plans
              <span className="hidden font-semibold text-ink-soft xl:inline">
                — {stateName} requires ABA coverage
              </span>
            </li>
            {cov.payers.map((p) => (
              <li key={p} className={pill}>
                {p}
              </li>
            ))}
            {cov.payers.length === 0 &&
              Array.from({ length: cov.pendingSlots }).map((_, i) => (
                <li
                  key={i}
                  aria-hidden="true"
                  className="hidden h-[54px] w-32 shrink-0 rounded-full border-2 border-dashed border-line bg-white/50 lg:block"
                />
              ))}
          </ul>
        </div>

        <p className="mt-4 text-center text-[13px] text-ink-soft">
          Named in-network plans are published here as each payer&rsquo;s
          credentialing is confirmed. Not sure about yours? Send us your card —
          we check it free, usually within a business day.
        </p>
      </div>
    </section>
  );
}
