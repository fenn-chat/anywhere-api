#!/usr/bin/env bash
# List active lines, newest change first.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

curl -sS --fail-with-body -w '\n' -X GET "$API/polylines" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
