import Link from "next/link";
import type { ReactNode } from "react";
import { AUTO_LINK_CAP, AUTO_LINKS, type Block } from "../lib/blog";

/**
 * Renders a blog post body and weaves in the automatic internal links:
 * the first mention of each topic (city, service, guide) links to the page
 * that owns it, once per destination per post, capped at AUTO_LINK_CAP.
 * Author-written links are kept as written and count as "used".
 */

const linkCls = "font-bold text-brand-teal underline decoration-brand-teal/30 underline-offset-2 hover:decoration-brand-teal";

type State = { used: Set<string>; auto: number; self: string };

function autolink(text: string, st: State, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  let rest = text;
  let k = 0;
  while (rest && st.auto < AUTO_LINK_CAP) {
    let best: { i: number; len: number; href: string } | null = null;
    for (const l of AUTO_LINKS) {
      if (st.used.has(l.href) || l.href === st.self) continue;
      const m = l.phrase.exec(rest);
      if (m && (!best || m.index < best.i)) best = { i: m.index, len: m[0].length, href: l.href };
    }
    if (!best) break;
    if (best.i > 0) out.push(rest.slice(0, best.i));
    out.push(
      <Link key={`${keyBase}-a${k++}`} href={best.href} className={linkCls}>
        {rest.slice(best.i, best.i + best.len)}
      </Link>
    );
    st.used.add(best.href);
    st.auto++;
    rest = rest.slice(best.i + best.len);
  }
  if (rest) out.push(rest);
  return out;
}

function inline(text: string, st: State, keyBase: string): ReactNode[] {
  const re = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*|\*([^*]+)\*/g;
  const out: ReactNode[] = [];
  let last = 0;
  let k = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(...autolink(text.slice(last, m.index), st, `${keyBase}-${k++}`));
    if (m[1]) {
      const href = m[2];
      if (href.startsWith("/")) {
        st.used.add(href.split("#")[0]);
        out.push(<Link key={`${keyBase}-l${k++}`} href={href} className={linkCls}>{m[1]}</Link>);
      } else {
        out.push(<a key={`${keyBase}-x${k++}`} href={href} target="_blank" rel="noopener" className={linkCls}>{m[1]}</a>);
      }
    } else if (m[3]) out.push(<strong key={`${keyBase}-b${k++}`} className="text-ink">{autolink(m[3], st, `${keyBase}-bb${k}`)}</strong>);
    else if (m[4]) out.push(<em key={`${keyBase}-i${k++}`}>{autolink(m[4], st, `${keyBase}-ii${k}`)}</em>);
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(...autolink(text.slice(last), st, `${keyBase}-${k++}`));
  return out;
}

export default function BlogBody({ blocks, self }: { blocks: Block[]; self: string }) {
  const st: State = { used: new Set([self]), auto: 0, self };
  return (
    <div className="prose-measure">
      {blocks.map((b, i) => {
        const key = `b${i}`;
        switch (b.type) {
          case "h2":
            return <h2 key={key} id={b.id} className="font-display mt-12 scroll-mt-28 text-2xl first:mt-0 sm:text-3xl">{b.text}</h2>;
          case "h3":
            return <h3 key={key} className="font-display mt-8 text-xl sm:text-[1.4rem]">{b.text}</h3>;
          case "p":
            return <p key={key} className="mt-4 leading-relaxed text-ink-soft">{inline(b.text, st, key)}</p>;
          case "quote":
            return (
              <blockquote key={key} className="mt-6 rounded-r-2xl border-l-4 border-sun bg-sun-wash/60 px-5 py-4 text-[17px] leading-relaxed text-ink">
                {inline(b.text, st, key)}
              </blockquote>
            );
          case "ul":
          case "ol": {
            const L = b.type === "ul" ? "ul" : "ol";
            return (
              <L key={key} className={`mt-4 space-y-2 pl-6 text-ink-soft ${b.type === "ul" ? "list-disc" : "list-decimal"} marker:text-brand-teal`}>
                {b.items.map((it, j) => <li key={j} className="pl-1 leading-relaxed">{inline(it, st, `${key}-${j}`)}</li>)}
              </L>
            );
          }
        }
      })}
    </div>
  );
}
