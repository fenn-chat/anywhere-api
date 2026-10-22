#!/usr/bin/env bash
# GET /location: where the person is, as their phone last reported it: at a
# place since a time, or moving (the trip, its destination and arrival).
# 404 location_not_shared while their phone has shared no location.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

curl -sS --fail-with-body -w '\n' "$API/location" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
