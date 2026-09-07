import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "../../../components/CtaBand";
import JsonLd from "../../../components/JsonLd";
import { breadcrumbJsonLd } from "../../../lib/seo";
import LeadForm from "../../../components/LeadForm";
import StickyCallBar from "../../../components/StickyCallBar";
import { siteConfig } from "../../../../site.config";
import { getQuestion, questionPages } from "../../../data/questions";

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return questionPages.map((q) => ({ slug: q.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const q = getQuestion(slug);
  if (!q) return {};
  return {
    title: { absolute: `${q.metaTitle} | ${siteConfig.brandName}` },
    description: q.metaDescription,
    alternates: { canonical: `/questions/${q.slug}` },
  };
}

export default async function QuestionPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const q = getQuestion(slug);
  if (!q) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${siteConfig.domain}/questions/${q.slug}/#article`,
    headline: q.h1,
    description: q.metaDescription,
    author: { "@id": `${siteConfig.domain}/#organization` },
    publisher: { "@id": `${siteConfig.domain}/#organization` },
  };

  const midpoint = Math.ceil(q.sections.length / 2);
  const firstHalf = q.sections.slice(0, midpoint);
  const secondHalf = q.sections.slice(midpoint);

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: "Parent questions", path: "/questions" },
          { name: q.cardTitle },
        ])}
      />

      <article>
        <header className="bg-sun-wash">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 lg:pb-16 lg:pt-16">
            <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
              <Link href="/" className="hover:text-brand-teal">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/questions" className="hover:text-brand-teal">Parent questions</Link>
            </nav>
            <h1 className="font-display mt-4 max-w-3xl text-4xl sm:text-5xl">
              {q.h1}
            </h1>
            <p className="prose-measure mt-5 text-lg text-ink-soft">{q.intro}</p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <div className="prose-measure">
            {firstHalf.map((section) => (
              <section key={section.heading} className="mt-10 first:mt-0">
                <h2 className="font-display text-2xl sm:text-3xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 text-ink-soft">
                    {p}
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
                        <span className="text-ink-soft">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Mid-page intake CTA */}
          <aside className="mt-12 grid gap-8 rounded-3xl bg-ink p-6 sm:p-8 lg:max-w-4xl lg:grid-cols-2 lg:items-center">
            <div className="text-white">
              <h2 className="font-display text-2xl sm:text-3xl">
                {q.ctaHeading}
              </h2>
              <p className="mt-3 text-[15px] leading-relaxed text-white/75">
                {q.ctaBody}
              </p>
              <p className="mt-4 text-[15px] font-bold">
                <a href={siteConfig.phoneHref} className="text-sun hover:underline">
                  Call {siteConfig.phone}
                </a>{" "}
                <span className="font-semibold text-white/70">— a person answers.</span>
              </p>
            </div>
            <LeadForm
              compact
              heading="Talk to an advocate"
              subheading="Four fields, one callback — usually the same day."
              sourcePage={`question-${q.slug}`}
            />
          </aside>

          <div className="prose-measure">
            {secondHalf.map((section) => (
              <section key={section.heading} className="mt-10">
                <h2 className="font-display text-2xl sm:text-3xl">
                  {section.heading}
                </h2>
                {section.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)} className="mt-4 text-ink-soft">
                    {p}
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
                        <span className="text-ink-soft">{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))}
          </div>

          {/* Related questions */}
          <nav aria-label="More parent questions" className="mt-14 border-t border-line pt-8">
            <h2 className="font-display text-2xl">Keep reading</h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:max-w-3xl">
              {questionPages
                .filter((other) => other.slug !== q.slug)
                .slice(0, 4)
                .map((other) => (
                  <li key={other.slug}>
                    <Link
                      href={`/questions/${other.slug}`}
                      className="block rounded-2xl border border-line bg-white p-4 text-[15px] font-bold transition-colors hover:border-brand-teal/50 hover:text-brand-teal"
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
      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
