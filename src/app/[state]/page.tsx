import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CountyChips from "../../components/CountyChips";
import CtaBand from "../../components/CtaBand";
import Faq, { faqJsonLd } from "../../components/Faq";
import JsonLd from "../../components/JsonLd";
import LeadForm from "../../components/LeadForm";
import ProofChip from "../../components/ProofChip";
import StickyCallBar from "../../components/StickyCallBar";
import { siteConfig, isStateSlug, stateSlugs } from "../../../site.config";
import { stateContent } from "../../data/states";
import { countiesByState, getCounty } from "../../data/counties";
import { townsByState } from "../../data/towns";
import {
  autismEstimate,
  cityLocal,
  fmt,
  placeLocal,
  stateTotals,
} from "../../lib/local";
import { breadcrumbJsonLd } from "../../lib/seo";

/** Hero photo per state — honest, descriptive alt text; no client/staff claims. */
const statePhotos = {
  kansas: {
    src: "/images/family-puzzle-kitchen.jpg",
    alt: "Two women and a young boy working on a colorful shape puzzle together at a sunny kitchen table",
  },
  colorado: {
    src: "/images/fruit-snack-kitchen.jpg",
    alt: "A woman and a young girl putting together a fruit snack at a bright kitchen table with a sunlit backyard behind them",
  },
} as const;

interface Params {
  state: string;
}

