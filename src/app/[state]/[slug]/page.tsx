import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig, isStateSlug, stateSlugs } from "../../../../site.config";
import { countiesByState, formatPop, getCounty } from "../../../data/counties";
import CityView from "./CityView";
import CountyView from "./CountyView";

/**
 * One dynamic segment under /[state]/ resolves BOTH kinds of pages:
 * - City pages (/kansas/wichita) — the five served cities per state.
 * - County pages (/kansas/johnson, /colorado/el-paso) — all 105 KS + 64 CO
 *   counties. County slugs are the kebab-case name minus " County"; the two
 *   collisions with city slugs (Wichita County KS, Denver County CO) carry
 *   a "-county" suffix (see src/data/counties.ts).
 */

interface Params {
  state: string;
  slug: string;
}

export function generateStaticParams(): Params[] {
  return stateSlugs.flatMap((state) => [
    ...siteConfig.states[state].cities.map((c) => ({ state, slug: c.slug })),
    ...countiesByState[state].map((c) => ({ state, slug: c.slug })),
  ]);
}

function resolve(params: Params) {
  if (!isStateSlug(params.state)) return null;
  const stateSlug = params.state;
  const stateCfg = siteConfig.states[stateSlug];
  const city = stateCfg.cities.find((c) => c.slug === params.slug);
  if (city) return { kind: "city" as const, stateSlug, stateCfg, city };
  const county = getCounty(stateSlug, params.slug);
  if (county) return { kind: "county" as const, stateSlug, stateCfg, county };
  return null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const resolved = resolve(await params);
  if (!resolved) return {};
  const { stateSlug, stateCfg } = resolved;

  if (resolved.kind === "city") {
    const { city } = resolved;
    const title = `ABA Therapy in ${city.name}, ${stateCfg.abbr} | ${siteConfig.brandName}`;
    const description = `BCBA-led ABA therapy for children in ${city.name}, ${stateCfg.abbr} — in-home, daycare-based, and telehealth. Benefits verified free, no phone trees.`;
    return {
      title: { absolute: title },
      description,
      alternates: { canonical: `/${stateSlug}/${city.slug}` },
    };
  }

  const { county } = resolved;
  const title = `ABA Therapy in ${county.full}, ${stateCfg.abbr} | ${siteConfig.brandName}`;
  const description = `In-home ABA therapy for families across ${county.full}, ${stateCfg.abbr} (pop. ${formatPop(county.pop)}). Benefits verified free, no phone trees.`;
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${stateSlug}/${county.slug}` },
  };
}

export default async function StateChildPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const resolved = resolve(await params);
  if (!resolved) notFound();

  if (resolved.kind === "city") {
    return <CityView stateSlug={resolved.stateSlug} city={resolved.city} />;
  }
  return <CountyView stateSlug={resolved.stateSlug} county={resolved.county} />;
}
