// GET /places/{place_id}: one place, with its tags, label, note, origin and
// visit stats.
// Usage: node get_place.ts <place_id>   (ids come from list_places)
import { call, placePath, type Place } from "./anywhere.ts";

const [placeId] = process.argv.slice(2);
if (!placeId) throw new Error("usage: node get_place.ts <place_id>");
const place = await call<Place>("GET", placePath(placeId));
console.log(place.name ?? "A place without a name yet");
console.log(
  `  ${place.kind}, tags ${place.tags.join(", ") || "none"}, label ${place.label ?? "none"}, ` +
    `put there by ${place.origin.name ?? place.origin.kind}`,
);
console.log(`  ${place.visit_count} visits, ${Math.floor(place.total_time_s / 3600)} h in all, last ${place.last_visit ?? "never"}`);
if (place.note) console.log(`  Note: ${place.note}`);
