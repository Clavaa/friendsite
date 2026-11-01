import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BlogBody from "../../../components/BlogBody";
import CtaBand from "../../../components/CtaBand";
import Faq, { faqJsonLd } from "../../../components/Faq";
import JsonLd from "../../../components/JsonLd";
import FindNearYou from "../../../components/local/FindNearYou";
import { reviewedByJsonLd } from "../../../components/ReviewedBy";
import StickyCallBar from "../../../components/StickyCallBar";
import { getGuide, guides, type Guide } from "../../../data/guides";
import { questionPages } from "../../../data/questions";
import { services } from "../../../data/services";
import { getPost, posts, relatedPosts } from "../../../lib/blog";
import { breadcrumbJsonLd, brandTitle } from "../../../lib/seo";
import { siteConfig } from "../../../../site.config";

export const dynamicParams = false;

export function generateStaticParams() {
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const p = getPost((await params).slug);
  if (!p) return {};
  return {
    title: { absolute: brandTitle(p.metaTitle) },
    description: p.description,
    alternates: { canonical: `/blog/${p.slug}` },
    openGraph: { type: "article", publishedTime: p.date, modifiedTime: p.updated ?? p.date },
  };
}

/** Post tags → the evergreen guides that go deeper on the same topic. */
const TAG_GUIDES: Record<string, string[]> = {
  diagnosis: ["signs-of-autism-at-age-2", "the-m-chat-screening", "first-steps-after-a-diagnosis", "signs-of-autism-at-18-months"],
  insurance: ["paying-for-aba", "how-to-get-aba-therapy", "how-many-hours-of-aba"],
  cost: ["paying-for-aba", "how-many-hours-of-aba", "how-to-get-aba-therapy"],
  therapies: ["aba-vs-speech-therapy", "what-is-aba", "who-is-on-the-team", "is-aba-therapy-harmful"],
  behavior: ["parent-training-explained", "what-is-aba", "aba-therapy-for-toddlers"],
  toddlers: ["aba-therapy-for-toddlers", "signs-of-autism-at-age-2", "signs-of-autism-at-age-3"],
  daycare: ["home-vs-daycare-sessions", "preparing-for-your-first-session"],
  "getting-started": ["how-to-get-aba-therapy", "preparing-for-your-first-session", "first-steps-after-a-diagnosis"],
  parenting: ["parent-training-explained", "home-vs-daycare-sessions", "aba-glossary"],
};

const card =
  "block h-full rounded-2xl border border-line bg-white p-4 text-[15px] font-bold transition-colors hover:border-brand-teal/50 hover:text-brand-teal";

