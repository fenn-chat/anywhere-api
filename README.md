# Anywhere agent API

Let an agent read and change your [Anywhere](https://anywhere.fenn.chat) map:
the places you saved and the ones you go to, every visit and trip you made,
and where you are now.

| | |
|---|---|
| REST | `https://anywhere.fenn.chat/api/v1` |
| MCP | `https://anywhere.fenn.chat/mcp` (Streamable HTTP) |
| Contract | [`openapi.json`](openapi.json) (OpenAPI 3.1), also served at `https://anywhere.fenn.chat/api/v1/openapi.json` |
| Authentication | `Authorization: Bearer anyw_pat_…`, a personal token you make in the app |

REST and MCP are one API: each MCP tool is a REST operation under the same
name, with the same inputs, answers, limits and errors. One token works for
both.

- [What an agent can do](#what-an-agent-can-do)
- [Quick start](#quick-start)
- [Getting a token](#getting-a-token)
- [The person is told](#the-person-is-told)
- [Limits](#limits)
- [Errors](#errors)
- [Pages](#pages)
- [Conventions](#conventions)
- [MCP](#mcp)
- [Versions](#versions)

## What an agent can do

| What | REST | MCP tool | Examples |
|---|---|---|---|
| Who the person is, this token's limits and usage | `GET /me` | `get_me` | [curl](examples/curl/get_me.sh) · [Python](examples/python/get_me.py) · [TypeScript](examples/typescript/get_me.ts) |
| Search the person's places | `GET /places` | `list_places` | [curl](examples/curl/list_places.sh) · [Python](examples/python/list_places.py) · [TypeScript](examples/typescript/list_places.ts) |
| Save a place | `POST /places` | `add_place` | [curl](examples/curl/add_place.sh) · [Python](examples/python/add_place.py) · [TypeScript](examples/typescript/add_place.ts) |
| Read a place | `GET /places/{place_id}` | `get_place` | [curl](examples/curl/get_place.sh) · [Python](examples/python/get_place.py) · [TypeScript](examples/typescript/get_place.ts) |
| Change a place: status, note, name, label | `PATCH /places/{place_id}` | `update_place` | [curl](examples/curl/update_place.sh) · [Python](examples/python/update_place.py) · [TypeScript](examples/typescript/update_place.ts) |
| Take a place off the map | `DELETE /places/{place_id}` | `remove_place` | [curl](examples/curl/remove_place.sh) · [Python](examples/python/remove_place.py) · [TypeScript](examples/typescript/remove_place.ts) |
| A place's visits | `GET /places/{place_id}/visits` | `list_visits` with `place_id` | [curl](examples/curl/list_place_visits.sh) · [Python](examples/python/list_place_visits.py) · [TypeScript](examples/typescript/list_place_visits.ts) |
| Visits: by time, place or area | `GET /visits` | `list_visits` | [curl](examples/curl/list_visits.sh) · [Python](examples/python/list_visits.py) · [TypeScript](examples/typescript/list_visits.ts) |
| Trips | `GET /trips` | `list_trips` | [curl](examples/curl/list_trips.sh) · [Python](examples/python/list_trips.py) · [TypeScript](examples/typescript/list_trips.ts) |
| Visits and trips as one timeline | `GET /history` | `get_history` | [curl](examples/curl/get_history.sh) · [Python](examples/python/get_history.py) · [TypeScript](examples/typescript/get_history.ts) |
| Where the person is now | `GET /location` | `get_current_location` | [curl](examples/curl/get_current_location.sh) · [Python](examples/python/get_current_location.py) · [TypeScript](examples/typescript/get_current_location.ts) |

What each takes and answers, field by field, is in [`openapi.json`](openapi.json);
[examples/](examples/README.md) says how to run the examples.

- **Places** are the pins of the person's map. A `saved` place is one they
  (or an agent, a chat, an import) saved, in a list, `favorite` or
  `wantToGo`, or in none (`status: null`). A `visited` place is one they go
  to without having saved it: home, work, a café they stayed at. Each place
  carries its label (`home`, `work`, `school`), the person's private note,
  who put it there, and its visit stats over all of the person's history.
- **History** is every visit and trip ever recorded, however old: no limit.
  A trip is its summary (when, from where to where, how, how far), never its
  route.
- **Location** is the person's phone's last report: at a place since a time,
  or moving, with the trip's predicted destination and arrival.
- **Changes** go to the person's map at once, and the person can undo each
  one in the app. Saving a venue already on the map (the same Apple Maps or
  Google id, or the same name within 100 m) never adds it twice.

## Quick start

1. [Get a token](#getting-a-token) in the Anywhere app.
2. Keep it in your environment: `export ANYWHERE_TOKEN=anyw_pat_…`
3. Ask who you are talking to:

```bash
curl https://anywhere.fenn.chat/api/v1/me \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
```

Then search the person's favorites near the Louvre:

```bash
curl -G https://anywhere.fenn.chat/api/v1/places \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  --data-urlencode "status=favorite" \
  --data-urlencode "near=48.8606,2.3376" \
  --data-urlencode "radius_m=2000"
```

For an MCP client (Meta Muse, Grok, ChatGPT, Claude, Cursor…), see [MCP](#mcp).

## Getting a token

A personal token is made in the Anywhere app, by the person whose map it
opens:

1. In Anywhere, tap your avatar, then **Agents**.
2. Choose the agent you are connecting: **Meta Muse**, **Grok**,
   **ChatGPT**, or another agent, which you name ("Claude on my Mac"). The
   app tells you what each agent did by this name.
3. Copy the token. It starts with `anyw_pat_` and is shown once: Anywhere
   keeps only a hash of it.

A token opens the person's whole map: it reads and changes their places, and
reads their history and their current location. There are no scopes yet.
Keep it out of code, logs, URLs and chats; give it to the agent the way the
agent keeps secrets (its connector's credential, a secret store, an
environment variable).

An account holds up to 10 tokens at once. The person revokes one in the app
(**Agents**, then the agent): its next call is refused
(`401 invalid_token`, "This token was revoked").

## Authentication

Send the token in the `Authorization` header of every request, REST or MCP:

```
Authorization: Bearer anyw_pat_…
```

A request without a valid token is refused with `401` and
`WWW-Authenticate: Bearer realm="anywhere"`. A token in a query string or a
body is never read. The API sends no CORS headers: tokens belong in agents,
servers and scripts, never in web pages. OAuth is planned; until
then, clients that require OAuth (ChatGPT's and Claude's own connectors)
connect as their guides in [mcp/](mcp/README.md) say.

## The person is told

Anywhere records every call that reads or changes the person's places,
history or location, and tells them: a notification per agent, sent once the
agent pauses (a minute after its last call, at most three minutes after its
first), in words like "Grok added Café de Flore to your map" or "ChatGPT
read your history". The app lists each agent's activity for 90 days, and
every change can be undone there. `GET /me` reads only the person's name and
time zone, and is not recorded.

So read what the task needs, change the map only when the person asked, and
prefer one call over many: the person sees all of them.

## Limits

Per token:

| Limit | Value | Beyond it |
|---|---|---|
| Calls | 1,000 a day (UTC) and 60 a minute | `429 quota_exceeded`, with `Retry-After` in seconds |
| Changes to the map | 200 a day (UTC) | `429 quota_exceeded` |
| Body | 32 KiB | `413 payload_too_large` |
| Page | 200 items (50 by default) | `400 invalid_request` |

Each call counts once, and a change also counts against the changes. A call
refused for its input (`400`) and a retry answered from its `Idempotency-Key`
are not counted; a call that failed on Anywhere's side (`5xx`) is given back.
`GET /me` says what the token used today. An address that presents 50 unknown
tokens in a day is refused (`429 too_many_attempts`) until midnight UTC.

## Errors

Every error answer is JSON with a stable code and a message for people and
agents:

```json
{ "error": { "code": "place_not_found", "message": "No place nope on the map" } }
```

| Status | Code | Meaning |
|---|---|---|
| 400 | `invalid_request` | The request does not match the contract; the message says how |
| 400 | `invalid_cursor` | A cursor this API did not give, or given with other filters |
| 400 | `invalid_json` | The body is not a JSON object |
| 401 | `invalid_token` | No token, a malformed or unknown one, or a revoked one |
| 404 | `place_not_found` | No such place on the map |
| 404 | `location_not_shared` | The person's phone has shared no location yet |
| 404 | `not_found` | No such path |
| 405 | `method_not_allowed` | The path takes other methods (`Allow` names them) |
| 409 | `not_saved` | A `visited` place takes a label and nothing else: save it first (`POST /places`) to give it a status, a note or a name; only the person hides it |
| 409 | `not_visited` | Only a place the person has been to takes a label |
| 409 | `idempotency_conflict` | An `Idempotency-Key` used for another request |
| 413 | `payload_too_large` | The body is over 32 KiB |
| 429 | `quota_exceeded` | A limit is reached; wait `Retry-After` seconds when given |
| 429 | `too_many_attempts` | Too many unknown tokens from this address today |
| 500 | `internal` | Something went wrong on Anywhere's side; retry |
| 503 | `agents_api_disabled`, `quota_unavailable`, `lookup_failed`, `activity_unavailable`, `idempotency_unavailable` | Switched off for now, or a dependency is down; retry later |

Retry `429` after `Retry-After`, and `500` and `503` with a growing delay. Do
not retry other errors unchanged. Over MCP, a call's error is a tool result
marked `isError` whose text is this same JSON; a request without a valid
token is refused before any MCP, with HTTP `401`.

## Pages

Lists (`/places`, `/visits`, `/trips`, `/history`, a place's visits) come in
pages: `limit` items (50 by default, 200 at most), most recent first (or
nearest first with `near`), and a `next_cursor`. Pass it as `cursor`, with
the same filters, for the next page; it is `null` on the last. Every place of
the map, page after page (with [jq](https://jqlang.org)):

```bash
cursor=""
while :; do
  page=$(curl -sS --fail-with-body -G https://anywhere.fenn.chat/api/v1/places \
    -H "Authorization: Bearer $ANYWHERE_TOKEN" \
    --data-urlencode "limit=50" ${cursor:+--data-urlencode "cursor=$cursor"})
  jq -r '.places[] | "\(.name)\t\(.status)"' <<<"$page"
  cursor=$(jq -r '.next_cursor // empty' <<<"$page")
  [ -n "$cursor" ] || break
done
```

**Keeping a copy in sync.** `GET /places?updated_since=<time>` answers only
what changed since then: the places that changed, and in `removed` the ids
that changed and are no longer found (taken off the map, or no longer
matching your other filters). Pass the newest `updated_at` or `removed_at`
your copy holds, the server's times, never your own clock's:

```bash
curl -G https://anywhere.fenn.chat/api/v1/places \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  --data-urlencode "updated_since=2026-10-16T09:00:00.000Z"
```

GET answers also carry an `ETag`: send it back as `If-None-Match` to get
`304 Not Modified` while nothing changed.

## Conventions

- **Times** in answers are ISO 8601 in UTC, to the millisecond
  (`2026-10-16T18:30:00.000Z`). `from`, `to` and `updated_since` take a
  date-time with its offset (`2026-10-16T20:30:00+02:00`) or a date
  (`2026-10-16`, midnight UTC). A range `[from, to)` holds what went on in
  it: a visit or trip begun before `to` and ended after `from`, or still
  going on. Show times in the person's time zone, `time_zone` in `GET /me`.
- **Coordinates** are WGS84 degrees: `lat`, `lng`. `bbox` is
  `min_lat,min_lng,max_lat,max_lng` (a `min_lng` east of `max_lng` crosses
  the antimeridian); `near` is `lat,lng`, with `radius_m` (1,000 m by
  default, 100,000 at most): nearest first, each with its `distance_m`.
- **Units**: durations in seconds (`duration_s`, `total_time_s`), distances
  in meters, speeds in meters per second.
- **Lists and labels**: `status` is `favorite`, `wantToGo` or `null` (saved
  without a list); `label` is `home`, `work`, `school` or `null`;
  `unconfirmed` places wait for the person to confirm which venue they are
  (a yellow "?" on their map). Ids are opaque strings.
- **Text** limits count UTF-16 code units: a name 200, an address 500, a
  note 4,000, a search 200. A blank or `null` note clears it.
- **Saving twice.** `POST /places` takes an `Idempotency-Key` header (a
  UUID): a retry with the same key and the same body within a day answers the
  first response again (`Idempotent-Replayed: true`) without a second change.
  It answers `201 Created` for a new place and `200` when the venue was on
  the map already (`outcome: merged`).
- Answers are the person's data: `Cache-Control: private, no-store`. Never
  cache or share them beyond what the person asked for.

## MCP

`https://anywhere.fenn.chat/mcp` is a stateless Streamable HTTP server
answering in JSON, with the same token in the same header. Its tools are the
operations above, under their MCP names, with read-only and destructive
hints, so clients can ask the person before a change.

| Client | Guide |
|---|---|
| Meta Muse | [mcp/meta-muse.md](mcp/meta-muse.md) |
| Grok | [mcp/grok.md](mcp/grok.md) |
| ChatGPT | [mcp/chatgpt.md](mcp/chatgpt.md) |
| Claude, Cursor, VS Code, OpenClaw and any other MCP client | [mcp/README.md](mcp/README.md) |

## Versions

`info.version` in [`openapi.json`](openapi.json) is the API's version, and
[CHANGELOG.md](CHANGELOG.md) lists its changes. Paths stay under `/v1` while
every change is compatible: new operations, new optional inputs, new fields
in answers (ignore the ones you do not know). A change that would break a
client gets a new path version.

## License

The documentation, the OpenAPI document and the examples are under the
[MIT license](LICENSE). The API itself is a service of Anywhere, under its
[Terms of Use](https://anywhere.fenn.chat/terms).
