from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import requests
from datetime import datetime, timedelta
import os
import logging
from dotenv import load_dotenv
import time
from supabase import create_client

# Import helper modules
from helpers.trip_itineraries import TRIP_ITINERARIES
from helpers.cities_data import get_cities_data
from helpers.campgrounds_data import get_campgrounds_data
from helpers.lambda_mappings import get_lambda_mappings
from helpers.email_service import send_confirmation_email

# Load environment variables from .env file
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Simple in-memory cache for availability results
availability_cache = {}
CACHE_DURATION = 1800  # Cache duration in seconds (30 minutes)
MAX_CONCURRENT_REQUESTS = 10  # Maximum number of concurrent Lambda requests

app = Flask(__name__)

# Configure CORS to allow requests from the frontend
FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
CORS(app, resources={r"/api/*": {"origins": FRONTEND_URL}}, supports_credentials=True)

# Lambda API Gateway base URL - get from AWS_API_URL environment variable
LAMBDA_BASE_URL = os.environ.get('AWS_API_URL', 'https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/dev')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')
print("SUPABASE URL:", SUPABASE_URL)
print("SUPABASE SERVICE ROLE KEY:", SUPABASE_SERVICE_ROLE_KEY)
supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

# Log the actual Lambda base URL for debugging
logger.info(f"Using Lambda Base URL: {LAMBDA_BASE_URL}")

# Helper function to call a Lambda function
def call_lambda_function(lambda_path, payload, timeout=30):
    """
    Call a Lambda function with the given payload.
    
    Args:
        lambda_path (str): The path to the Lambda function
        payload (dict): The payload to send to the Lambda function
        timeout (int): Timeout in seconds
        
    Returns:
        dict: The response from the Lambda function
    """
    lambda_url = f"{LAMBDA_BASE_URL}/{lambda_path}"
    logger.info(f"Calling Lambda function: {lambda_url}")
    
    try:
        response = requests.post(
            lambda_url,
            json=payload,
            timeout=timeout
        )
        
        if response.status_code == 200:
            return response.json()
        else:
            error_message = f"Lambda function {lambda_path} returned status code {response.status_code}"
            logger.error(f"{error_message}: {response.text}")
            return {
                "error": error_message,
                "timestamp": datetime.now().isoformat()
            }
    except requests.exceptions.Timeout:
        error_message = f"Lambda function {lambda_path} timed out"
        logger.error(error_message)
        return {
            "error": error_message,
            "timestamp": datetime.now().isoformat()
        }
    except requests.exceptions.RequestException as e:
        error_message = f"Failed to connect to Lambda function {lambda_path}: {str(e)}"
        logger.error(error_message)
        return {
            "error": error_message,
            "timestamp": datetime.now().isoformat()
        }
    

@app.route('/api/health', methods=['GET'])
def health_check():
    """Basic health check endpoint"""
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()})

@app.route('/api/cities', methods=['GET'])
def get_cities():
    """Return a list of available cities"""
    return jsonify(get_cities_data())

@app.route('/api/campgrounds/<city_id>', methods=['GET'])
def get_campgrounds(city_id):
    """Return campgrounds for a specific city"""
    city_campgrounds = get_campgrounds_data()
    
    if city_id not in city_campgrounds:
        return jsonify([])
    
    return jsonify(city_campgrounds[city_id])

