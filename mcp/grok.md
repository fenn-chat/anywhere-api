# Grok

Grok connects to Anywhere's MCP server as a custom connector, with your
personal token.

## 1. Make a token for Grok

In Anywhere: your avatar, **Agents**, **Grok**. Copy the token
(`anyw_pat_…`); it is shown once. Anywhere then tells you what Grok did by
its name ("Grok added 2 places to your map"). More in
[Getting a token](../README.md#getting-a-token).

## 2. Add the connector in Grok

1. Open [grok.com/connectors](https://grok.com/connectors) (or Connectors in
   Grok's settings).
2. Choose **New Connector**, then **Custom**.
3. Server URL: `https://anywhere.fenn.chat/mcp`
4. Authentication: Grok must send the header `Authorization` with the value
   `Bearer anyw_pat_…`. Where Grok asks for a header, give exactly that
   name and value; where it asks for a bearer token or an API key, give the
   token alone.
5. Save. Grok finds Anywhere's tools and uses them in your chats. Three of
   them change your map (`add_place`, `update_place`, `remove_place`); you
   can undo each change in Anywhere.

On Grok Business and Enterprise, a team admin first allows the connector for
the team.

## Try it

> What are my favorite places in Paris?

> Save Café de Flore to my want-to-go list, with the note "hot chocolate".

> How much time did I spend at work this week?

## Grok through the xAI API

An app of your own that calls Grok gives it Anywhere as a remote MCP tool
(see xAI's [Remote MCP Tools](https://docs.x.ai/developers/tools/remote-mcp)),
the header written out in full:

```shell
curl https://api.x.ai/v1/responses \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "grok-4.7",
    "input": [{ "role": "user", "content": "What are my favorite places in Paris?" }],
    "tools": [{
      "type": "mcp",
      "server_url": "https://anywhere.fenn.chat/mcp",
      "server_label": "anywhere",
      "headers": { "Authorization": "Bearer '"$ANYWHERE_TOKEN"'" }
    }]
  }'
```

With xAI's Python SDK, the same tool is
`mcp(server_url="https://anywhere.fenn.chat/mcp", server_label="anywhere", extra_headers={"Authorization": f"Bearer {token}"})`.

## Disconnecting

In Anywhere, **Agents**, then Grok: revoke the token. Grok's next call is
refused (`401`). Remove the connector in Grok too.
