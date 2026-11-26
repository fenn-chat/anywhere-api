// Delete a line and keep its linked places.
import { call, type PolylineRemoval } from "./anywhere.ts";

const id = process.argv[2];
if (!id) throw new Error("usage: node remove_polyline.ts <polyline_id>");

const result = await call<PolylineRemoval>("DELETE", `/polylines/${encodeURIComponent(id)}`);
console.log(JSON.stringify(result, null, 2));
