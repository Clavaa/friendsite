import { query, type Row } from "./bqRead";

/**
 * The visitor report behind /admin — the same rules as tools/daily.py:
 * humans only, NY/NJ (team locations) hidden unless asked, and a visitor
 * only counts if they closed a page, clicked, arrived with a referrer or
 * sent a lead (the one-page scraper waves do none of those).
 */

const T = "`sproutwell-aba-260907.sunbird_traffic.events`";
const TZ = "America/New_York";
const HUMAN = "NOT is_bot AND NOT is_internal AND ua NOT LIKE '%moto g power%'";
const SKIP_REGIONS = ["NY", "NJ"];
const WORK_TOOLS = ["clickup", "teams.", "syniverse", "affirm.lightning", "slack", "notion", "centralreach", "waystar"];
const MARKETING_HOSTS = ["therapy.sunbirdaba.com", "211", "unitedway"];

export const BUCKETS = ["SEO", "Marketing", "Direct / unknown", "Other referral", "Work tools (staff/partners)"] as const;
export type Bucket = (typeof BUCKETS)[number];

export type Step =
  | { kind: "read"; path: string; secs: number | null; scroll: number | null }
  | { kind: "click"; label: string; path: string; tag: "call" | "form" | "apply" | null }
  | { kind: "lead"; path: string };

export type Visitor = {
  start: string;
  day: string;
  geo: string;
  device: string;
  source: string;
  bucket: Bucket;
  secs: number;
  steps: Step[];
  lead: boolean;
  call: boolean;
  form: boolean;
  apply: boolean;
};

export type Report = {
  days: number;
  includeAll: boolean;
  visitors: Visitor[];
  hidden: number;
  byBucket: Record<Bucket, number>;
  bySource: [string, number][];
  byDay: { day: string; counts: Record<Bucket, number> }[];
  landings: [string, number][];
  crawl: { day: string; google: number; bing: number }[];
};

function bucketOf(r: Row): Bucket {
  const g = r.source_group ?? "";
  const host = (r.referrer_host ?? "").toLowerCase();
  const us = (r.utm_source ?? "").toLowerCase();
  if (WORK_TOOLS.some((w) => host.includes(w))) return "Work tools (staff/partners)";
  if (["Google organic", "Bing", "Other search", "AI assistant"].includes(g)) return "SEO";
  if (
    g.startsWith("Paid") ||
    ["Social", "Email", "Campaign", "Google Business Profile"].includes(g) ||
    MARKETING_HOSTS.some((m) => host.includes(m) || us.includes(m))
  )
    return "Marketing";
  if (g === "Direct / app") return "Direct / unknown";
  return "Other referral";
}

function sourceOf(r: Row): string {
  const host = (r.referrer_host ?? "").replace("www.", "");
  const g = r.source_group ?? "Unknown";
  if (r.utm_source) return `${g} (${r.utm_source.toLowerCase()}${host ? ` / ${host}` : ""})`;
  if (["Google organic", "Bing", "Other search", "Direct / app"].includes(g)) return g;
  return host ? `${g} (${host})` : g;
}

function clickTag(label: string): "call" | "form" | "apply" | null {
  if (label.includes("tel:")) return "call";
  if (/mailto:.*careers/i.test(label) || /^apply as/i.test(label)) return "apply";
  if (/^(match me with|ask the team|help me get an evaluation)/i.test(label)) return "form";
  return null;
}

const tally = <K extends string>(keys: readonly K[]) =>
  Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;

