#!/usr/bin/env bash
# POST /map/open: sends a notification opening a camera view when tapped.
# A sent outcome means accepted by the push service, not that the app opened.
# Retry a lost answer with the same Idempotency-Key, never a new one.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

curl -sS --fail-with-body -w '\n' -X POST "$API/map/open" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "camera": {"lat": 48.854, "lng": 2.3326, "distance_m": 1500},
    "title": "Cafés around Saint-Germain",
    "message": "Tap to explore this area in Anywhere"
  }'
