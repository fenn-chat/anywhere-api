#!/usr/bin/env bash
# GET /friends: friends and the current locations they share with this person.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

curl -sS --fail-with-body -w '\n' "$API/friends?limit=50" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
