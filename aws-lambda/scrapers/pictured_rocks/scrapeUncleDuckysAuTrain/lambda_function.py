import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

import requests
from datetime import datetime
from bs4 import BeautifulSoup
import re

def scrape_uncleDuckysAuTrain(start_date, end_date, num_adults, num_kids):
    # Calculate total travelers
    num_travelers = num_adults + num_kids
    
    # Initialize results dictionary for the accommodations
    results = {
        "tent": {"available": False, "price": None, "message": "Not available"},
        "lodging": {"available": False, "price": None, "message": "Not available"},
    }
    
    # Check if start date is before May 23, 2025
    start_month, start_day, start_year = map(int, start_date.split('/'))
    if start_year < 25 or (start_year == 25 and (start_month < 5 or (start_month == 5 and start_day < 23))):
        error_message = "Not available before May 23, 2025"
        results["tent"]["message"] = error_message
        results["lodging"]["message"] = error_message
        return results

    # Function to process results for each category
    def process_category(category_id, category_name, num_travelers):
        try:
            # Format the start and end dates
            start_date_formatted = datetime.strptime(start_date, '%m/%d/%y').strftime('%Y-%m-%d')
            end_date_formatted = datetime.strptime(end_date, "%m/%d/%y").strftime("%Y-%m-%d")
            cf_month = f"{start_date_formatted[:4]}{start_date_formatted[5:7]}01"  # Extract year and month for cf-month

            # Set up URL and query parameters - using the correct domain from the headers
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
                "category_id": category_id,
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
                "x-requested-with": "XMLHttpRequest",
                "referer": "https://paddlersvillage.checkfront.com/reserve/?inline=1&category_id=8%2C15%2C14%2C13%2C16%2C20&options=tabs&provider=droplet&ssl=1&src=https%3A%2F%2Fwww.paddlingmichigan.com"
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
                return {"available": False, "price": None, "message": f"No {category_name} data found."}

            soup = BeautifulSoup(inventory, 'html.parser')
            
            # Check for "Nothing available" message
            unavailable = soup.find_all(string="Nothing available for the dates selected.")
            if unavailable:
                return {"available": False, "price": None, "message": f"No {category_name} options available."}
                
            all_stay_containers = soup.find_all("div", class_="cf-item-data")
            
            if not all_stay_containers:
                return {"available": False, "price": None, "message": f"No {category_name} options found."}

            best_option = None
            best_price = float('inf')
            
            for container in all_stay_containers:
                # Find the item title and summary section
                title_summary = container.find(class_="cf-item-title-summary")
                if not title_summary:
                    continue
                
                # Extract item name from cf-title > h2
                title_div = title_summary.find(class_="cf-title")
                if not title_div:
                    continue
                    
                # Find the h2 tag with the item name
                h2_tag = title_div.find('h2')
                if not h2_tag:
                    continue
                    
                # Extract the full item name and clean it up
                item_name_raw = h2_tag.text
                # Remove multiple spaces, tabs, newlines, and trailing periods
                item_name = re.sub(r'\s+', ' ', item_name_raw).strip().rstrip('.')
                
                # Find price element
                price_div = title_div.find(class_="cf-price")
                if not price_div or not price_div.find("strong") or not price_div.find("strong").find("span"):
                    continue
                    
                try:
                    price_span = price_div.find("strong").find("span")
                    price_text = price_span.text.replace('$', '').strip()
                    
                    # Handle range of prices if present
                    if ' - ' in price_text:
                        low_price, high_price = map(float, price_text.split(' - '))
                        price = (low_price + high_price) / 2
                    else:
                        price = float(price_text)
                        
                    # Keep track of the lowest price option
                    if price < best_price:
                        best_price = price
                        best_option = item_name
                except (ValueError, AttributeError) as e:
                    print(f"Error parsing {category_name} price: {e}")
                    continue

            if best_option and best_price != float('inf'):
                return {
                    "available": True, 
                    "price": best_price, 
                    "message": f"${best_price:.2f} per night - {best_option}"
                }
            else:
                return {
                    "available": False, 
                    "price": None, 
                    "message": f"No {category_name} options available."
                }
        
        except requests.exceptions.RequestException as e:
            print(f"Network error for {category_name}: {e}")
            return {"available": False, "price": None, "message": f"Network error occurred for {category_name}."}
        except ValueError as ve:
            print(f"JSON parsing error for {category_name}: {ve}")
            return {"available": False, "price": None, "message": f"Data parsing error for {category_name}."}
        except Exception as e:
            print(f"Error processing {category_name}: {str(e)}")
            traceback.print_exc()
            return {"available": False, "price": None, "message": f"Error processing {category_name}: {str(e)}"}
    
    # Process tent category
    results["tent"] = process_category("14", "tent", num_travelers)
    
    # For lodging, check yurts first (if group size <= 5), then platform tents
    if num_travelers > 5:
        # Skip yurts and only check platform tents for large groups
        platform_tent_result = process_category("15", "platform tent", num_travelers)
        if platform_tent_result["available"]:
            results["lodging"] = platform_tent_result
    else:
        # For smaller groups, check yurts first
        yurt_result = process_category("16", "yurt", num_travelers)
        if yurt_result["available"]:
            # If yurts are available, use them for lodging
            results["lodging"] = yurt_result
        else:
            # If no yurts, check platform tents as fallback
            platform_tent_result = process_category("15", "platform tent", num_travelers)
            if platform_tent_result["available"]:
                results["lodging"] = platform_tent_result
    
    return results

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
        print(f"Traceback: {error_traceback}")
        
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
            'numAdults': 6,
            'numKids': 0
        })
    }
    
    response = lambda_handler(test_event, None)
    print(json.dumps(response, indent=2))
