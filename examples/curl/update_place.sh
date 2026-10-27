#!/usr/bin/env bash
# PATCH /places/{place_id}: the person loves a saved place now: it takes the
# favorite tag in place of wantToGo, five stars and a note. Give only what
# changes: add_tags, remove_tags (its other tags stay), rating, note, name, or
# label (home, work, school: the one change a visited place takes).
# Usage: ./update_place.sh <place_id>
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
PLACE_ID="${1:?usage: ./update_place.sh <place_id>}"

curl -sS --fail-with-body -w '\n' -X PATCH "$API/places/$PLACE_ID" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"add_tags": ["favorite"], "remove_tags": ["wantToGo"], "rating": 5, "note": "Go early: the terrace fills up by ten"}'
