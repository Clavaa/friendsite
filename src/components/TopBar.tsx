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
      <div className="mx-auto hidden h-11 max-w-7xl items-center justify-between gap-4 px-4 sm:flex sm:px-6">
        <div className="flex min-w-0 items-center gap-2">
          {ratings.length > 0 ? (
            ratings.map((r) => (
              <span
                key={r.source}
                className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-white/10 px-3 py-1 text-[12px] font-bold"
              >
                <svg aria-hidden="true" width="11" height="11" viewBox="0 0 16 16" fill="var(--color-sun)">
                  <path d="M8 .8l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2l-4.5 2.4.9-5L.8 6.1l5-.7L8 .8Z" />
                </svg>
                {r.score} on {r.source}
                <span className="font-semibold text-white/60">by {r.by}</span>
              </span>
            ))
          ) : (
            <span className="truncate text-[12px] font-semibold text-white/60">
              BCBA-led ABA therapy across Kansas &amp; Colorado
            </span>
          )}
        </div>
        <Link
          href="/get-a-diagnosis"
          className="whitespace-nowrap text-[13px] font-bold underline decoration-sun decoration-2 underline-offset-4 hover:text-sun"
        >
          Does my child have autism? &rarr;
        </Link>
        <a
          href={siteConfig.phoneHref}
          className="inline-flex items-center gap-2 whitespace-nowrap rounded-full bg-white/10 px-3.5 py-1 text-[13px] font-bold transition-colors hover:bg-white/20"
        >
          <svg aria-hidden="true" width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
            <path d="M3.7 1.3a1 1 0 0 1 1.1.3l1.7 2.1a1 1 0 0 1 0 1.3L5.4 6.2a9.6 9.6 0 0 0 4.4 4.4l1.2-1.1a1 1 0 0 1 1.3 0l2.1 1.7a1 1 0 0 1 .2 1.4l-1 1.4a2 2 0 0 1-2.2.7C7.6 13.5 2.5 8.4 1.3 4.6a2 2 0 0 1 .7-2.2l1.7-1Z" />
          </svg>
          Call us any time — {siteConfig.phone}
        </a>
      </div>

      {/* Mobile: ratings row (when real) + full-width call pill */}
      <div className="px-4 pb-2.5 pt-2 sm:hidden">
        {ratings.length > 0 && (
          <div className="mb-2 flex justify-center gap-2">
            {ratings.map((r) => (
              <span
                key={r.source}
                className="inline-flex items-center gap-1 rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-bold"
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
          Tap to call — {siteConfig.phone}
        </a>
      </div>
    </div>
  );
}
