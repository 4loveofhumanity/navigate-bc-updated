"""Official Pugliese College academic-calendar snapshot service."""

import json
import os

import micro


BASE = os.path.dirname(os.path.abspath(__file__))
CALENDAR_PATH = os.path.normpath(
    os.path.join(BASE, "..", "mobile", "src", "data", "academic-calendar.json")
)


def terms():
    with open(CALENDAR_PATH, encoding="utf-8") as calendar_file:
        return json.load(calendar_file)


if __name__ == "__main__":
    micro.run("academic-calendar-service", 8647, {"/terms": terms})