export async function buildReport(days: number, includeAll: boolean): Promise<Report> {
  const since = `TIMESTAMP(DATE_SUB(CURRENT_DATE('${TZ}'), INTERVAL ${days - 1} DAY), '${TZ}')`;
  const [rows, crawlRows] = await Promise.all([
    query(`
      SELECT FORMAT_TIMESTAMP('%Y-%m-%d', ts, '${TZ}') d, FORMAT_TIMESTAMP('%a %b %e, %l:%M %p', ts, '${TZ}') t,
             visitor, kind, path, title, referrer_host, source_group, utm_source,
             region, country, device, dwell_ms, scroll_pct
      FROM ${T}
      WHERE ts >= ${since} AND kind IN ('view','leave','click','lead') AND ${HUMAN}
      ORDER BY ts`),
    query(`
      SELECT FORMAT_DATE('%Y-%m-%d', DATE(ts, '${TZ}')) d,
             COUNT(DISTINCT IF(bot_name = 'Googlebot', path, NULL)) google,
             COUNT(DISTINCT IF(bot_name = 'Bingbot', path, NULL)) bing
      FROM ${T}
      WHERE ts >= ${since} AND kind = 'crawl'
      GROUP BY d ORDER BY d DESC`),
  ]);

  const people = new Map<string, Row[]>();
  for (const r of rows) {
    const id = r.visitor ?? "?";
    if (!people.has(id)) people.set(id, []);
    people.get(id)!.push(r);
  }

  const visitors: Visitor[] = [];
  let hidden = 0;
  for (const ev of people.values()) {
    const real = ev.some((e) => e.kind !== "view" || e.referrer_host);
    if (!real) continue;
    const head = ev[0];
    if (!includeAll && head.country === "US" && SKIP_REGIONS.includes(head.region ?? "")) {
      hidden++;
      continue;
    }
    const first = ev.find((e) => e.kind === "view") ?? head;

    const dwell = new Map<string, number>();
    const scroll = new Map<string, number>();
    let secs = 0;
    for (const e of ev) {
      if (e.kind !== "leave") continue;
      const s = Math.round(Number(e.dwell_ms ?? 0) / 1000);
      secs += s;
      dwell.set(e.path!, (dwell.get(e.path!) ?? 0) + s);
      scroll.set(e.path!, Math.max(scroll.get(e.path!) ?? 0, Number(e.scroll_pct ?? 0)));
    }

    const steps: Step[] = [];
    const seen = new Set<string>();
    let prev = "";
    for (const e of ev) {
      const path = e.path ?? "";
      if (e.kind === "click") {
        const label = e.title ?? "";
        if (`${label}|${path}` === prev) continue; // an FAQ toggle can report twice
        prev = `${label}|${path}`;
        steps.push({ kind: "click", label, path, tag: clickTag(label) });
        continue;
      }
      prev = "";
      if (e.kind === "lead") steps.push({ kind: "lead", path });
      else if (!seen.has(path)) {
        seen.add(path);
        steps.push({ kind: "read", path, secs: dwell.get(path) ?? null, scroll: scroll.get(path) ?? null });
      }
    }

    const clicks = steps.filter((s): s is Extract<Step, { kind: "click" }> => s.kind === "click");
    visitors.push({
      start: head.t ?? "",
      day: head.d ?? "",
      geo: (head.country === "US" ? head.region : head.country) ?? "?",
      device: first.device ?? "?",
      source: sourceOf(first),
      bucket: bucketOf(first),
      secs,
      steps,
      lead: ev.some((e) => e.kind === "lead"),
      call: clicks.some((c) => c.tag === "call"),
      form: clicks.some((c) => c.tag === "form"),
      apply: clicks.some((c) => c.tag === "apply"),
    });
  }
  visitors.reverse(); // newest first

  const byBucket = tally(BUCKETS);
  const sources = new Map<string, number>();
  const landings = new Map<string, number>();
  const dayMap = new Map<string, Record<Bucket, number>>();
  for (const v of visitors) {
    byBucket[v.bucket]++;
    sources.set(v.source, (sources.get(v.source) ?? 0) + 1);
    const land = v.steps.find((s) => s.kind === "read");
    if (land && land.kind === "read") landings.set(land.path, (landings.get(land.path) ?? 0) + 1);
    if (!dayMap.has(v.day)) dayMap.set(v.day, tally(BUCKETS));
    dayMap.get(v.day)![v.bucket]++;
  }
  const sortDesc = (m: Map<string, number>) => [...m.entries()].sort((a, b) => b[1] - a[1]);

  return {
    days,
    includeAll,
    visitors,
    hidden,
    byBucket,
    bySource: sortDesc(sources),
    byDay: [...dayMap.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([day, counts]) => ({ day, counts })),
    landings: sortDesc(landings).slice(0, 12),
    crawl: crawlRows.map((r) => ({ day: r.d ?? "", google: Number(r.google), bing: Number(r.bing) })),
  };
}
