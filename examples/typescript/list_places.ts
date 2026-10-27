// GET /places: every place the person loves (tagged favorite), page after
// page, most recently changed first. Other filters: q (words), tag (wantToGo or
// a tag of the person's own, from list_tags), status (saved: without a tag;
// unconfirmed), bbox, near and radius_m, updated_since.
import { pages, type Place } from "./anywhere.ts";

for await (const place of pages<Place>("/places", "places", { tag: "favorite", limit: 50 })) {
  console.log(`${place.name}  ${place.lat.toFixed(5)},${place.lng.toFixed(5)}  ${place.visit_count} visits  (id ${place.id})`);
}
