import Link from "next/link";
import CtaBand from "../../../../components/CtaBand";
import Faq, { faqJsonLd } from "../../../../components/Faq";
import JsonLd from "../../../../components/JsonLd";
import LeadForm from "../../../../components/LeadForm";
import StickyCallBar from "../../../../components/StickyCallBar";
import { siteConfig, type StateSlug } from "../../../../../site.config";
import { type FaqItem } from "../../../../data/states";
import { coverageCard } from "../../../../data/coverage";
import { formatPop, type CountyEntry } from "../../../../data/counties";
import {
  cityPagesInCounty,
  townsInCounty,
  type TownEntry,
} from "../../../../data/towns";
import { breadcrumbJsonLd } from "../../../../lib/seo";

/**
 * Town page: the county page's substance, scaled to one community — real
 * population framing by town size, the county context with neighbor-town
 * chips, the same honest in-home/telehealth logic driven by the county's
 * nearest-hub distance, the deliberately vague benefit-check coverage
 * card (client rule: no program names), town FAQs with schema, and the
 * intake + diagnosis funnels. No invented local detail anywhere.
 */

/** Population framing that scales honestly from 100 people to 100,000. */
function sizePhrase(town: TownEntry, stateName: string): string {
  const pop = formatPop(town.pop);
  if (town.pop >= 50000)
    return `one of ${stateName}'s bigger cities, home to about ${pop} people`;
  if (town.pop >= 10000) return `a city of about ${pop} people`;
  if (town.pop >= 2500) return `a town of about ${pop} people`;
  if (town.pop >= 500) return `a small town of about ${pop} people`;
  return `a close-knit community of about ${pop} people`;
}

/** Honest travel/telehealth note reusing the county's nearest-hub data. */
function hubNote(town: TownEntry, county: CountyEntry, stateName: string): string {
  const city = county.nearestCity;
  if (!city) {
    return `Our ${stateName} team serves families statewide, with in-home visits and telehealth closing the distance to ${town.name}.`;
  }
  if (city.hops <= 1) {
    return `Our ${city.name}-area team drives to families across ${county.full}, ${town.name} included — sessions happen at your home, not a clinic across the state.`;
  }
  if (city.hops <= 3) {
    return `Our closest hub is ${city.name}. In-home therapy travels from there to ${county.full} families, and telehealth keeps BCBA time easy to schedule between visits.`;
  }
  return `We're honest about the map: ${town.name} sits a real drive from our ${city.name} hub, so telehealth carries more of the load between in-home visits — and we're upfront about start timelines in your part of ${stateName}.`;
}

