import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  FeatherSpot,
  HandUnderline,
  RisingSun,
  Sparkles,
} from "../components/Accents";
import Carousel from "../components/Carousel";
import EmailCapture from "../components/EmailCapture";
import InsuranceWall from "../components/InsuranceWall";
import LeadForm from "../components/LeadForm";
import PhotoTour from "../components/PhotoTour";
import StickyCallBar from "../components/StickyCallBar";
import { siteConfig } from "../../site.config";
import { getGuide } from "../data/guides";

export const metadata: Metadata = {
  title: `ABA therapy for children in Kansas & Colorado | ${siteConfig.brandName}`,
  description:
    "BCBA-led ABA therapy for children with autism in Kansas and Colorado — in-home, daycare-based and telehealth, from a family-run practice. Free benefit check, fast answers. Talk to an intake advocate today.",
  alternates: { canonical: "/" },
};

/* ————— Shared pill CTA styles (48px pills; 62px for the big moments) ————— */
const solidPill =
  "btn-pill inline-flex h-12 items-center justify-center gap-2.5 rounded-full bg-brand-teal px-7 text-[15px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep";
const outlinePill =
  "btn-pill inline-flex h-12 items-center justify-center gap-2.5 rounded-full border-2 border-ink/70 px-7 text-[15px] font-extrabold text-ink transition-colors hover:border-ink hover:bg-ink hover:text-white";
const bigSolidPill =
  "btn-pill inline-flex h-[62px] items-center justify-center gap-3 rounded-full bg-brand-teal px-12 text-[19px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep";
const eyebrowClass =
  "text-[14px] font-extrabold uppercase tracking-[0.18em] text-ink";
const eyebrowTeal =
  "text-[14px] font-extrabold uppercase tracking-[0.18em] text-brand-teal";

function Chevron({ size = 14 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3l5 5-5 5" />
    </svg>
  );
}

function PhoneIcon({ size = 20 }: { size?: number }) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 011 1V20a1 1 0 01-1 1C10.61 21 3 13.39 3 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.24.2 2.45.57 3.57a1 1 0 01-.24 1.02l-2.21 2.2z" />
    </svg>
  );
}

