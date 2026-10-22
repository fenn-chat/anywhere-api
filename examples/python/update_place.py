"""PATCH /places/{place_id}: moves a saved place to the favorites, with a note.

Give only what changes: status, note, name, or label (home, work, school: the
one change a visited place takes).

Usage: python3 update_place.py <place_id>
"""

import sys

from anywhere import call, place_path

if len(sys.argv) != 2:
    sys.exit("usage: python3 update_place.py <place_id>")
result = call("PATCH", place_path(sys.argv[1]), body={"status": "favorite", "note": "Go early: the terrace fills up by ten"})
place = result["place"]
print(f"{result['outcome']}: {place['name']}, {place['status']}, note: {place['note']}")
