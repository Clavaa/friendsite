import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Faq, { faqJsonLd } from "../../../components/Faq";
import JsonLd from "../../../components/JsonLd";
import { LinkChips, LocalSections } from "../../../components/local/LocalBlocks";
import { siteConfig } from "../../../../site.config";
import type { FaqItem } from "../../../data/states";
import { cityLocal, fmt, hashSeed, pick } from "../../../lib/local";
import type { CopySection } from "../../../lib/localCopy";
import { CITY_JOBS, CITY_SERVICES, cityZips, getCityJob, zipLabel, type CityJob } from "../../../lib/metro";
import { brandTitle, breadcrumbJsonLd } from "../../../lib/seo";

/**
 * City job pages — /careers/rbt-jobs-denver, /careers/bcba-jobs-kansas-city …
 * The highest-volume city keywords in our research are job searches
 * ("rbt jobs colorado springs" 140/mo, "rbt jobs denver" 110/mo, low
 * competition). Claims are limited to what the client confirmed on
 * /careers: paid training toward certification, consistent BCBA
 * supervision, home + daycare sessions, sized caseloads, the paid
 * student-analyst program. NO pay figures, NO specific openings, NO
 * JobPosting schema until real postings exist (careers-page TODO).
 */

interface Params {
  slug: string;
}

export function generateStaticParams(): Params[] {
  return CITY_JOBS.map((j) => ({ slug: j.slug }));
}
export const dynamicParams = false;

const ROLE = {
  rbt: { short: "RBT", long: "Registered Behavior Technician (RBT)", tag: "RBT" },
  bcba: { short: "BCBA", long: "Board Certified Behavior Analyst (BCBA)", tag: "BCBA" },
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const j = getCityJob((await params).slug);
  if (!j) return {};
  const abbr = siteConfig.states[j.state].abbr;
  const r = ROLE[j.role];
  return {
    title: { absolute: brandTitle(`${r.short} Jobs in ${j.city.name}, ${abbr}`) },
    description:
      j.role === "rbt"
        ? `RBT and behavior technician jobs in ${j.city.name}, ${abbr}: one-on-one ABA sessions at homes and daycares, paid training toward certification, real BCBA supervision.`
        : `BCBA jobs in ${j.city.name}, ${abbr}: caseloads sized so you can do your best work, admin carried by our intake team, and a paid student-analyst track.`,
    alternates: { canonical: `/careers/${j.slug}` },
  };
}

