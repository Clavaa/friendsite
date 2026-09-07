import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import LeadForm from "../../components/LeadForm";
import StickyCallBar from "../../components/StickyCallBar";
import { siteConfig } from "../../../site.config";

export const metadata: Metadata = {
  title: "Getting started with ABA therapy",
  description:
    "How to start ABA therapy in Kansas or Colorado: one call, a free benefits check, a BCBA assessment, and sessions — with our team doing the paperwork.",
  alternates: { canonical: "/getting-started" },
};

const steps = [
  {
    title: "A 15-minute call",
    time: "Today",
    body: "You talk with an intake advocate — a person whose whole job is walking families through this. Your questions come first. No diagnosis is required to call.",
  },
  {
    title: "Free benefits check",
    time: "About a business day",
    body: "Send a photo of your insurance card and we verify your ABA benefits directly with your plan — Medicaid or private. You get a plain-English answer about coverage and cost.",
  },
  {
    title: "BCBA assessment",
    time: "Scheduled promptly",
    body: "A Board Certified Behavior Analyst meets your child, listens to what matters to your family, and drafts a treatment plan. You see and approve every goal.",
  },
  {
    title: "Authorization",
    time: "Days to a few weeks",
    body: "We submit the plan to your insurance and chase the approval daily. This is the one step whose speed we don't fully control — so we push it hardest.",
  },
  {
    title: "First session",
    time: "The moment approval lands",
    body: "Sessions start at home, in a center, or both — and renewal paperwork is calendared from day one so therapy never lapses.",
  },
];

export default function GettingStartedPage() {
  return (
    <>
      <header className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-2 lg:items-start lg:pb-16 lg:pt-16">
          <div>
            <h1 className="font-display max-w-xl text-4xl sm:text-5xl">
              Five steps. We carry four of them.
            </h1>
            <p className="prose-measure mt-4 text-lg text-ink-soft">
              Your step is the first one: reaching out. From there, our intake
              team runs the insurance calls, the paperwork, and the follow-ups
              — and you always know exactly where things stand.
            </p>
            <ol className="mt-8 space-y-4">
              {steps.map((step, i) => (
                <li key={step.title} className="flex gap-4 rounded-3xl bg-white p-5 shadow-card">
                  <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-teal text-lg text-white">
                    {i + 1}
                  </span>
                  <div>
                    <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                      <h2 className="font-display text-lg">{step.title}</h2>
                      <span className="rounded-full bg-sun-wash px-2.5 py-0.5 text-[12px] font-bold text-brand-teal">
                        {step.time}
                      </span>
                    </div>
                    <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                      {step.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-6 text-[15px] text-ink-soft">
              Three documents speed everything up if you have them: the
              diagnostic report, a doctor&rsquo;s ABA referral, and your
              insurance card. Missing one? Start anyway —{" "}
              <a href={siteConfig.phoneHref} className="font-bold text-brand-teal hover:underline">
                call {siteConfig.phone}
              </a>{" "}
              and we&rsquo;ll help you get it.
            </p>
          </div>
          <div className="lg:sticky lg:top-24">
            <LeadForm sourcePage="getting-started" />
          </div>
        </div>
      </header>

      <CtaBand
        tint="sky"
        heading="Rather just talk to someone?"
        body="Phones are answered by people, not menus. Call and ask us anything — including the questions you think are too small."
        primaryLabel="Match me with an advocate"
        primaryHref="#main"
      />
      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
