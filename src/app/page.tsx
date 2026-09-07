import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import CtaBand from "../components/CtaBand";
import LeadForm from "../components/LeadForm";
import Locator from "../components/Locator";
import ProofChip from "../components/ProofChip";
import Reviews from "../components/Reviews";
import ServiceCards from "../components/ServiceCards";
import StatBand from "../components/StatBand";
import StickyCallBar from "../components/StickyCallBar";
import TriageGrid from "../components/TriageGrid";
import { siteConfig } from "../../site.config";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function HomePage() {
  return (
    <>
      {/* ————— Hero: split on warm cream (Sunbird brand) ————— */}
      <section className="relative overflow-hidden bg-cream">
        {/* quiet geometry, not illustration: soft butter + mint corner blobs */}
        <div
          aria-hidden="true"
          className="absolute -right-40 -top-40 h-[34rem] w-[34rem] rounded-full bg-sun-wash/70"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-44 -left-44 h-[26rem] w-[26rem] rounded-full bg-mint-wash/70"
        />
        <div className="relative mx-auto grid max-w-6xl gap-10 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:pb-24 lg:pt-20">
          {/* Left: headline + trust checklist */}
          <div>
            {/* Eyebrow: butter dash + tracked-out teal line, per the brand */}
            <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.18em] text-brand-teal">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-sun" />
              {siteConfig.eyebrow}
            </p>
            {/* Tagline headline — second sentence in italic teal, per the brand */}
            <h1 className="font-display mt-5 text-4xl sm:text-5xl lg:text-[3.4rem]">
              {siteConfig.taglineLead}{" "}
              <span className="block italic text-brand-teal">
                {siteConfig.taglineFeel}
              </span>
            </h1>
            <p className="mt-4 max-w-lg text-lg text-ink-soft">
              Sunbird ABA provides compassionate, BCBA-led therapy at home,
              in our centers, and at school across Kansas &amp; Colorado —
              with an intake team that answers the phone and does the
              insurance legwork for you.
            </p>
            <ul className="mt-6 space-y-3">
              {siteConfig.trustChecklist.map((item) => (
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
              Prefer to talk it through?{" "}
              <a
                href={siteConfig.phoneHref}
                className="font-bold text-brand-teal hover:underline"
              >
                Call {siteConfig.phone}
              </a>{" "}
              — a person answers, not a menu.
            </p>
          </div>

          {/* Right: intake card over circle-cropped photo with proof chips */}
          <div className="relative">
            <div className="absolute -right-6 -top-8 hidden h-64 w-64 overflow-hidden rounded-full lg:block">
              <Image
                src="/images/blocks-play-living-room.jpg"
                alt="A woman and a young girl stacking colorful wooden blocks together on a living room floor in bright daylight"
                fill
                priority
                sizes="16rem"
                className="object-cover"
              />
            </div>
            <div className="relative z-10 lg:mr-14 lg:mt-16">
              <LeadForm sourcePage="home-hero" />
              <p className="mt-4 pb-6 text-center text-[14px] font-semibold lg:pb-0 lg:text-left">
                No diagnosis yet?{" "}
                <Link
                  href="/get-a-diagnosis"
                  className="font-bold text-brand-teal hover:underline"
                >
                  Start here &rarr;
                </Link>
              </p>
            </div>
            <ProofChip className="absolute -top-2 left-2 z-20 lg:-left-4 lg:top-8">
              In-network with most plans
            </ProofChip>
            <ProofChip className="absolute -bottom-4 right-2 z-20 lg:-right-2">
              Serving Wichita &amp; Denver metro
            </ProofChip>
          </div>
        </div>
      </section>

      <StatBand />
      <ServiceCards />
      <TriageGrid />
      <Locator />

      {/* ————— How it starts: 3 calm steps ————— */}
      <section className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl sm:text-4xl">
              From first call to first session
            </h2>
            <p className="mt-3 text-ink-soft">
              We built our intake around one promise: you always know the next
              step, and it&rsquo;s never on you alone.
            </p>
          </div>
          <ol className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Tell us about your child",
                b: "A 15-minute call with an intake advocate. Your questions first, our questions second.",
              },
              {
                n: "2",
                t: "We verify your coverage — free",
                b: "One photo of your insurance card. We come back with a plain-English answer, usually within a business day.",
              },
              {
                n: "3",
                t: "Assessment, approval, and go",
                b: "Your BCBA meets your child, writes the plan with you, and we handle the authorization until sessions start.",
              },
            ].map((step) => (
              <li
                key={step.n}
                className="rounded-3xl bg-cream p-6"
              >
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
        </div>
      </section>

      <Reviews />
      <CtaBand />
      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
