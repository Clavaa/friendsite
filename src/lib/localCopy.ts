import type { FaqItem } from "../data/states";
import {
  about,
  autismEstimate,
  CDC_RATE,
  fmt,
  hashSeed,
  pctStr,
  pick,
  type District,
  type Hub,
  type LocalStats,
  type NearbyPage,
} from "./local";

/**
 * Long-form local copy for county, town and team-city pages.
 *
 * Every paragraph is driven by the place's own public data (see
 * src/lib/local.ts), so two pages differ in substance — not just in the
 * name swapped into a template. Wording variants are picked
 * deterministically per page for natural variety.
 *
 * Client rules this file must keep (see commit b61c484):
 * - Coverage stays vague: no program names, mandates, waivers, hour
 *   specifics or payer lists. Everything routes to the free benefit check.
 * - No invented numbers, offices, staff, wait times or outcomes.
 * - Ruth is the only named clinician — this file names nobody.
 *
 * Inline links use [text](/path); **bold** is supported. Render with
 * <RichText />.
 */

export interface PlaceCtx {
  stateSlug: string;
  stateName: string;
  abbr: string;
  kind: "county" | "town" | "city";
  /** "Lawrence", "Douglas County", "Wichita". */
  name: string;
  /** County display name for towns/cities, e.g. "Douglas County". */
  countyFull?: string;
  countyHref?: string;
  isCdp?: boolean;
  isSeat?: boolean;
  seat?: string | null;
  landSqMi: number;
  stats: LocalStats | null;
  /** County figures — used (and labeled county-wide) when a small town's
   *  own sample is too thin for a percentage. */
  countyStats?: LocalStats | null;
  zips: string[];
  districts: District[];
  districtCount?: number;
  /** Nearest team city. For a team city itself, miles = 0. */
  hub: Hub;
  nearby: NearbyPage[];
  path: string;
  /** Towns: population rank within the county and county totals. */
  countyRank?: number;
  countyCommunities?: number;
  countyKids?: number;
  /** Counties: largest communities with links; cities: counties served. */
  topCommunities?: { name: string; href: string; pop: number; kids: number | null }[];
  countiesServed?: { name: string; href: string }[];
  neighborCounties?: { name: string; href: string; miles: number }[];
}

