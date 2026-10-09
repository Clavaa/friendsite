import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { siteConfig, isStateSlug, stateSlugs, type StateSlug } from "../../../../../site.config";
import { getCounty } from "../../../../data/counties";
import { getTown, townsByState } from "../../../../data/towns";
import TownView, { townCtx } from "./TownView";
import ZipView from "./ZipView";
import CityServiceView from "./CityServiceView";
import { CITY_SERVICES, cityZips, getCityService, isZip, zipLabel, zipRecord } from "../../../../lib/metro";
import { brandTitle } from "../../../../lib/seo";
import { localMetaDescription, localTitle } from "../../../../lib/seo";

/**
 * Town pages — /{state}/{county}/{town} — one per Census incorporated
 * place plus census-designated places of 250+ people (src/data/towns.ts). The ten places that already
 * have first-class city pages at /{state}/{city} are excluded here and
 * 301-redirected in next.config.ts instead. CDPs under 250 people get no
 * page; the county page names them in its "every community" line.
 */

interface Params {
  state: string;
  slug: string;
  town: string;
}

export function generateStaticParams(): Params[] {
  return stateSlugs.flatMap((state) => [
    ...townsByState[state].towns.map((t) => ({
      state,
      slug: t.county,
      town: t.slug,
    })),
    // Big-city layer: ZIP area pages + city×service pages under each team city.
    ...siteConfig.states[state].cities.flatMap((c) => [
      ...cityZips(state, c.slug).map(([zip]) => ({ state, slug: c.slug, town: zip })),
      ...CITY_SERVICES.map((svc) => ({ state, slug: c.slug, town: svc.slug })),
    ]),
  ]);
}

/** /{state}/{city}/{zip|service} — the big-city layer (src/lib/metro.ts). */
function resolveCity(params: Params) {
  if (!isStateSlug(params.state)) return null;
  const stateSlug = params.state;
  const city = siteConfig.states[stateSlug].cities.find((c) => c.slug === params.slug);
  if (!city) return null;
  const c = { name: city.name, slug: city.slug };
  if (isZip(params.town)) {
    const rec = zipRecord(stateSlug, city.slug, params.town);
    return rec ? { kind: "zip" as const, stateSlug, city: c, zip: params.town, rec } : null;
  }
  const svc = getCityService(params.town);
  return svc ? { kind: "service" as const, stateSlug, city: c, svc } : null;
}

export const dynamicParams = false;

function resolve(params: Params) {
  if (!isStateSlug(params.state)) return null;
  const county = getCounty(params.state, params.slug);
  if (!county) return null;
  const town = getTown(params.state, params.slug, params.town);
  if (!town) return null;
  return { stateSlug: params.state, county, town };
}

/**
 * Rotating meta-description templates. The template is picked
 * deterministically per town; town + county + population interpolation
 * keeps every description unique across the ~740 town pages.
 */
function townDescription(
  name: string,
  abbr: string,
  countyFull: string,
  pop: string,
  seed: number
): string {
  const templates = [
    `In-home and telehealth ABA therapy for families in ${name}, ${abbr} — a ${countyFull} community of about ${pop} people. Free benefit check, plain-English answers.`,
    `BCBA-led ABA therapy that comes to ${name}, ${abbr} (pop. ${pop}, ${countyFull}). In-home sessions, telehealth support, and a free insurance benefit check.`,
    `ABA therapy for children in ${name}, ${abbr}, home to about ${pop} people in ${countyFull}. Sessions at your kitchen table, benefits verified free.`,
    `Serving ${name} and the rest of ${countyFull}, ${abbr} with in-home ABA therapy and telehealth. About ${pop} residents, one free benefit check away.`,
    `Families in ${name}, ${abbr} (${countyFull}, pop. ${pop}) get one-on-one, BCBA-led ABA at home, with telehealth between visits. We verify benefits free.`,
    `One-on-one ABA therapy in ${name}, ${abbr} — about ${pop} people strong in ${countyFull}. In-home visits, telehealth, and honest start timelines.`,
  ];
  return templates[seed % templates.length];
}

