#!/usr/bin/env bash
# GET /me: who the person is (name, time zone), this token's agent, its
# limits and what it used today.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"

curl -sS --fail-with-body -w '\n' "$API/me" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
