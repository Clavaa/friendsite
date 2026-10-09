#!/usr/bin/env python3
"""
Builds the local-data layer for the Sunbird site (aba-ks-co).

Outputs (into src/data/):
  - local.json  — per county / town / hub-city facts: Census ACS 2023 5-yr
                  child, broadband, insurance-mix, working-parent, income and
                  child-poverty figures; ZIP codes (2020 ZCTA relationship);
                  school districts (NCES CCD 2022 via Urban Institute);
                  county seat (Wikidata); coordinates + land area (2024
                  Gazetteer); nearest Sunbird team city and nearest pages,
                  with straight-line miles.
  - towns.json  — the existing town layer, extended: every incorporated place
                  now gets a page (the <100-pop "tiny" list is promoted) and
                  census-designated places with >= 250 people are added.
                  Existing slugs/URLs are never changed.

Inputs (../research/local/, a sibling of this repo — raw downloads are
not committed): acs_*.psv, 2024_Gaz_*_national.txt, zcta_place.psv,
zcta_county.psv, place_county.psv, ed_20.json, ed_8.json, seats.json.

Re-download the inputs: see "Refreshing the local data" in
../seo/README.md. Then, from the repo root (re-runs are idempotent —
towns.json is extended in place and existing slugs never change):

    python3 scripts/build_local.py && npx next build
"""
import csv, json, math, os, re, sys
from collections import defaultdict

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
HERE = os.path.join(SITE, "..", "research", "local")
DATA = os.path.join(SITE, "src", "data")

ST = {"20": ("kansas", "KS"), "08": ("colorado", "CO")}
USPS = {"KS": "20", "CO": "08"}
MIN_CDP_POP = 250

HUBS = {
    "kansas": {"Wichita": "wichita", "Overland Park": "overland-park",
               "Kansas City": "kansas-city", "Olathe": "olathe", "Topeka": "topeka"},
    "colorado": {"Denver": "denver", "Colorado Springs": "colorado-springs",
                 "Aurora": "aurora", "Fort Collins": "fort-collins", "Lakewood": "lakewood"},
}


