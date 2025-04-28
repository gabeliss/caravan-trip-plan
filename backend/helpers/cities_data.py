"""
Helper module containing data about cities available in the application.
"""

def get_cities_data():
    """
    Return a list of available cities with their details.
    
    Returns:
        list: A list of dictionaries containing city information
    """
    return [
        {
            "id": "traverse-city",
            "name": "Traverse City",
            "description": "A charming city in Northern Michigan, known for its beautiful beaches, wineries, and outdoor activities.",
            "region": "Northern Michigan"
        },
        {
            "id": "pictured-rocks",
            "name": "Pictured Rocks",
            "description": "Famous for its colorful sandstone cliffs, beaches, and waterfalls along Lake Superior.",
            "region": "Upper Peninsula"
        },
        {
            "id": "mackinac-city",
            "name": "Mackinac City",
            "description": "Gateway to Mackinac Island, offering stunning views of the Mackinac Bridge and historic sites.",
            "region": "Northern Michigan"
        }
    ] 