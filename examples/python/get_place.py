"""GET /places/{place_id}: one place, with its status, label, note, origin and
visit stats.

Usage: python3 get_place.py <place_id>   (ids come from list_places)
"""

import sys

from anywhere import call, place_path

if len(sys.argv) != 2:
    sys.exit("usage: python3 get_place.py <place_id>")
place = call("GET", place_path(sys.argv[1]))
print(place["name"] or "A place without a name yet")
print(f"  {place['kind']}, list {place['status'] or 'none'}, label {place['label'] or 'none'}, "
      f"put there by {place['origin'].get('name', place['origin']['kind'])}")
print(f"  {place['visit_count']} visits, {place['total_time_s'] // 3600} h in all, last {place['last_visit'] or 'never'}")
if place["note"]:
    print(f"  Note: {place['note']}")
