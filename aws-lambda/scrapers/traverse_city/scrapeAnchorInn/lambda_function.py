import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

from datetime import datetime
import requests

def scrape_anchorInn(start_date_str, end_date_str, num_adults, num_kids=0):
    # Calculate num_travelers from num_adults and num_kids
    num_travelers = num_adults + num_kids
 
    stays = {
        "Single Queen Room": "Unavailable",
        "Lake House": "Unavailable",
        "Cozy Queen Room": "Unavailable",
        "1 Bedroom with Kitchenette": "Unavailable",
        "2 Bedrooms with Full Kitchen": "Unavailable",
        "King Room": "Unavailable",
        "King w/ Fireplace & Sofa-Bed": "Unavailable",
        "Innkeeper's Cottage": "Unavailable"
    }
 
    stays_ordered = ["Single Queen Room", "Cozy Queen Room", "King Room", "1 Bedroom with Kitchenette", 
                    "King w/ Fireplace & Sofa-Bed", "2 Bedrooms with Full Kitchen", "Lake House", "Innkeeper's Cottage"]
    # Convert date strings to required format
    start_date = datetime.strptime(start_date_str, '%m/%d/%y').strftime('%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%m/%d/%y').strftime('%Y-%m-%d')
     
    # Prepare the request details
    url = f"https://secure.thinkreservations.com/api/hotels/3399/availabilities/v2?start_date={start_date}&end_date={end_date}&number_of_adults={num_travelers}&number_of_children=0&session_id=ad0b9271-17e5-46c8-9d5c-6f50ad3f938b"
    headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Origin": "https://secure.thinkreservations.com",
        "Referer": "https://secure.thinkreservations.com/anchorinn/reservations/availability",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko)"
    }
 
    results = {
        "lodging": {"available": False, "price": None, "message": "Not available for selected dates"}
    }
     
    # Send the request
    response = requests.post(url, headers=headers, data={})  # Sending an empty JSON object as payload
 
    if response.status_code == 200:
        units = response.json()
        for unit in units:
            name = unit["unit"]["name"]
            valid = (len(unit["validRateTypeAvailabilities"]) > 0)
            if valid:
                price = unit["validRateTypeAvailabilities"][0]["averagePricePerDay"]
                stays[name] = price
 
        for stay in stays_ordered:
            if stays[stay] != "Unavailable":
                price = stays[stay]
                results["lodging"] = {
                    "available": True,
                    "price": price,
                    "message": f"${price:.2f} per night - {stay}"
                }
                break
        
        # If no available stays were found
        if "lodging" not in results:
            results["lodging"] = {
                "available": False, 
                "price": None, 
                "message": "No cabins available for selected dates."
            }
             
        return results
    else:
        print(f"Failed to fetch data: {response.status_code}, {response.text}")
        return {
            "lodging": {
                "available": False,
                "price": None,
                "message": f"Failed to retrieve data: {response.status_code}"
            }
        }

def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeAnchorInn scraper.
    
    Args:
        event (dict): AWS Lambda event object
        context (object): AWS Lambda context object
    
    Returns:
        dict: API Gateway response object
    """
    try:
        # Parse the request body
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except Exception as e:
                return {
                    'statusCode': 400,
                    'body': json.dumps({
                        'message': f'Error parsing request body: {str(e)}'
                    })
                }
        else:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'message': 'Missing request body'
                })
            }
        
        # Extract parameters
        start_date = body.get('startDate')
        end_date = body.get('endDate')
        num_adults = body.get('numAdults', 2)
        num_kids = body.get('numKids', 0)
        
        if not all([start_date, end_date]):
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'message': 'Missing required parameters'
                })
            }
        
        # Call the scraper function
        result = scrape_anchorInn(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Anchorinn"
        
        # Return the result
        return {
            'statusCode': 200,
            'body': json.dumps(result),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        }
        
    except Exception as e:
        error_traceback = traceback.format_exc()
        print(f"Error in Anchorinn Lambda: {str(e)}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Anchorinn",
                'timestamp': current_time
            }),
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }
        }


# This is used for local testing
if __name__ == '__main__':
    # Test the function with sample event
    test_event = {
        'body': json.dumps({
            'startDate': '06/04/25',
            'endDate': '06/06/25',
            'numAdults': 4,
            'numKids': 0
        })
    }
    
    response = lambda_handler(test_event, None)
    print(json.dumps(response, indent=2))
