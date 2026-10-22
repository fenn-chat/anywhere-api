"""GET /me: who the person is (name, time zone), this token's agent, its limits
and what it used today."""

from anywhere import call

me = call("GET", "/me")
print(f"{me['name'] or 'No name yet'}, in {me['time_zone'] or 'an unknown time zone'}")
usage, limits = me["usage"], me["limits"]
print(f"{me['agent']['name']}: {usage['calls_today']} of {limits['calls_per_day']} calls today, "
      f"{usage['map_changes_today']} of {limits['map_changes_per_day']} changes to the map")
