#!/usr/bin/env bash
# GET /calendar/events: mirrored events, soonest first; optional [from,to).
# Usage: ./list_calendar_events.sh [from [to]]
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
QUERY=(--data-urlencode "limit=50")
[ $# -lt 1 ] || QUERY+=(--data-urlencode "from=$1")
[ $# -lt 2 ] || QUERY+=(--data-urlencode "to=$2")

curl -sS --fail-with-body -w '\n' -G "$API/calendar/events" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" "${QUERY[@]}"
