"use client";

import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * The hero intake card (Style Bible signature component #1).
 * 4 visible fields max per the CRO spine; honeypot field for bots;
 * privacy microcopy uses "confidential and HIPAA-protected" and never
 * the word the CRO research bans.
 */
export default function LeadForm({
  heading = "Get matched with an intake advocate",
  subheading = "Tell us a little about your family. A real person calls you back — usually the same day.",
  compact = false,
  sourcePage = "home",
}: {
  heading?: string;
  subheading?: string;
  compact?: boolean;
  sourcePage?: string;
}) {
  const [status, setStatus] = useState<Status>("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, sourcePage }),
      });
      if (!res.ok) throw new Error(`Lead submit failed: ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-3xl bg-white p-6 shadow-card-lg sm:p-8"
        role="status"
        aria-live="polite"
      >
        <div className="grid h-12 w-12 place-items-center rounded-full bg-meadow-wash text-meadow-deep">
          <svg aria-hidden="true" width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12l5 5 9-11" />
          </svg>
        </div>
        <h3 className="font-display mt-4 text-2xl">Got it — we&rsquo;ll call you.</h3>
        <p className="mt-2 text-ink-soft">
          An intake advocate will reach out shortly, usually the same business
          day. If it&rsquo;s easier to talk now, call us any time.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative overflow-hidden rounded-3xl bg-white shadow-card-lg ${compact ? "p-5 sm:p-6" : "p-6 sm:p-8"}`}
      noValidate={false}
    >
      {/* Signature rainbow strip across the top of the intake card */}
      <div className="rainbow-strip absolute inset-x-0 top-0" aria-hidden="true" />
      <h3 className="font-display text-2xl leading-snug">{heading}</h3>
      <p className="mt-1.5 text-[15px] text-ink-soft">{subheading}</p>

      {/* Honeypot — hidden from people, tempting to bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="lead-website">Website</label>
        <input id="lead-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="lead-name" className="mb-1 block text-sm font-bold">
            Your name
          </label>
          <input
            id="lead-name"
            name="parentName"
            type="text"
            required
            autoComplete="name"
            placeholder="First and last name"
            className="w-full rounded-xl border border-line bg-cream/60 px-3.5 py-2.5 text-[16px] placeholder:text-ink-soft/60 focus:border-brand-teal focus:bg-white"
          />
        </div>
        <div>
          <label htmlFor="lead-phone" className="mb-1 block text-sm font-bold">
            Phone
          </label>
          <input
            id="lead-phone"
            name="phone"
            type="tel"
            required
            autoComplete="tel"
            inputMode="tel"
            placeholder="(555) 555-5555"
            className="w-full rounded-xl border border-line bg-cream/60 px-3.5 py-2.5 text-[16px] placeholder:text-ink-soft/60 focus:border-brand-teal focus:bg-white"
          />
        </div>
        <div>
          <label htmlFor="lead-zip" className="mb-1 block text-sm font-bold">
            Zip code
          </label>
          <input
            id="lead-zip"
            name="zip"
            type="text"
            required
            inputMode="numeric"
            autoComplete="postal-code"
            pattern="\d{5}(-\d{4})?"
            placeholder="e.g. 67202"
            className="w-full rounded-xl border border-line bg-cream/60 px-3.5 py-2.5 text-[16px] placeholder:text-ink-soft/60 focus:border-brand-teal focus:bg-white"
          />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="lead-age" className="mb-1 block text-sm font-bold">
            Child&rsquo;s age
          </label>
          <select
            id="lead-age"
            name="childAge"
            required
            defaultValue=""
            className="w-full rounded-xl border border-line bg-cream/60 px-3.5 py-2.5 text-[16px] focus:border-brand-teal focus:bg-white"
          >
            <option value="" disabled>
              Choose an age range
            </option>
            <option value="under-2">Under 2</option>
            <option value="2-3">2–3</option>
            <option value="4-5">4–5</option>
            <option value="6-9">6–9</option>
            <option value="10-13">10–13</option>
            <option value="14-plus">14 or older</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-5 w-full rounded-full bg-brand-teal px-6 py-3.5 text-[16px] font-bold text-white transition-colors hover:bg-brand-teal-deep disabled:opacity-60"
      >
        {status === "submitting" ? "Sending…" : "Match me with an intake advocate"}
      </button>

      {status === "error" && (
        <p className="mt-3 text-sm font-semibold text-[#B23A2B]" role="alert">
          Something went wrong sending that. Please try again — or just call
          us, a person will answer.
        </p>
      )}

      <p className="mt-3 text-center text-[13px] leading-snug text-ink-soft">
        Confidential and HIPAA-protected. We only use this to call you back.
      </p>
    </form>
  );
}
