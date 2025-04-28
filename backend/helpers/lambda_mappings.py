"""
Helper module containing mappings between campground IDs and their corresponding Lambda scraper functions.
"""

def get_lambda_mappings():
    """
    Returns a dictionary mapping campground IDs to their corresponding Lambda function paths.
    
    Returns:
        dict: A dictionary with campground IDs as keys and Lambda paths as values
    """
    return {
        # Traverse City
        "traverse-city-state-park": "scrapers/traverse-city-state-park",
        "traverse-city-koa": "scrapers/traverse-city-koa",
        "anchor-inn": "scrapers/anchor-inn",
        "leelanau-pines": "scrapers/leelanau-pines",
        "timber-ridge": "scrapers/timber-ridge",
        # Mackinac City
        "st-ignace-koa": "scrapers/st-ignace-koa",
        "indian-river": "scrapers/indian-river",
        "straits-state-park": "scrapers/straits-state-park",
        "cabins-of-mackinaw": "scrapers/cabins-of-mackinaw",
        "teepee-campground": "scrapers/teepee-campground",
        # Pictured Rocks
        "munising-koa": "scrapers/munising-koa",
        "tourist-park": "scrapers/tourist-park",
        "uncle-duckys-au-train": "scrapers/uncle-duckys-au-train",
        "uncle-duckys-paddlers-village": "scrapers/uncle-duckys-paddlers-village",
        "fort-superior": "scrapers/fort-superior",
        "au-train-lake": "scrapers/au-train-lake"
    } 