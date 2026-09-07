import type { FaqItem } from "../data/states";

/**
 * Accessible FAQ using native <details>/<summary>. The matching FAQPage
 * JSON-LD is emitted by the page via faqJsonLd() so schema and visible
 * content never drift apart.
 */
export default function Faq({
  items,
  heading = "Questions parents actually ask",
}: {
  items: FaqItem[];
  heading?: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <h2 className="font-display max-w-2xl text-3xl sm:text-4xl">{heading}</h2>
      <div className="mt-8 grid gap-3 lg:max-w-3xl">
        {items.map((item) => (
          <details
            key={item.q}
            className="group rounded-2xl bg-white shadow-card open:shadow-card-lg"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-[16px] font-bold [&::-webkit-details-marker]:hidden">
              {item.q}
              <span
                aria-hidden="true"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-sun-wash text-brand-teal transition-transform group-open:rotate-45"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <path d="M7 2v10M2 7h10" />
                </svg>
              </span>
            </summary>
            <div className="px-5 pb-5 text-[15px] leading-relaxed text-ink-soft">
              {item.a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export function faqJsonLd(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}
