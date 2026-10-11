"use client";

import { useEffect, useState } from "react";

/**
 * When the ad tags (Google Ads gtag, Meta Pixel) are allowed to load.
 *
 * They are ~400 KB of third-party script — about half of every page — and
 * loading them at window `load` cost 0.2–3 s of main-thread blocking on
 * phones (Google PageSpeed sweep of all 1,488 pages, 10/10). They now load:
 *
 *  - IMMEDIATELY for anyone the ads care about: a landing URL carrying a
 *    click id or utm tag (gclid / gbraid / wbraid / fbclid / msclkid /
 *    utm_*), or a browser that already holds an ad-click cookie
 *    (_gcl_aw, _gcl_gb, _fbc). Attribution and the call-tracking number
 *    swap behave exactly as before for these visitors.
 *  - otherwise on the visitor's first interaction (scroll, tap, key,
 *    pointer move), or 5 s after the page finishes loading, whichever
 *    comes first.
 *
 * Every conversion (form submit, phone tap) needs an interaction first,
 * and events fired before a tag is up are queued and flushed (dataLayer
 * for gtag, __fbqPending for the pixel), so no conversion is dropped.
 * The only thing no longer sent is the pageview of a non-ad visitor who
 * leaves within 5 s without touching the page.
 *
 * To go back to loading at window load, make `useTrackerGate` return true.
 */

const CLICK_PARAM = /[?&](gclid|gbraid|wbraid|fbclid|msclkid|utm_[a-z]+)=/i;
const CLICK_COOKIE = /(?:^|;\s*)(_gcl_aw|_gcl_gb|_fbc)=/;
const EVENTS = ["pointerdown", "pointermove", "keydown", "touchstart", "scroll", "wheel"] as const;
const IDLE_MS = 5000;

let open = false;
const listeners = new Set<() => void>();

function openGate() {
  if (open) return;
  open = true;
  listeners.forEach((fn) => fn());
  listeners.clear();
}

let armed = false;
function arm() {
  if (armed || open) return;
  armed = true;
  if (CLICK_PARAM.test(window.location.search) || CLICK_COOKIE.test(document.cookie)) {
    openGate();
    return;
  }
  const onInteract = () => {
    EVENTS.forEach((e) => window.removeEventListener(e, onInteract));
    openGate();
  };
  EVENTS.forEach((e) => window.addEventListener(e, onInteract, { passive: true }));
  const startTimer = () => window.setTimeout(onInteract, IDLE_MS);
  if (document.readyState === "complete") startTimer();
  else window.addEventListener("load", startTimer, { once: true });
}

export function useTrackerGate(): boolean {
  const [ready, setReady] = useState(open);
  useEffect(() => {
    if (open) {
      setReady(true);
      return;
    }
    const fn = () => setReady(true);
    listeners.add(fn);
    arm();
    return () => {
      listeners.delete(fn);
    };
  }, []);
  return ready;
}
