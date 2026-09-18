import type { MetadataRoute } from "next";
import { siteConfig, stateSlugs, type StateSlug } from "../../site.config";
import { guides } from "../data/guides";
import { questionPages } from "../data/questions";
import { services } from "../data/services";
import { countiesByState } from "../data/counties";
import { townsByState } from "../data/towns";

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
  ];
}

export default function sitemap({
  id,
}: {
  id: ShardId;
}): MetadataRoute.Sitemap {
  const base = siteConfig.domain;
  const now = new Date();

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
        ]
      : statePaths(id);

  return paths.map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
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