function isDuplicateName(state: StateSlug, name: string): boolean {
  return townsByState[state].towns.filter((t) => t.name === name).length > 1;
}

function hashSeed(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const p = await params;
  const cityRes = resolveCity(p);
  if (cityRes) {
    const abbr = siteConfig.states[cityRes.stateSlug].abbr;
    if (cityRes.kind === "zip") {
      const label = zipLabel(cityRes.rec, 2);
      const core = `ABA Therapy in ${cityRes.city.name} ${cityRes.zip}`;
      const withHood = label ? `${core}: ${label}` : `${core}, ${abbr}`;
      const title = brandTitle(withHood.length <= 60 ? withHood : `${core}, ${abbr}`);
      const kids = cityRes.rec.stats?.under18;
      return {
        title: { absolute: title },
        description: `In-home and daycare ABA therapy in ${cityRes.city.name} ${cityRes.zip}${label ? ` — ${label}` : ""}.${kids ? ` For the ${kids.toLocaleString("en-US")} kids in this ZIP:` : ""} BCBA-led, insurance checked free.`.slice(0, 158),
        alternates: { canonical: `/${cityRes.stateSlug}/${cityRes.city.slug}/${cityRes.zip}` },
      };
    }
    const title = brandTitle(cityRes.svc.title.replace("{city}", `${cityRes.city.name}, ${abbr}`));
    const descs: Record<string, string> = {
      "in-home-aba-therapy": `In-home ABA therapy in ${cityRes.city.name}, ${abbr}: one-on-one sessions at your home, a BCBA-led plan, parent coaching, and a free insurance check.`,
      "autism-evaluation": `Think your child might have autism? How ${cityRes.city.name} families get an autism evaluation — signs, who diagnoses, next steps — and free help getting started.`,
      "daycare-aba": `ABA therapy at your child's daycare in ${cityRes.city.name}, ${abbr}: BCBA-led sessions in the normal day, teacher teamwork, and a free insurance check.`,
      "parent-training": `ABA parent training in ${cityRes.city.name}, ${abbr}: BCBA coaching for mornings, meals and meltdowns — at home or by video. Insurance checked free.`,
    };
    return {
      title: { absolute: title },
      description: descs[cityRes.svc.slug],
      alternates: { canonical: `/${cityRes.stateSlug}/${cityRes.city.slug}/${cityRes.svc.slug}` },
    };
  }
  const resolved = resolve(p);
  if (!resolved) return {};
  const { stateSlug, county, town } = resolved;
  const stateCfg = siteConfig.states[stateSlug];

  // Same-name towns in one state (Twin Lakes, Coal Creek, CO) carry the
  // county — as a comma phrase: Google rewrites bracketed titles ~78%.
  const label = isDuplicateName(stateSlug, town.name)
    ? `${town.name}, ${county.full}`
    : town.name;
  const key = `${stateSlug}/${county.slug}/${town.slug}`;
  const title = localTitle(label, stateCfg.abbr, key);

  // Data-rich description (kids, nearest team, distance) — unique per town.
  // Falls back to the rotating templates if a town has no local record.
  const ctx = townCtx(stateSlug, county, town);
  const description = ctx
    ? localMetaDescription(label, stateCfg.abbr, key)
    : townDescription(
        town.name,
        stateCfg.abbr,
        county.full,
        town.pop.toLocaleString("en-US"),
        hashSeed(`${stateSlug}/${county.slug}/${town.slug}`)
      );

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/${stateSlug}/${county.slug}/${town.slug}` },
  };
}

export default async function TownPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const p = await params;
  const cityRes = resolveCity(p);
  if (cityRes?.kind === "zip") {
    return <ZipView stateSlug={cityRes.stateSlug} city={cityRes.city} zip={cityRes.zip} rec={cityRes.rec} />;
  }
  if (cityRes?.kind === "service") {
    return <CityServiceView stateSlug={cityRes.stateSlug} city={cityRes.city} svc={cityRes.svc} />;
  }
  const resolved = resolve(p);
  if (!resolved) notFound();
  return (
    <TownView
      stateSlug={resolved.stateSlug}
      county={resolved.county}
      town={resolved.town}
    />
  );
}
