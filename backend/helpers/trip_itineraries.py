"""
Helper module containing trip itinerary definitions for various destinations.
Each destination has different itineraries based on number of nights.
"""

TRIP_ITINERARIES = {
    'northern-michigan': {
        1: [{'city': 'traverse-city', 'nights': 1}],
        2: [{'city': 'traverse-city', 'nights': 2}],
        3: [
            {'city': 'traverse-city', 'nights': 2},
            {'city': 'mackinac-city', 'nights': 1}
        ],
        4: [
            {'city': 'traverse-city', 'nights': 2},
            {'city': 'mackinac-city', 'nights': 2}
        ],
        5: [
            {'city': 'traverse-city', 'nights': 2},
            {'city': 'mackinac-city', 'nights': 1},
            {'city': 'pictured-rocks', 'nights': 2}
        ],
        6: [
            {'city': 'traverse-city', 'nights': 2},
            {'city': 'mackinac-city', 'nights': 2},
            {'city': 'pictured-rocks', 'nights': 2}
        ],
        7: [
            {'city': 'traverse-city', 'nights': 2},
            {'city': 'mackinac-city', 'nights': 2},
            {'city': 'pictured-rocks', 'nights': 3}
        ],
        8: [
            {'city': 'traverse-city', 'nights': 3},
            {'city': 'mackinac-city', 'nights': 2},
            {'city': 'pictured-rocks', 'nights': 3}
        ],
        9: [
            {'city': 'traverse-city', 'nights': 3},
            {'city': 'mackinac-city', 'nights': 3},
            {'city': 'pictured-rocks', 'nights': 3}
        ]
    },
    'arizona': {
        3: [
            {'city': 'phoenix', 'nights': 1},
            {'city': 'sedona', 'nights': 1},
            {'city': 'grand-canyon', 'nights': 1}
        ],
        5: [
            {'city': 'phoenix', 'nights': 1},
            {'city': 'sedona', 'nights': 2},
            {'city': 'grand-canyon', 'nights': 2}
        ],
        7: [
            {'city': 'phoenix', 'nights': 2},
            {'city': 'sedona', 'nights': 2},
            {'city': 'grand-canyon', 'nights': 2},
            {'city': 'page', 'nights': 1}
        ]
    },
    'washington': {
        3: [
            {'city': 'seattle', 'nights': 1},
            {'city': 'olympic', 'nights': 2}
        ],
        5: [
            {'city': 'seattle', 'nights': 1},
            {'city': 'olympic', 'nights': 2},
            {'city': 'mount-rainier', 'nights': 2}
        ],
        7: [
            {'city': 'seattle', 'nights': 2},
            {'city': 'olympic', 'nights': 2},
            {'city': 'mount-rainier', 'nights': 2},
            {'city': 'north-cascades', 'nights': 1}
        ]
    },
    'utah': {
        3: [
            {'city': 'zion', 'nights': 2},
            {'city': 'bryce-canyon', 'nights': 1}
        ],
        5: [
            {'city': 'zion', 'nights': 2},
            {'city': 'bryce-canyon', 'nights': 1},
            {'city': 'arches', 'nights': 2}
        ],
        7: [
            {'city': 'zion', 'nights': 2},
            {'city': 'bryce-canyon', 'nights': 1},
            {'city': 'arches', 'nights': 2},
            {'city': 'canyonlands', 'nights': 2}
        ]
    },
    'smoky-mountains': {
        3: [
            {'city': 'gatlinburg', 'nights': 2},
            {'city': 'cherokee', 'nights': 1}
        ],
        5: [
            {'city': 'gatlinburg', 'nights': 2},
            {'city': 'cherokee', 'nights': 2},
            {'city': 'pigeon-forge', 'nights': 1}
        ],
        7: [
            {'city': 'gatlinburg', 'nights': 2},
            {'city': 'cherokee', 'nights': 2},
            {'city': 'pigeon-forge', 'nights': 2},
            {'city': 'asheville', 'nights': 1}
        ]
    }
} 