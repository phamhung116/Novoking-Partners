import React from 'react';

interface LocationPermissionModalProps {
  onClose: () => void;
  onConfirm: () => void;
}

const LocationPermissionModal: React.FC<LocationPermissionModalProps> = ({ onClose, onConfirm }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mt-4">Xác nhận vị trí</h3>
        <p className="text-sm text-gray-500 mt-2">
          Để bắt đầu công việc, chúng tôi cần xác nhận vị trí hiện tại của bạn. Vui lòng cấp quyền truy cập vị trí.
        </p>
        <div className="mt-6 flex space-x-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
            onClick={onClose}
          >
            Để sau
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-700"
            onClick={onConfirm}
          >
            Đồng ý
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

export default LocationPermissionModal;