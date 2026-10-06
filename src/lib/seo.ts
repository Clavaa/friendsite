import { siteConfig } from "../../site.config";

/**
 * BreadcrumbList JSON-LD for hierarchical pages.
 * Pass items in order from Home down to the current page; the current
 * (last) item carries no URL per Google's guidelines.
 */
export function breadcrumbJsonLd(items: { name: string; path?: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      ...(item.path !== undefined
        ? { item: `${siteConfig.domain}${item.path}` }
        : {}),
    })),
  };
}

/**
 * SERP title: "{core} – Sunbird ABA" when that fits in 60 characters,
 * otherwise the core alone. Why (CTR research, 2026-10): 51–60-character
 * titles are rewritten least by Google (Zyppy, 81k titles) and 40–60
 * characters earn ~33% more clicks (Backlinko, 4M results); Google drops or
 * replaces the pipe separator ~41% of the time vs ~20% for a dash.
 */
export const BRAND_SUFFIX = " – Sunbird ABA";
export function brandTitle(core: string): string {
  const full = `${core}${BRAND_SUFFIX}`;
  return full.length <= 60 ? full : core;
}

function seedOf(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h;
}

/**
 * Local-page title: keyword first ("ABA Therapy in Merriam, KS"), then a
 * rotating click hook so ~1,200 titles aren't one boilerplate pattern (a
 * Google rewrite trigger), then the brand — each dropped in turn if the
 * title would pass 60 characters.
 */
export function localTitle(place: string, abbr: string, key: string, therapists = false): string {
  const core = therapists ? `ABA Therapy & Therapists in ${place}, ${abbr}` : `ABA Therapy in ${place}, ${abbr}`;
  if (therapists) return brandTitle(core);
  const hooks = [": In-Home & Daycare", ": At-Home Care for Kids", ": BCBA-Led, At Home", ": Insurance Checked Free", ": In-Home Care"];
  const start = seedOf(key) % hooks.length;
  const rotated = hooks.map((_, i) => hooks[(start + i) % hooks.length]);
  // Prefer hook + brand, then hook alone (a reason to click beats an
  // unknown brand name), then brand alone, then the bare keyword.
  const candidates = [
    ...rotated.map((h) => `${core}${h}${BRAND_SUFFIX}`),
    ...rotated.map((h) => `${core}${h}`),
    `${core}${BRAND_SUFFIX}`,
    core,
  ];
  return candidates.find((t) => t.length <= 60) ?? core;
}

/**
 * Local-page meta description: benefit-first, ~120–155 characters (80–120
 * tends to earn the best CTR; >158 truncates). Leaves out distance and
 * kid counts — useful on the page, off-putting in a search snippet.
 */
export function localMetaDescription(place: string, abbr: string, key: string): string {
  const p = `${place}, ${abbr}`;
  const opts = [
    `In-home ABA therapy for kids in ${p}. BCBA-led plans, sessions at home or daycare, and insurance checked free. Talk to a real person today.`,
    `Looking for ABA therapy in ${p}? Our ABA therapists come to your home or daycare. BCBA-led, insurance checked free — get matched today.`,
    `ABA therapy that comes to you in ${p}: one-on-one sessions at home or daycare, a BCBA-led plan, and a free insurance check.`,
    `Autism support for ${p} families: in-home and daycare ABA therapy, parent coaching, and a free benefit check. No phone trees.`,
  ];
  const start = seedOf(key) % opts.length;
  for (let i = 0; i < opts.length; i++) {
    const d = opts[(start + i) % opts.length];
    if (d.length <= 158) return d;
  }
  return opts[2];
}
