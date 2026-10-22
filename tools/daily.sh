#!/usr/bin/env bash
# Daily visitor report. Usage: tools/daily.sh [days] [--all]
set -euo pipefail
export CLOUDSDK_PYTHON="${CLOUDSDK_PYTHON:-/opt/homebrew/bin/python3.11}"
exec python3 "$(dirname "$0")/daily.py" "$@"
