"""PATCH /places/{place_id}: the person loves a saved place now: it takes the
favorite tag in place of wantToGo, five stars and a note.

Give only what changes: add_tags, remove_tags (its other tags stay), rating,
note, name, or label (home, work, school: the one change a visited place takes).

Usage: python3 update_place.py <place_id>
"""

import sys

from anywhere import call, place_path

if len(sys.argv) != 2:
    sys.exit("usage: python3 update_place.py <place_id>")
result = call("PATCH", place_path(sys.argv[1]), body={"add_tags": ["favorite"], "remove_tags": ["wantToGo"], "rating": 5, "note": "Go early: the terrace fills up by ten"})
place = result["place"]
print(f"{result['outcome']}: {place['name']}, tagged {', '.join(place['tags']) or 'nothing'}, note: {place['note']}")
