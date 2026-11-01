import type { Metadata } from "next";
import Link from "next/link";
import { BUCKETS, buildReport, type Bucket, type Report, type Visitor } from "../../lib/report";

/**
 * Admin visitor report — password-gated in middleware (ADMIN_PASSWORD),
 * read live from BigQuery on every load. Never cached, never indexed.
 */

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Visitor report",
  robots: { index: false, follow: false },
};

const RANGES = [1, 2, 7, 14, 30];
const TONE: Record<Bucket, string> = {
  SEO: "bg-meadow",
  Marketing: "bg-sun",
  "Direct / unknown": "bg-brand-teal",
  "Other referral": "bg-brand-aqua",
  "Work tools (staff/partners)": "bg-line",
};

type Search = { days?: string; all?: string; src?: string; focus?: string };

function href(cur: Search, patch: Partial<Search>) {
  const next = { ...cur, ...patch };
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(next)) if (v) qs.set(k, v);
  const s = qs.toString();
  return s ? `/admin?${s}` : "/admin";
}

function dur(s: number) {
  return s >= 60 ? `${Math.floor(s / 60)}m ${String(s % 60).padStart(2, "0")}s` : `${s}s`;
}

function isSignal(v: Visitor) {
  return v.lead || v.call || v.form || v.apply || v.secs >= 60 || v.steps.some((s) => s.kind === "click");
}

