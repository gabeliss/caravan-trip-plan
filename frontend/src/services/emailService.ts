import { TripDetails } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export interface SendEmailParams {
  email: string;
  firstName: string;
  confirmationId: string;
  tripId: string;
}

export const emailService = {
  async sendConfirmationEmail({
    email,
    firstName,
    confirmationId,
    tripId
  }: SendEmailParams): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}/send-confirmation-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          confirmationId,
          tripId
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send confirmation email');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  }
}; 