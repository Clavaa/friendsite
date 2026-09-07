import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaBand from "../../components/CtaBand";
import DiagnosisForm from "../../components/DiagnosisForm";
import Faq, { faqJsonLd } from "../../components/Faq";
import JsonLd from "../../components/JsonLd";
import ProofChip from "../../components/ProofChip";
import StickyCallBar from "../../components/StickyCallBar";
import { siteConfig } from "../../../site.config";
import type { FaqItem } from "../../data/states";

export const metadata: Metadata = {
  title: "Get an autism diagnosis in Kansas & Colorado — we help, free",
  description:
    "Think your child might have autism? We help Kansas and Colorado families find a diagnostic evaluation, get on the shortest waitlists, and plan the next steps — free.",
  alternates: { canonical: "/get-a-diagnosis" },
};

const diagnosisFaqs: FaqItem[] = [
  {
    q: "Does insurance pay for an autism evaluation?",
    a: "Usually, yes. Most health plans in Kansas and Colorado cover a diagnostic evaluation the same way they cover other doctor visits, so your normal copay or deductible may apply. KanCare and Health First Colorado cover evaluations for children too. Before you book anything, we check your exact plan for free and tell you what it would cost — often nothing.",
  },
  {
    q: "How long is the wait for an evaluation in Kansas or Colorado?",
    a: "It depends on the clinic. Some evaluators book months out; others have openings within weeks. That spread is exactly why we help — we know which waitlists near you are actually moving, and it's normal and allowed to be on more than one list at once. The sooner your child's name is on a list, the sooner the wait is over.",
  },
  {
    q: "Is my child too young to be evaluated?",
    a: "Probably not. Specialists can reliably evaluate children as young as 18 to 24 months, and there is no benefit to waiting. If your child is under 3, your state's early intervention program will also evaluate for free. Acting early is the single biggest thing a parent can do — young brains learn fastest.",
  },
  {
    q: "What should I bring to the evaluation?",
    a: "Bring notes on what you've noticed and roughly when it started, a few short phone videos of the things you're wondering about, any notes from your pediatrician, daycare, or school, and your insurance card. A favorite snack and a comfort item help the day go smoothly. The evaluator will tell you if they need anything else.",
  },
  {
    q: "What if the evaluation says it isn't autism?",
    a: "Then you'll know — and that's worth a lot. A good evaluation doesn't just answer the autism question. The report explains what is going on and recommends supports, like speech or occupational therapy, if your child would benefit. Either way, you leave with answers and a plan instead of worry.",
  },
];

