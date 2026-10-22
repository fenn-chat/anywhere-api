#!/usr/bin/env bash
# DELETE /places/{place_id}: takes a saved place off the person's map. They
# are told, and can undo it in the app.
# Usage: ./remove_place.sh <place_id>
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
PLACE_ID="${1:?usage: ./remove_place.sh <place_id>}"

curl -sS --fail-with-body -w '\n' -X DELETE "$API/places/$PLACE_ID" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
