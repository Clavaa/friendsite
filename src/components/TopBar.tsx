import Link from "next/link";
import { siteConfig } from "../../site.config";

/**
 * Dark utility bar above the main nav (global chrome).
 * Left: config-gated rating pills — they render only when site.config.ts
 * carries a real score, so a new practice shows an honest quiet bar, never
 * an invented number. Center: the diagnosis triage question. Right: the
 * phone, always one tap away.
 */
export default function TopBar() {
  const ratings = siteConfig.ratings.filter((r) => r.score);

  return (
    <div className="bg-ink text-white">
      {/* Desktop / tablet row */}
      <div className="mx-auto hidden h-[54px] max-w-[87rem] items-center justify-between gap-4 px-4 sm:flex sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          {ratings.length > 0 ? (
            ratings.map((r) => (
              <span
                key={r.source}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-[10px] bg-white/10 px-3.5 py-2 text-[12.5px] font-bold leading-tight"
              >
                <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="var(--color-sun)">
                  <path d="M8 .8l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2l-4.5 2.4.9-5L.8 6.1l5-.7L8 .8Z" />
                </svg>
                Rated {r.score}/5.0 by {r.by}
                <span className="font-semibold text-white/55">on {r.source}</span>
              </span>
            ))
          ) : (
            <span className="truncate text-[12.5px] font-semibold text-white/60">
              BCBA-led ABA therapy across Kansas &amp; Colorado
            </span>
          )}
        </div>
        <Link
          href="/get-a-diagnosis"
          className="group inline-flex items-center gap-1.5 whitespace-nowrap text-[14px] font-bold underline decoration-white/70 decoration-2 underline-offset-[5px] transition-colors hover:decoration-sun"
        >
          Not sure if it&rsquo;s autism? Start here
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </Link>
        <a
          href={siteConfig.phoneHref}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white/10 px-4 py-2 text-[13px] font-bold transition-colors hover:bg-white/20"
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.7 1.3a1 1 0 0 1 1.1.3l1.7 2.1a1 1 0 0 1 0 1.3L5.4 6.2a9.6 9.6 0 0 0 4.4 4.4l1.2-1.1a1 1 0 0 1 1.3 0l2.1 1.7a1 1 0 0 1 .2 1.4l-1 1.4a2 2 0 0 1-2.2.7C7.6 13.5 2.5 8.4 1.3 4.6a2 2 0 0 1 .7-2.2l1.7-1Z" />
          </svg>
          {siteConfig.phone}
        </a>
      </div>

      {/* Mobile: ratings row (when real) + full-width call pill */}
      <div className="px-4 pb-2.5 pt-2 sm:hidden">
        {ratings.length > 0 && (
          <div className="mb-2 flex justify-center gap-2">
            {ratings.map((r) => (
              <span
                key={r.source}
                className="inline-flex items-center gap-1 rounded-[8px] bg-white/10 px-2.5 py-1 text-[11px] font-bold"
              >
                <svg aria-hidden="true" width="10" height="10" viewBox="0 0 16 16" fill="var(--color-sun)">
                  <path d="M8 .8l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2l-4.5 2.4.9-5L.8 6.1l5-.7L8 .8Z" />
                </svg>
                {r.score} {r.source}
              </span>
            ))}
          </div>
        )}
        <a
          href={siteConfig.phoneHref}
          className="mx-auto flex max-w-xs items-center justify-center gap-2 rounded-full bg-brand-teal px-4 py-2 text-[14px] font-bold text-white"
        >
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.7 1.3a1 1 0 0 1 1.1.3l1.7 2.1a1 1 0 0 1 0 1.3L5.4 6.2a9.6 9.6 0 0 0 4.4 4.4l1.2-1.1a1 1 0 0 1 1.3 0l2.1 1.7a1 1 0 0 1 .2 1.4l-1 1.4a2 2 0 0 1-2.2.7C7.6 13.5 2.5 8.4 1.3 4.6a2 2 0 0 1 .7-2.2l1.7-1Z" />
          </svg>
          {siteConfig.phone}
        </a>
      </div>
    </div>
  );
}
