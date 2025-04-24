from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import requests
from datetime import datetime, timedelta
import os
import logging
from dotenv import load_dotenv  # Import dotenv for loading .env file

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)

# Configure CORS to allow requests from the frontend
FRONTEND_URL = os.environ.get('FRONTEND_URL', '*')
CORS(app, resources={r"/api/*": {"origins": FRONTEND_URL}})

# Lambda API Gateway base URL - get from AWS_API_URL environment variable
LAMBDA_BASE_URL = os.environ.get('AWS_API_URL', 'https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/dev')

# Log the actual Lambda base URL for debugging
logger.info(f"Using Lambda Base URL: {LAMBDA_BASE_URL}")

# Define trip itineraries based on destinations and number of nights
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
    # Add other destinations with consistent ID format
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

@app.route('/api/health', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})

@app.route('/api/cities', methods=['GET'])
def get_cities():
    """Return a list of available cities"""
    cities = [
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
    return jsonify(cities)

@app.route('/api/campgrounds/<city_id>', methods=['GET'])
def get_campgrounds(city_id):
    """Return campgrounds for a specific city"""
    # Sample campgrounds for supported cities
    city_campgrounds = {
        "traverse-city": [
            {
                "id": "traverse-city-state-park",
                "name": "Traverse City State Park",
                "description": "Located on the east arm of Grand Traverse Bay, this park offers a beautiful beach and is close to the city.",
                "price": 35,
                "coordinates": [44.7631, -85.5789],
                "scraperFunction": "scrape_traverseCityStatePark"
            },
            {
                "id": "traverse-city-koa",
                "name": "Traverse City KOA",
                "description": "Family-friendly campground with amenities including a pool, mini-golf, and more.",
                "price": 45,
                "coordinates": [44.7215, -85.6382],
                "scraperFunction": "scrape_traverseCityKoa"
            },
            {
                "id": "uncle-duckys-paddlers-village",
                "name": "Uncle Ducky's Paddlers Village",
                "description": "Riverside camping with easy access to paddle sports and outdoor adventures.",
                "price": 40,
                "coordinates": [44.7398, -85.6208],
                "scraperFunction": "scrape_uncleDuckysPaddlersVillage"
            },
            {
                "id": "anchor-inn",
                "name": "Anchor Inn",
                "description": "Comfortable lodging near the water with various accommodation options.",
                "price": 55,
                "coordinates": [44.7456, -85.6102],
                "scraperFunction": "scrape_anchorInn"
            },
            {
                "id": "leelanau-pines",
                "name": "Leelanau Pines",
                "description": "Lakefront camping on Lake Leelanau with beautiful views and water activities.",
                "price": 42,
                "coordinates": [44.8890, -85.7213],
                "scraperFunction": "scrape_leelanauPines"
            },
            {
                "id": "timber-ridge",
                "name": "Timber Ridge",
                "description": "Wooded campground with various recreational activities and hiking trails.",
                "price": 38,
                "coordinates": [44.7299, -85.6891],
                "scraperFunction": "scrape_timberRidge"
            }
        ],
        "mackinac-city": [
            {
                "id": "st-ignace-koa",
                "name": "St. Ignace KOA",
                "description": "Family-friendly KOA campground with views of the Straits of Mackinac.",
                "price": 45,
                "coordinates": [45.8852, -84.7289],
                "scraperFunction": "scrape_stIgnaceKoa"
            },
            {
                "id": "indian-river",
                "name": "Indian River RV Resort",
                "description": "Resort-style camping with river access and modern amenities.",
                "price": 42,
                "coordinates": [45.4156, -84.6123],
                "scraperFunction": "scrape_indianRiver"
            },
            {
                "id": "straits-state-park",
                "name": "Straits State Park",
                "description": "State park with stunning views of the Mackinac Bridge and Straits of Mackinac.",
                "price": 35,
                "coordinates": [45.8423, -84.7256],
                "scraperFunction": "scrape_straitsStatePark"
            },
            {
                "id": "cabins-of-mackinaw",
                "name": "Cabins of Mackinaw",
                "description": "Comfortable cabins near Mackinaw City with various amenities.",
                "price": 65,
                "coordinates": [45.7823, -84.7256],
                "scraperFunction": "scrape_cabinsOfMackinaw"
            },
            {
                "id": "teepee-campground",
                "name": "Tee Pee Campground",
                "description": "Family-owned campground with a variety of sites and proximity to attractions.",
                "price": 38,
                "coordinates": [45.7733, -84.7346],
                "scraperFunction": "scrape_teePeeCampground"
            }
        ],
        "pictured-rocks": [
            {
                "id": "munising-koa",
                "name": "Munising KOA",
                "description": "A KOA Journey campground, close to Pictured Rocks National Lakeshore.",
                "price": 45,
                "coordinates": [46.4156, -86.6123],
                "scraperFunction": "scrape_munisingKoa"
            },
            {
                "id": "tourist-park",
                "name": "Tourist Park",
                "description": "City-owned park on Lake Superior with beautiful beach access.",
                "price": 35,
                "coordinates": [46.5631, -87.3789],
                "scraperFunction": "scrape_touristPark"
            },
            {
                "id": "uncle-duckys-au-train",
                "name": "Uncle Ducky's Au Train",
                "description": "Campground with easy access to kayaking and outdoor activities.",
                "price": 40,
                "coordinates": [46.4398, -86.8208],
                "scraperFunction": "scrape_uncleDuckysAuTrain"
            },
            {
                "id": "fort-superior",
                "name": "Fort Superior",
                "description": "Historic fort site with camping areas and Lake Superior views.",
                "price": 38,
                "coordinates": [46.5789, -87.4156],
                "scraperFunction": "scrape_fortSuperior"
            },
            {
                "id": "au-train-lake",
                "name": "Au Train Lake Campground",
                "description": "Lakeside camping with opportunities for fishing and water activities.",
                "price": 35,
                "coordinates": [46.3521, -86.8321],
                "scraperFunction": "scrape_auTrainLakeCampground"
            }
        ]
    }
    
    if city_id not in city_campgrounds:
        return jsonify([])
    
    return jsonify(city_campgrounds[city_id])

@app.route('/api/availability', methods=['POST'])
def check_availability():
    """Check availability for a specific campground and date range"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Get required parameters
    campground_id = data.get('campgroundId')
    start_date = data.get('startDate')  # Format: MM/DD/YY
    end_date = data.get('endDate')      # Format: MM/DD/YY
    num_adults = data.get('numAdults', 2)
    num_kids = data.get('numKids', 0)
    accommodation_type = data.get('accommodationType', 'tent')  # Default to 'tent'
    
    if not all([campground_id, start_date, end_date]):
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        # Map campground_id to the appropriate Lambda function URL
        lambda_map = {
            # Traverse City
            "traverse-city-state-park": "scrapers/traverse-city-state-park",
            "traverse-city-koa": "scrapers/traverse-city-koa",
            "uncle-duckys-paddlers-village": "scrapers/uncle-duckys-paddlers-village",
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
            "fort-superior": "scrapers/fort-superior",
            "au-train-lake": "scrapers/au-train-lake"
        }
        
        # Get today's date for random price generation (for testing)
        today = datetime.now()
        # Use campground_id and date for a deterministic but random-looking price
        seed_value = hash(f"{campground_id}_{start_date}_{end_date}") % 100
        
        lambda_path = lambda_map.get(campground_id)
        if not lambda_path:
            # Generate a reasonable price based on date and campground ID
            base_price = 30 + (seed_value % 40)  # Price between $30-$70
            
            # For weekends, add a premium
            try:
                start_month, start_day, start_year = map(int, start_date.split('/'))
                start_date_obj = datetime(2000 + start_year, start_month, start_day)
                if start_date_obj.weekday() >= 5:  # Weekend
                    base_price += 15
            except:
                pass
                
            # Use a default fallback response for testing
            result = {
                "available": True,
                "price": base_price,
                "message": "Test availability response (no scraper found)",
                "timestamp": datetime.now().isoformat()
            }
        else:
            # Call the appropriate Lambda function
            lambda_url = f"{LAMBDA_BASE_URL}/{lambda_path}"
            
            logger.info(f"Calling Lambda function: {lambda_url}")
            
            # Call the Lambda function with the same parameters
            lambda_payload = {
                "startDate": start_date,
                "endDate": end_date,
                "numAdults": num_adults,
                "numKids": num_kids,
                "accommodationType": accommodation_type
            }
            
            try:
                lambda_response = requests.post(
                    lambda_url, 
                    json=lambda_payload,
                    timeout=30  # 30 second timeout
                )
                
                # Check if the response is successful
                if lambda_response.status_code == 200:
                    # Parse the Lambda response
                    lambda_result = lambda_response.json()
                    return jsonify(lambda_result)
                else:
                    logger.error(f"Lambda function returned error: {lambda_response.status_code}, {lambda_response.text}")
                    result = {
                        "available": False,
                        "price": None,
                        "message": f"Error checking availability: Lambda function returned {lambda_response.status_code}",
                        "timestamp": datetime.now().isoformat()
                    }
            except requests.exceptions.Timeout:
                logger.error(f"Lambda function timed out: {lambda_url}")
                result = {
                    "available": False,
                    "price": None,
                    "message": "Error checking availability: Lambda function timed out",
                    "timestamp": datetime.now().isoformat()
                }
            except requests.exceptions.RequestException as e:
                logger.error(f"Error calling Lambda function: {str(e)}")
                result = {
                    "available": False,
                    "price": None,
                    "message": f"Error checking availability: {str(e)}",
                    "timestamp": datetime.now().isoformat()
                }
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error in availability check: {str(e)}")
        return jsonify({
            "available": False, 
            "price": None, 
            "message": f"Error checking availability: {str(e)}",
            "timestamp": datetime.now().isoformat()
        }), 500

@app.route('/api/trip-plan', methods=['POST'])
def generate_trip_plan():
    """Generate a trip plan structure for a specific itinerary without checking availability"""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    # Get required parameters
    destination_id = data.get('destinationId')
    nights = data.get('nights')
    start_date_str = data.get('startDate')  # Format: MM/DD/YY
    num_adults = data.get('numAdults', 2)
    num_kids = data.get('numKids', 0)
    
    logger.info(f"Received request: destinationId={destination_id}, nights={nights} (type: {type(nights)}), startDate={start_date_str}")
    
    if not all([destination_id, nights, start_date_str]):
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        # Parse date
        month, day, year = map(int, start_date_str.split('/'))
        start_date = datetime(2000 + year, month, day)  # Assuming 20xx for the year
        
        # Ensure nights is an integer
        try:
            nights = int(nights)
            logger.info(f"Converted nights to int: {nights}")
        except ValueError as e:
            return jsonify({"error": f"Invalid nights value: {nights}, error: {str(e)}"}), 400
        
        # Get the itinerary for this destination and number of nights
        if destination_id not in TRIP_ITINERARIES:
            return jsonify({"error": f"No itinerary found for destination: {destination_id}"}), 404
            
        logger.info(f"Available night options for {destination_id}: {list(TRIP_ITINERARIES[destination_id].keys())}")
            
        if nights not in TRIP_ITINERARIES[destination_id]:
            return jsonify({"error": f"No itinerary found for {destination_id} with {nights} nights"}), 404
        
        itinerary = TRIP_ITINERARIES[destination_id][nights]
        logger.info(f"Found itinerary: {itinerary}")
        
        # Generate detailed itinerary with dates
        detailed_itinerary = []
        current_date = start_date
        
        for stop in itinerary:
            stop_start_date = current_date
            stop_end_date = current_date + timedelta(days=stop['nights'])
            
            # Format dates for API
            formatted_start = f"{stop_start_date.month}/{stop_start_date.day}/{str(stop_start_date.year)[2:]}"
            formatted_end = f"{stop_end_date.month}/{stop_end_date.day}/{str(stop_end_date.year)[2:]}"
            
            # Create stop details
            stop_details = {
                "city": stop['city'],
                "startDate": formatted_start,
                "endDate": formatted_end,
                "nights": stop['nights']
            }
            
            detailed_itinerary.append(stop_details)
            
            # Update current date for next stop
            current_date = stop_end_date
        
        # For each stop, just get the campgrounds without checking availability
        stops_with_campgrounds = []
        
        for stop in detailed_itinerary:
            # Get campgrounds for this city
            city_id = stop['city']
            logger.info(f"Processing city: {city_id}")
            
            # In a real app, we might want to make this more efficient
            try:
                with app.test_client() as client:
                    campgrounds_response = client.get(f"/api/campgrounds/{city_id}")
                    if campgrounds_response.status_code != 200:
                        logger.warning(f"Failed to get campgrounds for {city_id}, status: {campgrounds_response.status_code}")
                        campgrounds = []
                    else:
                        campgrounds = campgrounds_response.json
                        logger.info(f"Found {len(campgrounds)} campgrounds for {city_id}")
            except Exception as e:
                logger.error(f"Exception while getting campgrounds for {city_id}: {str(e)}")
                campgrounds = []
            
            # Don't check availability - just add campgrounds to the stop
            stop['campgrounds'] = campgrounds
            stops_with_campgrounds.append(stop)
        
        # Return the trip plan without availability data
        response = {
            "destinationId": destination_id,
            "totalNights": nights,
            "startDate": start_date_str,
            "stops": stops_with_campgrounds,
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error generating trip plan: {str(e)}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port) 