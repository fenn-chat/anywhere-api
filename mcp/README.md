# Connecting an MCP client

Anywhere's MCP server gives any MCP client the person's map, with the same
personal token as the REST API.

| | |
|---|---|
| URL | `https://anywhere.fenn.chat/mcp` |
| Transport | Streamable HTTP: stateless, answers in JSON, `POST` only (no event stream to open, no session) |
| Authentication | The header `Authorization: Bearer anyw_pat_…` ([get a token](../README.md#getting-a-token)) |
| OAuth | Not yet: clients that only connect with OAuth wait for it |

Guides for the agents the app names: [Meta Muse](meta-muse.md) ·
[Grok](grok.md) · [ChatGPT](chatgpt.md). Any other client: below.

## Tools

| Tool | What it does | Hints |
|---|---|---|
| `get_me` | Who the person is (name, time zone), this token's limits and usage | read-only |
| `list_places` | Searches the person's places: by status, words, box, distance, change time | read-only |
| `get_place` | One place: status, label, note, origin, visit stats | read-only |
| `add_place` | Saves a venue, in a list or none, with a note | changes the map |
| `update_place` | Changes a place's status, note, name or label | changes the map, destructive |
| `remove_place` | Takes a saved place off the map | changes the map, destructive |
| `list_visits` | Visits: in a range, to a place, or in a box | read-only |
| `list_trips` | Trips: when, from where to where, how, how far | read-only |
| `get_history` | Visits and trips as one timeline | read-only |
| `get_current_location` | Where the person is now | read-only |

Each tool is the REST operation of the same name in
[`openapi.json`](../openapi.json): the same inputs (a place's id is the
argument `place_id`, the `Idempotency-Key` header the argument
`idempotency_key`), answers, limits and errors. A call that fails is a tool
result marked `isError`, whose text is the API's error,
`{ "error": { "code", "message" } }`. The person is told of every call that
reads or changes their places, history or location, and can undo every
change in the app: change the map only when they ask.

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
OAuth, which Anywhere does not offer yet. Claude Desktop reaches Anywhere
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
