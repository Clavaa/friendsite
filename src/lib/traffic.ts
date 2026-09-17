import crypto from "node:crypto";

/**
 * Classification and hashing for the first-party traffic beacon.
 * Ported from the sproutwell (aba-national) implementation so both sites
 * classify identically and reports stay comparable.
 *
 * Two rules shape everything here:
 *   1. No cookies, no raw IP, no PII. The visitor id is a hash of IP + user
 *      agent + a salt that rotates every day, so daily uniques are countable
 *      and nobody can be followed from one day to the next.
 *   2. Bots are recorded, not dropped. "Human only" is then a query-time
 *      filter, because crawler activity is worth seeing on an SEO build,
 *      just never mixed into a visitor count.
 */

const BOTS: [RegExp, string][] = [
  [/googlebot|google-inspectiontool|storebot-google/i, "Googlebot"],
  [/bingbot|adidxbot/i, "Bingbot"],
  [/applebot/i, "Applebot"],
  [/duckduckbot/i, "DuckDuckBot"],
  [/yandex(bot|images)/i, "YandexBot"],
  [/baiduspider/i, "Baiduspider"],
  [/gptbot|oai-searchbot|chatgpt-user/i, "OpenAI"],
  [/claudebot|anthropic-ai|claude-web/i, "Anthropic"],
  [/perplexitybot|perplexity-user/i, "Perplexity"],
  [/ccbot/i, "CommonCrawl"],
  [/meta-externalagent|meta-externalfetcher|facebookbot/i, "Meta AI crawler"],
  [/bytespider|amazonbot|youbot|diffbot|timpibot|omgili|imagesiftbot/i, "AI crawler"],
  [/ahrefsbot/i, "AhrefsBot"],
  [/semrushbot/i, "SemrushBot"],
  [/mj12bot|dotbot|petalbot|dataforseo|screaming frog|serpstat|blexbot/i, "SEO crawler"],
  [/facebookexternalhit|twitterbot|linkedinbot|slackbot|discordbot|whatsapp|telegrambot|embedly|pinterest/i, "Link preview"],
  [/\(compatible;\s*meta-/i, "Meta AI crawler"],
  [/uptimerobot|pingdom|statuscake|betteruptime|vercel-screenshot|vercel favicon/i, "Monitor"],
  [/headlesschrome|puppeteer|playwright|phantomjs|selenium/i, "Headless browser"],
  [/bot\b|crawler|spider|scrape|curl\/|wget\/|python-requests|axios\/|go-http-client|java\/|okhttp/i, "Other bot"],
];

export function classifyBot(ua: string): { isBot: boolean; name: string | null } {
  for (const [re, name] of BOTS) if (re.test(ua)) return { isBot: true, name };
  // Anything that never claims to be a browser engine is not a person.
  if (!/mozilla\/|opera\//i.test(ua)) return { isBot: true, name: "Unknown agent" };
  return { isBot: false, name: null };
}

/** Where the visit came from, in the buckets a person actually asks about. */
export function classifySource(
  referrerHost: string | null,
  utmMedium: string | null,
  utmSource: string | null,
  selfHost: string
): string {
  const m = (utmMedium ?? "").toLowerCase();
  if (m === "email" || m === "e-mail") return "Email";
  if (m === "cpc" || m === "ppc" || m === "paid" || m === "paid_search") return "Paid search";
  if (utmSource && !referrerHost) return "Campaign";
  if (!referrerHost) return "Direct / app";
  const h = referrerHost.toLowerCase().replace(/^www\./, "");
  if (h === selfHost.replace(/^www\./, "")) return "Internal";
  if (/(^|\.)google\./.test(h) || h === "googleusercontent.com") return "Google organic";
  if (/(^|\.)bing\.com$/.test(h)) return "Bing";
  if (/(^|\.)(duckduckgo|ecosia|brave|startpage|yahoo|yandex|baidu)\./.test(h)) return "Other search";
  if (/(^|\.)(chatgpt|openai|perplexity|claude|copilot|gemini)\./.test(h)) return "AI assistant";
  if (/(^|\.)(facebook|instagram|threads|x|twitter|t|linkedin|reddit|pinterest|tiktok|youtube)\./.test(h))
    return "Social";
  if (/(^|\.)(mail|outlook|webmail)\./.test(h)) return "Email";
  return "Referral";
}

export function deviceOf(ua: string): string {
  if (/ipad|tablet|playbook|silk/i.test(ua)) return "Tablet";
  if (/mobi|iphone|android.*mobile|windows phone/i.test(ua)) return "Mobile";
  return "Desktop";
}

/**
 * Daily-rotating pseudonymous visitor id. The salt changes at UTC midnight,
 * so the same person is one visitor within a day and unlinkable across days.
 */
export function visitorId(ip: string, ua: string, salt: string, day: string): string {
  return crypto.createHash("sha256").update(`${day}|${salt}|${ip}|${ua}`).digest("hex").slice(0, 24);
}

export function hostOf(url: string | null): string | null {
  if (!url) return null;
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
}
