import React from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface TermsAndConditionsModalProps {
  onClose: () => void;
}

export const TermsAndConditionsModal: React.FC<TermsAndConditionsModalProps> = ({
  onClose,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-xl shadow-xl max-w-4xl w-full my-8 max-h-[90vh] flex flex-col"
      >
        <div className="border-b p-6 flex items-center justify-between sticky top-0 bg-white rounded-t-xl z-10">
          <h2 className="text-2xl font-bold">Terms and Conditions</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-beige/50 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          <div className="prose max-w-none">
            <h3>Terms and Conditions for Caravan Trip Plan</h3>
            <p className="text-sm text-gray-500">Effective Date: May 4, 2025</p>
            
            <p>Welcome to Caravan Trip Plan. By using our platform to plan your road trip and explore third-party accommodations, you agree to the following Terms and Conditions. Please read them carefully before using our services.</p>
            <br />
            
            <h4><strong>1. General Overview</strong></h4>
            <ul>
              <li> - 1.1. Caravan Trip Plan LLC ("we," "us," or "our") is a planning tool that helps users discover and organize road trips by providing curated itineraries and linking to third-party service providers for bookings.</li>
              <li> - 1.2. We do not own, operate, or control any accommodations, campgrounds, or other service providers listed on our platform. All bookings are made directly with the respective third-party provider.</li>
              <li> - 1.3. We display live pricing and availability for convenience, but we cannot guarantee its accuracy or real-time updates. Availability and final pricing should always be confirmed directly with the Service Provider.</li>
            </ul>
            <br />
            <h4><strong>2. Third-Party Bookings</strong></h4>
            <ul>
              <li> - 2.1. When you click on a booking link through Caravan Trip Plan, you are redirected to a third-party website. Any bookings, payments, cancellations, or modifications must be handled directly with that provider.</li>
              <li> - 2.2. Caravan Trip Plan is not a party to any transaction, agreement, or dispute between you and any third-party provider.</li>
              <li> - 2.3. We are not responsible for the accuracy, reliability, or completeness of information provided by third parties.</li>
            </ul>
            <br />

            <h4><strong>3. Changes and Cancellations</strong></h4>
            <ul>
              <li> - 3.1. Changes to or cancellations of your reservation must be made directly with the Service Provider, and are subject to their terms and conditions.</li>
              <li> - 3.2. We do not process refunds, and we are not responsible for any fees, charges, or penalties imposed by the Service Provider.</li>
            </ul>
            <br />
            <h4><strong>4. Liability Disclaimer</strong></h4>
            <ul>
              <li> - 4.1. Caravan Trip Plan provides recommendations, trip ideas, and third-party links for informational purposes only.</li>
              <li> - 4.2. We are not liable for any accidents, injuries, losses, damages, or other issues that occur before, during, or after your trip — including those resulting from the use of any accommodations or activities recommended or linked on our platform.</li>
              <li> - 4.3. All travel and activity involve inherent risks. By using our platform, you accept full responsibility for your choices and assume all associated risks.</li>
            </ul>
            <br />
            <h4><strong>5. User Responsibilities</strong></h4>
            <ul>
              <li> - 5.1. You are responsible for:</li>
              <li className="ml-6"> - Verifying all booking details on the third-party site before completing a reservation.</li>
              <li className="ml-6"> - Reviewing and understanding the terms and conditions of the Service Provider.</li>
              <li className="ml-6"> - Complying with local laws, campground rules, and travel regulations.</li>
            </ul>
            <p> - 5.2. We strongly recommend obtaining travel insurance to cover unexpected events or emergencies.</p>
            <br />
            <h4><strong>6. Platform Use</strong></h4>
            <p> - 6.1. You agree not to misuse Caravan Trip Plan, interfere with its operation, or engage in illegal or fraudulent activities through the platform.</p>
            <p> - 6.2. We reserve the right to modify, suspend, or terminate access to the platform at any time, for any reason, without prior notice.</p>
            <br />
            <h4><strong>7. Indemnification</strong></h4>
            <p> - 7.1. You agree to indemnify, defend, and hold harmless Caravan Trip Plan, its affiliates, employees, and agents from any claims, damages, or liabilities arising from your use of the platform, your travel experiences, or your interactions with third-party providers.</p>
            <br />
            <h4><strong>8. Governing Law and Jurisdiction</strong></h4>
            <p> - 8.1. These Terms and Conditions are governed by and construed in accordance with the laws of the State of Michigan, without regard to its conflict of law provisions.</p>
            <p> - 8.2. You agree that any legal disputes arising from your use of our platform shall be resolved in the courts located in Michigan.</p>
            <p> - 8.3. While using our services or traveling based on our recommendations, you are solely responsible for complying with all applicable local, state, provincial, and federal laws, regulations, and ordinances in the areas you visit.</p>
            <br />
            <h4><strong>9. Intellectual Property and Use of Content</strong></h4>
            <p> - 9.1. All content provided on Caravan Trip Plan, including but not limited to trip guides, itineraries, maps, recommendations, designs, text, graphics, logos, and other materials, is the property of Caravan Trip Plan and is protected by copyright, trademark, and other intellectual property laws.</p>
            <p> - 9.2. You are granted a limited, non-exclusive, and non-transferable license to use the content solely for personal, non-commercial purposes.</p>
            <p> - 9.3. You may not, without express written permission from Caravan Trip Plan:</p>
            <ul>
              <li> - Reproduce, distribute, display, or create derivative works based on any part of the trip guides or other content on the platform.</li>
              <li> - Use any content from the platform for commercial purposes, including reselling, republishing, or redistributing.</li>
              <li> - Copy, scrape, or otherwise reproduce the content of the platform using automated tools.</li>
            </ul>
            <p> - 9.4. Any unauthorized use of the content will result in the termination of your access to the platform and may lead to legal action, including but not limited to claims for damages, legal fees, and other remedies available under applicable law.</p>
            <br />
            <h4><strong>10. Amendments</strong></h4>
            <p> - 10.1. We may update or change these Terms and Conditions at any time. Continued use of the platform after updates constitutes your acceptance of the revised terms.</p>
            <br />
            <p> By using Caravan Trip Plan, you acknowledge that you have read, understood, and agreed to these Terms and Conditions.</p>
            <p> For questions, contact us at caravantripplan@gmail.com</p>
          </div>
        </div>
        
        <div className="border-t p-6 sticky bottom-0 bg-white rounded-b-xl z-10">
          <button
            onClick={onClose}
            className="w-full bg-primary-dark text-beige px-6 py-3 rounded-lg hover:bg-primary-dark/90 transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}; 