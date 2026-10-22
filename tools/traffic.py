#!/usr/bin/env python3
"""
Traffic report for sunbirdaba.com.

    tools/traffic.sh            # today
    tools/traffic.sh 2          # last 2 days
    tools/traffic.sh 7 --bots   # last week, plus crawler activity
    tools/traffic.sh 1 --internal  # include your own flagged visits

Humans only by default. "Human" means: the user-agent wasn't recognised as a
bot AND the visit wasn't flagged internal (visit any page once with
?internal=1 to flag your own browser). Bots are recorded rather than dropped,
so this is a filter and not a gap in the data.

One caveat the numbers carry honestly: the visitor id is re-salted every night
so nobody can be followed across days. Within one day a person is counted once;
across a range, somebody who came back on two days counts twice. That is the
price of not tracking people, and it is stated in the output.
"""
import json
import subprocess
import sys

PROJECT = "sproutwell-aba-260907"
T = f"`{PROJECT}.sunbird_traffic.events`"
# PageSpeed/Lighthouse phone tests run real Chrome as a "moto g power", so
# they pass the bot check; no real visitor volume comes from that handset.
LAB = "ua NOT LIKE '%moto g power%'"
HUMAN = f"NOT is_bot AND NOT is_internal AND {LAB}"


def bq(sql: str):
    out = subprocess.run(
        ["bq", "query", "--use_legacy_sql=false", "--format=json",
         f"--project_id={PROJECT}", "--quiet", sql],
        capture_output=True, text=True,
    )
    if out.returncode != 0:
        sys.stderr.write(out.stderr)
        sys.exit(1)
    body = out.stdout.strip()
    return json.loads(body) if body else []


def dur(ms) -> str:
    if ms in (None, ""):
        return "—"
    s = int(float(ms)) // 1000
    if s < 60:
        return f"{s}s"
    return f"{s // 60}m {s % 60:02d}s"


def n(v) -> int:
    return int(v) if v not in (None, "") else 0


