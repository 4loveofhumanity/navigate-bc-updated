"""Student ID microservice for the clearly labeled demo credential."""

import time

import micro


def card():
    return {
        "college": "PUGLIESE COLLEGE",
        "name": "DEMO, STUDENT",
        "role": "Undergraduate",
        "emplid": "1234XXXX",
        "hotline": (
            "Mental-health support: call or text 988 for free, "
            "confidential support 24/7."
        ),
        "security": {
            "lamp": "blue",
            "mode": "breathing",
            "periodMs": 3200,
            "issuedAt": int(time.time() * 1000),
            "reason": "live-screen verification",
        },
    }


if __name__ == "__main__":
    micro.run("student-id-service", 8648, {"/card": card})