function townFaqs(
  town: TownEntry,
  county: CountyEntry,
  stateSlug: StateSlug
): FaqItem[] {
  const stateName = siteConfig.states[stateSlug].name;
  const city = county.nearestCity;
  const faqs: FaqItem[] = [];

  faqs.push({
    q: `Does insurance cover ABA therapy in ${town.name}?`,
    a: `Coverage depends on your plan, not your town — and rather than guess at yours, we check it for free. Most ${stateName} families pay little or nothing once benefits are confirmed, Medicaid or private. Send us a photo of your insurance card and we'll tell you exactly where you stand, usually within a business day.`,
  });

  faqs.push({
    q: `Do you come to homes in ${town.name}, or would we travel to you?`,
    a: city
      ? `We come to you — in-home therapy is the heart of how we serve ${county.full}. ${
          city.hops <= 1
            ? `Our nearby ${city.name} team anchors care in this area,`
            : `Our nearest hub is ${city.name},`
        } and telehealth keeps BCBA support easy to schedule between visits, wherever in ${town.name} you live.`
      : `We come to you — in-home therapy is the heart of how we serve ${county.full}, and telehealth keeps BCBA support easy to schedule between visits, wherever in ${town.name} you live.`,
  });

  faqs.push({
    q: `My child doesn't have a diagnosis yet. Can we still start from ${town.name}?`,
    a: `Yes — that's exactly where many ${stateName} families begin. We help you book a diagnostic evaluation first, then move straight into coverage and therapy once the diagnosis is in hand. Start with our get-a-diagnosis guide or call us and we'll map the path together.`,
  });

  if (town.pop >= 10000) {
    faqs.push({
      q: `How fast can we start in ${town.name}?`,
      a: `It depends on your child's plan and our current ${
        city ? `${city.name}-area` : stateName
      } capacity, so we won't quote a number we can't keep. Tell us your zip code and schedule, and an intake advocate gives you an honest start timeline — usually on the first call.`,
    });
  } else {
    faqs.push({
      q: `${town.name} only has about ${formatPop(town.pop)} people. Do you really serve towns this size?`,
      a: `Yes — our in-home and telehealth model was built for exactly this. Sessions come to your home in ${town.name}, your BCBA stays close by video between visits, and we're always upfront about travel and start timelines for ${county.full} addresses.`,
    });
  }

  return faqs;
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
  const facts = coverageCard[stateSlug];
  const faqs = townFaqs(town, county, stateSlug);
  const city = county.nearestCity;

  // Neighboring communities in the same county: any city-page places
  // first (they're real neighbors too — chips link to the city pages),
  // then the county's other towns by population.
  const cityNeighbors = cityPagesInCounty(stateSlug, county.slug).map((r) => ({
    name: stateCfg.cities.find((c) => c.slug === r.city)?.name ?? r.city,
    href: `/${stateSlug}/${r.city}`,
  }));
  const townNeighbors = townsInCounty(stateSlug, county.slug)
    .filter((t) => t.slug !== town.slug)
    .slice(0, Math.max(3, 5 - cityNeighbors.length))
    .map((t) => ({
      name: t.name,
      href: `/${stateSlug}/${county.slug}/${t.slug}`,
    }));
  const neighbors = [...cityNeighbors, ...townNeighbors].slice(0, 5);

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
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: `${county.full}, ${stateCfg.name}`,
        containedInPlace: { "@type": "State", name: stateCfg.name },
      },
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
            <Link
              href={`/${stateSlug}/${county.slug}`}
              className="hover:text-brand-teal"
            >
              {county.full}
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{town.name}</span>
          </nav>
          <h1 className="font-display mt-4 max-w-3xl text-4xl sm:text-5xl">
            ABA therapy in {town.name}, {stateCfg.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {town.name} is {sizePhrase(town, stateCfg.name)} in{" "}
            <Link
              href={`/${stateSlug}/${county.slug}`}
              className="font-bold text-brand-teal hover:underline"
            >
              {county.full}
            </Link>{" "}
            — and it&rsquo;s in our service area. One-on-one, BCBA-led ABA
            therapy happens at your kitchen table, not a far-off clinic.{" "}
            {hubNote(town, county, stateCfg.name)}
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
        </div>
      </section>

      {/* ————— How care reaches this town + coverage card ————— */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-mint-wash p-6 sm:p-8">
            <h2 className="font-display text-2xl">
              How care reaches {town.name}
            </h2>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              In-home ABA is our starting point everywhere in{" "}
              {stateCfg.name}: a trained behavior technician comes to your
              home with a plan your BCBA wrote for your child, and parent
              coaching happens where you&rsquo;ll actually use it.
            </p>
            <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
              {city ? (
                <>
                  For families in {town.name} and the rest of{" "}
                  {county.full}, care is anchored by our{" "}
                  <Link
                    href={`/${stateSlug}/${city.slug}`}
                    className="font-bold text-brand-teal hover:underline"
                  >
                    {city.name} team
                  </Link>
                  , with telehealth adding BCBA time between visits.
                </>
              ) : (
                <>
                  Care is coordinated by our{" "}
                  <Link
                    href={`/${stateSlug}`}
                    className="font-bold text-brand-teal hover:underline"
                  >
                    {stateCfg.name} team
                  </Link>
                  , with telehealth adding BCBA time between visits.
                </>
              )}
            </p>
            <ul className="mt-4 space-y-1.5 text-[15px] font-semibold">
              <li>
                <Link href="/services/in-home-aba" className="text-brand-teal hover:underline">
                  In-home ABA therapy →
                </Link>
              </li>
              <li>
                <Link href="/services/telehealth" className="text-brand-teal hover:underline">
                  Telehealth &amp; parent coaching →
                </Link>
              </li>
              <li>
                <Link href="/services/daycare-based" className="text-brand-teal hover:underline">
                  Daycare-based support →
                </Link>
              </li>
              <li>
                <Link href="/services/parent-training" className="text-brand-teal hover:underline">
                  Parent training →
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-3xl bg-sun-wash p-6 sm:p-8">
            <h2 className="font-display text-2xl">{facts.heading}</h2>
            <ul className="mt-4 space-y-3">
              {facts.facts.map((fact) => (
                <li key={fact.slice(0, 40)} className="flex gap-2.5 text-[15px] leading-relaxed text-ink-soft">
                  <span aria-hidden="true" className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-meadow-wash text-meadow-deep">
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6.5L4.5 9L10 3" />
                    </svg>
                  </span>
                  {fact}
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[15px] text-ink-soft">
              How the benefit check works — and everything else about getting
              started — lives on our{" "}
              <Link href={`/${stateSlug}`} className="font-bold text-brand-teal hover:underline">
                {stateCfg.name} guide
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ————— County context + neighboring communities ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl">
            Part of how we serve {county.full}
          </h2>
          <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink-soft">
            {town.name} is one of the {county.full} communities our team
            covers — the county guide has the full picture, and these
            neighbors are served the same way.
          </p>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            <li>
              <Link
                href={`/${stateSlug}/${county.slug}`}
                className="rounded-full bg-ink px-4 py-2 text-[15px] font-semibold text-white"
              >
                {county.full} guide →
              </Link>
            </li>
            {neighbors.map((n) => (
              <li key={n.href}>
                <Link
                  href={n.href}
                  className="rounded-full border border-line bg-white px-4 py-2 text-[15px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
                >
                  {n.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={`/${stateSlug}`}
                className="rounded-full border border-line bg-white px-4 py-2 text-[15px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
              >
                All of {stateCfg.name}
              </Link>
            </li>
          </ul>
        </div>
      </section>

      {/* ————— Diagnosis + parent-questions funnel ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-cream p-6 shadow-card sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl">
                No diagnosis yet? Start there — we&rsquo;ll help.
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Many families come to us from {town.name} before any
                evaluation. We&rsquo;ll help you understand the signs, book a
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

      {/* ————— Town FAQs ————— */}
      <Faq
        items={faqs}
        heading={`${town.name} questions, answered plainly`}
      />

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

      <CtaBand
        tint="sky"
        heading="Ready to talk about your child?"
        body={`Families across ${county.full} and the rest of ${stateCfg.name} start with one short call. Yours can too.`}
      />
      <StickyCallBar callLabel={`Call the ${stateCfg.name} team`} />
    </>
  );
}
