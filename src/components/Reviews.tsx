import Carousel from "./Carousel";
import { siteConfig } from "../../site.config";

function Stars({ muted = false }: { muted?: boolean }) {
  return (
    <div className={`flex gap-1 ${muted ? "text-line" : "text-sun"}`} aria-hidden={muted} aria-label={muted ? undefined : "5 out of 5 stars"}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} aria-hidden="true" width="18" height="18" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 .8l2.2 4.6 5 .7-3.6 3.5.9 5L8 12.2l-4.5 2.4.9-5L.8 6.1l5-.7L8 .8Z" />
        </svg>
      ))}
    </div>
  );
}

/**
 * Named review section: micro-label, giant display headline, then a
 * horizontal card carousel with round prev/next arrows and a consent
 * footnote. Renders real, consented, named + dated reviews from
 * site.config once they exist; until then, clearly-labeled pending
 * slots. This site never invents testimonials.
 */
export default function Reviews() {
  const real = siteConfig.reviews.filter((r) => r.quote);
  const cardBase =
    "flex w-[85vw] max-w-[400px] shrink-0 snap-start flex-col rounded-3xl p-8";

  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-[87rem] px-4 pb-12 pt-28 sm:px-6">
        <div className="reveal mx-auto text-center">
          <p className="text-[17px] font-extrabold uppercase tracking-[0.14em] text-ink">
            Why families choose Sunbird
          </p>
          <h2 className="font-display display-hero mx-auto mt-8 max-w-[72rem] text-[2.6rem] text-brand-teal sm:text-6xl lg:text-[4.75rem]">
            What parents tell us,{" "}
            <span className="italic">in their own words.</span>
          </h2>
        </div>

        <Carousel
          ariaLabel="Parent reviews"
          step={424}
          className="mt-14"
          trackClassName="-mx-4 px-4 pb-2 sm:-mx-6 sm:px-6"
        >
          {real.length > 0
            ? real.map((r) => (
                <article key={`${r.author}-${r.date}`} className={`${cardBase} bg-white shadow-card`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-[1.35rem] leading-tight">{r.author}</p>
                      <p className="mt-1.5 text-[13px] font-bold text-ink-soft">
                        {r.city} · {r.date}
                      </p>
                    </div>
                    <span className="rounded-full bg-cream px-3 py-1 text-[11px] font-bold text-ink-soft">
                      Google
                    </span>
                  </div>
                  <div className="mt-4">
                    <Stars />
                  </div>
                  <blockquote className="mt-4 flex-1 text-[16px] leading-relaxed text-ink-soft">
                    &ldquo;{r.quote}&rdquo;
                  </blockquote>
                </article>
              ))
            : /* Pending slots — swap in automatically once site.config.ts
                 reviews[] carries real consented Google reviews. */
              [0, 1, 2, 3].map((i) => (
                <div key={i} className={`${cardBase} border-2 border-dashed border-line bg-white/60`}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-display text-[1.35rem] leading-tight text-ink-soft/60">
                        A family near you
                      </p>
                      <p className="mt-1.5 text-[13px] font-bold text-ink-soft/50">
                        Name &amp; date appear with consent
                      </p>
                    </div>
                    <span className="rounded-full bg-cream px-3 py-1 text-[11px] font-bold text-ink-soft/50">
                      Google
                    </span>
                  </div>
                  <div className="mt-4">
                    <Stars muted />
                  </div>
                  <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink-soft/70">
                    This spot is reserved for a real, consented Google review.
                    We&rsquo;d rather show you an empty card today than a
                    made-up quote — ask us for references instead.
                  </p>
                </div>
              ))}
        </Carousel>

        <p className="mt-6 text-center text-[13px] text-ink-soft">
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
