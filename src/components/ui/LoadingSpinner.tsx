
import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 8, 
  className = "text-dragndrop-primary" 
}) => {
  return (
    <div className="min-h-screen bg-dragndrop-lightgray flex items-center justify-center">
      <Loader2 className={`w-${size} h-${size} animate-spin ${className}`} />
    </div>
  );
};

export default LoadingSpinner;
