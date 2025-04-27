import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

from datetime import datetime
import requests

def scrape_fortSuperior(start_date, end_date, num_adults, num_kids):
    # Initialize results dictionary
    results = {}
    
    start_month, start_day, start_year = map(int, start_date.split('/'))
    if start_year < 25 or (start_year == 25 and (start_month < 5 or (start_month == 5 and start_day < 16))):
        results["tent"] = {"available": False, "price": None, "message": "Not available before May 16, 2025"}
        return results
        
    # Convert dates to timestamps in milliseconds
    start_timestamp = int(datetime.strptime(start_date, '%m/%d/%y').timestamp() * 1000)
    end_timestamp = int(datetime.strptime(end_date, '%m/%d/%y').timestamp() * 1000)

    # API URL
    url = "https://hotels.wixapps.net/api/rooms/search"

    # Payload
    payload = {
        "checkIn": str(start_timestamp),
        "checkOut": str(end_timestamp),
        "adults": str(num_adults + num_kids)
    }

    # Headers
    headers = {
        "accept": "application/json, text/plain, */*",
        "accept-encoding": "gzip, deflate, br, zstd",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json;charset=UTF-8",
        "origin": "https://hotels.wixapps.net",
        "referer": "https://hotels.wixapps.net/index.html/rooms/",
        "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"macOS"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
        "x-wix-hotels-user-lang": "en",
        "x-wix-instance": "e3V5_uiZIx5AVeNQI_FHABdSXKJTMzuM4gVL9oSpzVk.eyJpbnN0YW5jZUlkIjoiMmU5MGQ2YjktOWZlZC00MGNiLTlhMzItNzNlMWU3Yjk1ZDVkIiwiYXBwRGVmSWQiOiIxMzVhYWQ4Ni05MTI1LTYwNzQtNzM0Ni0yOWRjNmEzYzliY2YiLCJtZXRhU2l0ZUlkIjoiNTIwYTJjZDUtNjg4OC00NWFlLWI4ZDYtMTcxMzZiYmYyNTU5Iiwic2lnbkRhdGUiOiIyMDI0LTEwLTI1VDIxOjQ5OjQxLjYwMloiLCJ2ZW5kb3JQcm9kdWN0SWQiOiJob3RlbHMiLCJkZW1vTW9kZSI6ZmFsc2UsIm9yaWdpbkluc3RhbmNlSWQiOiIwYzFlYmI1ZC1mYTc2LTRkMDUtYWUyYS1lNjRiY2MyM2MyODkiLCJhaWQiOiI3ZDBlYTY5Zi03YWFmLTQyMTctYmFmNS04MDgxOWJlMDZiMWIiLCJiaVRva2VuIjoiN2M5YWZhNmMtZjc2NS0wNTY1LTIyZTQtNjRmMjhjMDY3ODA0Iiwic2l0ZU93bmVySWQiOiI4NGM4ZDM0Yi1mOWYyLTQyM2EtODFjYi04M2Y3YTI5ZTYzZGUifQ",
        "x-xsrf-token": "1729892982|vi-2-zPY5Kwr"
    }

    # Use a session to handle cookies
    session = requests.Session()
    response = session.post(url, headers=headers, json=payload, timeout=30)

    # Check if the response was successful and return the content
    if response.status_code == 200:
        inventory = response.json()
        for room in inventory:
            # if room['availableUnits'] == None:
            #     continue

            if "Canvas Tent Barrack" not in room['room']['name']:
                price = room['offer']['perNight']
                room_name = room['room']['name']
                results["tent"] = {
                    "available": True, 
                    "price": price, 
                    "message": f"${price:.2f} per night - {room_name}"
                }
                return results
        
        results["tent"] = {
            "available": False, 
            "price": None, 
            "message": "No tent options available."
        }
        return results
            
    else:
        print("Failed to retrieve data:", response)
        results["tent"] = {
            "available": False, 
            "price": None, 
            "message": "Failed to retrieve data"
        }
        return results
            



def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeFortSuperior scraper.
    
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
        result = scrape_fortSuperior(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Fortsuperior"
        
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
        print(f"Error in Fortsuperior Lambda: {str(e)}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Fortsuperior",
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