function ordinal(n: number): string {
  const w = ["", "", "second", "third", "fourth", "fifth", "sixth", "seventh", "eighth", "ninth", "tenth"];
  if (n < w.length) return w[n];
  const s = ["th", "st", "nd", "rd"], v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function nearbyLink(c: PlaceCtx, n: NearbyPage): string {
  return `[${n.name}](/${c.stateSlug}/${n.path}) (${n.miles} mi)`;
}

export interface CopySection {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  ordered?: string[];
}

// ————————————————————————— helpers —————————————————————————

function density(c: PlaceCtx): number | null {
  if (!c.stats || !c.landSqMi) return null;
  return c.stats.pop / c.landSqMi;
}

type Setting = "urban" | "suburban" | "town" | "small-town" | "rural" | "frontier";

function setting(c: PlaceCtx): Setting {
  const pop = c.stats?.pop ?? 0;
  const d = density(c) ?? 0;
  if (c.kind === "county") {
    if (d >= 1000) return "urban";
    if (d >= 150) return "suburban";
    if (d >= 20) return "town";
    if (d >= 6) return "rural";
    return "frontier";
  }
  if (pop >= 50000 && d >= 2000) return "urban";
  if (pop >= 10000) return "suburban";
  if (pop >= 2500) return "town";
  if (pop >= 500) return "small-town";
  return "rural";
}

function districtLine(d: District): string {
  const kids = d.enrollment >= 1000 ? about(d.enrollment) : `about ${fmt(d.enrollment)}`;
  const schools = d.schools ? ` across ${d.schools} school${d.schools === 1 ? "" : "s"}` : "";
  return `${d.name} (${kids} students${schools})`;
}

function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join("");
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

type PctKey = "under6AllParentsWorkPct" | "broadbandPct" | "kidsUninsuredPct" | "kidsPublicOnlyPct";

/** A percentage for this place, or the county's (with the right "where"). */
function pctFor(c: PlaceCtx, k: PctKey): { v: number; where: string; countyWide: boolean } | null {
  const own = c.stats?.[k];
  if (own !== null && own !== undefined) return { v: own, where: inPlace(c), countyWide: false };
  const cv = c.countyStats?.[k];
  if (cv !== null && cv !== undefined && c.countyFull)
    return { v: cv, where: `across ${c.countyFull}`, countyWide: true };
  return null;
}

/** "in Lawrence" / "across Douglas County". */
function inPlace(c: PlaceCtx): string {
  return c.kind === "county" ? `across ${c.name}` : `in ${c.name}`;
}

// ————————————————————————— sections —————————————————————————

function introSection(c: PlaceCtx, seed: number): CopySection {
  const s = c.stats;
  const st = setting(c);
  const d = density(c);
  const paras: string[] = [];

  // Paragraph 1 — what kind of place this is, in data.
  const popPart = s ? `about ${fmt(s.pop)} people` : "a small population";
  const area = c.landSqMi >= 1 ? `${fmt(Math.round(c.landSqMi))} square miles` : "under a square mile";
  const dens = d ? `roughly ${fmt(Math.round(d))} people per square mile` : null;

  if (c.kind === "county") {
    const seatBit = c.seat ? ` The county seat is ${c.seat}.` : "";
    const flavor: Partial<Record<Setting, string>> = {
      urban: `${c.name} is one of the most built-up parts of ${c.stateName}: ${popPart} on ${area}${dens ? `, ${dens}` : ""}. That density means our ABA therapists can stack nearby home visits on the same day, which helps when you are trying to fit sessions around school, work and everything else.`,
      suburban: `${c.name} is home to ${popPart} spread over ${area}${dens ? ` (${dens})` : ""} — a mix of suburbs, smaller towns and open country. In-home ABA fits that pattern well: sessions come to your neighborhood rather than asking you to drive across the county.`,
      town: `${c.name} has ${popPart} across ${area}${dens ? ` — ${dens}` : ""}, mostly in its towns with farmland and open country in between. Families here are used to driving for specialists; with in-home ABA, the drive is ours.`,
      rural: `${c.name} is rural: ${popPart} across ${area}${dens ? `, or ${dens}` : ""}. Specialty care for kids has traditionally meant long drives out of the county. Our model is built the other way around — therapy comes to your home, and your BCBA stays in touch by video between visits.`,
      frontier: `${c.name} is frontier country — ${popPart} across ${area}${dens ? `, fewer than ${Math.max(1, Math.ceil(d ?? 0))} people per square mile` : ""}. Families here know better than anyone how far the nearest specialist can be. We don't pretend the map is smaller than it is; we plan around it with in-home visits and telehealth.`,
    };
    paras.push((flavor[st] ?? flavor.town) + seatBit);
  } else {
    const where = c.countyFull ? ` in [${c.countyFull}](${c.countyHref})` : "";
    const seatBit = c.isSeat ? ` It is also the county seat.` : "";
    const cdpBit = c.isCdp
      ? ` It is an unincorporated community — there is no city hall, but neighbors know it by name, and so do we.`
      : "";
    const flavor: Partial<Record<Setting, string>> = {
      urban: `${c.name}${where} is a big, busy place: ${popPart} on ${area}${dens ? `, ${dens}` : ""}.${seatBit}${cdpBit} With that many families close together, in-home ABA is practical here — your child's ABA therapist comes to your door instead of adding a commute to your week.`,
      suburban: `${c.name}${where} is home to ${popPart}${dens ? ` (${dens})` : ""}.${seatBit}${cdpBit} It is the kind of place where weekday schedules are already full — school runs, work, practices — which is why we bring ABA therapy to your home rather than asking you to fit another drive into the day.`,
      town: `${c.name}${where} is a town of ${popPart}.${seatBit}${cdpBit} Families here often drive a long way for pediatric specialists. In-home ABA flips that: the therapist does the driving, and sessions happen where your child is most comfortable.`,
      "small-town": `${c.name}${where} is a small community of ${popPart}.${seatBit}${cdpBit} In a town this size, everybody knows everybody — and families can feel like they are the only ones dealing with autism. You are not, and you don't need to move or drive hours for help.`,
      rural: `${c.name}${where} is a very small community — ${popPart}.${seatBit}${cdpBit} No town is too small for in-home ABA. We plan visits and telehealth around where you actually live, and we tell you plainly what that looks like for your address.`,
    };
    paras.push(flavor[st === "frontier" ? "rural" : st] ?? flavor.town!);
  }

  // Paragraph 2 — our team serves this place. (Owner rule, 10/6: no
  // "N miles from our nearest team" lines — every town is served by our
  // team; distance talk belongs on the intake call, not the page.)
  if (c.kind === "city") {
    paras.push(
      pick(seed, 1, [
        `${c.name} is one of our team cities. Our ${c.name} team covers the city and the towns around it — the nearest are listed further down this page.`,
        `We are based right here in the ${c.name} area, and our ${c.name} team brings in-home ABA to families across the city and the surrounding towns and counties, all listed below.`,
      ])
    );
  } else {
    paras.push(
      pick(seed, 1, [
        `Our Sunbird ABA team in the ${c.name} area is here serving you. Your child's ABA therapist comes to your home or daycare, and your BCBA stays in touch by video between visits — so help is here, not a long drive away.`,
        `Our team works with families ${inPlace(c)} the same way we do everywhere: sessions at your home or your child's daycare, a BCBA who knows your child, and telehealth check-ins so nobody waits a week for an answer.`,
        `${c.name} families don't have to drive to a clinic. Our ABA team comes to you — at home or at daycare — with BCBA coaching by video in between visits.`,
        `When you call from ${c.name}, you're matched with our team that serves your area. They come to your home or daycare, and your BCBA checks in by video between sessions.`,
      ])
    );
  }

  // Paragraph 3 — what a week of ABA looks like (links into the guides).
  paras.push(
    pick(seed, 2, [
      `A typical plan starts with a BCBA assessment at home, then regular one-on-one sessions with an ABA therapist — a trained behavior technician — working from goals your BCBA wrote for your child. You are part of it, too: [parent training](/services/parent-training) is built in, because the skills have to work at dinner time, not just during a session. Curious who does what? See [who is on your child's team](/resources/who-is-on-the-team).`,
      `Here's what ABA usually looks like in practice: your BCBA observes your child at home and writes a plan, an ABA therapist runs the day-to-day sessions, and you get coaching so progress carries over between visits. How many hours a week? That depends on your child — our guide to [how many hours of ABA](/resources/how-many-hours-of-aba) explains how that gets decided.`,
      `ABA here works the same way it does everywhere we serve: a BCBA-led plan written for your child, one-on-one sessions with an ABA therapist, and regular coaching for you. New to all of this? Start with [what ABA therapy actually is](/resources/what-is-aba), then [what to expect at the first session](/resources/preparing-for-your-first-session).`,
    ])
  );

  return {
    id: "local-picture",
    heading:
      c.kind === "county"
        ? `What ABA therapy looks like across ${c.name}`
        : `What ABA therapy looks like in ${c.name}`,
    paragraphs: paras,
  };
}

function kidsSection(c: PlaceCtx, seed: number): CopySection | null {
  const s = c.stats;
  if (!s || s.under18 <= 0) return null;
  const est = autismEstimate(s.under18);
  const paras: string[] = [];
  const u5 = s.under5;

  paras.push(
    pick(seed, 3, [
      `Census estimates count ${about(s.under18)} children under 18 ${inPlace(c)}, including ${about(u5)} under age 5.`,
      `${c.name} is home to ${about(s.under18)} kids under 18 — ${about(u5)} of them younger than 5 — according to the Census Bureau's latest five-year estimates.`,
    ]) +
      (est >= 2
        ? ` The CDC estimates that about 1 in ${CDC_RATE} children is autistic. Applied here, that is roughly ${fmt(est)} children ${inPlace(c)} who may be on the spectrum — many of them not yet diagnosed.`
        : ` The CDC estimates that about 1 in ${CDC_RATE} children is autistic. In a community this size, that may mean just one or two families — which is exactly why parents here can feel alone. You are not.`)
  );

  if (u5 >= 1) {
    paras.push(
      pick(seed, 4, [
        `Earlier is easier. If your toddler isn't pointing, answering to their name, or using words the way other kids their age do, it is worth a look now rather than later. Our guides walk through [signs of autism at 18 months](/resources/signs-of-autism-at-18-months), [at age 2](/resources/signs-of-autism-at-age-2) and [at age 3](/resources/signs-of-autism-at-age-3), plus [the M-CHAT screening](/resources/the-m-chat-screening) many pediatricians use.`,
        `Most parents notice something before anyone else does. If you're wondering about your little one, start with the [M-CHAT screening explained](/resources/the-m-chat-screening), or read the [signs at age 2](/resources/signs-of-autism-at-age-2). And if you already have a gut feeling, [here's what to do next](/questions/think-my-child-might-have-asd).`,
        `For the ${about(u5).replace("about ", "")} youngest children ${inPlace(c)}, timing matters. Plain-English checklists: [signs at 18 months](/resources/signs-of-autism-at-18-months), [signs at age 3](/resources/signs-of-autism-at-age-3). No diagnosis yet? That's fine — we'll [help you get one](/get-a-diagnosis).`,
      ])
    );
  }

  const older = s.under18 - u5;
  if (older > 0) {
    paras.push(
      pick(seed, 5, [
        `ABA isn't only for toddlers. For school-age kids ${inPlace(c)}, goals often center on communication, managing big feelings, daily routines and getting along with friends. Wondering how ABA fits with other therapies? See [ABA vs. speech therapy](/resources/aba-vs-speech-therapy).`,
        `School-age kids benefit too — ABA can target the things that make the school day and evenings hard: transitions, communication, self-care, and handling frustration. Read [how ABA and speech therapy work together](/resources/aba-vs-speech-therapy), and our honest take on [whether ABA is harmful](/resources/is-aba-therapy-harmful).`,
      ])
    );
  }

  return {
    id: "kids-and-families",
    heading:
      c.kind === "county"
        ? `Kids and families in ${c.name}`
        : `Autism and young children in ${c.name}`,
    paragraphs: paras,
  };
}

function fitSection(c: PlaceCtx, seed: number): CopySection | null {
  const paras: string[] = [];
  const W = pctFor(c, "under6AllParentsWorkPct");
  const B = pctFor(c, "broadbandPct");
  const work = W?.v ?? null;
  const bb = B?.v ?? null;
  const smallNote = (x: typeof W) =>
    x?.countyWide ? ` (${c.name} is small enough that the county-wide figure is the reliable one.)` : "";

  if (work !== null && W) {
    if (work >= 65) {
      paras.push(
        `About ${pctStr(work)} of children under 6 ${W.where} live in homes where every parent works. For a lot of families here, the hours that matter are daycare hours — so we offer [daycare-based ABA support](/services/daycare-based), where your child's ABA therapist works alongside the daycare routine, plus [in-home sessions](/services/in-home-aba) for evenings and the skills that belong at home.${smallNote(W)}`
      );
    } else if (work >= 45) {
      paras.push(
        `About ${pctStr(work)} of children under 6 ${W.where} have every parent in the workforce, so families here are split: some want sessions during daycare, others at home with a parent close by. We do both — [in-home ABA](/services/in-home-aba) and [daycare-based support](/services/daycare-based) — and many families mix them. Our guide to [home vs. daycare sessions](/resources/home-vs-daycare-sessions) explains the trade-offs.${smallNote(W)}`
      );
    } else {
      paras.push(
        `${W.countyWide ? c.countyFull : c.name} has more young children with a parent at home during the day than most places — only about ${pctStr(work)} of kids under 6 have every parent working. That makes [in-home ABA](/services/in-home-aba) a natural fit, and it means [parent training](/services/parent-training) can happen right alongside your child's sessions.`
      );
    }
  }

  if (bb !== null && B) {
    if (bb >= 90) {
      paras.push(
        pick(seed, 6, [
          `About ${pctStr(bb)} of households ${B.where} have broadband, so [telehealth](/services/telehealth) is easy here: BCBA check-ins and parent coaching by video, on top of in-person sessions — never as a substitute for them.`,
          `Connectivity is strong — about ${pctStr(bb)} of homes have broadband. Most families here use [telehealth](/services/telehealth) for quick BCBA check-ins and coaching between in-person sessions.`,
        ])
      );
    } else if (bb >= 78) {
      paras.push(
        `About ${pctStr(bb)} of households ${B.where} have broadband — most, but not all. If video works at your house, [telehealth](/services/telehealth) adds BCBA time between visits. If it doesn't, tell us; we'll plan around your connection instead of the other way around.`
      );
    } else {
      paras.push(
        `Only about ${pctStr(bb)} of households ${B.where} have broadband internet, so we don't assume video works for you. Where it does, [telehealth](/services/telehealth) adds BCBA time between visits; where it doesn't, in-home visits carry the plan. We'll ask about your connection up front.`
      );
    }
  }

  if (!paras.length) return null;
  return {
    id: "what-fits",
    heading: `Home, daycare or telehealth: what fits ${c.name} families`,
    paragraphs: paras,
  };
}

function schoolSection(c: PlaceCtx, seed: number, countyDistricts?: District[]): CopySection | null {
  const own = c.districts;
  const list = own.length ? own : countyDistricts ?? [];
  if (!list.length) return null;
  const paras: string[] = [];
  const top = list.slice(0, c.kind === "county" ? 8 : 3).map(districtLine);

  if (c.kind === "county") {
    const n = c.districtCount ?? list.length;
    paras.push(
      n === 1
        ? `Public schools across ${c.name} are run by one district: ${top[0]}.`
        : `${c.name} has ${n} public school districts. The largest are ${listJoin(top)}.`
    );
  } else if (own.length) {
    paras.push(
      own.length === 1
        ? `Most public-school students in ${c.name} attend ${top[0]}.`
        : `Public-school students in ${c.name} are served by ${listJoin(top)}.`
    );
  } else {
    paras.push(
      `${c.name} is served by ${c.countyFull ?? "county"} school districts, including ${listJoin(top)}. District lines don't always follow town lines, so check your address with the district if you're not sure.`
    );
  }

  paras.push(
    pick(seed, 7, [
      `If your child has an IEP (or an IFSP for little ones), share it with your BCBA. When home goals and school goals line up, kids make progress faster and get less mixed messaging. Bring the latest evaluation reports to your first meeting, too — they save time and repeat testing.`,
      `Already working with your school team? Good — bring that IEP or evaluation to us. Your BCBA can shape home goals that support what's happening at school, so your child hears the same expectations in both places.`,
      `School and ABA work best as partners. If your child has an IEP or evaluation from the district, send it along with your intake — it helps your BCBA write goals that back up the school plan instead of competing with it.`,
    ])
  );

  return {
    id: "schools",
    heading:
      c.kind === "county"
        ? `School districts in ${c.name}`
        : `Schools and IEPs in ${c.name}`,
    paragraphs: paras,
  };
}

function areaSection(c: PlaceCtx, seed: number): CopySection | null {
  const paras: string[] = [];
  const s = c.stats;
  if (c.kind === "town") {
    const bits: string[] = [];
    if (c.countyRank && c.countyCommunities && c.countyCommunities > 1) {
      bits.push(
        c.countyRank === 1
          ? `${c.name} is the largest community in [${c.countyFull}](${c.countyHref})`
          : `${c.name} is the ${ordinal(c.countyRank)}-largest of the ${c.countyCommunities} communities we list in [${c.countyFull}](${c.countyHref})`
      );
    } else if (c.countyFull) {
      bits.push(`${c.name} is in [${c.countyFull}](${c.countyHref})`);
    }
    if (s && c.countyKids && s.under18 > 0) {
      const share = (100 * s.under18) / c.countyKids;
      if (share >= 1)
        bits.push(`home to about ${pctStr(share)} of the county's children`);
    }
    paras.push(bits.join(", ") + "." + (c.isSeat ? ` As the county seat, it is where many families already come for county services.` : ""));
    const near = c.nearby.slice(0, 5);
    if (near.length >= 2) {
      paras.push(
        pick(seed, 9, [
          `The closest neighbors are ${listJoin(near.map((n) => nearbyLink(c, n)))}. Families in all of them are served the same way, so if you live between towns, you're covered.`,
          `Nearby, we also serve ${listJoin(near.map((n) => nearbyLink(c, n)))} — distances are straight-line from ${c.name}. Living out of town or between two of them? Same team, same plan.`,
          `${c.name} families aren't the only ones we see in this corner of ${c.stateName}: ${listJoin(near.map((n) => nearbyLink(c, n)))} are all close by, and all served the same way.`,
        ])
      );
    }
  } else if (c.kind === "county" && c.topCommunities?.length) {
    const top = c.topCommunities.slice(0, 4);
    const kidsTop = top.reduce((a, t) => a + (t.kids ?? 0), 0);
    paras.push(
      `The biggest communities in ${c.name} are ${listJoin(top.map((t) => `[${t.name}](${t.href}) (${fmt(t.pop)} people)`))}` +
        (s && s.under18 > 0 && kidsTop > 0 && kidsTop < s.under18
          ? `. Together they hold about ${pctStr((100 * kidsTop) / s.under18)} of the county's children — the rest live in smaller towns and out in the county, where in-home visits matter most.`
          : ".")
    );
    if (c.neighborCounties?.length) {
      paras.push(
        `${c.name} borders ${listJoin(c.neighborCounties.map((n) => `[${n.name}](${n.href})`))}. Families near a county line are often closer to a town on the other side — that's fine; we serve both.`
      );
    }
  } else if (c.kind === "city") {
    const n30 = c.nearby.length;
    if (c.countiesServed?.length) {
      paras.push(
        `Our ${c.name} team is the closest Sunbird team for ${c.countiesServed.length} ${c.stateName} ${c.countiesServed.length === 1 ? "county" : "counties"}: ${listJoin(c.countiesServed.map((x) => `[${x.name}](${x.href})`))}.`
      );
    }
    if (n30) {
      paras.push(
        `Closest to the city: ${listJoin(c.nearby.slice(0, 6).map((n) => nearbyLink(c, n)))}. The full list of towns within 30 miles is further down this page.`
      );
    }
  }
  if (!paras.length) return null;
  return {
    id: "area",
    heading:
      c.kind === "county"
        ? `Communities across ${c.name}`
        : c.kind === "city"
          ? `The ${c.name} service area`
          : `${c.name} and its neighbors`,
    paragraphs: paras,
  };
}

function payingSection(c: PlaceCtx, seed: number): CopySection {
  const paras: string[] = [];
  const P = pctFor(c, "kidsPublicOnlyPct");
  const U = pctFor(c, "kidsUninsuredPct");
  if (P && U) {
    paras.push(
      `Families ${inPlace(c)} pay for care in different ways. Census figures show that ${P.where}, about ${pctStr(P.v)} of children are covered only by Medicaid or another public plan, and about ${pctStr(U.v)} have no coverage at all — the rest mostly have insurance through a parent's job or a plan they bought.`
    );
  }
  paras.push(
    pick(seed, 8, [
      `Whatever card is in your wallet, the first step is the same: send us a photo and we check your ABA benefits directly with your plan — free. You get a plain-English answer about what's covered and what you'd owe, usually within a business day. Most ${c.stateName} families pay little or nothing once benefits are confirmed.`,
      `Coverage depends on your plan, not your ZIP code, so we don't guess. Snap a photo of your insurance card, and we'll verify your ABA benefits with the plan for free and call you back with a straight answer — usually within a business day.`,
      `Here's the part that's the same for every family ${inPlace(c)}: we do the insurance legwork. One photo of your card, and we confirm your ABA benefits with the plan directly — free — then explain what's covered and what you'd owe before anything starts.`,
      `You shouldn't have to decode an insurance policy to get your child help. Send us a picture of your card and we'll check your ABA benefits for free, then call with a plain answer. Most ${c.stateName} families end up paying little or nothing once benefits are confirmed.`,
    ])
  );
  paras.push(
    `More detail: [paying for ABA therapy](/resources/paying-for-aba), [our insurance page](/insurance), and [will insurance pay for ABA?](/questions/will-insurance-pay)`
  );
  return {
    id: "paying",
    heading: `Paying for ABA therapy ${inPlace(c)}`,
    paragraphs: paras,
  };
}

function startSection(c: PlaceCtx, seed: number): CopySection {
  const team = c.kind === "city" ? `our ${c.name} team` : `the team that serves ${c.name}`;
  const homeWhere = c.kind === "county" ? `your home in ${c.name}` : `your home in ${c.name}`;
  const zipBit = c.zips.length
    ? ` — include your ZIP code (${c.zips.length > 4 ? `${c.zips.slice(0, 4).join(", ")} and others` : c.zips.join(", ")} ${c.zips.length === 1 ? "is" : "are"} ${inPlace(c).replace("across", "in")})`
    : "";
  return {
    id: "getting-started",
    heading: `Getting started from ${c.name}, step by step`,
    paragraphs: [
      pick(seed, 10, [
        `No phone trees and no mystery. Here is exactly what happens after you reach out — the full version lives on our [getting-started page](/getting-started).`,
        `From first call to first session, here's the path for ${c.name} families. (More detail on our [getting-started page](/getting-started).)`,
        `What happens after you call? Five steps, no surprises — and the [getting-started page](/getting-started) has the long version.`,
      ]),
    ],
    ordered: [
      `**Call or send the short form**${zipBit}. ` +
        pick(seed, 11, [
          `An intake advocate calls you back, usually the same business day.`,
          `A real person — not a phone tree — calls back, usually the same business day.`,
          `Expect a call back from an intake advocate, usually the same business day.`,
        ]),
      pick(seed, 12, [
        `**Free benefit check.** Send a photo of your insurance card; we verify ABA coverage with your plan and explain it in plain English.`,
        `**We check your insurance — free.** One photo of your card is all we need to confirm your ABA benefits and tell you what you'd owe.`,
        `**Benefits, verified.** We call your plan so you don't have to, then explain your ABA coverage in plain English.`,
      ]),
      pick(seed, 13, [
        `**No diagnosis yet?** We help you [book an evaluation](/get-a-diagnosis) first. Already have one? See [what to do after a diagnosis](/resources/first-steps-after-a-diagnosis).`,
        `**Diagnosis in hand — or not yet.** If you still need an evaluation, we'll [help you book one](/get-a-diagnosis). If you have the report, here are the [first steps after a diagnosis](/resources/first-steps-after-a-diagnosis).`,
      ]),
      pick(seed, 14, [
        `**BCBA assessment at ${homeWhere}.** A BCBA from ${team} meets your child where they're most comfortable and writes goals with you.`,
        `**A BCBA visit at ${homeWhere}.** A BCBA from ${team} comes to observe, ask questions, and write a plan with you — not for you.`,
      ]),
      pick(seed, 15, [
        `**Sessions begin.** An ABA therapist starts regular one-on-one sessions at home or daycare, with [parent training](/services/parent-training) built in. Here's [how to prepare for the first one](/resources/preparing-for-your-first-session).`,
        `**Therapy starts.** Your child's ABA therapist begins one-on-one sessions at home or daycare, and you get [parent coaching](/services/parent-training) along the way. Read [how to prepare for session one](/resources/preparing-for-your-first-session).`,
      ]),
    ],
  };
}

// ————————————————————————— public API —————————————————————————

export function buildLocalSections(c: PlaceCtx, countyDistricts?: District[]): CopySection[] {
  const seed = hashSeed(`${c.stateSlug}/${c.path}`);
  return [
    introSection(c, seed),
    kidsSection(c, seed),
    fitSection(c, seed),
    schoolSection(c, seed, countyDistricts),
    areaSection(c, seed),
    payingSection(c, seed),
    startSection(c, seed),
  ].filter((x): x is CopySection => Boolean(x));
}

export function buildLocalFaqs(c: PlaceCtx, countyDistricts?: District[]): FaqItem[] {
  const s = c.stats;
  const faqs: FaqItem[] = [];
  const where = inPlace(c);

  const seed = hashSeed(`${c.stateSlug}/${c.path}`);
  const P = pctFor(c, "kidsPublicOnlyPct");
  faqs.push({
    q: `Does insurance cover ABA therapy ${where}?`,
    a:
      pick(seed, 20, [
        `Coverage depends on your plan, not your town — and rather than guess at yours, we check it for free.`,
        `It depends on the plan, so we check yours for free instead of guessing.`,
        `Usually, but it's plan-by-plan — which is why our benefit check is free.`,
      ]) +
      (P ? ` ${P.where.charAt(0).toUpperCase() + P.where.slice(1)}, about ${pctStr(P.v)} of kids are on Medicaid or another public plan; the rest mostly have private coverage — we work through both.` : "") +
      ` Most ${c.stateName} families pay little or nothing once benefits are confirmed. Send a photo of your insurance card and we'll tell you where you stand, usually within a business day.`,
  });

  faqs.push({
    q:
      c.kind === "city"
        ? `Do you offer in-home ABA therapy in ${c.name}?`
        : `Do you have an ABA team in ${c.name}?`,
    a:
      c.kind === "city"
        ? `Yes — ${c.name} is one of our team cities, and in-home ABA is how we serve it. Your child's ABA therapist comes to your home (or daycare), and telehealth adds BCBA time between visits.`
        : `Yes — our Sunbird team in the ${c.name} area is serving families ${where}${c.countyFull ? ` and across ${c.countyFull}` : ""}. Your child's ABA therapist comes to your home or daycare, with BCBA check-ins by video between visits. Tell us your address and we'll set up a schedule that works.`,
  });

  faqs.push({
    q: `My child doesn't have a diagnosis yet. Can we still start from ${c.name}?`,
    a: pick(seed, 21, [
      `Yes — that's where many ${c.stateName} families begin. We help you book a diagnostic evaluation first, then move straight into coverage and therapy once the diagnosis is in hand.`,
      `Absolutely. Lots of parents call us with nothing but a hunch. We'll help you get an evaluation booked, check your benefits in the meantime, and be ready to start when the report comes back.`,
      `Yes. Call us first — we'll point you to a diagnostic evaluation in ${c.stateName}, verify your coverage while you wait, and line up therapy for when the diagnosis is in hand.`,
    ]),
  });

  if (s && s.under18 > 0) {
    const est = autismEstimate(s.under18);
    faqs.push({
      q: `How many children ${where} might be autistic?`,
      a:
        est >= 2
          ? `There's no local registry, but the CDC estimates about 1 in ${CDC_RATE} children is autistic. With ${about(s.under18)} kids under 18 ${where} (Census estimate), that works out to roughly ${fmt(est)} children — many not yet diagnosed.`
          : `There's no local registry, but the CDC estimates about 1 in ${CDC_RATE} children is autistic. With ${about(s.under18)} kids under 18 ${where}, that may mean only one or two families — which can make it feel lonely. In-home care and telehealth mean you don't need a big city to get help.`,
    });
  }

  const ds = c.districts.length ? c.districts : countyDistricts ?? [];
  if (ds.length) {
    faqs.push({
      q:
        c.kind === "county"
          ? `Which school districts are in ${c.name}?`
          : `Which school district serves ${c.name}?`,
      a:
        (c.kind === "county"
          ? `${c.name} has ${c.districtCount ?? ds.length} public school district${(c.districtCount ?? ds.length) === 1 ? "" : "s"}, including ${listJoin(ds.slice(0, 5).map((d) => d.name))}.`
          : c.districts.length
            ? `Most students in ${c.name} attend ${listJoin(c.districts.map((d) => d.name))}.`
            : `${c.name} is served by ${c.countyFull ?? "county"} districts such as ${listJoin(ds.slice(0, 3).map((d) => d.name))} — check your address with the district to be sure.`) +
        ` If your child has an IEP, share it with your BCBA so home and school goals line up.`,
    });
  }

  if (c.zips.length) {
    faqs.push({
      q: `What ZIP codes do you serve ${where}?`,
      a: `All of them. ${c.name} ${c.zips.length === 1 ? "uses ZIP code" : "includes ZIP codes"} ${c.zips.join(", ")}${c.kind === "county" ? "" : " — and we serve the surrounding area too"}. Give us your ZIP when you call and we'll confirm your team and schedule.`,
    });
  }

  const BB = pctFor(c, "broadbandPct");
  if (BB) {
    faqs.push({
      q: `Is telehealth ABA realistic ${where}?`,
      a:
        BB.v >= 85
          ? `For most families, yes — about ${pctStr(BB.v)} of households ${BB.where} have broadband. We use telehealth for BCBA check-ins and parent coaching alongside in-person sessions, not instead of them.`
          : `It depends on your connection: about ${pctStr(BB.v)} of households ${BB.where} have broadband. Where video works, telehealth adds BCBA time between visits; where it doesn't, in-home visits carry the plan.`,
    });
  }

  const near = c.nearby.slice(0, 4).map((n) => n.name);
  if (near.length >= 2) {
    faqs.push({
      q: `Do you also serve towns near ${c.name}?`,
      a: `Yes — including ${listJoin(near)}. Families across this part of ${c.stateName} are served the same way: in-home sessions, daycare-based support and telehealth.`,
    });
  }

  faqs.push({
    q: `How fast can we start ${where}?`,
    a: `It depends on your child's plan and our current capacity in your area, so we won't quote a number we can't keep. Tell us your ZIP code and schedule, and an intake advocate gives you an honest start timeline — usually on the first call.`,
  });

  return faqs;
}
