import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "../../components/CtaBand";
import JsonLd from "../../components/JsonLd";
import StickyCallBar from "../../components/StickyCallBar";
import { breadcrumbJsonLd } from "../../lib/seo";
import { siteConfig } from "../../../site.config";
import { everydayGuides, startHereGuides } from "../../data/guides";
import { questionPages } from "../../data/questions";

export const metadata: Metadata = {
  title: "Parent resources: plain-words ABA guides",
  description:
    "Free, plain-words guides for parents of children with autism in Kansas and Colorado — what ABA is, first steps after a diagnosis, paying for therapy, parent training, and a jargon-free glossary.",
  alternates: { canonical: "/resources" },
};

function Chevron({ size = 14 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

/**
 * The parent-resources hub: an evergreen guide library, not a blog.
 * Two shelves — a numbered "new here" reading path for parents at the
 * very start, then everyday reference guides — plus a cross-link shelf
 * into the conversational /questions pages.
 */
export default function ResourcesPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": `${siteConfig.domain}/resources/#guides`,
    name: "Sunbird ABA parent guides",
    itemListElement: [...startHereGuides, ...everydayGuides].map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.cardTitle,
      url: `${siteConfig.domain}/resources/${g.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={itemListJsonLd} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: "Parent resources" },
        ])}
      />

      <header className="bg-mint-wash">
        <div className="mx-auto max-w-[87rem] px-4 py-14 sm:px-6 lg:py-20">
          <p className="text-[14px] font-extrabold uppercase tracking-[0.18em] text-brand-teal">
            Parent resources
          </p>
          <h1 className="font-display display-xl mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-[3.75rem]">
            Guides for the road ahead.
          </h1>
          <p className="prose-measure mt-6 text-lg leading-relaxed text-ink-soft">
            Short, plain-words guides you can read in the pickup line — written
            for parents, not clinicians. No dates, no jargon, no homework.
            Start at the top if all of this is new, or jump straight to the
            question on your mind.
          </p>
        </div>
      </header>

      {/* ————— Shelf 1: the numbered "new here" path ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-[2.5rem]">
              New to all of this? Start here.
            </h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
              Four guides, in order — from &ldquo;what even is ABA&rdquo; to
              your child&rsquo;s first session. About twenty minutes,
              beginning to end.
            </p>
          </div>
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {startHereGuides.map((g, i) => (
              <li key={g.slug} className="h-full">
                <Link
                  href={`/resources/${g.slug}`}
                  className="lift group flex h-full flex-col rounded-3xl bg-white p-7 shadow-card"
                >
                  <span
                    aria-hidden="true"
                    className="font-display grid h-11 w-11 place-items-center rounded-full bg-sun text-[16px] text-ink shadow-chip"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display mt-6 text-[1.4rem] leading-snug group-hover:text-brand-teal">
                    {g.cardTitle}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
                    {g.cardBlurb}
                  </p>
                  <p className="mt-5 flex items-center gap-2 text-[13.5px] font-extrabold text-brand-teal">
                    {g.minutes}-minute read
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <Chevron size={13} />
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ————— Shelf 2: everyday guides ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 pb-16 sm:px-6 lg:pb-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-[2.5rem]">
              Guides for everyday questions
            </h2>
            <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
              The practical stuff — settings, coaching, who&rsquo;s who, and a
              glossary for decoding reports.
            </p>
          </div>
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {everydayGuides.map((g) => (
              <li key={g.slug} className="h-full">
                <Link
                  href={`/resources/${g.slug}`}
                  className="lift group flex h-full flex-col rounded-3xl border border-line bg-white p-7"
                >
                  <h3 className="font-display text-[1.4rem] leading-snug group-hover:text-brand-teal">
                    {g.cardTitle}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-soft">
                    {g.cardBlurb}
                  </p>
                  <p className="mt-5 flex items-center gap-2 text-[13.5px] font-extrabold text-brand-teal">
                    {g.minutes}-minute read
                    <span className="transition-transform duration-300 group-hover:translate-x-1">
                      <Chevron size={13} />
                    </span>
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ————— Cross-shelf: the conversational Q&A pages ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 pb-20 sm:px-6">
          <div className="rounded-3xl bg-sun-wash p-8 sm:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <h2 className="font-display text-3xl sm:text-[2.4rem]">
                  Have a question instead?
                </h2>
                <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
                  Alongside these guides we keep a set of straight answers to
                  the questions parents actually call us with.
                </p>
              </div>
              <Link
                href="/questions"
                className="btn-pill inline-flex h-12 shrink-0 items-center justify-center gap-2.5 self-start rounded-full bg-brand-teal px-7 text-[15px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep lg:self-auto"
              >
                All parent questions <Chevron />
              </Link>
            </div>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {questionPages.slice(0, 6).map((q) => (
                <li key={q.slug}>
                  <Link
                    href={`/questions/${q.slug}`}
                    className="block h-full rounded-2xl bg-white p-4 text-[15px] font-bold transition-colors hover:text-brand-teal"
                  >
                    {q.cardTitle}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <CtaBand
        tint="indigo"
        heading="Reading only gets a family so far."
        body="When you're ready for answers about your child — coverage, timing, next steps — fifteen minutes with an intake advocate replaces guessing with a plan."
      />
      <StickyCallBar callLabel="Call the team" />
    </>
  );
}
