import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "../../components/CtaBand";
import JsonLd from "../../components/JsonLd";
import FindNearYou from "../../components/local/FindNearYou";
import { guides } from "../../data/guides";
import { questionPages } from "../../data/questions";
import { posts } from "../../lib/blog";
import { breadcrumbJsonLd, brandTitle } from "../../lib/seo";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: { absolute: brandTitle("ABA & Autism Blog for Kansas and Colorado Parents") },
  description:
    "Articles from Sunbird's ABA team for parents in Kansas and Colorado: autism testing, therapy choices, costs, and everyday life at home.",
  alternates: { canonical: "/blog" },
  // An empty blog is a thin page: keep it out of the index until the first post ships.
  ...(posts.length ? {} : { robots: { index: false, follow: true } }),
};

const fmt = (d: string) =>
  new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default function BlogIndex() {
  const [lead, ...rest] = posts;
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name: "Blog" }])} />
      {posts.length > 0 && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Blog",
            "@id": `${siteConfig.domain}/blog#blog`,
            name: "Sunbird ABA blog",
            publisher: { "@id": `${siteConfig.domain}/#organization` },
            blogPost: posts.map((p) => ({
              "@type": "BlogPosting",
              headline: p.title,
              url: `${siteConfig.domain}/blog/${p.slug}`,
              datePublished: p.date,
            })),
          }}
        />
      )}

      <header className="bg-mint-wash">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-12 sm:px-6 lg:pt-16">
          <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
            <Link href="/" className="hover:text-brand-teal">Home</Link>
          </nav>
          <h1 className="font-display mt-5 max-w-3xl text-4xl sm:text-5xl">
            ABA and autism blog for Kansas and Colorado parents
          </h1>
          <p className="prose-measure mt-5 text-lg leading-relaxed text-ink-soft">
            Written by our clinical team for the questions families bring us: getting an autism evaluation, choosing
            between therapies, paying for ABA, and the hard moments at home. For the step-by-step basics, start with our{" "}
            <Link href="/resources" className="font-bold text-brand-teal hover:underline">parent guides</Link>.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
        {posts.length === 0 ? (
          <p className="text-lg text-ink-soft">The first articles are on their way. Meanwhile, our parent guides answer the most common questions.</p>
        ) : (
          <>
            <Link href={`/blog/${lead.slug}`} className="group block rounded-3xl bg-white p-7 shadow-card transition-shadow hover:shadow-card-lg sm:p-10">
              <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-brand-teal">Latest</p>
              <h2 className="font-display mt-3 text-3xl group-hover:text-brand-teal sm:text-4xl">{lead.title}</h2>
              <p className="mt-3 max-w-3xl text-ink-soft">{lead.description}</p>
              <p className="mt-4 text-[14px] font-bold text-ink-soft">
                {fmt(lead.date)} · {lead.minutes}-minute read{lead.author ? ` · ${lead.author}` : ""}
              </p>
            </Link>
            {rest.length > 0 && (
              <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {rest.map((p) => (
                  <li key={p.slug}>
                    <Link href={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-3xl bg-white p-6 shadow-card transition-shadow hover:shadow-card-lg">
                      <h2 className="font-display text-xl group-hover:text-brand-teal">{p.title}</h2>
                      <p className="mt-2 flex-1 text-[15px] text-ink-soft">{p.description}</p>
                      <p className="mt-4 text-[13px] font-bold text-ink-soft">{fmt(p.date)} · {p.minutes}-minute read</p>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <nav aria-label="Parent guides">
            <h2 className="font-display text-2xl">Parent guides: the basics, step by step</h2>
            <ul className="mt-4 space-y-2 text-[15px]">
              {guides.map((g) => (
                <li key={g.slug}><Link href={`/resources/${g.slug}`} className="font-semibold hover:text-brand-teal hover:underline">{g.cardTitle}</Link></li>
              ))}
            </ul>
          </nav>
          <nav aria-label="Short answers">
            <h2 className="font-display text-2xl">Short answers to common ABA questions</h2>
            <ul className="mt-4 space-y-2 text-[15px]">
              {questionPages.map((q) => (
                <li key={q.slug}><Link href={`/questions/${q.slug}`} className="font-semibold hover:text-brand-teal hover:underline">{q.cardTitle}</Link></li>
              ))}
              <li><Link href="/get-a-diagnosis" className="font-semibold hover:text-brand-teal hover:underline">How to get an autism evaluation</Link></li>
              <li><Link href="/insurance" className="font-semibold hover:text-brand-teal hover:underline">Does insurance cover ABA? Free benefit check</Link></li>
              <li><Link href="/getting-started" className="font-semibold hover:text-brand-teal hover:underline">How to start ABA therapy with Sunbird</Link></li>
            </ul>
          </nav>
        </div>
      </section>

      <FindNearYou seed={posts.length} />
      <CtaBand tint="sky" />
    </>
  );
}
