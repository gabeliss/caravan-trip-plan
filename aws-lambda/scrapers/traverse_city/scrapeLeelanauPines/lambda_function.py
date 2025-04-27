import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

import requests
import json
import gzip
import brotli  # Import Brotli for handling Brotli compression
from datetime import datetime

def scrape_leelanauPines(start_date, end_date, num_adults, num_kids):
    # Check if start date is before May 2, 2025
    start_month, start_day, start_year = map(int, start_date.split('/'))
    if start_year < 25 or (start_year == 25 and (start_month < 5 or (start_month == 5 and start_day < 2))):
        results = {
            "tent": {"available": False, "price": None, "message": "Not available before May 2, 2025"},
            "rv": {"available": False, "price": None, "message": "Not available before May 2, 2025"},
            "cabin": {"available": False, "price": None, "message": "Not available before May 2, 2025"}
        }
        return results

    start_date_formatted = datetime.strptime(start_date, '%m/%d/%y').strftime('%Y-%m-%d')
    end_date_formatted = datetime.strptime(end_date, '%m/%d/%y').strftime('%Y-%m-%d')

    url = "https://campspot-embedded-booking-ytynsus4ka-uc.a.run.app/parks/2000/search"
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br",
        "accept-language": "en-US,en;q=0.9",
        "origin": "https://leelanaupinescampresort.com",
        "referer": "https://leelanaupinescampresort.com/",
        "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "cross-site",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
    }

    params = {
        "checkIn": start_date_formatted,
        "checkOut": end_date_formatted,
        "adults": num_adults,
        "children": num_kids,
        "pets": 0,
    }

    results = {}
    
    response = requests.get(url, headers=headers, params=params, timeout=30)

    if response.status_code == 200:
        try:
            # Check encoding and decompress accordingly
            if response.headers.get("Content-Encoding") == "gzip":
                text = gzip.decompress(response.content).decode('utf-8')
            elif response.headers.get("Content-Encoding") == "br":
                try:
                    text = brotli.decompress(response.content).decode('utf-8')
                except brotli.error as e:
                    text = response.content.decode('utf-8')  # Attempt to decode directly if Brotli fails
            else:
                text = response.text

            inventory = json.loads(text)
            
            # Define the site types
            tent_rv_sites = ["Lakefront Standard RV", "Standard Back-In RV", "Deluxe Back-In RV", "Lakefront Basic RV", "Premium Back-In RV"]
            cabin_sites = ["Rice Creek Glamping Pod", "White Pine Cabin"]
            
            # Store all available sites in a dictionary
            available_sites = {}
            for place in inventory.get('data', []):
                if place["availability"] == "AVAILABLE":
                    available_sites[place['name']] = place['averagePricePerNight']
            
            # Process tent/RV sites
            tent_rv_min_price = float('inf')
            tent_rv_site_name = None
            
            # First check if the preferred tent/RV site is available
            if "Lakefront Basic RV" in available_sites:
                tent_rv_min_price = available_sites["Lakefront Basic RV"]
                tent_rv_site_name = "Lakefront Basic RV"
            else:
                # Otherwise find the cheapest tent/RV site
                for site_name in tent_rv_sites:
                    if site_name in available_sites and available_sites[site_name] < tent_rv_min_price:
                        tent_rv_min_price = available_sites[site_name]
                        tent_rv_site_name = site_name
            
            # Process cabin sites
            cabin_min_price = float('inf')
            cabin_site_name = None
            
            # First check if the preferred cabin site is available
            if "Rice Creek Glamping Pod" in available_sites:
                cabin_min_price = available_sites["Rice Creek Glamping Pod"]
                cabin_site_name = "Rice Creek Glamping Pod"
            else:
                # Otherwise find the cheapest cabin site
                for site_name in cabin_sites:
                    if site_name in available_sites and available_sites[site_name] < cabin_min_price:
                        cabin_min_price = available_sites[site_name]
                        cabin_site_name = site_name
            
            # Set results for tent and RV (same results for both)
            if tent_rv_min_price != float('inf'):
                tent_rv_result = {
                    "available": True,
                    "price": tent_rv_min_price,
                    "message": f"${tent_rv_min_price:.2f} per night - {tent_rv_site_name}"
                }
            else:
                tent_rv_result = {
                    "available": False,
                    "price": None,
                    "message": "No tent/RV sites available."
                }
            
            results["tent"] = tent_rv_result
            results["rv"] = tent_rv_result  # Same results for tent and RV
            
            # Set results for cabin
            if cabin_min_price != float('inf'):
                results["cabin"] = {
                    "available": True,
                    "price": cabin_min_price,
                    "message": f"${cabin_min_price:.2f} per night - {cabin_site_name}"
                }
            else:
                results["cabin"] = {
                    "available": False,
                    "price": None,
                    "message": "No cabin options available."
                }
            
            return results

        except json.JSONDecodeError as e:
            print("Failed to parse JSON response:", text)
            error_message = "Invalid JSON response from API"
            results = {
                "tent": {"available": False, "price": None, "message": error_message},
                "rv": {"available": False, "price": None, "message": error_message},
                "cabin": {"available": False, "price": None, "message": error_message}
            }
            return results
    else:
        print(f"Failed to retrieve data: Status Code {response.status_code}, Response: {response.text}")
        error_message = "Failed to retrieve data"
        results = {
            "tent": {"available": False, "price": None, "message": error_message},
            "rv": {"available": False, "price": None, "message": error_message},
            "cabin": {"available": False, "price": None, "message": error_message}
        }
        return results



def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeLeelanauPines scraper.
    
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
        result = scrape_leelanauPines(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Leelanaupines"
        
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
        print(f"Error in Leelanaupines Lambda: {str(e)}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Leelanaupines",
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
            'numAdults': 2,
            'numKids': 0
        })
    }
    
    response = lambda_handler(test_event, None)
    print(json.dumps(response, indent=2))
