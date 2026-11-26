// List active lines, newest change first.
import { call, type PolylinePage } from "./anywhere.ts";

const result = await call<PolylinePage>("GET", "/polylines");
console.log(JSON.stringify(result, null, 2));
