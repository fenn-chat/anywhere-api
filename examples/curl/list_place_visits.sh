#!/usr/bin/env bash
# GET /places/{place_id}/visits: the latest 20 visits to a place, however old.
# Add from and to (2026-10-01, 2026-10-01T08:00:00Z) for a range.
# Usage: ./list_place_visits.sh <place_id>
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
PLACE_ID="${1:?usage: ./list_place_visits.sh <place_id>}"

curl -sS --fail-with-body -w '\n' -G "$API/places/$PLACE_ID/visits" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  --data-urlencode "limit=20"
