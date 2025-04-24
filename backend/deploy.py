"""
Entry point for Render deployment. 
This file uses the Lambda-based version of the application which doesn't depend on local scrapers.
"""

# Import dotenv to load environment variables from .env file
from dotenv import load_dotenv
import os

# Load environment variables
load_dotenv()

# Log important environment variables for debugging
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
logger.info(f"AWS_API_URL: {os.environ.get('AWS_API_URL', 'Not set')}")
logger.info(f"FLASK_ENV: {os.environ.get('FLASK_ENV', 'Not set')}")

# Import from app.py which now contains the Lambda-based code
from app import app

# This will be used by Gunicorn to run the application
if __name__ == "__main__":
    app.run() 