function content(j: CityJob): { sections: CopySection[]; faqs: FaqItem[] } {
  const loc = cityLocal(j.state, j.city.slug);
  const stateName = siteConfig.states[j.state].name;
  const city = j.city.name;
  const seed = hashSeed(j.slug);
  const zs = cityZips(j.state, j.city.slug);
  const named = zs.map(([, r]) => zipLabel(r, 1)).filter(Boolean).slice(0, 8) as string[];
  const towns = (loc?.within30 ?? []).slice(0, 8);
  const sap = siteConfig.studentAnalystProgram;

  const topZips = [...zs]
    .sort((a, b) => (b[1].stats?.under18 ?? 0) - (a[1].stats?.under18 ?? 0))
    .slice(0, 6)
    .map(([z, r]) => `${z}${zipLabel(r, 2) ? ` (${zipLabel(r, 2)})` : ""} — about ${fmt(r.stats?.under18 ?? 0)} kids`);
  const why: CopySection = {
    id: "why",
    heading: "Why clinicians choose Sunbird",
    paragraphs: [
      `Well-supported clinicians give the best care. That's not a slogan — it's the whole staffing strategy.`,
    ],
    bullets: [
      `**Family-run, for real.** The founder's name is on the door and her standard is simple: care good enough for her own kids, and a team treated the way we ask them to treat families.`,
      `**Caseloads you can serve well.** We'd rather grow slowly than stretch a clinician thin. Your caseload is sized so every child on it actually gets your best work.`,
      `**Mentorship that shows up.** Real supervision hours, clinical leadership that still sees clients, and questions answered by people who remember being new at this.`,
      `**Work that travels with the child.** Home, daycare, telehealth — and centers coming soon. You'll see your work hold up in real life, not just in a session room.`,
    ],
  };
  const demand: CopySection = {
    id: "demand",
    heading: `Where the kids are in ${city}`,
    paragraphs: [
      `${city.endsWith("s") ? `${city}'` : `${city}'s`} ZIP codes with the most children, from Census estimates — the neighborhoods your sessions would most often take you to:`,
    ],
    bullets: topZips.map((t) => t),
  };
  const where: CopySection = {
    id: "where",
    heading: `Where you'd work in and around ${city}`,
    paragraphs: [
      `Sessions happen in families' homes and at daycares — not in a clinic. Our ${city} team serves all ${zs.length} of the city's ZIP codes${named.length ? `, from ${named.slice(0, -1).join(", ")} to ${named[named.length - 1]}` : ""}, plus nearby communities like ${towns.map((t) => `[${t.name}](/${j.state}/${t.path})`).join(", ")}.`,
      loc?.stats
        ? `About ${fmt(loc.stats.under18)} children live in ${city} alone. At the CDC's 1-in-31 estimate, that's roughly ${fmt(Math.round(loc.stats.under18 / 31))} kids who may be autistic — the families this work is for.`
        : "",
    ].filter(Boolean),
  };

  if (j.role === "rbt") {
    return {
      sections: [
        {
          id: "role",
          heading: `What an RBT does at Sunbird ${city}`,
          paragraphs: [
            pick(seed, 1, [
              `As an RBT (registered behavior technician), you run the day-to-day one-on-one ABA sessions that change a child's trajectory — working from a plan a BCBA wrote for that child, recording progress, and helping parents use the same strategies between visits.`,
              `RBTs are the people kids see most. You'll run one-on-one ABA sessions in ${city} homes and daycares, follow a treatment plan written by your BCBA, take session data, and show parents what's working.`,
            ]),
            `We treat it as a career, not a gig: paid training toward certification, consistent BCBA supervision so you're never left on an island, and caseloads sized so every child gets your best work.`,
          ],
          bullets: [
            "One-on-one sessions at home and in daycares",
            "Paid training toward RBT certification",
            "Consistent BCBA supervision, never left on an island",
            "A family-run team across Kansas and Colorado",
          ],
        },
        {
          id: "cert",
          heading: "New to ABA? How RBT certification works",
          paragraphs: [
            `The RBT credential is issued by the Behavior Analyst Certification Board (BACB). The path is a 40-hour training, a competency assessment completed with a qualified supervisor, a background check, and the RBT exam. Ongoing supervision by a BCBA is part of the job once you're certified.`,
            `If you're new, we'll talk you through where you are and what's next — paid training toward certification is part of how we hire.`,
          ],
        },
        {
          id: "week",
          heading: `What a week can look like for an RBT in ${city}`,
          paragraphs: [
            `Schedules are built around families, so every week is a little different. A typical pattern: a morning session at a child's daycare working on joining group time and transitions, an afternoon session at a family's home on routines like mealtime or getting ready for bed, session notes the same day, and regular supervision time with your BCBA — where you bring questions and leave with a plan.`,
            `Because sessions happen across ${city}, scheduling tries to keep your clients in the same part of town so you're working, not driving.`,
          ],
        },
        why,
        demand,
        where,
        {
          id: "apply",
          heading: `How to apply for RBT jobs in ${city}`,
          paragraphs: [
            `We're growing across ${stateName}, including the ${city} area, and openings are posted on our [careers page](/careers) as they open. Don't wait for a listing: email ${siteConfig.email} with "RBT — ${city}" in the subject, and tell us where you live, your schedule and where you are with certification. A real person reads every one.`,
          ],
        },
      ],
      faqs: [
        { q: `Do I need to be certified to apply for RBT jobs in ${city}?`, a: `Tell us where you are — certified, in training, or just interested. Paid training toward certification is part of how we hire, so it's worth reaching out either way.` },
        { q: `Where do RBT sessions happen?`, a: `In families' homes and at daycares across ${city} and nearby towns — not in a clinic. Centers are coming soon.` },
        { q: `Who supervises RBTs at Sunbird?`, a: `A BCBA writes each child's plan and supervises you consistently — you're never left on an island.` },
        { q: `What does an RBT job pay in ${city}?`, a: `Pay ranges are posted with each opening on our careers page. Email us and we'll walk you through the current details for the ${city} area.` },
      ],
    };
  }

  return {
    sections: [
      {
        id: "role",
        heading: `What a BCBA does at Sunbird ${city}`,
        paragraphs: [
          `Lead a caseload you can actually serve well: design and supervise individual treatment plans, coach parents, and watch kids grow — with the admin and authorization paperwork carried by our intake team so you stay in the clinical work.`,
          `Your clients are in ${city} homes and daycares, which means your plans get tested in real life: mornings, mealtimes, group play, transitions.`,
        ],
        bullets: [
          "Design and supervise individual treatment plans",
          "Admin and authorization paperwork carried by the intake team",
          "Caseloads sized so every child gets your best work",
          "Clinical leadership that still sees clients",
        ],
      },
      {
        id: "student",
        heading: "Almost a BCBA? Our paid student-analyst track",
        paragraphs: [
          `If you're deep into supervised fieldwork, the student-analyst role lets you earn the rest of your hours doing the real job — paid, on real cases, with structured BCBA supervision. It's a fit if you have ${sap.unrestrictedHours}+ unrestricted and ${sap.restrictedHours}+ restricted fieldwork hours and are within about ${sap.monthsToExamEligibility} months of exam eligibility. Details on our [careers page](/careers).`,
        ],
      },
      {
        id: "week",
        heading: `What a week can look like for a BCBA in ${city}`,
        paragraphs: [
          `Your week centers on clinical work: assessments and plan updates for children on your caseload, supervision time with the RBTs running their sessions, and parent coaching — in person at ${city} homes or by video. Authorizations and admin go to our intake team, not your evenings.`,
          `Because sessions happen across ${city}, caseloads are organized by part of town where possible, so supervision visits don't eat your day.`,
        ],
      },
      why,
      demand,
      where,
      {
        id: "apply",
        heading: `How to apply for BCBA jobs in ${city}`,
        paragraphs: [
          `We're growing across ${stateName}, including the ${city} area, and openings are posted on our [careers page](/careers) as they open. Email ${siteConfig.email} with "BCBA — ${city}" in the subject — tell us about your experience and what you're looking for. A real person reads every one.`,
        ],
      },
    ],
    faqs: [
      { q: `Who handles authorizations for BCBAs in ${city}?`, a: `Our intake team carries the admin and authorization paperwork, so BCBAs can spend their time on clinical work.` },
      { q: `Is there a path for students close to BCBA certification?`, a: `Yes — the paid student-analyst role lets you finish your supervised hours on real cases with structured BCBA supervision.` },
      { q: `Where do Sunbird BCBAs see clients?`, a: `In families' homes and at daycares across ${city} and nearby towns, plus telehealth for parent coaching. Centers are coming soon.` },
      { q: `What does a BCBA job pay in ${city}?`, a: `Pay ranges are posted with each opening on our careers page. Email us and we'll share current details for the ${city} area.` },
    ],
  };
}

