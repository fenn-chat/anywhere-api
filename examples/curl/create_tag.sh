#!/usr/bin/env bash
# POST /tags: create a tag of the person's own. Retry with the same Idempotency-Key.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
curl -sS --fail-with-body -w '\n' -X POST "$API/tags" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{"name": "Paris cafés"}'
