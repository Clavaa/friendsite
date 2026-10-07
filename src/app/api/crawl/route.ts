import { promises as dns } from "node:dns";
import { NextRequest, NextResponse } from "next/server";
import { insertRow } from "../../../lib/bq";
import { classifyBot } from "../../../lib/traffic";

/**
 * Receives crawler hits from src/middleware.ts and writes them to BigQuery
 * as kind="crawl". Googlebot and Bingbot are verified the way Google and
 * Microsoft document it: reverse DNS must land on googlebot.com /
 * google.com / search.msn.com, and the forward lookup must return the same
 * IP. Spoofed crawlers are logged as "(unverified)". The IP is used only
 * for the check and is never stored.
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const VERIFY: [RegExp, RegExp][] = [
  [/^Googlebot$/, /\.(googlebot|google)\.com$/],
  [/^Bingbot$/, /\.search\.msn\.com$/],
];

async function verified(ip: string, suffix: RegExp): Promise<boolean> {
  try {
    const hosts = await dns.reverse(ip);
    for (const h of hosts) {
      if (!suffix.test(h)) continue;
      const fwd = await dns.lookup(h, { all: true });
      if (fwd.some((a) => a.address === ip)) return true;
    }
  } catch {
    /* lookup failure = unverified */
  }
  return false;
}

export async function POST(req: NextRequest) {
  const ok = new NextResponse(null, { status: 204 });
  if (!process.env.TRAFFIC_SALT || req.headers.get("x-crawl-key") !== process.env.TRAFFIC_SALT) return ok;

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return ok;
  }
  const ua = typeof body.ua === "string" ? body.ua.slice(0, 400) : "";
  const path = typeof body.p === "string" ? body.p.slice(0, 300) : null;
  if (!path) return ok;

  let name = classifyBot(ua).name ?? "Other bot";
  const ip = typeof body.ip === "string" ? body.ip : null;
  for (const [nameRe, suffix] of VERIFY) {
    if (nameRe.test(name)) {
      if (!ip || !(await verified(ip, suffix))) name = `${name} (unverified)`;
    }
  }

  await insertRow({
    ts: new Date().toISOString(),
    kind: "crawl",
    path,
    ua,
    is_bot: true,
    bot_name: name,
    is_internal: false,
    country: typeof body.country === "string" ? body.country : null,
    region: typeof body.region === "string" ? body.region : null,
    entry: false,
  });
  return ok;
}
