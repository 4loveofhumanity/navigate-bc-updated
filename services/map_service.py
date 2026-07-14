"""Floor Map microservice — building/room lookups for campus wayfinding."""
import micro

LOCATION = {
    "name": "Financial Aid",
    "room": "308",
    "building": "West Quad Building",
    "buildingLabel": "West Quad Building-3",
    "floor": "3rd Floor",
}

if __name__ == "__main__":
    micro.run("map-service", 8644, {"/location": LOCATION})
