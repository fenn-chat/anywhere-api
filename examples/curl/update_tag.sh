#!/usr/bin/env bash
# PATCH /tags/{tag_id}: rename a tag of the person's own.
# Usage: ./update_tag.sh <tag_id>
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
TAG_ID="${1:?usage: ./update_tag.sh <tag_id>}"
curl -sS --fail-with-body -w '\n' -X PATCH "$API/tags/$TAG_ID" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name": "Paris favorites"}'
