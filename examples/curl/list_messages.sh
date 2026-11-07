#!/usr/bin/env bash
# GET /conversations/{conversation_id}/messages: newest first.
set -euo pipefail
: "${ANYWHERE_TOKEN:?set ANYWHERE_TOKEN to your personal token}"
: "${1:?pass a conversation id from list_conversations}"
API="${ANYWHERE_API_URL:-https://anywhere.fenn.chat/api/v1}"
CONVERSATION=$(jq -rn --arg id "$1" '$id | @uri')
curl -sS --fail-with-body -w '\n' -G "$API/conversations/$CONVERSATION/messages" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" --data-urlencode "limit=50"
