// Rename a line and preserve its expiry.
import { call, type PolylineWriteResult } from "./anywhere.ts";

const id = process.argv[2];
if (!id) throw new Error("usage: node update_polyline.ts <polyline_id>");

const result = await call<PolylineWriteResult>("PATCH", `/polylines/${encodeURIComponent(id)}`, {
  body: {"name": "Evening waterfront walk"},
});
console.log(JSON.stringify(result, null, 2));
