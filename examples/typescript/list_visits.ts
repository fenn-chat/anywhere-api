// GET /visits: the person's stays at places this past week, most recent first,
// page after page. place_id or bbox narrow them to a place or an area.
import { pages, placeName, type Visit } from "./anywhere.ts";

const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
for await (const visit of pages<Visit>("/visits", "visits", { from: weekAgo })) {
  const stay = visit.duration_s === null ? "still there" : `${Math.floor(visit.duration_s / 60)} min`;
  console.log(`${visit.arrival}  ${placeName(visit.place)}  ${stay}`);
}
