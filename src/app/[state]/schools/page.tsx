import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "../../../components/JsonLd";
import { siteConfig, isStateSlug, stateSlugs, type StateSlug } from "../../../../site.config";
import { fmt } from "../../../lib/local";
import { districtsIn } from "../../../lib/schools";
import { brandTitle, breadcrumbJsonLd } from "../../../lib/seo";

/** /{state}/schools — every district page in the state, largest first. */

export function generateStaticParams() {
  return stateSlugs.map((state) => ({ state }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Promise<{ state: string }> }): Promise<Metadata> {
  const { state } = await params;
  if (!isStateSlug(state)) return {};
  const name = siteConfig.states[state].name;
  return {
    title: { absolute: brandTitle(`ABA & IEP Support by School District in ${name}`) },
    description: `ABA therapy and IEP support for families in ${name}'s largest school districts — every school, the ZIP codes they serve, and how home ABA works with the IEP.`,
    alternates: { canonical: `/${state}/schools` },
  };
}

export default async function SchoolsIndex({ params }: { params: Promise<{ state: string }> }) {
  const { state } = await params;
  if (!isStateSlug(state)) notFound();
  const st = state as StateSlug;
  const name = siteConfig.states[st].name;
  const list = districtsIn(st);
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "" }, { name, path: `/${st}` }, { name: "School districts" }])} />
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
            <Link href="/" className="hover:text-brand-teal">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${st}`} className="hover:text-brand-teal">{name}</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">School districts</span>
          </nav>
          <h1 className="font-display mt-4 text-4xl sm:text-5xl">ABA and IEP support by school district in {name}</h1>
          <p className="mt-4 max-w-3xl text-lg text-ink-soft">
            Pick your district for every school it runs, the neighborhoods it serves, and how home and
            daycare ABA works alongside your child&rsquo;s IEP.
          </p>
          <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {list.map(([slug, d]) => (
              <li key={slug}>
                <Link href={`/${st}/schools/${slug}`} className="block h-full rounded-2xl bg-white p-5 shadow-card hover:shadow-card-lg">
                  <span className="font-bold text-brand-teal">{d.name}</span>
                  <span className="mt-1 block text-[14px] text-ink-soft">
                    {d.schools.length} schools · about {fmt(Math.round(d.enrollment / 100) * 100)} students
                    {d.hqCity ? ` · ${d.hqCity}` : ""}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
