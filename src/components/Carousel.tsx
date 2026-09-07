"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Horizontal scroll carousel with the round prev/next buttons centered
 * beneath it — prev renders ghosted/disabled at the left edge, next
 * outlined, exactly the affordance pattern of a premium scroller.
 * Pure scroll under the hood: swipe, trackpad and keyboard all still work.
 */
export default function Carousel({
  children,
  step = 560,
  ariaLabel,
  className = "",
  trackClassName = "",
}: {
  children: React.ReactNode;
  step?: number;
  ariaLabel: string;
  className?: string;
  trackClassName?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);

  const update = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    // 28px tolerance: snap can settle a padding-width in from either edge.
    setAtStart(el.scrollLeft <= 28);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 28);
  }, []);

  useEffect(() => {
    update();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  const scroll = (dir: 1 | -1) =>
    trackRef.current?.scrollBy({ left: dir * step, behavior: "smooth" });

  const btnBase =
    "grid h-12 w-12 place-items-center rounded-full transition-colors";

  return (
    <div className={className}>
      <div
        ref={trackRef}
        role="region"
        aria-label={ariaLabel}
        tabIndex={0}
        className={`no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth ${trackClassName}`}
      >
        {children}
      </div>
      <div className="mt-8 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => scroll(-1)}
          disabled={atStart}
          aria-label="Previous"
          className={`${btnBase} ${
            atStart
              ? "cursor-default bg-ink/5 text-ink/30"
              : "border-2 border-ink text-ink hover:bg-ink hover:text-white"
          }`}
        >
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => scroll(1)}
          disabled={atEnd}
          aria-label="Next"
          className={`${btnBase} ${
            atEnd
              ? "cursor-default bg-ink/5 text-ink/30"
              : "border-2 border-ink text-ink hover:bg-ink hover:text-white"
          }`}
        >
          <svg aria-hidden="true" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>
    </div>
  );
}
