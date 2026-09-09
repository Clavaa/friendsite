import type { StateSlug } from "../../site.config";

/**
 * State-level page content.
 *
 * CLIENT RULE (Sept 2026): insurance coverage stays deliberately VAGUE on
 * every public page and routes families to the free benefit check instead.
 * No waiver programs, no mandate years or bill numbers, no plan/payer
 * names, no hour figures. Page weight lives in process content — how the
 * benefit check works, how getting started works, what to expect — plus
 * reassurance and FAQs.
 */

export interface FaqItem {
  q: string;
  a: string;
}

export interface StateContent {
  slug: StateSlug;
  name: string;
  abbr: string;
  metaTitle: string;
  metaDescription: string;
  heroHeadline: string;
  heroSub: string;
  /** Soft, accurate coverage framing — routes to the free benefit check. */
  coverageHeading: string;
  coverageBody: string[];
  /** How the free benefit check works, step by step. */
  benefitCheckHeading: string;
  benefitCheckIntro: string;
  benefitCheckSteps: { title: string; body: string }[];
  /** How getting started works in this state. */
  startHeading: string;
  startIntro: string;
  startSteps: { title: string; body: string }[];
  /** Reassurance two-up: what we handle / what you can expect. */
  promiseHeading: string;
  promiseBody: string[];
  expectHeading: string;
  expectBody: string[];
  faqs: FaqItem[];
}

