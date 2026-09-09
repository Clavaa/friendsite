"use client";

import { useEffect, useRef } from "react";

/**
 * Scroll companion: a tiny stylized bird that glides down a subtle track
 * on the right edge as you scroll the page — a playful progress
 * indicator.
 *
 * Rules it lives by:
 * - The glyph is an original mini-bird (brand-teal body, sun-gold wing),
 *   deliberately NOT the logo mark — small enough to read as a companion.
 * - CSS + rAF only, no libraries. The rAF loop only writes when the
 *   position actually changed.
 * - Desktop only (hidden below lg) so it never crowds phone screens.
 * - Fully disabled under prefers-reduced-motion (CSS hides it AND the
 *   effect bails before wiring any listeners).
 * - aria-hidden + pointer-events-none: purely decorative.
 */
export default function ScrollBird() {
  const trackRef = useRef<HTMLDivElement>(null);
  const birdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let current = -1; // forces the first paint
    let target = 0;

    const measure = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      target = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const tick = () => {
      raf = requestAnimationFrame(tick);
      const bird = birdRef.current;
      const track = trackRef.current;
      if (!bird || !track) return;
      const delta = target - current;
      if (Math.abs(delta) < 0.0004) return; // settled — skip the write
      current = current < 0 ? target : current + delta * 0.09;
      const travel = Math.max(0, track.clientHeight - 30);
      const y = current * travel;
      // gentle S-curve sway + a nose-down/up tilt from scroll direction
      const sway = Math.sin(current * Math.PI * 5) * 7;
      const tilt = Math.max(-16, Math.min(16, delta * 260));
      bird.style.transform = `translate3d(${sway}px, ${y}px, 0) rotate(${tilt}deg)`;
    };

    measure();
    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={trackRef}
      aria-hidden="true"
      className="pointer-events-none fixed right-4 top-1/2 z-30 hidden h-[64vh] w-12 -translate-y-1/2 select-none motion-reduce:hidden lg:block"
    >
      {/* the flight path: a whisper of a line ending at a little sun */}
      <span className="absolute bottom-3 right-[17px] top-0 w-0.5 rounded-full bg-ink/10" />
      <span className="absolute -bottom-0.5 right-[12px] h-3 w-3 rounded-full bg-sun shadow-chip" />
      <div ref={birdRef} className="absolute right-0 top-0 will-change-transform">
        {/* original mini-bird glyph — not the logo mark */}
        <svg
          width="36"
          height="30"
          viewBox="0 0 40 32"
          fill="none"
          style={{ filter: "drop-shadow(0 2px 5px rgba(15,58,71,0.25))" }}
        >
          <path
            d="M5 19 C10 11 19 8.5 26 12 C29 8.5 33.5 7.5 37 8.5 C35 11.5 32.5 13.5 29.5 14.4 C28.6 22 20 27.5 11 25.5 C8 24.7 6 22.3 5 19 Z"
            fill="var(--color-brand-teal)"
          />
          <path
            d="M14 14.5 C17 6.5 25 4 31 6 C27.5 11.5 21.5 15 15.5 15.8 Z"
            fill="var(--color-sun)"
          />
          <circle cx="32.6" cy="10.6" r="1.3" fill="#fff" />
        </svg>
      </div>
    </div>
  );
}
