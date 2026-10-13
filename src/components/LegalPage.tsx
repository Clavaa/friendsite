import type { ReactNode } from "react";

/** Plain long-form shell for /privacy and /terms. */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <>
      <header className="bg-cream">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
          <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-4 text-[15px] font-semibold text-ink-soft">Last updated {updated}</p>
        </div>
      </header>
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-12 text-[17px] leading-relaxed text-ink-soft sm:px-6 [&_a]:font-bold [&_a]:text-brand-teal [&_a]:underline [&_h2]:font-display [&_h2]:pt-6 [&_h2]:text-2xl [&_h2]:text-ink [&_li]:mt-2 [&_strong]:text-ink [&_ul]:list-disc [&_ul]:pl-6">
        {children}
      </div>
    </>
  );
}
