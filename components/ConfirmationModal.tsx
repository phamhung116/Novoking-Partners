import React from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'primary';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({ isOpen, onClose, onConfirm, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', variant = 'danger' }) => {
  if (!isOpen) return null;

  const iconContainerClass = variant === 'primary' ? 'bg-primary-100' : 'bg-red-100';
  const iconClass = variant === 'primary' ? 'text-primary' : 'text-red-600';
  const confirmButtonClass = variant === 'primary' ? 'bg-primary hover:bg-primary-700' : 'bg-red-600 hover:bg-red-700';

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`mx-auto flex items-center justify-center h-16 w-16 rounded-full ${iconContainerClass}`}>
           <svg xmlns="http://www.w3.org/2000/svg" className={`h-10 w-10 ${iconClass}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
           </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">{title}</h3>
        <p className="text-sm text-gray-500 mt-2">
          {message}
        </p>
        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
            onClick={onClose}
          >
            {cancelText}
          </button>
          <button
            type="button"
            className={`w-full inline-flex justify-center rounded-lg px-4 py-2 text-sm font-medium text-white ${confirmButtonClass}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ConfirmationModal;