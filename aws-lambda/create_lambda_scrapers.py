#!/usr/bin/env python
import os
import shutil
import re
import glob
import traceback

# Define source and destination directories
SOURCE_DIR = '../backend/scrapers'
DEST_DIR = 'scrapers'

# Template for the Lambda wrapper - using triple-quoted string with explicit braces for Python format strings
LAMBDA_WRAPPER_TEMPLATE = """import json
# Only import datetime module if it's not already imported in the original code
import sys
import os
import traceback

{original_code}

def lambda_handler(event, context):
    \"\"\"
    AWS Lambda handler for the {scraper_name} scraper.
    
    Args:
        event (dict): AWS Lambda event object
        context (object): AWS Lambda context object
    
    Returns:
        dict: API Gateway response object
    \"\"\"
    try:
        # Parse the request body
        if event.get('body'):
            try:
                body = json.loads(event['body'])
            except Exception as e:
                return {{
                    'statusCode': 400,
                    'body': json.dumps({{
                        'message': f'Error parsing request body: {{str(e)}}'
                    }})
                }}
        else:
            return {{
                'statusCode': 400,
                'body': json.dumps({{
                    'message': 'Missing request body'
                }})
            }}
        
        # Extract parameters
        start_date = body.get('startDate')
        end_date = body.get('endDate')
        num_adults = body.get('numAdults', 2)
        num_kids = body.get('numKids', 0)
        
        if not all([start_date, end_date]):
            return {{
                'statusCode': 400,
                'body': json.dumps({{
                    'message': 'Missing required parameters'
                }})
            }}
        
        # Call the scraper function
        result = {scraper_function_name}(start_date, end_date, num_adults, num_kids)
        
        # Add timestamp and scraper name
        from datetime import datetime
        result['timestamp'] = datetime.now().isoformat()
        result['scraper'] = "{scraper_display_name}"
        
        # Return the result
        return {{
            'statusCode': 200,
            'body': json.dumps(result),
            'headers': {{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }}
        }}
        
    except Exception as e:
        error_traceback = traceback.format_exc()
        print(f"Error in {scraper_display_name} Lambda: {{str(e)}}")
        
        # Get current time for timestamp
        from datetime import datetime
        current_time = datetime.now().isoformat()
        
        return {{
            'statusCode': 500,
            'body': json.dumps({{
                'message': f'Error: {{str(e)}}',
                'scraper': "{scraper_display_name}",
                'timestamp': current_time
            }}),
            'headers': {{
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': 'true'
            }}
        }}


# This is used for local testing
if __name__ == '__main__':
    # Test the function with sample event
    test_event = {{
        'body': json.dumps({{
            'startDate': '06/29/25',
            'endDate': '07/02/25',
            'numAdults': 2,
            'numKids': 0
        }})
    }}
    
    response = lambda_handler(test_event, None)
    print(json.dumps(response, indent=2))
"""

# Template for Lambda-specific __init__.py files
LAMBDA_INIT_TEMPLATE = '''"""
{module_name} package for Lambda function.

This package contains only the necessary imports for the Lambda function.
"""

# Import only what's needed for this specific Lambda function
from .{scraper_file} import {scraper_function}

__all__ = [
    '{scraper_function}'
]
'''

def sanitize_function_name(name):
    """Convert a function name to be PEP8 compliant"""
    # Replace camelCase with snake_case
    s1 = re.sub('(.)([A-Z][a-z]+)', r'\1_\2', name)
    return re.sub('([a-z0-9])([A-Z])', r'\1_\2', s1).lower()

def clean_source_code(content):
    """Remove the main function and if __name__ == '__main__' block from the source code"""
    # Remove any if __name__ == '__main__' block
    content = re.sub(r'if\s+__name__\s*==\s*[\'"]__main__[\'"]\s*:\s*[\r\n]+\s+[\s\S]*?(?=\n\n|\Z)', '', content)
    
    # Remove main function if it exists
    content = re.sub(r'def\s+main\s*\(\s*\).*?:[\r\n]+\s+[\s\S]*?(?=\n\n|\Z)', '', content)
    
    # Clean up extra blank lines
    content = re.sub(r'\n{3,}', '\n\n', content)
    
    return content

def create_lambda_init_file(directory, scraper_file, function_name):
    """Create a Lambda-specific __init__.py file for a scraper."""
    # Extract the module name from the directory path
    module_name = os.path.basename(directory)
    
    # Create the Lambda-specific __init__.py content
    init_content = LAMBDA_INIT_TEMPLATE.format(
        module_name=module_name.replace('_', ' ').title(),
        scraper_file=scraper_file,
        scraper_function=function_name
    )
    
    # Write the Lambda-specific __init__.py file
    init_path = os.path.join(directory, '__init__.py')
    with open(init_path, 'w') as f:
        f.write(init_content)
    
    print(f"Created Lambda-specific __init__.py for {function_name} at {init_path}")

