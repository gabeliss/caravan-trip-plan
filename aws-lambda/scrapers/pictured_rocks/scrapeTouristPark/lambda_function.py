import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

from datetime import datetime
import requests
import json

def scrape_touristPark(start_date, end_date, num_adults, num_kids):
    # Initialize results dictionary with defaults
    results = {
        "tent": {"available": False, "price": None, "message": "Not available"},
        "rv": {"available": False, "price": None, "message": "Not available"}
    }
    
    start_month, start_day, start_year = map(int, start_date.split('/'))
    if start_year < 25 or (start_year == 25 and (start_month < 5 or (start_month == 5 and start_day < 15))):
        error_message = "Not available before May 15, 2025"
        results["tent"] = {"available": False, "price": None, "message": error_message}
        results["rv"] = {"available": False, "price": None, "message": error_message}
        return results
        
    # Convert dates to the required format (YYYY-MM-DD)
    start_date_formatted = datetime.strptime(start_date, "%m/%d/%y").strftime("%Y-%m-%d")
    end_date_formatted = datetime.strptime(end_date, "%m/%d/%y").strftime("%Y-%m-%d")
    guests = f"guests{num_kids},{num_adults},0"

    # Set up URL and query parameters
    url = "https://www.campspot.com/api/gator-core/v2/availability/parks/1850"
    params = {
        "checkin": start_date_formatted,
        "checkout": end_date_formatted,
        "guests": guests,
        "useCustomParkData": "true",
        "includeUnavailable": "true"
    }

    # Set up headers
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "x-client-type": "CONSUMER",
        "x-cognito-userpool-clientid": "60jmeb5kmfgfkeljne4car54vo"
    }

    # Use a session to handle cookies automatically
    session = requests.Session()
    response = session.get(url, headers=headers, params=params, timeout=30)

    # Check if the response was successful and return the content
    if response.status_code == 200:
        data = response.json()
        if data == []:
            results["tent"] = {"available": False, "price": None, "message": "No options available."}
            results["rv"] = {"available": False, "price": None, "message": "No options available."}
            return results
        
        # Define site types for each category with priority order
        tent_sites = ["Waterfront Rustic Tent Site", "Rustic Tent Site", "W/E Campsite"]
        rv_sites = ["W/E Campsite", "Full Hookup Campsite", "Waterfront Full Hookup Campsite", 
                   "W/E Campsite - Pull Through", "Waterfront W/E Campsite", "W/E Campsite Lakeview"]
        
        # Create dictionaries of available sites with their prices
        available_tent_sites = {}
        available_rv_sites = {}
        
        # Process all available sites
        for site in data:
            if site['availability'] == 'AVAILABLE':
                site_name = site['name']
                price = site['averagePricePerNight']
                
                # Check if it's a tent site
                if site_name in tent_sites:
                    available_tent_sites[site_name] = price
                
                # Check if it's an RV site
                if site_name in rv_sites:
                    available_rv_sites[site_name] = price
        
        # Process tent sites according to priority
        tent_result = {"available": False, "price": None, "message": "No tent sites available."}
        for site_name in tent_sites:
            if site_name in available_tent_sites:
                price = available_tent_sites[site_name]
                tent_result = {
                    "available": True,
                    "price": price,
                    "message": f"${price:.2f} per night - {site_name}"
                }
                break
        
        # Process RV sites according to priority (cheapest preferred)
        rv_result = {"available": False, "price": None, "message": "No RV sites available."}
        
        if available_rv_sites:
            # Find the cheapest RV site
            cheapest_site = min(available_rv_sites.items(), key=lambda x: x[1])
            site_name = cheapest_site[0]
            price = cheapest_site[1]
            rv_result = {
                "available": True,
                "price": price,
                "message": f"${price:.2f} per night - {site_name}"
            }
        
        results["tent"] = tent_result
        results["rv"] = rv_result
        return results
    else:
        print("Failed to retrieve data:", response)
        error_message = "Failed to retrieve data"
        results["tent"] = {"available": False, "price": None, "message": error_message}
        results["rv"] = {"available": False, "price": None, "message": error_message}
        return results



def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeTouristPark scraper.
    
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
        result = scrape_touristPark(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Touristpark"
        
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
        print(f"Error in Touristpark Lambda: {str(e)}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Touristpark",
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
            'startDate': '06/08/25',
            'endDate': '06/10/25',
            'numAdults': 2,
            'numKids': 0
        })
    }
    
    response = lambda_handler(test_event, None)
    print(json.dumps(response, indent=2))
