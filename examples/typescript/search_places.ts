// Resolve a venue before saving it; confirm ambiguous candidates with the person.
import { call, type PlaceSearchResult } from "./anywhere.ts";
const result = await call<PlaceSearchResult>("GET", "/search/places", { query: { query: "Café de Flore Paris", limit: 5 } });
for (const place of result.places) console.log(`${place.name}: ${place.lat}, ${place.lng}; ${place.address ?? "No address"}`);
