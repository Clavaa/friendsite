"use client";

import { useState } from "react";
import { siteConfig } from "../../site.config";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Multi-step diagnostician-help form for /get-a-diagnosis.
 * One question per screen, big tap targets (48px+ chips), contact info
 * LAST per the CRO spine. Posts to /api/lead tagged type "diagnosis-help".
 * Answer options are fixed choices only — no free-text — so the lead
 * email stays PHI-light (cross-site rule: SendGrid signs no BAA).
 */

const AGE_OPTIONS = [
  { value: "under-2", label: "Under 2" },
  { value: "2-3", label: "2–3" },
  { value: "4-5", label: "4–5" },
  { value: "6-9", label: "6–9" },
  { value: "10-13", label: "10–13" },
  { value: "14-plus", label: "14 or older" },
];

const STATE_OPTIONS = [
  { value: "kansas", label: "Kansas" },
  { value: "colorado", label: "Colorado" },
];

const CONCERN_OPTIONS = [
  { value: "speech-delay", label: "Speech delay or few words" },
  { value: "not-responding-to-name", label: "Doesn't respond to their name" },
  { value: "repetitive-play", label: "Repeats the same play over and over" },
  { value: "little-eye-contact", label: "Makes little eye contact" },
  { value: "lost-skills", label: "Lost words or skills they had" },
  { value: "something-else", label: "Something else" },
];

const INSURANCE_OPTIONS = [
  { value: "private-insurance", label: "Private insurance" },
  { value: "medicaid", label: "Medicaid (KanCare / Health First Colorado)" },
  { value: "not-sure", label: "Not sure yet" },
];

const TOTAL_STEPS = 5;

const STEP_TITLES = [
  "How old is your child?",
  "Which state do you live in?",
  "What have you noticed?",
  "How would care be paid for?",
  "Where should we call you?",
];

const chipBase =
  "inline-flex min-h-12 items-center justify-center rounded-full border-2 px-5 py-3 text-[16px] font-semibold transition-colors";
const chipOff =
  "border-line bg-white text-ink hover:border-brand-teal hover:text-brand-teal";
const chipOn = "border-brand-teal bg-sun-wash text-brand-teal-deep";

