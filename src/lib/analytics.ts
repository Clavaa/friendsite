/**
 * Tiny analytics event helper. Fires only for the platforms that are
 * configured via env (GA4, Google Ads, Meta Pixel); otherwise a silent
 * no-op, so call sites never need to check.
 *
 * PHI rule: send event names and coarse labels ONLY — never form field
 * values, names, phone numbers, or anything a family typed. No Meta
 * Advanced Matching.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
    fbq?: (...args: unknown[]) => void;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID; // e.g. AW-18443717912
export const GADS_LEAD_LABEL = process.env.NEXT_PUBLIC_GADS_LEAD_LABEL;
export const GADS_CALL_LABEL = process.env.NEXT_PUBLIC_GADS_CALL_LABEL;
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

const GTAG_ENABLED = Boolean(GA_MEASUREMENT_ID || GOOGLE_ADS_ID);

function gtagShim(...args: unknown[]) {
  // Same shim gtag.js uses — events fired before the script finishes
  // loading are queued on the dataLayer and flushed once it's up.
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  window.gtag(...args);
}

export function track(
  event: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined") return;

  if (GTAG_ENABLED) {
    gtagShim("event", event, params ?? {});
    // Google Ads lead conversion rides the same form-success signal.
    if (event === "generate_lead" && GOOGLE_ADS_ID && GADS_LEAD_LABEL) {
      gtagShim("event", "conversion", {
        send_to: `${GOOGLE_ADS_ID}/${GADS_LEAD_LABEL}`,
      });
    }
  }

  // Meta Pixel standard events (event name only, never field values).
  if (META_PIXEL_ID && typeof window.fbq === "function") {
    if (event === "generate_lead") window.fbq("track", "Lead");
    else if (event === "phone_click") window.fbq("track", "Contact");
  }
}
