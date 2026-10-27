// GET /calendar/events: all mirrored events, once each, soonest first.
import { pages, type CalendarEvent } from "./anywhere.ts";

const events: CalendarEvent[] = [];
for await (const event of pages<CalendarEvent>("/calendar/events", "events")) events.push(event);
console.log(JSON.stringify(events, null, 2));
