#!/usr/bin/env bash
# Resolve a venue before saving it; confirm ambiguous candidates with the person.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
curl -sS --fail-with-body -G -w '\n' "$API/search/places" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  --data-urlencode 'query=Café de Flore Paris' \
  --data-urlencode 'limit=5'
