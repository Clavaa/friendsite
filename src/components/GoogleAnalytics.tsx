"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  GADS_CALL_LABEL,
  track,
} from "../lib/analytics";
import { siteConfig } from "../../site.config";

/**
 * Google tag loader (GA4 + Google Ads) — renders nothing unless at least
 * one of NEXT_PUBLIC_GA_MEASUREMENT_ID / NEXT_PUBLIC_GOOGLE_ADS_ID is set.
 *
 * - One gtag.js load serves both products (multiple `config` calls).
 * - GA4: anonymize_ip on; send_page_view off (manual page_view per route
 *   change via the effect below, so App Router client navs are counted
 *   without double-counting the first load).
 * - Google Ads website-call conversions: when NEXT_PUBLIC_GADS_CALL_LABEL
 *   is set, the extra config with `phone_conversion_number` lets Google
 *   swap the displayed number for ad-click visitors. The number MUST match
 *   the number displayed on the site — it reads from site.config, so if
 *   the displayed phone changes (e.g. new toll-free), get a new call
 *   conversion action for that number from the ads team.
 * - Document-level delegation turns any tel: link click into a
 *   `phone_click` event — covers the sticky call bar, header pill,
 *   CTA bands and every page-body call link without touching them.
 */

function PageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!pathname) return;
    const query = searchParams?.toString();
    track("page_view", {
      page_path: query ? `${pathname}?${query}` : pathname,
      page_location: window.location.href,
      page_title: document.title,
    });
  }, [pathname, searchParams]);

  return null;
}

function PhoneClickTracker() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      const anchor = (e.target as Element | null)?.closest?.(
        'a[href^="tel:"]'
      );
      if (anchor) track("phone_click", { form: "tel_link" });
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

export default function GoogleAnalytics() {
  const loaderId = GA_MEASUREMENT_ID || GOOGLE_ADS_ID;
  if (!loaderId) return null;

  const configs: string[] = [];
  if (GA_MEASUREMENT_ID) {
    configs.push(
      `gtag('config', '${GA_MEASUREMENT_ID}', { anonymize_ip: true, send_page_view: false });`
    );
  }
  if (GOOGLE_ADS_ID) {
    configs.push(`gtag('config', '${GOOGLE_ADS_ID}');`);
    if (GADS_CALL_LABEL) {
      configs.push(
        `gtag('config', '${GOOGLE_ADS_ID}/${GADS_CALL_LABEL}', { 'phone_conversion_number': '${siteConfig.phone}' });`
      );
    }
  }

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${loaderId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          ${configs.join("\n          ")}
        `}
      </Script>
      {/* useSearchParams requires a Suspense boundary in the App Router. */}
      <Suspense fallback={null}>
        <PageViewTracker />
      </Suspense>
      <PhoneClickTracker />
    </>
  );
}
