import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import EmailCapture from "../components/EmailCapture";
import InsuranceWall from "../components/InsuranceWall";
import Reviews from "../components/Reviews";
import StickyCallBar from "../components/StickyCallBar";
import { siteConfig } from "../../site.config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

/* ————— Shared pill CTA styles ————— */
const solidPill =
  "inline-flex items-center justify-center gap-2 rounded-full bg-brand-teal px-8 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-teal-deep";
const outlinePill =
  "inline-flex items-center justify-center gap-2 rounded-full border-2 border-ink/20 px-8 py-3.5 text-[15px] font-bold text-ink transition-colors hover:border-ink";

function Chevron() {
  return (
    <svg aria-hidden="true" width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3l5 5-5 5" />
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

const serviceCards = [
  {
    href: "/services/early-intervention",
    title: "Early intervention (1–5)",
    blurb: "Play-based therapy for the littlest learners — first words, first friends, first wins.",
    img: { src: "/images/playground-bubbles.jpg", alt: "A woman blowing bubbles with a laughing young boy on a sunny playground" },
  },
  {
    href: "/services/school-based-aba",
    title: "School-based support",
    blurb: "Your child's plan travels to the classroom, and we speak fluent IEP at the table.",
    img: { src: "/images/picture-cards-classroom.jpg", alt: "A woman showing picture cards to a young child at a classroom table" },
  },
  {
    href: "/services/telehealth",
    title: "Telehealth & parent coaching",
    blurb: "Expert BCBA guidance over video — for far-flung towns and full calendars.",
    img: { src: "/images/family-puzzle-kitchen.jpg", alt: "Two women and a young boy working on a colorful shape puzzle at a kitchen table" },
  },
  {
    href: "/services/center-based-aba",
    title: "Center-based ABA",
    blurb: "Structured spaces, peers to practice with, and a gentle on-ramp to school.",
    img: { src: "/images/blocks-play-living-room.jpg", alt: "A woman and a young girl stacking colorful wooden blocks together" },
  },
  {
    href: "/questions",
    title: "Parent question library",
    blurb: "Straight answers to the questions families actually ask — no sales pitch attached.",
    img: { src: "/images/fruit-snack-kitchen.jpg", alt: "A parent and child sharing a fruit snack together in a bright kitchen" },
  },
];

const pairedCards = [
  {
    tint: "bg-sun-wash",
    innerTint: "bg-sun/25",
    doing: "Deciphering the coverage maze.",
    doingBody:
      "Prior authorizations, denial letters, plan documents written by lawyers for lawyers — and somehow it's your homework.",
    help: "We do the insurance legwork.",
    helpBody:
      "Send a photo of your card and we come back with a plain-English answer — what's covered, what you'd owe, and what happens next. Usually within a business day, always free.",
  },
  {
    tint: "bg-mint-wash",
    innerTint: "bg-brand-teal/10",
    doing: "Assembling a care team from scratch.",
    doingBody:
      "Evaluations, therapists, waitlists, second opinions. Nobody hands you a map — you're drawing it yourself at the kitchen table.",
    help: "We already know the road.",
    helpBody:
      "Your intake advocate walks you through diagnosis, funding, and scheduling in order, and your BCBA builds the plan with you — so the next step is always named and never on you alone.",
  },
  {
    tint: "bg-sun-wash",
    innerTint: "bg-sun/25",
    doing: "Managing the everyday hard parts.",
    doingBody:
      "Mornings, mealtimes, haircuts, grocery runs. The moments nobody sees are often the ones that take the most out of you.",
    help: "We coach the moments that matter.",
    helpBody:
      "Parent coaching is built into every plan — practical strategies for your real routines, practiced live with your BCBA, at home or over video after bedtime.",
  },
  {
    tint: "bg-mint-wash",
    innerTint: "bg-brand-teal/10",
    doing: "Holding it together for everyone.",
    doingBody:
      "Siblings, work, marriage, your own sleep. Caring for the caregiver rarely makes it onto anyone's treatment plan.",
    help: "You get a team, too.",
    helpBody:
      "A phone that a person answers, check-ins that ask how you are, and honest guidance when something isn't working. Progress you can see — support you can feel.",
  },
];

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
    body: "Therapy begins at home, in a center, or both. Progress is measured at every session, your BCBA adjusts the plan as your child grows, and you always know the score.",
  },
];

