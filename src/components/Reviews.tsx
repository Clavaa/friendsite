import { siteConfig } from "../../site.config";

/**
 * Google review section. Renders real, consented, named + dated reviews
 * from site.config once they exist. Until then it shows an honest
 * placeholder state — this site never invents testimonials.
 */
export default function Reviews() {
  const real = siteConfig.reviews.filter((r) => r.quote);

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl sm:text-4xl">
          What families say on Google
        </h2>
        <p className="mt-3 text-ink-soft">
          Real reviews from real families, shared with permission and shown
          with names and dates.
        </p>
      </div>

      {real.length > 0 ? (
        <ul className="mt-8 grid gap-4 md:grid-cols-3">
          {real.map((r) => (
            <li
              key={`${r.author}-${r.date}`}
              className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-card"
            >
              <div className="flex gap-0.5 text-sun" aria-label="5 out of 5 stars">
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .8l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2l-4.5 2.4.9-5L.8 6.1l5-.7L8 .8Z" />
                  </svg>
                ))}
              </div>
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <footer className="mt-4 text-sm font-semibold text-ink-soft">
                {r.author} · {r.city} · {r.date}
              </footer>
            </li>
          ))}
        </ul>
      ) : (
        /* Placeholder state — swaps out automatically once site.config.ts
           reviews[] carries real consented Google reviews (marked TODO). */
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-dashed border-line bg-white/60 p-6"
            >
              <div className="flex gap-0.5 text-line" aria-hidden="true">
                {Array.from({ length: 5 }).map((_, j) => (
                  <svg key={j} width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 .8l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2l-4.5 2.4.9-5L.8 6.1l5-.7L8 .8Z" />
                  </svg>
                ))}
              </div>
              <p className="mt-3 text-[13px] font-semibold tracking-wide text-ink-soft/60">
                Review slot
              </p>
              <p className="mt-1 text-[14px] leading-snug text-ink-soft/70">
                Reserved for a real, consented Google review — named and dated.
                Configured in site.config.ts.
              </p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 text-sm text-ink-soft">
        Reviews are published with each family&rsquo;s written consent.
        {siteConfig.googleReviewUrl ? (
          <>
            {" "}
            <a
              href={siteConfig.googleReviewUrl}
              className="font-bold text-brand-teal hover:underline"
              rel="noopener noreferrer"
              target="_blank"
            >
              Read all our Google reviews
            </a>
            .
          </>
        ) : null}
      </p>
    </section>
  );
}