export default function GetADiagnosisPage() {
  return (
    <>
      <JsonLd data={faqJsonLd(diagnosisFaqs)} />

      {/* ————— Hero: split on cream, form card right ————— */}
      <section className="relative overflow-hidden bg-cream">
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-sun-wash/70"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-1.5 text-[13px] font-bold text-brand-teal shadow-chip">
              <span aria-hidden="true" className="h-2 w-2 rounded-full bg-meadow" />
              For families who don&rsquo;t have a diagnosis yet
            </p>
            <h1 className="font-display mt-5 text-4xl sm:text-5xl lg:text-[3.4rem]">
              Think your child might have autism? We&rsquo;ll help you find
              out.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink-soft">
              We help Kansas and Colorado families book a diagnostic
              evaluation, get on the shortest waitlists near them, and know
              exactly what happens after — at no cost to you.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "We find evaluators near you and check the real wait times",
                "We check your insurance for free before you book anything",
                "We stay with you through results and next steps",
              ].map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-meadow-wash text-meadow-deep">
                    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2.5 7.5l3 3 6-7" />
                    </svg>
                  </span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[15px] text-ink-soft">
              Rather talk it through first?{" "}
              <a
                href={siteConfig.phoneHref}
                className="font-bold text-brand-teal hover:underline"
              >
                Call {siteConfig.phone}
              </a>{" "}
              — a person answers, not a menu.
            </p>
          </div>

          <div className="relative" id="diagnosis-help">
            <div className="absolute -right-6 -top-8 hidden h-64 w-64 overflow-hidden rounded-full lg:block">
              <Image
                src="/images/picture-cards-classroom.jpg"
                alt="A woman and a school-age girl looking through picture cards together at a table in a bright, sunlit room"
                fill
                sizes="16rem"
                className="object-cover"
              />
            </div>
            <div className="relative z-10 lg:mr-14 lg:mt-16">
              <DiagnosisForm />
            </div>
            <ProofChip className="absolute -top-2 left-2 z-20 lg:-left-4 lg:top-8">
              Free help finding an evaluator
            </ProofChip>
            <ProofChip className="absolute -bottom-4 right-2 z-20 lg:-right-2">
              Serving Kansas &amp; Colorado
            </ProofChip>
          </div>
        </div>
      </section>

      {/* ————— How a diagnosis works: 3 calm steps ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              How a diagnosis works
            </h2>
            <p className="mt-3 text-ink-soft">
              Three steps, in plain English. Most of the time in between is
              waiting — which is why the smartest move is starting now.
            </p>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "A quick screening",
                b: "Your pediatrician asks you a short set of questions about your child. It takes minutes, costs nothing, and tells you whether a full evaluation makes sense.",
              },
              {
                n: "2",
                t: "The evaluation",
                b: "A licensed psychologist or developmental specialist spends a few hours playing with and observing your child, plus talking with you. No needles, no scary tests.",
              },
              {
                n: "3",
                t: "Results and next steps",
                b: "You get a written report that explains what the evaluator saw and what would help. If it's autism, that report is the key that opens insurance-covered therapy.",
              },
            ].map((step) => (
              <li key={step.n} className="rounded-3xl bg-cream p-6">
                <span className="font-display grid h-11 w-11 place-items-center rounded-full bg-brand-teal text-xl text-white">
                  {step.n}
                </span>
                <h3 className="font-display mt-4 text-xl">{step.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {step.b}
                </p>
              </li>
            ))}
          </ol>

          {/* M-CHAT callout */}
          <div className="mt-8 rounded-3xl bg-sun-wash p-6 sm:p-8 lg:max-w-3xl">
            <h3 className="font-display text-xl">
              Heard of the M-CHAT? It&rsquo;s a good first step.
            </h3>
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              The M-CHAT is a free screening questionnaire pediatricians use
              for toddlers — about 5 minutes of yes-or-no questions for you,
              nothing at all for your child. It doesn&rsquo;t diagnose
              anything; it just tells you whether a full evaluation is worth
              doing. Your child&rsquo;s doctor can run it at any visit — ask
              us about it and we&rsquo;ll explain how.
            </p>
          </div>
        </div>
      </section>

      {/* ————— Why families start here ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              Why families start here instead of a waitlist
            </h2>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                t: "Waitlists are long — starting now saves months",
                b: "Evaluation waitlists in Kansas and Colorado can stretch for months, and they only move for families already on them. We know which lists near you are moving and get your child's name on the right ones this week.",
              },
              {
                t: "A diagnosis opens doors",
                b: "Both Kansas and Colorado require insurance to cover ABA therapy for children diagnosed with autism, and both state Medicaid programs cover it too. The evaluation report is the document that unlocks all of it.",
              },
              {
                t: "You get a guide, not a pamphlet",
                b: "One intake advocate stays with your family from first call through results — answering questions, chasing paperwork, and lining up therapy so it can begin soon after the diagnosis, not months later.",
              },
            ].map((card) => (
              <div key={card.t} className="rounded-3xl bg-white p-6 shadow-card">
                <h3 className="font-display text-xl leading-snug">{card.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
                  {card.b}
                </p>
              </div>
            ))}
          </div>
          <p className="mt-8 text-[15px] text-ink-soft">
            Already have a diagnosis?{" "}
            <Link
              href="/questions/just-got-a-diagnosis"
              className="font-bold text-brand-teal hover:underline"
            >
              Here&rsquo;s what happens next
            </Link>
            .
          </p>
        </div>
      </section>

      <Faq
        items={diagnosisFaqs}
        heading="Evaluation questions, answered plainly"
      />

      <CtaBand
        heading="The wait only ends for families on the list."
        body="Tell us what you've been noticing. An intake advocate calls you back with evaluation options near you, real wait times, and what your insurance covers — all free."
        primaryLabel="Help me get an evaluation"
        primaryHref="/get-a-diagnosis#diagnosis-help"
      />
      <StickyCallBar callLabel="Call the intake team" />
    </>
  );
}
