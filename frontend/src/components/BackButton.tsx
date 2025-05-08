import React from 'react';
import { ChevronLeft } from 'lucide-react';

interface BackButtonProps {
  onClick: () => void;
  label?: string;
}

const BackButton: React.FC<BackButtonProps> = ({
  onClick,
  label = "Back to destinations"
}) => {
  return (
    <button onClick={onClick} className="flex items-center text-primary-dark">
      <ChevronLeft className="w-5 h-5 mr-1" />
      <span>{label}</span>
    </button>
  );
};

export default BackButton; 