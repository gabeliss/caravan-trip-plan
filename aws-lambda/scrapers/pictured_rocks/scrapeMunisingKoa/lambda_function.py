import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

from bs4 import BeautifulSoup
import requests
import time
import random
from requests.exceptions import RequestException
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# List of user agents to rotate
USER_AGENTS = [
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.3.1 Safari/605.1.15",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
]

def scrape_munisingKoa(start_date, end_date, num_adults, num_kids=0, retry_count=0, max_retries=3):
    # Calculate num_travelers from num_adults and num_kids
    num_travelers = num_adults + num_kids
    
    # Add delay with jitter to avoid predictable patterns (higher delay on retries)
    delay = (2 + retry_count * 3) + random.uniform(0.5, 1.5)
    time.sleep(delay)
    
    check_in_date = f"{start_date[:6]}20{start_date[6:]}"
    check_out_date = f"{end_date[:6]}20{end_date[6:]}"

    get_url = "https://koa.com/campgrounds/pictured-rocks/"

    # Rotate user agents
    user_agent = random.choice(USER_AGENTS)
    
    headers = {
        "User-Agent": user_agent,
        "Referer": "https://koa.com/campgrounds/pictured-rocks/",
        "Origin": "https://koa.com",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.5",
        "Connection": "keep-alive",
    }

    session = requests.Session()

    try:
        logger.info(f"Making initial GET request (attempt {retry_count+1}/{max_retries+1})")
        response = session.get(get_url, headers=headers, timeout=10)
        response.raise_for_status() 

        soup = BeautifulSoup(response.text, 'html.parser')
        token = soup.find('input', {'name': '__RequestVerificationToken'})

        if token:
            token = token.get('value')
        else:
            logger.warning("Token not found in HTML. Check if the page structure has changed.")
            raise ValueError("Token not found in HTML. Check if the page structure has changed.")

        # Add a small delay between GET and POST
        time.sleep(1 + random.uniform(0.5, 1.0))

        post_url = "https://koa.com/campgrounds/pictured-rocks/reserve/"

        data = {
            "Reservation.SiteCategory": "A",
            "Reservation.CheckInDate": check_in_date,
            "Reservation.CheckOutDate": check_out_date,
            "Reservation.Adults": str(num_travelers),
            "Reservation.Kids": "0",
            "Reservation.Free": "0",
            "Reservation.Pets": "No",
            "Reservation.EquipmentType": "A",
            "Reservation.EquipmentLength": "0",
            "__RequestVerificationToken": token
        }

        logger.info("Making POST request")
        post_response = session.post(post_url, headers=headers, data=data, timeout=10)

        if post_response.status_code == 200 and post_response.text:
            soup = BeautifulSoup(post_response.text, 'html.parser')
            
            # Check if we've been rate limited (looking for error message)
            error_msg = soup.find('div', class_='alert-danger')
            if error_msg and "rate limit" in error_msg.text.lower():
                logger.warning("Rate limit detected in response")
                if retry_count < max_retries:
                    logger.info(f"Retrying with exponential backoff ({retry_count+1}/{max_retries})")
                    return scrape_munisingKoa(start_date, end_date, num_adults, num_kids, 
                                                 retry_count=retry_count+1, max_retries=max_retries)
                else:
                    error_message = "Rate limited after retries."
                    return {
                        "rv": {"available": False, "price": None, "message": error_message},
                        "tent": {"available": False, "price": None, "message": error_message},
                        "lodging": {"available": False, "price": None, "message": error_message}
                    }
            
            containers = soup.find_all('div', class_='reserve-sitetype-main-row')
            available_rv = False
            available_tent = False
            available_lodging = False
            cheapest_rv_price = 1000000
            cheapest_tent_price = 1000000
            cheapest_lodging_price = 1000000
            cheapest_rv_name = None
            cheapest_tent_name = None
            cheapest_lodging_name = None
            
            for container in containers:
                name_element = container.find('h4', class_='reserve-sitetype-title')
                if not name_element:
                    continue
                
                name = name_element.text.strip()
                price_container = container.find('div', class_='reserve-quote-per-night')
                
                if not price_container or not price_container.find('strong') or not price_container.find('strong').find('span'):
                    continue
                
                try:
                    price_text = price_container.find('strong').find('span').text.lstrip('$').split(' ')[0]
                    price = float(price_text)
                    
                    # Categorize based on name (simplified logic - can be refined later)
                    name_lower = name.lower()
                    if 'rv' in name_lower or 'full hook' in name_lower or 'pull-thru' in name_lower or 'hook-up' in name_lower:
                        if price < cheapest_rv_price:
                            cheapest_rv_price = price
                            available_rv = True
                            cheapest_rv_name = name
                    elif 'tent' in name_lower or 'primitive' in name_lower:
                        if price < cheapest_tent_price:
                            cheapest_tent_price = price
                            available_tent = True
                            cheapest_tent_name = name
                    elif 'cabin' in name_lower or 'lodge' in name_lower or 'cottage' in name_lower:
                        if price < cheapest_lodging_price:
                            cheapest_lodging_price = price
                            available_lodging = True
                            cheapest_lodging_name = name
                except (ValueError, AttributeError) as e:
                    logger.warning(f"Error parsing price: {e}")
                    continue
            
            # Initialize the results dictionary with all accommodation types
            results = {
                "rv": {"available": False, "price": None, "message": "No RV sites available."},
                "tent": {"available": False, "price": None, "message": "No tent sites available."},
                "lodging": {"available": False, "price": None, "message": "No lodging available."}
            }
            
            # Update with available options
            if available_rv:
                results["rv"] = {
                    "available": True, 
                    "price": cheapest_rv_price, 
                    "message": f"${cheapest_rv_price:.2f} per night - {cheapest_rv_name}"
                }
                
            if available_tent:
                results["tent"] = {
                    "available": True, 
                    "price": cheapest_tent_price, 
                    "message": f"${cheapest_tent_price:.2f} per night - {cheapest_tent_name}"
                }
                
            if available_lodging:
                results["lodging"] = {
                    "available": True, 
                    "price": cheapest_lodging_price, 
                    "message": f"${cheapest_lodging_price:.2f} per night - {cheapest_lodging_name}"
                }
                
            return results
        else:
            logger.warning(f"Unexpected status code: {post_response.status_code}")
            if retry_count < max_retries:
                return scrape_munisingKoa(start_date, end_date, num_adults, num_kids, 
                                             retry_count=retry_count+1, max_retries=max_retries)
            else:
                error_message = f"Error: Status code {post_response.status_code}"
                return {
                    "rv": {"available": False, "price": None, "message": error_message},
                    "tent": {"available": False, "price": None, "message": error_message},
                    "lodging": {"available": False, "price": None, "message": error_message}
                }
    
    except (RequestException, ValueError, Exception) as e:
        logger.error(f"Error during scraping: {str(e)}")
        if retry_count < max_retries:
            logger.info(f"Retrying with exponential backoff ({retry_count+1}/{max_retries})")
            return scrape_munisingKoa(start_date, end_date, num_adults, num_kids, 
                                         retry_count=retry_count+1, max_retries=max_retries)
        else:
            error_message = f"Error after retries: {str(e)}"
            return {
                "rv": {"available": False, "price": None, "message": error_message},
                "tent": {"available": False, "price": None, "message": error_message},
                "lodging": {"available": False, "price": None, "message": error_message}
            }


def lambda_handler(event, context):
    """
    AWS Lambda handler for the scrapeMunisingKoa scraper.
    
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
        result = scrape_munisingKoa(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "Munisingkoa"
        
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
        print(f"Error in Munisingkoa Lambda: {str(e)}")
        print(f"Traceback: {error_traceback}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': f'Error: {str(e)}',
                'scraper': "Munisingkoa",
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
