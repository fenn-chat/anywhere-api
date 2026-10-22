#!/usr/bin/env bash
# GET /trips: the person's trips (when, from where to where, how and how far;
# never a route), most recent first: the latest 20, or those going on in a
# range [from, to).
# Usage: ./list_trips.sh [from [to]]   (2026-10-01, 2026-10-01T08:00:00Z…)
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

query=(--data-urlencode "limit=20")
if [ $# -ge 1 ]; then query+=(--data-urlencode "from=$1"); fi
if [ $# -ge 2 ]; then query+=(--data-urlencode "to=$2"); fi

curl -sS --fail-with-body -w '\n' -G "$API/trips" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  "${query[@]}"
