#!/usr/bin/env bash
# GET /places: the person's favorites, 50 at a time, most recently changed
# first. Other filters: q (words), status (favorite, wantToGo, saved,
# unconfirmed), bbox, near and radius_m, updated_since. Pass the answer's
# next_cursor as cursor, with the same filters, for the next page.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

curl -sS --fail-with-body -w '\n' -G "$API/places" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  --data-urlencode "status=favorite" \
  --data-urlencode "limit=50"
