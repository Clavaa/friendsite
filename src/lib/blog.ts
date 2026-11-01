import fs from "node:fs";
import path from "node:path";
import { siteConfig, stateSlugs } from "../../site.config";

/**
 * The blog: human-written, dated, bylined articles (unlike /resources,
 * whose guides are evergreen and unsigned). Each post is one Markdown file
 * in content/blog/<slug>.md — drop a file in, rebuild, it's live.
 *
 * Front matter (between --- lines):
 *   title:        H1 (keyword first)
 *   metaTitle:    SERP title, ≤ 60 characters (defaults to title)
 *   description:  meta description, ~120–155 characters
 *   date:         2026-11-02 (published)
 *   updated:      2026-11-09 (optional)
 *   author:       Ruth Gluck   (optional; default is the Sunbird ABA team)
 *   authorTitle:  MSEd, BCBA   (optional)
 *   tags:         [diagnosis, insurance]  — drives related guides/posts
 *   draft:        true         (optional; drafts are never built)
 *
 * Body: ## and ### headings, paragraphs, "- " and "1. " lists, > quotes,
 * **bold**, *italic*, [text](/path) links. A "## Questions parents ask"
 * (or "## FAQ") section made of "### question" + answer paragraphs renders
 * as an FAQ with FAQPage markup.
 *
 * Server-only (reads the filesystem at build time).
 */

const DIR = path.join(process.cwd(), "content", "blog");

export type Inline = string;
export type Block =
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: Inline }
  | { type: "ul" | "ol"; items: Inline[] }
  | { type: "quote"; text: Inline };

export interface Post {
  slug: string;
  title: string;
  metaTitle: string;
  description: string;
  date: string;
  updated?: string;
  author?: string;
  authorTitle?: string;
  tags: string[];
  blocks: Block[];
  faqs: { q: string; a: string }[];
  minutes: number;
}

