import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaBand from "../../../../components/CtaBand";
import Faq, { faqJsonLd } from "../../../../components/Faq";
import JsonLd from "../../../../components/JsonLd";
import LeadForm from "../../../../components/LeadForm";
import StickyCallBar from "../../../../components/StickyCallBar";
import { LinkChips, LocalSections, guideShelf } from "../../../../components/local/LocalBlocks";
import { siteConfig, isStateSlug, stateSlugs, type StateSlug } from "../../../../../site.config";
import type { FaqItem } from "../../../../data/states";
import { fmt, hashSeed, pick } from "../../../../lib/local";
import type { CopySection } from "../../../../lib/localCopy";
import { districtsIn, getDistrict, type District } from "../../../../lib/schools";
import { brandTitle, breadcrumbJsonLd } from "../../../../lib/seo";

/**
 * School-district pages — /colorado/schools/denver-public-schools. Parents
 * search by school and district ("autism support <district>", "IEP <district>");
 * each page lists every open school (NCES CCD 2022) linked to its ZIP or town
 * page, and explains how home/daycare ABA works alongside the district's IEP
 * process. Sunbird sessions are home/daycare-based — never claimed in schools.
 */

interface Params {
  state: string;
  district: string;
}

export function generateStaticParams(): Params[] {
  return stateSlugs.flatMap((state) => districtsIn(state).map(([slug]) => ({ state, district: slug })));
}
export const dynamicParams = false;

function resolve(p: Params) {
  if (!isStateSlug(p.state)) return null;
  const d = getDistrict(p.state, p.district);
  return d ? { state: p.state as StateSlug, slug: p.district, d } : null;
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const r = resolve(await params);
  if (!r) return {};
  const abbr = siteConfig.states[r.state].abbr;
  // Long legal names ("Lewis-Palmer Consolidated School District No. 38")
  // get a short form in the title only; the page itself uses the full name.
  const short = r.d.name
    .replace(/ (Consolidated|Reorganized)\b/g, "")
    .replace(/ County Colorado\b/, "")
    .replace(/School District No\.? ?/, "District ");
  const title = [`ABA & IEP Support: ${r.d.name}, ${abbr}`, `ABA & IEP Support: ${r.d.name}`, `ABA & IEP Support: ${short}`].find((t) => t.length <= 60) ?? `ABA & IEP Support: ${short}`;
  return {
    title: { absolute: brandTitle(title) },
    description: `ABA therapy for ${r.d.name} families: how home and daycare ABA works with your child's IEP, plus all ${r.d.schools.length} schools and the ZIP codes they serve.`.slice(0, 158),
    alternates: { canonical: `/${r.state}/schools/${r.slug}` },
  };
}

