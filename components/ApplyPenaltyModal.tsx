import React, { useState } from 'react';
import { Job } from '../types';

interface ApplyPenaltyModalProps {
  job: Job;
  complaintJobs: Job[];
  onClose: () => void;
  onConfirm: (jobId: string, percentage: 20 | 50 | 100, linkedComplaintId: string) => void;
}

const PENALTY_LEVELS: (20 | 50 | 100)[] = [20, 50, 100];

const ApplyPenaltyModal: React.FC<ApplyPenaltyModalProps> = ({ job, complaintJobs, onClose, onConfirm }) => {
  const [selectedPercentage, setSelectedPercentage] = useState<20 | 50 | 100 | null>(null);
  const [selectedComplaintId, setSelectedComplaintId] = useState<string>('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };

  const canConfirm = selectedPercentage !== null && selectedComplaintId !== '';

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm(job.id, selectedPercentage, selectedComplaintId);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-md w-full transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Áp dụng phạt tiền</h3>
          <p className="text-sm text-gray-500 mt-1">Chọn mức phạt và khiếu nại liên quan cho công việc này.</p>
        </div>

        <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {/* Section 1: Penalty Level */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-3">1. Chọn mức phạt</h4>
            <div className="space-y-3">
              {PENALTY_LEVELS.map(level => {
                const penaltyAmount = (job.payment * level) / 100;
                return (
                  <label key={level} className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${selectedPercentage === level ? 'border-primary bg-primary-50' : 'border-gray-200 bg-white'}`}>
                    <input
                      type="radio"
                      name="penalty-level"
                      value={level}
                      checked={selectedPercentage === level}
                      onChange={() => setSelectedPercentage(level)}
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <div className="flex justify-between w-full items-center">
                        <span className={`text-sm font-medium ${selectedPercentage === level ? 'text-primary-800' : 'text-gray-700'}`}>Phạt {level}% tổng tiền</span>
                        <span className={`text-sm font-bold ${selectedPercentage === level ? 'text-red-600' : 'text-red-500'}`}>-{formatCurrency(penaltyAmount)}đ</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Section 2: Link Complaint */}
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">2. Gán khiếu nại của khách hàng</h4>
            <div className="relative">
              <select
                value={selectedComplaintId}
                onChange={(e) => setSelectedComplaintId(e.target.value)}
                className={`appearance-none w-full p-3 border-2 rounded-lg cursor-pointer transition-colors duration-200 pr-10 text-sm 
                  focus:outline-none focus:ring-2 focus:ring-primary 
                  ${selectedComplaintId 
                    ? 'border-primary bg-primary-50 text-primary-800 font-semibold' 
                    : 'border-gray-200 bg-white text-gray-500'
                  }`}
              >
                <option value="" disabled>-- Chọn một khiếu nại --</option>
                {complaintJobs.map(cJob => (
                  <option key={cJob.id} value={cJob.id} className="text-gray-900 font-normal bg-white">
                    KH: {cJob.customerName} - Lý do: {cJob.complaint!.reason}
                  </option>
                ))}
              </select>
              <div className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 transition-colors ${selectedComplaintId ? 'text-primary' : 'text-gray-400'}`}>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-b-xl flex space-x-3">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
            onClick={onClose}
          >
            Hủy
          </button>
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-secondary text-sm font-medium text-white hover:bg-secondary-700 disabled:bg-red-300 disabled:cursor-not-allowed"
            onClick={handleConfirm}
            disabled={!canConfirm}
          >
            Xác nhận
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

export default ApplyPenaltyModal;