"""
Traverse City package for Lambda function.

This package contains only the necessary imports for the Lambda function.
"""

# Import only what's needed for this specific Lambda function
from .scrapeAnchorInn import scrape_anchorInn

__all__ = [
    'scrape_anchorInn'
]
