import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import Faq, { faqJsonLd } from "../../components/Faq";
import JsonLd from "../../components/JsonLd";
import LeadForm from "../../components/LeadForm";
import StickyCallBar from "../../components/StickyCallBar";
import { siteConfig } from "../../../site.config";

/**
 * CLIENT RULE (Sept 2026): coverage stays deliberately vague here — no
 * program specifics, no mandate history, no waiver detail, no payer names
 * until credentialing is confirmed. Everything routes to the free benefit
 * check; page weight lives in process + reassurance content.
 */

export const metadata: Metadata = {
  title: "Insurance for ABA therapy — free benefit check",
  description:
    "Coverage for ABA therapy varies by plan — so we check yours for free. One photo of your insurance card, one business day, one plain-English answer for Kansas and Colorado families.",
  alternates: { canonical: "/insurance" },
};

const benefitFaqs = [
  {
    q: "Does insurance cover ABA therapy?",
    a: "Coverage varies by plan, so we won't guess at yours — but most families pay little or nothing once benefits are confirmed, whether their child has Medicaid or private insurance. The free benefit check gives you your plan's real answer, usually within a business day.",
  },
  {
    q: "Is the benefit check really free?",
    a: "Yes — free whether or not you ever work with us, with no obligation attached. We built it because the first question every family has is “what would this cost us?”, and you deserve that answer before making any decisions.",
  },
  {
    q: "What do you need from me to run it?",
    a: "A photo of the front and back of your child's insurance card, and a way to reach you. That's the whole ask. Our intake team does the rest directly with your plan.",
  },
  {
    q: "What if my plan denies coverage or sends a confusing letter?",
    a: "Bring it to us. Denials are often reversible, and confusing letters are our intake team's daily reading material. We'll tell you honestly what the letter means and what we'd do next.",
  },
  {
    q: "Do you take my specific insurance plan?",
    a: "We publish named in-network plans here as each payer's credentialing is confirmed — never before. In the meantime, the benefit check answers the question that actually matters: what your plan would cover for your child, and what you'd owe.",
  },
];

export default function InsurancePage() {
  return (
    <>
      <JsonLd data={faqJsonLd(benefitFaqs)} />
      <header className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-16 lg:pt-16">
          <div>
            <h1 className="font-display max-w-xl text-4xl sm:text-5xl">
              Insurance shouldn&rsquo;t be the hard part.
            </h1>
            <p className="prose-measure mt-4 text-lg text-ink-soft">
              Coverage varies by plan — and no website can tell you what yours
              will do. So we do something better than guessing: a free benefit
              check. Most families pay little or nothing once benefits are
              confirmed, and we tell you exactly where you stand before
              anything starts.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Free benefit check for every family",
                "Medicaid and private plans, both states",
                "Approval paperwork handled by our team",
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
          </div>
          <LeadForm
            heading="Run my free benefit check"
            subheading="Tell us who to call back. We'll confirm your ABA benefits with your plan, usually within a business day."
            sourcePage="insurance"
          />
        </div>
      </header>

      {/* ————— How the benefit check works ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <h2 className="font-display text-3xl sm:text-4xl">
              How the free benefit check works
            </h2>
            <p className="mt-4 text-ink-soft">
              This one step saves you weeks of phone calls and paperwork.
              Here&rsquo;s exactly what happens.
            </p>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
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
            ].map((step, i) => (
              <li key={step.title} className="flex gap-4 rounded-3xl bg-cream p-6">
                <span className="font-display grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand-teal text-lg text-white">
                  {i + 1}
                </span>
                <div>
                  <h3 className="font-display text-lg leading-snug">{step.title}</h3>
                  <p className="mt-1.5 text-[15px] leading-relaxed text-ink-soft">
                    {step.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ————— What families pay ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <h2 className="font-display text-3xl sm:text-4xl">
              What will it actually cost us?
            </h2>
            <p className="mt-4 text-ink-soft">
              The honest answer: it depends on your plan — which is exactly
              why the benefit check comes first. What we can say from
              experience is that most families pay little or nothing for ABA
              once their benefits are confirmed.
            </p>
            <p className="mt-4 text-ink-soft">
              Before your child starts, you get a written, plain-English
              summary of your specific benefits: what&rsquo;s covered, what
              you&rsquo;d owe, and when. No surprises is a rule here, not a
              slogan. If something changes mid-year, we call you before it
              costs you.
            </p>
            <p className="mt-6">
              <a
                href={siteConfig.phoneHref}
                className="font-bold text-brand-teal hover:underline"
              >
                Questions about a denial or a confusing letter? Call{" "}
                {siteConfig.phone}
              </a>{" "}
              — we read those letters every day.
            </p>
          </div>

          {/* Commercial payer list — config-gated, never fabricated */}
          <div className="mt-10 rounded-3xl border-2 border-dashed border-line bg-white/70 p-6 sm:p-8 lg:max-w-3xl">
            <h3 className="font-display text-xl">Plans we work with</h3>
            {/* TODO (required before launch): publish the real credentialed
                payer list per state once credentialing is confirmed. Never
                publish a payer name before credentialing is confirmed. */}
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              The named list of in-network plans for Kansas and Colorado is
              published here once credentialing is confirmed for each payer.
              Until then, one honest promise: send us your card and
              we&rsquo;ll tell you exactly where you stand — free, within
              about a business day.
            </p>
          </div>
        </div>
      </section>

      <Faq items={benefitFaqs} heading="Coverage questions, answered plainly" />

      <CtaBand
        heading="One photo of your insurance card."
        body="That's all the benefit check needs. We come back with a clear answer about coverage and cost — free, whether or not you ever work with us."
        primaryLabel="Run my free benefit check"
      />
      <StickyCallBar callLabel="Call the team" />
    </>
  );
}
