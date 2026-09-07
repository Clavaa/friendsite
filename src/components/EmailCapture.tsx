"use client";

import { useState } from "react";

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

  return (
    <section className="bg-mint-wash">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:py-20">
        <div className="overflow-hidden rounded-[2.5rem] bg-cream shadow-card lg:grid lg:grid-cols-2 lg:items-center">
          <div className="p-8 sm:p-12 lg:p-14">
            <p className="flex items-center gap-3 text-[13px] font-bold tracking-[0.18em] text-brand-teal">
              <span aria-hidden="true" className="h-0.5 w-8 rounded-full bg-sun" />
              A little help, weekly
            </p>
            <h2 className="font-display mt-4 text-4xl sm:text-5xl">
              For the parent still up at 11pm,{" "}
              <span className="italic text-brand-teal">looking things up.</span>
            </h2>
            <p className="mt-4 max-w-md text-ink-soft">
              Picky eating. Car-seat standoffs. The word &ldquo;no&rdquo; on
              repeat. Once a week, our BCBAs send one practical, judgment-free
              strategy you can try before breakfast. No spam, and unsubscribing
              takes one click.
            </p>

            {status === "success" ? (
              <div className="mt-6 rounded-2xl bg-white p-5 shadow-card" role="status" aria-live="polite">
                <p className="font-display text-xl">You&rsquo;re on the list.</p>
                <p className="mt-1 text-[15px] text-ink-soft">
                  First tip lands soon. Until then — you&rsquo;re doing better
                  than you think.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 max-w-md">
                {/* Honeypot — hidden from people, tempting to bots */}
                <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
                  <label htmlFor="news-website">Website</label>
                  <input id="news-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label htmlFor="news-name" className="sr-only">
                      First name
                    </label>
                    <input
                      id="news-name"
                      name="parentName"
                      type="text"
                      required
                      autoComplete="given-name"
                      placeholder="First name"
                      className="w-full rounded-full border border-line bg-white px-5 py-3 text-[15px] placeholder:text-ink-soft/60 focus:border-brand-teal"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label htmlFor="news-email" className="sr-only">
                      Email
                    </label>
                    <input
                      id="news-email"
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Email"
                      className="w-full rounded-full border border-line bg-white px-5 py-3 text-[15px] placeholder:text-ink-soft/60 focus:border-brand-teal"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="mt-3 w-full rounded-full bg-ink px-6 py-3.5 text-[15px] font-bold text-white transition-colors hover:bg-brand-teal-deep disabled:opacity-60"
                >
                  {status === "submitting" ? "Signing you up…" : "Send me one good idea a week"}
                </button>
                {status === "error" && (
                  <p className="mt-2 text-sm font-semibold text-[#B23A2B]" role="alert">
                    That didn&rsquo;t send — please try again.
                  </p>
                )}
                <p className="mt-2 text-[13px] text-ink-soft">
                  Tips only, never your inbox&rsquo;s new problem.
                </p>
              </form>
            )}
          </div>

          {/* Original decorative panel: sunrise + hummingbird motif on butter wash */}
          <div aria-hidden="true" className="relative hidden min-h-[26rem] items-center justify-center bg-sun-wash lg:flex">
            <svg viewBox="0 0 320 260" className="w-72" fill="none">
              <circle cx="160" cy="150" r="72" fill="var(--color-sun)" opacity="0.9" />
              <path d="M40 196 h240" stroke="var(--color-brand-teal)" strokeWidth="5" strokeLinecap="round" />
              <path d="M64 216 h96 M200 216 h56" stroke="var(--color-brand-teal)" strokeWidth="5" strokeLinecap="round" opacity="0.45" />
              <path d="M118 84 C132 66 154 60 172 66 C160 74 152 84 148 96" stroke="var(--color-brand-teal)" strokeWidth="5" strokeLinecap="round" />
              <path d="M96 108 C110 96 126 94 138 100" stroke="var(--color-brand-teal)" strokeWidth="5" strokeLinecap="round" opacity="0.5" />
              <path d="M228 64 l10 -16 M244 78 l16 -8 M248 100 l18 0" stroke="var(--color-sun)" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
