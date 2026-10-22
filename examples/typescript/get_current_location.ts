// GET /location: where the person is, as their phone last reported it: at a
// place since a time, or moving (the trip, its destination and arrival).
import { AnywhereError, call, placeName, type Location } from "./anywhere.ts";

let location: Location | null = null;
try {
  location = await call<Location>("GET", "/location");
} catch (error) {
  if (!(error instanceof AnywhereError && error.code === "location_not_shared")) throw error;
  console.log("The person's phone has not shared a location yet.");
}
if (location?.state === "at_place") {
  console.log(`At ${placeName(location.place)} since ${location.since}`);
} else if (location?.state === "moving" && location.trip) {
  console.log(`${location.trip.mode ?? "Moving"} toward ${placeName(location.trip.destination)}, arriving around ${location.trip.eta ?? "an unknown time"}`);
} else if (location) {
  console.log(`Near ${placeName(location.area)}`);
}
if (location?.coordinate) {
  const fix = location.coordinate;
  console.log(`Last fix ${fix.lat.toFixed(5)},${fix.lng.toFixed(5)} within ${fix.accuracy_m.toFixed(0)} m at ${fix.at}`);
}
