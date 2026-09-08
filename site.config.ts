/**
 * Central site configuration.
 * Everything a launch team needs to swap lives here — brand, contact,
 * cities, stats, reviews. Items marked TODO are placeholders and MUST be
 * replaced with real, verifiable facts before launch. Nothing on the site
 * should claim more than what is configured here.
 */

export const siteConfig = {
  brandName: "Sunbird ABA Therapy",
  brandShort: "Sunbird ABA",

  /** Brand tagline — rendered in the hero with the second sentence in italic teal. */
  tagline: "Progress you can see. Support you can feel.",
  taglineLead: "Progress you can see.",
  taglineFeel: "Support you can feel.",
  /** Small eyebrow line above the hero headline. */
  eyebrow: "Helping every child soar",
  /** One-line service descriptor used in the footer and meta copy. */
  descriptor: "BCBA-led ABA therapy for Kansas and Colorado families",

  phone: "(303) 483-7833",
  phoneHref: "tel:+13034837833",

  // ============================================================================
  // TODO — LOUD: CONFIRM the friend actually owns sunbirdaba.com
  // (registered 7/30/2026 via NameCheap — verify it's HIS registration, not a
  // squatter's). Fallback sunbird-aba.com is available if it isn't.
  // ============================================================================
  domain: "https://sunbirdaba.com",

  // TODO: confirm the real intake inbox once the domain + mailbox are live.
  email: "info@sunbirdaba.com", // SendGrid-verified sender,
  leadNotificationEmail: "info@sunbirdaba.com",

  /**
   * Trust checklist shown in the hero. Keep these three claims accurate:
   * they are the only claims the hero is allowed to make.
   */
  trustChecklist: [
    "Family-centered",
    "Individualized care",
    "In-home support",
  ],

  /**
   * Stat band figures. TODO: replace every value with a real, verifiable
   * number before launch — the UI renders these as-is and labels nothing
   * it cannot back up. Leave `value` empty ("") to hide a stat entirely.
   */
  stats: [
    { value: "", label: "families served", todo: "TODO: real families-served count" },
    { value: "", label: "board-certified BCBAs", todo: "TODO: real BCBA headcount" },
    { value: "", label: "average days to start", todo: "TODO: real median intake-to-start days" },
    { value: "2", label: "states, one local team", todo: "" },
  ],

  /**
   * Public rating pills for the utility top bar. TODO: fill `score` with the
   * real, current figure from each platform before launch — the bar renders
   * nothing for a pill whose score is empty, and the whole rating cluster
   * hides until at least one real score exists. Never type a hoped-for number.
   */
  ratings: [
    { source: "Google", score: "", by: "parents", todo: "TODO: real Google rating" },
    { source: "Indeed", score: "", by: "team members", todo: "TODO: real Indeed rating" },
  ],

  /**
   * Coverage wall. `medicaid` names each state's Medicaid program (public
   * fact, safe to show). `payers` lists in-network commercial plans and MUST
   * stay empty until credentialing is confirmed per payer — the wall renders
   * clearly-labeled pending slots until then, never a fabricated logo row.
   */
  coverage: {
    kansas: {
      medicaid: "KanCare (Kansas Medicaid)",
      payers: [] as readonly string[],
      pendingSlots: 4,
    },
    colorado: {
      medicaid: "Health First Colorado (Medicaid)",
      payers: [] as readonly string[],
      pendingSlots: 4,
    },
  },

  /**
   * Google reviews. TODO: replace with real, consented, named + dated
   * Google reviews before launch. The section renders a clearly-labeled
   * placeholder state until at least one review has `quote` filled in.
   */
  reviews: [
    { quote: "", author: "", city: "", date: "", todo: "TODO: real consented Google review" },
    { quote: "", author: "", city: "", date: "", todo: "TODO: real consented Google review" },
    { quote: "", author: "", city: "", date: "", todo: "TODO: real consented Google review" },
  ],
  // TODO: real Google Business Profile review link for each location.
  googleReviewUrl: "",

  states: {
    kansas: {
      name: "Kansas",
      abbr: "KS",
      slug: "kansas",
      cities: [
        { name: "Wichita", slug: "wichita" },
        { name: "Overland Park", slug: "overland-park" },
        { name: "Kansas City", slug: "kansas-city", displaySuffix: "KS" },
        { name: "Olathe", slug: "olathe" },
        { name: "Topeka", slug: "topeka" },
      ],
    },
    colorado: {
      name: "Colorado",
      abbr: "CO",
      slug: "colorado",
      cities: [
        { name: "Denver", slug: "denver" },
        { name: "Colorado Springs", slug: "colorado-springs" },
        { name: "Aurora", slug: "aurora" },
        { name: "Fort Collins", slug: "fort-collins" },
        { name: "Lakewood", slug: "lakewood" },
      ],
    },
  },
} as const;

export type StateSlug = keyof typeof siteConfig.states;

export const stateSlugs = Object.keys(siteConfig.states) as StateSlug[];

export function isStateSlug(s: string): s is StateSlug {
  return s in siteConfig.states;
}
