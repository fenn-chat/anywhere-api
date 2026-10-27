"""GET /places: every place the person loves (tagged favorite), page after
page, most recently changed first. Other filters: q (words), tag (wantToGo or
a tag of the person's own, from list_tags), status (saved: without a tag;
unconfirmed), bbox, near and radius_m, updated_since."""

from anywhere import pages

for place in pages("/places", "places", {"tag": "favorite", "limit": 50}):
    print(f"{place['name']}  {place['lat']:.5f},{place['lng']:.5f}  "
          f"{place['visit_count']} visits  (id {place['id']})")
