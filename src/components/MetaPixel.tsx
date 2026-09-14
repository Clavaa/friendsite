"use client";

import Script from "next/script";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { META_PIXEL_ID } from "../lib/analytics";

/**
 * Meta Pixel loader — renders nothing unless NEXT_PUBLIC_META_PIXEL_ID
 * is set. Standard events only (PageView here; Lead/Contact fired from
 * lib/analytics on form success and phone clicks). No Advanced Matching,
 * no PII, no form field values — event names only.
 */

function RouteChangeTracker() {
  const pathname = usePathname();
  const isFirst = useRef(true);

  useEffect(() => {
    if (!pathname) return;
    // The bootstrap script already fires the initial PageView; only
    // client-side route changes need a manual one.
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    if (typeof window.fbq === "function") window.fbq("track", "PageView");
  }, [pathname]);

  return null;
}

export default function MetaPixel() {
  if (!META_PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`
          !function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '${META_PIXEL_ID}');
          fbq('track', 'PageView');
        `}
      </Script>
      <RouteChangeTracker />
    </>
  );
}
