import type { Metadata } from "next";
import StickyCallBar from "../../components/StickyCallBar";
import TriageGrid from "../../components/TriageGrid";
import CtaBand from "../../components/CtaBand";

export const metadata: Metadata = {
  title: "Parent questions, answered plainly",
  description:
    "Straight answers to the questions Kansas and Colorado parents actually ask about autism, ABA therapy, insurance, and getting started.",
  alternates: { canonical: "/questions" },
};

export default function QuestionsIndexPage() {
  return (
    <>
      <header className="bg-sun-wash">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:py-16">
          <h1 className="font-display max-w-3xl text-4xl sm:text-5xl">
            Parent questions, answered plainly
          </h1>
          <p className="prose-measure mt-4 text-lg text-ink-soft">
            No jargon, no scare tactics, no sales page dressed up as advice.
            Pick the question closest to yours.
          </p>
        </div>
      </header>
      <TriageGrid />
      <CtaBand />
      <StickyCallBar callLabel="Call the Wichita team" />
    </>
  );
}
