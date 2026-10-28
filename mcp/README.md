# Connecting an MCP client

Anywhere's MCP server gives any MCP client the person's map, with the same
permissions as the REST API. The ChatGPT/Dot plugin uses OAuth; other
clients can use a personal token.

| | |
|---|---|
| URL | `https://anywhere.fenn.chat/mcp` |
| Transport | Streamable HTTP: stateless, answers in JSON, `POST` only (no event stream to open, no session) |
| Authentication | The header `Authorization: Bearer anyw_pat_…` ([get a token](../README.md#getting-a-token)) |
| OAuth | Authorization code with PKCE for the registered ChatGPT/Dot client; [connection guide](chatgpt.md) |

Guides for the agents the app names: [ChatGPT](chatgpt.md) ·
[Grok](grok.md). Claude and any other client: below.

## Tools

| Tool | What it does | Hints |
|---|---|---|
| `get_me` | Who the person is (name, time zone), this token's limits and usage | read-only |
| `search_places` | Resolves a venue or street address with Apple Maps; returns candidates to save | read-only, public search |
| `list_places` | Searches the person's places: by tag, words, box, distance, change time | read-only |
| `get_place` | One place: tags, label, note, origin, visit stats | read-only |
| `add_place` | Saves a venue, with tags or none, and a note; a duplicate can replace its note | changes the map, destructive |
| `update_place` | Changes a place's tags, note, name, label or rating | changes the map, destructive |
| `remove_place` | Takes a saved place off the map | changes the map, destructive |
| `list_visits` | Visits: in a range, to a place, or in a box | read-only |
| `list_trips` | Trips: when, from where to where, how, how far | read-only |
| `get_history` | Visits and trips as one timeline | read-only |
| `get_current_location` | Where the person is now | read-only |
| `open_map` | Sends a notification that opens a specified camera view, or a place with its panel (`place_id`), in Anywhere | sends a notification |
| `list_friends` | Friends and the current locations they share with the person | read-only |
| `list_calendar_events` | The person's mirrored calendar events, by time range | read-only |
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
Tag (created, renamed, deleted) and label changes have no Undo action. Change the map within
their request, including a standing
request to keep their important places current. See
[the agent setup and maintenance workflow](../README.md#set-up-your-agent)
for seeding home, work and other known places, and
[showing results on the phone](../README.md#show-map-results-on-your-phone)
for what the current API can display.

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

```shell
claude mcp add --transport http --scope user anywhere https://anywhere.fenn.chat/mcp \
  --header "Authorization: Bearer $ANYWHERE_TOKEN"
```

## Claude Desktop

Claude's connectors (claude.ai, the desktop and mobile apps) connect with
OAuth. Anywhere currently registers only the ChatGPT/Dot OAuth client;
other clients use a personal token. Claude Desktop reaches Anywhere
through [mcp-remote](https://www.npmjs.com/package/mcp-remote), a local
bridge: in Settings, Developer, Edit Config, add to
`claude_desktop_config.json`, then restart Claude.

```json
{
  "mcpServers": {
    "anywhere": {
      "command": "npx",
      "args": ["-y", "mcp-remote", "https://anywhere.fenn.chat/mcp", "--header", "Authorization:${AUTH_HEADER}"],
      "env": { "AUTH_HEADER": "Bearer anyw_pat_…" }
    }
  }
}
```

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
servers reaches Anywhere through mcp-remote, as Claude Desktop does.
