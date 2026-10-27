# Anywhere agent API

Let an agent read and change your [Anywhere](https://anywhere.fenn.chat) map:
the places you saved and the ones you go to, every visit and trip you made,
where you are now, your friends' shared locations and your calendar. Agents
can also send a notification that opens a particular map view, or one of
your places, on your phone.

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
- [Set up your agent](#set-up-your-agent)
- [Keep important places up to date](#keep-important-places-up-to-date)
- [Tags and ratings](#tags-and-ratings)
- [Show map results on your phone](#show-map-results-on-your-phone)
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
| Change a place: tags, note, name, label, rating | `PATCH /places/{place_id}` | `update_place` | [curl](examples/curl/update_place.sh) · [Python](examples/python/update_place.py) · [TypeScript](examples/typescript/update_place.ts) |
| Take a place off the map | `DELETE /places/{place_id}` | `remove_place` | [curl](examples/curl/remove_place.sh) · [Python](examples/python/remove_place.py) · [TypeScript](examples/typescript/remove_place.ts) |
| A place's visits | `GET /places/{place_id}/visits` | `list_visits` with `place_id` | [curl](examples/curl/list_place_visits.sh) · [Python](examples/python/list_place_visits.py) · [TypeScript](examples/typescript/list_place_visits.ts) |
| Visits: by time, place or area | `GET /visits` | `list_visits` | [curl](examples/curl/list_visits.sh) · [Python](examples/python/list_visits.py) · [TypeScript](examples/typescript/list_visits.ts) |
| Trips | `GET /trips` | `list_trips` | [curl](examples/curl/list_trips.sh) · [Python](examples/python/list_trips.py) · [TypeScript](examples/typescript/list_trips.ts) |
| Visits and trips as one timeline | `GET /history` | `get_history` | [curl](examples/curl/get_history.sh) · [Python](examples/python/get_history.py) · [TypeScript](examples/typescript/get_history.ts) |
| Where the person is now | `GET /location` | `get_current_location` | [curl](examples/curl/get_current_location.sh) · [Python](examples/python/get_current_location.py) · [TypeScript](examples/typescript/get_current_location.ts) |
| Send a notification that opens a map view or a place on the phone | `POST /map/open` | `open_map` | [curl](examples/curl/open_map.sh) · [Python](examples/python/open_map.py) · [TypeScript](examples/typescript/open_map.ts) |
| Friends and the locations they share with the person | `GET /friends` | `list_friends` | [curl](examples/curl/list_friends.sh) · [Python](examples/python/list_friends.py) · [TypeScript](examples/typescript/list_friends.ts) |
| The person's mirrored calendar events | `GET /calendar/events` | `list_calendar_events` | [curl](examples/curl/list_calendar_events.sh) · [Python](examples/python/list_calendar_events.py) · [TypeScript](examples/typescript/list_calendar_events.ts) |
| Read the tags: the standard ones and the person's own | `GET /tags` | `list_tags` | [curl](examples/curl/list_tags.sh) · [Python](examples/python/list_tags.py) · [TypeScript](examples/typescript/list_tags.ts) |
| Create a tag | `POST /tags` | `create_tag` | [curl](examples/curl/create_tag.sh) · [Python](examples/python/create_tag.py) · [TypeScript](examples/typescript/create_tag.ts) |
| Rename a tag | `PATCH /tags/{tag_id}` | `update_tag` | [curl](examples/curl/update_tag.sh) · [Python](examples/python/update_tag.py) · [TypeScript](examples/typescript/update_tag.ts) |
| Delete a tag, keeping its places | `DELETE /tags/{tag_id}` | `remove_tag` | [curl](examples/curl/remove_tag.sh) · [Python](examples/python/remove_tag.py) · [TypeScript](examples/typescript/remove_tag.ts) |

What each takes and answers, field by field, is in [`openapi.json`](openapi.json);
[examples/](examples/README.md) says how to run the examples.

- **Places** are the pins of the person's map. A `saved` place is one they
  (or an agent, a chat, an import) saved, with any number of tags: the
  standard `favorite` (they love it) and `wantToGo`, and their own, or none
  (`tags: []`). A `visited` place is one they go
  to without having saved it: home, work, a café they stayed at. Each place
  carries its label (`home`, `work`, `school`), the person's private note,
  who put it there, and its visit stats over all of the person's history.
- **History** is every visit and trip ever recorded, however old: no limit.
  A trip is its summary (when, from where to where, how, how far), never its
  route.
- **Location** is the person's phone's last report: at a place since a time,
  or moving, with the trip's predicted destination and arrival.
- **Friends** are the person's active, unblocked friends. Each includes only
  the current location that friend shares with the person, or `null` when
  sharing is off or no report is available. A token cannot read a friend's
  private history or calendar, enable their sharing, or bypass a block.
- **Calendar** is the person's events already mirrored from their devices
  and connected Google Calendar, normally 30 days back to 90 days ahead.
  Events appear once per occurrence, soonest first, with their full notes,
  calendar, location text and availability. This is read-only: changes belong
  in the source calendar. It makes no request to Apple or Google during an
  API call. Disconnecting Google hides its copies immediately.
- **Changes** go to the person's map at once, and the person can undo each
  saved-place change in the app. Saving a venue already on the map (the same Apple Maps or
  Google id, or the same name within 100 m) never adds it twice.

## Quick start

1. [Get a token](#getting-a-token) in the Anywhere app.
2. Keep it in your environment: `export ANYWHERE_TOKEN=anyw_pat_…`
3. Ask who you are talking to:

```bash
curl https://anywhere.fenn.chat/api/v1/me \
  -H "Authorization: Bearer $ANYWHERE_TOKEN"
```

Then search the places the person loves near the Louvre:

```bash
curl -G https://anywhere.fenn.chat/api/v1/places \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  --data-urlencode "tag=favorite" \
  --data-urlencode "near=48.8606,2.3376" \
  --data-urlencode "radius_m=2000"
```

For an MCP client (ChatGPT, Claude, Grok, Cursor…), see [MCP](#mcp).

## Set up your agent

Connect the agent with your personal token, then give it a standing request:

> Send all the important places you already know about me to Anywhere,
> especially my home, work and school, plus my regular places, favorites and
> places I want to go. Check what is already there first. Use only places
> you can identify reliably; ask me about missing or ambiguous addresses.
> Keep these places up to date: add new important places you learn about, and
> add useful new information about existing places to their notes while
> preserving what is already there. Apply my corrections. For map-related
> requests, prefer showing the result in Anywhere on my phone: use open_map
> to send a notification with the camera centered and zoomed on the relevant
> area, or opening one of my places. Tell me what you saved or changed and
> how to view it.

The app's **Copy prompt** includes the connection details and the personal
token. Treat the entire copied prompt as a credential: share it only with
the private agent conversation you intend to connect. Prefer the client's
credential store when it offers one. Never publish the prompt or put it in
a shared chat, repository or log. The documentation and examples use
`anyw_pat_…` as a placeholder, not a working key.

REST clients use `https://anywhere.fenn.chat/api/v1` and
`Authorization: Bearer <your token>`. MCP clients use
`https://anywhere.fenn.chat/mcp` with the same header. The public
[OpenAPI contract](https://anywhere.fenn.chat/api/v1/openapi.json) needs no
token to read.

## Keep important places up to date

An agent following that standing request should:

1. Call `get_me` (`GET /me`), then `list_places` (`GET /places`), following
   `next_cursor` until it has the existing places it needs to compare.
2. Save known places that are missing with `add_place` (`POST /places`).
   A name, `lat` and `lng` are required; include a known address and provider
   ids when available. This API does not search or geocode an address:
   resolve it reliably first, or ask the person. Never invent coordinates.
   Leave `tags` unset unless the person identified a place they love
   (`favorite`), one they want to go to (`wantToGo`), or a tag of theirs. Use an `Idempotency-Key` for retries.
3. Reuse existing place ids. Use `update_place` (`PATCH /places/{place_id}`)
   for changed names, notes, tags or supported labels. Preserve existing
   notes and preferences unless the new information changes them. Saving
   again can merge a venue, but a supplied note replaces its previous note.
4. When the person shares another important place, add it. When they share
   useful new information about an existing place, read its current note
   and merge in the new information, preserving the rest. `note` replaces
   the whole field; it does not append. Apply corrections to the relevant
   facts. This standing request covers those routine additions and updates;
   it does not ask for a schedule or for removal of older places.

**Home, work and school.** A `label` can be set only on a place with recorded
visits, using `update_place`. `add_place` does not accept `label`. For an
already-known home or workplace without visits, save it with a descriptive
name or note, such as "Home" or "My workplace". It remains a saved place;
this does not create a home/work label or fabricate a visit. Applying a
label before visits exist returns `409 not_visited`. Reconcile an existing
label only when the person's information supports changing it.

**A move or a corrected address.** `update_place` cannot change coordinates,
an address or provider ids. Save the correctly identified location, update
the old place's supported fields as appropriate, and remove the old saved
place only if the person's request calls for removal.

The prompt is a standing instruction, not a background job: future updates
depend on the agent receiving the information and retaining the instruction.
If an agent keeps a local copy, use the [incremental sync contract](#pages)
to refresh it, including removed ids, before relying on it.

## Tags and ratings

A saved place has any number of tags. Two are standard, and every person
has them: `favorite` (shown as Love: the person loves the place) and
`wantToGo` (they want to go). The others are the person's own, private:
friends the person shares places with see only whether a place is loved or
wanted, never the person's own tags. Read them all with `list_tags`
(`GET /tags`): the standard ones first (`standard: true`), then the
person's own, each with an id, a name and the original Google Maps list
name in `source` (`null` for a tag created in Anywhere, and for a standard
one). Use `create_tag` (`POST /tags`, with `name`) to create one,
`update_tag` (`PATCH /tags/{tag_id}`, with `name`) to rename it, and
`remove_tag` (`DELETE /tags/{tag_id}`) to delete it while keeping its
places. Names are trimmed, nonblank and at most 100 UTF-16 code units. The
standard tags are neither renamed nor removed (`409 standard_tag`). Tag
changes (created, renamed, deleted) do not have an Undo action.

Each saved place returns `rating` (1 to 5 stars, or `null`) and `tags`, its
tags' ids, the standard ones first. `add_place` takes `tags`; to change them
later, `update_place` accepts `add_tags` and `remove_tags`. These change
only the named tags, keeping the others: loving a place is adding
`favorite`. A place has at most 50 tags; an id cannot be in both arrays.
List a tag's places with `GET /places?tag=…`, the places without a tag with
`GET /places?status=saved`. Saving a venue already on the map gives that
place the request's tags besides its own.

For example, this PATCH body says the person loves a place they wanted to
go to, adds one of their tags, and rates it:

```json
{"rating": 5, "add_tags": ["favorite", "tag-to-add"], "remove_tags": ["wantToGo"]}
```

Use a real id from `GET /tags` in place of that placeholder. `rating: null`
clears a rating. These saved-place edits are recorded with Undo in the app.
A visited place must first be saved before it takes a note, rating or tags;
its home/work/school label can be changed without saving, but a label
change does not have an Undo action.

## Show map results on your phone

When a map would help the person find a place, compare nearby options or
explore an area, prefer Anywhere on their phone. Call `open_map`
(`POST /map/open`) with a camera centered on the relevant location and a
distance that frames the area. Anywhere sends a notification immediately;
the person taps it to open that view. This does not save or change places.

```bash
curl -sS --fail-with-body https://anywhere.fenn.chat/api/v1/map/open \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d '{
    "camera": {"lat": 48.854, "lng": 2.3326, "distance_m": 1500},
    "title": "Cafés around Saint-Germain",
    "message": "Tap to explore this area in Anywhere"
  }'
```

`camera` requires WGS84 `lat` and `lng`, and `distance_m` (100 to 30,000,000
meters). Optional `heading` (0 inclusive to 360 exclusive) and `pitch` (0 to
80 degrees) default to 0. The distance is the camera's distance, not a
search radius or bounding box. Choose a wider view for several nearby
options. Optional `title` (100 UTF-16 code units at most) and `message`
(500 at most) are shown in the notification; they default to the agent's
name and "Open this view in Anywhere".

An answer with `outcome: "sent"` and `notifications_sent` greater than 0
means the push service accepted the notification for at least one device;
it does not confirm delivery, a tap or that the app opened. With
`outcome: "unavailable"` and `notifications_sent: 0`, no usable push target
was available or the delivery attempts were exhausted. Tell the person the
view could not be sent. Notification
permission and an Anywhere version that supports map views are needed on
the phone. The API cannot force the app into the foreground.

Each call also counts against the daily change allowance. It sends its own
notification immediately, without adding saved-place activity or waiting
for the places notification summary. Use the same `Idempotency-Key` when
retrying the same request, so a lost
answer does not send another notification. To show saved recommendations as
pins, save them through the places API first, then send the camera view.
`open_map` does not create a route or attach temporary pins.

To show one place of the person's map, with its panel (its name, notes,
visits and tags, as when they tap its pin), pass its `place_id` (from
`list_places` or `get_place`) instead of, or with, a camera:

```bash
PLACE_ID=$(curl -sS --fail-with-body "https://anywhere.fenn.chat/api/v1/places?limit=1" \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" | jq -r '.places[0].id')
curl -sS --fail-with-body https://anywhere.fenn.chat/api/v1/map/open \
  -H "Authorization: Bearer $ANYWHERE_TOKEN" \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: $(uuidgen)" \
  -d "{\"place_id\": \"$PLACE_ID\", \"message\": \"Your café for tomorrow\"}"
```

Without a camera, the view looks at the place from 1 km overhead, and the
message defaults to "Open <the place's name> in Anywhere". The answer
echoes `place_id`. A place the map does not have is `404 place_not_found`,
and a request with neither `camera` nor `place_id` is `400 invalid_request`.
A version of Anywhere from before place views opens the camera instead.

## Getting a token

A personal token is made in the Anywhere app, by the person whose map it
opens:

1. In Anywhere, tap your avatar, then **Agents**.
2. Choose the agent you are connecting: **ChatGPT**, **Claude**, **Grok**,
   or another agent, which you name ("OpenClaw on my Mac"). The app tells
   you what each agent did by this name.
3. Copy the token. It starts with `anyw_pat_` and is shown once: Anywhere
   keeps only a hash of it.

A token opens the person's whole map: it reads and changes their places, and
reads their history, current location, available friends' locations and
mirrored calendar, and can send map-view notifications. There are no scopes yet.
Keep it out of code, logs, URLs and shared conversations; give it to the
agent the way the agent keeps secrets (its connector's credential, a secret
store, an environment variable), or use the app's private setup prompt as
described [above](#set-up-your-agent).

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
tags, history, location, friends or calendar, and tells them: a notification per agent, sent once the
agent pauses (a minute after its last call, at most three minutes after its
first), in words like "Grok added Café de Flore to your map" or "ChatGPT
read your history". The app lists each agent's activity for 90 days, and
saved-place changes can be undone there. Tag (created, renamed, deleted) and
home/work/school label changes do not have an Undo action. `GET /me` reads only the person's name and
time zone, and is not recorded.

So read what the task needs, change the map within the person's request
(including a standing request to maintain it), and prefer one call over
many: the person sees all of them.

## Limits

Per token:

| Limit | Value | Beyond it |
|---|---|---|
| Calls | 1,000 a day (UTC) and 60 a minute | `429 quota_exceeded`, with `Retry-After` in seconds |
| Place/tag changes and map-view notifications | 200 a day (UTC), shared allowance | `429 quota_exceeded` |
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
| 404 | `tag_not_found` | No such tag: neither a standard one nor one of the person's |
| 404 | `location_not_shared` | The person's phone has shared no location yet |
| 404 | `not_found` | No such path |
| 405 | `method_not_allowed` | The path takes other methods (`Allow` names them) |
| 409 | `not_saved` | A `visited` place takes a label and nothing else: save it first (`POST /places`) for other edits; only the person hides it |
| 409 | `not_visited` | Only a place the person has been to takes a label |
| 409 | `idempotency_conflict` | An `Idempotency-Key` used for another request |
| 409 | `too_many_tags` | The change would give a place more than 50 tags |
| 409 | `tag_deleted` | The tag created for this request was since deleted; use a new key for a new tag |
| 409 | `standard_tag` | The standard tags `favorite` and `wantToGo` are neither renamed nor removed |
| 413 | `payload_too_large` | The body is over 32 KiB |
| 429 | `quota_exceeded` | A limit is reached; wait `Retry-After` seconds when given |
| 429 | `too_many_attempts` | Too many unknown tokens from this address today |
| 500 | `internal` | Something went wrong on Anywhere's side; retry |
| 503 | `agents_api_disabled`, `quota_unavailable`, `lookup_failed`, `activity_unavailable`, `idempotency_unavailable`, `notification_unavailable` | Switched off for now, or a dependency is down; retry later |

Retry `429` after `Retry-After`, and `500` and `503` with a growing delay. Do
not retry other errors unchanged. Over MCP, a call's error is a tool result
marked `isError` whose text is this same JSON; a request without a valid
token is refused before any MCP, with HTTP `401`.

## Pages

Lists (`/places`, `/visits`, `/trips`, `/history`, a place's visits,
`/friends`, `/calendar/events`, `/tags`) come in
pages: `limit` items (50 by default, 200 at most), most recent first (or
nearest first with `near`; calendar events are soonest first, friends are
by id, tags the standard ones first, then the person's own by id), and a `next_cursor`. Pass it as `cursor`, with
the same filters, for the next page; it is `null` on the last. Every place of
the map, page after page (with [jq](https://jqlang.org)):

```bash
cursor=""
while :; do
  page=$(curl -sS --fail-with-body -G https://anywhere.fenn.chat/api/v1/places \
    -H "Authorization: Bearer $ANYWHERE_TOKEN" \
    --data-urlencode "limit=50" ${cursor:+--data-urlencode "cursor=$cursor"})
  jq -r '.places[] | "\(.name)\t\(.tags | join(","))"' <<<"$page"
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
- **Calendar times** use the same `[from, to)` overlap filter. With no range,
  all mirrored events are returned. `all_day: true` means `start` and `end`
  carry calendar dates at midnight UTC: `end` is the day after the last day.
  Keep those dates as days instead of converting them to another time zone.
  Timed events carry ordinary UTC instants. Locations are calendar text,
  not geocoded coordinates.
- **Coordinates** are WGS84 degrees: `lat`, `lng`. `bbox` is
  `min_lat,min_lng,max_lat,max_lng` (a `min_lng` east of `max_lng` crosses
  the antimeridian); `near` is `lat,lng`, with `radius_m` (1,000 m by
  default, 100,000 at most): nearest first, each with its `distance_m`.
- **Units**: durations in seconds (`duration_s`, `total_time_s`), distances
  in meters, speeds in meters per second.
- **Tags and labels**: `tags` lists a place's tag ids, `favorite` and
  `wantToGo` (the standard ones) first, `[]` for none; `label` is `home`,
  `work`, `school` or `null`;
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
| Grok | [mcp/grok.md](mcp/grok.md) |
| ChatGPT | [mcp/chatgpt.md](mcp/chatgpt.md) |
| Claude, Cursor, VS Code, OpenClaw and any other MCP client | [mcp/README.md](mcp/README.md) |

## Versions

`info.version` in [`openapi.json`](openapi.json) is the API's version, and
[CHANGELOG.md](CHANGELOG.md) lists its changes. Paths stay under `/v1` while
every change is compatible: new operations, new optional inputs, new fields
in answers (ignore the ones you do not know). A change that would break a
client gets a new path version, with one exception: 2.0.0, which moved
places from a status and lists to tags under the same `/v1` paths.

## License

The documentation, the OpenAPI document and the examples are under the
[MIT license](LICENSE). The API itself is a service of Anywhere, under its
[Terms of Use](https://anywhere.fenn.chat/terms).
