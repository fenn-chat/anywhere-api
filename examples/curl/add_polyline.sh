#!/usr/bin/env bash
# Draw a temporary waterfront walk.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

curl -sS --fail-with-body -w '\n' -X POST "$API/polylines" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: ${ANYWHERE_IDEMPOTENCY_KEY:-$(uuidgen)}" \
  -d '{"name": "Waterfront walk", "points": [{"lat": 37.7955, "lng": -122.3937}, {"lat": 37.7973, "lng": -122.3951}, {"lat": 37.7988, "lng": -122.3966}], "color": "teal"}'
