import Link from "next/link";
import CtaBand from "../../../components/CtaBand";
import Faq, { faqJsonLd } from "../../../components/Faq";
import JsonLd from "../../../components/JsonLd";
import LeadForm from "../../../components/LeadForm";
import StickyCallBar from "../../../components/StickyCallBar";
import { siteConfig, type StateSlug } from "../../../../site.config";
import { type FaqItem } from "../../../data/states";
import {
  formatPop,
  getCounty,
  type CountyEntry,
} from "../../../data/counties";
import { breadcrumbJsonLd } from "../../../lib/seo";

/**
 * County page: real substance per county — population, the inherited
 * state Medicaid facts (condensed, not a state-page copy), in-home
 * service framing, the nearest served city, county FAQs with schema,
 * and neighbor-county links so no county page is a dead end.
 */

/**
 * Condensed coverage card — deliberately vague per the client's rule:
 * no program specifics, no waiver detail. Everything routes to the free
 * benefit check.
 */
const coverageCard: Record<StateSlug, { heading: string; facts: string[] }> = {
  kansas: {
    heading: "Paying for ABA — the short version",
    facts: [
      "Coverage varies by plan, so we check yours instead of guessing — the benefit check is free.",
      "Most Kansas families pay little or nothing once benefits are confirmed, Medicaid or private.",
      "Send one photo of your insurance card; we verify your ABA benefits directly with your plan.",
      "You get a plain-English answer — what's covered, what you'd owe, what happens next — usually within a business day.",
    ],
  },
  colorado: {
    heading: "Paying for ABA — the short version",
    facts: [
      "Coverage varies by plan, so we check yours instead of guessing — the benefit check is free.",
      "Most Colorado families pay little or nothing once benefits are confirmed, Medicaid or private.",
      "Send one photo of your insurance card; we verify your ABA benefits directly with your plan.",
      "You get a plain-English answer — what's covered, what you'd owe, what happens next — usually within a business day.",
    ],
  },
};

function regionNote(county: CountyEntry, stateName: string): string {
  const city = county.nearestCity;
  if (!city) {
    return `Our ${stateName} team serves families statewide, with in-home visits and telehealth closing the distance.`;
  }
  if (city.hops <= 1) {
    return `${city.name} is right nearby, so most ${county.full} families are matched with our ${city.name}-area team — and sessions still happen at your home, not ours.`;
  }
  if (city.hops <= 3) {
    return `Our closest hub is ${city.name}. In-home therapy travels from there, and telehealth keeps BCBA time easy to schedule between visits.`;
  }
  return `${county.full} sits a real drive from our ${city.name} hub, so we lean on in-home visits and telehealth to close the distance — and we're always honest about start timelines in your part of ${stateName}.`;
}

function countyFaqs(county: CountyEntry, stateSlug: StateSlug): FaqItem[] {
  const stateName = siteConfig.states[stateSlug].name;
  const city = county.nearestCity;
  const faqs: FaqItem[] = [];

  faqs.push({
    q: `Does insurance cover ABA therapy in ${county.full}?`,
    a: `Coverage depends on your plan, not your county — and rather than guess at yours, we check it for free. Most ${stateName} families pay little or nothing once benefits are confirmed, Medicaid or private. Send us a photo of your insurance card and we'll tell you exactly where you stand, usually within a business day.`,
  });

  faqs.push({
    q: `Do you offer in-home ABA in ${county.full}?`,
    a: city
      ? `In-home therapy is the heart of how we serve ${county.full} — our team comes to your home rather than asking you to drive to us. ${
          city.hops <= 1
            ? `Our nearby ${city.name} team anchors care in this area,`
            : `Our nearest hub is ${city.name},`
        } and telehealth keeps BCBA support easy to schedule between visits.`
      : `In-home therapy is the heart of how we serve ${county.full} — our team comes to your home rather than asking you to drive to us, and telehealth keeps BCBA support easy to schedule between visits.`,
  });

  faqs.push({
    q: `My child doesn't have a diagnosis yet. Can we still start from ${county.full}?`,
    a: `Yes — that's exactly where many ${stateName} families begin. We help you book a diagnostic evaluation first, then move straight into coverage and therapy once the diagnosis is in hand. Start with our get-a-diagnosis guide or call us and we'll map the path together.`,
  });

  if (county.pop >= 100000) {
    faqs.push({
      q: `How fast can we start in ${county.full}?`,
      a: `It depends on your child's plan and our current ${
        city ? `${city.name}-area` : stateName
      } capacity, so we won't quote a number we can't keep. Tell us your zip code and schedule, and an intake advocate gives you an honest start timeline — usually on the first call.`,
    });
  } else {
    faqs.push({
      q: `We live in a rural part of ${county.full}. Does that change anything?`,
      a: `It changes logistics, not whether we can help. With about ${formatPop(county.pop)} residents, ${county.full} is exactly the kind of community our in-home and telehealth model was built for — sessions come to you, and your BCBA stays close by video between visits. We'll be upfront about travel and timelines for your address.`,
    });
  }

  return faqs;
}

export default function CountyView({
  stateSlug,
  county,
}: {
  stateSlug: StateSlug;
  county: CountyEntry;
}) {
  const stateCfg = siteConfig.states[stateSlug];
  const facts = coverageCard[stateSlug];
  const faqs = countyFaqs(county, stateSlug);
  const city = county.nearestCity;
  const neighbors = county.neighbors
    .map((slug) => getCounty(stateSlug, slug))
    .filter((c): c is CountyEntry => Boolean(c));

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
          <h1 className="font-display mt-4 max-w-3xl text-4xl sm:text-5xl">
            ABA therapy in {county.full}, {stateCfg.name}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            Our team comes to families across {county.full} — home to about{" "}
            {formatPop(county.pop)} people — with one-on-one, BCBA-led ABA
            therapy at your kitchen table, not a far-off clinic.{" "}
            {regionNote(county, stateCfg.name)}
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

      {/* ————— How care reaches this county + condensed Medicaid card ————— */}
      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div className="rounded-3xl bg-mint-wash p-6 sm:p-8">
            <h2 className="font-display text-2xl">
              How care reaches {county.full}
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
                  For {county.full} families, care is anchored by our{" "}
                  <Link
                    href={`/${stateSlug}/${city.slug}`}
                    className="font-bold text-brand-teal hover:underline"
                  >
                    {city.name} team
                  </Link>
                  , with telehealth adding BCBA time between visits — useful
                  anywhere, essential in the farther corners of the county.
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

      {/* ————— Diagnosis funnel ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col items-start gap-6 rounded-3xl bg-white p-6 shadow-card sm:p-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl">
                No diagnosis yet? Start there — we&rsquo;ll help.
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                Many {county.full} families come to us before any evaluation.
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

      {/* ————— County FAQs ————— */}
      <Faq
        items={faqs}
        heading={`${county.full} questions, answered plainly`}
      />

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

      {/* ————— Neighboring counties ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="font-display text-2xl">
            Nearby counties we also serve
          </h2>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {neighbors.map((n) => (
              <li key={n.slug}>
                <Link
                  href={`/${stateSlug}/${n.slug}`}
                  className="rounded-full border border-line bg-white px-4 py-2 text-[15px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
                >
                  {n.full}
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

      <CtaBand
        tint="sky"
        heading="Ready to talk about your child?"
        body={`Families across ${county.full} and the rest of ${stateCfg.name} start with one short call. Yours can too.`}
      />
      <StickyCallBar callLabel={`Call the ${stateCfg.name} team`} />
    </>
  );
}
