"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { track } from "../lib/analytics";
import { siteConfig } from "../../site.config";
import { pingLead } from "./TrafficBeacon";

/**
 * Guided chat card (bottom-right). A scripted intake, not a live agent and
 * not a persona: it speaks as "Sunbird ABA" (no invented staff name/photo,
 * no "online now" claim). Every answer ends in /api/lead — type "chat" for
 * the intake path, "question" for free-text questions — so it lands in the
 * same inbox + /admin as the forms.
 *
 * Desktop: opens itself once per session after a short delay.
 * Phone: never covers the page by itself — shows a small greeting bubble
 * above the launcher instead (intrusive-interstitial rule).
 */

type Mode = "none" | "free" | "name" | "phone" | "zip" | "email";
type Choice = { label: string; go: () => void; primary?: boolean };
type Msg = { from: "bot" | "me"; text: React.ReactNode };

const AGES: [string, string][] = [
  ["under-2", "Under 2"], ["2-3", "2–3"], ["4-5", "4–5"],
  ["6-9", "6–9"], ["10-13", "10–13"], ["14-plus", "14+"],
];
const SEEN_KEY = "sb_chat_seen";
const OPEN_DELAY_MS = 9000;

const ss = {
  get: (k: string) => { try { return sessionStorage.getItem(k); } catch { return null; } },
  set: (k: string, v: string) => { try { sessionStorage.setItem(k, v); } catch { /* private mode */ } },
};

