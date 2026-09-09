import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, SunSpot } from "../../components/Accents";
import StickyCallBar from "../../components/StickyCallBar";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: "Careers — BCBA & RBT roles in Kansas & Colorado",
  description: `Join a family-run ABA practice: BCBA and behavior technician careers with ${siteConfig.brandName} across Kansas and Colorado. Sane caseloads, real mentorship.`,
  alternates: { canonical: "/careers" },
};

const applyHref = `mailto:${siteConfig.email}?subject=Careers%20—%20Sunbird%20ABA`;

/**
 * Value props are honest culture claims only — no pay, benefit, PTO, or
 * headcount claims until the client supplies real, verifiable ones
 * (config-gate them like the stats band when they arrive).
 */
const valueProps = [
  {
    title: "Family-run, for real",
    body: "The founders' names are on the door and their standard is simple: care good enough for their own kids, and a team treated the way we ask them to treat families.",
  },
  {
    title: "Caseloads you can serve well",
    body: "We'd rather grow slowly than stretch a clinician thin. Your caseload is sized so every child on it actually gets your best work.",
  },
  {
    title: "Mentorship that shows up",
    body: "Real supervision hours, clinical leadership that still sees clients, and questions answered by people who remember being new at this.",
  },
  {
    title: "Work that travels with the child",
    body: "Home, daycare, telehealth — and centers coming soon. You'll see your work hold up in real life, not just in a session room.",
  },
];

const roles = [
  {
    role: "Board Certified Behavior Analyst",
    tag: "BCBA",
    blurb:
      "Lead a caseload you can actually serve well, with admin support that keeps you in the clinical work — designing plans, coaching parents, and watching kids grow.",
    points: [
      "Design and supervise individual treatment plans",
      "Coach parents in-home and by video",
      "Admin and authorization paperwork carried by the intake team",
    ],
  },
  {
    role: "Behavior Technician",
    tag: "RBT",
    blurb:
      "Run the day-to-day sessions that change a child's trajectory — with paid training toward certification and a team that treats this as a career, not a gig.",
    points: [
      "One-on-one sessions at home and in daycares",
      "Paid training toward RBT certification",
      "Consistent BCBA supervision, never left on an island",
    ],
  },
];

