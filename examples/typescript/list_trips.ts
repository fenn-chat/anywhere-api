// GET /trips: the person's trips this past week (when, from where to where, how
// and how far; never a route), most recent first, page after page.
import { pages, placeName, type Trip } from "./anywhere.ts";

const weekAgo = new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString();
for await (const trip of pages<Trip>("/trips", "trips", { from: weekAgo })) {
  console.log(
    `${trip.start}  ${placeName(trip.origin)} to ${placeName(trip.destination)}  ` +
      `${trip.mode ?? "unknown mode"}, ${(trip.distance_m / 1000).toFixed(1)} km in ${Math.floor(trip.duration_s / 60)} min`,
  );
}