function parseFrontMatter(raw: string): { meta: Record<string, string | string[]>; body: string } {
  const m = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?([\s\S]*)$/);
  if (!m) return { meta: {}, body: raw };
  const meta: Record<string, string | string[]> = {};
  for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*(.*)$/);
    if (!kv) continue;
    const v = kv[2].trim();
    meta[kv[1]] = v.startsWith("[")
      ? v.replace(/^\[|\]$/g, "").split(",").map((s) => s.trim().replace(/^["']|["']$/g, "")).filter(Boolean)
      : v.replace(/^["']|["']$/g, "");
  }
  return { meta, body: m[2] };
}

export const slugify = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

function parseBody(body: string): Block[] {
  const blocks: Block[] = [];
  const lines = body.replace(/\r/g, "").split("\n");
  let para: string[] = [];
  let list: { type: "ul" | "ol"; items: string[] } | null = null;
  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join(" ") });
    para = [];
    if (list) blocks.push(list);
    list = null;
  };
  for (const line of lines) {
    const t = line.trim();
    if (!t) { flush(); continue; }
    let m: RegExpMatchArray | null;
    if ((m = t.match(/^##\s+(.+)$/)) && !t.startsWith("###")) { flush(); blocks.push({ type: "h2", text: m[1], id: slugify(m[1]) }); continue; }
    if ((m = t.match(/^###\s+(.+)$/))) { flush(); blocks.push({ type: "h3", text: m[1] }); continue; }
    if ((m = t.match(/^>\s?(.*)$/))) { flush(); blocks.push({ type: "quote", text: m[1] }); continue; }
    if ((m = t.match(/^[-*]\s+(.+)$/)) || (m = t.match(/^\d+[.)]\s+(.+)$/))) {
      const type = /^\d/.test(t) ? "ol" : "ul";
      if (para.length) { blocks.push({ type: "p", text: para.join(" ") }); para = []; }
      if (!list || list.type !== type) { if (list) blocks.push(list); list = { type, items: [] }; }
      list.items.push(m[1]);
      continue;
    }
    if (list) { blocks.push(list); list = null; }
    para.push(t);
  }
  flush();
  return blocks;
}

/** Pulls a trailing "## Questions parents ask" / "## FAQ" section out as FAQs. */
function splitFaqs(blocks: Block[]): { blocks: Block[]; faqs: Post["faqs"] } {
  const at = blocks.findIndex((b) => b.type === "h2" && /^(faqs?|frequently asked|questions)/i.test(b.text));
  if (at < 0) return { blocks, faqs: [] };
  const end = blocks.findIndex((b, i) => i > at && b.type === "h2");
  const section = blocks.slice(at + 1, end < 0 ? undefined : end);
  const faqs: Post["faqs"] = [];
  for (const b of section) {
    if (b.type === "h3") faqs.push({ q: b.text, a: "" });
    else if (faqs.length && (b.type === "p" || b.type === "quote"))
      faqs[faqs.length - 1].a += (faqs[faqs.length - 1].a ? " " : "") + stripInline(b.text);
  }
  if (!faqs.length) return { blocks, faqs };
  return { blocks: [...blocks.slice(0, at), ...(end < 0 ? [] : blocks.slice(end))], faqs };
}

/** Plain text of an inline string (links → their text, emphasis removed). */
export function stripInline(s: string): string {
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/\*\*([^*]+)\*\*/g, "$1").replace(/\*([^*]+)\*/g, "$1");
}

function load(): Post[] {
  if (!fs.existsSync(DIR)) return [];
  const posts: Post[] = [];
  for (const file of fs.readdirSync(DIR)) {
    if (!file.endsWith(".md") || file.startsWith("_") || file.toLowerCase() === "readme.md") continue;
    const { meta, body } = parseFrontMatter(fs.readFileSync(path.join(DIR, file), "utf8"));
    if (meta.draft === "true" || !meta.title || !meta.date) continue;
    const { blocks, faqs } = splitFaqs(parseBody(body));
    const words = body.split(/\s+/).length;
    const str = (k: string) => (typeof meta[k] === "string" ? (meta[k] as string) : undefined);
    posts.push({
      slug: file.replace(/\.md$/, ""),
      title: str("title")!,
      metaTitle: str("metaTitle") ?? str("title")!,
      description: str("description") ?? "",
      date: str("date")!,
      updated: str("updated"),
      author: str("author"),
      authorTitle: str("authorTitle"),
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      blocks,
      faqs,
      minutes: Math.max(1, Math.round(words / 230)),
    });
  }
  return posts.sort((a, b) => b.date.localeCompare(a.date));
}

export const posts: Post[] = load();
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/** Other posts that share the most tags, newest first. */
export function relatedPosts(p: Post, n = 3): Post[] {
  return posts
    .filter((o) => o.slug !== p.slug)
    .map((o) => ({ o, score: o.tags.filter((t) => p.tags.includes(t)).length }))
    .sort((a, b) => b.score - a.score || b.o.date.localeCompare(a.o.date))
    .slice(0, n)
    .map((x) => x.o);
}

/* ————————————————— Automatic internal links —————————————————
 * The first mention of each phrase in a post's body becomes a link to the
 * page that owns that topic — once per destination, never inside headings
 * or an author's own links, never to the post itself. Longer phrases win
 * over shorter ones ("in-home ABA" before "ABA"). */

export interface AutoLink { phrase: RegExp; href: string }

const TOPICS: [string[], string][] = [
  [["applied behavior analysis", "what ABA is", "what is ABA"], "/resources/what-is-aba"],
  [["in-home ABA", "ABA at home", "in-home therapy", "home-based ABA"], "/services/in-home-aba"],
  [["daycare-based ABA", "ABA at daycare", "daycare"], "/services/daycare-based"],
  [["parent training", "parent coaching"], "/services/parent-training"],
  [["telehealth"], "/services/telehealth"],
  [["free benefit check", "benefit check", "insurance coverage", "insurance"], "/insurance"],
  [["Medicaid"], "/resources/paying-for-aba"],
  [["autism evaluation", "autism diagnosis", "evaluation", "diagnosis"], "/get-a-diagnosis"],
  [["M-CHAT", "MCHAT", "autism screening"], "/resources/the-m-chat-screening"],
  [["BCBA", "board-certified behavior analyst", "RBT", "registered behavior technician"], "/resources/who-is-on-the-team"],
  [["speech therapy", "speech therapist"], "/resources/aba-vs-speech-therapy"],
  [["level 2 autism"], "/resources/what-does-level-2-autism-mean"],
  [["hours of ABA", "how many hours"], "/resources/how-many-hours-of-aba"],
  [["signs of autism", "early signs"], "/resources/signs-of-autism-at-age-2"],
  [["toddler", "toddlers"], "/resources/aba-therapy-for-toddlers"],
  [["first session"], "/resources/preparing-for-your-first-session"],
  [["is ABA harmful", "criticism of ABA"], "/resources/is-aba-therapy-harmful"],
  [["after a diagnosis", "new diagnosis"], "/resources/first-steps-after-a-diagnosis"],
  [["getting started", "intake"], "/getting-started"],
  [["careers", "RBT jobs", "BCBA jobs"], "/careers"],
];

const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const AUTO_LINKS: AutoLink[] = (() => {
  const list: { phrase: string; href: string }[] = [];
  for (const [phrases, href] of TOPICS) for (const p of phrases) list.push({ phrase: p, href });
  for (const st of stateSlugs) {
    const s = siteConfig.states[st];
    for (const c of s.cities) list.push({ phrase: c.name, href: `/${st}/${c.slug}` });
    list.push({ phrase: s.name, href: `/${st}` });
  }
  return list
    .sort((a, b) => b.phrase.length - a.phrase.length)
    .map(({ phrase, href }) => ({
      // "Kansas" must not grab the start of "Kansas City", nor "Colorado" of "Colorado Springs".
      phrase: new RegExp(`(?<![\\w-])${esc(phrase)}(?![\\w-])${phrase === "Kansas" ? "(?! City)" : phrase === "Colorado" ? "(?! Springs)" : ""}`, "i"),
      href,
    }));
})();

/** Max automatic links per post, on top of whatever the author linked. */
export const AUTO_LINK_CAP = 18;
