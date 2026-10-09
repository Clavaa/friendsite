#!/usr/bin/env python3
"""
Builds src/data/metro.json — the big-city layer: one record per ZIP code
(ZCTA) that lies mostly inside each of the 10 team cities, for the
/{state}/{city}/{zip} pages and the city hub's ZIP grid.

Per ZIP: Census ACS 2023 5-yr figures (same definitions as local.json),
land area + interior point (2024 Gazetteer), neighborhood names (OpenStreetMap
place=neighbourhood|suburb|quarter nodes that fall INSIDE the ZIP's 2020
cartographic boundary — point-in-polygon, so names never leak across ZIP or
city lines), nearest sibling ZIPs, and the other town pages that share the
ZIP.

Inputs (../research/local/, not committed): zacs_*.psv, 2024_Gaz_zcta_national
.txt, cb_zcta/cb_2020_us_zcta520_500k.*, zcta_place.psv, osm_neighborhoods
.json, plus src/data/local.json + towns.json.

Usage (from repo root): python3 scripts/build_metro.py   (needs shapely, pyshp)
"""
import csv, json, math, os, re, sys
from collections import defaultdict

import shapefile  # pyshp
from shapely.geometry import Point, shape

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
RAW = os.path.join(SITE, "..", "research", "local")
DATA = os.path.join(SITE, "src", "data")

CITIES = {  # gazetteer place name -> (state slug, city slug, place GEOID prefix)
    ("KS", "Wichita city"): ("kansas", "wichita"),
    ("KS", "Overland Park city"): ("kansas", "overland-park"),
    ("KS", "Kansas City city"): ("kansas", "kansas-city"),
    ("KS", "Olathe city"): ("kansas", "olathe"),
    ("KS", "Topeka city"): ("kansas", "topeka"),
    ("CO", "Denver city"): ("colorado", "denver"),
    ("CO", "Colorado Springs city"): ("colorado", "colorado-springs"),
    ("CO", "Aurora city"): ("colorado", "aurora"),
    ("CO", "Fort Collins city"): ("colorado", "fort-collins"),
    ("CO", "Lakewood city"): ("colorado", "lakewood"),
}
# A ZIP belongs to a city when at least this share of the ZIP's land lies
# inside the city (keeps edge ZIPs that are mostly a suburb off the page).
MIN_SHARE = 0.4
MIN_POP = 1000


def num(x):
    try:
        return int(float(x))
    except Exception:
        return None


def pct(n, d, min_d=150):
    if n is None or not d or d < min_d:
        return None
    return round(100.0 * n / d, 1)


acs = defaultdict(dict)
for fn in os.listdir(RAW):
    if fn.startswith("zacs_") and fn.endswith(".psv"):
        with open(os.path.join(RAW, fn)) as f:
            r = csv.reader(f, delimiter="|")
            head = next(r)
            for row in r:
                z = row[0][-5:]
                for h, v in zip(head[1:], row[1:]):
                    if "_E" in h:
                        acs[z][h] = num(v)


def stats(z):
    a = acs.get(z)
    if not a:
        return None
    g = lambda k: a.get(k) or 0
    under6 = g("B23008_E002")
    kids19 = g("B27010_E002")
    hh = g("B28002_E001")
    inc = a.get("B19013_E001")
    return {
        "pop": g("B01003_E001"),
        "under5": g("B01001_E003") + g("B01001_E027"),
        "under18": g("B09001_E001"),
        "under6": under6,
        "under6AllParentsWorkPct": pct(g("B23008_E004") + g("B23008_E010") + g("B23008_E013"), under6),
        "households": hh,
        "broadbandPct": pct(g("B28002_E004"), hh),
        "kidsUninsuredPct": pct(g("B27010_E017"), kids19, 300),
        "kidsPublicOnlyPct": pct(g("B27010_E007"), kids19, 300),
        "medianIncome": inc if inc and inc > 0 else None,
        "childPovertyPct": None,
    }


# Gazetteer: places (for city GEOIDs) and ZCTAs (coords, land).
def gaz(fn):
    with open(os.path.join(RAW, fn)) as f:
        rows = list(csv.reader(f, delimiter="\t"))
    h = [x.strip() for x in rows[0]]
    return [dict(zip(h, [x.strip() for x in r])) for r in rows[1:]]


place_geoid = {}
for d in gaz("2024_Gaz_place_national.txt"):
    k = (d["USPS"], d["NAME"])
    if k in CITIES:
        place_geoid[d["GEOID"]] = CITIES[k]
zgaz = {d["GEOID"]: d for d in gaz("2024_Gaz_zcta_national.txt") if d["GEOID"][:2] in ("66", "67", "80", "81")}

