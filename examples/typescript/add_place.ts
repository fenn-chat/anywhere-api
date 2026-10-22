// POST /places: saves a venue to the person's want-to-go list, with a note.
// The outcome is created for a new place, merged when the venue was on the map
// already. The Idempotency-Key makes a retry safe: retry with the same key,
// never a new one.
import { call, type WriteResult } from "./anywhere.ts";

const result = await call<WriteResult>("POST", "/places", {
  body: {
    name: "Café de Flore",
    lat: 48.854,
    lng: 2.3326,
    address: "172 Boulevard Saint-Germain, 75006 Paris, France",
    category: "cafe",
    status: "wantToGo",
    note: "Hot chocolate on the terrace",
  },
  headers: { "Idempotency-Key": crypto.randomUUID() },
});
console.log(`${result.outcome}: ${result.place.name}, ${result.place.status} (id ${result.place.id})`);
