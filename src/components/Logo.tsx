// TODO: replace with client-supplied logo file when received.
/**
 * Sunbird ABA Therapy logo.
 *
 * Original line-drawn hummingbird mark — side profile facing right, long
 * curved beak, swept-back wing — drawn in brand teal, with the wing as a
 * thin rainbow-gradient arc (coral → apricot → butter → meadow), echoing
 * the site's signature rainbow strip. Wordmark "Sunbird" in the display
 * serif with a letterspaced "ABA THERAPY" subline.
 *
 * variant="reverse" renders white strokes/wordmark for the dark petrol
 * footer; the gradient wing stays full-color in both variants.
 */

function BirdMark({
  stroke,
  gradientId,
  className,
}: {
  stroke: string;
  gradientId: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 48 44"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          x1="4.5"
          y1="9"
          x2="22"
          y2="23"
        >
          <stop offset="0" stopColor="#E85D4A" />
          <stop offset="0.38" stopColor="#F5A930" />
          <stop offset="0.68" stopColor="#F2C94C" />
          <stop offset="1" stopColor="#3E9C76" />
        </linearGradient>
      </defs>
      {/* back: tail → head */}
      <path
        d="M7 40 C11 31 14 22 23 17.5 C29 14.6 35.5 15.4 38.5 19"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* breast/belly */}
      <path
        d="M15 40 C21 36 25.5 30.5 27.5 24"
        stroke={stroke}
        strokeWidth="3"
        strokeLinecap="round"
      />
      {/* long curved hummingbird beak */}
      <path
        d="M38.5 19 C42.5 18 45.5 19.5 47 22.5"
        stroke={stroke}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* eye */}
      <circle cx="33.5" cy="20" r="1.7" fill={stroke} />
      {/* swept-back wing — the rainbow arc */}
      <path
        d="M22 18.5 C17 11.5 11 8.5 4.5 9.5 C8.5 13.5 10.5 18.5 12.5 24.5"
        stroke={`url(#${gradientId})`}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Logo({
  variant = "default",
  className = "",
}: {
  variant?: "default" | "reverse";
  className?: string;
}) {
  const reverse = variant === "reverse";
  return (
    <span className={`flex items-center gap-2.5 ${className}`}>
      <BirdMark
        stroke={reverse ? "#ffffff" : "var(--color-brand-teal)"}
        gradientId={`sunbird-wing-${variant}`}
        className="h-9 w-auto shrink-0"
      />
      <span className="flex flex-col justify-center leading-none">
        <span
          className={`font-display text-[1.4rem] leading-none ${
            reverse ? "text-white" : "text-brand-teal"
          }`}
        >
          Sunbird
        </span>
        <span
          className={`mt-1 text-[8.5px] font-bold uppercase leading-none tracking-[0.34em] ${
            reverse ? "text-white/75" : "text-ink-soft"
          }`}
        >
          ABA Therapy
        </span>
      </span>
    </span>
  );
}
