import Link from "next/link";
import { siteConfig } from "../../site.config";

/**
 * Sticky mobile call bar (Style Bible signature component + CRO spine:
 * phone-first category, call bar everywhere on mobile).
 * `callLabel` lets each page localize the button — "Call the Wichita team",
 * "Call the Denver team", etc.
 */
export default function StickyCallBar({
  callLabel = "Call the team",
}: {
  callLabel?: string;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-white/97 px-3 pb-[max(env(safe-area-inset-bottom),0.625rem)] pt-2.5 shadow-[0_-4px_20px_rgba(15,58,71,0.12)] backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md gap-2">
        <a
          href={siteConfig.phoneHref}
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-brand-teal px-4 py-3 text-[15px] font-bold text-white"
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="currentColor"
          >
            <path d="M3.7 1.3a1 1 0 0 1 1.1.3l1.7 2.1a1 1 0 0 1 0 1.3L5.4 6.2a9.6 9.6 0 0 0 4.4 4.4l1.2-1.1a1 1 0 0 1 1.3 0l2.1 1.7a1 1 0 0 1 .2 1.4l-1 1.4a2 2 0 0 1-2.2.7C7.6 13.5 2.5 8.4 1.3 4.6a2 2 0 0 1 .7-2.2l1.7-1Z" />
          </svg>
          {callLabel}
        </a>
        <Link
          href="/getting-started"
          className="flex flex-1 items-center justify-center rounded-full border-2 border-brand-teal bg-white px-4 py-3 text-center text-[15px] font-bold leading-tight text-brand-teal-deep"
        >
          Match me with an advocate
        </Link>
      </div>
    </div>
  );
}
