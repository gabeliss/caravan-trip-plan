import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, TemplateId, Personalization
from typing import Dict, Any, List, Optional

logger = logging.getLogger(__name__)

def send_confirmation_email(
    to_email: str,
    first_name: str,
    confirmation_id: str,
    trip_link: str
) -> Dict[str, Any]:
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        from_email = Email(os.environ.get('SENDGRID_FROM_EMAIL'))
        subject = f"Your Caravan Trip Plan is Ready!"
        
        # Create dynamic template data
        template_data = {
            "first_name": first_name,
            "confirmation_number": confirmation_id,
            "trip_link": trip_link
        }
        
        # Create personalization object
        personalization = Personalization()
        personalization.add_to(To(to_email))
        personalization.dynamic_template_data = template_data
        
        # Build email with plain text for backup
        text_content = f"""
            Confirmation Number: {confirmation_id}
            
            Hi {first_name},
            
            Thanks for booking your trip through Caravan Trip Plan! Your personalized trip plan is now live, and we're excited to help you hit the road.
            
            Inside your Trip Itinerary Portal, you'll find:
            - Booking links for all of your selected campgrounds and stays
            - Your full day-by-day itinerary, including routes, activity recommendations, and packing lists
            - Helpful tips and info to make the most of your trip
            
            Important: Your sites are not yet booked. Please use the provided links in your portal to reserve your spots directly with each campground or lodging provider.
            
            To access your itinerary and booking links, just visit: {trip_link}
            
            If you have any questions or need additional support, feel free to contact us at {os.environ.get('ADMIN_EMAIL')}.
            
            Thank you for choosing Caravan Trip Plan! We're honored to be part of your road trip.
            
            Safe travels,
            The Caravan Trip Plan Team
            <a href="https://caravan-trip-plan.com">caravan-trip-plan.com</a>
            <a href="https://instagram.com/caravantripplan">instagram.com/caravantripplan</a>
        """
        
        message = Mail(
            from_email=from_email,
            subject=subject,
            plain_text_content=Content("text/plain", text_content)
        )
        
        # Add the personalization to the message
        message.add_personalization(personalization)
        
        # HTML email (in a real implementation, we would use a SendGrid template ID)
        html_content = f"""
            <html>
            <head>
                <style>
                    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }}
                    h1 {{ color: #2C5545; }}
                    .header-img {{ width: 100%; }}
                    .container {{ padding: 20px; }}
                    .confirmation {{ color: #666; margin-bottom: 20px; }}
                    ul {{ padding-left: 20px; }}
                    li {{ margin-bottom: 10px; }}
                    .important {{ background-color: #FBF7EF; padding: 15px; border-radius: 5px; margin: 20px 0; }}
                    .footer {{ margin-top: 30px; color: #666; }}
                    a {{ color: #2C5545; text-decoration: underline; }}
                </style>
            </head>
            <body>
                <div>
                    <img class="header-img" src="https://caravan-bucket.s3.us-east-2.amazonaws.com/images-caravan/email/email1.png" alt="Caravan Trip Plan">
                    <div class="container">
                        <div class="confirmation">Confirmation Number: {confirmation_id}</div>
                        <h1>Hi {first_name},</h1>
                        <p>Thanks for booking your trip through Caravan Trip Plan! Your personalized trip plan is now live, and we're excited to help you hit the road.</p>
                        <p>Inside your Trip Itinerary Portal, you'll find:</p>
                        <ul>
                            <li>Booking links for all of your selected campgrounds and stays</li>
                            <li>Your full day-by-day itinerary, including routes, activity recommendations, and packing lists</li>
                            <li>Helpful tips and info to make the most of your trip</li>
                        </ul>
                        <div class="important">
                            <p><strong>Important:</strong> Your sites are not yet booked. Please use the provided links in your portal to reserve your spots directly with each campground or lodging provider.</p>
                        </div>
                        <p>To access your itinerary and booking links, just <a href="{trip_link}">click here</a>.</p>
                        <p>If you have any questions or need additional support, feel free to contact us at <a href="mailto:{os.environ.get('ADMIN_EMAIL')}">{os.environ.get('ADMIN_EMAIL')}</a>.</p>
                        <p>Thank you for choosing Caravan Trip Plan! We're honored to be part of your road trip.</p>
                        <div class="footer">
                            <p>Safe travels,<br>
                            The Caravan Trip Plan Team<br>
                            <a href="https://caravan-trip-plan.com">caravan-trip-plan.com</a><br>
                            <a href="https://instagram.com/caravantripplan">instagram.com/caravantripplan</a>
                            </p>
                            <img src="https://caravan-bucket.s3.us-east-2.amazonaws.com/images-caravan/email/email2.png" alt="Caravan Footer" style="width: 100%;">
                        </div>
                    </div>
                </div>
            </body>
            </html>
        """
        
        message.add_content(Content("text/html", html_content))
        
        response = sg.send(message)
        
        logger.info(f"Email sent to {to_email}, status code: {response.status_code}")
        return {
            "status": "success",
            "status_code": response.status_code,
            "message": "Confirmation email sent successfully"
        }
    
    except Exception as e:
        logger.error(f"Error sending confirmation email: {str(e)}")
        return {
            "status": "error",
            "message": str(e)
        } 