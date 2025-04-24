# Caravan Trip Plan Backend

This is the Flask backend for the Caravan Trip Plan application.

## Setup and Configuration

### Environment Variables

The following environment variables can be set to configure the application:

- `PORT`: The port to run the Flask server on (default: 5001)
- `FLASK_ENV`: Set to 'production' for production settings, otherwise development settings are used
- `FRONTEND_URL`: The URL of the frontend for CORS configuration (default: '\*')
- `AWS_API_URL`: The base URL of your AWS API Gateway (default: 'https://your-api-id.execute-api.us-east-1.amazonaws.com/dev')

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
   python app.py
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
