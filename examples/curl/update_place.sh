#!/usr/bin/env bash
# PATCH /places/{place_id}: moves a saved place to the favorites, with a note.
# Give only what changes: status, note, name, or label (home, work, school:
# the one change a visited place takes).
# Usage: ./update_place.sh <place_id>
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
PLACE_ID="${1:?usage: ./update_place.sh <place_id>}"

curl -sS --fail-with-body -w '\n' -X PATCH "$API/places/$PLACE_ID" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "favorite", "note": "Go early: the terrace fills up by ten"}'
