"""GET /history: the person's last 24 hours as one timeline of visits and trips,
most recent first, page after page."""

from datetime import datetime, timedelta, timezone

from anywhere import pages, place_name

day_ago = (datetime.now(timezone.utc) - timedelta(days=1)).isoformat(timespec="seconds")
for item in pages("/history", "items", {"from": day_ago}):
    if item["type"] == "visit":
        print(f"{item['arrival']}  at {place_name(item['place'])}")
    else:
        print(f"{item['start']}  {item['mode'] or 'trip'} from {place_name(item['origin'])} to {place_name(item['destination'])}")
