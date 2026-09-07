"use client";

import Image from "next/image";
import { useState } from "react";

export type TourPhoto = {
  src: string;
  alt: string;
  caption: string;
};

/**
 * Photo tour panel: one large rounded photo with a translucent control bar
 * (prev/next) overlaid bottom-left and a caption chip bottom-right —
 * the classic gallery treatment, no library needed.
 */
export default function PhotoTour({ photos }: { photos: readonly TourPhoto[] }) {
  const [i, setI] = useState(0);
  const go = (d: 1 | -1) => setI((i + d + photos.length) % photos.length);
  const p = photos[i];

  const arrowBtn =
    "grid h-9 w-9 place-items-center rounded-full text-white transition-colors hover:bg-white/25";

  return (
    <div className="relative aspect-[5/4] overflow-hidden rounded-3xl lg:aspect-auto lg:h-full lg:min-h-[42rem]">
      {photos.map((photo, idx) => (
        <Image
          key={photo.src + photo.caption}
          src={photo.src}
          alt={idx === i ? photo.alt : ""}
          fill
          sizes="(min-width: 1024px) 50rem, 100vw"
          className={`object-cover transition-opacity duration-500 ${
            idx === i ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden={idx !== i}
          priority={idx === 0 ? false : undefined}
        />
      ))}

      {/* control bar, bottom-left */}
      <div className="absolute bottom-5 left-5 flex items-center gap-1 rounded-full bg-ink/45 p-1.5 backdrop-blur-sm">
        <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className={arrowBtn}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 3L5 8l5 5" />
          </svg>
        </button>
        <span className="px-1 text-[12px] font-bold text-white" aria-live="polite">
          {i + 1} / {photos.length}
        </span>
        <button type="button" onClick={() => go(1)} aria-label="Next photo" className={arrowBtn}>
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3l5 5-5 5" />
          </svg>
        </button>
      </div>

      {/* caption chip, bottom-right */}
      <span className="absolute bottom-5 right-5 rounded-full bg-ink/45 px-4 py-1.5 text-[13px] font-bold text-white backdrop-blur-sm">
        {p.caption}
      </span>
    </div>
  );
}