const homeFaqs = [
  {
    q: "Who is ABA therapy for?",
    a: "ABA is for children with an autism diagnosis — most start between ages 2 and 6, though we support older children too. If you don't have a diagnosis yet, we'll help you get one first.",
  },
  {
    q: "Does insurance cover ABA in Kansas and Colorado?",
    a: "In most cases, yes. Both states require state-regulated health plans to cover ABA, and both Medicaid programs — KanCare and Health First Colorado — cover it too. We verify your exact plan free before anything starts.",
  },
  {
    q: "Do we need a diagnosis before starting?",
    a: "Insurance requires a formal autism diagnosis before covering ABA. If you're still waiting on one, start with our diagnosis guide — we'll point you to evaluation options in your state and stay with you through the process.",
  },
  {
    q: "Where do sessions happen?",
    a: "Wherever they'll work best for your child: your home, one of our centers, at school through district partnerships, or over secure video. Many families mix settings, and your BCBA helps you choose.",
  },
  {
    q: "How many hours a week will my child need?",
    a: "It depends on your child — plans commonly range from 10 to 30+ hours weekly. Your BCBA recommends a number based on the assessment and your family's reality, and you decide together.",
  },
  {
    q: "What if our schedule is already packed?",
    a: "That's normal, not a barrier. Sessions are scheduled around naps, school, siblings and work — and telehealth parent coaching can happen after bedtime. We fit the plan to your life.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* ————— 1 · Hero: giant rounded card on cream ————— */}
      <section className="bg-cream px-3 pt-3 sm:px-5">
        <div className="relative mx-auto max-w-[88rem] overflow-hidden rounded-[2.5rem] bg-mint-wash sm:rounded-[3rem]">
          <div className="mx-auto max-w-3xl px-5 pt-14 text-center sm:px-8 sm:pt-20">
            <p className="flex items-center justify-center gap-3 text-[13px] font-bold tracking-[0.18em] text-brand-teal">
              <span aria-hidden="true" className="hidden h-0.5 w-8 rounded-full bg-sun sm:block" />
              BCBA-led ABA therapy for Kansas &amp; Colorado families
              <span aria-hidden="true" className="hidden h-0.5 w-8 rounded-full bg-sun sm:block" />
            </p>
            <h1 className="font-display mt-6 text-[2.75rem] leading-[1.05] sm:text-6xl lg:text-[4.75rem]">
              {siteConfig.taglineLead}
              <span className="block italic text-brand-teal">
                {siteConfig.taglineFeel}
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-ink-soft">
              Compassionate, evidence-based ABA therapy for your child — and an
              intake team that answers the phone, does the insurance legwork,
              and never leaves you guessing what happens next.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/getting-started" className={solidPill}>
                Let&rsquo;s get started <Chevron />
              </Link>
              <Link href="/questions" className={outlinePill}>
                What is ABA? <Chevron />
              </Link>
            </div>
          </div>

          {/* Photo treatment + modality chip strip */}
          <div className="relative mt-10 sm:mt-12">
            <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-t-[2rem] sm:aspect-[21/9] sm:rounded-t-[2.5rem]">
              <Image
                src="/images/family-puzzle-kitchen.jpg"
                alt="Two women and a young boy working on a colorful shape puzzle together at a sunny kitchen table"
                fill
                priority
                sizes="(min-width: 1024px) 64rem, 100vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-x-0 -top-5 flex justify-center px-4 sm:top-auto sm:bottom-6">
              <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 rounded-full bg-white/95 px-5 py-2.5 text-[13px] font-bold shadow-chip backdrop-blur sm:px-6 sm:text-[14px]">
                <span>Sunbird comes to you.</span>
                <span className="inline-flex items-center gap-1.5"><CheckDot /> In-home</span>
                <span className="inline-flex items-center gap-1.5"><CheckDot /> In-center</span>
                <span className="inline-flex items-center gap-1.5"><CheckDot /> Telehealth</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ————— 2 · Coverage wall with KS/CO selector ————— */}
      <InsuranceWall />

      {/* ————— 3 · Empathy split ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[88rem] px-3 py-10 sm:px-5 lg:py-14">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col justify-center rounded-[2.5rem] bg-sun-wash p-8 sm:p-12 lg:p-14">
              <h2 className="font-display text-4xl sm:text-5xl lg:text-[3.4rem]">
                You&rsquo;re showing up for your child every single day.
              </h2>
              <div className="mt-6 space-y-4 text-[16px] leading-relaxed text-ink-soft">
                <p>
                  <strong className="text-ink">An autism diagnosis is heavy.</strong>{" "}
                  Not &ldquo;busy week&rdquo; heavy — up-at-2am-reading-about-therapies
                  heavy. Waitlist-after-waitlist heavy. Explaining-it-to-grandma,
                  bracing-for-the-grocery-store, worrying-about-kindergarten heavy.
                </p>
                <p>
                  And the weight doesn&rsquo;t land only on your child.{" "}
                  <strong className="text-ink">It lands on you.</strong> On your
                  sleep, your work, your other kids, your own quiet worry about
                  the future — and on the question you may not say out loud:{" "}
                  <strong className="text-ink">who&rsquo;s helping me?</strong>
                </p>
              </div>
              <p className="font-display mt-8 text-2xl italic text-brand-teal sm:text-3xl">
                You&rsquo;ve been carrying this alone. From here, we carry it
                with you.
              </p>
            </div>
            <div className="relative min-h-[20rem] overflow-hidden rounded-[2.5rem] lg:min-h-0">
              <Image
                src="/images/fruit-snack-kitchen.jpg"
                alt="A parent handing a piece of fruit to a smiling young child in a bright kitchen"
                fill
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-center">
            <Link href="/getting-started" className={solidPill}>
              Get help today <Chevron />
            </Link>
          </div>
        </div>
      </section>

      {/* ————— 4 · Services: core service + carousel ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[88rem] px-4 pb-16 pt-10 sm:px-6 lg:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-4xl text-brand-teal sm:text-5xl lg:text-6xl">
              Here for your child — and everyone who loves them.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-ink-soft">
              Your child needs ABA therapy —{" "}
              <strong className="text-ink">but what do you need?</strong>{" "}
              Sunbird wraps support around the whole household, not just the
              hour of therapy.
            </p>
          </div>

          {/* Core service card: photo with overlaid wash panel */}
          <div className="relative mt-12 overflow-hidden rounded-[2.5rem]">
            <div className="relative min-h-[26rem] lg:min-h-[34rem]">
              <Image
                src="/images/magnetic-tiles-living-room.jpg"
                alt="A woman and a toddler girl building a house out of colorful magnetic tiles together on a living room rug"
                fill
                sizes="(min-width: 1024px) 88rem, 100vw"
                className="object-cover"
              />
            </div>
            <div className="lg:absolute lg:inset-y-10 lg:right-10 lg:flex lg:w-[30rem] lg:items-center">
              <div className="rounded-b-[2.5rem] bg-mint-wash p-8 sm:p-10 lg:rounded-[2rem] lg:shadow-card-lg">
                <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.18em] text-brand-teal">
                  <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-sun" />
                  ABA therapy
                </p>
                <h3 className="font-display mt-4 text-3xl sm:text-4xl">
                  The heart of what we do.
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-ink-soft">
                  One-on-one, BCBA-designed therapy that teaches the skills
                  your child needs now and for life —{" "}
                  <strong className="text-ink">
                    built around your real routines
                  </strong>
                  , with parents coached at every step, never left in the
                  waiting room.
                </p>
                <Link href="/services/in-home-aba" className={`${solidPill} mt-6`}>
                  Learn all about ABA <Chevron />
                </Link>
                <p className="mt-4 flex items-center gap-2 text-[13px] font-bold">
                  <CheckDot /> At home, in-center, at school, or by video
                </p>
              </div>
            </div>
          </div>

          {/* More ways we help — scrollable card row */}
          <p className="mt-14 text-center text-[13px] font-bold tracking-[0.18em] text-ink">
            All the other ways we help
          </p>
          <div className="-mx-4 mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-4 pb-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-5 lg:overflow-visible">
            {serviceCards.map((c) => (
              <Link
                key={c.href + c.title}
                href={c.href}
                className="group w-64 shrink-0 snap-start lg:w-auto"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                  <Image
                    src={c.img.src}
                    alt={c.img.alt}
                    fill
                    sizes="(min-width: 1024px) 16rem, 16rem"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="font-display mt-4 flex items-start justify-between gap-2 text-xl leading-snug">
                  {c.title}
                  <span className="mt-1 text-brand-teal transition-transform group-hover:translate-x-0.5">
                    <Chevron />
                  </span>
                </h3>
                <p className="mt-2 text-[14px] leading-relaxed text-ink-soft">
                  {c.blurb}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/getting-started" className={solidPill}>
              Get in touch <Chevron />
            </Link>
            <Link href="/services" className={outlinePill}>
              View all services <Chevron />
            </Link>
          </div>
        </div>
      </section>

      {/* ————— 5 · Parent-pain paired cards ————— */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16 lg:py-24">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <h2 className="font-display text-4xl leading-[1.08] sm:text-5xl">
              We help the parents who hold it all together.
            </h2>
            <p className="mt-5 text-ink-soft">
              There are a million and a half things on your plate. Our job is
              to take as many of them off it as we possibly can — so you can
              breathe again.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/getting-started" className={solidPill}>
                Start the conversation <Chevron />
              </Link>
              <a href={siteConfig.phoneHref} className={outlinePill}>
                Call {siteConfig.phone}
              </a>
            </div>
          </div>

          <div className="space-y-6">
            {pairedCards.map((card) => (
              <div
                key={card.doing}
                className={`relative overflow-hidden rounded-[2.5rem] p-7 sm:p-10 ${card.tint}`}
              >
                <div className="max-w-xl">
                  <p className="text-[12px] font-bold tracking-[0.18em] text-ink-soft">
                    What you&rsquo;re doing
                  </p>
                  <h3 className="font-display mt-2 text-2xl sm:text-[1.7rem]">
                    {card.doing}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {card.doingBody}
                  </p>
                </div>
                <div className={`mt-6 max-w-xl rounded-3xl p-6 sm:p-7 ${card.innerTint}`}>
                  <p className="text-[12px] font-bold tracking-[0.18em] text-brand-teal">
                    How we help
                  </p>
                  <h4 className="font-display mt-2 text-xl">{card.help}</h4>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                    {card.helpBody}
                  </p>
                </div>
                {/* quiet brand accent: sun disc peeking from the corner */}
                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-10 hidden h-28 w-28 rounded-full bg-sun/50 sm:block"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— 6 · Named reviews (config-gated) ————— */}
      <Reviews />

      {/* ————— 7 · Numbered get-started accordion ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[88rem] px-3 py-10 sm:px-5 lg:py-14">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-[2.5rem] bg-mint-wash p-8 sm:p-12">
              <h2 className="font-display text-4xl sm:text-[2.9rem]">
                Getting started with ABA therapy
              </h2>
              <div className="mt-8">
                {steps.map((s, i) => (
                  <details
                    key={s.n}
                    className="group border-t border-brand-teal/25 last:border-b"
                    open={i === 0}
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 [&::-webkit-details-marker]:hidden">
                      <span className="flex items-baseline gap-3">
                        <span className="font-display text-sm text-brand-teal">
                          {s.n}
                        </span>
                        <span className="text-[13px] font-bold tracking-[0.16em] text-brand-teal">
                          {s.label}
                        </span>
                      </span>
                      <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="shrink-0 text-ink transition-transform group-open:rotate-180">
                        <path d="M2.5 5l4.5 4.5L11.5 5" />
                      </svg>
                    </summary>
                    <div className="pb-5">
                      <h3 className="font-display text-xl">{s.title}</h3>
                      <p className="mt-2 max-w-md text-[15px] leading-relaxed text-ink-soft">
                        {s.body}
                      </p>
                    </div>
                  </details>
                ))}
              </div>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/getting-started" className={solidPill}>
                  Get help today <Chevron />
                </Link>
                <a href={siteConfig.phoneHref} className={outlinePill}>
                  Call {siteConfig.phone}
                </a>
              </div>
            </div>
            <div className="relative min-h-[20rem] overflow-hidden rounded-[2.5rem] lg:min-h-0">
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

      {/* ————— 8 · Where care happens ————— */}
      <section className="bg-sun-wash">
        <div className="mx-auto grid max-w-[88rem] items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:py-24">
          <div className="relative">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[2.5rem]">
              <Image
                src="/images/picture-cards-classroom.jpg"
                alt="A woman showing colorful picture cards to a young child at a low classroom table"
                fill
                sizes="(min-width: 1024px) 42rem, 100vw"
                className="object-cover"
              />
            </div>
            <span className="absolute bottom-4 left-4 rounded-full bg-white/95 px-3.5 py-1.5 text-[12px] font-bold shadow-chip">
              Learning through play
            </span>
          </div>
          <div>
            <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.18em] text-brand-teal">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-sun" />
              Where sessions happen
            </p>
            <h2 className="font-display mt-4 text-4xl text-brand-teal sm:text-5xl lg:text-6xl">
              Care that meets you where you are.
            </h2>
            <p className="mt-5 max-w-lg font-bold">
              The setting serves the plan — never the other way around. Many
              families mix more than one.
            </p>
            <ul className="mt-5 max-w-lg space-y-3 text-[15px] leading-relaxed text-ink-soft">
              <li className="flex gap-3">
                <CheckDot className="mt-0.5" />
                <span><strong className="text-ink">In your home</strong> — daily-living skills taught where they&rsquo;re actually used, siblings and all.</span>
              </li>
              <li className="flex gap-3">
                <CheckDot className="mt-0.5" />
                <span><strong className="text-ink">In a center</strong> — peers to practice with and routines deliberately shaped like school.</span>
              </li>
              <li className="flex gap-3">
                <CheckDot className="mt-0.5" />
                <span><strong className="text-ink">At school &amp; by video</strong> — one consistent plan across your child&rsquo;s whole day, plus BCBA coaching after bedtime.</span>
              </li>
            </ul>
            <Link href="/services" className={`${solidPill} mt-7`}>
              Explore the settings <Chevron />
            </Link>
          </div>
        </div>
      </section>

      {/* ————— 9 · State coverage cards ————— */}
      <section className="bg-sun-wash pb-16 lg:pb-24">
        <div className="mx-auto max-w-[88rem] px-4 sm:px-6">
          <p className="text-[15px]">
            <strong>Two states, one local team.</strong> Your town not listed?{" "}
            <a href={siteConfig.phoneHref} className="font-bold text-brand-teal underline decoration-2 underline-offset-4">
              Ask us anyway
            </a>{" "}
            — service areas grow around families.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(["kansas", "colorado"] as const).map((slug) => {
              const state = siteConfig.states[slug];
              return (
                <div key={slug} className="rounded-3xl bg-white p-6 shadow-card">
                  <Link
                    href={`/${slug}`}
                    className="flex items-center justify-between gap-3"
                  >
                    <h3 className="font-display text-2xl hover:text-brand-teal">
                      {state.name}
                    </h3>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-cream text-brand-teal">
                      <Chevron />
                    </span>
                  </Link>
                  <ul className="mt-4 flex flex-wrap gap-2">
                    {state.cities.map((city) => (
                      <li key={city.slug}>
                        <Link
                          href={`/${slug}/${city.slug}`}
                          className="inline-block rounded-full border border-line bg-cream px-3.5 py-1.5 text-[13px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
                        >
                          {city.name}
                          {"displaySuffix" in city && city.displaySuffix
                            ? `, ${city.displaySuffix}`
                            : ""}
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/${slug}`}
                    className="mt-4 inline-block text-[14px] font-bold text-brand-teal hover:underline"
                  >
                    {state.name} coverage guide &rarr;
                  </Link>
                </div>
              );
            })}
            <div className="flex flex-col justify-center rounded-3xl border-2 border-dashed border-brand-teal/30 p-6 sm:col-span-2 lg:col-span-1">
              <h3 className="font-display text-2xl">Somewhere in between?</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                In-home coverage reaches beyond the metros, and telehealth
                reaches everywhere in both states.
              </p>
              <a
                href={siteConfig.phoneHref}
                className="mt-4 font-bold text-brand-teal hover:underline"
              >
                Call {siteConfig.phone} and ask &rarr;
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ————— 10 · Next-step triage: 3 cards ————— */}
      <section className="bg-mint-wash">
        <div className="mx-auto max-w-[88rem] px-4 py-16 sm:px-6 lg:py-24">
          <h2 className="font-display text-center text-4xl sm:text-5xl lg:text-6xl">
            What would help you most right now?
          </h2>
          <div className="mx-auto mt-12 grid max-w-5xl gap-8 sm:grid-cols-3">
            <div className="text-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src="/images/picture-cards-classroom.jpg"
                  alt="A woman showing picture cards to a young child during a learning activity"
                  fill
                  sizes="(min-width: 640px) 20rem, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-display mt-5 text-2xl">
                Does my child have autism?
              </h3>
              <Link
                href="/get-a-diagnosis"
                className={`${outlinePill} mt-4 w-full bg-white/60 sm:w-auto`}
              >
                Get diagnostic help <Chevron />
              </Link>
            </div>
            <div className="text-center">
              <div className="grid aspect-[4/3] place-items-center rounded-3xl bg-sun-wash">
                {/* original brand illustration: rising sun + reading bird */}
                <svg aria-hidden="true" viewBox="0 0 160 120" className="w-36">
                  <circle cx="80" cy="66" r="30" fill="var(--color-sun)" />
                  <path d="M30 96 h100" stroke="var(--color-brand-teal)" strokeWidth="4" strokeLinecap="round" />
                  <path d="M58 38 C66 28 78 25 88 29 C81 33 77 39 75 45" stroke="var(--color-brand-teal)" strokeWidth="4" strokeLinecap="round" fill="none" />
                  <path d="M118 30 l6-10 M128 40 l10-5 M131 54 h11" stroke="var(--color-sun)" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </div>
              <h3 className="font-display mt-5 text-2xl">
                Understand how ABA works
              </h3>
              <Link
                href="/questions"
                className={`${outlinePill} mt-4 w-full bg-white/60 sm:w-auto`}
              >
                Read parent answers <Chevron />
              </Link>
            </div>
            <div className="text-center">
              <div className="relative aspect-[4/3] overflow-hidden rounded-3xl">
                <Image
                  src="/images/blocks-play-living-room.jpg"
                  alt="A woman and a young girl smiling while stacking wooden blocks on a living room floor"
                  fill
                  sizes="(min-width: 640px) 20rem, 100vw"
                  className="object-cover"
                />
              </div>
              <h3 className="font-display mt-5 text-2xl">Talk to a person now</h3>
              <a
                href={siteConfig.phoneHref}
                className={`${outlinePill} mt-4 w-full bg-white/60 sm:w-auto`}
              >
                Call {siteConfig.phone}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ————— 11 · FAQ + another-question card ————— */}
      <section className="bg-cream">
        <div className="mx-auto grid max-w-[88rem] gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-16 lg:py-24">
          <div>
            <h2 className="font-display text-4xl leading-[1.08] sm:text-5xl">
              Questions about ABA
            </h2>
            <div className="mt-8 rounded-[2rem] bg-sun-wash p-7">
              <h3 className="font-display text-xl">Got a different question?</h3>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                We&rsquo;re happy to answer it — send us a message or call{" "}
                <a href={siteConfig.phoneHref} className="font-bold text-brand-teal">
                  {siteConfig.phone}
                </a>
                . A person picks up, not a menu.
              </p>
              <Link href="/getting-started" className={`${solidPill} mt-5`}>
                Get in touch <Chevron />
              </Link>
            </div>
          </div>
          <div className="space-y-3">
            {homeFaqs.map((f, i) => (
              <details
                key={f.q}
                className="group rounded-3xl bg-white px-6 shadow-card open:shadow-card-lg sm:px-7"
                open={i === 0}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 text-[16px] font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span aria-hidden="true" className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun-wash text-brand-teal">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M7 2v10" className="group-open:hidden" />
                      <path d="M2 7h10" />
                    </svg>
                  </span>
                </summary>
                <p className="pb-5 text-[15px] leading-relaxed text-ink-soft">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ————— 12 · Careers band ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-[88rem] px-3 pb-14 sm:px-5 lg:pb-20">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="relative min-h-[18rem] overflow-hidden rounded-[2.5rem] lg:min-h-0">
              <Image
                src="/images/blocks-play-living-room.jpg"
                alt="A woman kneeling on a living room floor helping a young girl stack colorful wooden blocks"
                fill
                sizes="(min-width: 1024px) 44rem, 100vw"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-center justify-center rounded-[2.5rem] bg-sun-wash p-8 text-center sm:p-12 lg:p-14">
              <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.18em] text-brand-teal">
                <span aria-hidden="true" className="hidden h-0.5 w-8 rounded-full bg-sun sm:block" />
                Careers at Sunbird
                <span aria-hidden="true" className="hidden h-0.5 w-8 rounded-full bg-sun sm:block" />
              </p>
              <h2 className="font-display mt-5 text-4xl sm:text-[2.9rem]">
                Well-supported clinicians give the best care.
              </h2>
              <p className="mt-4 max-w-md text-ink-soft">
                We invest in our BCBAs and behavior technicians the way we ask
                them to invest in families: sane caseloads, real mentorship,
                and respect for the work. If that&rsquo;s the team you&rsquo;ve
                been looking for, come find us.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
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

      {/* ————— 13 · Personality email capture ————— */}
      <EmailCapture />

      <StickyCallBar callLabel="Call the team" />
    </>
  );
}
