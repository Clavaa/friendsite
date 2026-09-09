import type { Metadata } from "next";
import Link from "next/link";
import StickyCallBar from "../../components/StickyCallBar";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: "About us",
  description: `${siteConfig.brandName} is a family-founded practice bringing family-centered, individualized ABA therapy to Kansas and Colorado — at home, where progress sticks.`,
  alternates: { canonical: "/about" },
};

/**
 * Founder — REAL person, client-confirmed (Sept 2026):
 * Ruth Gluck, MSEd, BCBA, LBA — "a BCBA with years of clinical and
 * operations experience" (client's words). She is the ONLY named person
 * on the site by client request; keep everyone else under "family-run"
 * framing. Do NOT add further credentials, past employers, years, or
 * headcounts without verifying them with the client first.
 * Initials avatar only — no photo.
 */
const founder = {
  name: "Ruth Gluck",
  credentials: "MSEd, BCBA, LBA",
  role: "Founder",
  initials: "RG",
  bio: [
    "Ruth is a BCBA with years of clinical and operations experience, and she founded Sunbird on a simple belief: therapy works best when the whole family is part of it. A good plan isn’t the one that looks right on paper — it’s the one that fits your child, your home, and your everyday life.",
    "She brings the educator’s eye to that work, too. As a licensed behavior analyst with a master’s in education, she thinks about the whole child — how skills learned in a session show up at the dinner table, at daycare, and everywhere in between.",
    "That’s why she cares so much about the small things. A phone that gets answered. Goals explained in plain English. A team that treats your family the way she’d want her own treated — because her standard for Sunbird is the family standard: if it wouldn’t be good enough for her own kids, it isn’t good enough for yours.",
  ],
} as const;

const values = [
  {
    title: "Family-centered",
    body: "Your family is part of the team, not an audience. You help pick the goals, you see the plan, and you always know what we're working on and why.",
  },
  {
    title: "Individualized care",
    body: "No two kids get the same plan here. Your child's plan is built around what they love, what's hard for them, and what your family wants most.",
  },
  {
    title: "In-home support",
    body: "Kids learn best where they live. We bring therapy into your home, so new skills show up at your dinner table — not just in a clinic room.",
  },
  {
    title: "Progress you can measure",
    body: "We track every session and show you the numbers in plain English. You should never have to wonder if therapy is working — you should see it.",
  },
] as const;

const howItWorks = [
  {
    role: "BCBAs",
    body: "A Board Certified Behavior Analyst designs your child's plan and supervises it every step of the way.",
  },
  {
    role: "RBTs",
    body: "Registered Behavior Technicians deliver the day-to-day sessions, following the plan your BCBA wrote.",
  },
  {
    role: "Care advocates",
    body: "A care advocate guides your family from the first phone call to the first session, so you always know what happens next.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      {/* ————— Hero ————— */}
      <header className="relative overflow-hidden bg-cream">
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 h-[30rem] w-[30rem] rounded-full bg-sun-wash/70"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-44 -left-44 h-[24rem] w-[24rem] rounded-full bg-mint-wash/70"
        />
        <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 sm:px-6 lg:pb-20 lg:pt-20">
          <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.18em] text-brand-teal">
            <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-sun" />
            ABOUT SUNBIRD
          </p>
          <h1 className="font-display mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-[3.4rem]">
            A family company,{" "}
            <span className="block italic text-brand-teal">
              built for families like yours.
            </span>
          </h1>
          <p className="prose-measure mt-5 text-lg text-ink-soft">
            Sunbird was started by a family, and it runs like one. The
            standard is simple: every plan we write, every call we return,
            every session we run should be good enough for our own kids —
            because that&rsquo;s what your kids deserve, in Kansas and in
            Colorado.
          </p>
        </div>
      </header>

      {/* ————— Founder ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              Meet the founder
            </h2>
            <p className="mt-3 text-ink-soft">
              Sunbird is founder-run. When you call, you&rsquo;re reaching a
              company small enough that the person who started it still knows
              every family by name.
            </p>
          </div>

          {/*
            Client-confirmed name, credentials, and role line only (see
            note above the founder object). Verify with the client before
            adding anything more specific.
          */}
          <article className="mt-10 grid gap-8 rounded-3xl bg-cream p-8 shadow-card sm:p-10 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-12 lg:p-14">
            <div className="flex flex-row items-center gap-5 lg:flex-col lg:items-start lg:gap-6">
              <span
                aria-hidden="true"
                className="font-display grid h-24 w-24 shrink-0 place-items-center rounded-full bg-mint-wash text-3xl text-brand-teal-deep lg:h-32 lg:w-32 lg:text-4xl"
              >
                {founder.initials}
              </span>
              <div>
                <h3 className="font-display text-2xl lg:text-[1.8rem]">
                  {founder.name}
                </h3>
                <p className="mt-1 text-[15px] font-bold text-ink-soft">
                  {founder.credentials}
                </p>
                <p className="mt-1.5 text-[14px] font-bold tracking-wide text-brand-teal">
                  {founder.role}
                </p>
              </div>
            </div>
            <div>
              {founder.bio.map((para, i) => (
                <p
                  key={para.slice(0, 24)}
                  className={`text-[16.5px] leading-relaxed text-ink-soft ${i > 0 ? "mt-5" : ""}`}
                >
                  {para}
                </p>
              ))}
              <p className="font-display mt-8 text-[1.35rem] leading-snug text-brand-teal">
                Family-run, and it shows —{" "}
                <span className="italic">
                  in every plan, every call, every session.
                </span>
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* ————— What we believe ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              What we believe
            </h2>
            <p className="mt-3 text-ink-soft">
              Four ideas shape every plan we write and every session we run.
            </p>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {values.map((v) => (
              <div key={v.title} className="rounded-3xl bg-white p-7 shadow-card">
                <span
                  aria-hidden="true"
                  className="grid h-10 w-10 place-items-center rounded-full bg-sun-wash text-brand-teal-deep"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
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

      {/* ————— How Sunbird works ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              How Sunbird works
            </h2>
            <p className="mt-3 text-ink-soft">
              We&rsquo;re a small, growing team with a simple structure — so
              you always know who does what for your child.
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {howItWorks.map((t) => (
              <div key={t.role} className="rounded-3xl bg-cream p-6">
                <h3 className="font-display text-xl">{t.role}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {t.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Closing CTA ————— */}
      <section className="bg-ink text-white">
        <div className="rainbow-strip" aria-hidden="true" />
        <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-16">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              Come see if we&rsquo;re your kind of people.
            </h2>
            <p className="mt-3 text-white/75">
              One short call with a care advocate — your questions first, no
              pressure, no diagnosis required to start the conversation.
            </p>
            <p className="mt-4 text-[15px] font-semibold text-white/85">
              No diagnosis yet?{" "}
              <Link
                href="/get-a-diagnosis"
                className="font-bold text-sun underline decoration-sun/40 underline-offset-4 hover:decoration-sun"
              >
                We&rsquo;ll help you get one &rarr;
              </Link>
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/getting-started"
              className="rounded-full bg-white px-7 py-3.5 text-center text-[16px] font-bold text-brand-teal-deep transition-colors hover:bg-cream"
            >
              Match me with an advocate
            </Link>
            <a
              href={siteConfig.phoneHref}
              className="rounded-full border border-white/30 px-7 py-3.5 text-center text-[16px] font-bold text-white transition-colors hover:border-white"
            >
              Call {siteConfig.phone}
            </a>
          </div>
        </div>
      </section>

      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
