"""My Pugliese Info microservice — student profile, balances, holds, credentials."""
import micro

PROFILE = {
    "name": "DEMO, STUDENT",
    "role": "Undergraduate",
    "emplid": "1234XXXX",
    "transactions": 0,
    "appointments": 0,
    "holds": 1,
    "holdsNote": "Immunization records required. Contact the Health Clinic.",
    "balanceDue": "$--.--",
    "webcentralId": "pugliese_id",
    "email": "PUG123@student.pugliese.edu",
    "wifiUser": "PUG123",
    "wifiNote": ("Your default password is the month and day of your birthday "
                 "plus the last 5 digits of your Social Security Number. "
                 "The format is MMDDSSSSS."),
    "helpPhone": "718-951-5787",
    "helpUrl": "http://infotech.pugliese.cuny.edu/labs",
}

if __name__ == "__main__":
    micro.run("info-service", 8642, {"/profile": PROFILE})
