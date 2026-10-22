"""GET /trips: the person's trips this past week (when, from where to where, how
and how far; never a route), most recent first, page after page."""

from datetime import datetime, timedelta, timezone

from anywhere import pages, place_name

week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(timespec="seconds")
for trip in pages("/trips", "trips", {"from": week_ago}):
    print(f"{trip['start']}  {place_name(trip['origin'])} to {place_name(trip['destination'])}  "
          f"{trip['mode'] or 'unknown mode'}, {trip['distance_m'] / 1000:.1f} km in {trip['duration_s'] // 60} min")