function CheckDot({ className = "" }: { className?: string }) {
  return (
    <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full bg-meadow text-white ${className}`}>
      <svg aria-hidden="true" width="11" height="11" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2.5 7.5l3 3 6-7" />
      </svg>
    </span>
  );
}

/* ————— Data for the section stacks (homepage copy lives here) ————— */

const serviceCards: {
  href: string;
  title: string;
  blurb: string;
  img: { src: string; alt: string };
  comingSoon?: boolean;
}[] = [
  {
    href: "/services/in-home-aba",
    title: "In-home ABA",
    blurb: "Therapy where real life happens — mealtimes, mornings, siblings and all.",
    img: { src: "/images/magnetic-tiles-living-room.jpg", alt: "A woman and a toddler building with colorful magnetic tiles on a rug" },
  },
  {
    href: "/services/daycare-based",
    title: "Daycare-based support",
    blurb: "Your child's plan travels to daycare — one set of strategies across their whole day.",
    img: { src: "/images/picture-cards-classroom.jpg", alt: "A woman showing picture cards to a young child at a classroom table" },
  },
  {
    href: "/services/parent-training",
    title: "Parent training",
    blurb: "Practical coaching for the moments nobody else sees — in person or by video.",
    img: { src: "/images/family-puzzle-kitchen.jpg", alt: "Two women and a young boy working on a colorful shape puzzle at a kitchen table" },
  },
  {
    href: "/services/center-based-aba",
    title: "In-center ABA",
    blurb: "Structured spaces, peers to practice with, and a gentle on-ramp to school.",
    img: { src: "/images/blocks-play-living-room.jpg", alt: "A woman and a young girl stacking colorful wooden blocks together" },
    comingSoon: true,
  },
];

/* "What ABA helps with" tiles — the plain-words education strip. Icons
   are simple line glyphs in the brand teal; copy names outcomes a parent
   can recognize, never clinical claims. */
const abaHelps: { title: string; body: string; icon: React.ReactNode }[] = [
  {
    title: "Communication",
    body: "Words, signs, or pictures — your child learns to ask for what they want, so they don't have to melt down to be heard.",
    icon: (
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    ),
  },
  {
    title: "Connection & play",
    body: "Taking turns, sharing space, joining other kids — the skills that turn parallel play into friendship.",
    icon: (
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Everyday independence",
    body: "Dressing, mealtimes, tooth-brushing, toilet training — big skills broken into steps small enough to win.",
    icon: (
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4" />
        <path d="M5 9l2.5 2" />
        <path d="M19 9l-2.5 2" />
        <path d="M12 22a7 7 0 0 0 7-7c0-4-3-6-7-9-4 3-7 5-7 9a7 7 0 0 0 7 7z" />
      </svg>
    ),
  },
  {
    title: "Calmer hard moments",
    body: "Fewer meltdowns, easier transitions, and a plan for the moments that used to run the whole day.",
    icon: (
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 13a10 10 0 0 1 20 0" />
        <path d="M5 13a7 7 0 0 1 14 0" />
        <path d="M8 13a4 4 0 0 1 8 0" />
        <circle cx="12" cy="17" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

/* Struggle → answer rows (copy rewritten 9/2026 per client feedback:
   plainer, warmer, less wit-forward). Layout unchanged — editorial
   two-column rows with a teal-edge answer panel. */
const struggles = [
  {
    struggle: "Making sense of insurance.",
    struggleBody:
      "Plans, approvals, letters full of words nobody uses in real life. It's a lot to sort out on your own.",
    answer: "We check your benefits for free.",
    answerBody:
      "Send us a photo of your insurance card. We'll tell you what your plan covers and what it may cost, in plain words — usually within a business day, and always free.",
  },
  {
    struggle: "Knowing what to do next.",
    struggleBody:
      "Diagnosis, paperwork, scheduling — the steps aren't obvious, and nobody hands you a list.",
    answer: "We guide you step by step.",
    answerBody:
      "Your intake advocate stays with you from the first call to the first session, and your BCBA builds the plan with you. You'll always know what's happening now and what comes next.",
  },
  {
    struggle: "Getting through the daily routines.",
    struggleBody:
      "Mornings, meals, bedtime, errands. Some parts of the day are just hard — and you're the one in them.",
    answer: "We coach you, not just your child.",
    answerBody:
      "Parent coaching comes with every plan. Your BCBA practices your real routines with you — at home or by video — with simple strategies you can use the same day.",
  },
  {
    struggle: "Looking after the whole family.",
    struggleBody:
      "Autism care touches everyone — siblings, work, your own rest. Your family deserves support too.",
    answer: "We're here for all of you.",
    answerBody:
      "A phone number a person answers, regular check-ins, and honest answers when something isn't working. We support your whole family, not just the therapy hour.",
  },
];

/* The journey timeline — first call through visible progress. Durations
   only where honest (the 15-minute call and the ~1-business-day benefit
   check are the only timelines we can promise; everything else stays
   unclocked on purpose). */
const journey = [
  {
    n: "01",
    label: "Say hello",
    duration: "A 15-minute call",
    title: "Your questions first.",
    body: "You talk with an intake advocate — a person, not a phone tree. Tell us about your child, ask anything, and hang up knowing exactly what happens next.",
  },
  {
    n: "02",
    label: "Free benefit check",
    duration: "Usually within a business day",
    title: "We verify your coverage.",
    body: "One photo of your insurance card. We come back with a plain-English summary of what your plan covers and what it would cost you — always free.",
  },
  {
    n: "03",
    label: "Meet your BCBA",
    duration: "Scheduled around your family",
    title: "Assessment, then a plan built with you.",
    body: "A board-certified behavior analyst spends real time with your child and writes the treatment plan with you, not for you. We handle the authorization paperwork.",
  },
  {
    n: "04",
    label: "First session",
    duration: "At home or at daycare",
    title: "Therapy starts where life happens.",
    body: "Sessions begin in your home, at your child's daycare, or by video — woven around naps, school, siblings and work, with parent coaching from day one.",
  },
  {
    n: "05",
    label: "Progress you can see",
    duration: "Reviewed with you, every step",
    title: "Growing toward graduation.",
    body: "Progress is measured at every session and reviewed with you in plain English. Your BCBA adjusts the plan as your child grows — and the goal is always the day they don't need us anymore.",
  },
];

/* Stage-based triage — meets the parent wherever they are on the road.
   Each stage routes to its own funnel; the tints alternate the washes. */
const startStages = [
  {
    eyebrow: "Just wondering",
    title: "I think my child might have autism.",
    body: "Trust the feeling enough to check it out. We'll walk you through what a real evaluation looks like in your state — and what you can do while you wait for one.",
    cta: "Get diagnostic help",
    href: "/get-a-diagnosis",
    tint: "bg-mint-wash",
  },
  {
    eyebrow: "Just diagnosed",
    title: "We got the diagnosis. Now what?",
    body: "Breathe first. Then read our calm, do-able checklist for the first few weeks — what actually helps now, and what's allowed to wait.",
    cta: "Read the first-steps guide",
    href: "/resources/first-steps-after-a-diagnosis",
    tint: "bg-sun-wash",
  },
  {
    eyebrow: "Doing the research",
    title: "I want to understand ABA first.",
    body: "Smart. Start with the plain-words guide to what ABA is and what a session really looks like — then decide if it sounds right for your child.",
    cta: "Learn how ABA works",
    href: "/resources/what-is-aba",
    tint: "bg-white shadow-card",
  },
];

/* The three guides featured on the homepage shelf — pulled from the
   guides data so titles/blurbs never drift from the hub. */
const featuredGuides = (
  ["paying-for-aba", "preparing-for-your-first-session", "aba-glossary"] as const
).flatMap((slug) => {
  const g = getGuide(slug);
  return g
    ? [{ title: g.cardTitle, blurb: g.cardBlurb, minutes: g.minutes, href: `/resources/${g.slug}` }]
    : [];
});

const tourPhotos = [
  {
    src: "/images/family-puzzle-kitchen.jpg",
    alt: "Two women and a young boy working a colorful shape puzzle at a sunny kitchen table",
    caption: "In your home",
  },
  {
    src: "/images/picture-cards-classroom.jpg",
    alt: "A woman showing colorful picture cards to a young child at a low classroom table",
    caption: "In the classroom",
  },
  {
    src: "/images/blocks-play-living-room.jpg",
    alt: "A woman and a young girl smiling while stacking wooden blocks on a living room floor",
    caption: "Learning through play",
  },
  {
    src: "/images/playground-bubbles.jpg",
    alt: "A woman blowing bubbles with a laughing young boy on a sunny playground",
    caption: "Out in the world",
  },
  {
    src: "/images/magnetic-tiles-living-room.jpg",
    alt: "A woman and a toddler girl building a house from magnetic tiles on a living room rug",
    caption: "Session in progress",
  },
] as const;

const homeFaqs = [
  {
    q: "Is ABA therapy for my child?",
    a: "ABA is designed for children with an autism diagnosis — most start between ages 2 and 6, though we support older children too. If you're not sure yet, that's exactly what the first call is for: tell us what you're seeing and we'll help you figure out the right next step, diagnosis or not.",
  },
  {
    q: "When can I receive ABA therapy?",
    a: "Sooner than you might fear. The first call takes 15 minutes, and the free benefit check usually comes back within a business day — that's the step that unlocks everything else. From there the pace depends mostly on your plan's approval, so we won't promise a date we can't keep — but we chase every step daily and give you an honest start window on the very first call.",
  },
  {
    q: "Does insurance cover ABA in Kansas and Colorado?",
    a: "Coverage varies by plan, so we check yours instead of guessing. Most families pay little or nothing once benefits are confirmed — send us a photo of your insurance card and we'll run a free benefit check and tell you exactly where you stand, usually within a business day.",
  },
  {
    q: "Do we need a diagnosis before starting?",
    a: "Insurance requires a formal autism diagnosis before covering ABA. If you're still waiting on one, start with our diagnosis guide — we'll point you to evaluation options in your state and stay with you through the process.",
  },
  {
    q: "Where do sessions happen?",
    a: "Wherever they'll work best for your child: your home, your child's daycare, or over secure video — with our in-center program coming soon. Many families mix settings, and your BCBA helps you choose.",
  },
  {
    q: "What if our schedule is already packed?",
    a: "That's normal, not a barrier. Sessions are scheduled around naps, school, siblings and work — and parent coaching can happen at home or by video after bedtime. We fit the plan to your life.",
  },
];

export default function HomePage() {
  const { kansas, colorado } = siteConfig.states;
  return (
    <>
      {/* ————— 1 · Hero: copy stack + quick-call pill on the left, intake
                 card on the right, rising sun cresting the horizon curve.
                 Deliberately full-bleed (no giant rounded card wrapper) —
                 the mint field runs edge to edge and lands on the slim teal
                 settings ribbon, our own shape language. ————— */}
      <section className="relative overflow-hidden bg-mint-wash">
        <div className="relative mx-auto max-w-[87rem]">
          <div className="relative z-10 grid gap-10 px-5 pt-12 sm:px-10 sm:pt-16 lg:grid-cols-[minmax(0,1fr)_minmax(0,29.5rem)] lg:gap-14 lg:px-14 lg:pt-[4.5rem] xl:grid-cols-[minmax(0,1fr)_minmax(0,31rem)] xl:gap-20">
            {/* Left: the full copy stack, still huge, now left-set */}
            <div className="flex flex-col text-center lg:text-left">
              <p className={eyebrowClass}>{siteConfig.eyebrow}</p>
              <h1 className="font-display display-hero mt-6 text-[2.6rem] sm:text-6xl lg:mt-7 lg:text-[4.1rem] xl:text-[4.75rem]">
                ABA therapy for children{" "}
                <span className="italic text-brand-teal">
                  in Kansas &amp; Colorado
                </span>
              </h1>
              <p className="font-display mt-6 text-xl text-ink sm:text-[1.45rem]">
                {siteConfig.taglineLead}{" "}
                <span className="italic text-brand-teal">{siteConfig.taglineFeel}</span>
              </p>
              <p className="mx-auto mt-5 max-w-[36rem] text-[17px] leading-relaxed text-ink-soft lg:mx-0">
                Compassionate, BCBA-led therapy for your child — and an intake
                team that answers the phone, does the insurance legwork, and
                never leaves you guessing what happens next.
              </p>
              {/* Quick call to action — one tap on mobile */}
              <div className="mt-8 flex flex-col items-center gap-3 lg:items-start">
                <a href={siteConfig.phoneHref} className={bigSolidPill}>
                  <PhoneIcon /> Call {siteConfig.phone}
                </a>
              </div>
              {/* Rising sun + hummingbird cresting the horizon (desktop) —
                  the modality checklist now lives in the teal settings
                  ribbon directly below the hero. */}
              <div className="pointer-events-none relative mt-4 hidden min-h-[11rem] flex-1 items-end justify-center lg:flex">
                <RisingSun className="-mb-12 w-[34rem] max-w-full" />
              </div>
            </div>
            {/* Right: the intake card */}
            <div className="relative pb-10 lg:pb-14 lg:pt-2">
              <Sparkles className="pointer-events-none absolute -top-11 right-1 hidden w-20 opacity-90 lg:block" />
              <LeadForm sourcePage="home" />
            </div>
          </div>
          {/* Mobile / tablet: the sun crests the horizon under the card */}
          <div className="pointer-events-none relative mt-2 flex justify-center lg:hidden">
            <RisingSun className="-mb-2 w-[19rem] max-w-[80%] sm:w-[26rem]" />
          </div>
          {/* corner sparkles */}
          <FeatherSpot className="pointer-events-none absolute bottom-[7rem] left-[3%] hidden w-16 -rotate-6 opacity-60 xl:block" />
          <Sparkles className="pointer-events-none absolute bottom-12 right-[5%] hidden w-16 opacity-70 lg:block" />
        </div>
      </section>

      {/* ————— 1b · Settings ribbon: where care happens + the free benefit
                 check, in one slim teal band. This carries the modality
                 checklist that used to sit inside the hero. ————— */}
      <section aria-label="Where sessions happen" className="bg-brand-teal text-white">
        <div className="mx-auto flex max-w-[87rem] flex-wrap items-center justify-center gap-x-8 gap-y-2.5 px-4 py-4 sm:px-6 lg:justify-between lg:py-3.5">
          <ul className="flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5">
            {siteConfig.trustChecklist.map((item) => (
              <li key={item.label} className="flex items-center gap-2.5 text-[14.5px] font-bold">
                {item.soon ? (
                  <span
                    aria-hidden="true"
                    className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full border-2 border-sun bg-sun/25"
                  />
                ) : (
                  <span className="grid h-[18px] w-[18px] shrink-0 place-items-center rounded-full bg-sun text-ink">
                    <svg aria-hidden="true" width="10" height="10" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 7.5l3 3 6-7" />
                    </svg>
                  </span>
                )}
                {item.label}
                {item.soon && (
                  <span className="-ml-1 text-[12.5px] font-semibold italic text-white/75">
                    coming soon
                  </span>
                )}
              </li>
            ))}
          </ul>
          <Link
            href="/insurance"
            className="link-grow text-center text-[14.5px] font-extrabold text-sun lg:text-left"
          >
            Free benefit check — usually back within a business day
          </Link>
        </div>
      </section>

      {/* ————— 2 · Coverage wall with KS/CO selector ————— */}
      <InsuranceWall />

      {/* ————— 3 · Empathy split: wash panel + photo, then one big CTA ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-3 pt-4 sm:px-6">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="reveal flex flex-col justify-center rounded-3xl bg-sun-wash p-8 sm:p-14 lg:p-[5.5rem]">
              <h2 className="font-display display-xl text-4xl sm:text-5xl lg:text-[3.75rem]">
                Nobody knows your child like you do.
              </h2>
              <div className="mt-8 space-y-4 text-[17px] leading-relaxed text-ink-soft">
                <p>
                  Not the specialists, not the search results, not the
                  well-meaning advice coming from every direction.{" "}
                  <strong className="text-ink">
                    You&rsquo;re the one who knows
                  </strong>{" "}
                  what a good day looks like, which small things are actually
                  big things, and exactly how brave your kid really is.
                </p>
                <p>
                  So that&rsquo;s where Sunbird starts.{" "}
                  <strong className="text-ink">
                    We&rsquo;re a family-run practice
                  </strong>{" "}
                  — started by a family, still run by one — and we build every
                  plan the way we&rsquo;d want one built for our own kids: with
                  you at the table, never in the waiting room.
                </p>
                <p className="font-bold text-ink">
                  You bring the expertise on your child. We bring everything
                  else.
                </p>
              </div>
              <p className="font-display mt-10 text-[1.75rem] leading-[1.2] text-brand-teal sm:text-[2.1rem]">
                One family to another:{" "}
                <span className="italic">we&rsquo;ve got you.</span>
              </p>
            </div>
            <div className="relative min-h-[22rem] overflow-hidden rounded-3xl lg:min-h-0">
              <Image
                src="/images/fruit-snack-kitchen.jpg"
                alt="A parent handing a piece of fruit to a smiling young child in a bright kitchen"
                fill
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-14 flex justify-center">
            <Link href="/getting-started" className={bigSolidPill}>
              Get help today <Chevron size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ————— 4 · Giant typographic welcome band ————— */}
      <section className="bg-cream">
        <div className="reveal mx-auto max-w-[87rem] px-4 pb-10 pt-24 text-center sm:px-6">
          <h2 className="font-display display-hero mx-auto max-w-[76rem] text-[2.6rem] text-brand-teal sm:text-6xl lg:text-[5.5rem]">
            Here for your{" "}
            <span className="relative inline-block">
              child.
              <HandUnderline className="absolute -bottom-1 left-0 h-3 w-[86%] sm:-bottom-2 sm:h-4" />
            </span>
            <span className="block italic">And for everyone who loves them.</span>
          </h2>
          <p className="mx-auto mt-9 max-w-[42rem] text-[17px] leading-relaxed text-ink-soft sm:text-lg">
            Your child needs ABA therapy —{" "}
            <strong className="text-ink">but what does your family need?</strong>{" "}
            We&rsquo;re a family-run practice, and we treat your family like
            family: support wrapped around the whole household, not just the
            hour of therapy.
          </p>
        </div>
      </section>

      {/* ————— 5 · Core service: full-bleed photo + overlapping wash panel ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-3 pt-10 sm:px-6">
          <div className="relative lg:py-16">
            <div className="relative min-h-[24rem] overflow-hidden rounded-3xl sm:min-h-[30rem] lg:min-h-[44rem]">
              <Image
                src="/images/magnetic-tiles-living-room.jpg"
                alt="A woman and a toddler girl building a house out of colorful magnetic tiles together on a living room rug"
                fill
                sizes="(min-width: 1024px) 87rem, 100vw"
                className="object-cover"
              />
            </div>
            {/* Overlap panel breaks the photo's top and bottom edge on desktop */}
            <div className="lg:absolute lg:inset-y-0 lg:right-10 lg:flex lg:w-[41rem] lg:items-center">
              <div className="reveal w-full rounded-b-3xl bg-mint-wash p-8 sm:p-12 lg:rounded-3xl lg:p-[4.5rem] lg:shadow-card-lg">
                <p className={eyebrowTeal}>ABA therapy</p>
                <h3 className="font-display display-xl mt-7 text-4xl sm:text-5xl lg:text-[3.75rem]">
                  The heart of what we do.
                </h3>
                <p className="mt-6 text-[17px] leading-relaxed text-ink-soft">
                  One-on-one, BCBA-designed therapy that teaches the skills
                  your child needs now and for life —{" "}
                  <strong className="text-ink">
                    built around your real routines
                  </strong>
                  , with parents coached at every step, never left in the
                  waiting room.
                </p>
                <Link href="/services/in-home-aba" className={`${solidPill} mt-8`}>
                  Learn all about ABA <Chevron />
                </Link>
                <p className="mt-6 flex items-center gap-2.5 text-[14px] font-bold">
                  <CheckDot /> At home, at daycare, or by video — in-center coming soon
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ————— 5b · What ABA helps with: plain-words education strip.
                 Answers "what even is ABA?" right on the homepage — four
                 outcome tiles a parent can recognize their child in, with
                 the full guide one click away. ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 pt-24 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <p className={eyebrowTeal}>What is ABA therapy?</p>
            <h2 className="font-display display-xl mt-6 text-4xl sm:text-5xl lg:text-[3.4rem]">
              Play on the outside. A plan underneath.
            </h2>
            <p className="mt-6 text-[17px] leading-relaxed text-ink-soft">
              ABA is one-on-one teaching built around what motivates your
              child — and progress gets measured at every session. Four
              places families feel it first:
            </p>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {abaHelps.map((tile) => (
              <div
                key={tile.title}
                className="reveal rounded-3xl bg-white p-7 shadow-card"
              >
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 place-items-center rounded-2xl bg-mint-wash text-brand-teal"
                >
                  {tile.icon}
                </span>
                <h3 className="font-display mt-5 text-[1.35rem] leading-snug">
                  {tile.title}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {tile.body}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/resources/what-is-aba" className={solidPill}>
              Read the plain-words guide <Chevron />
            </Link>
            <Link href="/resources/aba-glossary" className={outlinePill}>
              Decode the jargon <Chevron />
            </Link>
          </div>
        </div>
      </section>

      {/* ————— 6 · Services carousel with working arrows ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 pb-12 pt-28 sm:px-6">
          <p className="text-center text-[17px] font-extrabold uppercase tracking-[0.14em] text-ink">
            Our services
          </p>
          <Carousel
            ariaLabel="Our services"
            step={552}
            className="mt-12"
            trackClassName="-mx-4 px-4 pb-2 sm:-mx-6 sm:px-6"
          >
            {serviceCards.map((c) => (
              <Link
                key={c.href + c.title}
                href={c.href}
                className="group w-[250px] shrink-0 snap-start lg:w-[300px]"
              >
                <div className="relative h-[196px] overflow-hidden rounded-[20px] lg:h-[228px]">
                  <Image
                    src={c.img.src}
                    alt={c.img.alt}
                    fill
                    sizes="(min-width: 1024px) 300px, 250px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {c.comingSoon && (
                    <span className="absolute left-3 top-3 rounded-full bg-white px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-brand-teal shadow-chip">
                      Coming soon
                    </span>
                  )}
                </div>
                <h3 className="font-display mt-8 flex items-start justify-between gap-2 text-[1.6rem] leading-[1.05]">
                  {c.title}
                  <span className="mt-1.5 shrink-0 text-brand-teal transition-transform duration-300 group-hover:translate-x-1">
                    <Chevron />
                  </span>
                </h3>
                <p className="mt-4 text-[16px] leading-relaxed text-ink-soft">
                  {c.blurb}
                </p>
              </Link>
            ))}
          </Carousel>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/getting-started" className={solidPill}>
              Get in touch <Chevron />
            </Link>
            <Link href="/services" className={outlinePill}>
              View all services <Chevron />
            </Link>
          </div>
        </div>
      </section>

      {/* ————— 7 · Parent-pain rows: editorial struggle → answer ledger.
                 Deliberately plain structure — bold Fraunces struggle line
                 on the left, teal-edged answer panel on the right, hairline
                 dividers between rows. No decorative art in this section. ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 py-[6.25rem] sm:px-6">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-2xl">
              <h2 className="font-display display-xl text-4xl sm:text-[3.4rem]">
                Real support for real life.
              </h2>
              <p className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft">
                Here&rsquo;s what that looks like at Sunbird, in plain terms.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:pb-1">
              <Link href="/getting-started" className={solidPill}>
                Parent support <Chevron />
              </Link>
              <a href={siteConfig.phoneHref} className={outlinePill}>
                Get in touch <Chevron />
              </a>
            </div>
          </div>

          <div className="mt-16 border-t-2 border-ink/10">
            {struggles.map((row, i) => (
              <div
                key={row.struggle}
                className="reveal grid gap-7 border-b-2 border-ink/10 py-11 lg:grid-cols-2 lg:gap-20 lg:py-14"
              >
                <div className="flex gap-6">
                  <p
                    aria-hidden="true"
                    className="font-display pt-1 text-lg leading-none text-ink-soft/60"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <div>
                    <h3 className="font-display max-w-md text-[1.85rem] leading-[1.12] sm:text-[2.15rem]">
                      {row.struggle}
                    </h3>
                    <p className="mt-4 max-w-md text-[16px] leading-relaxed text-ink-soft">
                      {row.struggleBody}
                    </p>
                  </div>
                </div>
                <div className="self-center rounded-r-3xl border-l-4 border-brand-teal bg-white p-7 shadow-card sm:p-9 lg:ml-auto lg:w-full lg:max-w-xl">
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-teal">
                    Our answer
                  </p>
                  <h4 className="font-display mt-3 text-[1.4rem]">{row.answer}</h4>
                  <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
                    {row.answerBody}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— 8 · Reviews: removed while the practice is new and has no
                 real reviews yet. The component + its site.config gating are
                 intact — restore with `import Reviews from
                 "../components/Reviews"` and `<Reviews />` here.
                 Re-enable when real consented reviews exist in site.config.ts */}

      {/* ————— 9 · Your child's journey with Sunbird: five-stage timeline,
                 horizontal on desktop, vertical rail on mobile. Replaces
                 the old get-started accordion (same content, richer form). ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-3 py-10 sm:px-6">
          <div className="rounded-3xl bg-mint-wash px-6 py-14 sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="mx-auto max-w-2xl text-center">
              <p className={eyebrowTeal}>From first call to first wins</p>
              <h2 className="font-display display-xl mt-6 text-4xl sm:text-5xl lg:text-[3.4rem]">
                Your child&rsquo;s journey with Sunbird
              </h2>
              <p className="mt-6 text-[17px] leading-relaxed text-ink-soft">
                Five stages, one team walking them with you — and you&rsquo;ll
                always know which one you&rsquo;re on.
              </p>
            </div>

            <ol className="mt-14 space-y-12 lg:grid lg:grid-cols-5 lg:gap-8 lg:space-y-0">
              {journey.map((s, i) => (
                <li key={s.n} className="reveal relative pl-[4.5rem] lg:pl-0">
                  {/* stage disc */}
                  <span
                    aria-hidden="true"
                    className="font-display absolute left-0 top-0 z-10 grid h-12 w-12 place-items-center rounded-full bg-sun text-[17px] text-ink shadow-chip lg:relative lg:mb-7"
                  >
                    {s.n}
                  </span>
                  {/* connector to the next stage: vertical on mobile,
                      horizontal dashed flight-line on desktop */}
                  {i < journey.length - 1 && (
                    <>
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-[3.25rem] left-[23px] top-[3.4rem] w-0 border-l-2 border-dashed border-brand-teal/40 lg:hidden"
                      />
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -right-8 left-[3.6rem] top-6 hidden h-0 border-t-2 border-dashed border-brand-teal/40 lg:block"
                      />
                    </>
                  )}
                  <p className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-brand-teal">
                    {s.label}
                  </p>
                  <h3 className="font-display mt-2.5 text-[1.35rem] leading-snug">
                    {s.title}
                  </h3>
                  <p className="mt-3 inline-block rounded-full bg-cream px-3.5 py-1.5 text-[12.5px] font-bold text-brand-teal-deep shadow-chip">
                    {s.duration}
                  </p>
                  <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                    {s.body}
                  </p>
                </li>
              ))}
            </ol>

            <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/getting-started" className={solidPill}>
                Start stage one today <Chevron />
              </Link>
              <a href={siteConfig.phoneHref} className={outlinePill}>
                Call {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ————— 10 · Care near you: photo tour + giant headline + city pills ————— */}
      <section className="bg-sun-wash">
        <div className="mx-auto max-w-[87rem] px-4 py-[7.5rem] sm:px-6">
          <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:gap-20">
            <PhotoTour photos={tourPhotos} />
            <div className="reveal">
              <p className={eyebrowClass}>Where sessions happen</p>
              <h2 className="font-display display-hero mt-7 text-[3.4rem] text-brand-teal sm:text-7xl lg:text-[6.25rem]">
                Care <span className="italic">near you.</span>
              </h2>
              <p className="mt-9 max-w-lg text-[17px] font-bold leading-relaxed">
                The setting serves the plan — never the other way around. Many
                families mix more than one.
              </p>
              <ul className="mt-6 max-w-lg space-y-4 text-[16px] leading-relaxed text-ink-soft">
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-teal" />
                  <span><strong className="text-ink">In your home</strong> — daily-living skills taught where they&rsquo;re actually used, siblings and all.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-brand-teal" />
                  <span><strong className="text-ink">At daycare &amp; by video</strong> — one consistent plan across your child&rsquo;s whole day, plus BCBA coaching after bedtime.</span>
                </li>
                <li className="flex gap-3">
                  <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-sun" />
                  <span><strong className="text-ink">In a center</strong> <em>(coming soon)</em> — peers to practice with and routines deliberately shaped like school.</span>
                </li>
              </ul>
              <Link href="/services" className={`${solidPill} mt-12`}>
                Explore the settings <Chevron />
              </Link>
            </div>
          </div>

          <p className="mt-24 text-center text-[16px]">
            <strong>Two states, one local team.</strong> Your town not listed?{" "}
            <a href={siteConfig.phoneHref} className="link-grow font-bold text-brand-teal">
              Ask us anyway
            </a>{" "}
            — service areas grow around families.
          </p>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {([kansas, colorado] as const).map((state) => (
              <li key={state.slug}>
                <Link
                  href={`/${state.slug}`}
                  className="btn-pill inline-flex h-[54px] items-center gap-2 rounded-full bg-brand-teal px-8 text-[15px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep"
                >
                  {state.name} <Chevron />
                </Link>
              </li>
            ))}
            {([kansas, colorado] as const).flatMap((state) =>
              state.cities.map((city) => (
                <li key={`${state.slug}-${city.slug}`}>
                  <Link
                    href={`/${state.slug}/${city.slug}`}
                    className="inline-flex h-[54px] items-center rounded-full border border-ink/15 bg-cream px-7 text-[15px] font-bold transition-all hover:-translate-y-0.5 hover:border-brand-teal hover:text-brand-teal"
                  >
                    {city.name}
                    {"displaySuffix" in city && city.displaySuffix
                      ? `, ${city.displaySuffix}`
                      : ""}
                  </Link>
                </li>
              )),
            )}
          </ul>
        </div>
      </section>

      {/* ————— 11 · Wherever you are, start there: stage-based triage.
                 Meets the parent at their stop on the road — suspicion,
                 fresh diagnosis, or research mode — and routes each to its
                 own next step. Text-first cards on purpose (no photo grid). ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 py-[8rem] sm:px-6">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display display-xl text-4xl sm:text-6xl lg:text-[4.25rem]">
              Wherever you are, start there.
            </h2>
            <p className="mx-auto mt-7 max-w-xl text-[17px] leading-relaxed text-ink-soft">
              Families find us at every stop on this road. Pick the sentence
              that sounds like your house right now.
            </p>
          </div>
          <div className="mt-14 grid gap-5 lg:grid-cols-3">
            {startStages.map((stage) => (
              <Link
                key={stage.title}
                href={stage.href}
                className={`lift reveal group flex h-full flex-col rounded-3xl p-8 sm:p-9 ${stage.tint}`}
              >
                <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-teal">
                  {stage.eyebrow}
                </p>
                <h3 className="font-display mt-4 text-[1.7rem] leading-[1.15] sm:text-[1.9rem]">
                  &ldquo;{stage.title}&rdquo;
                </h3>
                <p className="mt-4 flex-1 text-[15.5px] leading-relaxed text-ink-soft">
                  {stage.body}
                </p>
                <p className="mt-7 flex items-center gap-2.5 text-[15px] font-extrabold text-brand-teal">
                  {stage.cta}
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <Chevron />
                  </span>
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-12 text-center text-[16px]">
            <strong>Or skip the reading.</strong>{" "}
            <a href={siteConfig.phoneHref} className="link-grow font-bold text-brand-teal">
              Call {siteConfig.phone}
            </a>{" "}
            — a person answers, and 15 minutes covers a lot of road.
          </p>
        </div>
      </section>

      {/* ————— 11b · Parent-guides shelf: the resources hub, one scroll
                 from the FAQ. Slim on purpose — three guides + the door. ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-3 pb-24 sm:px-6">
          <div className="rounded-3xl bg-sun-wash px-6 py-12 sm:px-10 lg:px-14">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className={eyebrowTeal}>Parent guides</p>
                <h2 className="font-display display-xl mt-5 text-3xl sm:text-[2.6rem]">
                  Read up while dinner cooks.
                </h2>
                <p className="mt-4 text-[16.5px] leading-relaxed text-ink-soft">
                  Short, plain-words guides — no dates, no jargon, no
                  homework. Written for parents, not clinicians.
                </p>
              </div>
              <Link href="/resources" className={`${solidPill} shrink-0 self-start lg:self-auto`}>
                Browse all guides <Chevron />
              </Link>
            </div>
            <ul className="mt-9 grid gap-4 sm:grid-cols-3">
              {featuredGuides.map((g) => (
                <li key={g.href}>
                  <Link
                    href={g.href}
                    className="lift group flex h-full flex-col rounded-2xl bg-white p-6 shadow-card"
                  >
                    <h3 className="font-display text-[1.25rem] leading-snug group-hover:text-brand-teal">
                      {g.title}
                    </h3>
                    <p className="mt-2.5 flex-1 text-[14.5px] leading-relaxed text-ink-soft">
                      {g.blurb}
                    </p>
                    <p className="mt-4 flex items-center gap-2 text-[13px] font-extrabold text-brand-teal">
                      {g.minutes}-minute read
                      <span className="transition-transform duration-300 group-hover:translate-x-1">
                        <Chevron size={12} />
                      </span>
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ————— 12 · FAQ + another-question card ————— */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[87rem] gap-12 px-4 py-24 sm:px-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-20 lg:py-[10rem]">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="font-display display-xl text-4xl sm:text-5xl lg:text-[3.75rem]">
              Questions about ABA
            </h2>
            <div className="sticker mt-12 rounded-3xl bg-sun-wash p-8">
              <div className="flex items-start gap-5">
                <Image
                  src="/brand/plush-single.jpg"
                  alt=""
                  aria-hidden="true"
                  width={112}
                  height={112}
                  className="mt-1.5 h-14 w-14 shrink-0 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-display text-[1.35rem] leading-snug">
                    Got a different question?
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    We&rsquo;re happy to answer it — send us a message, or give
                    us a call at{" "}
                    <a href={siteConfig.phoneHref} className="whitespace-nowrap font-bold text-brand-teal">
                      {siteConfig.phone}
                    </a>
                    .
                  </p>
                </div>
              </div>
              <Link href="/getting-started" className={`${outlinePill} mt-6`}>
                Get in touch <Chevron />
              </Link>
            </div>
          </div>
          {/* Numbered open Q&A cards — deliberately NOT the plus/minus
              accordion look: everything readable at a glance, teal left
              edge, two-up on desktop. */}
          <div className="grid content-start gap-5 sm:grid-cols-2">
            {homeFaqs.map((f, i) => (
              <div
                key={f.q}
                className="reveal rounded-r-3xl border-l-4 border-brand-teal bg-white p-7 shadow-card sm:p-8"
              >
                <p className="font-display text-lg text-brand-teal/70">
                  {String(i + 1).padStart(2, "0")}
                </p>
                <h3 className="font-display mt-2 text-xl leading-snug sm:text-[1.35rem]">
                  {f.q}
                </h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-ink-soft">
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— 13 · Careers split ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-3 pb-[10rem] sm:px-6">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="relative min-h-[20rem] overflow-hidden rounded-3xl lg:min-h-0">
              <Image
                src="/images/blocks-play-living-room.jpg"
                alt="A woman kneeling on a living room floor helping a young girl stack colorful wooden blocks"
                fill
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="object-cover"
              />
            </div>
            <div className="reveal flex flex-col justify-center rounded-3xl bg-sun-wash p-8 sm:p-12 lg:p-[5rem]">
              <p className={eyebrowClass}>Careers at Sunbird</p>
              <h2 className="font-display display-xl mt-7 text-4xl sm:text-5xl lg:text-[3.75rem]">
                Well-supported clinicians give the best care.
              </h2>
              <p className="mt-6 max-w-md text-[17px] leading-relaxed text-ink-soft">
                We invest in our BCBAs and behavior technicians the way we ask
                them to invest in families: sane caseloads, real mentorship,
                and respect for the work. If that&rsquo;s the team you&rsquo;ve
                been looking for, come find us.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Link href="/careers" className={solidPill}>
                  Explore careers <Chevron />
                </Link>
                <Link href="/about" className={outlinePill}>
                  Meet Sunbird <Chevron />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ————— 14 · Personality email capture ————— */}
      <EmailCapture />

      <StickyCallBar callLabel="Call the team" />
    </>
  );
}
