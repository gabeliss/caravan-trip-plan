"""
Helper module containing data about campgrounds for each city.
"""

def get_campgrounds_data():
    """
    Return a dictionary of campgrounds organized by city.
    
    Returns:
        dict: A dictionary with city IDs as keys and lists of campground data as values
    """
    return {
        "traverse-city": [
            # {
            #     "id": "traverse-city-state-park",
            #     "name": "Traverse City State Park",
            #     "scraperFunction": "scrape_traverseCityStatePark"
            # },
            # {
            #     "id": "traverse-city-koa",
            #     "name": "Traverse City KOA",
            #     "scraperFunction": "scrape_traverseCityKoa"
            # },
            {
                "id": "anchor-inn",
                "name": "Anchor Inn",
                "scraperFunction": "scrape_anchorInn"
            },
            {
                "id": "leelanau-pines",
                "name": "Leelanau Pines",
                "scraperFunction": "scrape_leelanauPines"
            },
            {
                "id": "timber-ridge",
                "name": "Timber Ridge",
                "scraperFunction": "scrape_timberRidge"
            }
        ],
        "mackinac-city": [
            # {
            #     "id": "st-ignace-koa",
            #     "name": "St. Ignace KOA",
            #     "scraperFunction": "scrape_stIgnaceKoa"
            # },
            {
                "id": "indian-river",
                "name": "Indian River",
                "scraperFunction": "scrape_indianRiver"
            },
            # {
            #     "id": "straits-state-park",
            #     "name": "Straights State Park",
            #     "scraperFunction": "scrape_straitsStatePark"
            # },
            {
                "id": "cabins-of-mackinaw",
                "name": "Cabins of Mackinaw",
                "scraperFunction": "scrape_cabinsOfMackinaw"
            },
            {
                "id": "teepee-campground",
                "name": "Teepee Campground",
                "scraperFunction": "scrape_teePeeCampground"
            }
        ],
        "pictured-rocks": [
            # {
            #     "id": "munising-koa",
            #     "name": "Munising KOA",
            #     "scraperFunction": "scrape_munisingKoa"
            # },
            {
                "id": "tourist-park",
                "name": "Tourist Park",
                "scraperFunction": "scrape_touristPark"
            },
            {
                "id": "uncle-duckys-au-train",
                "name": "Uncle Ducky's Au Train",
                "scraperFunction": "scrape_uncleDuckysAuTrain"
            },
            {
                "id": "uncle-duckys-paddlers-village",
                "name": "Uncle Ducky's Paddlers Village",
                "scraperFunction": "scrape_uncleDuckysPaddlersVillage"
            },
            {
                "id": "fort-superior",
                "name": "Fort Superior",
                "scraperFunction": "scrape_fortSuperior"
            },
            {
                "id": "au-train-lake",
                "name": "Au Train Lake Campground",
                "scraperFunction": "scrape_auTrainLakeCampground"
            }
        ]
    } 