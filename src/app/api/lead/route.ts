import { NextResponse } from "next/server";
import { siteConfig } from "../../../../site.config";
import { insertInto } from "../../../lib/bq";

/**
 * Lead intake endpoint.
 *
 * Deliberately PHI-light (cross-site rule: SendGrid signs no BAA):
 * we accept only contact basics — parent name, phone, zip OR state,
 * child's age range, and the page the lead came from. No diagnosis and no
 * clinical detail is requested anywhere. The optional diagnosis-help
 * fields (type, state, insurance, concerns) are fixed enumerated choices
 * validated against allowlists below — never free text. The one free-text
 * field is the "Ask our clinical team" question box (type: "question"),
 * which is user-initiated, length-capped, and whose UI explicitly asks
 * senders to leave out medical details.
 *
 * Honeypot: the form renders a visually-hidden "website" field. Bots fill
 * it; people can't see it. A filled honeypot returns 200 (so the bot
 * learns nothing) and sends nothing.
 *
 * Every lead is written to BigQuery (sunbird_traffic.leads) BEFORE the
 * email is attempted, and shows on /admin. If the row is stored, the visitor
 * always sees success — an email outage (e.g. SendGrid out of credits,
 * Nov 2026) can no longer lose a family's request.
 *
 * Email delivery uses SendGrid via the standard SENDGRID_API_KEY env var.
 * When the key is unset (local dev, preview deploys), the route degrades
 * to a console warning + success response so the site never breaks.
 */

const MAX_FIELD_LENGTH = 200;
const MAX_QUESTION_LENGTH = 1000;

/** Fixed vocabularies for the diagnosis-help funnel — anything else is dropped. */
const ALLOWED_TYPES = new Set(["diagnosis-help", "newsletter", "question"]);
const ALLOWED_STATES = new Set(["kansas", "colorado"]);
const ALLOWED_INSURANCE = new Set(["private-insurance", "medicaid", "not-sure"]);
const ALLOWED_CONCERNS = new Set([
  "speech-delay",
  "not-responding-to-name",
  "repetitive-play",
  "little-eye-contact",
  "lost-skills",
  "something-else",
]);

interface LeadPayload {
  parentName: string;
  phone: string;
  zip: string;
  /** Email-based flows (question box) — contact email only. */
  email: string;
  /** "Ask our clinical team" box — user-initiated free text, length-capped. */
  question: string;
  childAge: string;
  sourcePage: string;
  /** Optional funnel tag, e.g. "diagnosis-help". */
  type: string;
  /** Optional enumerated fields from the diagnosis-help funnel. */
  state: string;
  insurance: string;
  concerns: string[];
}

