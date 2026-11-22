"""Reassign one visit from list_visits to a place from list_places."""

import sys
from urllib.parse import quote

from anywhere import call, place_name

if len(sys.argv) != 3:
    sys.exit("usage: python3 correct_visit.py <visit_id> <destination_place_id>")
visit_id, place_id = sys.argv[1:]
visit = call("PATCH", f"/visits/{quote(visit_id, safe='')}", body={"place_id": place_id})
print(f"{visit['id']}  {visit['arrival']}  {place_name(visit['place'])}")
