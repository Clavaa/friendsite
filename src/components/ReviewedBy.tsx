import { siteConfig } from "../../site.config";

/**
 * "Clinically reviewed by …" credential chip — rendered near the top of
 * every parent guide (/resources/[slug]) and parent question
 * (/questions/[slug]) article. One reviewer for the whole library, driven
 * by siteConfig.clinicalReviewer; pair it with `reviewedByJsonLd` merged
 * into the page's Article JSON-LD so the claim is machine-readable too.
 */
export default function ReviewedBy({ className = "" }: { className?: string }) {
  const r = siteConfig.clinicalReviewer;
  return (
    <p
      className={`inline-flex items-center gap-2.5 rounded-full bg-white py-2 pl-3 pr-4 text-[13.5px] font-bold text-ink-soft shadow-chip ${className}`}
    >
      <span
        aria-hidden="true"
        className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-mint-wash text-brand-teal"
      >
        {/* shield-check */}
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2.5l7.5 3v5.5c0 5-3.2 8.6-7.5 10.5C7.7 19.6 4.5 16 4.5 11V5.5l7.5-3z" />
          <path d="M8.8 11.8l2.2 2.2 4.2-4.6" />
        </svg>
      </span>
      Clinically reviewed by{" "}
      <span className="whitespace-nowrap text-ink">
        {r.name}, {r.jobTitle}
      </span>
    </p>
  );
}

/** schema.org Person for the Article JSON-LD `reviewedBy` field. */
export const reviewedByJsonLd = {
  "@type": "Person",
  name: siteConfig.clinicalReviewer.name,
  jobTitle: siteConfig.clinicalReviewer.jobTitle,
} as const;
