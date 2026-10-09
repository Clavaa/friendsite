import Link from "next/link";
import CtaBand from "../../../components/CtaBand";
import Faq, { faqJsonLd } from "../../../components/Faq";
import JsonLd from "../../../components/JsonLd";
import LeadForm from "../../../components/LeadForm";
import StickyCallBar from "../../../components/StickyCallBar";
import {
  LinkChips,
  LocalSections,
  LocalSnapshot,
  ZipList,
  guideShelf,
} from "../../../components/local/LocalBlocks";
import { siteConfig, type StateSlug } from "../../../../site.config";
import { formatPop, getCounty, type CountyEntry } from "../../../data/counties";
import {
  cityPagesInCounty,
  tinyPlacesInCounty,
  townsInCounty,
} from "../../../data/towns";
import {
  cityLocal,
  countyLocal,
  fmt,
  hashSeed,
  placeLocal,
} from "../../../lib/local";
import {
  buildLocalFaqs,
  buildLocalSections,
  type PlaceCtx,
} from "../../../lib/localCopy";
import { breadcrumbJsonLd } from "../../../lib/seo";
import { DistrictChips } from "../../../components/local/CityHub";
import { districtsIn } from "../../../lib/schools";

/**
 * County page — the hub for every community in the county. The body is
 * generated from the county's own public data (src/lib/local.ts →
 * src/lib/localCopy.ts) and carries a full community table (population,
 * kids, ZIP codes) linking every town page, the
 * county's school districts and ZIP codes, and neighbor counties with
 * distances — so no county page is thin and none is a dead end.
 */

export function countyCtx(stateSlug: StateSlug, county: CountyEntry): PlaceCtx | null {
  const stateCfg = siteConfig.states[stateSlug];
  const loc = countyLocal(stateSlug, county.slug);
  if (!loc) return null;
  const top = [
    ...cityPagesInCounty(stateSlug, county.slug).map((r) => {
      const cl = cityLocal(stateSlug, r.city);
      return {
        name: stateCfg.cities.find((c) => c.slug === r.city)?.name ?? r.city,
        href: `/${stateSlug}/${r.city}`,
        pop: cl?.stats?.pop ?? 0,
        kids: cl?.stats?.under18 ?? null,
      };
    }),
    ...townsInCounty(stateSlug, county.slug).map((t) => {
      const pl = placeLocal(stateSlug, county.slug, t.slug);
      return {
        name: t.name,
        href: `/${stateSlug}/${county.slug}/${t.slug}`,
        pop: pl?.stats?.pop ?? t.pop,
        kids: pl?.stats?.under18 ?? null,
      };
    }),
  ].sort((a, b) => b.pop - a.pop);
  const neighborCounties = loc.neighborMiles
    .map((n) => ({ c: getCounty(stateSlug, n.slug), miles: n.miles }))
    .filter((x): x is { c: CountyEntry; miles: number } => Boolean(x.c))
    .map((x) => ({ name: x.c.full, href: `/${stateSlug}/${x.c.slug}`, miles: x.miles }));
  const nearby = townsInCounty(stateSlug, county.slug)
    .slice(0, 6)
    .map((t) => ({ path: `${county.slug}/${t.slug}`, name: t.name, miles: loc.townMiles[t.slug] ?? 0, kind: "town" as const }));
  return {
    stateSlug,
    stateName: stateCfg.name,
    abbr: stateCfg.abbr,
    kind: "county",
    name: county.full,
    seat: loc.seat,
    landSqMi: loc.landSqMi,
    stats: loc.stats,
    zips: loc.zips,
    districts: loc.districts,
    districtCount: loc.districtCount,
    hub: loc.hub,
    nearby,
    path: county.slug,
    topCommunities: top,
    neighborCounties,
  };
}

