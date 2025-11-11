import React from 'react';
import { Job } from '../types';

interface SuccessPopupProps {
  job: Job;
  onClose: () => void;
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ job, onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all opacity-100 scale-100 p-6 text-center animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl leading-6 font-bold text-gray-900 mt-4" id="modal-title">
          Nhận việc thành công!
        </h3>
        <div className="mt-4 text-left space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
           <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Khách hàng:</span> {job.customerName}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Địa chỉ:</span> {job.address}
            </p>
             <p className="text-sm text-gray-600">
              <span className="font-semibold text-gray-800">Thời gian:</span> {job.time}, {job.date}
            </p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg shadow-md px-4 py-3 bg-primary text-base font-bold text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105"
            onClick={onClose}
          >
            Tuyệt vời!
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default SuccessPopup;