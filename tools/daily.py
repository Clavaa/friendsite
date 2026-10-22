#!/usr/bin/env python3
"""
Daily visitor report for sunbirdaba.com: where people came from, and what
each one read and clicked.

    tools/daily.sh            # today (US Eastern)
    tools/daily.sh 2          # today + yesterday
    tools/daily.sh 1 --all    # keep NY/NJ visitors in

NY and NJ are left out by default (owner/team locations). Scrapers are left
out too: a real visitor either closed a page (a "leave" event), arrived with a
referrer, clicked something, or sent a lead. The SG/CN/HK scraper wave does
none of those.
"""
import json
import subprocess
import sys
from collections import Counter, defaultdict

PROJECT = "sproutwell-aba-260907"
T = f"`{PROJECT}.sunbird_traffic.events`"
TZ = "America/New_York"
HUMAN = "NOT is_bot AND NOT is_internal AND ua NOT LIKE '%moto g power%'"
SKIP_REGIONS = ("NY", "NJ")

WORK_TOOLS = ("clickup", "teams.", "syniverse", "affirm.lightning", "slack", "notion")
MARKETING_HOSTS = ("therapy.sunbirdaba.com", "211", "unitedway")


def bq(sql: str):
    out = subprocess.run(
        ["bq", "query", "--use_legacy_sql=false", "--format=json",
         f"--project_id={PROJECT}", "--quiet", "--max_rows=100000", sql],
        capture_output=True, text=True,
    )
    if out.returncode != 0:
        sys.stderr.write(out.stderr)
        sys.exit(1)
    body = out.stdout.strip()
    return json.loads(body) if body else []


def bucket(v) -> str:
    g, host = v["source_group"] or "", (v["referrer_host"] or "").lower()
    us = (v["utm_source"] or "").lower()
    if any(w in host for w in WORK_TOOLS):
        return "Work tools (staff/partners)"
    if g in ("Google organic", "Bing", "Other search", "AI assistant"):
        return "SEO"
    if (g.startswith("Paid") or g in ("Social", "Email", "Campaign", "Google Business Profile")
            or any(m in host or m in us for m in MARKETING_HOSTS)):
        return "Marketing"
    if g == "Direct / app":
        return "Direct / unknown"
    return "Other referral"


def source_label(v) -> str:
    host = (v["referrer_host"] or "").replace("www.", "")
    if v["utm_source"]:
        return f"{v['source_group']} ({v['utm_source']}{' / ' + host if host else ''})"
    if v["source_group"] in ("Google organic", "Bing", "Other search", "Direct / app"):
        return v["source_group"]
    return f"{v['source_group']} ({host})" if host else v["source_group"]


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    days = int(args[0]) if args else 1
    keep_all = "--all" in sys.argv
    since = f"TIMESTAMP(DATE_SUB(CURRENT_DATE('{TZ}'), INTERVAL {days - 1} DAY), '{TZ}')"

    rows = bq(f"""
      SELECT FORMAT_TIMESTAMP('%m-%d %H:%M', ts, '{TZ}') t, visitor, session, kind, path,
             title, referrer_host, source_group, utm_source, region, country, device,
             dwell_ms, scroll_pct
      FROM {T}
      WHERE ts >= {since} AND kind IN ('view','leave','click','lead') AND {HUMAN}
      ORDER BY ts""")

    people = defaultdict(list)
    for r in rows:
        r["dwell_ms"] = int(r["dwell_ms"] or 0)
        r["scroll_pct"] = int(r["scroll_pct"] or 0)
        people[r["visitor"]].append(r)

    kept, skipped_region = [], 0
    for vid, ev in people.items():
        real = any(e["kind"] in ("leave", "click", "lead") or e["referrer_host"] for e in ev)
        if not real:
            continue
        geo = ev[0]["region"] if ev[0]["country"] == "US" else ev[0]["country"]
        if not keep_all and ev[0]["country"] == "US" and ev[0]["region"] in SKIP_REGIONS:
            skipped_region += 1
            continue
        first = next((e for e in ev if e["kind"] == "view"), ev[0])
        kept.append((vid, ev, first, geo))

    span = "today" if days == 1 else f"last {days} days"
    print(f"Sunbird visitors, {span} (ET){'' if keep_all else ' — NY/NJ excluded'}")
    print(f"{len(kept)} real visitors"
          + (f"  (+{skipped_region} from NY/NJ not shown)" if skipped_region else ""))
    print()

    by_bucket = Counter(bucket(f) for _, _, f, _ in kept)
    by_source = Counter(source_label(f) for _, _, f, _ in kept)
    leads = sum(1 for _, ev, _, _ in kept if any(e["kind"] == "lead" for e in ev))
    calls = sum(1 for _, ev, _, _ in kept
                if any(e["kind"] == "click" and "tel:" in (e["title"] or "") for e in ev))
    print("SOURCES")
    for b in ("SEO", "Marketing", "Direct / unknown", "Other referral", "Work tools (staff/partners)"):
        if by_bucket[b]:
            print(f"  {b:<30}{by_bucket[b]:>4}")
    print("  detail: " + ", ".join(f"{k} {n}" for k, n in by_source.most_common()))
    print(f"  leads: {leads}   phone taps: {calls}")
    print()

    print("WHO DID WHAT")
    for vid, ev, first, geo in sorted(kept, key=lambda k: k[1][0]["t"]):
        secs = sum((e["dwell_ms"] or 0) for e in ev if e["kind"] == "leave") // 1000
        print(f"\n  {ev[0]['t']}  {geo or '?'} · {first['device']} · {source_label(first)}"
              f" · {secs // 60}m{secs % 60:02d}s")
        dwell = defaultdict(int)
        scroll = defaultdict(int)
        for e in ev:
            if e["kind"] == "leave":
                dwell[e["path"]] += (e["dwell_ms"] or 0) // 1000
                scroll[e["path"]] = max(scroll[e["path"]], e["scroll_pct"] or 0)
        seen = set()
        for e in ev:
            if e["kind"] in ("view", "leave") and e["path"] not in seen:
                seen.add(e["path"])
                d = dwell.get(e["path"])
                extra = f"  {d}s, scrolled {scroll[e['path']]}%" if d is not None else ""
                print(f"     read  {e['path']}{extra}")
            elif e["kind"] == "click":
                print(f"     click \"{e['title']}\"  (on {e['path']})")
            elif e["kind"] == "lead":
                print(f"     LEAD  form sent on {e['path']}")


if __name__ == "__main__":
    main()
