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
  RichText,
  guideShelf,
} from "../../../../components/local/LocalBlocks";
import { siteConfig, type StateSlug } from "../../../../../site.config";
import { cityLocal, fmt, hashSeed, pick } from "../../../../lib/local";
import { buildLocalFaqs, buildLocalSections, type PlaceCtx } from "../../../../lib/localCopy";
import { CITY_SERVICES, cityZips, zipLabel, type ZipRecord } from "../../../../lib/metro";
import { breadcrumbJsonLd } from "../../../../lib/seo";

/**
 * ZIP-code area page inside a team city — /colorado/denver/80205. Big-city
 * searches are won block by block: each page carries that ZIP's own Census
 * figures, the neighborhoods inside its boundary (OpenStreetMap,
 * point-in-polygon), sibling ZIPs, and links to the city's service pages.
 */

export function zipCtx(
  stateSlug: StateSlug,
  city: { name: string; slug: string },
  zip: string,
  rec: ZipRecord
): PlaceCtx {
  const stateCfg = siteConfig.states[stateSlug];
  const cl = cityLocal(stateSlug, city.slug);
  return {
    stateSlug,
    stateName: stateCfg.name,
    abbr: stateCfg.abbr,
    kind: "town",
    name: `${city.name} ${zip}`,
    countyFull: city.name,
    countyHref: `/${stateSlug}/${city.slug}`,
    landSqMi: rec.landSqMi,
    stats: rec.stats,
    countyStats: cl?.stats ?? null,
    // ZIP list + ZIP FAQ would just repeat the page's own ZIP — omitted.
    zips: [],
    districts: cl?.districts ?? [],
    hub: { slug: city.slug, name: city.name, miles: 0 },
    nearby: rec.nearbyZips.map((n) => ({
      path: `${city.slug}/${n.zip}`,
      name: `${city.name} ${n.zip}`,
      miles: n.miles,
      kind: "town" as const,
    })),
    path: `${city.slug}/${zip}`,
  };
}

function areaSection(
  stateSlug: StateSlug,
  city: { name: string; slug: string },
  zip: string,
  rec: ZipRecord,
  seed: number
): { heading: string; paragraphs: string[] } {
  const all = cityZips(stateSlug, city.slug);
  const byKids = [...all].sort((a, b) => (b[1].stats?.under18 ?? 0) - (a[1].stats?.under18 ?? 0));
  const rank = byKids.findIndex(([z]) => z === zip) + 1;
  const cityKids = cityLocal(stateSlug, city.slug)?.stats?.under18 ?? 0;
  const kids = rec.stats?.under18 ?? 0;
  const paras: string[] = [];
  const hoods = rec.neighborhoods;

  if (hoods.length) {
    const list = hoods.length === 1 ? hoods[0] : `${hoods.slice(0, -1).join(", ")} and ${hoods[hoods.length - 1]}`;
    paras.push(
      pick(seed, 30, [
        `ZIP code ${zip} takes in ${list} — ${hoods.length === 1 ? "a neighborhood" : "neighborhoods"} of [${city.name}](/${stateSlug}/${city.slug}). Our team serves every street in it; sessions happen in your home or at your child's daycare.`,
        `If you live in ${hoods.slice(0, 3).join(", ")}${hoods.length > 3 ? " or nearby" : ""}, you're in ${city.name}'s ${zip} ZIP code — inside our ${city.name} team's service area. In-home and daycare-based ABA come to you here.`,
      ])
    );
  } else {
    paras.push(
      `ZIP code ${zip} is one of the ${all.length} ${city.name} ZIP codes our team serves — every street in it. Sessions happen in your home or at your child's daycare, not at a far-off clinic.`
    );
  }

  if (kids > 0 && rank > 0) {
    const share = cityKids ? (100 * kids) / cityKids : 0;
    paras.push(
      `About ${fmt(kids)} children live in ${zip}${share >= 1 ? ` — roughly ${Math.round(share)}% of all the kids in ${city.name}` : ""}. By child population it ranks ${rank === 1 ? "first" : `#${rank}`} of the ${all.length} ${city.name} ZIP codes on our map.`
    );
  }

  if (rec.otherTowns.length) {
    paras.push(
      `Part of ${zip} reaches beyond ${city.name} city limits, into ${rec.otherTowns
        .map((t) => `[${t.name}](/${stateSlug}/${t.path})`)
        .join(", ")}. Same team, same service — the ZIP code matters more than the city line.`
    );
  }
  return { heading: `Neighborhoods and kids in ${city.name} ${zip}`, paragraphs: paras };
}

