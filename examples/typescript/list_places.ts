// GET /places: every favorite on the person's map, page after page, most
// recently changed first. Other filters: q (words), status (favorite, wantToGo,
// saved, unconfirmed), bbox, near and radius_m, updated_since.
import { pages, type Place } from "./anywhere.ts";

for await (const place of pages<Place>("/places", "places", { status: "favorite", limit: 50 })) {
  console.log(`${place.name}  ${place.lat.toFixed(5)},${place.lng.toFixed(5)}  ${place.visit_count} visits  (id ${place.id})`);
}
