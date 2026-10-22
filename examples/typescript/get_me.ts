// GET /me: who the person is (name, time zone), this token's agent, its limits
// and what it used today.
import { call, type Me } from "./anywhere.ts";

const me = await call<Me>("GET", "/me");
console.log(`${me.name ?? "No name yet"}, in ${me.time_zone ?? "an unknown time zone"}`);
console.log(
  `${me.agent.name}: ${me.usage.calls_today} of ${me.limits.calls_per_day} calls today, ` +
    `${me.usage.map_changes_today} of ${me.limits.map_changes_per_day} changes to the map`,
);