def process_scraper_file(file_path):
    """Process a scraper file to create a Lambda-compatible version"""
    # Extract directory and file name
    dir_name = os.path.dirname(file_path)
    file_name = os.path.basename(file_path)
    
    if file_name == '__init__.py' or file_name == 'scrapeMidnrReservations.py':
        return
    
    # Determine destination path
    relative_dir = os.path.relpath(dir_name, SOURCE_DIR)
    
    # Create a directory specific to this scraper to avoid __init__.py conflicts
    scraper_name = file_name.replace('.py', '')
    dest_path = os.path.join(DEST_DIR, relative_dir, scraper_name)
    
    # Create destination directory if it doesn't exist
    os.makedirs(dest_path, exist_ok=True)
    
    # Read the original file
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Clean the source code
    content = clean_source_code(content)
    
    # Extract function name using regex
    function_match = re.search(r'def\s+(scrape_\w+)\s*\(', content)
    if not function_match:
        print(f"Warning: Could not find scraper function in {file_path}")
        return
    
    function_name = function_match.group(1)
    
    # Create a display name from the function name
    display_name = function_name.replace('scrape_', '').replace('_', ' ').title()
    
    # Create the Lambda wrapper
    lambda_code = LAMBDA_WRAPPER_TEMPLATE.format(
        original_code=content,
        scraper_name=scraper_name,
        scraper_function_name=function_name,
        scraper_display_name=display_name
    )
    
    # Write the Lambda-compatible file - keep original name but place in scraper-specific directory
    dest_file = os.path.join(dest_path, 'lambda_function.py')
    with open(dest_file, 'w') as f:
        f.write(lambda_code)
    
    # Create a Lambda-specific __init__.py file
    create_lambda_init_file(dest_path, 'lambda_function', function_name)
    
    print(f"Created Lambda function for {function_name} at {dest_file}")

def copy_init_files():
    """Copy or create __init__.py files in the destination directories"""
    # Create an __init__.py file in the root scrapers directory
    with open(os.path.join(DEST_DIR, '__init__.py'), 'w') as f:
        f.write('''"""
AWS Lambda Scrapers Package

This empty __init__.py file is necessary for Python packaging to work properly.
It allows Python to recognize this directory as a package and import modules from it.
"""
''')
    
    # We don't need to copy the module-level __init__.py files anymore
    # since we create Lambda-specific ones in the process_scraper_file function

def copy_midnr_file():
    """Copy the MIDNR reservations file if it exists"""
    midnr_file = os.path.join(SOURCE_DIR, 'scrapeMidnrReservations.py')
    if os.path.exists(midnr_file):
        # Create a directory specific to this scraper
        scraper_name = 'midnrReservations'
        dest_path = os.path.join(DEST_DIR, scraper_name)
        os.makedirs(dest_path, exist_ok=True)
        
        # Copy the file to reference
        shutil.copy2(midnr_file, os.path.join(DEST_DIR, 'scrapeMidnrReservations.py'))
        print(f"Copied {midnr_file} to {DEST_DIR}")
        
        # Create a Lambda wrapper for it
        with open(midnr_file, 'r') as f:
            content = f.read()
        
        # Clean the source code
        content = clean_source_code(content)
        
        function_match = re.search(r'def\s+(scrape_midnrReservations)\s*\(', content)
        if function_match:
            function_name = function_match.group(1)
            
            # Create a display name from the function name
            display_name = function_name.replace('scrape_', '').replace('_', ' ').title()
            
            # Create the Lambda wrapper
            lambda_code = LAMBDA_WRAPPER_TEMPLATE.format(
                original_code=content,
                scraper_name=scraper_name,
                scraper_function_name=function_name,
                scraper_display_name=display_name
            )
            
            # Write the Lambda-compatible file
            dest_file = os.path.join(dest_path, 'lambda_function.py')
            with open(dest_file, 'w') as f:
                f.write(lambda_code)
            
            # Create a Lambda-specific __init__.py file
            create_lambda_init_file(dest_path, 'lambda_function', function_name)
            
            print(f"Created Lambda function for {function_name} at {dest_file}")

def main():
    """Main function to process all scraper files"""
    # Find all Python files in the source directory
    scraper_files = glob.glob(os.path.join(SOURCE_DIR, '**', '*.py'), recursive=True)
    
    # Process each file
    for file_path in scraper_files:
        process_scraper_file(file_path)
    
    # Copy or create __init__.py files
    copy_init_files()
    
    # Copy MIDNR reservations file
    copy_midnr_file()

if __name__ == '__main__':
    main() 