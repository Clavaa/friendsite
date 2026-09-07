/**
 * Proof chip — Style Bible signature component #2: small white pills of
 * verifiable fact pinned to imagery. Keep copy to claims the config can
 * back ("In-network with most plans", "Serving Wichita & Denver metro").
 */
export default function ProofChip({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-ink shadow-chip ${className}`}
    >
      <svg
        aria-hidden="true"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="shrink-0 text-meadow"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2.5 7.5l3 3 6-7" />
      </svg>
      {children}
    </span>
  );
}
