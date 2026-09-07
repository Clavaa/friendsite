"use client";

import { useState } from "react";
import { BirdSpot, PaperBits, Sparkles } from "./Accents";

type Status = "idle" | "submitting" | "success" | "error";

/**
 * Personality email-capture block near the foot of the page — practical
 * weekly BCBA tips, pitched at the parent who is still awake at 11pm
 * looking things up. Posts to /api/lead as a contact-only newsletter
 * signup (name + email, nothing clinical).
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
        body: JSON.stringify({ ...data, type: "newsletter", sourcePage: "home-newsletter" }),
      });
      if (!res.ok) throw new Error(`Signup failed: ${res.status}`);
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
              One good idea a week
            </p>
            <h2 className="font-display display-hero mx-auto mt-6 max-w-[34rem] text-[2.8rem] text-brand-teal sm:text-6xl lg:text-[4.5rem]">
              Still up <span className="italic">at 11pm?</span>
            </h2>
            <p className="mx-auto mt-7 max-w-[34rem] text-[17px] leading-relaxed text-ink-soft">
              Picky eating. Car-seat standoffs. The word &ldquo;no&rdquo; on
              repeat. You&rsquo;re doing your best, and autism is challenging —
              so once a week our BCBAs send one practical, judgment-free
              strategy you can try before breakfast.
            </p>

            {status === "success" ? (
              <div className="mx-auto mt-8 max-w-md rounded-3xl bg-white p-6 shadow-card" role="status" aria-live="polite">
                <p className="font-display text-xl">You&rsquo;re on the list.</p>
                <p className="mt-1 text-[15px] text-ink-soft">
                  First tip lands soon. Until then — you&rsquo;re doing better
                  than you think.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mx-auto mt-9 max-w-md">
                {/* Honeypot — hidden from people, tempting to bots */}
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="news-website">Website</label>
                  <input id="news-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid gap-4">
                  <div>
                    <label htmlFor="news-name" className="sr-only">
                      First name
                    </label>
                    <input
                      id="news-name"
                      name="parentName"
                      type="text"
                      required
                      autoComplete="given-name"
                      placeholder="First name*"
                      className={input}
                    />
                  </div>
                  <div>
                    <label htmlFor="news-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="news-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Email*"
                      className={input}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-pill mt-6 inline-flex h-[62px] w-full items-center justify-center gap-3 rounded-full bg-ink px-8 text-[17px] font-extrabold text-white transition-colors hover:bg-brand-teal-deep disabled:opacity-60"
                >
                  {status === "submitting" ? "Signing you up…" : "Sign me up"}
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
                  Tips only, never your inbox&rsquo;s new problem. Unsubscribing
                  takes one click.
                </p>
              </form>
            )}
          </div>

          {/* Original decorative panel: hummingbird courier on butter wash */}
          <div aria-hidden="true" className="relative hidden min-h-[30rem] items-center justify-center overflow-hidden rounded-[2.5rem] bg-sun-wash lg:flex">
            <PaperBits className="absolute left-6 top-8 w-32" />
            <PaperBits className="absolute bottom-10 right-8 w-24 rotate-45" />
            <Sparkles className="absolute right-12 top-14 w-20" />
            <div className="relative flex flex-col items-center">
              <span className="block h-44 w-44 rounded-full bg-sun/70" />
              <BirdSpot className="absolute -top-16 left-1/2 w-44 -translate-x-1/3" />
              <span className="mt-8 block h-1.5 w-52 rounded-full bg-brand-teal/50" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
