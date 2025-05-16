import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { TermsAndConditionsModal } from './TermsAndConditionsModal';

interface TermsAndConditionsCheckboxProps {
  isChecked: boolean;
  onCheckChange: (isChecked: boolean) => void;
}

export const TermsAndConditionsCheckbox: React.FC<TermsAndConditionsCheckboxProps> = ({
  isChecked,
  onCheckChange,
}) => {
  const [showTermsModal, setShowTermsModal] = useState(false);

  return (
    <>
      <div className="flex items-start gap-2 py-2">
        <input
          type="checkbox"
          id="terms-and-conditions"
          checked={isChecked}
          onChange={(e) => onCheckChange(e.target.checked)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-dark focus:ring-primary-dark"
        />
        <label htmlFor="terms-and-conditions" className="text-sm text-gray-600">
          I agree to the{' '}
          <button
            type="button"
            onClick={() => setShowTermsModal(true)}
            className="text-primary-dark font-medium underline underline-offset-2 hover:text-primary-dark/80 inline-flex items-center gap-1"
          >
            <FileText className="w-3 h-3" />
            Terms and Conditions
          </button>
        </label>
      </div>

      {showTermsModal && (
        <TermsAndConditionsModal
          onClose={() => setShowTermsModal(false)}
        />
      )}
    </>
  );
}; 