function sections(state: StateSlug, d: District, seed: number): CopySection[] {
  const prek = d.schools.filter((s) => s.prek);
  const charters = d.schools.filter((s) => s.charter).length;
  const est = Math.round(d.enrollment / 31);
  const zips = [...new Set(d.schools.map((s) => s.zip))].length;
  const staff: string[] = [];
  if (d.psychologists && d.psychologists >= 1) staff.push(`about ${Math.round(d.psychologists)} school psychologists`);
  if (d.counselors && d.counselors >= 1) staff.push(`about ${Math.round(d.counselors)} school counselors`);
  return [
    {
      id: "district",
      heading: `${d.name} at a glance`,
      paragraphs: [
        `${d.name} serves about ${fmt(Math.round(d.enrollment / 100) * 100)} students across ${d.schools.length} schools${charters ? ` (${charters} of them charters)` : ""} and ${zips} ZIP codes${d.hqCity ? `, with offices in ${d.hqCity}` : ""}${d.countyFull && d.county ? ` — part of [${d.countyFull}](/${state}/${d.county})` : ""}.${staff.length ? ` Federal data lists ${staff.join(" and ")} on staff.` : ""}`,
        `At the CDC's 1-in-31 estimate, roughly ${fmt(est)} ${d.name} students may be autistic — so if you're navigating an IEP, an evaluation or a new diagnosis here, you are far from alone.`,
        prek.length
          ? `${prek.length} ${d.name} schools offer preschool, which matters for families of 3- and 4-year-olds: the district can evaluate children from age 3 for special-education services, before kindergarten.`
          : `Districts evaluate children from age 3 for special-education services, so families of preschoolers can ask ${d.name} about an evaluation before kindergarten.`,
      ],
    },
    {
      id: "iep",
      heading: `How ABA works alongside a ${d.name} IEP`,
      paragraphs: [
        pick(seed, 1, [
          `School and ABA do different jobs. The school's IEP covers what your child needs to learn and take part at school. ABA with Sunbird happens at home and at daycare — the routines, communication and behaviors that make mornings, evenings and weekends hard. They work best when they pull in the same direction.`,
          `Think of the IEP as the school-day plan and ABA as the rest-of-the-day plan. Sunbird's sessions happen at home and at daycare, not in ${d.name} classrooms — but the goals can and should line up.`,
        ]),
      ],
      ordered: [
        `**Ask for an evaluation in writing.** If you think your child needs special-education support, put the request to your school (or the district's special-education office) in writing and keep a copy.`,
        `**Share what you have.** Outside evaluations and an autism diagnosis help, though the school still runs its own eligibility evaluation.`,
        `**Bring the IEP to your BCBA.** With your consent, your Sunbird BCBA reads the IEP goals so home goals reinforce them — the same words, the same expectations.`,
        `**Review together.** IEPs are reviewed at least yearly. Bring progress notes from home; they help the team see the whole child.`,
      ],
    },
    {
      id: "aba",
      heading: `ABA therapy for ${d.name} families`,
      paragraphs: [
        `Our team serves every ZIP code in the district with [in-home ABA](/services/in-home-aba), [daycare-based support](/services/daycare-based) and [parent training](/services/parent-training). No diagnosis yet? We'll help you [get an evaluation](/get-a-diagnosis). Wondering what's typical? See [signs of autism at age 3](/resources/signs-of-autism-at-age-3) and [ABA vs. speech therapy](/resources/aba-vs-speech-therapy).`,
        `Insurance is plan by plan, so we check yours for free — send a photo of your card and we'll call back with a plain-English answer, usually within a business day.`,
      ],
    },
  ];
}

function faqs(d: District): FaqItem[] {
  return [
    { q: `Does Sunbird provide ABA inside ${d.name} schools?`, a: `No — our sessions happen at home and at daycare. With your consent, your BCBA can align home goals with your child's IEP so the two plans support each other.` },
    { q: `How do I get my child evaluated by ${d.name}?`, a: `Put a request for a special-education evaluation in writing to your child's school or the district's special-education office. Children can be evaluated from age 3.` },
    { q: `Is a school evaluation the same as an autism diagnosis?`, a: `No. A school evaluation decides eligibility for special-education services; a medical diagnosis comes from a doctor or psychologist and is usually what insurance needs for ABA. Many families pursue both.` },
    { q: `Does insurance cover ABA for ${d.name} families?`, a: `It depends on your plan, so we check it for free. Send a photo of your insurance card and we'll tell you what's covered, usually within a business day.` },
  ];
}

