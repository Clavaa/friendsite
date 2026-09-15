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

  /**
   * Toll-free line — rendered as THE call pill in the utility top bar
   * (desktop + mobile), per the client. The local (303) number stays
   * everywhere else it appears (hero call pill, sticky call bar, CTA
   * bands, footer, JSON-LD). Set both to null to fall back to the
   * local number in the top bar.
   *
   * ==========================================================================
   * IMPORTANT — GOOGLE ADS CALL-CONVERSION TRACKING (read before touching
   * either number): src/components/GoogleAnalytics.tsx configures Google's
   * website-call conversion with `phone_conversion_number` = the number
   * DISPLAYED on the page (currently siteConfig.phone, the 303 line). That
   * existing call-conversion action still covers every placement that shows
   * the 303 number. The top bar now DISPLAYS this toll-free number instead,
   * so the ads team MUST create a SECOND call-conversion action for
   * (888) 248-3433 — until it exists, top-bar calls are NOT tracked by
   * Google's number-swap. Never silently repoint the existing 303 action.
   * ==========================================================================
   */
  tollFreePhone: "(888) 248-3433" as string | null,
  tollFreePhoneHref: "tel:+18882483433" as string | null,

  /**
   * Instagram profile URL. When set, an Instagram icon link renders in the
   * footer's contact cluster. TODO: client is sending the Instagram link —
   * paste the full profile URL here (e.g. "https://www.instagram.com/…").
   */
  instagramUrl: null as string | null,

  /**
   * Indeed company/jobs URL. When set, the careers page shows a prominent
   * "See our openings on Indeed" button alongside the role cards.
   * TODO: client is sending the Indeed link — paste the full URL here.
   */
  indeedUrl: null as string | null,

  /**
   * Clinical reviewer for every parent guide (/resources/*) and parent
   * question (/questions/*) article — rendered as the "Clinically reviewed
   * by …" chip and merged into each article's JSON-LD as `reviewedBy`.
   * Ruth is the only named person on the site (client rule); keep this in
   * sync with the About page if her credentials line ever changes.
   */
  clinicalReviewer: {
    name: "Ruth Gluck",
    jobTitle: "MSEd, BCBA",
  },

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
   * Modality chip strip shown in the hero. Must always match the services
   * we actually offer — these are the only claims the hero is allowed to
   * make. `soon: true` renders a "coming soon" treatment instead of a check.
   */
  trustChecklist: [
    { label: "In-home ABA", soon: false },
    { label: "Daycare-based", soon: false },
    { label: "Telehealth", soon: false },
    { label: "In-center", soon: true },
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
   * stay empty until credentialing is confirmed per payer — while empty the
   * wall renders only the honest welcome pills (no placeholder boxes; the
   * client read the old dashed "pending" slots as broken empty boxes).
   */
  coverage: {
    kansas: {
      medicaid: "KanCare (Kansas Medicaid)",
      payers: [] as readonly string[],
    },
    colorado: {
      medicaid: "Health First Colorado (Medicaid)",
      payers: [] as readonly string[],
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

  /**
   * Student-analyst (BCBA-track) program eligibility. The careers page
   * renders these numbers directly — edit here, never in the page copy.
   */
  studentAnalystProgram: {
    /** Minimum unrestricted supervised fieldwork hours already completed. */
    unrestrictedHours: 680,
    /** Minimum restricted supervised fieldwork hours already completed. */
    restrictedHours: 280,
    /** How close to BCBA exam eligibility, in months (approximate). */
    monthsToExamEligibility: 6,
    /** Role tag used in the application path / email subject. */
    roleTag: "student-analyst",
  },

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
