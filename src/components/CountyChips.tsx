"use client";

import Link from "next/link";
import { useState } from "react";

/**
 * County chip wall for the state pages, collapsed by design (client
 * feedback 9/2026: the full 105/64-chip wall read as overwhelming).
 *
 * - The ~12 most populous counties show as chips; the rest sit behind an
 *   accessible "Show all N counties" toggle (aria-expanded button).
 * - SEO: EVERY county link is server-rendered in the HTML — the collapsed
 *   tail is hidden with the `hidden` attribute, not omitted — and every
 *   county page stays in the sitemap. Do not "optimize" this into
 *   conditional rendering or crawlers lose the links.
 * - County pages themselves are unchanged.
 */

const VISIBLE_COUNT = 12;

export interface CountyChip {
  slug: string;
  full: string;
  pop: number;
}

export default function CountyChips({
  state,
  counties,
}: {
  state: string;
  counties: CountyChip[];
}) {
  const [open, setOpen] = useState(false);

  // Top counties by population, but displayed in the list's original
  // (alphabetical) order so the wall stays scannable.
  const topSlugs = new Set(
    [...counties]
      .sort((a, b) => b.pop - a.pop)
      .slice(0, VISIBLE_COUNT)
      .map((c) => c.slug)
  );

  const chipClass =
    "inline-block rounded-full border border-line bg-cream px-3.5 py-1.5 text-[14px] font-semibold text-ink-soft transition-colors hover:border-brand-teal hover:text-brand-teal";

  return (
    <ul className="mt-8 flex flex-wrap gap-2">
      {counties.map((county) => (
        <li key={county.slug} hidden={!open && !topSlugs.has(county.slug)}>
          <Link href={`/${state}/${county.slug}`} className={chipClass}>
            {county.full}
          </Link>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          className="inline-flex items-center gap-1.5 rounded-full border border-brand-teal/50 bg-white px-4 py-1.5 text-[14px] font-bold text-brand-teal transition-colors hover:border-brand-teal hover:bg-mint-wash"
        >
          {open
            ? "Show fewer counties"
            : `Show all ${counties.length} counties`}
          <svg
            aria-hidden="true"
            width="11"
            height="11"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M2.5 4.5L6 8l3.5-3.5" />
          </svg>
        </button>
      </li>
    </ul>
  );
}
