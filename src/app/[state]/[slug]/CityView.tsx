import Link from "next/link";
import CtaBand from "../../../components/CtaBand";
import JsonLd from "../../../components/JsonLd";
import LeadForm from "../../../components/LeadForm";
import PhotoPlaceholder from "../../../components/PhotoPlaceholder";
import ProofChip from "../../../components/ProofChip";
import StickyCallBar from "../../../components/StickyCallBar";
import { siteConfig, type StateSlug } from "../../../../site.config";
import { services } from "../../../data/services";
import { getCounty } from "../../../data/counties";
import Faq, { faqJsonLd } from "../../../components/Faq";
import {
  LinkChips,
  LocalSections,
  LocalSnapshot,
  ZipList,
  guideShelf,
} from "../../../components/local/LocalBlocks";
import { cityLocal, countyLocal, hashSeed, nearbyHref } from "../../../lib/local";
import {
  buildLocalFaqs,
  buildLocalSections,
  type PlaceCtx,
} from "../../../lib/localCopy";
import { breadcrumbJsonLd } from "../../../lib/seo";

export interface CityEntry {
  name: string;
  slug: string;
  displaySuffix?: string;
}

export function cityCtx(stateSlug: StateSlug, city: CityEntry): PlaceCtx | null {
  const stateCfg = siteConfig.states[stateSlug];
  const loc = cityLocal(stateSlug, city.slug);
  if (!loc) return null;
  const county = getCounty(stateSlug, loc.county);
  return {
    stateSlug,
    stateName: stateCfg.name,
    abbr: stateCfg.abbr,
    kind: "city",
    name: city.name,
    countyFull: county?.full,
    countyHref: county ? `/${stateSlug}/${county.slug}` : undefined,
    landSqMi: loc.landSqMi,
    stats: loc.stats,
    zips: loc.zips,
    districts: loc.districts,
    hub: { slug: city.slug, name: city.name, miles: 0 },
    nearby: loc.nearby,
    path: city.slug,
    countiesServed: loc.countiesServed
      .map((s) => getCounty(stateSlug, s))
      .filter((c): c is NonNullable<typeof c> => Boolean(c))
      .map((c) => ({ name: c.full, href: `/${stateSlug}/${c.slug}` })),
  };
}

