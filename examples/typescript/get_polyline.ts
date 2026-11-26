// Read one active line with its points.
import { call, type Polyline } from "./anywhere.ts";

const id = process.argv[2];
if (!id) throw new Error("usage: node get_polyline.ts <polyline_id>");

const result = await call<Polyline>("GET", `/polylines/${encodeURIComponent(id)}`);
console.log(JSON.stringify(result, null, 2));
