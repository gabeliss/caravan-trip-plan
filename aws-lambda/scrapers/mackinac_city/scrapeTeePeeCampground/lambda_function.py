import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

from datetime import datetime
import requests
import json

def scrape_teePeeCampground(start_date, end_date, num_adults, num_kids):
    # Check if start date is before May 1, 2025
    start_month, start_day, start_year = map(int, start_date.split('/'))
    if start_year < 25 or (start_year == 25 and (start_month < 5)):
        results = {
            "tent": {"available": False, "price": None, "message": "Not available before May 1, 2025"},
            "rv": {"available": False, "price": None, "message": "Not available before May 1, 2025"},
            "lodging": {"available": False, "price": None, "message": "Not available before May 1, 2025"}
        }
        return results

    start_date_formatted = datetime.strptime(start_date, '%m/%d/%y').strftime('%Y-%m-%d')
    end_date_formatted = datetime.strptime(end_date, '%m/%d/%y').strftime('%Y-%m-%d')
    guests = f"guests{num_kids},0,{num_adults},0"

    url = "https://www.campspot.com/api/gator-core/v2/availability/parks/4816"
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua": '"Not A(Brand";v="8", "Chromium";v="132", "Google Chrome";v="132"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
        "x-client-type": "CONSUMER",
        "x-cognito-userpool-clientid": "60jmeb5kmfgfkeljne4car54vo"
    }

    params = {
        "checkin": start_date_formatted,
        "checkout": end_date_formatted,
        "guests": guests,
        "useCustomParkData": True,
        "includeUnavailable": True
    }

    results = {
        "rv": {"available": False, "price": None, "message": "Not available"},
        "tent": {"available": False, "price": None, "message": "Not available"},
        "lodging": {"available": False, "price": None, "message": "Not available"}
    }

    session = requests.Session()
    response = session.get(url, headers=headers, params=params, timeout=30)

    if response.status_code == 200:
        text = response.text
        inventory = json.loads(text)

        # Define site types for each category
        tent_sites = ["30 amp", "tent site (electric/water)", "30 amp lake"]
        rv_sites = ["30 amp", "large 30/50 amp", "30 amp lake", "30/50 amp lake"]
        cabin_sites = ["camper rental, great deal, price includes campsite fee."]
        
        # Initialize variables to track cheapest options
        tent_min_price = float('inf')
        tent_site_name = None
        rv_min_price = float('inf')
        rv_site_name = None
        cabin_min_price = float('inf')
        cabin_site_name = None
        
        # Process all available options
        for place in inventory:
            if place["availability"] != "AVAILABLE":
                continue
            
            site_name = place.get('name', '')
            price = place.get('averagePricePerNight')
            
            # Skip if price is missing
            if not price:
                continue
                
            # Check for tent sites
            if any(site.lower() in site_name.lower() for site in tent_sites):
                if price < tent_min_price:
                    tent_min_price = price
                    tent_site_name = site_name
            
            # Check for RV sites
            if any(site.lower() in site_name.lower() for site in rv_sites):
                if price < rv_min_price:
                    rv_min_price = price
                    rv_site_name = site_name
            
            # Check for cabin sites
            if any(site.lower() in site_name.lower() for site in cabin_sites):
                if price < cabin_min_price:
                    cabin_min_price = price
                    cabin_site_name = site_name
        
        # Set results for tent
        if tent_min_price != float('inf'):
            results["tent"] = {
                "available": True,
                "price": tent_min_price,
                "message": f"${tent_min_price:.2f} per night - {tent_site_name}"
            }
        else:
            results["tent"] = {
                "available": False,
                "price": None,
                "message": "No tent sites available."
            }
        
        # Set results for RV
        if rv_min_price != float('inf'):
            results["rv"] = {
                "available": True,
                "price": rv_min_price,
                "message": f"${rv_min_price:.2f} per night - {rv_site_name}"
            }
        else:
            results["rv"] = {
                "available": False,
                "price": None,
                "message": "No RV sites available."
            }
        
        # Set results for lodging
        if cabin_min_price != float('inf'):
            results["lodging"] = {
                "available": True,
                "price": cabin_min_price,
                "message": f"${cabin_min_price:.2f} per night - {cabin_site_name}"
            }
        else:
            results["lodging"] = {
                "available": False,
                "price": None,
                "message": "No lodging options available."
            }
        
        return results
    else:
        print("Failed to retrieve data:", response)
        error_message = "Failed to retrieve data"
        results = {
            "tent": {"available": False, "price": None, "message": error_message},
            "rv": {"available": False, "price": None, "message": error_message},
            "lodging": {"available": False, "price": None, "message": error_message}
        }
        return results



def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeTeePeeCampground scraper.
    
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
        result = scrape_teePeeCampground(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Teepeecampground"
        
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
        print(f"Error in Teepeecampground Lambda: {str(e)}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Teepeecampground",
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