const fmt = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const p = getPost((await params).slug);
  if (!p) notFound();

  const url = `${siteConfig.domain}/blog/${p.slug}`;
  const author = p.author
    ? { "@type": "Person", name: p.author, ...(p.authorTitle ? { jobTitle: p.authorTitle } : {}), worksFor: { "@id": `${siteConfig.domain}/#organization` } }
    : { "@id": `${siteConfig.domain}/#organization` };
  const toc = p.blocks.filter((b): b is Extract<typeof b, { type: "h2" }> => b.type === "h2");

  const guideSlugs = [...new Set(p.tags.flatMap((t) => TAG_GUIDES[t] ?? []))];
  const topicGuides: Guide[] = (guideSlugs.length ? guideSlugs : guides.slice(0, 4).map((g) => g.slug))
    .map((s) => getGuide(s))
    .filter((g): g is Guide => Boolean(g))
    .slice(0, 6);
  const more = relatedPosts(p, 4);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          "@id": `${url}#article`,
          mainEntityOfPage: url,
          headline: p.title,
          description: p.description,
          datePublished: p.date,
          dateModified: p.updated ?? p.date,
          author,
          publisher: { "@id": `${siteConfig.domain}/#organization` },
          reviewedBy: reviewedByJsonLd,
          keywords: p.tags.join(", "),
        }}
      />
      {p.faqs.length > 0 && <JsonLd data={faqJsonLd(p.faqs)} />}
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Blog", path: "/blog" }, { name: p.title }])} />

      <article>
        <header className="bg-mint-wash">
          <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 lg:pb-14 lg:pt-16">
            <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
              <Link href="/" className="hover:text-brand-teal">Home</Link>
              <span aria-hidden="true"> / </span>
              <Link href="/blog" className="hover:text-brand-teal">Blog</Link>
            </nav>
            <h1 className="font-display mt-5 max-w-3xl text-4xl sm:text-5xl">{p.title}</h1>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-bold text-ink-soft">
              <span className="text-ink">
                {p.author ? `By ${p.author}${p.authorTitle ? `, ${p.authorTitle}` : ""}` : "By the Sunbird ABA team"}
              </span>
              <span>
                {p.updated ? `Updated ${fmt(p.updated)}` : <time dateTime={p.date}>{fmt(p.date)}</time>}
              </span>
              <span>{p.minutes}-minute read</span>
              {(!p.author || p.author !== siteConfig.clinicalReviewer.name) && (
                <span>Clinically reviewed by {siteConfig.clinicalReviewer.name}, {siteConfig.clinicalReviewer.jobTitle}</span>
              )}
            </div>
            {p.description && <p className="prose-measure mt-5 text-lg leading-relaxed text-ink-soft">{p.description}</p>}
          </div>
        </header>

        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[minmax(0,1fr)_16rem] lg:py-16">
          <div className="min-w-0">
            <BlogBody blocks={p.blocks} self={`/blog/${p.slug}`} />

            {p.faqs.length > 0 && (
              <div className="mt-14">
                <Faq items={p.faqs} heading="Questions parents ask" />
              </div>
            )}

            <aside className="mt-14 rounded-3xl bg-sun-wash p-7 sm:p-9">
              <h2 className="font-display text-2xl sm:text-[1.8rem]">Talk it through with a person</h2>
              <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
                Articles are general; your child is specific. An intake advocate can answer for your family in
                one 15-minute call, and the <Link href="/insurance" className="font-bold text-brand-teal hover:underline">benefit check is free</Link>.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link href="/getting-started" className="btn-pill inline-flex h-12 items-center justify-center rounded-full bg-brand-teal px-7 text-[15px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep">
                  Match me with an advocate
                </Link>
                <a href={siteConfig.phoneHref} className="btn-pill inline-flex h-12 items-center justify-center rounded-full border-2 border-ink/70 px-7 text-[15px] font-extrabold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white">
                  Call {siteConfig.phone}
                </a>
              </div>
            </aside>

            {more.length > 0 && (
              <nav aria-label="More from the blog" className="mt-14 border-t border-line pt-8">
                <h2 className="font-display text-2xl">More from the Sunbird blog</h2>
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {more.map((o) => (
                    <li key={o.slug}><Link href={`/blog/${o.slug}`} className={card}>{o.title}</Link></li>
                  ))}
                </ul>
              </nav>
            )}

            <nav aria-label="Parent guides on this topic" className="mt-10">
              <h2 className="font-display text-2xl">Parent guides on this topic</h2>
              <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                {topicGuides.map((g) => (
                  <li key={g.slug}><Link href={`/resources/${g.slug}`} className={card}>{g.cardTitle}</Link></li>
                ))}
              </ul>
            </nav>

            <nav aria-label="ABA therapy services" className="mt-10">
              <h2 className="font-display text-2xl">ABA therapy services in Kansas and Colorado</h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/services/${s.slug}`} className="inline-block rounded-full border border-line bg-white px-4 py-2 text-[14px] font-bold hover:border-brand-teal/50 hover:text-brand-teal">
                      {s.name}
                    </Link>
                  </li>
                ))}
                <li><Link href="/get-a-diagnosis" className="inline-block rounded-full border border-line bg-white px-4 py-2 text-[14px] font-bold hover:border-brand-teal/50 hover:text-brand-teal">Autism evaluation help</Link></li>
                <li><Link href="/insurance" className="inline-block rounded-full border border-line bg-white px-4 py-2 text-[14px] font-bold hover:border-brand-teal/50 hover:text-brand-teal">Free benefit check</Link></li>
              </ul>
            </nav>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-28 space-y-6">
              {toc.length > 1 && (
                <nav aria-label="In this article">
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-brand-teal">In this article</p>
                  <ol className="mt-3 space-y-2 border-l-2 border-line pl-4 text-[14px]">
                    {toc.map((h) => (
                      <li key={h.id}><a href={`#${h.id}`} className="text-ink-soft hover:text-brand-teal">{h.text}</a></li>
                    ))}
                  </ol>
                </nav>
              )}
              <nav aria-label="Short answers">
                <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-brand-teal">Short answers</p>
                <ul className="mt-3 space-y-2 text-[14px]">
                  {questionPages.slice(0, 5).map((q) => (
                    <li key={q.slug}><Link href={`/questions/${q.slug}`} className="text-ink-soft hover:text-brand-teal">{q.cardTitle}</Link></li>
                  ))}
                </ul>
              </nav>
            </div>
          </aside>
        </div>
      </article>

      <FindNearYou seed={p.slug.length} />
      <CtaBand tint="sky" />
      <StickyCallBar callLabel="Call the team" />
    </>
  );
}
