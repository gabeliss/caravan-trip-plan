# Caravan Trip Plan Backend

This is the Flask backend for the Caravan Trip Plan application.

## Deployment Architecture

The backend is designed to work with AWS Lambda functions for all the scraper functionality:

- **AWS Lambda-Based Architecture**:
  - Uses AWS Lambda for scrapers implementation
  - No dependency on local scrapers module
  - Works consistently in both local development and production environments
  - Sends requests to AWS API Gateway endpoints for actual scraping

### Important Files

- `app.py` - Main application that uses AWS Lambda for scraping
- `deploy.py` - Entry point for Render deployment
- `Procfile` - Configures Render to use deploy.py
- `start.sh` - Alternative startup script for hosting platforms
- `requirements.txt` - Python dependencies, including Gunicorn for production

## Setup and Configuration

### Environment Variables

The following environment variables can be set to configure the application:

- `PORT`: The port to run the Flask server on (default: 5001)
- `FLASK_ENV`: Set to 'production' for production settings, otherwise development settings are used
- `FRONTEND_URL`: The URL of the frontend for CORS configuration (default: '\*')
- `AWS_API_URL`: The base URL of your AWS API Gateway (default: 'https://your-api-gateway-id.execute-api.us-east-1.amazonaws.com/dev') - **IMPORTANT**: This is used to connect to your AWS Lambda functions

You can set these variables in two ways:

1. Using a `.env` file in the backend directory (recommended for development)
2. Setting environment variables directly in your terminal

### Using the .env File

A `.env` file has been created in the backend directory with default values.
You should update the `AWS_API_URL` value with your actual AWS API Gateway URL after deployment.

```
# Example .env file
PORT=5001
FLASK_ENV=development
FRONTEND_URL=*
AWS_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

### Running Locally

1. Create a virtual environment:

   ```
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. Install dependencies:

   ```
   pip install -r requirements.txt
   ```

3. Run the application:
   ```
   python app.py  # Standard run mode
   # OR
   python deploy.py  # To test using the same entry point as Render
   ```

### Proxy Configuration

The backend acts as a proxy to AWS Lambda functions deployed through API Gateway. When a request comes in for campground availability, it forwards the request to the appropriate AWS Lambda function and returns the result.

To update the AWS API Gateway URL:

```bash
# For Linux/Mac
export AWS_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev

# For Windows
set AWS_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

Replace `your-api-id` with your actual API Gateway ID.

### Troubleshooting

If you see an error like:

```
Error checking availability: HTTPSConnectionPool(host='your-api-gateway-id.execute-api.us-east-1.amazonaws.com'... Failed to resolve
```

1. Check that your `.env` file contains the correct `AWS_API_URL` environment variable
2. Verify that the API Gateway URL is valid and accessible
3. On some systems, you may need to explicitly load the `.env` file by installing and using the `python-dotenv` package:
   ```python
   from dotenv import load_dotenv
   load_dotenv()  # Make sure this is called before accessing environment variables
   ```

### Deploying to Render

The application is configured to deploy on Render using:

1. `deploy.py` as the entry point
2. Gunicorn as the WSGI server
3. The Lambda-based version of the application

This configuration doesn't require local scrapers and works with the AWS Lambda backend.
