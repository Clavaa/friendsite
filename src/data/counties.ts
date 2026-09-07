import type { StateSlug } from "../../site.config";
import countiesJson from "./counties.json";

/**
 * County dataset for the /kansas/[county] and /colorado/[county] pages.
 *
 * Source: research/counties.json (Census county list + population),
 * enriched with the Census county-adjacency file:
 * - `neighbors`: 5-8 same-state neighboring counties (direct-adjacency
 *   first, padded with second-ring neighbors for corner/border counties).
 * - `nearestCity`: the served city page whose home county is the fewest
 *   county-hops away (`hops` retained so copy can soften for far counties).
 *
 * Slugs are the kebab-case county name with the " County" suffix stripped;
 * where that collides with an existing city page slug (Wichita County, KS
 * and Denver County, CO), the slug keeps a `-county` suffix.
 */

export interface CountyEntry {
  /** Name without the " County" suffix, e.g. "Johnson". */
  name: string;
  /** Full display name, e.g. "Johnson County". */
  full: string;
  slug: string;
  fips: string;
  pop: number;
  nearestCity: { slug: string; name: string; hops: number } | null;
  neighbors: string[];
}

export const countiesByState = countiesJson as Record<StateSlug, CountyEntry[]>;

const lookup: Record<StateSlug, Map<string, CountyEntry>> = {
  kansas: new Map(countiesByState.kansas.map((c) => [c.slug, c])),
  colorado: new Map(countiesByState.colorado.map((c) => [c.slug, c])),
};

export function getCounty(
  state: StateSlug,
  slug: string
): CountyEntry | undefined {
  return lookup[state].get(slug);
}

/** Format a population with thousands separators, e.g. 632,276. */
export function formatPop(pop: number): string {
  return pop.toLocaleString("en-US");
}
