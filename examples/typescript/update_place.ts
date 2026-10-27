// PATCH /places/{place_id}: the person loves a saved place now: it takes the
// favorite tag in place of wantToGo, five stars and a note. Give only what
// changes: add_tags, remove_tags (its other tags stay), rating, note, name, or
// label (home, work, school: the one change a visited place takes).
// Usage: node update_place.ts <place_id>
import { call, placePath, type WriteResult } from "./anywhere.ts";

const [placeId] = process.argv.slice(2);
if (!placeId) throw new Error("usage: node update_place.ts <place_id>");
const result = await call<WriteResult>("PATCH", placePath(placeId), {
  body: { add_tags: ["favorite"], remove_tags: ["wantToGo"], rating: 5, note: "Go early: the terrace fills up by ten" },
});
console.log(`${result.outcome}: ${result.place.name}, tagged ${result.place.tags.join(", ") || "nothing"}, note: ${result.place.note}`);
