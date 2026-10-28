"""Resolve a venue before saving it; confirm ambiguous candidates with the person."""
from anywhere import call
result = call("GET", "/search/places", query={"query": "Café de Flore Paris", "limit": 5})
for place in result["places"]:
    print(f"{place['name']}: {place['lat']}, {place['lng']}; {place.get('address', 'No address')}")
