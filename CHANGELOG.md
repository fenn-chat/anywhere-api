# Changelog

The agent API's changes, newest first. The version is `info.version` in
[`openapi.json`](openapi.json); paths stay under `/v1` while every change is
compatible.

## 2.1.0

- **A place on the phone**: `open_map` (`POST /map/open`) takes `place_id`, a
  place of the person's map: the notification opens that place's panel on
  the map, as a tap on its pin does. `camera` becomes optional with it (the
  place from 1 km overhead by default); one of the two is required. The
  answer echoes `place_id`; an unknown place is `404 place_not_found`.

## 2.0.0

Places move from a status and lists to tags. This change is not compatible,
and keeps the `/v1` paths: a client written for 1.x must follow it.

- **Tags**: a saved place has `tags`, its tag ids, in place of `status` and
  `list_ids`. Two tags are standard, and every person has them: `favorite`
  (shown as Love) and `wantToGo`; the others are the person's own, private.
- **Places**: `list_places` filters by `tag` (a tag id) in place of
  `list_id` and the `favorite` and `wantToGo` values of `status`, which keeps
  `saved` (now: without a tag) and `unconfirmed`. `add_place` takes `tags` in
  place of `status`; `update_place` takes `add_tags` and `remove_tags` in
  place of `status`, `add_to_lists` and `remove_from_lists`: loving a place
  is adding `favorite`. A venue saved again keeps its tags and takes the
  request's (`outcome: merged`), in place of the stronger status.
- **Tag operations**: `GET /tags`, `POST /tags`, `PATCH /tags/{tag_id}` and
  `DELETE /tags/{tag_id}` (MCP `list_tags`, `create_tag`, `update_tag`,
  `remove_tag`) replace the list operations. Listing includes the standard
  tags first (`standard: true`), which are neither renamed nor removed
  (`409 standard_tag`).
- **Errors**: `tag_not_found`, `tag_deleted` and `too_many_tags` replace
  `list_not_found`, `list_deleted` and `too_many_lists`.

## 1.2.0

- **Agents by name**: a connection's `agent` is `chatgpt`, `claude`, `grok`
  or `other`. Claude now has its own name; Meta Muse is no longer one, and
  its tokens no longer connect.

## 1.1.0

- **Phone map views**: `POST /map/open` and MCP `open_map` send a notification
  that opens Anywhere at a specified camera when the person taps it. The
  response distinguishes a push accepted for sending from an unavailable
  device. An `Idempotency-Key` makes retries safe.
- Documented how agents add already-known important places (including home
  and work), maintain place notes as they learn new information, and prefer
  map views on the person's phone.
- **Friends**: `GET /friends` and MCP `list_friends` read active friends and
  the current locations they share with the person, respecting sharing
  revocations and blocks.
- **Calendar**: `GET /calendar/events` and MCP `list_calendar_events` read
  the owner's mirrored calendar events, deduplicated and paged, with time
  ranges, notes, location text and availability. Calendars remain read-only.
- **Map editing**: read and change place ratings and custom list membership;
  list, create, rename and delete custom lists; filter places by `list_id`.

## 1.0.0

The first version: REST at `https://anywhere.fenn.chat/api/v1` and MCP at
`https://anywhere.fenn.chat/mcp`, over one contract, with one personal token
made in the app.

- **Places**: search the map (`status`, `q`, `bbox`, `near` and `radius_m`,
  `updated_since` with removed ids), read a place, save one (with an
  `Idempotency-Key`, never twice for the same venue), change its status,
  note, name or label, take it off the map.
- **History**: every visit and trip, in ranges `[from, to)`, by place or box,
  and the two as one timeline.
- **Location**: where the person is now.
- **Person**: name, time zone, the token's limits and usage.
- Limits per token: 1,000 calls a day, 60 a minute, 200 changes to the map a
  day. Cursor pages of up to 200 items; ETags on every read.
- Every call that reads or changes the person's places, history or location
  is recorded and told to them; every change can be undone in the app.
