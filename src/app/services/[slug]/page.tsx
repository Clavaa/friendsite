import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "../../../components/CtaBand";
import LeadForm from "../../../components/LeadForm";
import PhotoPlaceholder from "../../../components/PhotoPlaceholder";
import StickyCallBar from "../../../components/StickyCallBar";
import { siteConfig } from "../../../../site.config";
import { getService, services } from "../../../data/services";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbJsonLd } from "../../../lib/seo";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: { absolute: `${s.metaTitle} | ${siteConfig.brandName}` },
    description: s.metaDescription,
    alternates: { canonical: `/services/${s.slug}` },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: "Services", path: "/services" },
          { name: s.name },
        ])}
      />
      <header className={s.tintClass}>
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-16 lg:pt-16">
          <div>
            <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
              <Link href="/" className="hover:text-brand-teal">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/services" className="hover:text-brand-teal">Services</Link>
            </nav>
            <h1 className="font-display mt-4 text-4xl sm:text-5xl">{s.h1}</h1>
            <p className="prose-measure mt-4 text-lg text-ink-soft">{s.intro}</p>
          </div>
          {/* Photo slot intent varies by service — bright daylight interiors
              or Colorado outdoor light, clinician-in-frame with lanyard.
              Services without a well-matching real photo keep the styled
              placeholder rather than forcing a mismatch. */}
          {s.photo ? (
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl">
              <Image
                src={s.photo.src}
                alt={s.photo.alt}
                fill
                sizes="(min-width: 1024px) 36rem, 100vw"
                className="object-cover"
              />
            </div>
          ) : (
            <PhotoPlaceholder
              intent={`${s.name}: clinician and child mid-session, daylight, lanyard visible`}
              className="aspect-[4/3] w-full"
            />
          )}
        </div>
      </header>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_20rem]">
          <div className="prose-measure">
            {s.sections.map((section) => (
              <div key={section.heading} className="mt-10 first:mt-0">
                <h2 className="font-display text-2xl sm:text-3xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 text-ink-soft">
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>
          <aside>
            <div className="rounded-3xl bg-cream p-6">
              <h2 className="font-display text-xl">A good fit when…</h2>
              <ul className="mt-4 space-y-3">
                {s.bestFor.map((item) => (
                  <li key={item} className="flex gap-2.5 text-[15px] leading-snug">
                    <span className="mt-0.5 grid h-5.5 w-5.5 shrink-0 place-items-center rounded-full bg-meadow-wash text-meadow-deep">
                      <svg aria-hidden="true" width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.5 7.5l3 3 6-7" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/getting-started"
                className="mt-6 block rounded-full bg-brand-teal px-5 py-3 text-center text-[15px] font-bold text-white transition-colors hover:bg-brand-teal-deep"
              >
                Book a free consult
              </Link>
            </div>
            <nav aria-label="Other services" className="mt-6 rounded-3xl border border-line p-6">
              <h2 className="text-sm font-bold tracking-wide text-ink-soft">
                Other services
              </h2>
              <ul className="mt-3 space-y-2 text-[15px] font-semibold">
                {services
                  .filter((other) => other.slug !== s.slug)
                  .map((other) => (
                    <li key={other.slug}>
                      <Link
                        href={`/services/${other.slug}`}
                        className="text-brand-teal hover:underline"
                      >
                        {other.cardTitle}
                      </Link>
                    </li>
                  ))}
              </ul>
            </nav>
          </aside>
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">
              Wondering if {s.name.toLowerCase()} fits your child?
            </h2>
            <p className="mt-4 text-white/75">
              That&rsquo;s exactly the conversation our intake advocates have
              all day. Fifteen minutes, no commitment, and an honest answer —
              including &ldquo;a different setting would serve your child
              better.&rdquo;
            </p>
          </div>
          <LeadForm
            compact
            heading="Ask about this service"
            subheading="A real person calls you back — usually the same day."
            sourcePage={`service-${s.slug}`}
          />
        </div>
      </section>

      <CtaBand tint="sky" />
      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
