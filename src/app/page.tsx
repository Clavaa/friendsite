import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArcLabel,
  BirdSpot,
  FeatherSpot,
  HandUnderline,
  RisingSun,
  Sparkles,
  SunSpot,
} from "../components/Accents";
import Carousel from "../components/Carousel";
import EmailCapture from "../components/EmailCapture";
import InsuranceWall from "../components/InsuranceWall";
import LeadForm from "../components/LeadForm";
import PhotoTour from "../components/PhotoTour";
import Reviews from "../components/Reviews";
import StickyCallBar from "../components/StickyCallBar";
import { siteConfig } from "../../site.config";

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

const pairedCards = [
  {
    tint: "bg-sun-wash",
    innerTint: "bg-sun/35",
    doing: "Deciphering the coverage maze.",
    doingBody:
      "Prior authorizations, denial letters, plan documents written by lawyers for lawyers — and somehow it's your homework.",
    help: "We do the insurance legwork.",
    helpBody:
      "Send a photo of your card and we come back with a plain-English answer — what's covered, what you'd owe, and what happens next. Usually within a business day, always free.",
    art: "sun" as const,
  },
  {
    tint: "bg-mint-wash",
    innerTint: "bg-brand-teal/15",
    doing: "Assembling a care team from scratch.",
    doingBody:
      "Evaluations, therapists, waitlists, second opinions. Nobody hands you a map — you're drawing it yourself at the kitchen table.",
    help: "We already know the road.",
    helpBody:
      "Your intake advocate walks you through diagnosis, funding, and scheduling in order, and your BCBA builds the plan with you — so the next step is always named and never on you alone.",
    art: "bird" as const,
  },
  {
    tint: "bg-sun-wash",
    innerTint: "bg-sun/35",
    doing: "Managing the everyday hard parts.",
    doingBody:
      "Mornings, mealtimes, haircuts, grocery runs. The moments nobody sees are often the ones that take the most out of you.",
    help: "We coach the moments that matter.",
    helpBody:
      "Parent coaching is built into every plan — practical strategies for your real routines, practiced live with your BCBA, at home or over video after bedtime.",
    art: "feather" as const,
  },
  {
    tint: "bg-mint-wash",
    innerTint: "bg-brand-teal/15",
    doing: "Holding it together for everyone.",
    doingBody:
      "Siblings, work, marriage, your own sleep. Caring for the caregiver rarely makes it onto anyone's treatment plan.",
    help: "You get a team, too.",
    helpBody:
      "A phone that a person answers, check-ins that ask how you are, and honest guidance when something isn't working. Progress you can see — support you can feel.",
    art: "sparkles" as const,
  },
];

const pairedArt = {
  sun: SunSpot,
  bird: BirdSpot,
  feather: FeatherSpot,
  sparkles: Sparkles,
};

