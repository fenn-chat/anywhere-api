"""GET /visits: the person's stays at places this past week, most recent
first, page after page. place_id or bbox narrow them to a place or an area."""

from datetime import datetime, timedelta, timezone

from anywhere import pages, place_name

week_ago = (datetime.now(timezone.utc) - timedelta(days=7)).isoformat(timespec="seconds")
for visit in pages("/visits", "visits", {"from": week_ago}):
    stay = f"{visit['duration_s'] // 60} min" if visit["duration_s"] is not None else "still there"
    print(f"{visit['arrival']}  {place_name(visit['place'])}  {stay}")
