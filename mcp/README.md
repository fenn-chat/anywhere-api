# Connecting an MCP client

Anywhere's MCP server gives connected agents access to the person's map.
ChatGPT, Claude, Claude Code, Muse and Grok Bot use browser OAuth; other MCP clients can
use the same personal access key as the REST API.

| | |
|---|---|
| URL | `https://anywhere.fenn.chat/mcp` |
| Transport | Streamable HTTP: stateless, answers in JSON, `POST` only (no event stream to open, no session) |
| Authentication | The header `Authorization: Bearer anyw_pat_…` ([get a token](../README.md#getting-a-token)) |
| OAuth | ChatGPT and Muse use `/mcp`; Claude and Claude Code use `/claude/mcp`; Grok Bot uses `/grok/mcp`. Browser sign-in, PKCE S256 and rotating refresh tokens. |

Guides: [ChatGPT](chatgpt.md) · [Claude](claude.md) · [Muse](muse.md) ·
[Grok Bot](grok-bot.md) · [Grok](grok.md). Other MCP clients: below.

## Tools

| Tool | What it does | Hints |
|---|---|---|
| `get_me` | Who the person is (name, time zone), this token's limits and usage | read-only |
| `list_places` | Searches the person's places: by tag, words, box, distance, change time | read-only |
| `get_place` | One place: tags, label, note, origin, visit stats | read-only |
| `add_place` | Saves a venue, with tags or none, and a note | changes the map |
| `update_place` | Changes a place's tags, note, name, label or rating | changes the map, destructive |
| `remove_place` | Takes a saved place off the map | changes the map, destructive |
| `list_visits` | Visits: in a range, to a place, or in a box | read-only |
| `correct_visit` | Moves one of your visits to the correct venue or a place on your map | changes visit history, destructive |
| `list_trips` | Trips: when, from where to where, how, how far | read-only |
| `get_history` | Visits and trips as one timeline | read-only |
| `get_current_location` | Own or shared current location; optional `person_id` | read-only |
| `open_map` | Sends a notification that opens a specified camera view, or a place with its panel (`place_id`), in Anywhere | sends a notification |
| `list_friends` | Friends, their sharing levels and available shared locations | read-only |
| `list_calendar_events` | Own or shared calendar events, by time range; optional `person_id` | read-only |
| `list_conversations` | Your chats, optionally filtered by `person_id` | read-only |
| `list_messages` | A chat's retained message history, newest first | read-only |
| `list_tags` | The tags: the standard favorite and wantToGo, then the person's own | read-only |
| `create_tag` | Creates a tag of the person's own | changes the map |
| `update_tag` | Renames a tag of the person's own | changes the map, destructive |
| `remove_tag` | Deletes a tag of the person's own while keeping its places | changes the map, destructive |

Each tool is the REST operation of the same name in
[`openapi.json`](../openapi.json): the same inputs (a place's id is the
argument `place_id`, the `Idempotency-Key` header the argument
`idempotency_key`), answers, limits and errors. A call that fails is a tool
result marked `isError`, whose text is the API's error,
`{ "error": { "code", "message" } }`. The person is told of every call that
reads or changes their data, and can undo saved-place changes in the app.
Tag changes, labels, visited-place renames and visit corrections have no Undo action. Change the map within
their request, including a standing
request to keep their important places current. See
[the agent setup and maintenance workflow](../README.md#set-up-your-agent)
for seeding home, work and other known places, and
[showing results on the phone](../README.md#show-map-results-on-your-phone)
for what the current API can display.

Location, visit, trip and history reads also accept `person_id`. Shared
data follows current sharing levels and blocks; chats require current
membership. Existing tokens have these reads automatically. See
[Correct a visit](../README.md#correct-a-visit) for both ways to identify
the venue when correcting your own history.

## Check the connection

The tools the server offers, with your token (`ANYWHERE_TOKEN`):

```bash
curl -sS --fail-with-body https://anywhere.fenn.chat/mcp \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc": "2.0", "id": 1, "method": "tools/list"}'
```

And one call of a tool:

```bash
curl -sS --fail-with-body https://anywhere.fenn.chat/mcp \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json, text/event-stream" \
  -d '{"jsonrpc": "2.0", "id": 2, "method": "tools/call", "params": {"name": "get_me", "arguments": {}}}'
```

A wrong or revoked token is answered `401` before any MCP.

## Claude Code

With OAuth, no token: add Claude's URL, then run `/mcp` in Claude Code,
choose Anywhere and **Authenticate**, as [Claude](claude.md#claude-code-and-your-own-apps) says.

```shell
claude mcp add --transport http --scope user anywhere https://anywhere.fenn.chat/claude/mcp
```

Or with a personal token:

```shell
claude mcp add --transport http --scope user anywhere https://anywhere.fenn.chat/mcp \
  --header "Authorization: Bearer $ANYWHERE_TOKEN"
```

## Claude on the web, desktop and phone

Claude's connectors sign in with OAuth, without a token: add
`https://anywhere.fenn.chat/claude/mcp` as a custom connector, as
[Claude](claude.md) says.

## Cursor

In `~/.cursor/mcp.json` (your own, never a project's, which may be
committed):

```json
{
  "mcpServers": {
    "anywhere": {
      "url": "https://anywhere.fenn.chat/mcp",
      "headers": { "Authorization": "Bearer anyw_pat_…" }
    }
  }
}
```

## VS Code

In `.vscode/mcp.json`, or your user configuration (MCP: Open User
Configuration). VS Code asks for the token once and keeps it in its secret
storage:

```json
{
  "inputs": [
    { "type": "promptString", "id": "anywhere-token", "description": "Anywhere personal token", "password": true }
  ],
  "servers": {
    "anywhere": {
      "type": "http",
      "url": "https://anywhere.fenn.chat/mcp",
      "headers": { "Authorization": "Bearer ${input:anywhere-token}" }
    }
  }
}
```

## Codex

The Codex CLI, its IDE extension and the ChatGPT desktop app share
`~/.codex/config.toml`: see [ChatGPT](chatgpt.md#codex).

## OpenClaw and any other client

Give the client the URL, the Streamable HTTP transport (sometimes named
`http` or `streamable-http`) and the header `Authorization` with the value
`Bearer anyw_pat_…`, kept the way the client keeps secrets. For OpenClaw:
`openclaw mcp add anywhere --url https://anywhere.fenn.chat/mcp --transport streamable-http`,
then the header in its MCP settings. A client that can only launch local
servers reaches Anywhere through [mcp-remote](https://www.npmjs.com/package/mcp-remote),
a local bridge, with the header as its `--header` argument.
