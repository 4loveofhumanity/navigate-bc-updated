"""Course Catalog microservice — departments, courses, section details."""
import micro

CATALOG = {
    "dept": "Biology (BIOL)",
    "term": "Fall 2016",
    "count": 109,
    "courses": [
        {"no": "BIOL. 1001", "ti": "General Biology 1"},
        {"no": "BIOL. 1002", "ti": "General Biology 2"},
        {"no": "BIOL. 1010", "ti": "Biol For Todays Wrld"},
        {"no": "BIOL. 2001", "ti": "Organismic Biology II, Zoology"},
        {"no": "BIOL. 2002", "ti": "Animal Form & Function Lab"},
        {"no": "BIOL. 2002W", "ti": "Animal Form & Function Lab -WI"},
        {"no": "BIOL. 2010", "ti": "Adv Cell & Molecular Biol"},
        {"no": "BIOL. 2020", "ti": "Neurobiology", "detailData": {
            "credits": "3.00",
            "section": "MW11",
            "prereq": ("Prerequisite or corequisite: Biology 1001 and 1002; "
                       "or Psychology 1000 and one of the following: Psychology "
                       "2600, 3600 or Biology 1001; or permission from the instructor"),
            "hours": "3 hours; 3 credits",
            "desc": ("Introduction to the structure and function of the nervous "
                     "system at molecular, cellular, systems, and behavioral levels "
                     "emphasizing animal models. Electrical and chemical signaling "
                     "of nerve cells, neuroanatomy, neurochemistry, motor and sensory "
                     "systems, neural plasticity, and current methodologies in "
                     "neuroscience research. This course is the same as Psychology 2610"),
            "meet": {"type": "Lab", "code": "MW11", "room": "IH 1141",
                     "times": "MW  11:00 AM - 12:15 PM"},
            "instructor": {"name": "Forlano, Paul M.", "title": "Associate Professor",
                           "dept": "Biology", "email": "pforlano@pugliese.cuny.edu",
                           "phone": "718.951.5000 x6252",
                           "office": "115 Ingersoll Hall Extension"},
        }},
        {"no": "BIOL. 3003", "ti": "Microbiology"},
        {"no": "BIOL. 3011", "ti": "Genetics"},
        {"no": "BIOL. 3021", "ti": "Ecology"},
        {"no": "BIOL. 4010", "ti": "Molecular Biology Research"},
    ],
}

if __name__ == "__main__":
    micro.run("catalog-service", 8643, {"/courses": CATALOG})