export default function CareersPage() {
  return (
    <>
      {/* ————— Big photo hero ————— */}
      <header className="bg-cream px-3 pt-4 sm:px-6">
        <div className="relative mx-auto max-w-[87rem] overflow-hidden rounded-3xl bg-mint-wash">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,42rem)]">
            <div className="relative flex flex-col justify-center px-5 py-12 sm:px-10 sm:py-16 lg:px-14 lg:py-24">
              <p className="text-[14px] font-extrabold uppercase tracking-[0.18em] text-brand-teal">
                Careers at Sunbird
              </p>
              <h1 className="font-display display-xl mt-6 max-w-xl text-4xl sm:text-5xl lg:text-[3.9rem]">
                Do the version of this job{" "}
                <span className="italic text-brand-teal">you got certified for.</span>
              </h1>
              <p className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-soft">
                Sunbird is a family-run ABA practice growing across Kansas and
                Colorado — and we&rsquo;re building the team we always wished
                we worked on. Reasonable caseloads. Real supervision hours.
                Clinical leadership that still sees clients. If that&rsquo;s
                the team you&rsquo;ve been looking for, come find us.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <a
                  href={applyHref}
                  className="btn-pill inline-flex h-[58px] items-center justify-center gap-2.5 rounded-full bg-brand-teal px-9 text-[16px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep"
                >
                  Introduce yourself
                  <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </a>
                <a
                  href="#roles"
                  className="btn-pill inline-flex h-[58px] items-center justify-center gap-2.5 rounded-full border-2 border-ink/70 px-9 text-[16px] font-extrabold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white"
                >
                  See the roles
                </a>
              </div>
              <Sparkles className="pointer-events-none absolute right-6 top-8 hidden w-16 opacity-80 lg:block" />
            </div>
            <div className="relative min-h-[18rem] sm:min-h-[24rem] lg:min-h-0">
              <Image
                src="/images/playground-bubbles.jpg"
                alt="A woman blowing bubbles with a laughing young boy on a sunny playground while he reaches to pop one"
                fill
                sizes="(min-width: 1024px) 42rem, 100vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </header>

      {/* ————— Why Sunbird ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              Well-supported clinicians give the best care.
            </h2>
            <p className="mt-3 text-ink-soft">
              That&rsquo;s not a slogan — it&rsquo;s the whole staffing
              strategy. Here&rsquo;s what we mean by it.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {valueProps.map((v) => (
              <div key={v.title} className="rounded-3xl bg-white p-7 shadow-card">
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-full bg-sun-wash text-brand-teal-deep"
                >
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2.5 7.5l3 3 6-7" />
                  </svg>
                </span>
                <h3 className="font-display mt-4 text-xl">{v.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Role cards ————— */}
      <section id="roles" className="scroll-mt-24 bg-white">
        <div className="mx-auto max-w-[87rem] px-4 py-16 sm:px-6 lg:py-20">
          <h2 className="font-display max-w-2xl text-3xl sm:text-4xl">
            The roles we hire for
          </h2>
          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {roles.map((job, i) => (
              <div
                key={job.role}
                className={`flex flex-col rounded-3xl p-7 sm:p-10 ${i === 0 ? "bg-sun-wash" : "bg-mint-wash"}`}
              >
                <span className="w-fit rounded-full bg-white px-3.5 py-1.5 text-[12px] font-extrabold uppercase tracking-[0.1em] text-brand-teal shadow-chip">
                  {job.tag}
                </span>
                <h3 className="font-display mt-4 text-2xl sm:text-[1.8rem]">
                  {job.role}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
                  {job.blurb}
                </p>
                <ul className="mt-5 space-y-2.5">
                  {job.points.map((pt) => (
                    <li key={pt} className="flex gap-2.5 text-[15px] font-semibold">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-meadow text-white">
                        <svg aria-hidden="true" width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2.5 7.5l3 3 6-7" />
                        </svg>
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                {/* TODO (required before launch): real openings with city,
                    schedule, and published pay range + JobPosting schema. */}
                <p className="mt-6 rounded-xl bg-white/70 px-4 py-2.5 text-[13px] font-semibold text-ink-soft">
                  Openings, cities, and pay ranges are posted here as roles
                  open.
                </p>
                <a
                  href={applyHref}
                  className="btn-pill mt-6 inline-flex h-12 w-fit items-center gap-2.5 rounded-full bg-brand-teal px-7 text-[15px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep"
                >
                  Apply as a {job.tag}
                  <svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Closing apply CTA ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-3 pb-16 sm:px-6 lg:pb-20">
          <div className="relative overflow-hidden rounded-3xl bg-ink px-6 py-14 text-center text-white sm:px-12 lg:py-20">
            <SunSpot className="pointer-events-none absolute -left-8 -top-8 w-32 opacity-30" />
            <Sparkles className="pointer-events-none absolute bottom-8 right-10 hidden w-16 opacity-60 sm:block" />
            <h2 className="font-display display-xl mx-auto max-w-3xl text-3xl sm:text-5xl">
              No opening posted yet?{" "}
              <span className="italic text-sun">Introduce yourself anyway.</span>
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[16px] leading-relaxed text-white/80">
              We&rsquo;re growing across both states, and good people shape
              where we grow next. Email{" "}
              <a href={applyHref} className="font-bold text-sun hover:underline">
                {siteConfig.email}
              </a>{" "}
              with &ldquo;Careers&rdquo; in the subject — tell us where you
              are, what you&rsquo;re certified in, and what you&rsquo;re
              looking for. A real person reads every one.
            </p>
            <a
              href={applyHref}
              className="btn-pill mt-9 inline-flex h-[58px] items-center justify-center gap-2.5 rounded-full bg-white px-10 text-[16px] font-extrabold text-brand-teal-deep transition-colors hover:bg-cream"
            >
              Email the founders
              <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 3l5 5-5 5" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Job-seeker page still gets the family-facing links */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 pb-16 text-center sm:px-6">
          <p className="text-[15px] text-ink-soft">
            Here as a parent?{" "}
            <Link href="/getting-started" className="font-bold text-brand-teal hover:underline">
              Start here instead →
            </Link>
          </p>
        </div>
      </section>
      <StickyCallBar callLabel="Call the team" />
    </>
  );
}
