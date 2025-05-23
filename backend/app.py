from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import stripe
import requests
from datetime import datetime, timedelta
import os
import logging
from dotenv import load_dotenv
import time
from supabase import create_client
import random

from helpers.trip_itineraries import TRIP_ITINERARIES
from helpers.cities_data import get_cities_data
from helpers.campgrounds_data import get_campgrounds_data
from helpers.lambda_mappings import get_lambda_mappings
from helpers.email_service import send_confirmation_email

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

availability_cache = {}
CACHE_DURATION = 1800
MAX_CONCURRENT_REQUESTS = 10

app = Flask(__name__)

FRONTEND_URL = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
CORS(app, resources={r"/api/*": {"origins": FRONTEND_URL}}, supports_credentials=True)

LAMBDA_BASE_URL = os.environ.get('AWS_API_URL', 'https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/dev')

SUPABASE_URL = os.environ.get('SUPABASE_URL')
SUPABASE_SERVICE_ROLE_KEY = os.environ.get('SUPABASE_SERVICE_ROLE_KEY')

supabase = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

stripe.api_key = os.environ.get("STRIPE_SECRET_KEY")

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
        

        if nights not in TRIP_ITINERARIES[destination_id]:
            return jsonify({"error": f"No itinerary found for {destination_id} with {nights} nights"}), 404
        
        itinerary = TRIP_ITINERARIES[destination_id][nights]
        
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
    
    to_email = data.get('email', '')
    first_name = data.get('firstName', 'Traveler')
    confirmation_id = data.get('confirmationId', '###')
    trip_id = data.get('tripId')
    
    if not trip_id:
        return jsonify({"error": "Missing required tripId parameter"}), 400
    
    frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
    trip_link = f"{frontend_url}/dashboard/trips/{trip_id}"
    
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
    

@app.route('/api/claim-trips', methods=['POST'])
def claim_trips():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        email = data.get('email')

        if not user_id or not email:
            return jsonify({'error': 'Missing user_id or email'}), 400

        # Use .filter('user_id', 'is', 'null') to avoid PGRST100
        response = supabase.table('trips') \
            .update({'user_id': user_id}) \
            .eq('email', email) \
            .filter('user_id', 'is', 'null') \
            .execute()

        updated = len(response.data) if response.data else 0
        return jsonify({'updated': updated})

    except Exception as e:
        print("❌ Error in /api/claim-trips:", str(e))
        return jsonify({'error': str(e)}), 500


@app.route('/api/user-trips/<user_id>', methods=['GET'])
def get_user_trips(user_id):
    try:
        response = supabase.table('trips').select('*').eq('user_id', user_id).execute()
        if not response or not response.data:
            return jsonify([])

        return jsonify(response.data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

@app.route('/api/create-checkout-session', methods=['POST'])
def create_checkout_session():
    data = request.get_json()

    try:
        session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[{
                'price_data': {
                    'currency': 'usd',
                    'unit_amount': 899,  # $8.99 in cents
                    'product_data': {
                        'name': 'Trip Guide Package',
                    },
                },
                'quantity': 1,
            }],
            mode='payment',
            success_url=data['success_url'],
            cancel_url=data['cancel_url'],
            metadata={
                'email': data.get('email'),
                'guest_name': data.get('guest_name', ''),
                'trip_details': json.dumps(data.get('trip_details')),
                'user_id': data.get('user_id', ''),
                'campgrounds': json.dumps(data.get('campgrounds', [])),
            }
        )
        return jsonify({'id': session.id})
    except Exception as e:
        return jsonify(error=str(e)), 400

