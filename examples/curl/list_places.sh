#!/usr/bin/env bash
# GET /places: the places the person loves (tagged favorite), 50 at a time,
# most recently changed first. Other filters: q (words), tag (wantToGo or a
# tag of the person's own, from list_tags), status (saved: without a tag;
# unconfirmed), bbox, near and radius_m, updated_since. Pass the answer's
# next_cursor as cursor, with the same filters, for the next page.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

curl -sS --fail-with-body -w '\n' -G "$API/places" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  --data-urlencode "tag=favorite" \
  --data-urlencode "limit=50"
