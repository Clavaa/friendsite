import type { Metadata } from "next";
import Link from "next/link";
import CtaBand from "../../components/CtaBand";
import LeadForm from "../../components/LeadForm";
import StickyCallBar from "../../components/StickyCallBar";
import { siteConfig } from "../../../site.config";
import { stateContent } from "../../data/states";

export const metadata: Metadata = {
  title: "Insurance & Medicaid for ABA in Kansas & Colorado",
  description:
    "How ABA therapy gets paid for in Kansas and Colorado: KanCare, Health First Colorado, state autism insurance mandates, and a free benefits check for your exact plan.",
  alternates: { canonical: "/insurance" },
};

export default function InsurancePage() {
  const kansas = stateContent.kansas;
  const colorado = stateContent.colorado;

  return (
    <>
      <header className="bg-cream">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 pb-14 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:pb-16 lg:pt-16">
          <div>
            <h1 className="font-display max-w-xl text-4xl sm:text-5xl">
              Insurance shouldn&rsquo;t be the hard part.
            </h1>
            <p className="prose-measure mt-4 text-lg text-ink-soft">
              Both of our states require most health plans to cover ABA, and
              both state Medicaid programs cover it too. Whatever card is in
              your wallet, the fastest path to a real answer is our free
              benefits check — one photo, one business day, one plain-English
              answer.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Free benefits verification for every family",
                "Medicaid and private plans, both states",
                "Prior authorization handled by our team",
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
            heading="Verify my coverage — free"
            subheading="Tell us who to call back. We'll confirm your ABA benefits with your plan, usually within a business day."
            sourcePage="insurance"
          />
        </div>
      </header>

      {/* ————— Medicaid, both states ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <h2 className="font-display max-w-2xl text-3xl sm:text-4xl">
            Medicaid covers ABA in both of our states
          </h2>
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {[kansas, colorado].map((st) => (
              <div key={st.slug} className={`rounded-3xl p-6 sm:p-8 ${st.slug === "kansas" ? "bg-sun-wash" : "bg-mint-wash"}`}>
                <p className="text-sm font-bold tracking-wide text-brand-teal">
                  {st.name}
                </p>
                <h3 className="font-display mt-1 text-2xl">
                  {st.medicaidProgramName}
                </h3>
                <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">
                  {st.medicaidIntro[0]}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {st.medicaidPlans.map((plan) => (
                    <li key={plan} className="rounded-full bg-white px-3.5 py-1.5 text-[14px] font-semibold shadow-chip">
                      {plan}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/${st.slug}`}
                  className="mt-5 inline-block text-[15px] font-bold text-brand-teal hover:underline"
                >
                  Full {st.name} coverage guide →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ————— Private insurance / mandates ————— */}
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <h2 className="font-display text-3xl sm:text-4xl">
              Private insurance: the law is on your side
            </h2>
            <p className="mt-4 text-ink-soft">
              Kansas has required autism coverage in state-regulated plans
              since 2014. Colorado has required it since 2009 — and removed
              every age and dollar cap in 2017. If your plan came from the
              marketplace or a smaller employer, ABA coverage is very likely
              built in.
            </p>
            <p className="mt-4 text-ink-soft">
              Large employers often run self-funded plans with their own rules
              — many still cover ABA generously. The plan documents decide, and
              reading them for families is our intake team&rsquo;s daily work.
            </p>
          </div>

          {/* Commercial payer list — config-gated, never fabricated */}
          <div className="mt-8 rounded-3xl border-2 border-dashed border-line bg-white/70 p-6 sm:p-8 lg:max-w-3xl">
            <h3 className="font-display text-xl">Plans we work with</h3>
            {/* TODO (required before launch): publish the real credentialed
                payer list per state — e.g. specific commercial networks the
                practice is actually in-network with. Never publish a payer
                name before credentialing is confirmed. */}
            <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">
              The named list of in-network commercial plans for Kansas and
              Colorado is published here once credentialing is confirmed for
              each payer. Until then, one honest promise: send us your card and
              we&rsquo;ll tell you exactly where you stand — free, within about
              a business day.
            </p>
            <p className="mt-3 rounded-xl bg-cream px-3 py-2 text-[13px] font-semibold text-ink-soft">
              Production note: awaiting confirmed payer list — see TODO in this
              template.
            </p>
          </div>
        </div>
      </section>

      {/* ————— What families pay ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <h2 className="font-display text-3xl sm:text-4xl">
              What will it actually cost us?
            </h2>
            <p className="mt-4 text-ink-soft">
              Your share depends on your plan&rsquo;s deductible, copays, and
              out-of-pocket maximum — not on ABA specifically. Medicaid
              families typically pay nothing. Many privately-insured families
              reach their out-of-pocket maximum early in the year and pay
              nothing after that.
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
        </div>
      </section>

      <CtaBand
        heading="One photo of your insurance card."
        body="That's all the benefits check needs. We come back with a clear answer about coverage and cost — free, whether or not you ever work with us."
        primaryLabel="Verify my coverage"
      />
      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
