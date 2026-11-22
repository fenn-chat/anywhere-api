#!/usr/bin/env bash
# Reassign one visit from list_visits to a place from list_places.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
VISIT_ID="${1:?usage: ./correct_visit.sh <visit_id> <destination_place_id>}"
PLACE_ID="${2:?usage: ./correct_visit.sh <visit_id> <destination_place_id>}"

curl -sS --fail-with-body -w '\n' -X PATCH "$API/visits/$(jq -rn --arg id "$VISIT_ID" '$id | @uri')" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -d "$(jq -cn --arg id "$PLACE_ID" '{place_id: $id}')"
