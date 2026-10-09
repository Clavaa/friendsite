import { siteConfig, stateSlugs, type StateSlug } from "../../site.config";
import metroJson from "../data/metro.json";
import type { LocalStats } from "./local";

/**
 * Big-city layer (scripts/build_metro.py → src/data/metro.json): ZIP-code
 * area pages inside the 10 team cities, plus the city×service and city job
 * page definitions. Routes:
 *   /{state}/{city}/{zip}          ZIP area page (ZipView)
 *   /{state}/{city}/{service}      city service page (CityServiceView)
 *   /careers/{rbt|bcba}-jobs-{city} city job page
 */

export interface ZipRecord {
  stats: LocalStats | null;
  landSqMi: number;
  neighborhoods: string[];
  nearbyZips: { zip: string; miles: number }[];
  otherTowns: { path: string; name: string }[];
}

const metro = metroJson as unknown as Record<StateSlug, Record<string, Record<string, ZipRecord>>>;

export function cityZips(state: StateSlug, city: string): [string, ZipRecord][] {
  return Object.entries(metro[state]?.[city] ?? {});
}

export function zipRecord(state: StateSlug, city: string, zip: string): ZipRecord | undefined {
  return metro[state]?.[city]?.[zip];
}

export function isZip(s: string): boolean {
  return /^\d{5}$/.test(s);
}

/** "Denver 80205" + "City Park, Five Points & Cole" when names exist. */
export function zipLabel(rec: ZipRecord, n = 3): string | null {
  const h = rec.neighborhoods.slice(0, n);
  if (!h.length) return null;
  if (h.length === 1) return h[0];
  return `${h.slice(0, -1).join(", ")} & ${h[h.length - 1]}`;
}

// ————————————————————— city × service pages —————————————————————

export interface CityService {
  slug: string;
  /** Linked /services/* page. */
  serviceSlug: string | null;
  label: string;
  /** H1 (sentence case, site style) with {city}. */
  h1: string;
  /** SERP title (title case) with {city}; brand appended when it fits. */
  title: string;
}

export const CITY_SERVICES: CityService[] = [
  { slug: "in-home-aba-therapy", serviceSlug: "in-home-aba", label: "In-home ABA therapy", h1: "In-home ABA therapy in {city}", title: "In-Home ABA Therapy in {city}" },
  { slug: "autism-evaluation", serviceSlug: null, label: "Autism evaluation help", h1: "Autism testing in {city}: how to get an evaluation", title: "Autism Testing in {city}: Get an Evaluation" },
  { slug: "daycare-aba", serviceSlug: "daycare-based", label: "ABA at daycare", h1: "ABA therapy at daycare in {city}", title: "ABA Therapy at Daycare in {city}" },
  { slug: "parent-training", serviceSlug: "parent-training", label: "ABA parent training", h1: "ABA parent training in {city}", title: "ABA Parent Training in {city}" },
];

export function getCityService(slug: string): CityService | undefined {
  return CITY_SERVICES.find((s) => s.slug === slug);
}

// ————————————————————— city job pages —————————————————————

export type JobRole = "rbt" | "bcba";

export interface CityJob {
  slug: string;
  role: JobRole;
  state: StateSlug;
  city: { name: string; slug: string };
}

export const CITY_JOBS: CityJob[] = stateSlugs.flatMap((state) =>
  siteConfig.states[state].cities.flatMap((c) =>
    (["rbt", "bcba"] as JobRole[]).map((role) => ({
      slug: `${role}-jobs-${c.slug}`,
      role,
      state,
      city: { name: c.name, slug: c.slug },
    }))
  )
);

export function getCityJob(slug: string): CityJob | undefined {
  return CITY_JOBS.find((j) => j.slug === slug);
}

export function cityJobsFor(state: StateSlug, city: string): CityJob[] {
  return CITY_JOBS.filter((j) => j.state === state && j.city.slug === city);
}
