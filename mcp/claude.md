# Claude

Claude connects to your map as a custom connector: you add Anywhere's
connector URL once, then sign in with the phone number you use in Anywhere.
No token to copy. It works in Claude on the web, in Claude's desktop app and
in its iPhone and Android apps.

| | |
|---|---|
| Connector URL | `https://anywhere.fenn.chat/claude/mcp` |
| Sign-in | OAuth: a code texted to the phone number of your Anywhere account |
| OAuth client | Claude's published identity (nothing to enter) |

You need an Anywhere account first (Anywhere for iPhone): signing in from
Claude connects an existing account and never creates one.

## Add the connector

Anywhere is in Claude's Connectors Directory:
[claude.ai/directory/anywhere](https://claude.ai/directory/anywhere), or
search for Anywhere in **Customize**, **Connectors**. Choose **Connect**.
Anywhere's page opens: enter your phone number, then the 4-digit code it
texts you. The code's check returns you to Claude, connected. Connecting once
connects Claude on the web, in its desktop app and in its phone apps.

As a custom connector instead (Claude then shows another icon): in Claude,
**Customize**, then **Connectors**
([claude.ai/customize/connectors](https://claude.ai/customize/connectors)),
**Add custom connector**, name `Anywhere`, URL
`https://anywhere.fenn.chat/claude/mcp`. Leave the advanced settings as they
are: Claude signs in with its own published identity, and Anywhere needs no
client ID or secret.

On a Team or Enterprise plan, an owner adds the connector for the
organization first (**Admin settings**, **Connectors**); each member then
connects their own map.

## Use it

In a chat, Anywhere is among Claude's tools (the **+** menu, then
**Connectors**). Ask, for example: "What are my favorite places on
Anywhere?" or "Save Café de Flore in Paris to my want-to-go list." Claude
reads without asking; it asks you before it changes your map (its place
and tag edits and line updates and removals are marked destructive). `open_map` sends a notification to
your phone that opens the map there.

With a route’s coordinates, ask “Draw this walk on my map until Sunday
evening and link it here.” You can open its link or tap the line to see
its details. [Temporary map lines](../README.md#draw-a-temporary-map-line).

Anywhere lists the connection as **Claude** (your avatar, **Agents**), tells
you what Claude did ("Claude added Café de Flore to your map"), and lets you
undo changes to your saved places. More in [The person is
told](../README.md#the-person-is-told).

## Disconnecting

In Claude, **Connectors**, then Anywhere: **Disconnect**. Or in Anywhere,
**Agents**, then Claude: revoke it. Either ends that connection; connect
again from Claude whenever you like.

## Claude Code and your own apps

Claude Code signs in the same way, with the same URL: add it, then run
`/mcp` in Claude Code, choose Anywhere and **Authenticate**. Your browser
opens Anywhere's page for your phone number and code, then returns to Claude
Code, connected. Anywhere lists the connection as **Claude Code**.

```shell
claude mcp add --transport http --scope user anywhere https://anywhere.fenn.chat/claude/mcp
```

Claude Code can also connect with a personal token instead, sent as a header
on every call to `https://anywhere.fenn.chat/mcp`: see
[Claude Code](README.md#claude-code). An app of your own on Claude's API
gives Claude Anywhere through the API's MCP connector, with that URL and
the personal token as its authorization token.

## When something is off

| What you see | What to do |
|---|---|
| "No available Anywhere account uses this number" | Sign in to Anywhere on your iPhone with that number first, then connect again |
| "You've connected 10 agents, the most an account can" | Remove one in Anywhere (**Agents**), then connect again |
| Claude says Anywhere's tools need you to connect | **Connectors**, Anywhere, **Connect** again: your connection was revoked or expired |
| The connector was added with a URL ending in `/mcp` alone | That URL is for clients with a personal token: remove the connector and add it again with `https://anywhere.fenn.chat/claude/mcp` |