@app.route('/api/redeem-checkout-session', methods=['POST'])
def redeem_checkout_session():
    data = request.get_json()
    session_id = data.get('session_id')

    if not session_id:
        return jsonify({'error': 'Missing session_id parameter'}), 400

    try:

        existing = supabase.table('trips').select('*').eq('stripe_session_id', session_id).execute()
        if existing.data and len(existing.data) > 0:
            trip = existing.data[0]
            return jsonify({
                "tripId": trip["id"],
                "confirmationId": trip["confirmation_id"],
                "email": trip.get("email") or ""
            }), 200

        if not hasattr(app, 'processed_sessions'):
            app.processed_sessions = {}
            
        if session_id in app.processed_sessions:
            return jsonify(app.processed_sessions[session_id])
            
        session = stripe.checkout.Session.retrieve(session_id)
        
        if session.payment_status != 'paid':
            return jsonify({'error': 'Payment not completed'}), 400
            
        metadata = session.metadata
        email = metadata.get('email')
        guest_name = metadata.get('guest_name', 'Guest')
        user_id = metadata.get('user_id', '')
        trip_details = json.loads(metadata.get('trip_details', '{}'))
        campgrounds_data = json.loads(metadata.get('campgrounds', '[]'))

        
        trip_id = 'T' + ''.join(str(random.randint(0, 9)) for _ in range(16))
        confirmation_id = 'C' + ''.join(str(random.randint(0, 9)) for _ in range(16))
        
        if user_id:
            trip_data = {
                "id": trip_id,
                "confirmation_id": confirmation_id,
                "user_id": user_id,
                "trip_details": {
                    "destination": trip_details.get("destination"),
                    "nights": trip_details.get("nights"),
                    "startDate": trip_details.get("startDate"),
                    "guestCount": trip_details.get("guestCount")
                },
                "campgrounds": campgrounds_data,
                "created_at": datetime.now().isoformat(),
                "status": "planned",
                "guide_url": "/trip-guide.pdf",
                "stripe_session_id": session_id
            }
        else:
            trip_data = {
                "id": trip_id,
                "confirmation_id": confirmation_id,
                "user_id": None,
                "email": email,
                "trip_details": {
                    "destination": trip_details.get("destination"),
                    "nights": trip_details.get("nights"),
                    "startDate": trip_details.get("startDate"),
                    "guestCount": trip_details.get("guestCount")
                },
                "campgrounds": campgrounds_data,
                "created_at": datetime.now().isoformat(),
                "status": "planned",
                "guide_url": "/trip-guide.pdf",
                "stripe_session_id": session_id
            }
        
        response = supabase.table('trips').insert(trip_data).execute()
        
        if not response or not response.data or len(response.data) == 0:
            return jsonify({'error': 'Failed to save trip'}), 500
        
        frontend_url = os.environ.get('FRONTEND_URL', 'http://localhost:5173')
        trip_link = f"{frontend_url}/trip-success/{trip_id}"
        
        try:
            send_confirmation_email(
                to_email=email,
                first_name=guest_name.split(' ')[0],
                confirmation_id=confirmation_id,
                trip_link=trip_link
            )
        except Exception as email_err:
            logger.error(f"Failed to send confirmation email: {str(email_err)}")
            
        result = {
            "tripId": trip_id,
            "confirmationId": confirmation_id,
            "email": email
        }
        app.processed_sessions[session_id] = result
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error redeeming checkout session: {str(e)}")
        return jsonify({'error': str(e)}), 400

@app.route('/api/early-signups', methods=['POST', 'OPTIONS'])
def create_early_signup():
    if request.method == 'OPTIONS':
        return '', 200
    
    try:
        data = request.get_json()
        email = data.get('email', '').strip().lower()
        
        if not email:
            return jsonify({'error': 'Email is required'}), 400
        
        # Basic email validation
        import re
        email_pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_pattern, email):
            return jsonify({'error': 'Invalid email format'}), 400
        
        # Insert into early_signups table
        response = supabase.table('early_signups').insert({
            'email': email,
            'source_page': data.get('source_page', 'homepage')
        }).execute()
        
        if not response or not response.data:
            return jsonify({'error': 'Failed to save email'}), 500
        
        return jsonify({'message': 'Email saved successfully'}), 200
        
    except Exception as e:
        # Handle duplicate email error gracefully
        if 'duplicate key value violates unique constraint' in str(e):
            return jsonify({'message': 'Email already registered'}), 200
        
        logger.error(f"Error saving early signup: {str(e)}")
        return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5001))
    app.run(host='0.0.0.0', port=port) 