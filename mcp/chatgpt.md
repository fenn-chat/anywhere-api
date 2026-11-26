# ChatGPT

Install the published Anywhere plugin in ChatGPT and choose **Connect**.
Enter your existing Anywhere phone number and SMS code on Anywhere's
browser sign-in page. Never put that number, code or an access token in the
chat. The plugin uses OAuth and keeps the connection for later chats.

The Anywhere app's ChatGPT setup copies a prompt that opens the exact
published plugin. Its connection link is
[Connect Anywhere](https://chatgpt.com/#settings/Connectors?connector=asdk_app_6ae13ce037f08191832b9b348aa49c42).
After sign-in, call `list_places` to verify access before reporting success.

With a route file or a list of coordinates in the chat, try “Draw this
walk on my map until tomorrow evening and give me its link.” The link
opens the line on your iPhone. [Temporary map lines](../README.md#draw-a-temporary-map-line).

For integrations you configure yourself, personal access keys remain usable:

- **A GPT with an action**, in ChatGPT on the web, desktop and phone: the GPT
  calls Anywhere's REST API, which its OpenAPI document describes.
- **Codex** (its CLI, its IDE extension, and the ChatGPT desktop app) as an
  MCP client.

## A token for ChatGPT

For the GPT action or manually configured MCP client below, choose
**Other** in Anywhere's agent picker and **Copy access key** (`anyw_pat_…`).
The published ChatGPT plugin does not need this key. More in
[Getting a token](../README.md#getting-a-token).

## A GPT with an action

Creating a GPT takes a plan that allows it.

1. In ChatGPT, open **GPTs**, then **Create**, then **Configure**.
2. Name it ("Anywhere"), and give it instructions, for example:

   > You read and change my Anywhere map through the Anywhere action: my
   > saved places (tagged favorite, wantToGo or my own tags), the places I go to, my
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

Remove the connection in Anywhere to revoke its access. Disconnecting the
published plugin in ChatGPT revokes that OAuth session. For a manually
configured GPT or Codex client, revoke its separate access key and remove
the key from the client's configuration too.
