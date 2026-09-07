import { siteConfig } from "../../site.config";

/**
 * Slim dark-petrol stat band under the hero (butter-yellow figures).
 * Values come from site.config only — anything unconfigured renders as a
 * clearly-labeled pending slot rather than a fabricated number.
 */
export default function StatBand() {
  const stats = siteConfig.stats;

  return (
    <section aria-label="About our practice" className="bg-ink text-white">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-6 px-4 py-8 sm:px-6 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            {stat.value ? (
              <>
                <p className="font-display text-3xl text-sun sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-white/75">
                  {stat.label}
                </p>
              </>
            ) : (
              /* Unpublished stat: honest pending state, never a made-up figure.
                 Fill the value in site.config.ts to activate this slot. */
              <>
                <p
                  className="font-display text-3xl text-white/25 sm:text-4xl"
                  aria-hidden="true"
                >
                  —
                </p>
                <p className="mt-1 text-sm font-semibold text-white/40">
                  {stat.label}
                  <span className="sr-only"> (figure coming soon)</span>
                </p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
