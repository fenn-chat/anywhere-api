"""GET /location: where the person is, as their phone last reported it: at a
place since a time, or moving (the trip, its destination and arrival)."""

from anywhere import AnywhereError, call, place_name

try:
    location = call("GET", "/location")
except AnywhereError as error:
    if error.code != "location_not_shared":
        raise
    print("The person's phone has not shared a location yet.")
else:
    if location["state"] == "at_place":
        print(f"At {place_name(location['place'])} since {location['since']}")
    elif location["state"] == "moving":
        trip = location["trip"]
        print(f"{trip['mode'] or 'Moving'} toward {place_name(trip['destination'])}, arriving around {trip['eta'] or 'an unknown time'}")
    else:
        print(f"Near {place_name(location['area'])}")
    if location["coordinate"]:
        fix = location["coordinate"]
        print(f"Last fix {fix['lat']:.5f},{fix['lng']:.5f} within {fix['accuracy_m']:.0f} m at {fix['at']}")