# ZCTA <-> place overlap (2020 relationship file).
zip_city = {}
zip_places = defaultdict(list)  # zip -> [place geoid] (all places sharing it)
with open(os.path.join(RAW, "zcta_place.psv"), encoding="utf-8-sig") as f:
    for d in csv.DictReader(f, delimiter="|"):
        z, pg = d["GEOID_ZCTA5_20"], d["GEOID_PLACE_20"]
        if not z or not pg:
            continue
        part = int(d["AREALAND_PART"] or 0)
        zland = int(d["AREALAND_ZCTA5_20"] or 0) or 1
        if part / zland >= 0.1:
            zip_places[z].append(pg)
        # Kansas City KS GEOID matches across vintages; Central-City-style
        # drift does not affect these 10 cities.
        if pg in place_geoid and part / zland >= MIN_SHARE:
            zip_city[z] = place_geoid[pg]

# ZIP polygons for point-in-polygon neighborhood assignment.
sf = shapefile.Reader(os.path.join(RAW, "cb_zcta", "cb_2020_us_zcta520_500k"))
fields = [f[0] for f in sf.fields[1:]]
zi = fields.index("ZCTA5CE20")
polys = {}
for sr in sf.iterShapeRecords():
    z = sr.record[zi]
    if z in zip_city:
        polys[z] = shape(sr.shape.__geo_interface__)

BAD = re.compile(r"historic district|subdivision|filing|apartments|mobile home|trailer|golf course|business park|industrial|tech center|centretech", re.I)
osm = json.load(open(os.path.join(RAW, "osm_neighborhoods.json")))
hoods = defaultdict(list)
for city, els in osm.items():
    for e in els:
        name = (e.get("tags") or {}).get("name")
        if not name or BAD.search(name) or "lat" not in e:
            continue
        p = Point(e["lon"], e["lat"])
        rank = {"suburb": 0, "quarter": 1, "neighbourhood": 2}.get(e["tags"].get("place"), 3)
        for z, poly in polys.items():
            if poly.contains(p):
                if name not in [n for _, n in hoods[z]]:
                    hoods[z].append((rank, name))
                break

# Wikidata neighborhoods fill gaps where OSM is thin (Wichita): labels like
# "Delano" or "Orchard Park, Wichita, Kansas"; coords are "Point(lon lat)".
wd_path = os.path.join(RAW, "wd_neighborhoods.json")
if os.path.exists(wd_path):
    for city, items in json.load(open(wd_path)).items():
        for label, wkt in items:
            name = re.sub(r",\s*[^,]+,\s*(Kansas|Colorado)$", "", label).strip()
            if BAD.search(name) or "warehouse" in name.lower():
                continue
            m = re.match(r"Point\(([-\d.]+) ([-\d.]+)\)", wkt)
            if not m:
                continue
            p = Point(float(m.group(1)), float(m.group(2)))
            for z, poly in polys.items():
                if poly.contains(p):
                    if name not in [n for _, n in hoods[z]]:
                        hoods[z].append((2, name))
                    break

# Town pages (to link the other communities a ZIP reaches into).
towns = json.load(open(os.path.join(DATA, "towns.json")))
town_by_geoid = {}
for st, data in towns.items():
    for t in data["towns"]:
        if t.get("geoid"):
            town_by_geoid[t["geoid"]] = (st, f"{t['county']}/{t['slug']}", t["name"])


def miles(a, b):
    R = 3958.8
    la1, lo1, la2, lo2 = map(math.radians, (a[0], a[1], b[0], b[1]))
    h = math.sin((la2 - la1) / 2) ** 2 + math.cos(la1) * math.cos(la2) * math.sin((lo2 - lo1) / 2) ** 2
    return 2 * R * math.asin(math.sqrt(h))


out = {"kansas": {}, "colorado": {}}
by_city = defaultdict(list)
for z, (st, city) in zip_city.items():
    s = stats(z)
    if not s or s["pop"] < MIN_POP or z not in zgaz:
        continue
    by_city[(st, city)].append(z)

for (st, city), zs in by_city.items():
    rec = {}
    for z in zs:
        g = zgaz[z]
        c = (float(g["INTPTLAT"]), float(g["INTPTLONG"]))
        sib = sorted((miles(c, (float(zgaz[o]["INTPTLAT"]), float(zgaz[o]["INTPTLONG"]))), o) for o in zs if o != z)
        others = []
        for pg in zip_places.get(z, []):
            if pg in town_by_geoid and town_by_geoid[pg][0] == st:
                others.append({"path": town_by_geoid[pg][1], "name": town_by_geoid[pg][2]})
        rec[z] = {
            "stats": stats(z),
            "landSqMi": round(float(g["ALAND_SQMI"]), 1),
            "neighborhoods": [n for _, n in sorted(hoods.get(z, []))][:8],
            "nearbyZips": [{"zip": o, "miles": round(m)} for m, o in sib[:6]],
            "otherTowns": others[:6],
        }
    out[st][city] = dict(sorted(rec.items()))

json.dump(out, open(os.path.join(DATA, "metro.json"), "w"), separators=(",", ":"))
for st in out:
    for city, zs in out[st].items():
        named = sum(1 for v in zs.values() if v["neighborhoods"])
        print(f"{st}/{city}: {len(zs)} ZIPs, {named} with neighborhood names", file=sys.stderr)
print("metro.json KB", os.path.getsize(os.path.join(DATA, "metro.json")) // 1024, file=sys.stderr)
