import Link from "next/link";
import CtaBand from "../../../../components/CtaBand";
import Faq, { faqJsonLd } from "../../../../components/Faq";
import JsonLd from "../../../../components/JsonLd";
import LeadForm from "../../../../components/LeadForm";
import StickyCallBar from "../../../../components/StickyCallBar";
import {
  LinkChips,
  LocalSections,
  LocalSnapshot,
  ZipList,
  guideShelf,
} from "../../../../components/local/LocalBlocks";
import { siteConfig, type StateSlug } from "../../../../../site.config";
import { formatPop, getCounty, type CountyEntry } from "../../../../data/counties";
import { cityPagesInCounty, townsInCounty, type TownEntry } from "../../../../data/towns";
import {
  countyLocal,
  fmt,
  hashSeed,
  nearbyHref,
  placeLocal,
} from "../../../../lib/local";
import {
  buildLocalFaqs,
  buildLocalSections,
  type PlaceCtx,
} from "../../../../lib/localCopy";
import { breadcrumbJsonLd } from "../../../../lib/seo";
import { DistrictChips } from "../../../../components/local/CityHub";
import { districtsLinkingTo } from "../../../../lib/schools";

/**
 * Town page — one per Census place (every incorporated city and town, plus
 * census-designated places of 250+ people). The body is generated from the
 * town's own public data (src/lib/local.ts → src/lib/localCopy.ts): child
 * population, CDC-rate autism estimate, working-parent and broadband rates,
 * children's coverage mix, school districts, ZIP codes, and straight-line
 * distance to the nearest Sunbird team — so every page says something true
 * and specific about its town. Coverage copy stays vague (client rule).
 */

export function townCtx(
  stateSlug: StateSlug,
  county: CountyEntry,
  town: TownEntry
): PlaceCtx | null {
  const stateCfg = siteConfig.states[stateSlug];
  const loc = placeLocal(stateSlug, county.slug, town.slug);
  if (!loc) return null;
  const inCounty = townsInCounty(stateSlug, county.slug);
  const cityCount = cityPagesInCounty(stateSlug, county.slug).length;
  return {
    countyRank: cityCount + inCounty.findIndex((t) => t.slug === town.slug) + 1,
    countyCommunities: cityCount + inCounty.length,
    countyKids: countyLocal(stateSlug, county.slug)?.stats?.under18,
    stateSlug,
    stateName: stateCfg.name,
    abbr: stateCfg.abbr,
    kind: "town",
    name: town.name,
    countyFull: county.full,
    countyHref: `/${stateSlug}/${county.slug}`,
    isCdp: loc.kind === "cdp",
    isSeat: loc.isSeat,
    landSqMi: loc.landSqMi,
    stats: loc.stats,
    countyStats: countyLocal(stateSlug, county.slug)?.stats ?? null,
    zips: loc.zips,
    districts: loc.districts,
    hub: loc.hub,
    nearby: loc.nearby,
    path: `${county.slug}/${town.slug}`,
  };
}

function sizePhrase(pop: number, stateName: string): string {
  const p = formatPop(pop);
  if (pop >= 50000) return `one of ${stateName}'s bigger communities, home to about ${p} people`;
  if (pop >= 10000) return `a community of about ${p} people`;
  if (pop >= 2500) return `a town of about ${p} people`;
  if (pop >= 500) return `a small town of about ${p} people`;
  return `a close-knit community of about ${p} people`;
}

