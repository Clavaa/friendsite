import type { MetadataRoute } from "next";
import { siteConfig, stateSlugs, type StateSlug } from "../../site.config";
import { guides } from "../data/guides";
import { questionPages } from "../data/questions";
import { services } from "../data/services";
import { countiesByState } from "../data/counties";
import { townsByState } from "../data/towns";
import { CITY_JOBS, CITY_SERVICES, cityZips } from "../lib/metro";
import { districtsIn } from "../lib/schools";

/**
 * Sharded sitemap — /sitemap/core.xml (static + services + questions +
 * guides), /sitemap/kansas.xml and /sitemap/colorado.xml (state, city,
 * county, and town pages). Sharding keeps each file small as the town
 * layer grows (~600 URLs for Kansas, ~320 for Colorado — nowhere near
 * the 50k/50MB limits, with headroom for future layers). robots.ts lists
 * all three; the legacy /sitemap.xml redirects to the core shard.
 */

const SHARDS = ["core", ...stateSlugs] as const;
type ShardId = (typeof SHARDS)[number];

export function generateSitemaps(): { id: ShardId }[] {
  return SHARDS.map((id) => ({ id }));
}

function statePaths(state: StateSlug): string[] {
  return [
    `/${state}`,
    ...siteConfig.states[state].cities.map((c) => `/${state}/${c.slug}`),
    ...countiesByState[state].map((c) => `/${state}/${c.slug}`),
    ...townsByState[state].towns.map((t) => `/${state}/${t.county}/${t.slug}`),
    ...siteConfig.states[state].cities.flatMap((c) => [
      ...CITY_SERVICES.map((s) => `/${state}/${c.slug}/${s.slug}`),
      ...cityZips(state, c.slug).map(([zip]) => `/${state}/${c.slug}/${zip}`),
    ]),
    `/${state}/schools`,
    ...districtsIn(state).map(([slug]) => `/${state}/schools/${slug}`),
  ];
}

/**
 * Honest <lastmod> dates. Google only trusts lastmod when it matches real
 * content changes — stamping every URL with the build time (the old
 * `new Date()`) trains it to ignore the field (Gary Illyes: better no date
 * than a wrong one). Bump the matching constant whenever that layer's
 * content actually changes.
 */
const LASTMOD = {
  /** Local layer: data-rich rebuild 10/5, CTR titles + team copy 10/6. */
  local: "2026-10-06",
  /** Services, guides, questions: CTR titles/descriptions + service FAQs 10/6. */
  core: "2026-10-06",
  /** Big-city layer: team-city hubs, ZIP area pages, city×service pages,
   *  city job pages (careers hub links them too). */
  metro: "2026-10-08",
} as const;

const CITY_PREFIXES = stateSlugs.flatMap((st) =>
  siteConfig.states[st].cities.map((c) => `/${st}/${c.slug}`)
);
function lastmodFor(path: string, id: string): string {
  if (path.startsWith("/careers") || path.includes("/schools")) return LASTMOD.metro;
  if (CITY_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`))) return LASTMOD.metro;
  return id === "core" ? LASTMOD.core : LASTMOD.local;
}

export default function sitemap({
  id,
}: {
  id: ShardId;
}): MetadataRoute.Sitemap {
  const base = siteConfig.domain;

  const paths: string[] =
    id === "core"
      ? [
          "",
          "/services",
          "/get-a-diagnosis",
          "/insurance",
          "/getting-started",
          "/questions",
          "/resources",
          "/about",
          "/careers",
          ...services.map((s) => `/services/${s.slug}`),
          ...questionPages.map((q) => `/questions/${q.slug}`),
          ...guides.map((g) => `/resources/${g.slug}`),
          ...CITY_JOBS.map((j) => `/careers/${j.slug}`),
        ]
      : statePaths(id);

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: lastmodFor(path, id),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority:
      path === ""
        ? 1
        : path.split("/").length > 3
          ? 0.6
          : path.split("/").length > 2
            ? 0.7
            : 0.8,
  }));
}
