import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

/**
 * Crawler log. Pages are prerendered and served from Vercel's CDN, so no
 * server log ever sees Googlebot, and crawlers don't run the JS beacon.
 * This middleware spots crawler user agents on every request and hands the
 * hit to /api/crawl (after the response, via waitUntil — zero added
 * latency for the crawler, nothing at all for people).
 */

const CRAWLER =
  /googlebot|google-inspectiontool|storebot-google|adsbot-google|mediapartners-google|google-extended|googleother|bingbot|adidxbot|applebot|duckduckbot|yandex|baiduspider|gptbot|oai-searchbot|chatgpt-user|claudebot|perplexitybot|ccbot|meta-externalagent|ahrefsbot|semrushbot/i;

export function middleware(req: NextRequest, event: NextFetchEvent) {
  const ua = req.headers.get("user-agent") ?? "";
  const key = process.env.TRAFFIC_SALT;
  if (key && CRAWLER.test(ua)) {
    event.waitUntil(
      fetch(new URL("/api/crawl", req.url), {
        method: "POST",
        headers: { "content-type": "application/json", "x-crawl-key": key },
        body: JSON.stringify({
          p: req.nextUrl.pathname + (req.nextUrl.search || ""),
          ua,
          ip:
            req.headers.get("x-real-ip") ??
            req.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
            null,
          country: req.headers.get("x-vercel-ip-country"),
          region: req.headers.get("x-vercel-ip-country-region"),
        }),
      }).catch(() => {})
    );
  }
  return NextResponse.next();
}

export const config = {
  // Everything except Next internals and our own API routes — sitemaps,
  // robots.txt and images included, since crawlers fetch those too.
  matcher: ["/((?!_next/|api/).*)"],
};