export default async function CityJobPage({ params }: { params: Promise<Params> }) {
  const j = getCityJob((await params).slug);
  if (!j) notFound();
  const stateCfg = siteConfig.states[j.state];
  const r = ROLE[j.role];
  const { sections, faqs } = content(j);
  const other = CITY_JOBS.filter((x) => x.role === j.role && x.slug !== j.slug);

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "" },
          { name: "Careers", path: "/careers" },
          { name: `${r.short} jobs in ${j.city.name}` },
        ])}
      />
      <section className="bg-mint-wash">
        <div className="mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:pb-16 lg:pt-16">
          <nav aria-label="Breadcrumb" className="text-sm font-semibold text-ink-soft">
            <Link href="/" className="hover:text-brand-teal">Home</Link>
            <span aria-hidden="true"> / </span>
            <Link href="/careers" className="hover:text-brand-teal">Careers</Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">{r.short} jobs in {j.city.name}</span>
          </nav>
          <h1 className="font-display mt-4 max-w-3xl text-4xl sm:text-5xl">
            {r.short} jobs in {j.city.name}, {stateCfg.abbr}
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-ink-soft">
            {j.role === "rbt"
              ? `Work one-on-one with kids in ${j.city.name} homes and daycares, with paid training toward certification and a BCBA who actually has your back.`
              : `Lead a ${j.city.name} caseload you can serve well — with the paperwork carried for you and clinical leadership that still sees clients.`}
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <a
              href={`mailto:${siteConfig.email}?subject=${encodeURIComponent(`Careers — ${r.tag} — ${j.city.name}`)}`}
              className="rounded-full bg-brand-teal px-7 py-3.5 text-center text-[16px] font-bold text-white transition-colors hover:bg-brand-teal-deep"
            >
              Introduce yourself
            </a>
            <Link href="/careers" className="rounded-full border border-ink/25 px-7 py-3.5 text-center text-[16px] font-bold transition-colors hover:border-ink">
              All Sunbird careers
            </Link>
          </div>
        </div>
      </section>

      <LocalSections sections={sections} />
      <Faq items={faqs} heading={`${r.short} jobs in ${j.city.name}: questions`} />

      <LinkChips
        heading={`${r.short} jobs in other cities`}
        items={other.map((x) => ({ name: `${r.short} jobs in ${x.city.name}`, href: `/careers/${x.slug}` }))}
        tint="bg-cream"
      />
      <LinkChips
        heading={`About ABA in ${j.city.name}`}
        items={[
          { name: `ABA therapy in ${j.city.name}`, href: `/${j.state}/${j.city.slug}` },
          ...CITY_SERVICES.map((s) => ({ name: `${s.label} in ${j.city.name}`, href: `/${j.state}/${j.city.slug}/${s.slug}` })),
        ]}
        tint="bg-white"
      />
    </>
  );
}
