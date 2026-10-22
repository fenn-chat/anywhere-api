# Changelog

The agent API's changes, newest first. The version is `info.version` in
[`openapi.json`](openapi.json); paths stay under `/v1` while every change is
compatible.

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
