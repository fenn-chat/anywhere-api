// GET /history: the person's last 24 hours as one timeline of visits and trips,
// most recent first, page after page.
import { pages, placeName, type HistoryItem } from "./anywhere.ts";

const dayAgo = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
for await (const item of pages<HistoryItem>("/history", "items", { from: dayAgo })) {
  if (item.type === "visit") console.log(`${item.arrival}  at ${placeName(item.place)}`);
  else console.log(`${item.start}  ${item.mode ?? "trip"} from ${placeName(item.origin)} to ${placeName(item.destination)}`);
}
