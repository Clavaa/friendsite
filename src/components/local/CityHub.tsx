import Link from "next/link";
import type { StateSlug } from "../../../site.config";
import { fmt } from "../../lib/local";
import { CITY_SERVICES, cityJobsFor, cityZips } from "../../lib/metro";

/**
 * Team-city hub blocks: the ZIP-by-ZIP table (every ZIP area page, with its
 * neighborhoods and child count), the city×service cards and the city job
 * links. Together they make /{state}/{city} the root of the big-city link
 * graph.
 */

const SERVICE_BLURB: Record<string, string> = {
  "in-home-aba-therapy": "One-on-one sessions at your kitchen table, with a BCBA-led plan and parent coaching.",
  "autism-evaluation": "Signs to watch for, who diagnoses, and how we help you get an evaluation booked.",
  "daycare-aba": "Sessions inside your child's normal daycare day, with teacher teamwork.",
  "parent-training": "BCBA coaching for mornings, meals and meltdowns — at home or by video.",
};

export function CityServiceCards({ state, city }: { state: StateSlug; city: { name: string; slug: string } }) {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl">ABA services in {city.name}</h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {CITY_SERVICES.map((s) => (
            <li key={s.slug}>
              <Link
                href={`/${state}/${city.slug}/${s.slug}`}
                className="block h-full rounded-3xl bg-cream p-6 transition-shadow hover:shadow-card-lg"
              >
                <span className="font-display text-xl text-brand-teal">
                  {s.label} in {city.name} →
                </span>
                <span className="mt-2 block text-[15px] leading-relaxed text-ink-soft">{SERVICE_BLURB[s.slug]}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CityZipTable({ state, city }: { state: StateSlug; city: { name: string; slug: string } }) {
  const rows = cityZips(state, city.slug).sort((a, b) => a[0].localeCompare(b[0]));
  if (!rows.length) return null;
  return (
    <section id="zip-codes" className="bg-cream">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="font-display text-2xl sm:text-3xl">ABA therapy by ZIP code in {city.name}</h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          Our {city.name} team serves every one of these ZIP codes. Each has its own page with local
          numbers, neighborhoods and nearby ZIPs.
        </p>
        <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-card">
          <table className="w-full min-w-[520px] text-left text-[15px]">
            <thead className="border-b border-line text-[13px] uppercase tracking-wide text-ink-soft">
              <tr>
                <th scope="col" className="px-4 py-3">ZIP code</th>
                <th scope="col" className="px-4 py-3">Neighborhoods</th>
                <th scope="col" className="px-4 py-3 text-right">Kids under 18</th>
              </tr>
            </thead>
            <tbody>
              {rows.map(([zip, r]) => (
                <tr key={zip} className="border-b border-line/60 last:border-0">
                  <th scope="row" className="px-4 py-2.5 font-semibold">
                    <Link href={`/${state}/${city.slug}/${zip}`} className="text-brand-teal hover:underline">
                      ABA therapy in {zip}
                    </Link>
                  </th>
                  <td className="px-4 py-2.5 text-ink-soft">{r.neighborhoods.slice(0, 4).join(", ") || "—"}</td>
                  <td className="px-4 py-2.5 text-right tabular-nums">{r.stats ? fmt(r.stats.under18) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export function CityJobLinks({ state, city }: { state: StateSlug; city: { name: string; slug: string } }) {
  const jobs = cityJobsFor(state, city.slug);
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="font-display text-2xl">Work with us in {city.name}</h2>
        <p className="mt-2 max-w-3xl text-[15px] text-ink-soft">
          We&rsquo;re growing in the {city.name} area. Paid training toward certification, real BCBA
          supervision, and caseloads sized for good work.
        </p>
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {jobs.map((j) => (
            <li key={j.slug}>
              <Link
                href={`/careers/${j.slug}`}
                className="rounded-full border border-line bg-cream px-4 py-2 text-[15px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
              >
                {j.role.toUpperCase()} jobs in {city.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
