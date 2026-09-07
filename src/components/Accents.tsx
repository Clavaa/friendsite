/**
 * Sunbird's original decorative accent set — every mark drawn from scratch
 * in the brand language (sun-gold rays, teal line-work, the hummingbird,
 * feather squiggles, hand-drawn underlines, star/dot sparkles).
 * All are aria-hidden decoration; nothing here is traced from anywhere.
 */

/** Rising sun with stitched-texture rays — the hero's horizon guest. */
export function RisingSun({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 560 300"
      className={className}
      fill="none"
    >
      {/* rays */}
      <g stroke="var(--color-sun)" strokeWidth="10" strokeLinecap="round" opacity="0.9">
        <path d="M280 22v34" />
        <path d="M170 52l20 28" />
        <path d="M390 52l-20 28" />
        <path d="M86 128l32 16" />
        <path d="M474 128l-32 16" />
      </g>
      {/* sun disc, cresting the bottom edge */}
      <circle cx="280" cy="310" r="200" fill="var(--color-sun)" />
      <circle cx="280" cy="310" r="200" fill="url(#sun-grain)" opacity="0.25" />
      <defs>
        <radialGradient id="sun-grain" cx="0.5" cy="0.28" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="1" stopColor="#f5a930" stopOpacity="0.9" />
        </radialGradient>
      </defs>
      {/* hummingbird skimming toward the sun (scaled cousin of the logo mark) */}
      <g transform="translate(30 14) scale(0.78)">
        <path
          d="M18 100 C28 78 36 55 58 44 C73 37 89 39 96 48"
          stroke="var(--color-brand-teal)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M38 100 C52 90 64 76 69 60"
          stroke="var(--color-brand-teal)"
          strokeWidth="9"
          strokeLinecap="round"
        />
        <path
          d="M96 48 C106 45.5 113 49 117 56"
          stroke="var(--color-brand-teal)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <circle cx="84" cy="50" r="5.5" fill="var(--color-brand-teal)" />
        <path
          d="M56 46 C44 29 29 21 13 24 C23 34 28 46 33 61"
          stroke="var(--color-sun)"
          strokeWidth="9"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

/** Small line-drawn hummingbird spot illustration (larger cousin of the logo). */
export function BirdSpot({
  className = "",
  stroke = "var(--color-brand-teal)",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 110" fill="none" className={className}>
      <path
        d="M18 100 C28 78 36 55 58 44 C73 37 89 39 96 48"
        stroke={stroke}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M38 100 C52 90 64 76 69 60"
        stroke={stroke}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M96 48 C106 45.5 113 49 117 56"
        stroke={stroke}
        strokeWidth="5"
        strokeLinecap="round"
      />
      <circle cx="84" cy="50" r="4" fill={stroke} />
      <path
        d="M56 46 C44 29 29 21 13 24 C23 34 28 46 33 61"
        stroke="var(--color-sun)"
        strokeWidth="6"
        strokeLinecap="round"
      />
      {/* wing-beat ticks */}
      <path d="M76 20l6-10 M92 26l9-7" stroke="var(--color-sun)" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}

/** Sun-gold sunburst spot (rays around a disc). */
export function SunSpot({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 110 110" fill="none" className={className}>
      <circle cx="55" cy="55" r="26" fill="var(--color-sun)" />
      <g stroke="var(--color-brand-teal)" strokeWidth="6" strokeLinecap="round">
        <path d="M55 8v14" />
        <path d="M55 88v14" />
        <path d="M8 55h14" />
        <path d="M88 55h14" />
        <path d="M22 22l10 10" />
        <path d="M78 78l10 10" />
        <path d="M88 22L78 32" />
        <path d="M32 78L22 88" />
      </g>
    </svg>
  );
}

/** Loose feather squiggle in teal with a gold rib. */
export function FeatherSpot({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 110 110" fill="none" className={className}>
      <path
        d="M22 92 C24 62 38 34 70 20 C82 40 80 68 58 86 C46 95 33 96 22 92Z"
        stroke="var(--color-brand-teal)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M28 86 C42 68 55 50 68 26"
        stroke="var(--color-sun)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M40 70l14 3 M50 54l13 4 M59 40l11 4" stroke="var(--color-brand-teal)" strokeWidth="4.5" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

/** Star + dot sparkle cluster in sun-gold and teal. */
export function Sparkles({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 90" fill="none" className={className}>
      <path
        d="M32 12 l6 14 14 6 -14 6 -6 14 -6 -14 -14 -6 14 -6Z"
        fill="var(--color-sun)"
      />
      <path
        d="M88 34 l4.5 10 10 4.5 -10 4.5 -4.5 10 -4.5 -10 -10 -4.5 10 -4.5Z"
        fill="var(--color-brand-teal)"
        opacity="0.85"
      />
      <circle cx="66" cy="16" r="5" fill="var(--color-brand-teal)" opacity="0.6" />
      <circle cx="56" cy="72" r="6" fill="var(--color-sun)" />
    </svg>
  );
}

/** Hand-drawn brush underline for a single headline word. */
export function HandUnderline({
  className = "",
  stroke = "var(--color-sun)",
}: {
  className?: string;
  stroke?: string;
}) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 220 26"
      fill="none"
      preserveAspectRatio="none"
      className={className}
    >
      <path
        d="M6 16 C58 8 128 6 214 11 M40 20 C90 15 150 14 196 17"
        stroke={stroke}
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Curved label text arcing along a quarter-circle (for paired cards). */
export function ArcLabel({
  text,
  id,
  className = "",
}: {
  text: string;
  id: string;
  className?: string;
}) {
  return (
    <svg aria-hidden="true" viewBox="0 0 110 110" fill="none" className={className}>
      <defs>
        <path id={id} d="M8 108 A 100 100 0 0 1 108 8" />
      </defs>
      <text
        fill="currentColor"
        fontSize="11"
        fontWeight="800"
        letterSpacing="1.6"
        fontFamily="var(--font-sans)"
      >
        <textPath href={`#${id}`}>{text}</textPath>
      </text>
    </svg>
  );
}

/** Scattered paper-scrap shapes for the email panel. */
export function PaperBits({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 120 120" fill="none" className={className}>
      <rect x="14" y="18" width="26" height="20" rx="3" fill="#fff" opacity="0.9" transform="rotate(-14 27 28)" />
      <rect x="78" y="30" width="24" height="18" rx="3" fill="#fff" opacity="0.75" transform="rotate(11 90 39)" />
      <rect x="46" y="76" width="22" height="16" rx="3" fill="#fff" opacity="0.6" transform="rotate(-7 57 84)" />
    </svg>
  );
}
