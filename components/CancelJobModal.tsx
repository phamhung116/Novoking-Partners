import React, { useState } from 'react';
import { Job } from '../types';

interface CancelJobModalProps {
  job: Job;
  onClose: () => void;
  onConfirm: (jobId: string, reason: string) => void;
}

const CANCEL_REASONS = [
    'Kẹt xe, không đến kịp giờ',
    'Lý do cá nhân đột xuất',
    'Không liên lạc được với khách hàng',
    'Sai địa chỉ công việc',
    'Khác',
];

const CancelJobModal: React.FC<CancelJobModalProps> = ({ job, onClose, onConfirm }) => {
  const [selectedReason, setSelectedReason] = useState('');
  const [otherReason, setOtherReason] = useState('');
  
  const canConfirm = selectedReason && (selectedReason !== 'Khác' || (selectedReason === 'Khác' && otherReason.trim() !== ''));

  const handleConfirm = () => {
    if (!canConfirm) return;
    const finalReason = selectedReason === 'Khác' ? otherReason.trim() : selectedReason;
    onConfirm(job.id, finalReason);
  };
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Lý do hủy việc</h3>
            <p className="text-sm text-gray-500 mt-1">Vui lòng chọn lý do bạn muốn hủy công việc này.</p>
        </div>
        
        <div className="p-6 space-y-4">
            {CANCEL_REASONS.map(reason => (
                 <label key={reason} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                    <input
                        type="radio"
                        name="cancel-reason"
                        value={reason}
                        checked={selectedReason === reason}
                        onChange={() => setSelectedReason(reason)}
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                    />
                    <span className="text-sm font-medium text-gray-700">{reason}</span>
                </label>
            ))}
            {selectedReason === 'Khác' && (
                <textarea
                    value={otherReason}
                    onChange={(e) => setOtherReason(e.target.value)}
                    placeholder="Vui lòng ghi rõ lý do khác..."
                    rows={3}
                    className="w-full mt-2 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
            )}
        </div>

        <div className="bg-gray-50 p-4 rounded-b-xl flex space-x-3">
            <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                onClick={onClose}
            >
                Quay lại
            </button>
            <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-red-600 text-sm font-medium text-white hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed"
                onClick={handleConfirm}
                disabled={!canConfirm}
            >
                Xác nhận hủy
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

export default CancelJobModal;