export default async function DistrictPage({ params }: { params: Promise<Params> }) {
  const r = resolve(await params);
  if (!r) notFound();
  const { state, slug, d } = r;
  const stateCfg = siteConfig.states[state];
  const seed = hashSeed(`${state}/schools/${slug}`);
  const fq = faqs(d);
  const others = districtsIn(state).filter(([s, x]) => s !== slug && x.county === d.county).slice(0, 8);
  const more = others.length < 4 ? districtsIn(state).filter(([s]) => s !== slug && !others.some(([o]) => o === s)).slice(0, 8 - others.length) : [];
  const places = [...new Map(d.schools.filter((s) => s.href).map((s) => [s.href!, s])).values()];

  return (
    <>
      <JsonLd data={faqJsonLd(fq)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: stateCfg.name, path: `/${state}` },
          { name: "School districts", path: `/${state}/schools` },
          { name: d.name },
        ])}
      />
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:pb-16 lg:pt-16">
          <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
            <Link href="/" className="hover:text-brand-teal">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${state}`} className="hover:text-brand-teal">{stateCfg.name}</Link>
            <span aria-hidden="true"> / </span>
            <Link href={`/${state}/schools`} className="hover:text-brand-teal">School districts</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{d.name}</span>
          </nav>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[14px] font-bold text-brand-teal shadow-card">
            <span aria-hidden="true" className="h-2 w-2 rounded-full bg-meadow" />
            Sunbird ABA team serving {d.name} families
          </p>
          <h1 className="font-display mt-4 max-w-3xl text-4xl sm:text-5xl">
            ABA therapy and IEP support for {d.name} families
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            How home and daycare ABA works alongside your child&rsquo;s IEP — plus every {d.name} school
            and the neighborhoods they serve.
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

      <LocalSections sections={sections(state, d, seed)} />

      <section id="schools" className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <h2 className="font-display text-2xl sm:text-3xl">All {d.schools.length} {d.name} schools</h2>
          <p className="mt-2 max-w-3xl text-[15px] text-ink-soft">
            Find your child&rsquo;s school — the ZIP link goes to that neighborhood&rsquo;s page, with local
            numbers and how our team serves it. Source: NCES Common Core of Data, 2022.
          </p>
          <div className="mt-6 overflow-x-auto rounded-2xl bg-cream shadow-card">
            <table className="w-full min-w-[560px] text-left text-[15px]">
              <thead className="border-b border-line text-[13px] uppercase tracking-wide text-ink-soft">
                <tr>
                  <th scope="col" className="px-4 py-3">School</th>
                  <th scope="col" className="px-4 py-3">Grades</th>
                  <th scope="col" className="px-4 py-3">Area</th>
                  <th scope="col" className="px-4 py-3 text-right">Students</th>
                </tr>
              </thead>
              <tbody>
                {d.schools.map((s) => (
                  <tr key={`${s.name}-${s.zip}`} className="border-b border-line/60 last:border-0">
                    <th scope="row" className="px-4 py-2.5 font-semibold">
                      {s.name}
                      {s.charter && <span className="ml-2 text-[12px] font-semibold text-ink-soft">charter</span>}
                    </th>
                    <td className="px-4 py-2.5 tabular-nums">{s.grades ?? "—"}</td>
                    <td className="px-4 py-2.5">
                      {s.href ? (
                        <Link href={s.href} className="text-brand-teal hover:underline">
                          {s.city} {s.zip}
                        </Link>
                      ) : (
                        `${s.city} ${s.zip}`
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-right tabular-nums">{fmt(s.enrollment)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Faq items={fq} heading={`${d.name}: questions parents ask`} />

      <section id="intake" className="bg-ink scroll-mt-20">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center">
          <div className="text-white">
            <h2 className="font-display text-3xl sm:text-4xl">Start with one short call</h2>
            <p className="mt-4 text-white/75">
              Tell us your ZIP code and what you&rsquo;re seeing. An intake advocate calls back — usually the same
              business day — with your coverage answer and an honest start timeline.
            </p>
          </div>
          <LeadForm heading="Get matched with our team" subheading="Four quick fields. A real person calls you back." sourcePage={`district-${state}-${slug}`} />
        </div>
      </section>

      <LinkChips
        heading={`Neighborhoods ${d.name} serves`}
        items={places.slice(0, 40).map((s) => ({ name: `${s.city} ${s.zip}`, href: s.href! }))}
        tint="bg-cream"
      />
      <LinkChips
        heading="Nearby school districts"
        items={[...others, ...more].map(([s, x]) => ({ name: x.name, href: `/${state}/schools/${s}` }))}
        tint="bg-white"
      />
      <LinkChips heading="Guides parents read next" items={guideShelf(seed)} tint="bg-cream" />
      <CtaBand tint="sky" heading="Ready to talk about your child?" body={`${d.name} families start with one short call. Yours can too.`} />
      <StickyCallBar callLabel={`Call the ${stateCfg.name} team`} />
    </>
  );
}
