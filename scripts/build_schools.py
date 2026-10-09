#!/usr/bin/env python3
"""
Builds src/data/schools.json — the school-district layer:
  - districts: every KS/CO public school district with >= MIN_ENROLL students
    (all 10 team cities and their suburbs), each with its open schools
    (NCES CCD 2022 via the Urban Institute), grades, enrollment and a link
    target for the school's ZIP (a ZIP area page when the ZIP is inside a
    team city, else the town page for the school's city).
  - zipSchools: schools per ZIP area page, for the "Schools in 80205" list.

District names reuse the NCES 60-char truncation cleanup from build_local.py.

Inputs (../research/local/): schools_20.json, schools_8.json, ed_20.json,
ed_8.json + src/data/{metro,towns,counties}.json.
Usage (repo root): python3 scripts/build_schools.py
"""
import json, os, re, sys
from collections import defaultdict

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
RAW = os.path.join(SITE, "..", "research", "local")
DATA = os.path.join(SITE, "src", "data")
MIN_ENROLL = 3000

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
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


def clean_district(name, leaid):
    if leaid in DISTRICT_NAMES:
        return DISTRICT_NAMES[leaid]
    name = re.sub(r"\s+(in|of)\s+(the\s+)?co(u(n(t(y|ies)?)?)?)?(\s.*)?$", "", name, flags=re.I)
    name = re.sub(r"\s{2,}", " ", name).strip()
    return re.sub(r"\bPub(lic)? Sch(ools)?\b", "Public Schools", name)


def slugify(s):
    s = s.lower().replace("&", "and").replace("'", "").replace("’", "")
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def title_school(n):
    # NCES names are often ALL CAPS in Colorado.
    if n.isupper():
        n = n.title()
        n = re.sub(r"\b(Of|And|The|At|For|In)\b", lambda m: m.group(1).lower(), n)
        n = re.sub(r"\b(Ii|Iii|Iv|Stem|Pk|K-8|Pk-8)\b", lambda m: m.group(1).upper(), n)
    return n


GRADE = {-1: "PK", 0: "K"}


def grades(lo, hi):
    if lo is None or hi is None or lo < -1 or hi < -1:
        return None
    a, b = GRADE.get(lo, str(lo)), GRADE.get(hi, str(hi))
    return a if a == b else f"{a}–{b}"


metro = json.load(open(os.path.join(DATA, "metro.json")))
towns = json.load(open(os.path.join(DATA, "towns.json")))
counties = json.load(open(os.path.join(DATA, "counties.json")))
zip_page = {}
for st, cities in metro.items():
    for city, zs in cities.items():
        for z in zs:
            zip_page[(st, z)] = f"/{st}/{city}/{z}"
town_by_name = defaultdict(list)
for st, d in towns.items():
    for t in d["towns"]:
        town_by_name[(st, t["name"].lower())].append(f"/{st}/{t['county']}/{t['slug']}")
CITY_SLUG = {
    ("kansas", "wichita"): "wichita", ("kansas", "overland park"): "overland-park",
    ("kansas", "kansas city"): "kansas-city", ("kansas", "olathe"): "olathe",
    ("kansas", "topeka"): "topeka", ("colorado", "denver"): "denver",
    ("colorado", "colorado springs"): "colorado-springs", ("colorado", "aurora"): "aurora",
    ("colorado", "fort collins"): "fort-collins", ("colorado", "lakewood"): "lakewood",
}
county_by_fips = {c["fips"]: (st, c) for st, lst in counties.items() for c in lst}


def link_for(st, zipc, city):
    if (st, zipc) in zip_page:
        return zip_page[(st, zipc)]
    c = (city or "").strip().lower()
    if (st, c) in CITY_SLUG:
        return f"/{st}/{CITY_SLUG[(st, c)]}"
    t = town_by_name.get((st, c))
    return t[0] if t and len(t) == 1 else None


out = {"kansas": {}, "colorado": {}}
zip_schools = defaultdict(list)
for fips, st in (("20", "kansas"), ("8", "colorado")):
    eds = {d["leaid"]: d for d in json.load(open(os.path.join(RAW, f"ed_{fips}.json")))["results"]}
    schools = json.load(open(os.path.join(RAW, f"schools_{fips}.json")))
    by_lea = defaultdict(list)
    for s in schools:
        if s.get("school_status") not in (1, 3, 4, 5, 8) or s.get("school_type") != 1 or not s.get("enrollment"):
            continue
        by_lea[s["leaid"]].append(s)
        z = (s.get("zip_location") or "")[:5]
        if (st, z) in zip_page:
            zip_schools[zip_page[(st, z)]].append(s)
    used = set()
    for leaid, d in eds.items():
        if d.get("agency_type") != 1 or (d.get("enrollment") or 0) < MIN_ENROLL:
            continue
        name = clean_district(d["lea_name"].strip(), leaid)
        m = re.match(r"KS-D0*(\d+)$", d.get("state_leaid") or "")
        if m:
            name = f"USD {m.group(1)} {name}"
        slug = slugify(name)
        if slug in used:
            slug = f"{slug}-{leaid[-4:]}"
        used.add(slug)
        cf = str(d["county_code"]).zfill(5)
        cty = county_by_fips.get(cf)
        rows = []
        for s in sorted(by_lea.get(leaid, []), key=lambda s: title_school(s["school_name"])):
            z = (s.get("zip_location") or "")[:5]
            rows.append({
                "name": title_school(s["school_name"].strip()),
                "grades": grades(s.get("lowest_grade_offered"), s.get("highest_grade_offered")),
                "zip": z,
                "city": (s.get("city_location") or "").title(),
                "enrollment": s["enrollment"],
                "charter": s.get("charter") == 1,
                "prek": s.get("lowest_grade_offered") == -1,
                "href": link_for(st, z, s.get("city_location")),
            })
        if not rows:
            continue
        out[st][slug] = {
            "name": name,
            "leaid": leaid,
            "enrollment": d["enrollment"],
            "hqCity": (d.get("city_location") or "").title(),
            "county": cty[1]["slug"] if cty else None,
            "countyFull": cty[1]["full"] if cty else None,
            "teachers": d.get("teachers_total_fte"),
            "counselors": d.get("school_counselors_fte") or d.get("guidance_counselors_total_fte"),
            "psychologists": d.get("school_psychologists_fte"),
            "schools": rows,
        }

# Per-ZIP-page school lists, linked to district pages when we have one.
district_by_lea = {v["leaid"]: (st, slug) for st in out for slug, v in out[st].items()}
zs_out = {}
for page, lst in zip_schools.items():
    rows = []
    for s in sorted(lst, key=lambda s: (s.get("lowest_grade_offered") or 0, title_school(s["school_name"]))):
        dl = district_by_lea.get(s["leaid"])
        rows.append({
            "name": title_school(s["school_name"].strip()),
            "grades": grades(s.get("lowest_grade_offered"), s.get("highest_grade_offered")),
            "district": f"/{dl[0]}/schools/{dl[1]}" if dl else None,
            "districtName": out[dl[0]][dl[1]]["name"] if dl else None,
        })
    zs_out[page] = rows

json.dump({"districts": out, "zipSchools": zs_out}, open(os.path.join(DATA, "schools.json"), "w"), separators=(",", ":"))
for st in out:
    print(st, len(out[st]), "districts,", sum(len(v["schools"]) for v in out[st].values()), "schools", file=sys.stderr)
print("zip pages with schools:", len(zs_out), "| schools.json KB", os.path.getsize(os.path.join(DATA, "schools.json")) // 1024, file=sys.stderr)
