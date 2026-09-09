import Link from "next/link";
import { siteConfig } from "../../site.config";

/**
 * Coverage strip under the hero — deliberately vague per the client's
 * rule: no program specifics, no legal claims, everything routed to the
 * free benefit check. Named commercial payers appear only once
 * site.config.ts confirms credentialing; until then the row renders
 * honest, clearly-labeled pending slots.
 */
export default function InsuranceWall() {
  const payers = [
    ...siteConfig.coverage.kansas.payers,
    ...siteConfig.coverage.colorado.payers,
  ];
  const pendingSlots = payers.length === 0 ? 3 : 0;

  const pill =
    "inline-flex h-[54px] shrink-0 items-center gap-2.5 whitespace-nowrap rounded-full border border-ink/10 bg-white px-7 text-[15px] font-bold shadow-[0_1px_2px_rgba(15,58,71,0.04)]";
  const check = (
    <svg aria-hidden="true" width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-meadow" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 7.5l3 3 6-7" />
    </svg>
  );

  return (
    <section aria-label="Insurance coverage" className="bg-cream">
      <div className="mx-auto max-w-[87rem] px-4 py-9 sm:px-6">
        <p className="text-center text-[15px] font-bold">
          Coverage varies by plan — so we check yours, free.{" "}
          <Link href="/insurance" className="link-grow font-bold text-brand-teal">
            How the benefit check works
          </Link>
        </p>

        <div className="edge-fade no-scrollbar mt-6 overflow-x-auto">
          <ul className="flex w-max items-center gap-3 px-6 pb-1 lg:mx-auto lg:justify-center">
            <li className={pill}>
              {check}
              Medicaid families welcome
            </li>
            <li className={pill}>
              {check}
              Private plans welcome
            </li>
            <li className={pill}>
              {check}
              Free benefit check for every family
            </li>
            {payers.map((p) => (
              <li key={p} className={pill}>
                {p}
              </li>
            ))}
            {Array.from({ length: pendingSlots }).map((_, i) => (
              <li
                key={i}
                aria-hidden="true"
                className="hidden h-[54px] w-32 shrink-0 rounded-full border-2 border-dashed border-line bg-white/50 lg:block"
              />
            ))}
          </ul>
        </div>

        <p className="mt-4 text-center text-[13px] text-ink-soft">
          Most families pay little or nothing once benefits are confirmed.
          Send us your card and we&rsquo;ll tell you exactly where you stand —
          free, usually within a business day.
        </p>
      </div>
    </section>
  );
}
