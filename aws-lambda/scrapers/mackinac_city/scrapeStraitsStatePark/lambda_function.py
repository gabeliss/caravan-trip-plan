import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

from datetime import datetime
import requests
from bs4 import BeautifulSoup
import sys
import os

# Fix imports to work when run as a script
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(os.path.dirname(os.path.dirname(current_dir)))
if parent_dir not in sys.path:
    sys.path.append(parent_dir)

from scrapers.midnrReservations.lambda_function import scrape_midnrReservations

def scrape_straitsStatePark(start_date, end_date, num_adults, num_kids):
    """
    Scrape the Michigan DNR Reservations website for Straits State Park availability.
    
    Args:
        start_date: Start date in format MM/DD/YY
        end_date: End date in format MM/DD/YY
        num_adults: Number of adults
        num_kids: Number of children
        
    Returns:
        dict: Availability and pricing information with format:
        {
            "available": True/False,
            "price": float or None,
            "message": str
        }
    """
    # Define Straits State Park specific parameters
    straits_params = {
        "resourceLocationId": "-2147483350",  # Straits State Park location ID
        "mapId": "-2147483075",               # Straits State Park map ID
        "key_map_ids": ["-2147483074", "-2147483073", "-2147483072"],  # Map IDs to check for availability
        "price": 35.0                         # Default price for Straits State Park
    }
    
    # Use the generalized function with Straits State Park parameters
    return scrape_midnrReservations(start_date, end_date, num_adults, num_kids, park_params=straits_params)



def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeStraitsStatePark scraper.
    
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
        result = scrape_straitsStatePark(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Straitsstatepark"
        
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
        print(f"Error in Straitsstatepark Lambda: {str(e)}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Straitsstatepark",
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
            'startDate': '06/29/25',
            'endDate': '07/02/25',
            'numAdults': 2,
            'numKids': 0
        })
    }
    
    response = lambda_handler(test_event, None)
    print(json.dumps(response, indent=2))