export default function CityView({
  stateSlug,
  city,
}: {
  stateSlug: StateSlug;
  city: CityEntry;
}) {
  const stateCfg = siteConfig.states[stateSlug];
  const cityLabel = `${city.name}, ${stateCfg.abbr}`;

  const loc = cityLocal(stateSlug, city.slug)!;
  const ctx = cityCtx(stateSlug, city)!;
  const homeCounty = getCounty(stateSlug, loc.county);
  const sections = buildLocalSections(ctx, countyLocal(stateSlug, loc.county)?.districts);
  const faqs = buildLocalFaqs(ctx);
  const seed = hashSeed(`${stateSlug}/${city.slug}`);

  // Every town within 30 miles + every county this team is nearest to —
  // the city page is the hub of its region's link graph.
  const within30 = loc.within30.map((n) => ({
    name: n.name,
    href: nearbyHref(stateSlug, n),
    note: `${n.miles} mi`,
  }));
  const countiesServed = loc.countiesServed
    .map((s) => getCounty(stateSlug, s))
    .filter((c): c is NonNullable<typeof c> => Boolean(c))
    .map((c) => ({ name: c.full, href: `/${stateSlug}/${c.slug}` }));
  const extras = [
    ...(homeCounty ? [{ label: "County", value: homeCounty.full }] : []),
    { label: "ZIP codes in the city", value: String(loc.zips.length) },
    { label: "Towns within 30 miles", value: String(loc.within30.length) },
    { label: "Counties this team serves", value: String(loc.countiesServed.length) },
  ];

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.domain}/${stateSlug}/${city.slug}/#location`,
    name: `${siteConfig.brandName} — ${cityLabel}`,
    url: `${siteConfig.domain}/${stateSlug}/${city.slug}`,
    telephone: siteConfig.phone,
    areaServed: {
      "@type": "City",
      name: city.name,
      ...(loc.zips.length ? { postalCode: loc.zips } : {}),
      containedInPlace: { "@type": "State", name: stateCfg.name },
    },
    parentOrganization: { "@id": `${siteConfig.domain}/#organization` },
  };

  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: stateCfg.name, path: `/${stateSlug}` },
          { name: city.name },
        ])}
      />

      {/* ————— City hero ————— */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-20 lg:pt-16">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
              <Link href="/" className="hover:text-brand-teal">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href={`/${stateSlug}`} className="hover:text-brand-teal">
                {stateCfg.name}
              </Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{city.name}</span>
            </nav>
            <h1 className="font-display mt-4 text-4xl sm:text-5xl">
              ABA therapy in {cityLabel}
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink-soft">
              One-on-one therapy for children with autism from ABA therapists
              who come to the {city.name} area — at your home, at daycare,
              and over secure video, with a BCBA leading every plan.
              Insurance handled for you, in plain English.
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
                Call the {city.name} team
              </a>
            </div>
          </div>
          <div className="relative">
            {/* Photo slot intent: recognizable {city} setting — local park or
                neighborhood street — clinician and child walking together,
                bright natural light. TODO: shoot locally, never stock-generic. */}
            <PhotoPlaceholder
              intent={`Clinician and child in a recognizable ${city.name} setting, bright natural light`}
              className="aspect-[4/3] w-full"
            />
            <ProofChip className="absolute -bottom-4 left-4">
              Serving the {city.name} area
            </ProofChip>
          </div>
        </div>
      </section>

      {/* TODO (client, when ready): a 2–3 sentence note from the real local
          clinical lead belongs above the snapshot — only once it's real. The
          visible "production note" placeholders were removed: everything
          below is true, data-driven local content (src/lib/localCopy.ts). */}
      <LocalSnapshot name={city.name} stats={ctx.stats} extras={extras} />

      <LocalSections sections={sections} />

      {/* ————— Services available here ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display max-w-2xl text-3xl sm:text-4xl">
            ABA therapy services in {city.name}
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className={`group flex h-full flex-col rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-card-lg ${s.tintClass}`}
                >
                  <h3 className="font-display flex flex-wrap items-center gap-2 text-xl">
                    {s.cardTitle}
                    {s.comingSoon && (
                      <span className="rounded-full bg-white px-2.5 py-0.5 text-[11px] font-sans font-extrabold uppercase tracking-[0.08em] text-brand-teal shadow-chip">
                        Coming soon
                      </span>
                    )}
                  </h3>
                  <p className="mt-2 flex-1 text-[15px] leading-relaxed text-ink-soft">
                    {s.cardBlurb}
                  </p>
                  <span className="mt-4 text-[15px] font-bold text-ink">
                    Learn more{" "}
                    <span aria-hidden="true" className="inline-block transition-transform group-hover:translate-x-0.5">→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-8 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            Still comparing options? Two honest reads:{" "}
            <Link
              href="/resources/aba-vs-speech-therapy"
              className="font-bold text-brand-teal hover:underline"
            >
              ABA vs. speech therapy
            </Link>{" "}
            and{" "}
            <Link
              href="/resources/how-many-hours-of-aba"
              className="font-bold text-brand-teal hover:underline"
            >
              how many hours of ABA children need
            </Link>
            .
          </p>
        </div>
      </section>

      <ZipList name={city.name} zips={loc.zips} />

      <Faq items={faqs} heading={`${city.name} questions, answered plainly`} />

      {/* ————— Intake ————— */}
      <section id="intake" className="bg-ink scroll-mt-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">
              Start in {city.name} this month
            </h2>
            <p className="mt-4 text-white/75">
              Tell us where you are and what you&rsquo;re seeing. An intake
              advocate calls back — usually the same business day — with your
              coverage answer and an honest {city.name} start timeline.
            </p>
          </div>
          <LeadForm
            heading={`Get matched in ${city.name}`}
            subheading="Four quick fields. A real person calls you back."
            sourcePage={`city-${stateSlug}-${city.slug}`}
          />
        </div>
      </section>

      <LinkChips
        id="nearby"
        heading={`Towns within 30 miles of ${city.name}`}
        intro={`Our ${city.name} team drives to homes across the area. Straight-line distance from ${city.name}:`}
        items={within30}
        tint="bg-white"
      />

      <LinkChips
        heading={`Counties the ${city.name} team serves`}
        intro={`These ${stateCfg.name} counties are closer to ${city.name} than to any other Sunbird team, nearest first.`}
        items={countiesServed}
        tint="bg-cream"
      />

      {/* ————— Other cities ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl">
            Also serving families across {stateCfg.name}
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {stateCfg.cities
              .filter((c) => c.slug !== city.slug)
              .map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${stateSlug}/${c.slug}`}
                    className="rounded-full border border-line bg-white px-4 py-2 text-[15px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            <li>
              <Link
                href={`/${stateSlug}`}
                className="rounded-full bg-ink px-4 py-2 text-[15px] font-semibold text-white"
              >
                All of {stateCfg.name} →
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <LinkChips heading="Guides parents read next" items={guideShelf(seed)} tint="bg-white" />

      <CtaBand />
      <StickyCallBar callLabel={`Call the ${city.name} team`} />
    </>
  );
}
