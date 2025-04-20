import { jsPDF } from 'jspdf';
import { Destination, TripDuration, Campground } from '../types';
import { format, addDays } from 'date-fns';

interface TripGuideParams {
  destination: Destination;
  duration: TripDuration;
  selectedCampgrounds: Campground[];
  confirmationId: string;
}

export const generateTripGuide = async ({
  destination,
  duration,
  selectedCampgrounds,
  confirmationId,
}: TripGuideParams): Promise<Uint8Array> => {
  const doc = new jsPDF();
  let y = 20;
  const lineHeight = 10;

  // Helper function to add text and increment y position
  const addText = (text: string, fontSize = 12, isBold = false) => {
    doc.setFontSize(fontSize);
    doc.setFont('helvetica', isBold ? 'bold' : 'normal');
    doc.text(text, 20, y);
    y += lineHeight;
  };

  // Title
  addText(destination.name, 24, true);
  y += 10;

  // Trip Details
  addText('Trip Details', 16, true);
  addText(`Confirmation: ${confirmationId}`);
  if (duration.startDate) {
    addText(`Dates: ${format(duration.startDate, 'MMM d')} - ${
      format(addDays(duration.startDate, duration.nights), 'MMM d, yyyy')
    }`);
  }
  addText(`Duration: ${duration.nights} nights`);
  y += 10;

  // Campgrounds
  addText('Your Campgrounds', 16, true);
  selectedCampgrounds.forEach((campground, index) => {
    addText(`Night ${index + 1}: ${campground.name}`, 14, true);
    addText(`Location: ${campground.address}`);
    addText(`Amenities: ${campground.amenities.join(', ')}`);
    addText(`Booking Instructions: ${campground.bookingInstructions || 'Visit booking link'}`);
    y += 5;
  });
  y += 10;

  // Destination Highlights
  addText('Destination Highlights', 16, true);
  destination.highlights.forEach(highlight => {
    addText(`• ${highlight}`);
  });
  y += 10;

  // Travel Tips
  addText('Travel Tips', 16, true);
  addText('• Check campground policies before arrival');
  addText('• Arrive before sunset for easier setup');
  addText('• Download offline maps for the area');
  addText('• Check weather forecasts regularly');

  return doc.output('arraybuffer');
};