export const stateContent: Record<StateSlug, StateContent> = {
  kansas: {
    slug: "kansas",
    name: "Kansas",
    abbr: "KS",
    metaTitle: "ABA therapy in Kansas — coverage checked, care at home",
    metaDescription:
      "How ABA therapy works for Kansas families: a free benefit check that tells you exactly where you stand, in-home and daycare-based care, and a team that does the paperwork.",
    heroHeadline: "ABA therapy in Kansas, explained like a neighbor would.",
    heroSub:
      "From Wichita to Overland Park, we walk Kansas families through coverage, paperwork, and first sessions — in plain English, with a real person on the phone.",
    coverageHeading: "Will insurance cover it? Let's find out — free.",
    coverageBody: [
      "Coverage varies by plan, and no website — ours included — can tell you what your specific plan will do. What we can tell you: most Kansas families end up paying little or nothing for ABA once their benefits are confirmed, whether their child is covered through Medicaid or a private plan.",
      "So instead of asking you to decode plan documents, we run a free benefit check. Send us a photo of your insurance card, and our team verifies your ABA benefits directly with your plan — then calls you back with a plain-English answer: what's covered, what you'd owe, and what happens next.",
      "It's free whether or not you ever work with us, and it usually takes about a business day.",
    ],
    benefitCheckHeading: "How the free benefit check works",
    benefitCheckIntro:
      "This is the step that replaces weeks of hold music. Here's exactly what happens after you send us your card.",
    benefitCheckSteps: [
      {
        title: "You send one photo",
        body: "The front and back of your child's insurance card — Medicaid or private, either works. That's everything we need from you.",
      },
      {
        title: "We call your plan",
        body: "Our intake team verifies your ABA benefits directly with your plan: whether ABA is covered, what approvals are needed, and what your share would be.",
      },
      {
        title: "You get a plain-English answer",
        body: "Usually within a business day, a real person calls you back and tells you exactly where you stand — no jargon, no guessing, and no obligation.",
      },
    ],
    startHeading: "Getting started in Kansas, step by step",
    startIntro:
      "Every Kansas family goes through the same short sequence — and we carry most of it.",
    startSteps: [
      {
        title: "A 15-minute call",
        body: "You talk with an intake advocate — a person, not a phone tree. Tell us about your child, ask anything, and hang up knowing exactly what happens next.",
      },
      {
        title: "The free benefit check",
        body: "One photo of your insurance card. We confirm your benefits with your plan and give you the plain-English answer, usually within a business day.",
      },
      {
        title: "A BCBA meets your child",
        body: "A Board Certified Behavior Analyst spends real time with your child and writes the treatment plan with you, not for you. We handle every piece of the approval paperwork.",
      },
      {
        title: "Sessions start",
        body: "Therapy begins at home, at daycare, or by video — and we calendar every renewal from day one so care never lapses while paperwork processes.",
      },
    ],
    promiseHeading: "The paperwork is our job, not yours",
    promiseBody: [
      "Approvals, plan documents, renewal dates, follow-up calls — our team runs all of it, and chases it daily so nothing sits in a queue. You'll always know where things stand, because we tell you before you have to ask.",
      "And before your child starts, you get a written, plain-English summary of your benefits: what's covered, what you'd owe, and when. No surprises is a rule here, not a slogan.",
    ],
    expectHeading: "What Kansas families can expect",
    expectBody: [
      "A phone that a person answers. An honest start timeline for your part of Kansas before you commit to anything. A licensed, board-certified analyst designing and supervising every plan — and parent coaching built into all of it.",
      "If something about your coverage changes mid-year, we call you before it costs you. And if another provider could genuinely serve your child sooner, we'll tell you that too.",
    ],
    faqs: [
      {
        q: "Does insurance cover ABA therapy in Kansas?",
        a: "Coverage varies by plan, so we won't guess at yours — but most Kansas families pay little or nothing once benefits are confirmed, whether their child has Medicaid or private insurance. Send us a photo of your insurance card and we'll run a free benefit check and tell you exactly where you stand, usually within a business day.",
      },
      {
        q: "What do I need before ABA can start in Kansas?",
        a: "Three things: an autism diagnosis, a referral for ABA from your child's doctor, and an approved treatment plan written by a BCBA. If you're missing any of the three, call us — helping families get from “not sure” to “started” is most of what our intake team does.",
      },
      {
        q: "What will ABA actually cost my family?",
        a: "It depends on your specific plan, which is exactly why the benefit check comes first. Many families pay little or nothing once benefits are confirmed, and before your child starts you'll have a written, plain-English summary of what's covered and what you'd owe. No surprises, ever.",
      },
      {
        q: "How many hours a week will my child need?",
        a: "It depends on your child — there's no menu. Your BCBA recommends hours based on your child's assessment, your family's schedule, and what the research supports, and you approve the plan together before anything is submitted.",
      },
      {
        q: "Is there a waitlist for ABA in Kansas?",
        a: "Waitlists vary by provider and city. Tell us your zip code and schedule and we'll give you an honest answer about start timing in your area before you commit to anything.",
      },
      {
        q: "My child doesn't have a diagnosis yet. Can we still start?",
        a: "Yes — that's where many Kansas families begin. We'll help you understand the signs, point you to evaluation options in Kansas, and run your benefit check in the meantime so therapy can start as soon as the diagnosis is in hand.",
      },
    ],
  },

  colorado: {
    slug: "colorado",
    name: "Colorado",
    abbr: "CO",
    metaTitle: "ABA therapy in Colorado — coverage checked, care at home",
    metaDescription:
      "How ABA therapy works for Colorado families: a free benefit check that tells you exactly where you stand, in-home and daycare-based care, and a team that does the paperwork.",
    heroHeadline: "ABA therapy in Colorado, from a team that lives here.",
    heroSub:
      "From Denver to Colorado Springs, we help Colorado families turn a diagnosis into a plan — coverage checked, paperwork filed, sessions on the calendar.",
    coverageHeading: "Will insurance cover it? Let's find out — free.",
    coverageBody: [
      "Coverage varies by plan, and no website — ours included — can tell you what your specific plan will do. What we can tell you: most Colorado families end up paying little or nothing for ABA once their benefits are confirmed, whether their child is covered through Medicaid or a private plan.",
      "So instead of asking you to decode plan documents, we run a free benefit check. Send us a photo of your insurance card, and our team verifies your ABA benefits directly with your plan — then calls you back with a plain-English answer: what's covered, what you'd owe, and what happens next.",
      "It's free whether or not you ever work with us, and it usually takes about a business day.",
    ],
    benefitCheckHeading: "How the free benefit check works",
    benefitCheckIntro:
      "This is the step that replaces weeks of hold music. Here's exactly what happens after you send us your card.",
    benefitCheckSteps: [
      {
        title: "You send one photo",
        body: "The front and back of your child's insurance card — Medicaid or private, either works. That's everything we need from you.",
      },
      {
        title: "We call your plan",
        body: "Our intake team verifies your ABA benefits directly with your plan: whether ABA is covered, what approvals are needed, and what your share would be.",
      },
      {
        title: "You get a plain-English answer",
        body: "Usually within a business day, a real person calls you back and tells you exactly where you stand — no jargon, no guessing, and no obligation.",
      },
    ],
    startHeading: "Getting started in Colorado, step by step",
    startIntro:
      "Every Colorado family goes through the same short sequence — and we carry most of it.",
    startSteps: [
      {
        title: "A 15-minute call",
        body: "You talk with an intake advocate — a person, not a phone tree. Tell us about your child, ask anything, and hang up knowing exactly what happens next.",
      },
      {
        title: "The free benefit check",
        body: "One photo of your insurance card. We confirm your benefits with your plan and give you the plain-English answer, usually within a business day.",
      },
      {
        title: "A BCBA meets your child",
        body: "A Board Certified Behavior Analyst spends real time with your child and writes the treatment plan with you, not for you. We handle every piece of the approval paperwork.",
      },
      {
        title: "Sessions start",
        body: "Therapy begins at home, at daycare, or by video — and we calendar every renewal from day one so care never lapses while paperwork processes.",
      },
    ],
    promiseHeading: "The paperwork is our job, not yours",
    promiseBody: [
      "Approvals, plan documents, renewal dates, follow-up calls — our team runs all of it, and chases it daily so nothing sits in a queue. You'll always know where things stand, because we tell you before you have to ask.",
      "And before your child starts, you get a written, plain-English summary of your benefits: what's covered, what you'd owe, and when. No surprises is a rule here, not a slogan.",
    ],
    expectHeading: "What Colorado families can expect",
    expectBody: [
      "A phone that a person answers. An honest start timeline for your part of Colorado before you commit to anything. A licensed, board-certified analyst designing and supervising every plan — and parent coaching built into all of it.",
      "If something about your coverage changes mid-year, we call you before it costs you. And if another provider could genuinely serve your child sooner, we'll tell you that too.",
    ],
    faqs: [
      {
        q: "Does insurance cover ABA therapy in Colorado?",
        a: "Coverage varies by plan, so we won't guess at yours — but most Colorado families pay little or nothing once benefits are confirmed, whether their child has Medicaid or private insurance. Send us a photo of your insurance card and we'll run a free benefit check and tell you exactly where you stand, usually within a business day.",
      },
      {
        q: "What paperwork is needed before ABA starts in Colorado?",
        a: "Broadly: an autism diagnosis, a referral for services, and a treatment plan written by a BCBA. Our team completes the assessment and plan, tells you exactly what to request from your child's doctor, and submits everything for approval on your behalf.",
      },
      {
        q: "What will ABA actually cost my family?",
        a: "It depends on your specific plan, which is exactly why the benefit check comes first. Many families pay little or nothing once benefits are confirmed, and before your child starts you'll have a written, plain-English summary of what's covered and what you'd owe. No surprises, ever.",
      },
      {
        q: "How many hours a week will Colorado approve?",
        a: "Hours are set child-by-child, not from a menu. Your BCBA recommends a number based on your child's assessment and your family's real schedule, and you see and approve the plan before it's submitted.",
      },
      {
        q: "Is there a waitlist for ABA in Colorado?",
        a: "Waitlists vary by provider and city. Tell us your zip code and schedule and we'll give you an honest answer about start timing in your area before you commit to anything.",
      },
      {
        q: "My child doesn't have a diagnosis yet. Can we still start?",
        a: "Yes — that's where many Colorado families begin. We'll help you understand the signs, point you to evaluation options in Colorado, and run your benefit check in the meantime so therapy can start as soon as the diagnosis is in hand.",
      },
    ],
  },
};
