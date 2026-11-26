# Grok Bot

Connect Grok Bot to your Anywhere map with browser sign-in. You need an
existing Anywhere account. Your phone number and verification code go only
into Anywhere's sign-in page; never paste an access key or code into a chat.

## Connect

1. Ask your Bot: “Add Anywhere as a custom MCP server at
   https://anywhere.fenn.chat/grok/mcp.”
2. Open the connection's **Authenticate** action (**Authorize** on mobile)
   in **Connect apps**, or follow the Bot's Connect card.
3. Check that the page says **Connect Anywhere to Grok Bot**. Enter the
   phone number you use in Anywhere, then the verification code.
4. Return to the Bot and ask it to check the connection with `get_me`.
   Installing the connector alone does not sign you in.

Grok Bot supports custom MCP URLs through its
[Connect apps flow](https://docs.x.ai/grok-bot/computer-and-apps#connect-an-app).
A team administrator may need to allow Anywhere first. Custom connections
do not require Anywhere to be listed in the marketplace.

## Connection settings

| Setting | Value |
|---|---|
| Name | Anywhere |
| MCP URL | `https://anywhere.fenn.chat/grok/mcp` |
| Transport | Streamable HTTP, JSON responses, stateless |
| Protected resource metadata | `https://anywhere.fenn.chat/.well-known/oauth-protected-resource/grok/mcp` |
| Authorization server metadata | `https://anywhere.fenn.chat/.well-known/oauth-authorization-server` |
| Client identity | `https://cursor.com/oauth/mcp-client.json` |
| Client authentication | `none`; no client secret |
| Authorization | Authorization code with PKCE S256; rotating refresh tokens |
| Scope | `anywhere` |
| Allowed callbacks | `https://www.cursor.com/agents/mcp/oauth/callback`, `https://www.cursor.com/bot/mcp/oauth/callback` |

Grok Bot uses Cursor's connector backend and its
[published OAuth client identity](https://cursor.com/oauth/mcp-client.json).
Anywhere pins that identity and the two HTTPS callbacks above; it does not
fetch caller-supplied metadata URLs or accept arbitrary client registration.
The unauthenticated endpoint returns HTTP 401 with OAuth discovery metadata.

Access tokens last one hour. Refresh tokens rotate and expire after 30 days
of inactivity. These tokens work only at `/grok/mcp`; REST scripts use a
separate personal access key. The single `anywhere` scope includes the
existing API's reads and writes; there is no separate read-only scope.

## Try it

> Show the places I want to visit.

> Save the Eiffel Tower at latitude 48.8584, longitude 2.2945 as a place I
> want to go, with the note “Bring a picnic.” Check for an existing pin first.

> Append “Go before sunset” to that place's note, keeping the existing text.

> Draw a temporary line through these coordinates in order and send me its link.

The line expires after 24 hours by default. [Temporary map lines](../README.md#draw-a-temporary-map-line).

> Yesterday's 8 a.m. visit shows the shop next to the station.
> Move that visit to the station I already have on my map.

The Bot can find that stay with `list_visits` and move it with
`correct_visit`. To rename a visited pin across all its visits, ask the
Bot to rename the place. [How visit corrections work](../README.md#correct-a-visit).

Use only places the Bot can identify reliably. Anywhere does not geocode
addresses: unknown coordinates need a reliable lookup or clarification.
The [tool reference](README.md#tools) describes all actions. A successful
save returns the place's `url`, which opens it in Anywhere. `open_map`
sends a notification for you to tap; it does not open the app remotely.

## Disconnect

In Anywhere, open your avatar, **Agents**, then the **Grok Bot** connection
and revoke it. Subsequent data calls are refused. Remove the app in Grok Bot
too. A separately created personal access key has its own connection and is
revoked separately.

This guide is for the Grok Bot app. Ordinary Grok chat and the xAI API use
the separate [Grok guide](grok.md).
