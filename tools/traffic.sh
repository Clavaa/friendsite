#!/usr/bin/env bash
# Traffic report. Usage: tools/traffic.sh [days] [--bots]
set -euo pipefail
export CLOUDSDK_PYTHON="${CLOUDSDK_PYTHON:-/opt/homebrew/bin/python3.11}"
exec python3 "$(dirname "$0")/traffic.py" "$@"
