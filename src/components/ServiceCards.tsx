import Link from "next/link";
import { services } from "../data/services";

/**
 * Tinted service-card stack (Style Bible signature component #3):
 * each service sits on its own pastel wash with an arrow affordance.
 */
export default function ServiceCards() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl">
            Therapy shaped around your child&rsquo;s week
          </h2>
          <p className="mt-3 text-ink-soft">
            Home, daycare, video — and our centers coming soon. The setting
            serves the plan, never the other way around, and many families
            mix more than one.
          </p>
        </div>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug} className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}>
              <Link
                href={`/services/${s.slug}`}
                className={`group flex h-full flex-col justify-between rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-card-lg ${s.tintClass}`}
              >
                <div>
                  <h3 className="font-display flex flex-wrap items-center gap-2.5 text-2xl">
                    {s.cardTitle}
                    {s.comingSoon && (
                      <span className="font-sans rounded-full bg-white px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.08em] text-brand-teal shadow-chip">
                        Coming soon
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {s.cardBlurb}
                  </p>
                </div>
                <span className="mt-6 inline-flex items-center gap-2 text-[15px] font-bold text-ink">
                  Explore {s.nameLower}
                  <span
                    aria-hidden="true"
                    className="grid h-8 w-8 place-items-center rounded-full bg-white text-brand-teal shadow-chip transition-transform group-hover:translate-x-1"
                  >
                    <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 8h10M9 4l4 4-4 4" />
                    </svg>
                  </span>
                </span>
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/getting-started"
              className="group flex h-full min-h-44 flex-col justify-between rounded-3xl border-2 border-dashed border-brand-teal/30 bg-cream p-6 transition-colors hover:border-brand-teal/60"
            >
              <div>
                <h3 className="font-display text-2xl">Not sure which fits?</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  That&rsquo;s normal — most families aren&rsquo;t. Your BCBA
                  recommends a setting after meeting your child, and you decide.
                </p>
              </div>
              <span className="mt-6 text-[15px] font-bold text-brand-teal">
                Help me choose →
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </section>
  );
}