export default function ChatWidget() {
  const pathname = usePathname();
  const hidden = pathname.startsWith("/admin");

  const [open, setOpen] = useState(false);
  const [teaser, setTeaser] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [choices, setChoices] = useState<Choice[]>([]);
  const [mode, setMode] = useState<Mode>("free");
  const [input, setInput] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  const data = useRef<Record<string, string>>({});
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const started = useRef(false);

  const bot = (text: React.ReactNode) => setMsgs((m) => [...m, { from: "bot", text }]);
  const me = (text: string) => setMsgs((m) => [...m, { from: "me", text }]);

  function start() {
    if (started.current) return;
    started.current = true;
    data.current = {};
    setMsgs([{ from: "bot", text: <>Hi! 👋 Are you looking into ABA therapy for your child?</> }]);
    setMode("free");
    setChoices([
      { label: "Yes", primary: true, go: () => pick("Yes", askState) },
      { label: "Not right now", go: () => pick("Not right now", notNow) },
      { label: "I'm looking for a job", go: () => pick("I'm looking for a job", jobs) },
    ]);
  }

  // Auto-open once per session: full card on desktop, a small bubble on phones.
  useEffect(() => {
    if (hidden || ss.get(SEEN_KEY)) return;
    const t = setTimeout(() => {
      ss.set(SEEN_KEY, "1");
      if (window.matchMedia("(min-width: 1024px)").matches) { start(); setOpen(true); }
      else setTeaser(true);
    }, OPEN_DELAY_MS);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hidden]);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, choices]);

  useEffect(() => {
    if (open && mode !== "none" && mode !== "free") inputRef.current?.focus();
  }, [open, mode]);

  if (hidden) return null;

  function pick(label: string, next: () => void) {
    me(label);
    setChoices([]);
    setTimeout(next, 350);
  }

  /* ——— intake path ——— */
  function askState() {
    bot("Wonderful. Which state are you in?");
    setChoices([
      { label: "Kansas", go: () => { data.current.state = "kansas"; pick("Kansas", askAge); } },
      { label: "Colorado", go: () => { data.current.state = "colorado"; pick("Colorado", askAge); } },
      { label: "Somewhere else", go: () => pick("Somewhere else", elsewhere) },
    ]);
  }
  function elsewhere() {
    bot("Right now our team serves families in Kansas and Colorado. If you have a question anyway, type it below and we'll do our best to point you in the right direction.");
    setMode("free");
  }
  function askAge() {
    bot("How old is your child?");
    setChoices(AGES.map(([v, l]) => ({ label: l, go: () => { data.current.childAge = v; pick(l, askIns); } })));
  }
  function askIns() {
    bot("What kind of insurance does your child have?");
    const set = (v: string, l: string) => ({ label: l, go: () => { data.current.insurance = v; pick(l, insAnswer); } });
    setChoices([set("medicaid", "Medicaid"), set("private-insurance", "Private insurance"), set("not-sure", "Not sure")]);
  }
  function insAnswer() {
    bot("Good news: we work with Medicaid and commercial insurance plans, and we check your exact benefits for free.");
    setTimeout(() => { bot("What's your first name?"); setMode("name"); }, 500);
  }

  /* ——— other paths ——— */
  function notNow() {
    bot(<>No problem! Our <Link href="/resources" className="font-bold text-brand-teal underline">parent guides</Link> are a good place to start. And if a question comes up, type it below.</>);
    setMode("free");
  }
  function jobs() {
    bot(<>We&rsquo;d love to hear from you! Roles and how to apply are on our <Link href="/careers" className="font-bold text-brand-teal underline">careers page</Link>.</>);
    setMode("free");
  }

  async function submit(extra: Record<string, string>) {
    setMode("none");
    setBusy(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data.current, ...extra, sourcePage: `chat:${pathname}`.slice(0, 200) }),
      });
      if (!res.ok) throw new Error(String(res.status));
      track("generate_lead", { form: extra.type === "question" ? "chat-question" : "chat-intake" });
      pingLead();
      return true;
    } catch {
      bot(<>Sorry, that didn&rsquo;t go through. Please call us at <a href={siteConfig.phoneHref} className="font-bold text-brand-teal underline">{siteConfig.phone}</a>.</>);
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    const v = input.trim();
    if (!v || busy || mode === "none") return;
    setErr("");

    if (mode === "free") {
      me(v); setInput(""); setChoices([]);
      data.current.question = v;
      setTimeout(() => { bot("Good question. Our team answers these personally. What's your first name?"); setMode("name"); }, 350);
      return;
    }
    if (mode === "name") {
      if (v.length < 2) return setErr("Please enter your first name.");
      data.current.parentName = v; me(v); setInput("");
      const asking = Boolean(data.current.question);
      setTimeout(() => {
        bot(asking ? `Thanks, ${v}! What email should we send the answer to?` : `Thanks, ${v}! What's the best phone number to reach you?`);
        setMode(asking ? "email" : "phone");
      }, 350);
      return;
    }
    if (mode === "phone") {
      if (v.replace(/\D/g, "").length < 10) return setErr("Please enter a 10-digit phone number.");
      data.current.phone = v; me(v); setInput("");
      setTimeout(() => { bot("Last one: your ZIP code?"); setMode("zip"); }, 350);
      return;
    }
    if (mode === "zip") {
      if (!/^\d{5}$/.test(v)) return setErr("Please enter a 5-digit ZIP code.");
      data.current.zip = v; me(v); setInput("");
      if (await submit({ type: "chat" })) {
        bot(<>You&rsquo;re all set, {data.current.parentName}. An intake advocate will call you, usually the same business day. Rather talk now? <a href={siteConfig.phoneHref} className="font-bold text-brand-teal underline">Call {siteConfig.phone}</a>.</>);
      }
      return;
    }
    if (mode === "email") {
      if (!/^\S+@\S+\.\S+$/.test(v)) return setErr("Please enter a valid email.");
      me(v); setInput("");
      if (await submit({ type: "question", email: v })) {
        bot("Got it! We'll email you back, usually within a business day.");
      }
    }
  }

  const placeholder: Record<Mode, string> = {
    none: "Thanks!", free: "Ask anything…", name: "First name", phone: "Phone number",
    zip: "ZIP code", email: "Email address",
  };

  const openChat = () => { start(); setTeaser(false); setOpen(true); ss.set(SEEN_KEY, "1"); };
  const avatar = (size: string) => (
    <span className={`grid ${size} shrink-0 place-items-center rounded-full bg-gradient-to-br from-sun via-brand-aqua to-brand-teal p-[2px]`}>
      <span className="grid h-full w-full place-items-center rounded-full bg-white">
        <Image src="/brand/sunbird-mark.png" alt="" width={64} height={51} className="w-[62%]" />
      </span>
    </span>
  );

  return (
    <div className="fixed bottom-[5.5rem] right-3 z-[45] flex flex-col items-end gap-3 sm:right-5 lg:bottom-6">
      {open && (
        <section
          role="dialog"
          aria-label="Chat with Sunbird ABA"
          className="flex max-h-[min(34rem,calc(100dvh-8rem))] w-[min(23rem,calc(100vw-1.5rem))] flex-col overflow-hidden rounded-3xl border border-line bg-white shadow-card-lg"
        >
          <header className="flex items-center gap-3 border-b border-line px-5 py-4">
            {avatar("h-12 w-12")}
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg leading-tight">Sunbird ABA</p>
              <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-ink-soft">
                <span className="h-2 w-2 rounded-full bg-meadow" aria-hidden="true" />
                Intake team · replies same day
              </p>
            </div>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-cream hover:text-ink">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" /></svg>
            </button>
          </header>

          <div ref={logRef} aria-live="polite" className="flex-1 space-y-3 overflow-y-auto px-5 py-4">
            {msgs.map((m, i) => (
              <p
                key={i}
                className={
                  m.from === "bot"
                    ? "max-w-[88%] rounded-2xl rounded-tl-md border border-line bg-cream/50 px-4 py-3 text-[15px] leading-relaxed text-ink"
                    : "ml-auto w-fit max-w-[80%] rounded-2xl rounded-tr-md bg-brand-teal px-4 py-2.5 text-[15px] font-semibold text-white"
                }
              >
                {m.text}
              </p>
            ))}
            {busy && <p className="w-fit rounded-2xl border border-line bg-cream/50 px-4 py-3 text-ink-soft">Sending…</p>}
            {choices.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1">
                {choices.map((c) => (
                  <button
                    key={c.label}
                    type="button"
                    onClick={c.go}
                    className={
                      c.primary
                        ? "h-11 rounded-full bg-brand-teal px-6 text-[15px] font-extrabold text-white hover:bg-brand-teal-deep"
                        : "h-11 rounded-full border border-line bg-white px-5 text-[14px] font-bold text-ink hover:border-brand-teal/60 hover:text-brand-teal"
                    }
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={onSend} className="border-t border-line p-3">
            {err && <p className="px-2 pb-2 text-[13px] font-bold text-[#b4432f]">{err}</p>}
            <div className="flex items-center gap-2 rounded-2xl border border-brand-teal/25 bg-white py-1.5 pl-4 pr-1.5 focus-within:border-brand-teal">
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={mode === "none" || busy}
                placeholder={placeholder[mode]}
                aria-label={placeholder[mode]}
                type={mode === "email" ? "email" : mode === "phone" ? "tel" : "text"}
                inputMode={mode === "zip" ? "numeric" : undefined}
                autoComplete={mode === "name" ? "given-name" : mode === "phone" ? "tel" : mode === "zip" ? "postal-code" : mode === "email" ? "email" : "off"}
                maxLength={mode === "free" ? 600 : 80}
                className="min-w-0 flex-1 bg-transparent text-[16px] outline-none focus-visible:outline-none placeholder:text-ink-soft/70 disabled:opacity-60"
              />
              <button type="submit" aria-label="Send" disabled={!input.trim() || busy} className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-teal text-white transition-opacity disabled:opacity-35">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M8 13V3M3.5 7.5L8 3l4.5 4.5" /></svg>
              </button>
            </div>
            <p className="px-2 pt-2 text-[11.5px] leading-snug text-ink-soft">Please don&rsquo;t share medical details here. A real person follows up.</p>
          </form>
        </section>
      )}

      {!open && teaser && (
        <button type="button" onClick={openChat} className="max-w-[15rem] rounded-2xl rounded-br-md border border-line bg-white px-4 py-3 text-left text-[14.5px] font-semibold text-ink shadow-card-lg">
          Hi! 👋 Questions about ABA therapy? We can help.
        </button>
      )}

      {!open && (
        <button type="button" onClick={openChat} aria-label="Chat with Sunbird ABA" className="rounded-full shadow-card-lg transition-transform hover:scale-105">
          {avatar("h-14 w-14")}
        </button>
      )}
    </div>
  );
}
