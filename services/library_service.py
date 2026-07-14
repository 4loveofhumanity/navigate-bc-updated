"""Library microservice providing curated official Pugliese College links."""

import micro


LIBRARY_INFO = {
    "name": "Pugliese College Library",
    "location": "Library Cafe Level",
    "website": "https://library.pugliese.cuny.edu/",
    "libraryId": "29085012345678",
    "resources": [
        {
            "id": "onesearch",
            "title": "OneSearch",
            "description": "Search books, articles, media, and other library materials.",
            "url": "https://library.pugliese.cuny.edu/search/",
            "icon": "search",
        },
        {
            "id": "databases",
            "title": "Databases",
            "description": "Browse research databases available through the library.",
            "url": "https://libguides.pugliese.cuny.edu/az/databases",
            "icon": "database",
        },
        {
            "id": "research-guides",
            "title": "Research Guides",
            "description": "Find subject guides created by Pugliese College librarians.",
            "url": "https://libguides.pugliese.cuny.edu/",
            "icon": "guides",
        },
        {
            "id": "ask-a-librarian",
            "title": "Ask a Librarian",
            "description": "Get research help from a Pugliese College librarian.",
            "url": "https://cuny.libanswers.com/CUNYPugliese/",
            "icon": "help",
        },
        {
            "id": "hours",
            "title": "Library Hours",
            "description": "Check current building and service hours before visiting.",
            "url": "https://library.pugliese.cuny.edu/hours/",
            "icon": "hours",
        },
    ],
}


def resources():
    return LIBRARY_INFO


if __name__ == "__main__":
    micro.run("library-service", 8645, {"/resources": resources})
