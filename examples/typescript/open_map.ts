// POST /map/open: sends a notification opening a camera view when tapped.
// A sent outcome means accepted by the push service, not that the app opened.
// Retry a lost answer with the same Idempotency-Key, never a new one.
import { call, type MapOpenResult } from "./anywhere.ts";

const result = await call<MapOpenResult>("POST", "/map/open", {
  body: {
    camera: { lat: 48.854, lng: 2.3326, distance_m: 1500 },
    title: "Cafés around Saint-Germain",
    message: "Tap to explore this area in Anywhere",
  },
  headers: { "Idempotency-Key": crypto.randomUUID() },
});
console.log(`${result.outcome}: ${result.notifications_sent} notification(s), camera ${result.camera.lat},${result.camera.lng} at ${result.camera.distance_m} m`);
