import Link from "next/link";
import CtaBand from "../../../../components/CtaBand";
import Faq, { faqJsonLd } from "../../../../components/Faq";
import JsonLd from "../../../../components/JsonLd";
import LeadForm from "../../../../components/LeadForm";
import StickyCallBar from "../../../../components/StickyCallBar";
import { LinkChips, LocalSections, guideShelf } from "../../../../components/local/LocalBlocks";
import { siteConfig, type StateSlug } from "../../../../../site.config";
import { buildCityService } from "../../../../lib/cityServiceCopy";
import { hashSeed } from "../../../../lib/local";
import { CITY_SERVICES, cityJobsFor, type CityService } from "../../../../lib/metro";
import { breadcrumbJsonLd } from "../../../../lib/seo";

/** Lowercase the first letter only — keeps "ABA" capitalized mid-sentence. */
const lowerFirst = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

/** /{state}/{city}/{service} — e.g. /colorado/colorado-springs/in-home-aba-therapy. */
export default function CityServiceView({
  stateSlug,
  city,
  svc,
}: {
  stateSlug: StateSlug;
  city: { name: string; slug: string };
  svc: CityService;
}) {
  const stateCfg = siteConfig.states[stateSlug];
  const { sections, faqs } = buildCityService(stateSlug, city, svc);
  const h1 = svc.h1.replace("{city}", `${city.name}, ${stateCfg.abbr}`);
  const seed = hashSeed(`${stateSlug}/${city.slug}/${svc.slug}`);
  const url = `${siteConfig.domain}/${stateSlug}/${city.slug}/${svc.slug}`;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${url}/#service`,
    name: `${svc.label} in ${city.name}, ${stateCfg.abbr}`,
    serviceType: svc.label,
    url,
    provider: { "@id": `${siteConfig.domain}/#organization` },
    areaServed: { "@type": "City", name: `${city.name}, ${stateCfg.abbr}` },
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: stateCfg.name, path: `/${stateSlug}` },
          { name: city.name, path: `/${stateSlug}/${city.slug}` },
          { name: svc.label },
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
            <span aria-current="page">{svc.label}</span>
          </nav>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[14px] font-bold text-brand-teal shadow-card">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-meadow" />
            Sunbird ABA team in {city.name} — serving you
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl sm:text-5xl">{h1}</h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {svc.slug === "autism-evaluation"
              ? `Think your child might be autistic? Here's how ${city.name} families get an evaluation — and how we help you get from "something's different" to a plan, with insurance checked free along the way.`
              : `BCBA-led ${lowerFirst(svc.label)} for ${city.name} families — at home, at daycare, or by video — with a free insurance check and a real person on the phone.`}
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

      <LocalSections sections={sections} />

      <Faq items={faqs} heading={`${svc.label} in ${city.name}: questions parents ask`} />

      <section id="intake" className="bg-ink scroll-mt-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">Start in {city.name} with one short call</h2>
            <p className="mt-4 text-white/75">
              Tell us your ZIP code and what you&rsquo;re seeing. An intake advocate calls back — usually the
              same business day — with your coverage answer and an honest start timeline.
            </p>
          </div>
          <LeadForm
            heading={`Get matched in ${city.name}`}
            subheading="Four quick fields. A real person calls you back."
            sourcePage={`city-service-${stateSlug}-${city.slug}-${svc.slug}`}
          />
        </div>
      </section>

      <LinkChips
        heading={`More for ${city.name} families`}
        items={[
          { name: `ABA therapy in ${city.name} →`, href: `/${stateSlug}/${city.slug}` },
          ...CITY_SERVICES.filter((s) => s.slug !== svc.slug).map((s) => ({
            name: `${s.label} in ${city.name}`,
            href: `/${stateSlug}/${city.slug}/${s.slug}`,
          })),
          ...cityJobsFor(stateSlug, city.slug).map((j) => ({
            name: `${j.role.toUpperCase()} jobs in ${city.name}`,
            href: `/careers/${j.slug}`,
          })),
        ]}
        tint="bg-cream"
      />
      <LinkChips
        heading={`${svc.label} in other cities`}
        items={(["kansas", "colorado"] as StateSlug[]).flatMap((st) =>
          siteConfig.states[st].cities
            .filter((c) => !(st === stateSlug && c.slug === city.slug))
            .map((c) => ({ name: `${svc.label} in ${c.name}`, href: `/${st}/${c.slug}/${svc.slug}` }))
        )}
        tint="bg-white"
      />
      <LinkChips heading="Guides parents read next" items={guideShelf(seed)} tint="bg-cream" />

      <CtaBand tint="sky" heading="Ready to talk about your child?" body={`${city.name} families start with one short call. Yours can too.`} />
      <StickyCallBar callLabel={`Call the ${city.name} team`} />
    </>
  );
}
