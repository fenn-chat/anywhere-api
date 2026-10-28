/**
 * A small client for the Anywhere agent API, on Node.js alone (22.18 or later,
 * which runs TypeScript as is: `node get_me.ts`).
 *
 * ANYWHERE_TOKEN holds the personal token (anyw_pat_…, made in the Anywhere
 * app); ANYWHERE_API_URL, if set, replaces the API's address.
 */

export const API_URL = process.env.ANYWHERE_API_URL ?? "https://anywhere.fenn.chat/api/v1";

/** An error answer: its HTTP status, and the API's code and message. */
export class AnywhereError extends Error {
  readonly status: number;
  readonly code: string;

  constructor(status: number, code: string, message: string) {
    super(`${status} ${code}: ${message}`);
    this.status = status;
    this.code = code;
  }
}

export type Query = Record<string, string | number>;

export interface CallOptions {
  query?: Query;
  body?: unknown;
  headers?: Record<string, string>;
}

/** Calls the API: its JSON answer, or an AnywhereError. */
export async function call<Answer>(method: string, path: string, { query = {}, body, headers = {} }: CallOptions = {}): Promise<Answer> {
  const token = process.env.ANYWHERE_TOKEN;
  if (!token) throw new Error("Set ANYWHERE_TOKEN to your personal token (anyw_pat_…)");
  const url = new URL(API_URL + path);
  for (const [name, value] of Object.entries(query)) url.searchParams.set(name, String(value));
  const response = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}`, ...(body === undefined ? {} : { "Content-Type": "application/json" }), ...headers },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const text = await response.text();
  if (!response.ok) {
    let error = { code: "http_error", message: response.statusText };
    try {
      error = JSON.parse(text).error ?? error;
    } catch {
      // Not the API's JSON (a proxy's page): its status says enough.
    }
    throw new AnywhereError(response.status, error.code, error.message);
  }
  return JSON.parse(text) as Answer;
}

type Page = { next_cursor: string | null } & Record<string, unknown>;

/** Every item of a list, page after page, following next_cursor. */
export async function* pages<Item>(path: string, key: string, query: Query = {}): AsyncGenerator<Item> {
  let cursor: string | null = null;
  do {
    const page: Page = await call<Page>("GET", path, { query: cursor ? { ...query, cursor } : query });
    yield* page[key] as Item[];
    cursor = page.next_cursor;
  } while (cursor);
}

/** The path of a place (and what follows it), its id escaped. */
export function placePath(placeId: string, ...rest: string[]): string {
  return ["/places", encodeURIComponent(placeId), ...rest].join("/");
}

/** A place as a visit, a trip or the location names it: its name, else its label. */
export function placeName(place: { name: string | null; label: Label | null } | null): string {
  if (!place) return "somewhere";
  return place.name ?? place.label ?? "an unnamed place";
}

// The answers, as openapi.json describes them.

export type Label = "home" | "work" | "school";

export interface Me {
  name: string | null;
  time_zone: string | null;
  agent: { grant_id: string; agent: "chatgpt" | "claude" | "grok" | "other"; name: string; connected_at: string; last_used_at: string | null };
  limits: { calls_per_day: number; calls_per_minute: number; map_changes_per_day: number };
  usage: { calls_today: number; map_changes_today: number };
}

export interface Place {
  id: string;
  kind: "saved" | "visited";
  name: string | null;
  lat: number;
  lng: number;
  address: string | null;
  category: string | null;
  provider_ids: string[];
  /** The standard favorite and wantToGo first, then the person's own (list_tags names them). */
  tags: string[];
  rating: number | null;
  unconfirmed: boolean;
  label: Label | null;
  note: string | null;
  origin: { kind: "me" | "agent" | "chat" | "screenshot" | "import" | "visit"; name?: string };
  visit_count: number;
  total_time_s: number;
  first_visit: string | null;
  last_visit: string | null;
  nights: number;
  distance_m?: number;
  created_at: string | null;
  updated_at: string;
}

export interface RemovedPlace {
  id: string;
  removed_at: string;
}

export interface PlacePage {
  places: Place[];
  removed: RemovedPlace[];
  next_cursor: string | null;
}

export interface WriteResult {
  outcome: "created" | "merged" | "updated" | "unchanged" | "removed";
  place: Place;
  change_id: string | null;
}

export interface MapOpenResult {
  outcome: "sent" | "unavailable";
  camera: { lat: number; lng: number; distance_m: number; heading: number; pitch: number };
  notifications_sent: number;
}

export interface Friend {
  id: string;
  name: string | null;
  shares_location: boolean;
  location: Location | null;
}

export interface FriendPage {
  friends: Friend[];
  next_cursor: string | null;
}

export interface CalendarEvent {
  id: string;
  provider: "apple" | "google";
  title: string | null;
  location: string | null;
  notes: string | null;
  start: string;
  end: string;
  all_day: boolean;
  availability: "busy" | "free" | "tentative" | "unavailable";
  calendar: { id: string; title: string | null; color: string | null };
  link: string | null;
  updated_at: string;
}

export interface CalendarPage {
  events: CalendarEvent[];
  next_cursor: string | null;
}

export interface PlaceTag {
  id: string;
  name: string;
  /** favorite and wantToGo, which every person has: neither renamed nor removed, without a source or times. */
  standard: boolean;
  source: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export interface TagPage {
  tags: PlaceTag[];
  next_cursor: string | null;
}

export interface TagWriteResult {
  outcome: "created" | "updated" | "unchanged" | "removed";
  tag: PlaceTag;
}

export interface PlaceRef {
  id: string | null;
  name: string | null;
  label: Label | null;
  category: string | null;
  lat: number;
  lng: number;
}

export interface Visit {
  id: string;
  place: PlaceRef | null;
  arrival: string;
  departure: string | null;
  duration_s: number | null;
  updated_at: string;
}

export interface Trip {
  id: string;
  start: string;
  end: string;
  duration_s: number;
  origin: PlaceRef | null;
  destination: PlaceRef | null;
  mode: string | null;
  distance_m: number;
  stops: Array<{ start: string; end: string; place: PlaceRef | null }>;
  updated_at: string;
}

export type HistoryItem = (Visit & { type: "visit" }) | (Trip & { type: "trip" });

export interface NamedPlace {
  label: Label | null;
  name: string | null;
  category: string | null;
}

export interface Location {
  state: "at_place" | "moving" | "unknown";
  since: string | null;
  place: NamedPlace | null;
  trip: {
    id: string;
    mode: string | null;
    speed_mps: number | null;
    destination: NamedPlace | null;
    eta: string | null;
    eta_earliest: string | null;
    eta_latest: string | null;
  } | null;
  area: NamedPlace | null;
  coordinate: { lat: number; lng: number; accuracy_m: number; at: string } | null;
  permission: "always" | "when_in_use" | "denied" | "not_determined";
  time_zone: string | null;
  updated_at: string;
}
