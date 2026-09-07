import Link from "next/link";
import { questionPages } from "../data/questions";

/**
 * 6-card parent-question triage grid (Style Bible signature component #4).
 * Each card links to a full answer page at /questions/[slug]/ — except the
 * no-diagnosis-yet card, which routes into the /get-a-diagnosis funnel.
 */
const hrefOverrides: Record<string, string> = {
  "think-my-child-might-have-asd": "/get-a-diagnosis",
};

export default function TriageGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:py-20">
      <div className="max-w-2xl">
        <h2 className="font-display text-3xl sm:text-4xl">
          Start with the question you&rsquo;re actually asking
        </h2>
        <p className="mt-3 text-ink-soft">
          Every family arrives here mid-question. Pick yours — each one gets a
          real answer, not a sales page.
        </p>
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {questionPages.map((q) => (
          <li key={q.slug}>
            <Link
              href={hrefOverrides[q.slug] ?? `/questions/${q.slug}`}
              className="group flex h-full flex-col justify-between rounded-2xl border border-line bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:border-brand-teal/40 hover:shadow-card-lg"
            >
              <p className="font-display text-xl leading-snug">
                {q.cardTitle}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-bold text-brand-teal">
                Read the answer
                <svg
                  aria-hidden="true"
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  <path d="M3 8h10M9 4l4 4-4 4" />
                </svg>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
