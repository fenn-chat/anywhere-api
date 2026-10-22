// PATCH /places/{place_id}: moves a saved place to the favorites, with a note.
// Give only what changes: status, note, name, or label (home, work, school: the
// one change a visited place takes).
// Usage: node update_place.ts <place_id>
import { call, placePath, type WriteResult } from "./anywhere.ts";

const [placeId] = process.argv.slice(2);
if (!placeId) throw new Error("usage: node update_place.ts <place_id>");
const result = await call<WriteResult>("PATCH", placePath(placeId), {
  body: { status: "favorite", note: "Go early: the terrace fills up by ten" },
});
console.log(`${result.outcome}: ${result.place.name}, ${result.place.status}, note: ${result.place.note}`);
