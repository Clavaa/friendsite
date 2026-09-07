/**
 * Styled image slot. Every instance documents the intended photograph via
 * `intent` (rendered as a visible production note and used for alt-planning).
 * Style Bible photography direction: bright daylight-white interiors,
 * clinician-in-frame with lanyard visible, Colorado outdoor light.
 * No mascot, no illustration — these slots take real photography only.
 */
export default function PhotoPlaceholder({
  intent,
  shape = "rounded",
  className = "",
}: {
  /** Alt-intent: what the final photo must show, e.g. for the art director. */
  intent: string;
  shape?: "rounded" | "circle";
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={`Photo placeholder: ${intent}`}
      className={`relative overflow-hidden bg-gradient-to-br from-sun-wash via-white to-mint-wash ${
        shape === "circle" ? "rounded-full" : "rounded-3xl"
      } ${className}`}
    >
      <div className="absolute inset-0 grid place-items-center p-6">
        <div className="max-w-[26ch] text-center">
          <svg
            aria-hidden="true"
            className="mx-auto mb-3 text-brand-teal/40"
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="4" y="8" width="32" height="24" rx="4" />
            <circle cx="14" cy="17" r="3.5" />
            <path d="M4 28l9-8 7 6 6-5 10 7" />
          </svg>
          <p className="text-[12px] font-semibold tracking-wide text-ink-soft/70">
            Photo slot
          </p>
          <p className="mt-1 text-[12px] leading-snug text-ink-soft/70">
            {intent}
          </p>
        </div>
      </div>
    </div>
  );
}
