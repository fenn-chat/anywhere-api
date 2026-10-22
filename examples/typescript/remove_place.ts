// DELETE /places/{place_id}: takes a saved place off the person's map. They are
// told, and can undo it in the app.
// Usage: node remove_place.ts <place_id>
import { call, placePath, type WriteResult } from "./anywhere.ts";

const [placeId] = process.argv.slice(2);
if (!placeId) throw new Error("usage: node remove_place.ts <place_id>");
const result = await call<WriteResult>("DELETE", placePath(placeId));
console.log(`${result.outcome}: ${result.place.name} (change ${result.change_id}, undoable in the app)`);
