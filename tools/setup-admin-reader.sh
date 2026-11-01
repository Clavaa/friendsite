#!/usr/bin/env bash
# One-time setup for /admin: a read-only service account for the traffic data.
#   - creates sunbird-traffic-reader (if missing)
#   - grants it BigQuery Job User on the project + READER on sunbird_traffic only
#   - makes a key, stores it in Vercel as GCP_TRAFFIC_READER_SA (production),
#     deletes the local key file, and redeploys
set -euo pipefail
export CLOUDSDK_PYTHON="${CLOUDSDK_PYTHON:-/opt/homebrew/bin/python3.11}"
P=sproutwell-aba-260907
SA="sunbird-traffic-reader@$P.iam.gserviceaccount.com"
cd "$(dirname "$0")/.."

gcloud iam service-accounts describe "$SA" --project="$P" >/dev/null 2>&1 ||
  gcloud iam service-accounts create sunbird-traffic-reader --project="$P" \
    --display-name="Sunbird admin dashboard (read-only)"

gcloud projects add-iam-policy-binding "$P" --member="serviceAccount:$SA" \
  --role=roles/bigquery.jobUser --condition=None --format=none

TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT
bq show --format=prettyjson "$P:sunbird_traffic" > "$TMP/ds.json"
python3 - "$TMP/ds.json" "$SA" <<'EOF'
import json, sys
path, sa = sys.argv[1], sys.argv[2]
d = json.load(open(path))
if not any(a.get("userByEmail") == sa for a in d["access"]):
    d["access"].append({"role": "READER", "userByEmail": sa})
json.dump({"access": d["access"]}, open(path, "w"))
EOF
bq update --source "$TMP/ds.json" "$P:sunbird_traffic" >/dev/null

gcloud iam service-accounts keys create "$TMP/key.json" --iam-account="$SA" --project="$P"
npx -y vercel env rm GCP_TRAFFIC_READER_SA production --yes >/dev/null 2>&1 || true
python3 -c "import json,sys; print(json.dumps(json.load(open(sys.argv[1]))), end='')" "$TMP/key.json" |
  npx -y vercel env add GCP_TRAFFIC_READER_SA production >/dev/null
echo "Key stored in Vercel; local copy removed. Redeploying…"
npx -y vercel deploy --prod --yes >/dev/null
echo "Done: open https://sunbirdaba.com/admin"
