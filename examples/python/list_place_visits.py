"""GET /places/{place_id}/visits: the latest 20 visits to a place, however old.
from and to give a range instead.

Usage: python3 list_place_visits.py <place_id>
"""

import sys

from anywhere import call, place_path

if len(sys.argv) != 2:
    sys.exit("usage: python3 list_place_visits.py <place_id>")
for visit in call("GET", place_path(sys.argv[1], "visits"), {"limit": 20})["visits"]:
    stay = f"{visit['duration_s'] // 60} min" if visit["duration_s"] is not None else "still there"
    print(f"{visit['arrival']}  {stay}")
