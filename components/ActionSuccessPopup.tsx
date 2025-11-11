import React, { useEffect } from 'react';

interface ActionSuccessPopupProps {
  message: string;
  onClose: () => void;
}

const ActionSuccessPopup: React.FC<ActionSuccessPopupProps> = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000); // Automatically close after 2 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div 
      className="fixed top-5 left-1/2 -translate-x-1/2 bg-gray-800 text-white flex items-center space-x-3 px-6 py-3 rounded-full shadow-lg z-50 animate-fade-in-down"
      role="alert"
    >
        <svg className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      <span className="font-semibold">{message}</span>
       <style>{`
        @keyframes fade-in-down {
          0% {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, 0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ActionSuccessPopup;