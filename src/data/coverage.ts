import type { StateSlug } from "../../site.config";

/**
 * Condensed coverage card shared by the county and town pages —
 * deliberately vague per the client's rule: no program names, no waiver
 * detail, no payer lists. Everything routes to the free benefit check.
 */
export const coverageCard: Record<
  StateSlug,
  { heading: string; facts: string[] }
> = {
  kansas: {
    heading: "Paying for ABA — the short version",
    facts: [
      "Coverage varies by plan, so we check yours instead of guessing — the benefit check is free.",
      "Most Kansas families pay little or nothing once benefits are confirmed, Medicaid or private.",
      "Send one photo of your insurance card; we verify your ABA benefits directly with your plan.",
      "You get a plain-English answer — what's covered, what you'd owe, what happens next — usually within a business day.",
    ],
  },
  colorado: {
    heading: "Paying for ABA — the short version",
    facts: [
      "Coverage varies by plan, so we check yours instead of guessing — the benefit check is free.",
      "Most Colorado families pay little or nothing once benefits are confirmed, Medicaid or private.",
      "Send one photo of your insurance card; we verify your ABA benefits directly with your plan.",
      "You get a plain-English answer — what's covered, what you'd owe, what happens next — usually within a business day.",
    ],
  },
};