def rule(label: str):
    print(f"\n\033[1m{label}\033[0m")
    print("─" * 74)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    days = int(args[0]) if args else 1
    show_bots = "--bots" in sys.argv
    # --internal keeps your own flagged visits in, which is how you check that
    # a visit of yours actually registered.
    if "--internal" in sys.argv or "--all" in sys.argv:
        global HUMAN
        HUMAN = f"NOT is_bot AND {LAB}"
    window = f"ts >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL {days * 24} HOUR)"
    label = "last 24 hours" if days == 1 else f"last {days} days"

    scope = "humans only, internal included" if "is_internal" not in HUMAN else "humans only, internal excluded"
    print(f"\n\033[1msunbirdaba.com — {label}\033[0m   ({scope})")

    tot = bq(f"""
      SELECT
        COUNT(DISTINCT visitor) AS visitors,
        COUNT(DISTINCT session) AS sessions,
        COUNTIF(kind='view')    AS views,
        COUNTIF(kind='leave')   AS leaves,
        COUNTIF(kind='lead')    AS leads,
        APPROX_QUANTILES(IF(kind='leave' AND dwell_ms>0, dwell_ms, NULL), 2)[OFFSET(1)] AS med_dwell,
        AVG(IF(kind='leave' AND dwell_ms>0, dwell_ms, NULL)) AS avg_dwell,
        APPROX_QUANTILES(IF(kind='leave', scroll_pct, NULL), 2)[OFFSET(1)] AS med_scroll
      FROM {T} WHERE {window} AND {HUMAN}
    """)
    t = tot[0] if tot else {}
    if n(t.get("visitors")) == 0:
        print("\n  Nobody. No human visits recorded in this window.\n")
        if not show_bots:
            return

    rule("Overall")
    v, s, pv = n(t.get("visitors")), n(t.get("sessions")), n(t.get("views"))
    print(f"  Visitors          {v:>7,}   {'(a returning visitor counts once per day)' if days > 1 else ''}")
    print(f"  Sessions          {s:>7,}")
    print(f"  Page views        {pv:>7,}   {pv / v:.1f} per visitor" if v else f"  Page views        {pv:>7,}")
    lv = n(t.get("leaves"))
    if lv > pv:
        # Every view should have a matching leave. More leaves than views means
        # load beacons are being lost — an ad blocker, or stale cached JS.
        print(f"  \033[33m! {lv - pv} visit(s) recorded only on exit — the load beacon didn't arrive\033[0m")
    print(f"  Time on page      {dur(t.get('med_dwell')):>7}   median   ({dur(t.get('avg_dwell'))} mean)")
    print(f"  Scroll depth      {n(t.get('med_scroll')):>6}%   median")
    leads = n(t.get("leads"))
    if leads:
        rate = leads / v * 100 if v else 0
        print(f"  \033[32mLeads             {leads:>7,}   {rate:.1f}% of visitors\033[0m")

    rule("Where they came from")
    src = bq(f"""
      SELECT source_group AS g, COUNT(DISTINCT visitor) AS v, COUNT(*) AS pv
      FROM {T} WHERE {window} AND {HUMAN} AND kind='view'
      GROUP BY g ORDER BY v DESC
    """)
    if not src:
        print("  Unknown — the load beacon carries the referrer, and it didn't arrive.")
    for r in src:
        share = n(r["v"]) / v * 100 if v else 0
        bar = "█" * max(0, round(share / 4))
        print(f"  {r['g']:<18} {n(r['v']):>5} visitors  {n(r['pv']):>5} views  {share:5.1f}% {bar}")

    ref = bq(f"""
      SELECT referrer_host AS h, COUNT(DISTINCT visitor) AS v
      FROM {T} WHERE {window} AND {HUMAN} AND kind='view' AND referrer_host IS NOT NULL
      GROUP BY h ORDER BY v DESC LIMIT 12
    """)
    if ref:
        rule("Referring sites")
        for r in ref:
            print(f"  {n(r['v']):>5}  {r['h']}")

    rule("Pages — most read, with real time on page")
    for r in bq(f"""
      SELECT path,
             COUNT(DISTINCT session) AS views,
             COUNT(DISTINCT visitor) AS visitors,
             APPROX_QUANTILES(IF(kind='leave' AND dwell_ms>0, dwell_ms, NULL), 2)[OFFSET(1)] AS med,
             APPROX_QUANTILES(IF(kind='leave', scroll_pct, NULL), 2)[OFFSET(1)] AS scr
      FROM {T} WHERE {window} AND {HUMAN}
      GROUP BY path ORDER BY views DESC LIMIT 25
    """):
        print(f"  {n(r['views']):>4} visit {n(r['visitors']):>4} ppl  {dur(r['med']):>7}  {n(r['scr']):>3}% scroll  {r['path'][:58]}")

    ent = bq(f"""
      SELECT path, COUNT(DISTINCT visitor) AS v
      FROM {T} WHERE {window} AND {HUMAN} AND kind='view' AND entry
      GROUP BY path ORDER BY v DESC LIMIT 12
    """)
    if ent:
        rule("Landing pages — where the visit started")
        for r in ent:
            print(f"  {n(r['v']):>5}  {r['path'][:62]}")

    lwindow = window.replace("ts >=", "l.ts >=", 1)
    lhuman = HUMAN.replace("is_bot", "l.is_bot").replace("is_internal", "l.is_internal").replace("ua NOT", "l.ua NOT")
    lead_rows = bq(f"""
      SELECT l.ts AS ts, l.path AS path, 'form' AS form,
             IFNULL(j.landed, l.path) AS landed,
             IFNULL(j.src, 'Unknown') AS src,
             l.country AS c, l.device AS d
      FROM {T} l
      LEFT JOIN (
        SELECT session,
               ARRAY_AGG(path ORDER BY ts LIMIT 1)[OFFSET(0)] AS landed,
               ARRAY_AGG(source_group ORDER BY ts LIMIT 1)[OFFSET(0)] AS src
        FROM {T} WHERE kind='view' GROUP BY session
      ) j ON j.session = l.session
      WHERE l.kind='lead' AND {lwindow} AND {lhuman}
      ORDER BY l.ts DESC LIMIT 25
    """)
    if lead_rows:
        rule("Leads — and what brought them")
        for r in lead_rows:
            print(f"  \033[32m{r['ts'][11:16]}\033[0m  {r['src']:<15} landed {str(r['landed'])[:40]:40s}")
            print(f"         submitted the form on {str(r['path'])[:52]}")

    rule("Who and what")
    geo = bq(f"""
      SELECT IFNULL(country,'?') AS c, IFNULL(region,'') AS r, COUNT(DISTINCT visitor) AS v
      FROM {T} WHERE {window} AND {HUMAN} GROUP BY c, r ORDER BY v DESC LIMIT 10
    """)
    print("  " + "  ".join(f"{g['c']}{'/' + g['r'] if g['r'] else ''}:{n(g['v'])}" for g in geo))
    dev = bq(f"""
      SELECT device AS d, COUNT(DISTINCT visitor) AS v
      FROM {T} WHERE {window} AND {HUMAN} GROUP BY d ORDER BY v DESC
    """)
    print("  " + "   ".join(f"{d['d']}: {n(d['v'])}" for d in dev))

    if show_bots:
        rule("Crawlers (excluded from everything above)")
        for r in bq(f"""
          SELECT IFNULL(bot_name,'?') AS b, COUNTIF(kind='view') AS pv,
                 COUNT(DISTINCT path) AS paths
          FROM {T} WHERE {window} AND is_bot
          GROUP BY b ORDER BY pv DESC LIMIT 15
        """):
            print(f"  {n(r['pv']):>6} hits  {n(r['paths']):>5} distinct pages  {r['b']}")
    print()


if __name__ == "__main__":
    main()
