import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

from datetime import datetime, timedelta
import requests
from bs4 import BeautifulSoup

def scrape_timberRidge(start_date, end_date, num_adults, num_kids):
    url = "https://bookingsus.newbook.cloud/timberridgeresort/api.php"
    headers = {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        "Accept": "*/*",
        "Origin": "https://bookingsus.newbook.cloud",
        "Referer": "https://bookingsus.newbook.cloud/timberridgeresort/index.php",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15",
        "X-Requested-With": "XMLHttpRequest"
    }
    
    def convert_date(date_str):
        date_obj = datetime.strptime(date_str, '%m/%d/%y')
        return date_obj.strftime('%b %d %Y')
    
    # Calculate the actual number of nights
    start_date_obj = datetime.strptime(start_date, '%m/%d/%y')
    end_date_obj = datetime.strptime(end_date, '%m/%d/%y')
    nights = (end_date_obj - start_date_obj).days
    
    start_date_formatted = convert_date(start_date)
    end_date_formatted = convert_date(end_date)

    results = {
        "rv": {"available": False, "price": None, "message": "Not available"},
        "tent": {"available": False, "price": None, "message": "Not available"},
        "lodging": {"available": False, "price": None, "message": "Not available"}
    }

    # First, make a request for tent/RV sites with equipment parameters
    tent_rv_data = {
        "newbook_api_action": "availability_chart_responsive",
        "available_from": start_date_formatted,
        "available_to": end_date_formatted,
        "nights": nights,
        "adults": num_adults,
        "children": num_kids,
        "infants": 0,
        "animals": 0,
        "equipment_type": 3,
        "equipment_length": 20
    }
    
    tent_rv_response = requests.post(url, headers=headers, data=tent_rv_data, timeout=30)
    
    # Process tent/RV results
    if tent_rv_response.status_code == 200:
        inventory = tent_rv_response.text
        soup = BeautifulSoup(inventory, 'html.parser')
        all_containers = soup.find_all("div", class_="newbook_online_category_details")
        
        # Process for tent and RV (they'll have the same values)
        tent_rv_result = {"available": False, "price": None, "message": "No options available."}
        
        for container in all_containers:
            a_tag = container.find("h3").find("a") if container.find("h3") else None
            if a_tag:
                stay_name = a_tag.text.strip()
                
                # Check if it's one of the tent/RV sites we're looking for
                if stay_name in ["Site Deluxe 30/50 amp", "Site Premium Super 30/50 amp"]:
                    book_now_button = container.find("button", class_="button", attrs={"aria-label": "Book now"})
                    price_span = container.find_all("span", class_="newbook_online_from_price_text")
                    
                    if book_now_button and price_span:
                        price = float(price_span[0].text.lstrip("$"))
                        tent_rv_result = {
                            "available": True,
                            "price": price,
                            "message": f"${price:.2f} per night - {stay_name}"
                        }
                        break  # Found a valid tent/RV site, no need to check further
        
        results["tent"] = tent_rv_result
        results["rv"] = tent_rv_result  # Same results for tent and RV
    else:
        # If the API request failed, set tent/RV types to unavailable
        error_message = "Failed to retrieve tent/RV data"
        results["tent"] = {"available": False, "price": None, "message": error_message}
        results["rv"] = {"available": False, "price": None, "message": error_message}
    
    # Now, make a second request for cabins without equipment parameters
    cabin_data = {
        "newbook_api_action": "availability_chart_responsive",
        "available_from": start_date_formatted,
        "available_to": end_date_formatted,
        "nights": nights,
        "adults": num_adults,
        "children": num_kids,
        "infants": 0,
        "animals": 0
    }
    
    cabin_response = requests.post(url, headers=headers, data=cabin_data, timeout=30)
    
    # Process cabin results
    if cabin_response.status_code == 200:
        inventory = cabin_response.text
        soup = BeautifulSoup(inventory, 'html.parser')
        all_containers = soup.find_all("div", class_="newbook_online_category_details")
        
        # Process for cabins
        cabin_stays = {}
        
        for container in all_containers:
            a_tag = container.find("h3").find("a") if container.find("h3") else None
            if a_tag:
                stay_name = a_tag.text.strip()
                
                # Skip if it's one of the tent/RV sites
                if stay_name in ["Site Deluxe 30/50 amp", "Site Premium Super 30/50 amp"]:
                    continue
                
                price_span = container.find_all("span", class_="newbook_online_from_price_text")
                if price_span:
                    # Find the "Book now" button
                    book_now_button = container.find("button", class_="button", attrs={"aria-label": "Book now"})
                    if book_now_button:
                        stay_price = float(price_span[0].text.lstrip("$"))
                        cabin_stays[stay_name] = stay_price
                    else:
                        cabin_stays[stay_name] = 'Unavailable'
                else:
                    cabin_stays[stay_name] = 'Unavailable'
        
        # Define cabin types
        bunkhouse = "Bunkhouse (Sleeps 10)"
        cabin_deluxe = "Cabin Deluxe (Sleeps 2.)"
        cottage = "Cottage (Sleeps 5)"
        cottage_premium = "Cottage Premium  (Sleeps 5)"
        park_home = "Park Home (Sleeps 5+)"
        premium_park_home = "Premium Park Home  (sleeps 7)"
        yurt_basic = "Yurt Basic Sleeps 5"
        yurt_deluxe = "Yurt Deluxe Sleeps 5"

        # Calculate total number of travelers
        num_travelers = num_adults + num_kids
        
        # Define priority lists based on number of travelers
        priority_list = []
        
        if num_travelers <= 2:
            priority_list = [cabin_deluxe, yurt_deluxe, yurt_basic, cottage, cottage_premium, park_home]
        elif num_travelers <= 5:
            priority_list = [yurt_deluxe, yurt_basic, cottage, cottage_premium, park_home]
        elif num_travelers <= 7:
            priority_list = [premium_park_home, bunkhouse]
        else:
            priority_list = [bunkhouse]
        
        # Try to find the first available option in the priority list
        selected_cabin = None
        selected_price = None
        
        for cabin_type in priority_list:
            if cabin_type in cabin_stays and cabin_stays[cabin_type] != 'Unavailable':
                selected_cabin = cabin_type
                selected_price = cabin_stays[cabin_type]
                break
        
        if selected_cabin and selected_price:
            results["lodging"] = {
                "available": True,
                "price": selected_price,
                "message": f"${selected_price:.2f} per night - {selected_cabin}"
            }
        else:
            results["lodging"] = {
                "available": False,
                "price": None,
                "message": "No suitable lodging available for the selected dates and party size."
            }
    else:
        # If the API request failed, set lodging type to unavailable
        error_message = "Failed to retrieve lodging data"
        results["lodging"] = {"available": False, "price": None, "message": error_message}
    
    return results

def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeTimberRidge scraper.
    
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
        result = scrape_timberRidge(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Timberridge"
        
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
        print(f"Error in Timberridge Lambda: {str(e)}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Timberridge",
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
