import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

from bs4 import BeautifulSoup
import requests
from datetime import datetime

def scrape_cabinsOfMackinaw(start_date_str, end_date_str, num_adults, num_kids=0):
    # Calculate num_travelers from num_adults and num_kids
    num_travelers = num_adults + num_kids
 
    session = requests.Session()
    session.get("https://ssl.mackinaw-city.com/newreservations/request.php?HotelId=13")

    url = "https://ssl.mackinaw-city.com/newreservations/request.php"

    cookie = session.cookies._cookies['ssl.mackinaw-city.com']['/']['PHPSESSID'].value

    headers = {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15',
        'Cookie': 'PHPSESSID=' + cookie,
        'Host': 'ssl.mackinaw-city.com',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive'
    }

    session.headers.update(headers)

    start_date = datetime.strptime(start_date_str, '%m/%d/%y')
    end_date = datetime.strptime(end_date_str, '%m/%d/%y')

    params = {
        'roomtype': 7,
        'selectdate': start_date.strftime('%m-%d-%Y'),
        'dayspan': 2,
        'numberrooms': 1,
        'numberguests': num_travelers,
        'ratetype': 'Internet Special',
        'submit_x': 'true'
    }

    response = session.get(url, headers=headers, params=params)

    if response.status_code == 200 and response.text:
        soup = BeautifulSoup(response.text, 'html.parser')

        cabins_data = {}
        
        table = soup.find_all('table', class_='data')[1]
        
        if table:
            tbody = table.find('tbody')
            
            if tbody:
                for row in tbody.find_all('tr'):
                    a_tag = row.find('a')
                    span_tag = row.find('span')
                    
                    if a_tag and span_tag:
                        title = a_tag.text.strip()
                        price = span_tag.text.strip()

                        cabins_data[title] = price
        
            pc1 = 'Private Chalet - 1 Room Queen Bed'
            pc2 = 'Private Chalet - 1 Room 2 Queen Beds'
            pc3 = 'Private Chalet - 2 Rooms, 2 Queen Beds and 2 TVs'
            pc4 = 'Private Chalet - 3 Rooms, 2 Queen beds, Sofabed in Living Area, 2 TVs'
            available = True
            price = -1
            if num_travelers <= 2:
                if pc1 in cabins_data and cabins_data[pc1] != 'not available':
                    price = cabins_data[pc1]
                else:
                    available = False
            elif num_travelers <= 4:
                if pc2 in cabins_data and cabins_data[pc2] != 'not available':
                    price = cabins_data[pc2]
                elif pc3 in cabins_data and cabins_data[pc3] != 'not available':
                    price = cabins_data[pc3]
                else:
                    available = False
            elif num_travelers <= 6:
                if pc4 in cabins_data and cabins_data[pc4] != 'not available':
                    price = cabins_data[pc4]
                else:
                    available = False 
            else:
                available = False 

            if available:
                price = price.strip("$")
                return {"available": True, "price": price, "message": "Available: $" + price + " per night"}
            else:
                return {"available": False, "price": None, "message": "Not available for selected dates."}              

    else:
        print("Failed to retrieve data, or data is empty.")



def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeCabinsOfMackinaw scraper.
    
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
        result = scrape_cabinsOfMackinaw(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Cabinsofmackinaw"
        
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
        print(f"Error in Cabinsofmackinaw Lambda: {str(e)}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Cabinsofmackinaw",
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
