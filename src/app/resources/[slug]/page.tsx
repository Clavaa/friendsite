import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "../../../components/CtaBand";
import { faqJsonLd } from "../../../components/Faq";
import JsonLd from "../../../components/JsonLd";
import ReviewedBy, { reviewedByJsonLd } from "../../../components/ReviewedBy";
import StickyCallBar from "../../../components/StickyCallBar";
import { breadcrumbJsonLd } from "../../../lib/seo";
import { siteConfig } from "../../../../site.config";
import {
  getGuide,
  guides,
  startHereGuides,
  type Guide,
} from "../../../data/guides";

/**
 * Guide copy supports lightweight inline links written as [text](/path)
 * — enough for the contextual guide-to-guide and guide-to-state mesh
 * without dragging markdown into the data layer. FAQ answers stay plain
 * text on purpose (they're mirrored verbatim into FAQPage JSON-LD).
 */
function renderInline(text: string): React.ReactNode {
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <Link
        key={key++}
        href={m[2]}
        className="font-bold text-brand-teal hover:underline"
      >
        {m[1]}
      </Link>
    );
    last = m.index + m[0].length;
  }
  if (parts.length === 0) return text;
  if (last < text.length) parts.push(text.slice(last));
  return parts;
}

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: { absolute: `${g.metaTitle} | ${siteConfig.brandName}` },
    description: g.metaDescription,
    alternates: { canonical: `/resources/${g.slug}` },
  };
}

/**
 * A single parent guide: evergreen help article (no dates, no bylines).
 * Distinct from /questions on purpose — mint header with a reading-time
 * chip, a "start here" path rail when the guide belongs to it, and a
 * definition-list layout for the glossary guide.
 */