function clean(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

function cleanEnum(value: unknown, allowed: Set<string>): string {
  const v = clean(value);
  return allowed.has(v) ? v : "";
}

function cleanEnumList(value: unknown, allowed: Set<string>): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((v) => clean(v))
    .filter((v) => allowed.has(v))
    .slice(0, allowed.size);
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  // Honeypot: silently accept and discard.
  if (clean(body.website)) {
    return NextResponse.json({ ok: true });
  }

  const lead: LeadPayload = {
    parentName: clean(body.parentName),
    phone: clean(body.phone),
    zip: clean(body.zip),
    email: clean(body.email),
    question:
      typeof body.question === "string"
        ? body.question.trim().slice(0, MAX_QUESTION_LENGTH)
        : "",
    childAge: clean(body.childAge),
    sourcePage: clean(body.sourcePage) || "unknown",
    type: cleanEnum(body.type, ALLOWED_TYPES),
    state: cleanEnum(body.state, ALLOWED_STATES),
    insurance: cleanEnum(body.insurance, ALLOWED_INSURANCE),
    concerns: cleanEnumList(body.concerns, ALLOWED_CONCERNS),
  };

  // Email-based flows: a name and an email (plus the question itself for
  // the "Ask our clinical team" box), nothing else required.
  const isNewsletter = lead.type === "newsletter";
  const isQuestion = lead.type === "question";
  if (isNewsletter || isQuestion) {
    if (
      !lead.parentName ||
      !lead.email ||
      !lead.email.includes("@") ||
      (isQuestion && !lead.question)
    ) {
      return NextResponse.json(
        { ok: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
  } else if (
    // Location: the classic intake form sends a zip; the diagnosis-help
    // funnel sends a state chip instead. Either satisfies the requirement.
    !lead.parentName || !lead.phone || !lead.childAge || (!lead.zip && !lead.state)
  ) {
    return NextResponse.json(
      { ok: false, error: "Missing required fields" },
      { status: 400 }
    );
  }

  const row = {
    ts: new Date().toISOString(),
    type: lead.type || "intake",
    parent_name: lead.parentName,
    phone: lead.phone || null,
    email: lead.email || null,
    zip: lead.zip || null,
    state: lead.state || null,
    child_age: lead.childAge || null,
    insurance: lead.insurance || null,
    concerns: lead.concerns.join(", ") || null,
    question: lead.question || null,
    source_page: lead.sourcePage,
  };
  /** Email failed: fine if the lead is stored (it's on /admin), an error if not. */
  const emailFailed = async (why: string) => {
    const stored = await insertInto("leads", { ...row, email_status: `failed: ${why}`.slice(0, 200) });
    console.error(`[lead] email failed (${why.slice(0, 300)}); stored=${stored}`);
    return stored
      ? NextResponse.json({ ok: true })
      : NextResponse.json({ ok: false, error: "Delivery failed" }, { status: 502 });
  };

  const apiKey = process.env.SENDGRID_API_KEY;
  if (!apiKey) {
    console.warn(
      "[lead] SENDGRID_API_KEY is not set — lead notification NOT sent.",
      { sourcePage: lead.sourcePage, zip: lead.zip }
    );
    await insertInto("leads", { ...row, email_status: "no email key" });
    return NextResponse.json({ ok: true });
  }

  const isDiagnosisHelp = lead.type === "diagnosis-help";
  const kind = isNewsletter
    ? "New email tips signup"
    : isQuestion
      ? "New question for the clinical team"
      : isDiagnosisHelp
        ? "New diagnosis-help lead"
        : "New intake lead";
  const text = [
    kind,
    "",
    `Parent name: ${lead.parentName}`,
    lead.phone ? `Phone: ${lead.phone}` : "",
    lead.email ? `Email: ${lead.email}` : "",
    lead.question ? `Question:\n${lead.question}\n` : "",
    lead.zip ? `Zip: ${lead.zip}` : "",
    lead.state ? `State: ${lead.state}` : "",
    lead.childAge ? `Child's age range: ${lead.childAge}` : "",
    lead.insurance ? `Coverage: ${lead.insurance}` : "",
    lead.concerns.length ? `Noticed: ${lead.concerns.join(", ")}` : "",
    lead.type ? `Lead type: ${lead.type}` : "",
    `Source page: ${lead.sourcePage}`,
    `Received: ${new Date().toISOString()}`,
    "",
    "Respond within 5 minutes when possible — lead-qualification odds drop steeply after that.",
  ]
    .filter(Boolean)
    .join("\n");

  try {
    const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [
          { to: [{ email: siteConfig.leadNotificationEmail }] },
        ],
        from: {
          // Must be a SendGrid-verified sender on the deployed account.
          email: siteConfig.email,
          name: `${siteConfig.brandName} website`,
        },
        subject: `${kind} — ${lead.zip || lead.state || lead.email} (${lead.sourcePage})`,
        content: [{ type: "text/plain", value: text }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      return emailFailed(`SendGrid ${res.status} ${detail.slice(0, 120)}`);
    }
  } catch (err) {
    return emailFailed(String(err));
  }

  await insertInto("leads", { ...row, email_status: "sent" });
  return NextResponse.json({ ok: true });
}
