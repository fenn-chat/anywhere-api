#!/usr/bin/env bash
# DELETE /tags/{tag_id}: removes a tag of the person's own, keeping its places.
# Usage: ./remove_tag.sh <tag_id>
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token (anyw_pat_…)}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
TAG_ID="${1:?usage: ./remove_tag.sh <tag_id>}"
curl -sS --fail-with-body -w '\n' -X DELETE "$API/tags/$TAG_ID" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
