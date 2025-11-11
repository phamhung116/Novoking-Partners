import React from 'react';
import { Job } from '../types';

interface NewJobNotificationPopupProps {
  job: Job;
  onViewDetails: (job: Job) => void;
  onSkip: (job: Job) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

const NewJobNotificationPopup: React.FC<NewJobNotificationPopupProps> = ({ job, onViewDetails, onSkip }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900">Công việc mới!</h3>
            <p className="text-sm text-gray-500 mt-1">Một công việc mới phù hợp vừa được đăng tải.</p>
          </div>

          <div className="mt-6 text-left space-y-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
             <div className="flex justify-between items-start">
                <div>
                    <p className="text-lg font-bold text-primary">{job.serviceType}</p>
                    <p className="text-sm text-gray-600 font-medium">{job.address}</p>
                </div>
                <div className="text-right">
                    <p className="text-xl font-bold text-red-600">{formatCurrency(job.payment)}</p>
                    <p className="text-sm font-semibold text-red-600">/{job.duration} giờ</p>
                </div>
             </div>
              <p className="text-sm text-gray-600">
                <span className="font-semibold text-gray-800">Thời gian:</span> {job.time}, {job.date}
              </p>
          </div>

          <div className="mt-6 flex space-x-3">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg px-4 py-3 bg-white text-sm font-bold text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
              onClick={() => onSkip(job)}
            >
              Bỏ qua
            </button>
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg px-4 py-3 bg-primary text-sm font-bold text-white hover:bg-primary-700 shadow-sm"
              onClick={() => onViewDetails(job)}
            >
              Xem chi tiết
            </button>
          </div>
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

export default NewJobNotificationPopup;