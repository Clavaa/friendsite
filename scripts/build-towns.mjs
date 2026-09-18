#!/usr/bin/env node
/**
 * Generates src/data/towns.json — the town layer under the county pages.
 *
 * Inputs (siblings of this repo, in four-sites/research/):
 * - places_ks_co.json — Census incorporated places with 2024 population
 *   estimates, keyed "Kansas"/"Colorado", names like "Wichita city".
 * - sub-est2024.csv — Census sub-county estimates; the SUMLEV 157
 *   (county-place part) rows map each place to its county. A place that
 *   spans counties is assigned to the county holding its largest
 *   population part.
 *
 * Output shape (per state slug):
 * - towns:  places with pop >= 100 that get their own page at
 *           /{state}/{county}/{town}, sorted by population desc.
 * - tiny:   places with pop < 100 — no page; the county page names them
 *           in a plain-text "every community" line.
 * - cityRedirects: the 10 places that already have first-class city pages
 *           at /{state}/{city}; their would-be town URLs 301 there
 *           (wired in next.config.ts).
 *
 * Special cases:
 * - "Greeley County unified government (balance)" is dropped: it is the
 *   rural remainder of the consolidated city-county, not a community —
 *   Tribune city and Greeley city are separate records that ARE kept.
 * - "Raymer (New Raymer) town" renders as "New Raymer" (the name people
 *   actually use and search).
 *
 * Usage: node scripts/build-towns.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const RESEARCH = join(ROOT, "..", "research");

const MIN_TOWN_POP = 100;
const STATE_FIPS = { Kansas: "20", Colorado: "08" };
const STATE_SLUG = { Kansas: "kansas", Colorado: "colorado" };

/** Places that already have a first-class city page at /{state}/{slug}. */
const CITY_PAGES = {
  kansas: {
    Wichita: "wichita",
    "Overland Park": "overland-park",
    "Kansas City": "kansas-city",
    Olathe: "olathe",
    Topeka: "topeka",
  },
  colorado: {
    Denver: "denver",
    "Colorado Springs": "colorado-springs",
    Aurora: "aurora",
    "Fort Collins": "fort-collins",
    Lakewood: "lakewood",
  },
};

const DROP = new Set(["Greeley County unified government (balance)"]);
const RENAME = { "Raymer (New Raymer) town": "New Raymer" };

function displayName(raw) {
  if (RENAME[raw]) return RENAME[raw];
  return raw.replace(/\s+(city|town|CDP)$/, "");
}

function slugify(name) {
  return name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // Cañon City -> canon-city
    .toLowerCase()
    .replace(/['.]/g, "") // St. Francis -> st-francis
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// ---------------------------------------------------------------------------
// Load inputs
// ---------------------------------------------------------------------------
const places = JSON.parse(
  readFileSync(join(RESEARCH, "places_ks_co.json"), "utf8")
);
const countiesJson = JSON.parse(
  readFileSync(join(ROOT, "src/data/counties.json"), "utf8")
);
const countyByFips = new Map();
for (const list of Object.values(countiesJson)) {
  for (const c of list) countyByFips.set(c.fips, c);
}

// sub-est2024.csv: SUMLEV 162 gives each place's FIPS code; SUMLEV 157
// gives the per-county parts we use to pick the primary county.
const csv = readFileSync(join(RESEARCH, "sub-est2024.csv"), "latin1")
  .split("\n")
  .map((l) => l.split(","));
const header = csv[0];
const col = Object.fromEntries(header.map((h, i) => [h.trim(), i]));

const placeFipsByName = new Map(); // `${state}|${name}` -> place fips
const partsByPlace = new Map(); // `${state}|${placeFips}` -> [{countyFips, pop}]
for (const row of csv.slice(1)) {
  const st = row[col.STATE];
  if (st !== "20" && st !== "08") continue;
  const sumlev = row[col.SUMLEV];
  if (sumlev === "162") {
    placeFipsByName.set(`${st}|${row[col.NAME]}`, row[col.PLACE]);
  } else if (sumlev === "157") {
    const key = `${st}|${row[col.PLACE]}`;
    if (!partsByPlace.has(key)) partsByPlace.set(key, []);
    partsByPlace.get(key).push({
      countyFips: st + row[col.COUNTY],
      pop: Number(row[col.POPESTIMATE2024]),
    });
  }
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
const out = {};
for (const [stateName, list] of Object.entries(places)) {
  const st = STATE_FIPS[stateName];
  const stateSlug = STATE_SLUG[stateName];
  const towns = [];
  const tiny = [];
  const cityRedirects = [];

  for (const p of list) {
    if (DROP.has(p.place)) continue;
    const placeFips = placeFipsByName.get(`${st}|${p.place}`);
    if (!placeFips) throw new Error(`No SUMLEV 162 row for ${p.place}`);
    const parts = partsByPlace.get(`${st}|${placeFips}`);
    if (!parts) throw new Error(`No SUMLEV 157 rows for ${p.place}`);
    const primary = parts.reduce((a, b) => (b.pop > a.pop ? b : a));
    const county = countyByFips.get(primary.countyFips);
    if (!county) throw new Error(`No county ${primary.countyFips}`);

    const name = displayName(p.place);
    const entry = {
      name,
      slug: slugify(name),
      pop: p.pop,
      county: county.slug,
    };
    if (CITY_PAGES[stateSlug][name]) {
      cityRedirects.push({
        county: county.slug,
        slug: entry.slug,
        city: CITY_PAGES[stateSlug][name],
      });
    } else if (p.pop >= MIN_TOWN_POP) {
      towns.push(entry);
    } else {
      tiny.push(entry);
    }
  }

  towns.sort((a, b) => b.pop - a.pop || a.name.localeCompare(b.name));
  tiny.sort((a, b) => a.name.localeCompare(b.name));

  // Guardrail: slugs must be unique within a county (pages nest under the
  // county, so cross-county repeats are fine by construction).
  const seen = new Set();
  for (const t of [...towns, ...cityRedirects]) {
    const key = `${t.county}/${t.slug}`;
    if (seen.has(key)) throw new Error(`Within-county slug collision: ${key}`);
    seen.add(key);
  }

  out[stateSlug] = { towns, tiny, cityRedirects };
  console.log(
    `${stateSlug}: ${towns.length} town pages, ${tiny.length} tiny places, ${cityRedirects.length} city redirects`
  );
}

writeFileSync(
  join(ROOT, "src/data/towns.json"),
  JSON.stringify(out, null, 1) + "\n"
);
console.log("Wrote src/data/towns.json");
