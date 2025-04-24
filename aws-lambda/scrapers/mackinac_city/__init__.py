"""
Mackinac City package for Lambda function.

This package contains only the necessary imports for the Lambda function.
"""

# Import only what's needed for this specific Lambda function
from .scrapeStraitsStatePark import scrape_straitsStatePark

__all__ = [
    'scrape_straitsStatePark'
]
