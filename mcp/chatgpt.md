# ChatGPT

ChatGPT's own MCP apps (developer mode) connect with OAuth or with no
authentication at all; Anywhere wants your token on every call and offers no
OAuth yet, so this guide gets their steps once it does. Until then, ChatGPT
reaches your map with your personal token in two ways:

- **A GPT with an action**, in ChatGPT on the web, desktop and phone: the GPT
  calls Anywhere's REST API, which its OpenAPI document describes.
- **Codex** (its CLI, its IDE extension, and the ChatGPT desktop app) as an
  MCP client.

## A token for ChatGPT

In Anywhere: your avatar, **Agents**, **ChatGPT**. Copy the token
(`anyw_pat_…`); it is shown once. Anywhere then tells you what ChatGPT did by
its name ("ChatGPT read your history"). More in
[Getting a token](../README.md#getting-a-token).

## A GPT with an action

Creating a GPT takes a plan that allows it.

1. In ChatGPT, open **GPTs**, then **Create**, then **Configure**.
2. Name it ("Anywhere"), and give it instructions, for example:

   > You read and change my Anywhere map through the Anywhere action: my
   > saved places (lists favorite and wantToGo), the places I go to, my
   > visits and trips, and where I am now. Times are UTC: show them in my
   > time zone (get_me). Change my map only when I ask.

3. Under **Actions**, choose **Create new action**.
4. **Authentication**: **API Key**, auth type **Bearer**, and paste the
   token. ChatGPT sends it as `Authorization: Bearer anyw_pat_…` and keeps it
   encrypted.
5. **Schema**: **Import from URL**, with
   `https://anywhere.fenn.chat/api/v1/openapi.json`. The action's operations
   appear: `get_me`, `list_places`, `add_place` and the others.
6. Test with `get_me`, then save the GPT for **Only me**.

Never share this GPT: it holds your token, so whoever uses it reads and
changes your map. ChatGPT asks before each call that changes the map
(`POST`, `PATCH`, `DELETE`). An action's answers stay under 100,000
characters: keep `limit` at 50 or less (the default) when listing places.

## Codex

The Codex CLI, its IDE extension and the ChatGPT desktop app share Codex's
configuration, `~/.codex/config.toml`. Add Anywhere's MCP server with the
token read from your environment (`ANYWHERE_TOKEN`):

```toml
[mcp_servers.anywhere]
url = "https://anywhere.fenn.chat/mcp"
bearer_token_env_var = "ANYWHERE_TOKEN"
```

An app that starts outside your shell (the desktop app) may not see that
variable: give it the header itself instead, with
`http_headers = { "Authorization" = "Bearer anyw_pat_…" }` in place of
`bearer_token_env_var`.

## Your own app on OpenAI's API

An app of your own that calls OpenAI's models gives them Anywhere through the
Responses API's MCP tool: `server_url` `https://anywhere.fenn.chat/mcp`, with
the header `Authorization: Bearer anyw_pat_…` in `headers`. OpenAI's
[MCP guide](https://platform.openai.com/docs/guides/tools-remote-mcp) has
the details.

## Disconnecting

In Anywhere, **Agents**, then ChatGPT: revoke the token. The next call from
the GPT or Codex is refused (`401`). Delete the GPT, or the token from
Codex's configuration, too.
