"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * First-party traffic beacon. ~1KB, no cookies, no third party, no ad network.
 * Ported from the sproutwell (aba-national) implementation.
 *
 * Sends a "view" when a page opens and a "leave" when it closes, carrying the
 * time the page was actually VISIBLE — a tab left open in the background
 * doesn't accumulate time, which is what makes the dwell figure worth
 * reading. Scroll depth rides along on the same event. Forms fire a "lead"
 * ping on success via pingLead() — the ping carries the path only, never
 * anything typed into the form (PHI rule).
 *
 * Opting yourself out: visit any page with ?internal=1 once. The flag is kept
 * in this browser's own storage and marks your events so the reports can
 * exclude them.
 */

const ENDPOINT = "/api/t";
const KEY_INTERNAL = "sb_internal";
const KEY_SESSION = "sb_session";

function sessionId(): string {
  try {
    const found = sessionStorage.getItem(KEY_SESSION);
    if (found) return found;
    const made = Math.random().toString(36).slice(2, 14);
    sessionStorage.setItem(KEY_SESSION, made);
    return made;
  } catch {
    return "nostorage";
  }
}

function isInternal(): boolean {
  try {
    return localStorage.getItem(KEY_INTERNAL) === "1";
  } catch {
    return false;
  }
}

function send(payload: Record<string, unknown>, beacon: boolean) {
  const body = JSON.stringify(payload);
  try {
    if (beacon && typeof navigator.sendBeacon === "function") {
      // sendBeacon survives the page going away; fetch does not.
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
      return;
    }
    void fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    });
  } catch {
    /* never let analytics throw into a page */
  }
}

/**
 * Fire-and-forget "a form on this page succeeded" ping. Call it from a form's
 * success path. Carries the current path and session only — no form contents.
 */
export function pingLead() {
  try {
    send(
      {
        p: window.location.pathname,
        s: sessionId(),
        i: isInternal(),
        k: "lead",
      },
      true
    );
  } catch {
    /* a lead must never fail because analytics did */
  }
}

export default function TrafficBeacon() {
  const pathname = usePathname();
  const search = useSearchParams();

  /* Visible-time accounting, kept in refs so a re-render never disturbs it. */
  const visibleMs = useRef(0);
  const lastShown = useRef<number>(0);
  const maxScroll = useRef(0);
  const sent = useRef(false);

  useEffect(() => {
    if (search.get("internal") === "1") {
      try {
        localStorage.setItem(KEY_INTERNAL, "1");
      } catch {
        /* storage can be blocked; the opt-out simply won't stick */
      }
    }
    const internal = isInternal();
    const session = sessionId();

    visibleMs.current = 0;
    lastShown.current = Date.now();
    maxScroll.current = 0;
    sent.current = false;

    const base = {
      p: pathname,
      s: session,
      i: internal,
      t: document.title.slice(0, 200),
      us: search.get("utm_source"),
      um: search.get("utm_medium"),
      uc: search.get("utm_campaign"),
    };

    send(
      {
        ...base,
        k: "view",
        r: document.referrer || null,
        e: !sessionStorage.getItem("sb_seen"),
      },
      false
    );
    try {
      sessionStorage.setItem("sb_seen", "1");
    } catch {
      /* first-view marking is a nicety, not a requirement */
    }

    const onScroll = () => {
      const h = document.documentElement;
      const denom = h.scrollHeight - h.clientHeight;
      if (denom <= 0) return;
      const pct = Math.round(((h.scrollTop || window.scrollY) / denom) * 100);
      if (pct > maxScroll.current) maxScroll.current = Math.min(pct, 100);
    };

    const accrue = () => {
      if (document.visibilityState === "visible") {
        lastShown.current = Date.now();
      } else {
        visibleMs.current += Date.now() - lastShown.current;
      }
    };

    const finish = () => {
      if (sent.current) return;
      sent.current = true;
      if (document.visibilityState === "visible") {
        visibleMs.current += Date.now() - lastShown.current;
      }
      send(
        { ...base, k: "leave", d: visibleMs.current, sc: maxScroll.current },
        true
      );
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", accrue);
    window.addEventListener("pagehide", finish);

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", accrue);
      window.removeEventListener("pagehide", finish);
      // A client-side route change unmounts this effect: close the old page out.
      finish();
    };
  }, [pathname, search]);

  return null;
}
