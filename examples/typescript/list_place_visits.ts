// GET /places/{place_id}/visits: the latest 20 visits to a place, however old.
// from and to give a range instead.
// Usage: node list_place_visits.ts <place_id>
import { call, placePath, type Visit } from "./anywhere.ts";

const [placeId] = process.argv.slice(2);
if (!placeId) throw new Error("usage: node list_place_visits.ts <place_id>");
const { visits } = await call<{ visits: Visit[] }>("GET", placePath(placeId, "visits"), { query: { limit: 20 } });
for (const visit of visits) {
  const stay = visit.duration_s === null ? "still there" : `${Math.floor(visit.duration_s / 60)} min`;
  console.log(`${visit.arrival}  ${stay}`);
}
