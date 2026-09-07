import { siteConfig } from "../../site.config";

function Stars({ muted = false }: { muted?: boolean }) {
  return (
    <div className={`flex gap-0.5 ${muted ? "text-line" : "text-sun"}`} aria-hidden={muted} aria-label={muted ? undefined : "5 out of 5 stars"}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} aria-hidden="true" width="17" height="17" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 .8l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2l-4.5 2.4.9-5L.8 6.1l5-.7L8 .8Z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Named review section. Renders real, consented, named + dated reviews
 * from site.config once they exist; until then, clearly-labeled pending
 * slots. This site never invents testimonials.
 */
export default function Reviews() {
  const real = siteConfig.reviews.filter((r) => r.quote);

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-[13px] font-bold tracking-[0.18em] text-ink">
            Why families choose Sunbird
          </p>
          <h2 className="font-display mt-4 text-4xl text-brand-teal sm:text-5xl lg:text-6xl">
            What parents tell us, in their own words.
          </h2>
        </div>

        {real.length > 0 ? (
          <ul className="mt-12 grid gap-5 md:grid-cols-3">
            {real.map((r) => (
              <li
                key={`${r.author}-${r.date}`}
                className="flex h-full flex-col rounded-[2rem] bg-white p-7 shadow-card"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg leading-tight">{r.author}</p>
                    <p className="mt-1 text-[12px] font-bold tracking-wide text-ink-soft">
                      {r.city} · {r.date}
                    </p>
                  </div>
                  <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-ink-soft">
                    Google
                  </span>
                </div>
                <div className="mt-3">
                  <Stars />
                </div>
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
                  &ldquo;{r.quote}&rdquo;
                </blockquote>
              </li>
            ))}
          </ul>
        ) : (
          /* Pending slots — swap in automatically once site.config.ts
             reviews[] carries real consented Google reviews. */
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="flex h-full flex-col rounded-[2rem] border-2 border-dashed border-line bg-white/60 p-7"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-display text-lg leading-tight text-ink-soft/60">
                      A family near you
                    </p>
                    <p className="mt-1 text-[12px] font-bold tracking-wide text-ink-soft/50">
                      Name &amp; date appear with consent
                    </p>
                  </div>
                  <span className="rounded-full bg-cream px-2.5 py-1 text-[11px] font-bold text-ink-soft/50">
                    Google
                  </span>
                </div>
                <div className="mt-3">
                  <Stars muted />
                </div>
                <p className="mt-3 flex-1 text-[14px] leading-relaxed text-ink-soft/70">
                  This spot is reserved for a real, consented Google review.
                  We&rsquo;d rather show you an empty card today than a
                  made-up quote — ask us for references instead.
                </p>
              </div>
            ))}
          </div>
        )}

        <p className="mt-8 text-center text-[13px] text-ink-soft">
          Reviews are published with each family&rsquo;s written consent, with
          real names and dates.
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
      </div>
    </section>
  );
}