export default function CountyView({
  stateSlug,
  county,
}: {
  stateSlug: StateSlug;
  county: CountyEntry;
}) {
  const stateCfg = siteConfig.states[stateSlug];
  const loc = countyLocal(stateSlug, county.slug)!;
  const ctx = countyCtx(stateSlug, county)!;
  const sections = buildLocalSections(ctx);
  const faqs = buildLocalFaqs(ctx);
  const seed = hashSeed(`${stateSlug}/${county.slug}`);
  const hub = loc.hub;

  // Every community with a page: city pages first, then towns by population.
  type Row = { name: string; href: string; pop: number; kids: number | null; zips: string[]; cdp: boolean };
  const rows: Row[] = [
    ...cityPagesInCounty(stateSlug, county.slug).map((r) => {
      const cl = cityLocal(stateSlug, r.city);
      return {
        name: stateCfg.cities.find((c) => c.slug === r.city)?.name ?? r.city,
        href: `/${stateSlug}/${r.city}`,
        pop: cl?.stats?.pop ?? 0,
        kids: cl?.stats?.under18 ?? null,
        zips: cl?.zips ?? [],
        cdp: false,
      };
    }),
    ...townsInCounty(stateSlug, county.slug).map((t) => {
      const pl = placeLocal(stateSlug, county.slug, t.slug);
      return {
        name: t.name,
        href: `/${stateSlug}/${county.slug}/${t.slug}`,
        pop: pl?.stats?.pop ?? t.pop,
        kids: pl?.stats?.under18 ?? null,
        zips: pl?.zips ?? [],
        cdp: t.kind === "cdp",
      };
    }),
  ];
  const tinyPlaces = tinyPlacesInCounty(stateSlug, county.slug);

  const neighbors = loc.neighborMiles
    .map((n) => ({ c: getCounty(stateSlug, n.slug), miles: n.miles }))
    .filter((x): x is { c: CountyEntry; miles: number } => Boolean(x.c))
    .map((x) => ({ name: x.c.full, href: `/${stateSlug}/${x.c.slug}`, note: `${x.miles} mi` }));

  const extras = [
    ...(loc.seat ? [{ label: "County seat", value: loc.seat }] : []),
    { label: "Land area", value: `${fmt(loc.landSqMi)} sq mi` },
    { label: "Communities with a page", value: String(rows.length) },
    ...(loc.districtCount ? [{ label: "Public school districts", value: String(loc.districtCount) }] : []),
    { label: `Your Sunbird team in ${county.full}`, value: "Serving you" },
    { label: "Sunbird services here", value: "Home · Daycare · Video" },
  ];

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.domain}/${stateSlug}/${county.slug}/#location`,
    name: `${siteConfig.brandName} — ${county.full}, ${stateCfg.abbr}`,
    url: `${siteConfig.domain}/${stateSlug}/${county.slug}`,
    telephone: siteConfig.phone,
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${county.full}, ${stateCfg.name}`,
      ...(loc.zips.length ? { postalCode: loc.zips } : {}),
      containedInPlace: { "@type": "State", name: stateCfg.name },
    },
    parentOrganization: { "@id": `${siteConfig.domain}/#organization` },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: stateCfg.name, path: `/${stateSlug}` },
          { name: county.full },
        ])}
      />

      {/* ————— County hero ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:pb-16 lg:pt-16">
          <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
            <Link href="/" className="hover:text-brand-teal">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${stateSlug}`} className="hover:text-brand-teal">
              {stateCfg.name}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{county.full}</span>
          </nav>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[14px] font-bold text-brand-teal shadow-card">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-meadow" />
            Sunbird ABA team in {county.full} — serving you
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl sm:text-5xl">
            ABA therapy in {county.full}, {stateCfg.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Our team comes to families across {county.full} — home to about{" "}
            {formatPop(ctx.stats?.pop ?? county.pop)} people
            {ctx.stats && ctx.stats.under18 > 0 ? ` and ${fmt(ctx.stats.under18)} children` : ""}
            {loc.seat ? `, from ${loc.seat} to the smallest town` : ""} — with
            one-on-one, BCBA-led ABA therapy at home or daycare. Our team in
            {county.full} is serving every community in the county, listed below.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#intake"
              className="rounded-full bg-brand-teal px-7 py-3.5 text-center text-[16px] font-bold text-white transition-colors hover:bg-brand-teal-deep"
            >
              Match me with an advocate
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="rounded-full border border-ink/25 px-7 py-3.5 text-center text-[16px] font-bold transition-colors hover:border-ink"
            >
              Call {siteConfig.phone}
            </a>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2 text-[14px] font-semibold">
            {[
              ["#communities", `All ${rows.length} communities`],
              ["#kids-and-families", "Kids & autism here"],
              ["#what-fits", "Home, daycare or telehealth"],
              ["#schools", "School districts"],
              ["#paying", "Paying for ABA"],
              ["#getting-started", "Getting started"],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="rounded-full bg-white px-3.5 py-1.5 text-ink-soft hover:text-brand-teal">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <LocalSnapshot name={county.full} stats={ctx.stats} extras={extras} />

      {/* ————— Every community table ————— */}
      {rows.length > 0 && (
        <section id="communities" className="bg-cream">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl">
              ABA therapy in every {county.full} community
            </h2>
            <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
              Each community below has its own page with local numbers, schools,
              ZIP codes and nearby towns. Our team serves every one of them.
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl bg-white shadow-card">
              <table className="w-full min-w-[520px] text-left text-[15px]">
                <thead className="border-b border-line text-[13px] uppercase tracking-wide text-ink-soft">
                  <tr>
                    <th scope="col" className="px-4 py-3">Community</th>
                    <th scope="col" className="px-4 py-3 text-right">Residents</th>
                    <th scope="col" className="px-4 py-3 text-right">Kids under 18</th>
                    <th scope="col" className="px-4 py-3 text-right">ZIP codes</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.href} className="border-b border-line/60 last:border-0">
                      <th scope="row" className="px-4 py-2.5 font-semibold">
                        <Link href={r.href} className="text-brand-teal hover:underline">
                          ABA therapy in {r.name}
                        </Link>
                        {r.cdp && <span className="ml-2 text-[12px] font-semibold text-ink-soft">unincorporated</span>}
                      </th>
                      <td className="px-4 py-2.5 text-right tabular-nums">{fmt(r.pop)}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">{r.kids !== null ? fmt(r.kids) : "—"}</td>
                      <td className="px-4 py-2.5 text-right tabular-nums">
                        {r.zips.length ? r.zips.slice(0, 3).join(", ") + (r.zips.length > 3 ? "…" : "") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {tinyPlaces.length > 0 && (
              <p className="mt-5 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
                <span className="font-bold text-ink">Smaller places, too:</span>{" "}
                we also serve families in {tinyPlaces.map((t) => t.name).join(", ")} —
                no community is too small for in-home visits and telehealth.
              </p>
            )}
          </div>
        </section>
      )}

      <LocalSections sections={sections} />

      <ZipList name={county.full} zips={loc.zips} />

      {/* ————— Diagnosis funnel ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-white p-6 shadow-card sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl">
                No diagnosis yet? Start there — we&rsquo;ll help.
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Lots of families reach out before any evaluation — that is a fine place to start, wherever you are in {county.full}.
                We&rsquo;ll help you understand the signs, book a diagnostic
                evaluation in {stateCfg.name}, and line up coverage so therapy
                can start as soon as the diagnosis is in hand.
              </p>
            </div>
            <Link
              href="/get-a-diagnosis"
              className="shrink-0 rounded-full bg-brand-teal px-7 py-3.5 text-[16px] font-bold text-white transition-colors hover:bg-brand-teal-deep"
            >
              Get a diagnosis
            </Link>
          </div>
        </div>
      </section>

      <Faq items={faqs} heading={`${county.full} questions, answered plainly`} />

      {/* ————— Intake ————— */}
      <section id="intake" className="bg-ink scroll-mt-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">
              Start in {county.full} with one short call
            </h2>
            <p className="mt-4 text-white/75">
              Tell us where you are and what you&rsquo;re seeing. An intake
              advocate calls back — usually the same business day — with your
              coverage answer and an honest start timeline for your part of{" "}
              {stateCfg.name}.
            </p>
          </div>
          <LeadForm
            heading={`Get matched in ${county.full}`}
            subheading="Four quick fields. A real person calls you back."
            sourcePage={`county-${stateSlug}-${county.slug}`}
          />
        </div>
      </section>

      <LinkChips
        heading="Neighboring counties we also serve"
        intro="Straight-line distance between county centers."
        items={[...neighbors, { name: `All of ${stateCfg.name} →`, href: `/${stateSlug}` }]}
        tint="bg-cream"
      />

      <LinkChips
        heading={`Nearest team city: ${hub.name}`}
        intro={`See the towns and counties around ${hub.name}:`}
        items={[{ name: `ABA therapy in ${hub.name} →`, href: `/${stateSlug}/${hub.slug}` }]}
        tint="bg-white"
      />

      <DistrictChips
        state={stateSlug}
        heading={`School districts in ${county.full}`}
        districts={districtsIn(stateSlug).filter(([, d]) => d.county === county.slug)}
      />

      <LinkChips heading="Guides parents read next" items={guideShelf(seed)} tint="bg-cream" />

      <CtaBand
        tint="sky"
        heading="Ready to talk about your child?"
        body={`Families across ${county.full} and the rest of ${stateCfg.name} start with one short call. Yours can too.`}
      />
      <StickyCallBar callLabel={`Call the ${stateCfg.name} team`} />
    </>
  );
}
