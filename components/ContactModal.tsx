
import React from 'react';
import { Job } from '../types';

interface ContactModalProps {
  job: Job;
  onClose: () => void;
  onPhoneCall: (phone: string) => void;
  onAppCall: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ job, onClose, onPhoneCall, onAppCall }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">Liên hệ Khách hàng</h3>
            <p className="text-sm text-gray-500 mt-1">{job.customerName}</p>
        </div>

        <div className="mt-6 space-y-3">
            <button
                onClick={() => onPhoneCall(job.customerPhone)}
                className="w-full flex items-center justify-center space-x-3 text-left p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <div className="bg-green-100 p-2 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-gray-800">Gọi số điện thoại</p>
                    <p className="text-sm text-gray-500">{job.customerPhone}</p>
                </div>
            </button>
            <button
                onClick={onAppCall}
                className="w-full flex items-center justify-center space-x-3 text-left p-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
                <div className="bg-blue-100 p-2 rounded-full">
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2 2m-2-2v5l-5 5H3a2 2 0 01-2-2V7a2 2 0 012-2h5l5-5v5z" />
                    </svg>
                </div>
                <div>
                    <p className="font-semibold text-gray-800">Gọi trên ứng dụng</p>
                    <p className="text-sm text-gray-500">Miễn phí, yêu cầu kết nối mạng</p>
                </div>
            </button>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 border border-gray-300"
            onClick={onClose}
          >
            Hủy
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

export default ContactModal;