@app.route('/api/availability', methods=['POST'])
def check_availability():
    """Check availability for a single campground."""
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    campground_id = data.get('campgroundId')
    start_date = data.get('startDate')
    end_date = data.get('endDate')
    num_adults = data.get('numAdults', 2)
    num_kids = data.get('numKids', 0)
    
    if not all([campground_id, start_date, end_date]):
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        # Check cache
        cache_key = f"{campground_id}_{start_date}_{end_date}_{num_adults}_{num_kids}"
        if cache_key in availability_cache:
            cached_result, timestamp = availability_cache[cache_key]
            if time.time() - timestamp < CACHE_DURATION:
                return jsonify(cached_result)
        
        # Get lambda mappings
        lambda_mappings = get_lambda_mappings()
        lambda_path = lambda_mappings.get(campground_id)
        
        if not lambda_path:
            return jsonify({"error": f"No scraper configured for {campground_id}"}), 404
        
        payload = {
            "startDate": start_date,
            "endDate": end_date,
            "numAdults": num_adults,
            "numKids": num_kids
        }
        
        result = call_lambda_function(lambda_path, payload)
        
        if 'error' not in result:
            availability_cache[cache_key] = (result, time.time())
        
        return jsonify(result)
    
    except Exception as e:
        return jsonify({
            "error": f"Internal server error: {str(e)}",
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
    
    logger.info(f"Received trip plan request: destinationId={destination_id}, nights={nights}, startDate={start_date_str}")
    
    if not all([destination_id, nights, start_date_str]):
        return jsonify({"error": "Missing required parameters"}), 400
    
    try:
        # Parse date
        month, day, year = map(int, start_date_str.split('/'))
        start_date = datetime(2000 + year, month, day)  # Assuming 20xx for the year
        
        # Ensure nights is an integer
        try:
            nights = int(nights)
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
            
            # Get campgrounds for this city
            city_id = stop['city']
            
            # Get campgrounds data from the helper module
            campgrounds_data = get_campgrounds_data()
            city_campgrounds = campgrounds_data.get(city_id, [])
            logger.info(f"Found {len(city_campgrounds)} campgrounds for {city_id}")
            
            # Create stop details (without availability data)
            stop_details = {
                "city": stop['city'],
                "startDate": formatted_start,
                "endDate": formatted_end,
                "nights": stop['nights'],
                "campgrounds": city_campgrounds  # Include campground list without availability
            }
            
            detailed_itinerary.append(stop_details)
            
            # Update current date for next stop
            current_date = stop_end_date
        
        # Return the trip plan without availability data
        response = {
            "destinationId": destination_id,
            "totalNights": nights,
            "startDate": start_date_str,
            "stops": detailed_itinerary,
            "timestamp": datetime.now().isoformat()
        }
        
        return jsonify(response)
    
    except Exception as e:
        logger.error(f"Error generating trip plan: {str(e)}")
        return jsonify({"error": str(e)}), 500

@app.route('/api/send-confirmation-email', methods=['POST'])
def send_confirmation():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400
    
    to_email = data.get('email', os.environ.get('ADMIN_EMAIL'))
    first_name = data.get('firstName', 'Traveler')
    confirmation_id = data.get('confirmationId', '###')
    trip_id = data.get('tripId')
    
    # If trip_id is missing, return an error
    if not trip_id:
        return jsonify({"error": "Missing required tripId parameter"}), 400
    
    # Create the trip link - in a real app, this would be a proper URL to the trip details
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    trip_link = f"{frontend_url}/dashboard/trips/{trip_id}"
    
    logger.info(f"Sending confirmation email to {to_email} for trip {trip_id}")
    
    result = send_confirmation_email(to_email, first_name, confirmation_id, trip_link)
    
    return jsonify(result)

@app.route('/api/create-guest-trip', methods=['POST', 'OPTIONS'])
def create_guest_trip():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        trip_data = request.json
        if not trip_data:
            return jsonify({'error': 'No trip data provided'}), 400

        response = supabase.table('trips').insert(trip_data).execute()
        print("SUPABASE RESPONSE:", response)
        print("SUPABASE DATA:", response.data)


        if not response or not response.data or len(response.data) == 0:
            return jsonify({'error': 'Failed to insert trip'}), 500

        return jsonify({ 'trip': response.data[0] })

    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({ 'error': str(e) }), 500

if __name__ == '__main__':
    # Get port from environment variable or use default
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port) 