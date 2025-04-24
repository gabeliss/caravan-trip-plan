# Caravan Trip Planner - AWS Lambda Scrapers

This directory contains the AWS Lambda implementation of the scraper functions for the Caravan Trip Planner application.

## Architecture

Instead of running all scrapers directly in the main application server, each scraper is implemented as a separate AWS Lambda function. This provides several advantages:

1. **Improved Performance**: Each scraper gets dedicated resources, eliminating resource contention
2. **Better Scalability**: AWS Lambda automatically scales to handle concurrent requests
3. **Fault Isolation**: If one scraper fails, it doesn't affect the others
4. **Cost Efficiency**: You only pay for the compute time you use

## Directory Structure

```
aws-lambda/
├── scrapers/            # All scraper Lambda functions
│   ├── traverse_city/   # Traverse City scrapers
│   ├── mackinac_city/   # Mackinac City scrapers
│   └── pictured_rocks/  # Pictured Rocks scrapers
├── serverless.yml       # Serverless Framework configuration
├── requirements.txt     # Python dependencies
├── package.json         # Node.js package configuration
└── README.md            # This file
```

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (>= 14.x)
- [AWS CLI](https://aws.amazon.com/cli/) configured with your credentials
- [Serverless Framework](https://www.serverless.com/)
- Python 3.9+

### Installation

1. Install the Serverless Framework globally:

```bash
npm install -g serverless
```

2. Install project dependencies:

```bash
npm install
```

3. Install Python dependencies:

```bash
pip install -r requirements.txt
```

### Converting Scrapers to Lambda Functions

If you need to update the Lambda functions from the original scrapers, run:

```bash
python create_lambda_scrapers.py
```

This script will:

1. Copy all scraper files from the backend to the aws-lambda/scrapers directory
2. Wrap each scraper function with the necessary Lambda handler code
3. Copy or create **init**.py files in the appropriate directories

### Deployment

Deploy to AWS using the Serverless Framework:

```bash
serverless deploy
```

For production deployment:

```bash
serverless deploy --stage prod
```

After deployment, note the API Gateway URL in the output. You'll need to set this as the `LAMBDA_BASE_URL` environment variable in your backend.

### Testing

You can test individual Lambda functions locally using:

```bash
serverless invoke local -f scrapeTimberRidge -d '{"body": "{\"startDate\": \"06/29/25\", \"endDate\": \"07/02/25\", \"numAdults\": 2, \"numKids\": 0}"}'
```

Or test the deployed function:

```bash
serverless invoke -f scrapeTimberRidge -d '{"body": "{\"startDate\": \"06/29/25\", \"endDate\": \"07/02/25\", \"numAdults\": 2, \"numKids\": 0}"}'
```

## Usage in the Main Application

1. Set the `LAMBDA_BASE_URL` environment variable in your backend to the API Gateway URL from the deployment.
2. Use the updated `app_lambda.py` file which calls the Lambda functions instead of running scrapers directly.

## Troubleshooting

- **Cold Start Latency**: Lambda functions may experience "cold start" latency when they haven't been used recently. For production, consider using Provisioned Concurrency for frequently used scrapers.
- **Timeout Issues**: If a scraper takes too long, increase the `timeout` setting in serverless.yml.
- **Memory Issues**: For scrapers that process a lot of data, increase the `memorySize` setting.
- **Permission Issues**: Ensure that AWS credentials have adequate permissions for CloudFormation, IAM, Lambda, API Gateway, and CloudWatch Logs.