export default function DiagnosisForm() {
  const [step, setStep] = useState(0);
  const [status, setStatus] = useState<Status>("idle");
  const [childAge, setChildAge] = useState("");
  const [usState, setUsState] = useState("");
  const [concerns, setConcerns] = useState<string[]>([]);
  const [insurance, setInsurance] = useState("");
  const [parentName, setParentName] = useState("");
  const [phone, setPhone] = useState("");
  const [honeypot, setHoneypot] = useState("");

  function pickAndAdvance(setter: (v: string) => void, value: string) {
    setter(value);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }

  function toggleConcern(value: string) {
    setConcerns((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    );
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!parentName.trim() || !phone.trim()) return;
    setStatus("submitting");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "diagnosis-help",
          parentName,
          phone,
          childAge,
          state: usState,
          concerns,
          insurance,
          website: honeypot,
          sourcePage: "get-a-diagnosis",
        }),
      });
      if (!res.ok) throw new Error(`Lead post failed: ${res.status}`);
      setStatus("success");
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
        <h3 className="font-display mt-4 text-2xl">
          Got it — we&rsquo;re on it.
        </h3>
        <p className="mt-2 text-ink-soft">
          An intake advocate will call you, usually the same business day, with
          evaluation options near you and what your insurance covers. Want to
          talk sooner?{" "}
          <a href={siteConfig.phoneHref} className="font-bold text-brand-teal hover:underline">
            Call {siteConfig.phone}
          </a>
          .
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative rounded-3xl bg-white p-6 shadow-card-lg sm:p-8"
    >
      {/* Honeypot — hidden from people, tempting to bots */}
      <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="diag-website">Website</label>
        <input
          id="diag-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={honeypot}
          onChange={(e) => setHoneypot(e.target.value)}
        />
      </div>

      {/* Progress */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-bold text-ink-soft">
          Question {step + 1} of {TOTAL_STEPS}
        </p>
        {step > 0 && (
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            className="inline-flex items-center gap-1 text-sm font-bold text-brand-teal hover:underline"
          >
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 8H3M7 4L3 8l4 4" />
            </svg>
            Back
          </button>
        )}
      </div>
      <div
        className="mt-2.5 flex gap-1.5"
        role="progressbar"
        aria-valuemin={1}
        aria-valuemax={TOTAL_STEPS}
        aria-valuenow={step + 1}
        aria-label={`Question ${step + 1} of ${TOTAL_STEPS}`}
      >
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-full ${i <= step ? "bg-brand-teal" : "bg-line"}`}
          />
        ))}
      </div>

      <div aria-live="polite">
        <h3 className="font-display mt-5 text-2xl leading-snug">
          {STEP_TITLES[step]}
        </h3>

        {step === 0 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {AGE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={childAge === opt.value}
                onClick={() => pickAndAdvance(setChildAge, opt.value)}
                className={`${chipBase} ${childAge === opt.value ? chipOn : chipOff}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step === 1 && (
          <div className="mt-4 flex flex-wrap gap-2.5">
            {STATE_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                aria-pressed={usState === opt.value}
                onClick={() => pickAndAdvance(setUsState, opt.value)}
                className={`${chipBase} ${usState === opt.value ? chipOn : chipOff}`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {step === 2 && (
          <>
            <p className="mt-1.5 text-[15px] text-ink-soft">
              Pick everything that sounds familiar. There are no wrong answers.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {CONCERN_OPTIONS.map((opt) => {
                const on = concerns.includes(opt.value);
                return (
                  <button
                    key={opt.value}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggleConcern(opt.value)}
                    className={`${chipBase} ${on ? chipOn : chipOff}`}
                  >
                    {on && (
                      <svg aria-hidden="true" className="mr-1.5" width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2.5 7.5l3 3 6-7" />
                      </svg>
                    )}
                    {opt.label}
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              onClick={() => setStep(3)}
              disabled={concerns.length === 0}
              className="mt-5 w-full rounded-full bg-brand-teal px-6 py-3.5 text-[16px] font-bold text-white transition-colors hover:bg-brand-teal-deep disabled:opacity-50"
            >
              Next question
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <p className="mt-1.5 text-[15px] text-ink-soft">
              Evaluations are usually covered. This helps us point you to
              in-network evaluators.
            </p>
            <div className="mt-4 flex flex-wrap gap-2.5">
              {INSURANCE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  aria-pressed={insurance === opt.value}
                  onClick={() => pickAndAdvance(setInsurance, opt.value)}
                  className={`${chipBase} ${insurance === opt.value ? chipOn : chipOff}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <p className="mt-1.5 text-[15px] text-ink-soft">
              A real person calls you back with evaluation options near you —
              usually the same day.
            </p>
            <div className="mt-4 grid gap-3.5">
              <div>
                <label htmlFor="diag-name" className="mb-1 block text-sm font-bold">
                  Your name
                </label>
                <input
                  id="diag-name"
                  name="parentName"
                  type="text"
                  required
                  autoComplete="name"
                  placeholder="First and last name"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream/60 px-3.5 py-2.5 text-[16px] placeholder:text-ink-soft/60 focus:border-brand-teal focus:bg-white"
                />
              </div>
              <div>
                <label htmlFor="diag-phone" className="mb-1 block text-sm font-bold">
                  Phone
                </label>
                <input
                  id="diag-phone"
                  name="phone"
                  type="tel"
                  required
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="(555) 555-5555"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream/60 px-3.5 py-2.5 text-[16px] placeholder:text-ink-soft/60 focus:border-brand-teal focus:bg-white"
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={status === "submitting"}
              className="mt-5 w-full rounded-full bg-brand-teal px-6 py-3.5 text-[16px] font-bold text-white transition-colors hover:bg-brand-teal-deep disabled:opacity-60"
            >
              {status === "submitting" ? "Sending…" : "Help me get an evaluation"}
            </button>
            {status === "error" && (
              <p className="mt-3 text-sm font-semibold text-[#B23A2B]" role="alert">
                Something went wrong sending that. Please try again — or just
                call us, a person will answer.
              </p>
            )}
          </>
        )}
      </div>

      <p className="mt-4 text-center text-[13px] leading-snug text-ink-soft">
        Confidential and HIPAA-protected. We only use this to call you back.
      </p>
    </form>
  );
}
