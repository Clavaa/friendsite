"use client";

import Script from "next/script";
import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GA_MEASUREMENT_ID, track } from "../lib/analytics";

/**
 * GA4 loader — renders nothing unless NEXT_PUBLIC_GA_MEASUREMENT_ID is set.
 *
 * - gtag.js via next/script (afterInteractive), anonymize_ip on.
 * - App Router client-side navigations don't fire page_view on their own,
 *   so a usePathname/useSearchParams effect sends one per route change
 *   (send_page_view is disabled in the initial config to avoid a double
 *   count on first load).
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
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_MEASUREMENT_ID}', {
            anonymize_ip: true,
            send_page_view: false
          });
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
