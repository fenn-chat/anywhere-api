"""A small client for the Anywhere agent API, on Python's standard library alone (3.9+).

ANYWHERE_TOKEN holds the personal token (anyw_pat_…, made in the Anywhere app);
ANYWHERE_API_URL, if set, replaces the API's address.
"""

import json
import os
import sys
import urllib.error
import urllib.parse
import urllib.request

API_URL = os.environ.get("ANYWHERE_API_URL", "https://anywhere.fenn.chat/api/v1")


class AnywhereError(Exception):
    """An error answer: its HTTP status, and the API's code and message."""

    def __init__(self, status, code, message):
        super().__init__(f"{status} {code}: {message}")
        self.status = status
        self.code = code


def call(method, path, query=None, body=None, headers=None):
    """Calls the API: its JSON answer, or an AnywhereError."""
    token = os.environ.get("ANYWHERE_TOKEN")
    if not token:
        sys.exit("Set ANYWHERE_TOKEN to your personal token (anyw_pat_…)")
    url = API_URL + path
    if query:
        url += "?" + urllib.parse.urlencode(query)
    request = urllib.request.Request(url, method=method, headers={"Authorization": f"Bearer {token}", **(headers or {})})
    if body is not None:
        request.data = json.dumps(body).encode()
        request.add_header("Content-Type", "application/json")
    try:
        with urllib.request.urlopen(request, timeout=30) as response:
            return json.load(response)
    except urllib.error.HTTPError as error:
        try:
            details = json.load(error)["error"]
        except (ValueError, KeyError, TypeError):  # Not the API's JSON: a proxy's page.
            details = {"code": "http_error", "message": error.reason}
        raise AnywhereError(error.code, details["code"], details["message"]) from None


def pages(path, key, query=None):
    """Every item of a list, page after page, following next_cursor."""
    query = dict(query or {})
    while True:
        page = call("GET", path, query)
        yield from page[key]
        if page["next_cursor"] is None:
            return
        query["cursor"] = page["next_cursor"]


def place_path(place_id, *rest):
    """The path of a place (and what follows it), its id escaped."""
    return "/".join(["/places", urllib.parse.quote(place_id, safe=""), *rest])


def place_name(place):
    """A place as a visit, a trip or the location names it: its name, else its label."""
    if place is None:
        return "somewhere"
    return place["name"] or place["label"] or "an unnamed place"
