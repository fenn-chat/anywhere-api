// GET /friends: all friends and the current locations they share with this person.
import { pages, type Friend } from "./anywhere.ts";

const friends: Friend[] = [];
for await (const friend of pages<Friend>("/friends", "friends")) friends.push(friend);
console.log(JSON.stringify(friends, null, 2));
