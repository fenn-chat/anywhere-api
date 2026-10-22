"""GET /places: every favorite on the person's map, page after page, most
recently changed first. Other filters: q (words), status (favorite, wantToGo,
saved, unconfirmed), bbox, near and radius_m, updated_since."""

from anywhere import pages

for place in pages("/places", "places", {"status": "favorite", "limit": 50}):
    print(f"{place['name']}  {place['lat']:.5f},{place['lng']:.5f}  "
          f"{place['visit_count']} visits  (id {place['id']})")
