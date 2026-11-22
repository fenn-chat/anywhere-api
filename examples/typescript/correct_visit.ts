// Reassign one visit from list_visits to a place from list_places.
import { call, placeName, type Visit } from "./anywhere.ts";

const [visitId, placeId] = process.argv.slice(2);
if (!visitId || !placeId) throw new Error("usage: node correct_visit.ts <visit_id> <destination_place_id>");
const visit = await call<Visit>("PATCH", `/visits/${encodeURIComponent(visitId)}`, { body: { place_id: placeId } });
console.log(`${visit.id}  ${visit.arrival}  ${placeName(visit.place)}`);
