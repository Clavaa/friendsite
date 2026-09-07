import Link from "next/link";
import { siteConfig } from "../../site.config";

/**
 * Reusable mid-page / end-of-page conversion band.
 * First-person CTA copy per the CRO spine; teal primary + phone secondary
 * (phone-first category — the number is always one tap away).
 * tint="indigo" renders the dark petrol band (white primary button for
 * contrast); tint="sky" renders the butter sun-wash band (teal primary).
 */
export default function CtaBand({
  heading = "Ready for a plan instead of a waitlist?",
  body = "Fifteen minutes with an intake advocate answers the coverage question, the timing question, and the what-happens-next question — free.",
  primaryLabel = "Match me with an advocate",
  primaryHref = "/getting-started",
  tint = "indigo",
}: {
  heading?: string;
  body?: string;
  primaryLabel?: string;
  primaryHref?: string;
  tint?: "indigo" | "sky";
}) {
  const indigo = tint === "indigo";
  return (
    <section
      className={indigo ? "bg-ink text-white" : "bg-sun-wash text-ink"}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-start gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:py-16">
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl sm:text-4xl">{heading}</h2>
          <p className={`mt-3 ${indigo ? "text-white/75" : "text-ink-soft"}`}>
            {body}
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className={`rounded-full px-7 py-3.5 text-center text-[16px] font-bold transition-colors ${
              indigo
                ? "bg-white text-brand-teal-deep hover:bg-cream"
                : "bg-brand-teal text-white hover:bg-brand-teal-deep"
            }`}
          >
            {primaryLabel}
          </Link>
          <a
            href={siteConfig.phoneHref}
            className={`rounded-full border px-7 py-3.5 text-center text-[16px] font-bold transition-colors ${
              indigo
                ? "border-white/30 text-white hover:border-white"
                : "border-ink/25 text-ink hover:border-ink"
            }`}
          >
            Call {siteConfig.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
