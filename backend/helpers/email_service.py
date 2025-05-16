import os
import logging
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Email, To, Content, Personalization

logger = logging.getLogger(__name__)

def send_confirmation_email(
    to_email: str,
    first_name: str,
    confirmation_id: str,
    trip_link: str
) -> dict:
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        from_email = Email(os.environ.get('ADMIN_EMAIL'))
        subject = f"Your Caravan Trip Plan is Ready!"

        # Plain text fallback
        text_content = f"""\
Confirmation Number: {confirmation_id}

Hi {first_name},

Thanks for booking your trip through Caravan Trip Plan! Your personalized trip plan is now live.

Inside your Trip Itinerary Portal:
- Booking links for your selected campgrounds
- A full day-by-day itinerary
- Helpful tips and packing lists

Access it here: {trip_link}

Your spots are not yet booked — please use the links to reserve your sites directly.

Questions? Contact us at {os.environ.get('ADMIN_EMAIL')}.

Safe travels,
The Caravan Trip Plan Team
"""

        # Fully styled HTML version
        html_content = f"""\
<html>
<head>
  <style>
    body {{ font-family: Arial, sans-serif; line-height: 1.6; color: #333; background-color: #FFF6ED; margin: 0 auto; }}
    h1 {{ color: #173421; }}
    .header-img {{ width: 100%; }}
    .container {{ padding: 20px; }}
    .confirmation {{ color: #666; margin-bottom: 20px; }}
    ul {{ padding-left: 20px; }}
    li {{ margin-bottom: 10px; }}
    .important {{ background-color: #ffffff; padding: 15px; border-radius: 5px; margin: 20px 0; }}
    .green {{ color: #173421; }}
    .footer {{ margin-top: 30px; color: #333; }}
    a {{ color: #173421; text-decoration: underline; }}
  </style>
</head>
<body>
  <div>
    <img class="header-img" src="https://caravan-bucket.s3.us-east-2.amazonaws.com/images-caravan/email/email1.png" alt="Caravan Trip Plan">
    <div class="container">
      <div class="confirmation green">Confirmation Number: {confirmation_id}</div>
      <h1>Hi {first_name},</h1>
      <p>Thanks for booking your trip through Caravan Trip Plan! Your personalized trip plan is now live, and we're excited to help you hit the road.</p>
      <p>Inside your <strong class="green">Trip Itinerary Portal</strong>, you'll find:</p>
      <ul>
        <li>Booking links for all of your <strong class="green">selected campgrounds and stays</strong></li>
        <li>Your full <strong class="green">day-by-day itinerary</strong>, including routes, activity recommendations, and packing lists</li>
        <li>Helpful tips and info to make the most of your trip</li>
      </ul>
      <div class="important">
        <p><strong class="green">Important:</strong> Your sites are not yet booked. Please use the provided links in your portal to reserve your spots directly with each campground or lodging provider.</p>
      </div>
      <p>To access your itinerary and booking links, just <a class="green" href="{trip_link}">click here</a>.</p>
      <p>If you have any questions or need additional support, feel free to contact us at <a class="green" href="mailto:{os.environ.get('ADMIN_EMAIL')}">{os.environ.get('ADMIN_EMAIL')}</a>.</p>
      <p>Thank you for choosing Caravan Trip Plan! We're honored to be part of your road trip.</p>
      <div class="footer">
        <p>Safe travels,<br>
        The Caravan Trip Plan Team<br>
        <a href="https://caravan-trip-plan.com">caravan-trip-plan.com</a><br>
        <a href="https://instagram.com/caravantripplan">Instagram</a>
        </p>
        <img src="https://caravan-bucket.s3.us-east-2.amazonaws.com/images-caravan/email/email2.png" alt="Caravan Footer" style="width: 100%;">
      </div>
    </div>
  </div>
</body>
</html>
"""

        # SendGrid mail object with both text and HTML
        message = Mail(
            from_email=from_email,
            to_emails=to_email,
            subject=subject
        )
        message.add_content(Content("text/plain", text_content))
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
