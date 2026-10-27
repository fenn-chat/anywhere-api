"""GET /calendar/events: all mirrored events, once each, soonest first."""

import json

from anywhere import pages

print(json.dumps(list(pages("/calendar/events", "events")), ensure_ascii=False, indent=2))