export default function TownView({
  stateSlug,
  county,
  town,
}: {
  stateSlug: StateSlug;
  county: CountyEntry;
  town: TownEntry;
}) {
  const stateCfg = siteConfig.states[stateSlug];
  const ctx = townCtx(stateSlug, county, town)!;
  const cLocal = countyLocal(stateSlug, county.slug);
  const sections = buildLocalSections(ctx, cLocal?.districts);
  const faqs = buildLocalFaqs(ctx, cLocal?.districts);
  const seed = hashSeed(`${stateSlug}/${ctx.path}`);
  const place = placeLocal(stateSlug, county.slug, town.slug)!;

  const nearby = ctx.nearby.map((n) => ({
    name: n.name,
    href: nearbyHref(stateSlug, n),
    note: `${n.miles} mi`,
  }));

  // Other towns in the same county by population (skip ones already in
  // the nearby list so the two walls don't repeat each other).
  const nearbyHrefs = new Set(nearby.map((n) => n.href));
  const countyTowns = townsInCounty(stateSlug, county.slug)
    .filter((t) => t.slug !== town.slug)
    .map((t) => ({
      name: t.name,
      href: `/${stateSlug}/${county.slug}/${t.slug}`,
    }))
    .filter((t) => !nearbyHrefs.has(t.href))
    .slice(0, 24);

  const otherCounties = place.otherCounties
    .map((s) => getCounty(stateSlug, s))
    .filter((c): c is CountyEntry => Boolean(c));

  const extras = [
    { label: `Your Sunbird team in ${town.name}`, value: "Serving you" },
    { label: "Sunbird services here", value: "Home · Daycare · Video" },
    ...(ctx.zips.length ? [{ label: "ZIP codes", value: String(ctx.zips.length) }] : []),
  ];

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.domain}/${stateSlug}/${county.slug}/${town.slug}/#location`,
    name: `${siteConfig.brandName} — ${town.name}, ${stateCfg.abbr}`,
    url: `${siteConfig.domain}/${stateSlug}/${county.slug}/${town.slug}`,
    telephone: siteConfig.phone,
    areaServed: {
      "@type": "City",
      name: `${town.name}, ${stateCfg.abbr}`,
      ...(ctx.zips.length ? { postalCode: ctx.zips } : {}),
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: `${county.full}, ${stateCfg.name}`,
        containedInPlace: { "@type": "State", name: stateCfg.name },
      },
    },
    parentOrganization: { "@id": `${siteConfig.domain}/#organization` },
  };

  const pop = ctx.stats?.pop ?? town.pop;

  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: stateCfg.name, path: `/${stateSlug}` },
          { name: county.full, path: `/${stateSlug}/${county.slug}` },
          { name: town.name },
        ])}
      />

      {/* ————— Town hero ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:pb-16 lg:pt-16">
          <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
            <Link href="/" className="hover:text-brand-teal">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${stateSlug}`} className="hover:text-brand-teal">
              {stateCfg.name}
            </Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${stateSlug}/${county.slug}`} className="hover:text-brand-teal">
              {county.full}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{town.name}</span>
          </nav>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[14px] font-bold text-brand-teal shadow-card">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-meadow" />
            Sunbird ABA team in {town.name} — serving you
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl sm:text-5xl">
            ABA therapy in {town.name}, {stateCfg.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {town.name} is {sizePhrase(pop, stateCfg.name)} in{" "}
            <Link
              href={`/${stateSlug}/${county.slug}`}
              className="font-bold text-brand-teal hover:underline"
            >
              {county.full}
            </Link>
            , and our ABA team in the {town.name} area is here serving you.
            One-on-one, BCBA-led ABA therapy comes to your home or daycare
            {ctx.stats && ctx.stats.under18 > 0
              ? ` — for the ${fmt(ctx.stats.under18)} kids who live here, not a far-off clinic.`
              : " — not a far-off clinic."}
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
              ["#local-picture", "How care reaches " + town.name],
              ["#kids-and-families", "Kids & autism here"],
              ["#what-fits", "Home, daycare or telehealth"],
              ["#schools", "Schools & IEPs"],
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

      <LocalSnapshot
        name={town.name}
        stats={ctx.stats}
        countyStats={ctx.countyStats}
        countyName={county.full}
        extras={extras}
      />

      <LocalSections sections={sections} />

      <ZipList name={town.name} zips={ctx.zips} />

      {/* ————— Diagnosis funnel ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-white p-6 shadow-card sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl">
                No diagnosis yet? Start there — we&rsquo;ll help.
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Calling before any evaluation is completely normal — from {town.name} or anywhere else.
                We&rsquo;ll help you understand what you&rsquo;re seeing, book a
                diagnostic evaluation in {stateCfg.name}, and line up coverage
                so therapy can start as soon as the diagnosis is in hand.
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/get-a-diagnosis"
                className="rounded-full bg-brand-teal px-7 py-3.5 text-center text-[16px] font-bold text-white transition-colors hover:bg-brand-teal-deep"
              >
                Get a diagnosis
              </Link>
              <Link
                href="/questions"
                className="rounded-full border border-ink/25 bg-white px-7 py-3.5 text-center text-[16px] font-bold transition-colors hover:border-ink"
              >
                Is this you? Start here
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Faq items={faqs} heading={`${town.name} questions, answered plainly`} />

      {/* ————— Intake ————— */}
      <section id="intake" className="bg-ink scroll-mt-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">
              Start in {town.name} with one short call
            </h2>
            <p className="mt-4 text-white/75">
              Tell us where you are and what you&rsquo;re seeing. An intake
              advocate calls back — usually the same business day — with your
              coverage answer and an honest start timeline for {town.name}.
            </p>
          </div>
          <LeadForm
            heading={`Get matched in ${town.name}`}
            subheading="Four quick fields. A real person calls you back."
            sourcePage={`town-${stateSlug}-${county.slug}-${town.slug}`}
          />
        </div>
      </section>

      <LinkChips
        id="nearby"
        heading={`Communities near ${town.name}`}
        intro={`The closest towns we also serve, by straight-line distance from ${town.name}.`}
        items={nearby}
        tint="bg-white"
      />

      <LinkChips
        heading={`More of ${county.full}`}
        intro={
          <>
            {town.name} is part of{" "}
            <Link href={`/${stateSlug}/${county.slug}`} className="font-bold text-brand-teal hover:underline">
              our {county.full} guide
            </Link>
            {otherCounties.length > 0 && (
              <>
                {" "}(it also reaches into{" "}
                {otherCounties.map((c, i) => (
                  <span key={c.slug}>
                    {i > 0 && ", "}
                    <Link href={`/${stateSlug}/${c.slug}`} className="font-bold text-brand-teal hover:underline">
                      {c.full}
                    </Link>
                  </span>
                ))}
                )
              </>
            )}
            . Other {county.full} communities:
          </>
        }
        items={[
          { name: `${county.full} guide →`, href: `/${stateSlug}/${county.slug}` },
          ...countyTowns,
          { name: `All of ${stateCfg.name}`, href: `/${stateSlug}` },
        ]}
        tint="bg-cream"
      />

      <DistrictChips
        state={stateSlug}
        heading={`School districts serving ${town.name}`}
        districts={districtsLinkingTo(stateSlug, `/${stateSlug}/${county.slug}/${town.slug}`)}
      />

      <LinkChips
        heading="Guides parents read next"
        items={guideShelf(seed)}
        tint="bg-white"
      />

      <CtaBand
        tint="sky"
        heading="Ready to talk about your child?"
        body={`Families in ${town.name}, across ${county.full} and the rest of ${stateCfg.name} start with one short call. Yours can too.`}
      />
      <StickyCallBar callLabel={`Call the ${stateCfg.name} team`} />
    </>
  );
}
