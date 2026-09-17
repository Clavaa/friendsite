import { NextRequest, NextResponse } from "next/server";
import { GoogleAuth } from "google-auth-library";
import { siteConfig } from "../../../../site.config";
import {
  classifyBot,
  classifySource,
  deviceOf,
  hostOf,
  visitorId,
} from "../../../lib/traffic";

/**
 * Traffic beacon receiver (first-party — no GA, no cookies, no third party).
 *
 * Three event kinds arrive here: a "view" when a page loads, a "leave" when
 * the tab is hidden or unloaded (carrying how long the page was actually
 * visible), and a "lead" fired on form-submit success. Dwell time is the one
 * number a server log physically cannot give you, which is why this is a
 * beacon and not middleware.
 *
 * Rows go straight to BigQuery (sproutwell-aba-260907.sunbird_traffic.events)
 * via the streaming insert API. Nothing is stored that identifies a person:
 * no cookie is set, the IP is hashed with a daily-rotating salt and then
 * discarded, and we keep country and region rather than a location. The
 * "lead" event carries NO form contents — only that a form on this path
 * succeeded (PHI rule).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PROJECT = "sproutwell-aba-260907";
const TABLE = `https://bigquery.googleapis.com/bigquery/v2/projects/${PROJECT}/datasets/sunbird_traffic/tables/events/insertAll`;

let auth: GoogleAuth | null = null;
function getAuth(): GoogleAuth | null {
  if (auth) return auth;
  const raw = process.env.GCP_TRAFFIC_SA;
  if (!raw) return null;
  auth = new GoogleAuth({
    credentials: JSON.parse(raw),
    scopes: ["https://www.googleapis.com/auth/bigquery.insertdata"],
  });
  return auth;
}

function str(v: unknown, max = 512): string | null {
  if (typeof v !== "string") return null;
  const s = v.trim().slice(0, max);
  return s.length ? s : null;
}
function int(v: unknown, max: number): number | null {
  const n = typeof v === "number" ? v : Number(v);
  if (!Number.isFinite(n) || n < 0) return null;
  return Math.min(Math.round(n), max);
}

export async function POST(req: NextRequest) {
  // Always 204 — a beacon must never surface an error to a visitor's browser,
  // and must never tell a prober whether ingestion is configured.
  const ok = new NextResponse(null, { status: 204 });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return ok;
  }

  const ua = req.headers.get("user-agent") ?? "";
  const bot = classifyBot(ua);

  const path = str(body.p, 300);
  if (!path || !path.startsWith("/")) return ok;

  const kind = body.k === "leave" ? "leave" : body.k === "lead" ? "lead" : "view";
  const referrer = str(body.r, 500);
  const referrerHost = hostOf(referrer);
  const selfHost = hostOf(siteConfig.domain) ?? "sunbirdaba.com";

  const utmSource = str(body.us, 100);
  const utmMedium = str(body.um, 100);
  const utmCampaign = str(body.uc, 100);

  /* Vercel gives geo + a trustworthy client IP in headers. The IP is used to
     derive the daily hash and is never written anywhere. */
  const ip =
    req.headers.get("x-real-ip") ??
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    "0.0.0.0";
  const day = new Date().toISOString().slice(0, 10);
  const salt = process.env.TRAFFIC_SALT ?? "unsalted-dev";

  const row = {
    ts: new Date().toISOString(),
    visitor: visitorId(ip, ua, salt, day),
    session: str(body.s, 64),
    kind,
    path,
    title: str(body.t, 200),
    referrer,
    referrer_host: referrerHost,
    source_group: classifySource(referrerHost, utmMedium, utmSource, selfHost),
    utm_source: utmSource,
    utm_medium: utmMedium,
    utm_campaign: utmCampaign,
    ua: ua.slice(0, 400),
    is_bot: bot.isBot,
    bot_name: bot.name,
    is_internal: body.i === true,
    country: req.headers.get("x-vercel-ip-country"),
    region: req.headers.get("x-vercel-ip-country-region"),
    device: deviceOf(ua),
    dwell_ms: kind === "leave" ? int(body.d, 6 * 60 * 60 * 1000) : null,
    scroll_pct: int(body.sc, 100),
    entry: body.e === true,
  };

  try {
    const a = getAuth();
    if (!a) return ok;
    const client = await a.getClient();
    const token = (await client.getAccessToken()).token;
    if (!token) return ok;
    await fetch(TABLE, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        skipInvalidRows: true,
        ignoreUnknownValues: true,
        rows: [{ json: row }],
      }),
    });
  } catch {
    /* Analytics must never break a page view. Swallow and move on. */
  }
  return ok;
}
