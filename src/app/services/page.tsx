import type { Metadata } from "next";
import CtaBand from "../../components/CtaBand";
import ServiceCards from "../../components/ServiceCards";
import StickyCallBar from "../../components/StickyCallBar";

export const metadata: Metadata = {
  title: "ABA therapy services in Kansas & Colorado",
  description:
    "In-home ABA, daycare-based support, parent training, and telehealth across Kansas and Colorado — with in-center ABA coming soon. Every plan BCBA-designed and parent-approved.",
  alternates: { canonical: "/services" },
};

export default function ServicesPage() {
  return (
    <>
      <header className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <h1 className="font-display max-w-3xl text-4xl sm:text-5xl">
            One plan for your child. Many ways to deliver it.
          </h1>
          <p className="prose-measure mt-4 text-lg text-ink-soft">
            Every child gets an individual, BCBA-designed treatment plan. The
            setting — home, daycare, video, or a mix — is chosen to serve
            that plan, and it can change as your child grows.
          </p>
        </div>
      </header>
      <ServiceCards />
      <section className="bg-cream">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <div className="prose-measure">
            <h2 className="font-display text-3xl sm:text-4xl">
              The parts that never change
            </h2>
            <p className="mt-4 text-ink-soft">
              Whatever the setting, three things hold everywhere we work: a
              Board Certified Behavior Analyst designs and supervises every
              plan; parents see, shape, and approve every goal before anything
              is submitted; and progress is measured with real data you review
              together — never a vague &ldquo;he had a good week.&rdquo;
            </p>
          </div>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {[
              {
                t: "BCBA-led, always",
                b: "Technicians run sessions; a licensed, board-certified analyst designs the plan, trains the team, and adjusts course.",
              },
              {
                t: "Parents in the loop",
                b: "Parent training is built into every plan, because skills that only work in session were never the goal.",
              },
              {
                t: "Data you can see",
                b: "Regular progress reviews with real numbers — words used, skills mastered, hard moments shrinking.",
              },
            ].map((card) => (
              <div key={card.t} className="rounded-3xl bg-white p-6 shadow-card">
                <h3 className="font-display text-xl">{card.t}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{card.b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CtaBand />
      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