export default async function GuidePage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteConfig.domain}/resources/${g.slug}/#article`,
    headline: g.h1,
    description: g.metaDescription,
    author: { "@id": `${siteConfig.domain}/#organization` },
    publisher: { "@id": `${siteConfig.domain}/#organization` },
    reviewedBy: reviewedByJsonLd,
  };

  const pathIndex = startHereGuides.findIndex((s) => s.slug === g.slug);
  const nextInPath =
    pathIndex >= 0 && pathIndex < startHereGuides.length - 1
      ? startHereGuides[pathIndex + 1]
      : undefined;

  const related: Guide[] = g.related
    ? g.related
        .map((slug) => getGuide(slug))
        .filter((other): other is Guide => Boolean(other))
    : guides.filter((other) => other.slug !== g.slug).slice(0, 4);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      {g.faqs && <JsonLd data={faqJsonLd(g.faqs)} />}
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: "Parent resources", path: "/resources" },
          { name: g.cardTitle },
        ])}
      />

      <article>
        <header className="bg-mint-wash">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 lg:pb-16 lg:pt-16">
            <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
              <Link href="/" className="hover:text-brand-teal">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/resources" className="hover:text-brand-teal">Parent resources</Link>
            </nav>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-white px-3.5 py-1.5 text-[12.5px] font-extrabold uppercase tracking-[0.1em] text-brand-teal shadow-chip">
                {pathIndex >= 0
                  ? `Start-here guide · ${pathIndex + 1} of ${startHereGuides.length}`
                  : "Parent guide"}
              </span>
              <span className="text-[13.5px] font-bold text-ink-soft">
                {g.minutes}-minute read
              </span>
            </div>
            <h1 className="font-display mt-5 max-w-3xl text-4xl sm:text-5xl">
              {g.h1}
            </h1>
            <ReviewedBy className="mt-5" />
            <p className="prose-measure mt-5 text-lg leading-relaxed text-ink-soft">
              {renderInline(g.intro)}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          {/* Regular guide body */}
          {g.sections.length > 0 && (
            <div className="prose-measure">
              {g.sections.map((section) => (
                <section key={section.heading} className="mt-10 first:mt-0">
                  <h2 className="font-display text-2xl sm:text-3xl">
                    {section.heading}
                  </h2>
                  {section.paragraphs.map((p) => (
                    <p key={p.slice(0, 40)} className="mt-4 text-ink-soft">
                      {renderInline(p)}
                    </p>
                  ))}
                  {section.list && (
                    <ul className="mt-4 space-y-2.5">
                      {section.list.map((item) => (
                        <li key={item} className="flex gap-3">
                          <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-meadow-wash text-meadow-deep">
                            <svg aria-hidden="true" width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M2.5 7.5l3 3 6-7" />
                            </svg>
                          </span>
                          <span className="text-ink-soft">{renderInline(item)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}

          {/* Glossary layout */}
          {g.terms && (
            <dl className="mt-2 grid content-start gap-5 lg:grid-cols-2">
              {g.terms.map((t) => (
                <div
                  key={t.term}
                  className="rounded-r-3xl border-l-4 border-brand-teal bg-white p-6 shadow-card sm:p-7"
                >
                  <dt className="font-display text-[1.25rem] leading-snug">
                    {t.term}
                  </dt>
                  <dd className="mt-2.5 text-[15.5px] leading-relaxed text-ink-soft">
                    {t.def}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* On-page FAQ (mirrored into FAQPage JSON-LD above) */}
          {g.faqs && (
            <section aria-label="Questions parents ask" className="mt-14 lg:max-w-3xl">
              <h2 className="font-display text-2xl sm:text-3xl">
                Questions parents ask
              </h2>
              <div className="mt-6 grid gap-3">
                {g.faqs.map((item) => (
                  <details
                    key={item.q}
                    className="group rounded-2xl bg-white shadow-card open:shadow-card-lg"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-bold [&::-webkit-details-marker]:hidden">
                      {item.q}
                      <span
                        aria-hidden="true"
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun-wash text-brand-teal transition-transform group-open:rotate-45"
                      >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                          <path d="M7 2v10M2 7h10" />
                        </svg>
                      </span>
                    </summary>
                    <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}

          {/* Next step in the start-here path, or the soft help card */}
          {nextInPath ? (
            <aside className="mt-14 rounded-3xl bg-mint-wash p-7 sm:p-9 lg:max-w-3xl">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-teal">
                Next in the path
              </p>
              <h2 className="font-display mt-3 text-2xl sm:text-[1.8rem]">
                {nextInPath.cardTitle}
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
                {nextInPath.cardBlurb}
              </p>
              <Link
                href={`/resources/${nextInPath.slug}`}
                className="btn-pill mt-6 inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-brand-teal px-7 text-[15px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep"
              >
                Keep reading
                <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 3l5 5-5 5" />
                </svg>
              </Link>
            </aside>
          ) : g.cta ? (
            <aside className="mt-14 rounded-3xl bg-sun-wash p-7 sm:p-9 lg:max-w-3xl">
              <h2 className="font-display text-2xl sm:text-[1.8rem]">
                {g.cta.heading}
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
                {renderInline(g.cta.body)}
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={g.cta.primaryHref}
                  className="btn-pill inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-brand-teal px-7 text-[15px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep"
                >
                  {g.cta.primaryLabel}
                </Link>
                <a
                  href={siteConfig.phoneHref}
                  className="btn-pill inline-flex h-12 items-center justify-center rounded-full border-2 border-ink/70 px-7 text-[15px] font-extrabold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  Call {siteConfig.phone}
                </a>
              </div>
            </aside>
          ) : (
            <aside className="mt-14 rounded-3xl bg-sun-wash p-7 sm:p-9 lg:max-w-3xl">
              <h2 className="font-display text-2xl sm:text-[1.8rem]">
                Rather just ask a person?
              </h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
                Guides are general; your child is specific. An intake advocate
                can answer for your family — coverage, timing, and what to do
                next — in one 15-minute call.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/getting-started"
                  className="btn-pill inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-brand-teal px-7 text-[15px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep"
                >
                  Match me with an advocate
                </Link>
                <a
                  href={siteConfig.phoneHref}
                  className="btn-pill inline-flex h-12 items-center justify-center rounded-full border-2 border-ink/70 px-7 text-[15px] font-extrabold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  Call {siteConfig.phone}
                </a>
              </div>
            </aside>
          )}

          {/* Related guides */}
          <nav aria-label="More parent guides" className="mt-14 border-t border-line pt-8">
            <h2 className="font-display text-2xl">More guides</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
              {related.map((other) => (
                <li key={other.slug}>
                  <Link
                    href={`/resources/${other.slug}`}
                    className="block h-full rounded-2xl border border-line bg-white p-4 text-[15px] font-bold transition-colors hover:border-brand-teal/50 hover:text-brand-teal"
                  >
                    {other.cardTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </article>

      <CtaBand tint="sky" />
      <StickyCallBar callLabel="Call the team" />
    </>
  );
}
