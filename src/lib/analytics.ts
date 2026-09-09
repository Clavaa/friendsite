/**
 * Tiny GA4 event helper. Fires only when GA is configured (the
 * GoogleAnalytics component has loaded gtag); otherwise a silent no-op,
 * so call sites never need to check.
 *
 * PHI rule: send event names and coarse labels ONLY — never form field
 * values, names, phone numbers, or anything a family typed.
 */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export function track(
  event: string,
  params?: Record<string, string | number | boolean>
) {
  if (typeof window === "undefined" || !GA_MEASUREMENT_ID) return;
  // Same shim gtag.js uses — events fired before the script finishes
  // loading are queued on the dataLayer and flushed once it's up.
  window.dataLayer = window.dataLayer || [];
  window.gtag =
    window.gtag ||
    function gtag() {
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer!.push(arguments);
    };
  window.gtag("event", event, params ?? {});
}