export function generateStaticParams(): Params[] {
  return stateSlugs.map((state) => ({ state }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { state } = await params;
  if (!isStateSlug(state)) return {};
  const content = stateContent[state];
  return {
    title: { absolute: `${content.metaTitle} | ${siteConfig.brandName}` },
    description: content.metaDescription,
    alternates: { canonical: `/${state}` },
  };
}

export default async function StatePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { state } = await params;
  if (!isStateSlug(state)) notFound();

  const content = stateContent[state];
  const config = siteConfig.states[state];
  const firstCity = config.cities[0].name;

  // Local-data layer: statewide totals, each team's counties, biggest towns.
  const totals = stateTotals(state);
  const townCount = townsByState[state].towns.length + config.cities.length;
  const regions = config.cities.map((c) => {
    const cl = cityLocal(state, c.slug);
    return {
      slug: c.slug,
      name: c.name,
      kids: cl?.stats?.under18 ?? 0,
      counties: (cl?.countiesServed ?? [])
        .map((s) => getCounty(state, s))
        .filter((x): x is NonNullable<typeof x> => Boolean(x)),
    };
  });
  const largest = [
    ...config.cities.map((c) => ({
      name: c.name,
      href: `/${state}/${c.slug}`,
      pop: cityLocal(state, c.slug)?.stats?.pop ?? 0,
    })),
    ...townsByState[state].towns.map((t) => ({
      name: t.name,
      href: `/${state}/${t.county}/${t.slug}`,
      pop: placeLocal(state, t.county, t.slug)?.stats?.pop ?? t.pop,
    })),
  ]
    .sort((a, b) => b.pop - a.pop)
    .slice(0, 30);

  const clinicJsonLd = {
    "@context": "https://schema.org",
    "@type": "MedicalClinic",
    "@id": `${siteConfig.domain}/${state}/#clinic`,
    name: `${siteConfig.brandName} — ${content.name}`,
    url: `${siteConfig.domain}/${state}`,
    telephone: siteConfig.phone,
    medicalSpecialty: "Psychiatric",
    areaServed: { "@type": "State", name: content.name },
    parentOrganization: { "@id": `${siteConfig.domain}/#organization` },
  };

  return (
    <>
      <JsonLd data={clinicJsonLd} />
      <JsonLd data={faqJsonLd(content.faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: content.name },
        ])}
      />

      {/* ————— State hero ————— */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:pb-20 lg:pt-16">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
              <Link href="/" className="hover:text-brand-teal">Home</Link>
              <span aria-hidden="true"> / </span>
              <span aria-current="page">{content.name}</span>
            </nav>
            <h1 className="font-display display-xl mt-5 text-4xl sm:text-6xl lg:text-[4.25rem]">
              {content.heroHeadline}
            </h1>
            <p className="mt-4 max-w-xl text-lg text-ink-soft">{content.heroSub}</p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {config.cities.map((city) => (
                <Link
                  key={city.slug}
                  href={`/${state}/${city.slug}`}
                  className="rounded-full border border-line bg-white px-4 py-2 text-[15px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
                >
                  {city.name}
                  {"displaySuffix" in city && city.displaySuffix ? `, ${city.displaySuffix}` : ""}
                </Link>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
              <Image
                src={statePhotos[state].src}
                alt={statePhotos[state].alt}
                fill
                sizes="(min-width: 1024px) 40rem, 100vw"
                className="object-cover"
              />
            </div>
            <ProofChip className="absolute -bottom-4 left-4">
              {content.name} families welcome
            </ProofChip>
          </div>
        </div>
      </section>

      {/* ————— Coverage, kept honest and simple ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <p className="text-sm font-bold tracking-wide text-brand-teal">
              Paying for therapy in {content.name}
            </p>
            <h2 className="font-display mt-2 text-3xl sm:text-4xl">
              {content.coverageHeading}
            </h2>
            {content.coverageBody.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ————— The free benefit check, step by step ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <h2 className="font-display text-3xl sm:text-4xl">
              {content.benefitCheckHeading}
            </h2>
            <p className="mt-4 text-ink-soft">{content.benefitCheckIntro}</p>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {content.benefitCheckSteps.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-3xl bg-white p-6 shadow-card">
                <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-teal text-lg text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg leading-snug">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ————— Getting started, step by step ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <h2 className="font-display text-3xl sm:text-4xl">
              {content.startHeading}
            </h2>
            <p className="mt-4 text-ink-soft">{content.startIntro}</p>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-2 lg:max-w-4xl">
            {content.startSteps.map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-3xl bg-cream p-6">
                <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ink text-lg text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg leading-snug">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ————— Promise + expectations, two-up ————— */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-10">
          <div className="rounded-3xl bg-sun-wash p-6 sm:p-8">
            <h2 className="font-display text-2xl sm:text-3xl">
              {content.promiseHeading}
            </h2>
            {content.promiseBody.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          </div>
          <div className="rounded-3xl bg-mint-wash p-6 sm:p-8">
            <h2 className="font-display text-2xl sm:text-3xl">
              {content.expectHeading}
            </h2>
            {content.expectBody.map((p) => (
              <p key={p.slice(0, 40)} className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Mid-page intake ————— */}
      <section className="bg-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">
              Skip the phone tree. Start with a person.
            </h2>
            <p className="mt-4 text-white/75">
              Whatever card is in your wallet, the next step is the same
              15-minute conversation. We verify your exact benefits free and
              tell you your honest start timeline in {content.name}.
            </p>
            <p className="mt-4 font-bold">
              <a href={siteConfig.phoneHref} className="text-sun hover:underline">
                Or call {siteConfig.phone}
              </a>{" "}
              <span className="font-semibold text-white/70">— a person answers.</span>
            </p>
            <p className="mt-6 rounded-2xl bg-white/10 px-5 py-4 text-[15px] text-white/85">
              No diagnosis yet? We help {content.name} families book a
              diagnostic evaluation too.{" "}
              <Link
                href="/get-a-diagnosis"
                className="font-bold text-sun hover:underline"
              >
                Start here &rarr;
              </Link>{" "}
              Still at the wondering stage? Read the{" "}
              <Link
                href="/resources/signs-of-autism-at-age-2"
                className="font-bold text-sun hover:underline"
              >
                signs of autism at age 2
              </Link>{" "}
              or{" "}
              <Link
                href="/resources/signs-of-autism-at-18-months"
                className="font-bold text-sun hover:underline"
              >
                at 18 months
              </Link>
              .
            </p>
          </div>
          <LeadForm
            heading={`Start in ${content.name}`}
            subheading="Four quick fields. An intake advocate calls you back, usually the same day."
            sourcePage={`state-${state}`}
          />
        </div>
      </section>

      <Faq
        items={[...content.faqs]}
        heading={`${content.name} questions, answered plainly`}
      />

      {/* ————— Statewide numbers + team regions (local-data layer) ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl">
            {content.name} by the numbers — and the team near you
          </h2>
          <p className="mt-3 max-w-3xl text-ink-soft">
            About {fmt(totals.under18)} children live in {content.name}, including{" "}
            {fmt(totals.under5)} under age 5. At the CDC&rsquo;s estimate of 1 in 31,
            that is roughly {fmt(autismEstimate(totals.under18))} kids who may be on
            the autism spectrum — in big cities and in towns of a few hundred people.
            Every county has its own page with local numbers, schools and ZIP codes.
          </p>
          <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ["Children under 18", fmt(totals.under18)],
              ["Children under 5", fmt(totals.under5)],
              ["Counties we serve", String(countiesByState[state].length)],
              ["Communities with a page", fmt(townCount)],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-white p-4">
                <dt className="text-[13px] font-semibold text-ink-soft">{label}</dt>
                <dd className="font-display mt-1 text-2xl">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-[12.5px] text-ink-soft">
            Census ACS 2023 5-year estimates; CDC 1-in-31 prevalence applied as a planning figure.
          </p>

          <h3 className="font-display mt-12 text-2xl">
            Our {config.cities.length} {content.name} teams and the counties they cover
          </h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {regions.map((r) => (
              <div key={r.slug} className="rounded-3xl bg-white p-6 shadow-card">
                <Link href={`/${state}/${r.slug}`} className="font-display text-xl text-brand-teal hover:underline">
                  {r.name} team →
                </Link>
                {r.kids > 0 && (
                  <p className="mt-1 text-[13px] font-semibold text-ink-soft">
                    {fmt(r.kids)} kids in the city itself
                  </p>
                )}
                <ul className="mt-3 flex flex-wrap gap-x-3 gap-y-1.5 text-[14.5px]">
                  {r.counties.map((c) => (
                    <li key={c.slug}>
                      <Link href={`/${state}/${c.slug}`} className="font-semibold hover:text-brand-teal hover:underline">
                        {c.full}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <h3 className="font-display mt-12 text-2xl">Largest {content.name} communities we serve</h3>
          <ul className="mt-4 flex flex-wrap gap-2.5">
            {largest.map((t) => (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className="rounded-full border border-line bg-white px-4 py-2 text-[15px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
                >
                  {t.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ————— Counties we serve ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <h2 className="font-display text-3xl sm:text-4xl">
              ABA therapists who come to you, in every {content.name} county
            </h2>
            <p className="mt-3 text-ink-soft">
              Our ABA therapists drive to families&rsquo; homes, and
              telehealth reaches the corners the car doesn&rsquo;t. Find your
              county for local coverage details, the nearest team, and honest
              answers about getting started where you live.
            </p>
          </div>
          {/* Collapsed chip wall (client feedback): ~12 biggest counties
              visible, the rest behind an accessible expander. All county
              links stay server-rendered for SEO — see CountyChips. */}
          <CountyChips
            state={state}
            counties={countiesByState[state].map((c) => ({
              slug: c.slug,
              full: c.full,
              pop: c.pop,
            }))}
          />
        </div>
      </section>

      <CtaBand
        tint="sky"
        heading={`Ready to talk about your child?`}
        body={`Families across ${config.cities.map((c) => c.name).slice(0, 3).join(", ")} and beyond start with one short call. Yours can too.`}
      />
      <StickyCallBar callLabel={`Call the ${firstCity} team`} />
    </>
  );
}
