# Meta Muse

Muse connects to Anywhere through a custom connector: an integration Muse
builds itself, in its secure VM, when you ask for it in a chat. It reaches
Anywhere's MCP server with your personal token, which Muse keeps in its
secure credential store, out of the chat.

## 1. Make a token for Muse

In Anywhere: your avatar, **Agents**, **Meta Muse**. Copy the token
(`anyw_pat_…`); it is shown once. Anywhere then tells you what Muse did by
its name ("Muse added 2 places to your map"). More in
[Getting a token](../README.md#getting-a-token).

## 2. Ask Muse to build the connector

In Muse, start a chat and send:

> Create a custom connector for Anywhere, my map. Its MCP server is
> https://anywhere.fenn.chat/mcp (Streamable HTTP over HTTPS). It
> authenticates with a bearer token in the Authorization header: ask me for
> it in the secure prompt. From any future conversation, I want you to read
> my places, visits, trips and current location, and to save or change
> places when I ask. Test it with get_me and list_places only, without
> changing my map, and show me the results.

If Muse asks how the server is reached and how it authenticates, answer
**HTTP** and **bearer token**. Muse can also build the connector from the REST
API's contract instead: `https://anywhere.fenn.chat/api/v1/openapi.json`,
same token.

## 3. Give Muse the token in its secure prompt

When Muse asks for the credential, paste the token into the secure entry it
opens, never into the chat: Muse keeps it in its credential store, and the
chat never shows it.

## 4. Choose what Muse may do without asking

In Muse's settings, under connectors, keep Anywhere asking for your approval
before each action, or at least before changes: `add_place`,
`update_place` and `remove_place` change your map (you can undo each in
Anywhere).

## Try it

> What are my favorite places in Paris?

> Save Café de Flore to my want-to-go list, with the note "hot chocolate".

> Where was I last Saturday afternoon?

## Disconnecting

In Anywhere, **Agents**, then Muse: revoke the token. Muse's next call is
refused. Remove the connector in Muse's settings too.

Custom connectors are Meta's feature: Meta does not review them, and what
Muse offers changes with Muse. If a step here differs from what Muse shows,
Muse's own help wins; the connector needs only the URL and the header above.
