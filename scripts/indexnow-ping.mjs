#!/usr/bin/env node
/**
 * IndexNow ping — tells Bing/Seznam/Yandex (and via them, everyone in the
 * IndexNow network) which URLs exist or changed. No account needed: the
 * key file at /<key>.txt on the host proves ownership.
 *
 * Usage:
 *   npm run seo:indexnow                     # pings the default host
 *   npm run seo:indexnow -- --host=sunbirdaba.com
 *
 * Default host is the Vercel deployment (aba-ks-co.vercel.app) until
 * sunbirdaba.com DNS is live; then pass --host=sunbirdaba.com (or flip
 * the DEFAULT_HOST below).
 *
 * URL list is built from the same data the sitemap uses (static pages,
 * state/city/county pages, services, questions). IndexNow accepts up to
 * 10,000 URLs per POST, so one request covers the whole site.
 */

import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------
const DEFAULT_HOST = "aba-ks-co.vercel.app";

const hostArg = process.argv
  .find((a) => a.startsWith("--host="))
  ?.slice("--host=".length);
const host = (hostArg || DEFAULT_HOST).replace(/^https?:\/\//, "").replace(/\/$/, "");
const base = `https://${host}`;

// The key is whatever /public/<32hex>.txt we ship.
const keyFile = readdirSync(join(ROOT, "public")).find((f) =>
  /^[0-9a-f]{32}\.txt$/.test(f)
);
if (!keyFile) {
  console.error("No IndexNow key file (public/<32-hex>.txt) found.");
  process.exit(1);
}
const key = readFileSync(join(ROOT, "public", keyFile), "utf8").trim();

// ---------------------------------------------------------------------------
// URL list — mirrors src/app/sitemap.ts without importing TS. We read the
// slugs straight out of the data files with light regex extraction so the
// script needs no build step.
// ---------------------------------------------------------------------------
function extractSlugs(file) {
  const src = readFileSync(join(ROOT, file), "utf8");
  return [...src.matchAll(/slug:\s*"([^"]+)"/g)].map((m) => m[1]);
}

const staticPaths = [
  "",
  "/services",
  "/get-a-diagnosis",
  "/insurance",
  "/getting-started",
  "/questions",
  "/about",
  "/careers",
];

// States + their cities from site.config.ts
const siteConfigSrc = readFileSync(join(ROOT, "site.config.ts"), "utf8");
const statePaths = [];
for (const state of ["kansas", "colorado"]) {
  statePaths.push(`/${state}`);
  const stateBlock = siteConfigSrc.slice(siteConfigSrc.indexOf(`${state}: {`));
  const citiesBlock = stateBlock.slice(
    stateBlock.indexOf("cities:"),
    stateBlock.indexOf("]", stateBlock.indexOf("cities:"))
  );
  for (const m of citiesBlock.matchAll(/slug:\s*"([^"]+)"/g)) {
    statePaths.push(`/${state}/${m[1]}`);
  }
}

// Counties from src/data/counties.json (keyed by state slug)
const counties = JSON.parse(
  readFileSync(join(ROOT, "src/data/counties.json"), "utf8")
);
for (const [state, list] of Object.entries(counties)) {
  for (const c of list) {
    if (c.slug) statePaths.push(`/${state}/${c.slug}`);
  }
}

const servicePaths = extractSlugs("src/data/services.ts").map(
  (s) => `/services/${s}`
);
const questionPaths = extractSlugs("src/data/questions.ts").map(
  (s) => `/questions/${s}`
);

const urlList = [
  ...new Set(
    [...staticPaths, ...statePaths, ...servicePaths, ...questionPaths].map(
      (p) => `${base}${p}`
    )
  ),
];

// ---------------------------------------------------------------------------
// POST to IndexNow
// ---------------------------------------------------------------------------
const payload = {
  host,
  key,
  keyLocation: `${base}/${key}.txt`,
  urlList,
};

console.log(`Pinging IndexNow for ${host} with ${urlList.length} URLs…`);
const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify(payload),
});

const body = await res.text();
console.log(`HTTP ${res.status} ${res.statusText}`);
if (body) console.log(body);

// 200 = OK, 202 = accepted (key validation pending) — both are success.
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
