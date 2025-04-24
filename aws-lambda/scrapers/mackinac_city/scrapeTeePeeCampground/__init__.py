"""
Scrapeteepeecampground package for Lambda function.

This package contains only the necessary imports for the Lambda function.
"""

# Import only what's needed for this specific Lambda function
from .lambda_function import scrape_teePeeCampground

__all__ = [
    'scrape_teePeeCampground'
]
