// Draw a temporary waterfront walk.
import { call, type PolylineWriteResult } from "./anywhere.ts";

const result = await call<PolylineWriteResult>("POST", "/polylines", {
  body: {
    name: "Waterfront walk",
    points: [
      { lat: 37.7955, lng: -122.3937 },
      { lat: 37.7973, lng: -122.3951 },
      { lat: 37.7988, lng: -122.3966 },
    ],
    color: "teal",
  },
  headers: { "Idempotency-Key": process.env.ANYWHERE_IDEMPOTENCY_KEY ?? crypto.randomUUID() },
});
console.log(JSON.stringify(result, null, 2));
