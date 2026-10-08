#!/usr/bin/env bash
# Crawler report: what Google (and other bots) fetched. Usage: tools/crawl.sh [hours=24] [--all]
#   default: search engines only (Google, Bing, …); --all adds AI/SEO crawlers.
set -euo pipefail
export CLOUDSDK_PYTHON="${CLOUDSDK_PYTHON:-/opt/homebrew/bin/python3.11}"
H="${1:-24}"; FILTER="AND REGEXP_CONTAINS(bot_name, r'Google|Bing|Apple|DuckDuck|Yandex')"
[[ "${2:-}" == "--all" || "${1:-}" == "--all" ]] && FILTER="" && [[ "${1:-}" == "--all" ]] && H=24
T='`sproutwell-aba-260907.sunbird_traffic.events`'
W="kind='crawl' AND ts > TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL $H HOUR) $FILTER"
q(){ bq query --project_id=sproutwell-aba-260907 --use_legacy_sql=false --quiet --format=pretty --max_rows="${2:-60}" "$1"; }
echo "== Crawlers, last ${H}h (crawl log started 2026-10-06)"
q "SELECT bot_name, COUNT(*) hits, COUNT(DISTINCT path) pages, FORMAT_TIMESTAMP('%m-%d %H:%M', MIN(ts), 'America/Chicago') first_ct, FORMAT_TIMESTAMP('%m-%d %H:%M', MAX(ts), 'America/Chicago') last_ct FROM $T WHERE $W GROUP BY 1 ORDER BY 2 DESC"
echo "== Verified Google crawlers (Googlebot + GoogleOther) by page type"
q "SELECT CASE WHEN REGEXP_CONTAINS(path, r'sitemap|robots') THEN 'sitemap/robots' WHEN REGEXP_CONTAINS(path, r'^/(kansas|colorado)/[^/]+/[^/]+') THEN 'town' WHEN REGEXP_CONTAINS(path, r'^/(kansas|colorado)/[^/]+') THEN 'county/city' WHEN REGEXP_CONTAINS(path, r'^/(kansas|colorado)$') THEN 'state' WHEN REGEXP_CONTAINS(path, r'\.(jpg|png|webp|svg|ico)') THEN 'image' ELSE 'core page' END type, COUNT(*) hits, COUNT(DISTINCT path) pages FROM $T WHERE $W AND bot_name IN ('Googlebot','GoogleOther') GROUP BY 1 ORDER BY 2 DESC"
echo "== Latest 40 Googlebot fetches"
q "SELECT FORMAT_TIMESTAMP('%m-%d %H:%M', ts, 'America/Chicago') ct, bot_name, path FROM $T WHERE $W AND STARTS_WITH(bot_name, 'Google') ORDER BY ts DESC" 40
