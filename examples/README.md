# Examples

One example per operation of the API, in three languages:

- **curl** (`curl/`): bash and curl 7.76 or later;
- **Python** (`python/`): Python 3.9 or later, its standard library alone;
- **TypeScript** (`typescript/`): Node.js 22.18 or later, which runs
  TypeScript as is, without packages.

Each reads the personal token from `ANYWHERE_TOKEN`
([getting a token](../README.md#getting-a-token)). From this folder:

```shell
export ANYWHERE_TOKEN=anyw_pat_…
./curl/get_me.sh
python3 python/get_me.py
node typescript/get_me.ts
```

The ones for one place take its id, which `list_places` gives:
`./curl/get_place.sh <place_id>`, `python3 python/get_place.py <place_id>`,
`node typescript/get_place.ts <place_id>`; the same for `update_place`,
`remove_place` and `list_place_visits`. The curl examples for visits, trips
and history take an optional range: `./curl/list_visits.sh 2026-10-01 2026-10-08`.

`add_place`, `update_place` and `remove_place` change the map for real: the
person is told, and can undo each change in the app.

The Python and TypeScript examples share a small client,
[`python/anywhere.py`](python/anywhere.py) and
[`typescript/anywhere.ts`](typescript/anywhere.ts): the token's header,
errors as `AnywhereError` with the API's code, pages followed through
`next_cursor`, and, in TypeScript, the answers' types. Copy it into your own
project as a start.

`ANYWHERE_API_URL`, if set, replaces the API's address
(`https://anywhere.fenn.chat/api/v1`). Every example here runs against the
API in Anywhere's own tests.
