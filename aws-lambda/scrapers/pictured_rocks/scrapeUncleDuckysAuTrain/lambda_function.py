import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

import requests
from datetime import datetime
from bs4 import BeautifulSoup

def scrape_uncleDuckysAuTrain(start_date, end_date, num_adults, num_kids):
    # Check if start date is before May 23, 2025
    start_month, start_day, start_year = map(int, start_date.split('/'))
    if start_year < 25 or (start_year == 25 and (start_month < 5 or (start_month == 5 and start_day < 23))):
        return {"available": False, "price": None, "message": "Not available before May 23, 2025"}

    try:
        # Format the start and end dates
        start_date_formatted = datetime.strptime(start_date, '%m/%d/%y').strftime('%Y-%m-%d')
        end_date_formatted = datetime.strptime(end_date, "%m/%d/%y").strftime("%Y-%m-%d")
        cf_month = f"{start_date_formatted[:4]}{start_date_formatted[5:7]}01"  # Extract year and month for cf-month

        # Set up URL and query parameters
        url = "https://paddlersvillage.checkfront.com/reserve/inventory/"
        params = {
            "inline": "1",
            "header": "hide",
            "options": "tabs",
            "src": "https://www.paddlingmichigan.com",
            "filter_category_id": "8,15,14,13,16,20",
            "ssl": "1",
            "provider": "droplet",
            "filter_item_id": "",
            "customer_id": "",
            "original_start_date": "",
            "original_end_date": "",
            "date": "",
            "language": "",
            "cacheable": "1",
            "category_id": "14",
            "view": "",
            "start_date": start_date_formatted,
            "end_date": end_date_formatted,
            "keyword": "",
            "cf-month": cf_month
        }

        # Set up headers
        headers = {
            "accept": "*/*",
            "accept-encoding": "gzip, deflate, br, zstd",
            "accept-language": "en-US,en;q=0.9",
            "sec-ch-ua": '"Chromium";v="128", "Not;A=Brand";v="24", "Google Chrome";v="128"',
            "sec-ch-ua-mobile": "?0",
            "sec-ch-ua-platform": '"macOS"',
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
            "x-newrelic-id": "Vg4FUF9WCxABVlVbAgIFUFAG",
            "x-requested-with": "XMLHttpRequest"
        }

        # Use a session to handle cookies automatically
        session = requests.Session()
        response = session.get(url, headers=headers, params=params, timeout=30)

        # Raise an HTTPError for unsuccessful status codes
        response.raise_for_status()

        # Parse JSON and HTML
        data = response.json()
        inventory = data.get('inventory')
        if not inventory:
            return {"available": False, "price": None, "message": "No inventory data found."}

        soup = BeautifulSoup(inventory, 'html.parser')
        all_stay_containers = soup.find_all("div", class_="cf-item-data")
        
        if not all_stay_containers:
            return {"available": False, "price": None, "message": "No options available."}

        min_price = float('inf')
        for container in all_stay_containers:
            price_div = container.find("div", class_="cf-price")
            if price_div:
                price_span = price_div.find("strong").find("span")
                if price_span:
                    try:
                        price_text = price_span.text.replace('$', '').strip()
                        if ' - ' in price_text:
                            # Handle range of prices
                            low_price, high_price = map(float, price_text.split(' - '))
                            price = (low_price + high_price) / 2
                        else:
                            # Handle single price
                            price = float(price_text)
                        min_price = min(min_price, price)
                    except ValueError:
                        print(f"Failed to parse price: {price_span.text}")

        if min_price == float('inf'):
            return {"available": False, "price": None, "message": "No options available."}
        else:
            return {"available": True, "price": min_price, "message": f"${min_price:.2f} per night"}
    
    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return {"available": False, "price": None, "message": "Network error occurred."}
    except ValueError as ve:
        print(f"JSON parsing error: {ve}")
        return {"available": False, "price": None, "message": "Data parsing error."}



def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeUncleDuckysAuTrain scraper.
    
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
        result = scrape_uncleDuckysAuTrain(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Uncleduckysautrain"
        
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
        print(f"Error in Uncleduckysautrain Lambda: {str(e)}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Uncleduckysautrain",
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
