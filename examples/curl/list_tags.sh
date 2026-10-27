#!/usr/bin/env bash
# GET /tags: the tags places have: the standard favorite and wantToGo first,
# then the person's own.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
curl -sS --fail-with-body -w '\n' "$API/tags?limit=50" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