export default function ZipView({
  stateSlug,
  city,
  zip,
  rec,
}: {
  stateSlug: StateSlug;
  city: { name: string; slug: string };
  zip: string;
  rec: ZipRecord;
}) {
  const stateCfg = siteConfig.states[stateSlug];
  const ctx = zipCtx(stateSlug, city, zip, rec);
  const seed = hashSeed(`${stateSlug}/${city.slug}/${zip}`);
  const area = areaSection(stateSlug, city, zip, rec, seed);
  const sections = buildLocalSections(ctx).filter((s) => s.id !== "area");
  sections.splice(1, 0, { id: "neighborhoods", heading: area.heading, paragraphs: area.paragraphs });
  const faqs = buildLocalFaqs(ctx);
  const label = zipLabel(rec);
  const place = `${city.name} ${zip}`;

  const nearby = rec.nearbyZips.map((n) => {
    const r = cityZips(stateSlug, city.slug).find(([z]) => z === n.zip)?.[1];
    const l = r ? zipLabel(r, 2) : null;
    return { name: `${n.zip}${l ? ` · ${l}` : ""}`, href: `/${stateSlug}/${city.slug}/${n.zip}`, note: `${n.miles} mi` };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteConfig.domain}/${stateSlug}/${city.slug}/${zip}/#location`,
    name: `${siteConfig.brandName} — ${place}, ${stateCfg.abbr}`,
    url: `${siteConfig.domain}/${stateSlug}/${city.slug}/${zip}`,
    telephone: siteConfig.phone,
    areaServed: {
      "@type": "PostalAddress",
      postalCode: zip,
      addressLocality: city.name,
      addressRegion: stateCfg.abbr,
      addressCountry: "US",
    },
    parentOrganization: { "@id": `${siteConfig.domain}/#organization` },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: stateCfg.name, path: `/${stateSlug}` },
          { name: city.name, path: `/${stateSlug}/${city.slug}` },
          { name: zip },
        ])}
      />

      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:pb-16 lg:pt-16">
          <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
            <Link href="/" className="hover:text-brand-teal">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${stateSlug}`} className="hover:text-brand-teal">{stateCfg.name}</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${stateSlug}/${city.slug}`} className="hover:text-brand-teal">{city.name}</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{zip}</span>
          </nav>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[14px] font-bold text-brand-teal shadow-card">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-meadow" />
            Sunbird ABA team in {place} — serving you
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl sm:text-5xl">
            ABA therapy in {city.name} {zip}
            {label && <span className="block text-2xl text-ink-soft sm:text-3xl">{label}</span>}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            One-on-one, BCBA-led ABA therapy at your home or your child&rsquo;s daycare
            {label ? ` in ${label}` : ` across ${zip}`}
            {rec.stats && rec.stats.under18 > 0 ? ` — for the ${fmt(rec.stats.under18)} kids who live in this ZIP code` : ""}.
            Our {city.name} team is here, and the insurance check is free.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link href="#intake" className="rounded-full bg-brand-teal px-7 py-3.5 text-center text-[16px] font-bold text-white transition-colors hover:bg-brand-teal-deep">
              Match me with an advocate
            </Link>
            <a href={siteConfig.phoneHref} className="rounded-full border border-ink/25 px-7 py-3.5 text-center text-[16px] font-bold transition-colors hover:border-ink">
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      <LocalSnapshot
        name={`${city.name} ${zip}`}
        stats={rec.stats}
        countyStats={ctx.countyStats}
        countyName={city.name}
        extras={[
          { label: `Your Sunbird team in ${city.name}`, value: "Serving you" },
          ...(rec.neighborhoods.length ? [{ label: "Neighborhoods in this ZIP", value: String(rec.neighborhoods.length) }] : []),
          { label: "Land area", value: `${rec.landSqMi} sq mi` },
        ]}
      />

      <LocalSections sections={sections} />

      <LinkChips
        heading={`ABA services in ${city.name}`}
        intro={`Everything we offer families in ${zip}, with ${city.name}-specific details:`}
        items={CITY_SERVICES.map((s) => ({ name: `${s.label} in ${city.name}`, href: `/${stateSlug}/${city.slug}/${s.slug}` }))}
        tint="bg-white"
      />

      <Faq items={faqs} heading={`${place} questions, answered plainly`} />

      <section id="intake" className="bg-ink scroll-mt-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">Start in {place} with one short call</h2>
            <p className="mt-4 text-white/75">
              <RichText text={`Tell us your address and what you're seeing. An intake advocate calls back — usually the same business day — with your coverage answer and an honest start timeline.`} />
            </p>
          </div>
          <LeadForm
            heading={`Get matched in ${place}`}
            subheading="Four quick fields. A real person calls you back."
            sourcePage={`zip-${stateSlug}-${city.slug}-${zip}`}
          />
        </div>
      </section>

      <LinkChips
        id="nearby"
        heading={`ZIP codes near ${zip}`}
        intro={`Other ${city.name} ZIP codes our team serves, by distance:`}
        items={[...nearby, { name: `All of ${city.name} →`, href: `/${stateSlug}/${city.slug}` }]}
        tint="bg-cream"
      />

      <LinkChips heading="Guides parents read next" items={guideShelf(seed)} tint="bg-white" />

      <CtaBand
        tint="sky"
        heading="Ready to talk about your child?"
        body={`Families in ${label ?? zip} and across ${city.name} start with one short call. Yours can too.`}
      />
      <StickyCallBar callLabel={`Call the ${city.name} team`} />
    </>
  );
}