const steps = [
  {
    n: "01",
    label: "Say hello",
    title: "A 15-minute call, your questions first.",
    body: "You talk with an intake advocate — a person, not a phone tree. Tell us about your child, ask anything, and hang up knowing exactly what happens next.",
  },
  {
    n: "02",
    label: "Coverage check",
    title: "We verify your benefits, free.",
    body: "One photo of your insurance card. We come back with a plain-English summary of what your plan covers and what it would cost you — usually within a business day.",
  },
  {
    n: "03",
    label: "Assessment & plan",
    title: "Your BCBA meets your child.",
    body: "A board-certified behavior analyst spends real time with your child and writes the treatment plan with you, not for you. We handle the authorization paperwork.",
  },
  {
    n: "04",
    label: "First session & beyond",
    title: "Sessions start — and keep getting better.",
    body: "Therapy begins at home, at daycare, or by video. Progress is measured at every session, your BCBA adjusts the plan as your child grows, and you always know the score.",
  },
];

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
                 card on the right, original rising-sun + hummingbird
                 cresting the panel bottom edge below the copy ————— */}
      <section className="bg-cream px-3 sm:px-6">
        <div className="relative mx-auto max-w-[87rem] overflow-hidden rounded-3xl bg-mint-wash">
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
                <p className="text-[15px] text-ink-soft">
                  A person answers — no phone tree.
                </p>
              </div>
              {/* Modality chips — must always match reality (see site.config.ts) */}
              <ul className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 lg:justify-start">
                {siteConfig.trustChecklist.map((item) => (
                  <li key={item.label} className="flex items-center gap-2.5 text-[15px] font-bold">
                    {item.soon ? (
                      <span
                        aria-hidden="true"
                        className="grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 border-sun bg-sun/25"
                      />
                    ) : (
                      <CheckDot />
                    )}
                    {item.label}
                    {item.soon && (
                      <span className="-ml-1 text-[13px] font-semibold italic text-ink-soft">
                        coming soon
                      </span>
                    )}
                  </li>
                ))}
              </ul>
              {/* Rising sun + hummingbird cresting the panel bottom (desktop) */}
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
          {/* Mobile / tablet: the sun crests the panel bottom under the card */}
          <div className="pointer-events-none relative mt-2 flex justify-center lg:hidden">
            <RisingSun className="-mb-2 w-[19rem] max-w-[80%] sm:w-[26rem]" />
          </div>
          {/* corner sparkles */}
          <FeatherSpot className="pointer-events-none absolute bottom-[7rem] left-[3%] hidden w-16 -rotate-6 opacity-60 xl:block" />
          <Sparkles className="pointer-events-none absolute bottom-12 right-[5%] hidden w-16 opacity-70 lg:block" />
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

      {/* ————— 6 · Services carousel with working arrows ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 pb-12 pt-28 sm:px-6">
          <p className="text-center text-[17px] font-extrabold uppercase tracking-[0.14em] text-ink">
            All the other ways we help you
          </p>
          <Carousel
            ariaLabel="More Sunbird services"
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

      {/* ————— 7 · Parent-pain paired cards, stocking-stacked ————— */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[87rem] gap-12 px-4 py-[6.25rem] sm:px-6 lg:grid-cols-[minmax(0,29rem)_minmax(0,1fr)] lg:gap-20">
          <div className="lg:sticky lg:top-32 lg:self-start">
            <h2 className="font-display text-4xl leading-[1.3] sm:text-[3rem]">
              We help the parents who hold it all together.
            </h2>
            <p className="mt-7 text-[17px] leading-relaxed text-ink-soft">
              There are a million and a half things on your plate. Our job is
              to take as many of them off it as we possibly can — so you can
              breathe again.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/getting-started" className={solidPill}>
                Parent support <Chevron />
              </Link>
              <a href={siteConfig.phoneHref} className={outlinePill}>
                Get in touch <Chevron />
              </a>
            </div>
          </div>

          <div>
            {pairedCards.map((card, i) => {
              const Art = pairedArt[card.art];
              return (
                <div
                  key={card.doing}
                  className={`reveal relative rounded-[3rem] p-7 sm:p-10 lg:p-12 ${card.tint} ${
                    i > 0 ? "-mt-10" : ""
                  }`}
                  style={{ zIndex: i + 1 }}
                >
                  <div className="flex items-start gap-5">
                    {/* curved "What you're doing" label */}
                    <ArcLabel
                      id={`arc-${i}`}
                      text="WHAT YOU'RE DOING"
                      className="mt-1 hidden w-24 shrink-0 text-ink-soft sm:block"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-ink-soft sm:hidden">
                        What you&rsquo;re doing
                      </p>
                      <h3 className="font-display mt-2 text-2xl sm:mt-0 sm:text-[1.8rem]">
                        {card.doing}
                      </h3>
                      <p className="mt-3 max-w-lg text-[16px] leading-relaxed text-ink-soft">
                        {card.doingBody}
                      </p>
                    </div>
                    <Art className="mt-1 hidden w-24 shrink-0 sm:block lg:w-28" />
                  </div>
                  <div className={`mt-8 rounded-3xl p-7 sm:ml-[7.25rem] sm:mr-16 sm:p-8 ${card.innerTint}`}>
                    <p className="text-[12px] font-extrabold uppercase tracking-[0.18em] text-brand-teal">
                      How we help
                    </p>
                    <h4 className="font-display mt-3 text-[1.4rem]">{card.help}</h4>
                    <p className="mt-3 text-[16px] leading-relaxed text-ink-soft">
                      {card.helpBody}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ————— 8 · Named reviews (config-gated) ————— */}
      <Reviews />

      {/* ————— 9 · Numbered get-started accordion + photo ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-3 py-10 sm:px-6">
          <div className="grid gap-3 lg:grid-cols-2">
            <div className="rounded-3xl bg-mint-wash p-8 sm:p-12 lg:p-[4.5rem]">
              <h2 className="font-display display-xl text-4xl sm:text-5xl lg:text-[3.4rem]">
                Get started with ABA therapy
              </h2>
              <div className="mt-12">
                {steps.map((s, i) => (
                  <details
                    key={s.n}
                    className="group border-t-2 border-brand-teal/20 open:border-sun last:border-b-0"
                    open={i === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 [&::-webkit-details-marker]:hidden">
                      <span className="flex items-baseline gap-3">
                        <span className="font-display text-lg text-brand-teal">
                          {s.n}
                        </span>
                        <span className="text-[13px] font-extrabold uppercase tracking-[0.16em] text-brand-teal">
                          {s.label}
                        </span>
                      </span>
                      <svg aria-hidden="true" width="15" height="15" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0 text-ink transition-transform duration-300 group-open:rotate-180">
                        <path d="M2.5 5l4.5 4.5L11.5 5" />
                      </svg>
                    </summary>
                    <div className="pb-7">
                      <h3 className="font-display text-[1.45rem]">{s.title}</h3>
                      <p className="mt-3 max-w-md text-[16px] leading-relaxed text-ink-soft">
                        {s.body}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link href="/getting-started" className={solidPill}>
                  Get help today <Chevron />
                </Link>
                <a href={siteConfig.phoneHref} className={outlinePill}>
                  Call {siteConfig.phone}
                </a>
              </div>
            </div>
            <div className="relative min-h-[22rem] overflow-hidden rounded-3xl lg:min-h-0">
              <Image
                src="/images/playground-bubbles.jpg"
                alt="A woman blowing bubbles with a laughing young boy on a sunny playground while he reaches to pop one"
                fill
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="object-cover"
              />
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

      {/* ————— 11 · Next-step triage: 3 cards ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[87rem] px-4 py-[9rem] sm:px-6">
          <h2 className="font-display display-xl text-center text-4xl sm:text-6xl lg:text-[4.25rem]">
            What would help you most right now?
          </h2>
          <div className="mt-16 grid gap-6 sm:grid-cols-3">
            <div className="reveal">
              <div className="lift relative aspect-[10/7] overflow-hidden rounded-3xl">
                <Image
                  src="/images/picture-cards-classroom.jpg"
                  alt="A woman showing picture cards to a young child during a learning activity"
                  fill
                  sizes="(min-width: 640px) 28rem, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-display mt-7 text-[1.9rem] leading-tight">
                Does my child have autism?
              </h3>
              <Link href="/get-a-diagnosis" className={`${outlinePill} mt-5`}>
                Get diagnostic help <Chevron />
              </Link>
            </div>
            <div className="reveal">
              <div className="lift relative grid aspect-[10/7] place-items-center overflow-hidden rounded-3xl bg-sun-wash">
                <SunSpot className="w-40" />
                <Sparkles className="absolute right-6 top-6 w-16" />
              </div>
              <h3 className="font-display mt-7 text-[1.9rem] leading-tight">
                Understand how ABA works
              </h3>
              <Link href="/questions" className={`${outlinePill} mt-5`}>
                Read parent answers <Chevron />
              </Link>
            </div>
            <div className="reveal">
              <div className="lift relative aspect-[10/7] overflow-hidden rounded-3xl">
                <Image
                  src="/images/blocks-play-living-room.jpg"
                  alt="A woman and a young girl smiling while stacking wooden blocks on a living room floor"
                  fill
                  sizes="(min-width: 640px) 28rem, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-display mt-7 text-[1.9rem] leading-tight">
                Talk to a person now
              </h3>
              <a href={siteConfig.phoneHref} className={`${outlinePill} mt-5`}>
                Call {siteConfig.phone}
              </a>
            </div>
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
                <BirdSpot className="mt-1.5 w-14 shrink-0" />
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
