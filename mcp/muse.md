# Muse

Connect your Anywhere map to Meta Muse with a Custom Connector. Sign in on
Anywhere's website with the phone number you already use in the iPhone app.
You do not copy an access key into Muse.

## Connect

Muse is temporarily hidden from Anywhere's agent choices while its directory
submission is under review. To test a Custom Connector now, paste this into
a Muse chat:

> Create a Custom Connector named Anywhere for the remote MCP server
> https://anywhere.fenn.chat/mcp using Streamable HTTP and OAuth. Use client
> ID `muse`, with no client secret, and PKCE S256. Open the browser sign-in
> for me; never ask for my phone number, verification code or access token
> in this chat. After I connect, list the tools and call `list_places` to
> verify access. Save the working connector as a skill for future chats.

1. Follow Muse's connection link. The Anywhere page must say
   **Connect Anywhere to Muse**. If Muse's Custom Connector setup first asks
   for a client ID, enter `muse`; leave the client secret blank.
2. Enter your Anywhere phone number and the four-digit SMS code on that
   page. The page returns to Muse when verification succeeds.
3. Let Muse check the connection with `list_places`. A connector created
   without a successful authenticated call is not a verified connection.

Only an existing, enabled Anywhere account can connect. If you reach the
account's connection limit, remove an unused connection in Anywhere first.
If you cancel or sign-in fails, no new connection is created.

Muse supports user-created Custom Connectors separately from its reviewed
directory. These instructions do not imply Anywhere has a published Muse
directory listing. See [Meta's connector help](https://www.meta.com/help/superintelligence/1687253048996149/).

## Connection settings

| Setting | Value |
|---|---|
| MCP URL and OAuth resource | `https://anywhere.fenn.chat/mcp` |
| Transport | Streamable HTTP; stateless JSON responses |
| Authorization server | `https://anywhere.fenn.chat` |
| Discovery | `https://anywhere.fenn.chat/.well-known/oauth-authorization-server` |
| Authorization endpoint | `https://anywhere.fenn.chat/oauth/authorize` |
| Token endpoint | `https://anywhere.fenn.chat/oauth/token` |
| Revocation endpoint | `https://anywhere.fenn.chat/oauth/revoke` |
| Client ID | `muse` |
| Client authentication | `none`; no client secret |
| Grant types | Authorization code with PKCE S256, rotating refresh token |
| Scope | `anywhere` |
| Runtime callbacks | `https://muse.ai/api/hatch/oauth/callback` and `https://agent.meta.ai/api/hatch/oauth/callback` |
| Connector Platform test callback | `https://platform.muse.ai/oauth/credential-test/callback` |

The server accepts only the registered client and its exact callbacks. It
also recognizes the Connector Platform's official client identifier,
`https://platform.muse.ai/oauth/client-metadata.json`, for that platform's
test callback. It does not offer arbitrary dynamic client registration.

Access tokens expire after one hour. Muse keeps the refresh token in its
credential store and rotates it when refreshing. A connection unused for
30 days requires sign-in again. Tokens are restricted to this MCP resource;
REST scripts continue to use a separate personal access key.

## Use and disconnect

Ask Muse to find saved places, save a place you identify, or update a note.
The [tool reference](README.md#tools) describes every supported action.
The connection covers the API's existing read and write permissions;
Anywhere does not currently offer a separate read-only OAuth scope.

Anywhere lists the connection as **Muse** and records its data reads and
changes. Disconnect in Muse to remove its saved connection. To revoke
server-side access immediately, remove that connection in Anywhere.
Never report a save or deletion until the tool confirms it.
