import Link from "next/link";
import { siteConfig, stateSlugs } from "../../../site.config";
import { CITY_SERVICES } from "../../lib/metro";

/**
 * "Find ABA near you" block for guides and parent-question pages: links the
 * 10 team cities plus a rotating city×service page per city, so the
 * articles Google trusts most pass authority down to the local pages.
 */
export default function FindNearYou({ seed = 0 }: { seed?: number }) {
  return (
    <section className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl">Find ABA therapy near you</h2>
        <p className="mt-2 max-w-3xl text-[15px] text-ink-soft">
          Our teams serve every county in Kansas and Colorado. Start with the city closest to you:
        </p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {stateSlugs.map((st) => (
            <div key={st}>
              <Link href={`/${st}`} className="font-bold text-brand-teal hover:underline">
                ABA therapy in {siteConfig.states[st].name} →
              </Link>
              <ul className="mt-3 space-y-1.5 text-[15px]">
                {siteConfig.states[st].cities.map((c, i) => {
                  const svc = CITY_SERVICES[(seed + i) % CITY_SERVICES.length];
                  return (
                    <li key={c.slug}>
                      <Link href={`/${st}/${c.slug}`} className="font-semibold hover:text-brand-teal hover:underline">
                        {c.name}
                      </Link>
                      <span className="text-ink-soft"> · </span>
                      <Link href={`/${st}/${c.slug}/${svc.slug}`} className="text-ink-soft hover:text-brand-teal hover:underline">
                        {svc.label.charAt(0).toLowerCase() + svc.label.slice(1)}
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <Link href={`/${st}/schools`} className="text-ink-soft hover:text-brand-teal hover:underline">
                    School districts in {siteConfig.states[st].name}
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
