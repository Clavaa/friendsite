import Link from "next/link";
import CtaBand from "../../../components/CtaBand";
import JsonLd from "../../../components/JsonLd";
import LeadForm from "../../../components/LeadForm";
import PhotoPlaceholder from "../../../components/PhotoPlaceholder";
import ProofChip from "../../../components/ProofChip";
import StickyCallBar from "../../../components/StickyCallBar";
import { siteConfig, type StateSlug } from "../../../../site.config";
import { stateContent } from "../../../data/states";
import { services } from "../../../data/services";
import { countiesByState } from "../../../data/counties";
import { breadcrumbJsonLd } from "../../../lib/seo";

export interface CityEntry {
  name: string;
  slug: string;
  displaySuffix?: string;
}

export default function CityView({
  stateSlug,
  city,
}: {
  stateSlug: StateSlug;
  city: CityEntry;
}) {
  const stateCfg = siteConfig.states[stateSlug];
  const content = stateContent[stateSlug];
  const cityLabel = `${city.name}, ${stateCfg.abbr}`;

  // Counties whose nearest served city is this one — internal links that
  // make the city page a hub for its region.
  const nearbyCounties = countiesByState[stateSlug]
    .filter((c) => c.nearestCity?.slug === city.slug)
    .sort((a, b) => b.pop - a.pop)
    .slice(0, 10);

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
      containedInPlace: { "@type": "State", name: stateCfg.name },
    },
    parentOrganization: { "@id": `${siteConfig.domain}/#organization` },
  };

  return (
    <>
      <JsonLd data={localBusinessJsonLd} />
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
              One-on-one, BCBA-led therapy for children with autism in the{" "}
              {city.name} area — at your home, in our centers, and over
              secure video. Insurance handled for you, in plain English.
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

      {/* ————— Local team note + service area (unique-content slots) ————— */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-sun-wash p-6 sm:p-8">
            <h2 className="font-display text-2xl">Your {city.name} team</h2>
            {/* TODO (unique content, required before launch): 2–3 sentences
                from the actual local clinical lead — name, credential, how
                long they've served {city.name}, and one specific local detail.
                Google's helpful-content standards require real local substance
                here, never a swapped-city template. */}
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              A note from our {city.name} clinical lead belongs here — who
              they are, how long they&rsquo;ve worked with {city.name}{" "}
              families, and how the local team runs. We publish it once
              it&rsquo;s real, not before.
            </p>
            <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-[13px] font-semibold text-ink-soft">
              Production note: unique local content pending — see TODO in this
              template.
            </p>
          </div>
          <div className="rounded-3xl bg-mint-wash p-6 sm:p-8">
            <h2 className="font-display text-2xl">Where we go in {city.name}</h2>
            {/* TODO (unique content, required before launch): true service-area
                description — actual neighborhoods/suburbs served for in-home,
                the real center address if one exists in {city.name}, and honest
                drive-radius notes. */}
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              In-home therapy covers the greater {city.name} area, and
              telehealth reaches every corner of {stateCfg.name}. The specific
              neighborhoods and center details for {city.name} are published
              once confirmed by the local team.
            </p>
            <p className="mt-3 rounded-xl bg-white/70 px-3 py-2 text-[13px] font-semibold text-ink-soft">
              Production note: neighborhood list + center details pending — see
              TODO in this template.
            </p>
          </div>
        </div>
      </section>

      {/* ————— Services available here ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display max-w-2xl text-3xl sm:text-4xl">
            How {city.name} families use us
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className={`group flex h-full flex-col rounded-3xl p-6 transition-all hover:-translate-y-0.5 hover:shadow-card-lg ${s.tintClass}`}
                >
                  <h3 className="font-display text-xl">{s.cardTitle}</h3>
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
        </div>
      </section>

      {/* ————— Inherited state insurance data ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <p className="text-sm font-bold tracking-wide text-brand-teal">
              Paying for therapy in {city.name}
            </p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">
              Coverage works the same across {stateCfg.name}
            </h2>
            <p className="mt-4 text-ink-soft">{content.medicaidIntro[0]}</p>
            <p className="mt-4 text-ink-soft">
              Private insurance is covered by {stateCfg.name}&rsquo;s autism
              insurance law for most state-regulated plans, and we verify every
              family&rsquo;s exact benefits free before care begins. The full
              picture — prior authorization, the state mandate, waiver programs
              — lives on our{" "}
              <Link href={`/${stateSlug}`} className="font-bold text-brand-teal hover:underline">
                {stateCfg.name} coverage guide
              </Link>
              .
            </p>
          </div>
          <ul className="mt-6 flex flex-wrap gap-2.5">
            {content.medicaidPlans.map((plan) => (
              <li key={plan} className="rounded-full bg-cream px-4 py-2 text-[15px] font-semibold">
                {plan}
              </li>
            ))}
          </ul>
        </div>
      </section>

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

      {/* ————— Counties this city team serves ————— */}
      {nearbyCounties.length > 0 && (
        <section className="bg-white">
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
            <h2 className="font-display text-2xl">
              Counties the {city.name} team serves
            </h2>
            <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">
              In-home therapy travels well beyond city limits. These are some
              of the {stateCfg.name} counties families reach us from.
            </p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {nearbyCounties.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/${stateSlug}/${c.slug}`}
                    className="rounded-full border border-line bg-cream px-4 py-2 text-[15px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
                  >
                    {c.full}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

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

      <CtaBand />
      <StickyCallBar callLabel={`Call the ${city.name} team`} />
    </>
  );
}
