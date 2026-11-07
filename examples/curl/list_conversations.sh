#!/usr/bin/env bash
# GET /conversations; optional person_id filters chats with that person.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
QUERY=(--data-urlencode "limit=50")
[ $# -lt 1 ] || QUERY+=(--data-urlencode "person_id=$1")
curl -sS --fail-with-body -w '\n' -G "$API/conversations" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" "${QUERY[@]}"
