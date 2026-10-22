#!/usr/bin/env bash
# GET /places/{place_id}: one place, with its status, label, note, origin and
# visit stats.
# Usage: ./get_place.sh <place_id>   (ids come from list_places)
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
PLACE_ID="${1:?usage: ./get_place.sh <place_id>}"

curl -sS --fail-with-body -w '\n' "$API/places/$PLACE_ID" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
