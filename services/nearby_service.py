"""Nearby microservice — builds a proximity/companionship map from simulated
nearby-device encounters plus location tags.

Privacy note: a real build MUST be strictly opt-in and should aggregate only
consented peers. This demo returns synthetic data and exposes the consent
state the client is expected to honor before rendering anything.
"""
import micro

# Simulated encounter roll-up. In production each record would be derived from
# consented BLE proximity beacons + coarse location, aggregated on-device.
CONTACTS = [
    {"name": "Maya R.", "initials": "MR", "minutes": 860, "proximity": "near",
     "nearbyNow": True, "lastSeen": "now",
     "places": [{"name": "Chemistry Lab · IH 1141", "minutes": 540},
                {"name": "Library · 3rd Floor", "minutes": 210},
                {"name": "West Quad", "minutes": 110}]},
    {"name": "Jordan T.", "initials": "JT", "minutes": 545, "proximity": "near",
     "nearbyNow": True, "lastSeen": "now",
     "places": [{"name": "Library · 3rd Floor", "minutes": 300},
                {"name": "Student Center", "minutes": 145},
                {"name": "West Quad", "minutes": 100}]},
    {"name": "Priya S.", "initials": "PS", "minutes": 460, "proximity": "mid",
     "nearbyNow": False, "lastSeen": "12m ago",
     "places": [{"name": "Boylan Hall · Lecture 219", "minutes": 320},
                {"name": "Cafeteria", "minutes": 90},
                {"name": "Quad", "minutes": 50}]},
    {"name": "Devon M.", "initials": "DM", "minutes": 315, "proximity": "mid",
     "nearbyNow": False, "lastSeen": "1h ago",
     "places": [{"name": "Student Center", "minutes": 180},
                {"name": "Quad", "minutes": 90},
                {"name": "Gym", "minutes": 45}]},
    {"name": "Alex K.", "initials": "AK", "minutes": 210, "proximity": "far",
     "nearbyNow": False, "lastSeen": "yesterday",
     "places": [{"name": "Gym", "minutes": 120},
                {"name": "Cafeteria", "minutes": 60},
                {"name": "West Quad", "minutes": 30}]},
    {"name": "Sam O.", "initials": "SO", "minutes": 140, "proximity": "far",
     "nearbyNow": False, "lastSeen": "2d ago",
     "places": [{"name": "Boylan Hall · Lecture 219", "minutes": 95},
                {"name": "Library · 3rd Floor", "minutes": 45}]},
]


def nearby():
    return {
        "consent": {
            "locationEnabled": True,
            "sharingEnabled": True,
            "note": ("Proximity data is opt-in and stays private to you. Turn "
                     "off sharing or location any time to stop collection."),
        },
        "scanPeriodMs": 2600,
        "windowLabel": "Last 30 days",
        "youAt": "West Quad Building",
        "contacts": CONTACTS,
    }


if __name__ == "__main__":
    micro.run("nearby-service", 8646, {"/contacts": nearby})
