import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

import requests
from datetime import datetime
from bs4 import BeautifulSoup

def scrape_uncleDuckysPaddlersVillage(start_date_str, end_date_str, num_adults, num_kids=0):
    # Calculate num_travelers from num_adults and num_kids
    num_travelers = num_adults + num_kids

    # Initialize results dictionary
    results = {}

    start_date = datetime.strptime(start_date_str, '%m/%d/%y').strftime('%Y-%m-%d')
    end_date = datetime.strptime(end_date_str, '%m/%d/%y').strftime('%Y-%m-%d')

    url = 'https://paddlersvillage.checkfront.com/reserve/inventory/'

    headers = {
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-US,en;q=0.9',
        'Connection': 'keep-alive',
        'Host': 'paddlersvillage.checkfront.com',
        'Referer': 'https://paddlersvillage.checkfront.com/reserve/?inline=1&category_id=3%2C2%2C4%2C9&provider=droplet&ssl=1&src=https%3A%2F%2Fwww.paddlingmichigan.com',
        'Sec-Fetch-Dest': 'empty',
        'Sec-Fetch-Mode': 'cors',
        'Sec-Fetch-Site': 'same-origin',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15',
        'X-Requested-With': 'XMLHttpRequest'
    }

    # Function to process results for each category
    def process_category(category_id, category_name):
        params = {
            'inline': '1',
            'header': 'hide',
            'src': 'https://www.paddlingmichigan.com',
            'filter_category_id': '3,2,4,9',
            'ssl': '1',
            'provider': 'droplet',
            'filter_item_id': '',
            'customer_id': '',
            'original_start_date': '',
            'original_end_date': '',
            'date': '',
            'language': '',
            'cacheable': '1',
            'category_id': category_id,
            'view': '',
            'start_date': start_date,
            'end_date': end_date,
            'keyword': '',
            'cf-month': start_date[:7].replace('-', '') + '01'
        }

        try:
            response = requests.get(url, params=params, headers=headers)
            if response.status_code == 200:
                data = response.json()
                inventory = data.get("inventory", "")

                if not inventory:
                    return {"available": False, "price": None, "message": f"No {category_name} data available."}

                soup = BeautifulSoup(inventory, 'html.parser')
                
                unavailable = soup.find_all(string="Nothing available for the dates selected.")
                if unavailable:
                    return {"available": False, "price": None, "message": f"No {category_name} options available."}
                else:
                    items = soup.find_all(class_="cf-item-data")
                    if not items:
                        return {"available": False, "price": None, "message": f"No {category_name} options found."}
                    
                    price = None
                    item_name = None
                    
                    for item in items:
                        # Find the item title and summary section
                        title_summary = item.find(class_="cf-item-title-summary")
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
                            
                        # Extract the full item name and remove any trailing/leading whitespace
                        item_name_candidate = h2_tag.text.strip()
                        
                        # Find the item summary for checking sleeps capacity
                        item_summary = title_summary.find(class_="cf-item-summary")
                        if not item_summary:
                            continue
                            
                        # Extract text from p tag to check capacity
                        p_tag = item_summary.find('p')
                        if not p_tag:
                            continue
                            
                        p_tag_text = p_tag.get_text().strip()
                        
                        # Find price element - it's now in the cf-title div
                        price_element = title_div.find(class_="cf-price")
                        if not price_element or not price_element.strong or not price_element.strong.span:
                            continue
                            
                        try:
                            if num_travelers > 5:
                                if "Sleeps 8" in p_tag_text:
                                    price_text = price_element.strong.span.text.strip("$")
                                    if price_text:
                                        price = float(price_text)
                                        item_name = item_name_candidate
                                        break
                            else:
                                if "Sleeps 5" in p_tag_text:
                                    price_text = price_element.strong.span.text.strip("$")
                                    if price_text:
                                        price = float(price_text)
                                        item_name = item_name_candidate
                                        break
                        except (ValueError, AttributeError) as e:
                            print(f"Error parsing {category_name} price: {e}")
                            continue
                    
                    if price is not None and item_name:
                        return {"available": True, "price": price, "message": f"${price:.2f} per night - {item_name}"}
                    else:
                        return {"available": False, "price": None, "message": f"No suitable {category_name} found for your group size."}
            else:
                print(f"Failed to retrieve {category_name} data:", response.status_code)
                return {"available": False, "price": None, "message": f"Failed to retrieve {category_name} data"}
        except Exception as e:
            print(f"Error processing {category_name}: {str(e)}")
            traceback.print_exc()
            return {"available": False, "price": None, "message": f"Error processing {category_name}: {str(e)}"}

    # Get results for yurts (category_id = 2)
    results["yurt"] = process_category("2", "yurt")
    
    # Get results for platform tents (category_id = 4)
    results["platform_tent"] = process_category("4", "platform tent")
    
    return results



def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeUncleDuckysPaddlersVillage scraper.
    
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
        result = scrape_uncleDuckysPaddlersVillage(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Uncleduckyspaddlersvillage"
        
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
        print(f"Error in Uncleduckyspaddlersvillage Lambda: {str(e)}")
        print(f"Traceback: {error_traceback}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Uncleduckyspaddlersvillage",
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
