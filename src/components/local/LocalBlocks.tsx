import Link from "next/link";
import type { ReactNode } from "react";
import type { CopySection } from "../../lib/localCopy";
import {
  about,
  autismEstimate,
  fmt,
  pctStr,
  SOURCES_NOTE,
  type LocalStats,
} from "../../lib/local";

/**
 * Building blocks for the data-rich local pages (county, town, team city).
 * Content comes from src/lib/localCopy.ts; numbers from src/lib/local.ts.
 */

/** Renders [text](/path) links and **bold** inside a copy string. */
export function RichText({ text }: { text: string }) {
  const out: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]*)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1]) {
      out.push(
        <Link key={i++} href={m[2]} className="font-bold text-brand-teal hover:underline">
          {m[1]}
        </Link>
      );
    } else {
      out.push(
        <strong key={i++} className="text-ink">
          {m[3]}
        </strong>
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return <>{out}</>;
}

/** Strips link/bold markup — for FAQ schema and plain contexts. */
export function plain(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1");
}

export function LocalSnapshot({
  name,
  stats,
  countyStats,
  countyName,
  extras,
}: {
  name: string;
  stats: LocalStats | null;
  /** Fallback for small-sample percentages, labeled county-wide. */
  countyStats?: LocalStats | null;
  countyName?: string;
  extras: { label: string; value: string }[];
}) {
  const tiles: { label: string; value: string }[] = [];
  const pctTile = (k: "under6AllParentsWorkPct" | "broadbandPct" | "kidsPublicOnlyPct" | "kidsUninsuredPct", label: string) => {
    const own = stats?.[k];
    if (own !== null && own !== undefined) return tiles.push({ label, value: pctStr(own) });
    const cv = countyStats?.[k];
    if (cv !== null && cv !== undefined && countyName)
      tiles.push({ label: `${label} (${countyName}-wide)`, value: pctStr(cv) });
  };
  if (stats) {
    tiles.push({ label: "Residents", value: fmt(stats.pop) });
    if (stats.under18 > 0) tiles.push({ label: "Children under 18", value: fmt(stats.under18) });
    if (stats.under5 > 0) tiles.push({ label: "Children under 5", value: fmt(stats.under5) });
    if (stats.under18 > 0) {
      const est = autismEstimate(stats.under18);
      tiles.push({
        label: "Kids likely on the spectrum (CDC 1-in-31 estimate)",
        value: est >= 1 ? about(est).replace("about ", "≈ ") : "< 1",
      });
    }
    pctTile("under6AllParentsWorkPct", "Kids under 6 with every parent working");
    pctTile("broadbandPct", "Homes with broadband (telehealth-ready)");
    pctTile("kidsPublicOnlyPct", "Kids covered only by a public plan");
    pctTile("kidsUninsuredPct", "Kids with no health coverage");
    if (stats.medianIncome && stats.households >= 150)
      tiles.push({ label: "Median household income", value: `$${fmt(stats.medianIncome)}` });
  }
  tiles.push(...extras);

  return (
    <section className="bg-white" aria-labelledby="snapshot-h">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <h2 id="snapshot-h" className="font-display text-2xl sm:text-3xl">
          {name} at a glance — for families
        </h2>
        <p className="mt-2 max-w-2xl text-[15px] text-ink-soft">
          The numbers that shape how ABA therapy works here, from public data.
        </p>
        <dl className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {tiles.map((t) => (
            <div key={t.label} className="rounded-2xl bg-cream p-4">
              <dt className="text-[13px] font-semibold leading-snug text-ink-soft">{t.label}</dt>
              <dd className="font-display mt-1 text-2xl text-ink">{t.value}</dd>
            </div>
          ))}
        </dl>
        <p className="mt-4 max-w-4xl text-[12.5px] leading-relaxed text-ink-soft">{SOURCES_NOTE}</p>
      </div>
    </section>
  );
}

const TINTS = ["bg-cream", "bg-white"];

export function LocalSections({ sections }: { sections: CopySection[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <section key={s.id} id={s.id} className={TINTS[i % 2]}>
          <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
            <h2 className="font-display text-2xl sm:text-3xl">{s.heading}</h2>
            {s.paragraphs.map((p, j) => (
              <p key={j} className="mt-4 text-[16px] leading-relaxed text-ink-soft">
                <RichText text={p} />
              </p>
            ))}
            {s.bullets && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-[16px] leading-relaxed text-ink-soft">
                {s.bullets.map((b, j) => (
                  <li key={j}>
                    <RichText text={b} />
                  </li>
                ))}
              </ul>
            )}
            {s.ordered && (
              <ol className="mt-5 space-y-3">
                {s.ordered.map((b, j) => (
                  <li key={j} className="flex gap-3 text-[16px] leading-relaxed text-ink-soft">
                    <span
                      aria-hidden="true"
                      className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-brand-teal text-[14px] font-bold text-white"
                    >
                      {j + 1}
                    </span>
                    <span>
                      <RichText text={b} />
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </section>
      ))}
    </>
  );
}

export interface LinkItem {
  name: string;
  href: string;
  note?: string;
}

/** Chip wall of internal links, optionally with a small note (e.g. "12 mi"). */
export function LinkChips({
  heading,
  intro,
  items,
  tint = "bg-white",
  id,
}: {
  heading: string;
  intro?: ReactNode;
  items: LinkItem[];
  tint?: string;
  id?: string;
}) {
  if (!items.length) return null;
  return (
    <section className={tint} id={id}>
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <h2 className="font-display text-2xl">{heading}</h2>
        {intro && <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">{intro}</p>}
        <ul className="mt-4 flex flex-wrap gap-2.5">
          {items.map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="inline-flex items-baseline gap-1.5 rounded-full border border-line bg-cream px-4 py-2 text-[15px] font-semibold transition-colors hover:border-brand-teal hover:text-brand-teal"
              >
                {t.name}
                {t.note && <span className="text-[12.5px] font-semibold text-ink-soft">{t.note}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** ZIP-code list — plain text, it is reference info, not links. */
export function ZipList({ name, zips }: { name: string; zips: string[] }) {
  if (!zips.length) return null;
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="font-display text-2xl">ZIP codes we serve in {name}</h2>
        <p className="mt-2 max-w-3xl text-[15px] leading-relaxed text-ink-soft">
          In-home ABA therapy, daycare-based support and telehealth are available
          to families in every one of these ZIP codes:
        </p>
        <ul className="mt-4 flex flex-wrap gap-2">
          {zips.map((z) => (
            <li key={z} className="rounded-lg bg-mint-wash px-3 py-1.5 text-[15px] font-bold tabular-nums">
              {z}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/** Guide shelf — rotates which guides a page links so link equity spreads. */
const GUIDE_POOL: LinkItem[] = [
  { name: "What is ABA therapy?", href: "/resources/what-is-aba" },
  { name: "Signs of autism at 18 months", href: "/resources/signs-of-autism-at-18-months" },
  { name: "Signs of autism at age 2", href: "/resources/signs-of-autism-at-age-2" },
  { name: "Signs of autism at age 3", href: "/resources/signs-of-autism-at-age-3" },
  { name: "The M-CHAT screening, explained", href: "/resources/the-m-chat-screening" },
  { name: "What level 2 autism means", href: "/resources/what-does-level-2-autism-mean" },
  { name: "How many hours of ABA?", href: "/resources/how-many-hours-of-aba" },
  { name: "ABA vs. speech therapy", href: "/resources/aba-vs-speech-therapy" },
  { name: "Is ABA therapy harmful?", href: "/resources/is-aba-therapy-harmful" },
  { name: "Paying for ABA", href: "/resources/paying-for-aba" },
  { name: "First steps after a diagnosis", href: "/resources/first-steps-after-a-diagnosis" },
  { name: "Your first session", href: "/resources/preparing-for-your-first-session" },
  { name: "Parent training, explained", href: "/resources/parent-training-explained" },
  { name: "Home vs. daycare sessions", href: "/resources/home-vs-daycare-sessions" },
  { name: "Who's on your child's team", href: "/resources/who-is-on-the-team" },
  { name: "ABA glossary", href: "/resources/aba-glossary" },
];

export function guideShelf(seed: number, n = 6): LinkItem[] {
  const start = seed % GUIDE_POOL.length;
  return Array.from({ length: n }, (_, i) => GUIDE_POOL[(start + i * 3) % GUIDE_POOL.length]).filter(
    (g, i, a) => a.findIndex((x) => x.href === g.href) === i
  );
}