def slugify(s):
    s = s.lower().replace("&", "and").replace("'", "").replace("’", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def display_name(raw):
    if raw == "Raymer (New Raymer) town":
        return "New Raymer"
    if raw == "Central city":
        return "Central City"
    return re.sub(r" (city|town|CDP|village|consolidated government \(balance\)|unified government \(balance\))$", "", raw)


def num(x):
    try:
        return int(float(x))
    except Exception:
        return None


# ---------- ACS ----------
acs = defaultdict(dict)  # geoid -> {col: val}
for fn in os.listdir(HERE):
    if fn.startswith("acs_") and fn.endswith(".psv"):
        with open(os.path.join(HERE, fn)) as f:
            r = csv.reader(f, delimiter="|")
            head = next(r)
            for row in r:
                g = row[0]
                key = ("c" + g[9:]) if g.startswith("0500000US") else ("p" + g[9:])
                for h, v in zip(head[1:], row[1:]):
                    if "_E" in h:
                        acs[key][h] = num(v)


def pct(n, d, min_d=40):
    if n is None or not d or d < min_d:
        return None
    return round(100.0 * n / d, 1)


def stats(key):
    a = acs.get(key)
    if not a and key.startswith("p") and key[1:] in gaz_place:
        a = acs.get("p" + gaz_place[key[1:]]["GEOID"])
    if not a:
        return None
    g = lambda k: a.get(k) or 0
    under6 = g("B23008_E002")
    kids19 = g("B27010_E002")
    kp_below = g("B17020_E003") + g("B17020_E004") + g("B17020_E005")
    kp_total = kp_below + g("B17020_E011") + g("B17020_E012") + g("B17020_E013")
    hh = g("B28002_E001")
    inc = a.get("B19013_E001")
    return {
        "pop": g("B01003_E001"),
        "under5": g("B01001_E003") + g("B01001_E027"),
        "under18": g("B09001_E001"),
        "under6": under6,
        # Denominator floors keep small-sample noise off the page: below them
        # the page falls back to the county-wide figure (labeled as such).
        "under6AllParentsWorkPct": pct(g("B23008_E004") + g("B23008_E010") + g("B23008_E013"), under6, 150),
        "households": hh,
        "broadbandPct": pct(g("B28002_E004"), hh, 150),
        "kidsUninsuredPct": pct(g("B27010_E017"), kids19, 300),
        "kidsPublicOnlyPct": pct(g("B27010_E007"), kids19, 300),
        "medianIncome": inc if inc and inc > 0 else None,
        "childPovertyPct": pct(kp_below, kp_total, 300),
    }


# ---------- Gazetteer ----------
def read_gaz(fn):
    out = {}
    with open(os.path.join(HERE, fn)) as f:
        rows = list(csv.reader(f, delimiter="\t"))
    h = [x.strip() for x in rows[0]]
    for r in rows[1:]:
        d = dict(zip(h, [x.strip() for x in r]))
        if d["USPS"] in USPS:
            out[d["GEOID"]] = d
    return out


gaz_place_raw = read_gaz("2024_Gaz_place_national.txt")
# Place GEOIDs can change between vintages (Central City, CO: 0812910 in
# the 2020 relationship files, 0812900 in the 2024 Gazetteer). The ANSI
# code is permanent, so key the Gazetteer by the 2020 GEOID via ANSI.
gaz_by_ansi = {d["ANSICODE"]: d for d in gaz_place_raw.values()}
gaz_place = dict(gaz_place_raw)
gaz_county = read_gaz("2024_Gaz_counties_national.txt")


def coord(d):
    return (float(d["INTPTLAT"]), float(d["INTPTLONG"]))


def miles(a, b):
    R = 3958.8
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


# ---------- existing site data ----------
counties = json.load(open(os.path.join(DATA, "counties.json")))
towns = json.load(open(os.path.join(DATA, "towns.json")))
# The original town build stripped "Central city" to "Central"; the real
# name is Central City (old URL 301s via next.config.ts).
for t in towns["colorado"]["towns"]:
    if t["county"] == "gilpin" and t["slug"] == "central":
        t["name"], t["slug"] = "Central City", "central-city"
county_by_fips = {}
for st, lst in counties.items():
    for c in lst:
        county_by_fips[c["fips"]] = (st, c)

# ---------- place -> county ----------
place_counties = defaultdict(list)  # place geoid -> [county fips]
place_meta = {}
with open(os.path.join(HERE, "place_county.psv")) as f:
    for d in csv.DictReader(f, delimiter="|"):
        pg = d["STATEFP"] + d["PLACEFP"]
        place_counties[pg].append(d["STATEFP"] + d["COUNTYFP"])
        place_meta[pg] = d
        g = gaz_by_ansi.get(d["PLACENS"])
        if g and pg not in gaz_place:
            gaz_place[pg] = g

# ZCTA land overlap per (place, county) to choose the primary county for a
# multi-county CDP: the county whose interior point is nearest the place's.
def primary_county(pg):
    cs = place_counties[pg]
    if len(cs) == 1 or pg not in gaz_place:
        return cs[0]
    pc = coord(gaz_place[pg])
    return min(cs, key=lambda c: miles(pc, coord(gaz_county[c])) if c in gaz_county else 1e9)


# ---------- index every place ----------
places = {}  # pg -> info
for pg, meta in place_meta.items():
    st, abbr = ST[pg[:2]]
    raw = meta["PLACENAME"]
    if "(balance)" in raw:
        continue
    name = display_name(raw)
    cfips = primary_county(pg)
    if cfips not in county_by_fips:
        continue
    places[pg] = {
        "geoid": pg, "state": st, "name": name, "raw": raw,
        "kind": "cdp" if meta["TYPE"].startswith("CENSUS") else "incorporated",
        "county": county_by_fips[cfips][1]["slug"],
        "counties": [county_by_fips[c][1]["slug"] for c in place_counties[pg] if c in county_by_fips],
    }

# Match existing towns to geoids (by state + county + slug of display name).
idx = {(p["state"], p["county"], slugify(p["name"])): pg for pg, p in places.items()}
idx_any = defaultdict(list)
for pg, p in places.items():
    idx_any[(p["state"], slugify(p["name"]))].append(pg)


def find_geoid(st, county, slug, name):
    k = (st, county, slug)
    if k in idx:
        return idx[k]
    cands = [g for g in idx_any[(st, slugify(name))] if places[g]["kind"] == "incorporated"]
    if len(cands) == 1:
        return cands[0]
    return None


missing = []
for st in ("kansas", "colorado"):
    for bucket in ("towns", "tiny"):
        for t in towns[st][bucket]:
            g = find_geoid(st, t["county"], t["slug"], t["name"])
            if not g:
                missing.append((st, t["county"], t["slug"]))
            t["geoid"] = g
    for r in towns[st]["cityRedirects"]:
        pass

# ---------- extend towns.json ----------
new_count = defaultdict(int)
for st in ("kansas", "colorado"):
    T = towns[st]
    # Promote every incorporated place: the old <100-pop tiny list becomes
    # real pages. Idempotent — on a re-run, tiny holds only small CDPs,
    # which are rebuilt below, so they are dropped here, not promoted.
    for t in T["tiny"]:
        if t.get("kind") == "cdp":
            continue
        t["kind"] = "incorporated"
        T["towns"].append(t)
        new_count[(st, "tiny-promoted")] += 1
    T["tiny"] = []
    for t in T["towns"]:
        t.setdefault("kind", "incorporated")
    taken = {(t["county"], t["slug"]) for t in T["towns"]} | {(r["county"], r["slug"]) for r in T["cityRedirects"]}
    have = {t.get("geoid") for t in T["towns"]}
    # Add CDPs >= MIN_CDP_POP; CDPs < MIN go to the plain-text line.
    for pg, p in places.items():
        if p["state"] != st or p["kind"] != "cdp" or pg in have:
            continue
        s = stats("p" + pg) or {}
        pop = s.get("pop") or 0
        entry = {"name": p["name"], "slug": slugify(p["name"]), "pop": pop, "county": p["county"],
                 "geoid": pg, "kind": "cdp"}
        if pop < MIN_CDP_POP:
            T["tiny"].append(entry)
            continue
        if (p["county"], entry["slug"]) in taken:
            entry["slug"] = entry["slug"] + "-area"
        if (p["county"], entry["slug"]) in taken:
            print("skip collision", st, p["county"], entry["slug"], file=sys.stderr)
            continue
        taken.add((p["county"], entry["slug"]))
        T["towns"].append(entry)
        new_count[(st, "cdp")] += 1
    T["towns"].sort(key=lambda t: -t["pop"])
    T["tiny"].sort(key=lambda t: -t["pop"])

# ---------- ZIPs ----------
place_zips = defaultdict(list)
with open(os.path.join(HERE, "zcta_place.psv"), encoding="utf-8-sig") as f:
    for d in csv.DictReader(f, delimiter="|"):
        pg = d["GEOID_PLACE_20"]
        z = d["GEOID_ZCTA5_20"]
        if not z or not pg:
            continue
        part = int(d["AREALAND_PART"] or 0)
        pland = int(d["AREALAND_PLACE_20"] or 0) or 1
        if part / pland >= 0.03 or part > 2_000_000:
            place_zips[pg].append((part, z))
county_zips = defaultdict(list)
with open(os.path.join(HERE, "zcta_county.psv"), encoding="utf-8-sig") as f:
    for d in csv.DictReader(f, delimiter="|"):
        cf = d["GEOID_COUNTY_20"]
        z = d["GEOID_ZCTA5_20"]
        if not z or not cf:
            continue
        part = int(d["AREALAND_PART"] or 0)
        zland = int(d["AREALAND_ZCTA5_20"] or 0) or 1
        if part / zland >= 0.25:
            county_zips[cf].append(z)

# ---------- school districts ----------
# NCES truncates lea_name at 60 characters ("School District No. 1 in the county
# of Denver and State of C"). Districts known locally by another name get it
# here; everything else loses its legal "in the county of …" tail.
DISTRICT_NAMES = {
    "0803360": "Denver Public Schools",
    "0802340": "Aurora Public Schools",
    "0802910": "Cherry Creek School District",
    "0803060": "Colorado Springs School District 11",
    "0801920": "Academy District 20",
    "0806480": "Widefield School District 3",
    "0801950": "Adams 14 School District",
    "0804410": "Greeley-Evans School District 6",
}
def clean_district(name: str, leaid: str) -> str:
    if leaid in DISTRICT_NAMES:
        return DISTRICT_NAMES[leaid]
    # Also catches mid-word truncation ("… No. 38 in the co").
    name = re.sub(r"\s+(in|of)\s+(the\s+)?co(u(n(t(y|ies)?)?)?)?(\s.*)?$", "", name, flags=re.I)
    name = re.sub(r"\s{2,}", " ", name).strip()
    return re.sub(r"\bPub(lic)? Sch(ools)?\b", "Public Schools", name)
county_districts = defaultdict(list)
for fn in ("ed_20.json", "ed_8.json"):
    for d in json.load(open(os.path.join(HERE, fn)))["results"]:
        if d.get("agency_type") != 1 or not d.get("enrollment") or d["enrollment"] <= 0:
            continue
        cf = str(d["county_code"]).zfill(5)
        name = clean_district(d["lea_name"].strip(), str(d.get("leaid") or ""))
        sl = d.get("state_leaid") or ""
        m = re.match(r"KS-D0*(\d+)$", sl)
        if m:
            name = f"USD {m.group(1)} {name}"
        city = (d.get("city_location") or "").strip().title()
        county_districts[cf].append({"name": name, "city": city, "enrollment": d["enrollment"],
                                     "schools": d.get("number_of_schools") or None})
for cf in county_districts:
    county_districts[cf].sort(key=lambda x: -x["enrollment"])

# ---------- county seats ----------
seats = {}
for b in json.load(open(os.path.join(HERE, "seats.json")))["results"]["bindings"]:
    seats.setdefault(b["fips"]["value"], b["seatLabel"]["value"])

# ---------- page index for nearest-page links ----------
pages = []  # (state, path, name, coord, kind)
hub_coord = {}
for st in ("kansas", "colorado"):
    for t in towns[st]["towns"]:
        g = t.get("geoid")
        if g and g in gaz_place:
            pages.append((st, f"{t['county']}/{t['slug']}", t["name"], coord(gaz_place[g]), "town", t["pop"]))
    for name, slug in HUBS[st].items():
        cands = [pg for pg, p in places.items() if p["state"] == st and p["name"] == name and p["kind"] == "incorporated"]
        pg = cands[0]
        hub_coord[(st, slug)] = (name, coord(gaz_place[pg]), pg)
        pages.append((st, slug, name, coord(gaz_place[pg]), "city", (stats("p" + pg) or {}).get("pop", 0)))


def nearest_hub(st, c):
    best = min(((miles(c, hc), slug, nm) for (s, slug), (nm, hc, _) in hub_coord.items() if s == st))
    return {"slug": best[1], "name": best[2], "miles": round(best[0])}


def nearby(st, c, exclude, n=8):
    cands = [(miles(c, pc), path, nm, kind) for (s, path, nm, pc, kind, _) in pages if s == st and path != exclude]
    cands.sort()
    return [{"path": p, "name": nm, "miles": round(m), "kind": k} for m, p, nm, k in cands[:n]]


def zips_for_place(pg):
    return sorted({z for _, z in sorted(place_zips.get(pg, []), reverse=True)})


def districts_for_place(pg, name, cfips):
    ds = county_districts.get(cfips, [])
    own = [d for d in ds if d["city"].lower() == name.lower()]
    return own


# ---------- assemble ----------
out = {}
for st in ("kansas", "colorado"):
    O = {"counties": {}, "places": {}, "cities": {}}
    for c in counties[st]:
        f = c["fips"]
        cc = coord(gaz_county[f])
        town_list = [t for t in towns[st]["towns"] if t["county"] == c["slug"]]
        nb = []
        for ns in c["neighbors"]:
            nc = next((x for x in counties[st] if x["slug"] == ns), None)
            if nc:
                nb.append({"slug": ns, "miles": round(miles(cc, coord(gaz_county[nc["fips"]])))})
        O["counties"][c["slug"]] = {
            "seat": seats.get(f),
            "landSqMi": round(float(gaz_county[f]["ALAND_SQMI"])),
            "stats": stats("c" + f),
            "zips": sorted(set(county_zips.get(f, []))),
            "districts": county_districts.get(f, [])[:12],
            "districtCount": len(county_districts.get(f, [])),
            "hub": nearest_hub(st, cc),
            "neighborMiles": nb,
            "townMiles": {t["slug"]: round(miles(cc, coord(gaz_place[t["geoid"]]))) for t in town_list if t.get("geoid") in gaz_place},
        }
    for t in towns[st]["towns"]:
        g = t.get("geoid")
        if not g or g not in gaz_place:
            print("no geoid/gaz for", st, t["county"], t["slug"], file=sys.stderr)
            continue
        pc = coord(gaz_place[g])
        cf = next(x["fips"] for x in counties[st] if x["slug"] == t["county"])
        path = f"{t['county']}/{t['slug']}"
        O["places"][path] = {
            "kind": t.get("kind", "incorporated"),
            "landSqMi": round(float(gaz_place[g]["ALAND_SQMI"]), 1),
            "stats": stats("p" + g),
            "zips": zips_for_place(g),
            "districts": districts_for_place(g, t["name"], cf),
            "isSeat": seats.get(cf) == t["name"],
            "hub": nearest_hub(st, pc),
            "nearby": nearby(st, pc, path),
            "otherCounties": [x for x in places.get(g, {}).get("counties", []) if x != t["county"]],
        }
    for (s, slug), (nm, hc, pg) in hub_coord.items():
        if s != st:
            continue
        cf = primary_county(pg)
        ccounty = county_by_fips[cf][1]
        near = nearby(st, hc, slug, n=40)
        O["cities"][slug] = {
            "county": ccounty["slug"],
            "landSqMi": round(float(gaz_place[pg]["ALAND_SQMI"]), 1),
            "stats": stats("p" + pg),
            "zips": zips_for_place(pg),
            "districts": districts_for_place(pg, nm, cf) or county_districts.get(cf, [])[:4],
            "within30": [x for x in near if x["miles"] <= 30][:30],
            "nearby": near[:8],
            "countiesServed": sorted(
                [c["slug"] for c in counties[st] if nearest_hub(st, coord(gaz_county[c["fips"]]))["slug"] == slug],
                key=lambda s2: miles(hc, coord(gaz_county[next(x["fips"] for x in counties[st] if x["slug"] == s2)]))),
        }
    out[st] = O

json.dump(out, open(os.path.join(DATA, "local.json"), "w"), separators=(",", ":"))
json.dump(towns, open(os.path.join(DATA, "towns.json"), "w"), indent=1)
print("missing geoids:", missing, file=sys.stderr)
print("added:", dict(new_count), file=sys.stderr)
for st in out:
    print(st, "counties", len(out[st]["counties"]), "places", len(out[st]["places"]), "cities", len(out[st]["cities"]), file=sys.stderr)
print("local.json KB", os.path.getsize(os.path.join(DATA, "local.json")) // 1024, file=sys.stderr)
