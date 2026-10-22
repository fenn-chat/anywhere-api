#!/usr/bin/env bash
# POST /places: saves a venue to the person's want-to-go list, with a note.
# 201 for a new place, 200 when the venue was on the map already. The
# Idempotency-Key makes a retry safe: retry with the same key, never a new one.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

curl -sS --fail-with-body -w '\n' -X POST "$API/places" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "name": "Café de Flore",
    "lat": 48.854,
    "lng": 2.3326,
    "address": "172 Boulevard Saint-Germain, 75006 Paris, France",
    "category": "cafe",
    "status": "wantToGo",
    "note": "Hot chocolate on the terrace"
  }'
