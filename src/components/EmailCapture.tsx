"use client";

import Image from "next/image";
import { useState } from "react";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * "Ask our clinical team" block near the foot of the page — a question
 * box, not a newsletter (there is no newsletter). Pitched at the parent
 * who is still awake at 11pm looking things up. Posts to /api/lead with
 * type: "question" (name + email + the question; the microcopy asks
 * senders to leave medical details out).
 */
export default function EmailCapture() {
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
        body: JSON.stringify({ ...data, type: "question", sourcePage: "home-question" }),
      });
      if (!res.ok) throw new Error(`Question submit failed: ${res.status}`);
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  const input =
    "h-14 w-full rounded-full border border-ink/10 bg-white px-7 text-[16px] shadow-[0_1px_2px_rgba(15,58,71,0.05)] placeholder:text-ink-soft/60 focus:border-brand-teal";

  return (
    <section className="bg-mint-wash px-3 py-16 sm:px-6 lg:py-24">
      <div className="mx-auto max-w-[87rem] overflow-hidden rounded-[3rem] bg-cream">
        <div className="grid items-center gap-10 p-8 sm:p-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,32rem)] lg:gap-16 lg:p-[4.5rem]">
          <div className="reveal text-center">
            <p className="text-[15px] font-extrabold uppercase tracking-[0.14em] text-ink">
              Ask our clinical team
            </p>
            <h2 className="font-display display-hero mx-auto mt-6 max-w-[34rem] text-[2.8rem] text-brand-teal sm:text-6xl lg:text-[4.5rem]">
              Still up <span className="italic">at 11pm?</span>
            </h2>
            <p className="mx-auto mt-7 max-w-[34rem] text-[17px] leading-relaxed text-ink-soft">
              Whatever question is keeping you scrolling — about ABA, about
              getting started, about your specific worry — send it to our
              clinical team. A real person reads and answers every one.
            </p>

            {status === "success" ? (
              <div className="mx-auto mt-8 max-w-md rounded-3xl bg-white p-6 shadow-card" role="status" aria-live="polite">
                <p className="font-display text-xl">Got it — your question is with us.</p>
                <p className="mt-1 text-[15px] text-ink-soft">
                  A real person will read it and email you back. Until then —
                  you&rsquo;re doing better than you think.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-9 max-w-md">
                {/* Honeypot — hidden from people, tempting to bots */}
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="ask-website">Website</label>
                  <input id="ask-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid gap-4">
                  <div>
                    <label htmlFor="ask-name" className="sr-only">
                      First name
                    </label>
                    <input
                      id="ask-name"
                      name="parentName"
                      type="text"
                      required
                      autoComplete="given-name"
                      placeholder="First name*"
                      className={input}
                    />
                  </div>
                  <div>
                    <label htmlFor="ask-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="ask-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Email*"
                      className={input}
                    />
                  </div>
                  <div>
                    <label htmlFor="ask-question" className="sr-only">
                      Your question
                    </label>
                    <textarea
                      id="ask-question"
                      name="question"
                      required
                      rows={4}
                      maxLength={1000}
                      placeholder="Your question* — no need to include medical details"
                      className="w-full rounded-3xl border border-ink/10 bg-white px-7 py-5 text-[16px] shadow-[0_1px_2px_rgba(15,58,71,0.05)] placeholder:text-ink-soft/60 focus:border-brand-teal"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-pill mt-6 inline-flex h-[62px] w-full items-center justify-center gap-3 rounded-full bg-ink px-8 text-[17px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep disabled:opacity-60"
                >
                  {status === "submitting" ? "Sending your question…" : "Ask the team"}
                  <svg aria-hidden="true" width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 3l5 5-5 5" />
                  </svg>
                </button>
                {status === "error" && (
                  <p className="mt-2 text-sm font-semibold text-[#B23A2B]" role="alert">
                    That didn&rsquo;t send — please try again.
                  </p>
                )}
                <p className="mt-3 text-[13px] text-ink-soft">
                  A real person reads and answers every question — no
                  autoresponders, no mailing list, no sales pitch attached.
                </p>
              </form>
            )}
          </div>

          {/* Sunbird's plush mascot keeps the late-night asker company */}
          <div className="relative hidden min-h-[30rem] overflow-hidden rounded-[2.5rem] lg:block">
            <Image
              src="/brand/plush-single.jpg"
              alt="Sunbird's plush mascot — a smiling teal bird with the Sunbird logo on its belly"
              fill
              sizes="32rem"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
