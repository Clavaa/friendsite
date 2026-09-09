import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "../../components/CtaBand";
import Faq, { faqJsonLd } from "../../components/Faq";
import JsonLd from "../../components/JsonLd";
import LeadForm from "../../components/LeadForm";
import ProofChip from "../../components/ProofChip";
import StickyCallBar from "../../components/StickyCallBar";
import { siteConfig, isStateSlug, stateSlugs } from "../../../site.config";
import { stateContent } from "../../data/states";
import { countiesByState } from "../../data/counties";
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
              </Link>
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

      {/* ————— Counties we serve ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <h2 className="font-display text-3xl sm:text-4xl">
              Counties we serve in {content.name}
            </h2>
            <p className="mt-3 text-ink-soft">
              In-home therapy and telehealth reach every county in{" "}
              {content.name}. Find yours for local coverage details, the
              nearest team, and honest answers about getting started where
              you live.
            </p>
          </div>
          <ul className="mt-8 flex flex-wrap gap-2">
            {countiesByState[state].map((county) => (
              <li key={county.slug}>
                <Link
                  href={`/${state}/${county.slug}`}
                  className="inline-block rounded-full border border-line bg-cream px-3.5 py-1.5 text-[14px] font-semibold text-ink-soft transition-colors hover:border-brand-teal hover:text-brand-teal"
                >
                  {county.full}
                </Link>
              </li>
            ))}
          </ul>
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