export default async function AdminPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const days = RANGES.includes(Number(sp.days)) ? Number(sp.days) : 7;
  const includeAll = sp.all === "1";

  let report: Report;
  try {
    report = await buildReport(days, includeAll);
  } catch (e) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-16">
        <h1 className="text-xl font-extrabold">Visitor report unavailable</h1>
        <p className="mt-2 text-sm text-ink-soft">{e instanceof Error ? e.message : String(e)}</p>
      </main>
    );
  }

  const r = report;
  const total = r.visitors.length;
  const leads = r.visitors.filter((v) => v.lead).length;
  const calls = r.visitors.filter((v) => v.call).length;
  const formMiss = r.visitors.filter((v) => v.form && !v.lead).length;
  const applies = r.visitors.filter((v) => v.apply).length;
  const ads = r.visitors.filter((v) => v.source.startsWith("Paid")).length;

  const list = r.visitors.filter(
    (v) => (!sp.src || v.bucket === sp.src) && (sp.focus !== "1" || isSignal(v))
  );
  const maxSource = Math.max(1, ...r.bySource.map(([, n]) => n));
  const maxDay = Math.max(1, ...r.byDay.map((d) => Object.values(d.counts).reduce((a, b) => a + b, 0)));

  const tile = (label: string, value: number, note?: string, warn = false) => (
    <div className="rounded-xl border border-line bg-white px-4 py-3">
      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold tabular-nums ${warn && value ? "text-[#b4441f]" : ""}`}>{value}</p>
      {note && <p className="text-[12px] text-ink-soft">{note}</p>}
    </div>
  );

  return (
    <main className="mx-auto max-w-6xl overflow-x-hidden px-4 py-8 text-[14px] sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Visitor report</h1>
          <p className="text-ink-soft">
            Real people only (bots, lab tests and scrapers removed)
            {includeAll ? "" : ` · NY/NJ hidden (${r.hidden})`} · times Eastern
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex overflow-hidden rounded-lg border border-line bg-white">
            {RANGES.map((d) => (
              <Link
                key={d}
                href={href(sp, { days: String(d) })}
                className={`px-3 py-1.5 font-bold ${d === days ? "bg-ink text-white" : "hover:bg-cream"}`}
              >
                {d === 1 ? "Today" : `${d}d`}
              </Link>
            ))}
          </nav>
          <Link
            href={href(sp, { all: includeAll ? undefined : "1" })}
            className="rounded-lg border border-line bg-white px-3 py-1.5 font-bold hover:bg-cream"
          >
            {includeAll ? "Hide NY/NJ" : "Include NY/NJ"}
          </Link>
        </div>
      </div>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {tile("Real visitors", total)}
        {tile("Leads", leads)}
        {tile("Phone taps", calls)}
        {tile("Form tried, no lead", formMiss, "clicked send, nothing arrived", true)}
        {tile("Job apply clicks", applies)}
        {tile("Ad clicks", ads)}
      </section>

      <section className="mt-6 rounded-xl border border-line bg-white p-4">
        <h2 className="font-extrabold">
          Form submissions <span className="font-semibold text-ink-soft">· {r.submissions.length}</span>
        </h2>
        {r.submissions.length === 0 ? (
          <p className="mt-2 text-ink-soft">None in this range. (Saved since Nov 1, 2026; earlier ones only went by email.)</p>
        ) : (
          <ul className="mt-3 divide-y divide-line">
            {r.submissions.map((s, i) => (
              <li key={i} className="py-2.5 text-[13.5px]">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-bold">{s.t}</span>
                  <span className="font-extrabold">{s.parent_name}</span>
                  {s.phone && <a href={`tel:${s.phone}`} className="text-brand-teal hover:underline">{s.phone}</a>}
                  {s.email && <a href={`mailto:${s.email}`} className="text-brand-teal hover:underline">{s.email}</a>}
                  <span className="text-ink-soft">
                    {[s.type, s.zip, s.state, s.child_age && `age ${s.child_age}`, s.insurance, s.concerns].filter(Boolean).join(" · ")}
                  </span>
                  <span className="text-ink-soft">from {s.source_page}</span>
                  <span className={`rounded px-1.5 text-[12px] font-bold ${s.email_status === "sent" ? "bg-meadow-wash text-meadow-deep" : "bg-[#b4441f] text-white"}`}>
                    email {s.email_status}
                  </span>
                </div>
                {s.question && <p className="mt-1 text-ink-soft">“{s.question}”</p>}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="min-w-0 rounded-xl border border-line bg-white p-4">
          <h2 className="font-extrabold">Sources</h2>
          <ul className="mt-3 space-y-1.5">
            {BUCKETS.filter((b) => r.byBucket[b]).map((b) => (
              <li key={b}>
                <Link href={href(sp, { src: sp.src === b ? undefined : b })} className="flex items-center gap-2 hover:underline">
                  <span className={`h-2.5 w-2.5 rounded-sm ${TONE[b]}`} />
                  <span className={`flex-1 ${sp.src === b ? "font-extrabold" : ""}`}>{b}</span>
                  <span className="font-bold tabular-nums">{r.byBucket[b]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <h3 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-ink-soft">Detail</h3>
          <ul className="mt-2 space-y-1">
            {r.bySource.map(([s, n]) => (
              <li key={s} className="text-[13px]">
                <div className="flex justify-between gap-2">
                  <span className="truncate">{s}</span>
                  <span className="tabular-nums">{n}</span>
                </div>
                <div className="h-1 rounded bg-cream">
                  <div className="h-1 rounded bg-brand-teal" style={{ width: `${(n / maxSource) * 100}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="min-w-0 rounded-xl border border-line bg-white p-4">
          <h2 className="font-extrabold">By day</h2>
          <ul className="mt-3 space-y-1.5">
            {r.byDay.map(({ day, counts }) => {
              const n = Object.values(counts).reduce((a, b) => a + b, 0);
              return (
                <li key={day} className="flex items-center gap-2 text-[13px]">
                  <span className="w-20 shrink-0 tabular-nums text-ink-soft">{day.slice(5)}</span>
                  <span className="flex h-3 flex-1 overflow-hidden rounded bg-cream">
                    {BUCKETS.map((b) =>
                      counts[b] ? (
                        <span key={b} className={TONE[b]} style={{ width: `${(counts[b] / maxDay) * 100}%` }} title={`${b}: ${counts[b]}`} />
                      ) : null
                    )}
                  </span>
                  <span className="w-6 text-right font-bold tabular-nums">{n}</span>
                </li>
              );
            })}
          </ul>
          <h3 className="mt-4 text-[11px] font-bold uppercase tracking-wider text-ink-soft">Crawlers (pages fetched)</h3>
          <table className="mt-2 w-full text-[13px] tabular-nums">
            <thead className="text-left text-ink-soft">
              <tr><th className="font-semibold">Day</th><th className="text-right font-semibold">Google</th><th className="text-right font-semibold">Bing</th></tr>
            </thead>
            <tbody>
              {r.crawl.map((c) => (
                <tr key={c.day}><td>{c.day.slice(5)}</td><td className="text-right">{c.google}</td><td className="text-right">{c.bing}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="min-w-0 rounded-xl border border-line bg-white p-4">
          <h2 className="font-extrabold">Landing pages</h2>
          <ul className="mt-3 space-y-1 text-[13px]">
            {r.landings.map(([p, n]) => (
              <li key={p} className="flex justify-between gap-2">
                <a href={p} target="_blank" rel="noreferrer" className="truncate text-brand-teal hover:underline">{p}</a>
                <span className="tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="mt-8">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-lg font-extrabold">
            Who did what <span className="font-semibold text-ink-soft">· {list.length} of {total}</span>
          </h2>
          <div className="flex gap-2">
            {sp.src && (
              <Link href={href(sp, { src: undefined })} className="rounded-lg border border-line bg-white px-3 py-1.5 font-bold hover:bg-cream">
                {sp.src} ×
              </Link>
            )}
            <Link
              href={href(sp, { focus: sp.focus === "1" ? undefined : "1" })}
              className={`rounded-lg border border-line px-3 py-1.5 font-bold ${sp.focus === "1" ? "bg-ink text-white" : "bg-white hover:bg-cream"}`}
            >
              Engaged only
            </Link>
          </div>
        </div>
        <ul className="mt-3 space-y-2">
          {list.map((v, i) => (
            <li key={i} className="min-w-0 break-words rounded-xl border border-line bg-white p-3">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                <span className="font-bold">{v.start}</span>
                <span className="text-ink-soft">{v.geo} · {v.device}</span>
                <span className="inline-flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-sm ${TONE[v.bucket]}`} />
                  {v.source}
                </span>
                <span className="tabular-nums text-ink-soft">{dur(v.secs)}</span>
                {v.lead && <span className="rounded bg-meadow px-1.5 text-[12px] font-bold text-white">LEAD</span>}
                {v.call && <span className="rounded bg-brand-teal px-1.5 text-[12px] font-bold text-white">CALL TAP</span>}
                {v.form && !v.lead && <span className="rounded bg-[#b4441f] px-1.5 text-[12px] font-bold text-white">FORM TRIED</span>}
                {v.apply && <span className="rounded bg-sun px-1.5 text-[12px] font-bold">JOB APPLY</span>}
              </div>
              <ol className="mt-2 space-y-0.5 border-l-2 border-line pl-3 text-[13px]">
                {v.steps.map((s, j) =>
                  s.kind === "read" ? (
                    <li key={j}>
                      <span className="text-ink-soft">read </span>
                      <a href={s.path} target="_blank" rel="noreferrer" className="text-brand-teal hover:underline">{s.path}</a>
                      {s.secs != null && <span className="text-ink-soft"> · {dur(s.secs)}, {s.scroll}% down</span>}
                    </li>
                  ) : s.kind === "click" ? (
                    <li key={j} className={s.tag ? "font-bold" : ""}>
                      <span className="text-ink-soft">click </span>“{s.label}”
                    </li>
                  ) : (
                    <li key={j} className="font-bold text-meadow-deep">LEAD sent on {s.path}</li>
                  )
                )}
              </ol>
            </li>
          ))}
        </ul>
        {!list.length && <p className="mt-3 text-ink-soft">Nobody yet in this range.</p>}
      </section>
    </main>
  );
}
