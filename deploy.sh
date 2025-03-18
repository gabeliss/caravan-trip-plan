#!/bin/bash

# Install Vercel CLI if not already installed
if ! command -v vercel &> /dev/null
then
    echo "Installing Vercel CLI..."
    npm install -g vercel
fi

# Make sure we're logged in
vercel login

# Run type checking and linting before deploying
echo "Running type check..."
npm run lint || { echo "Linting failed!"; exit 1; }

# Deploy to production if --prod is passed, otherwise deploy to preview
if [ "$1" == "--prod" ]; then
    echo "Deploying to production..."
    vercel --prod
else
    echo "Deploying to preview environment..."
    vercel
fi

echo "Deployment complete!" 