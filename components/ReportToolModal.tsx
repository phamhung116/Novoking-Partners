import React, { useState } from 'react';
import { Tool, ToolStatus } from '../types';

interface ReportToolModalProps {
  tool: Tool;
  onClose: () => void;
  onConfirm: (toolId: string, status: ToolStatus, note: string) => void;
}

const STATUS_OPTIONS: { value: ToolStatus; label: string }[] = [
    { value: 'Đủ', label: 'Tốt / Đầy đủ' },
    { value: 'Thiếu', label: 'Bị thiếu' },
    { value: 'Hỏng', label: 'Bị hỏng' },
];

const ReportToolModal: React.FC<ReportToolModalProps> = ({ tool, onClose, onConfirm }) => {
  const [selectedStatus, setSelectedStatus] = useState<ToolStatus>(tool.status);
  const [note, setNote] = useState('');
  
  const canConfirm = selectedStatus !== tool.status;

  const handleConfirm = () => {
    if (!canConfirm) return;
    onConfirm(tool.id, selectedStatus, note);
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
            <h3 className="text-lg font-semibold text-gray-900">Báo cáo tình trạng</h3>
            <p className="text-sm text-gray-500 mt-1">{tool.name}</p>
        </div>
        
        <div className="p-6 space-y-4">
            <div className="space-y-3">
                {STATUS_OPTIONS.map(option => (
                     <label key={option.value} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer">
                        <input
                            type="radio"
                            name="status-option"
                            value={option.value}
                            checked={selectedStatus === option.value}
                            onChange={() => setSelectedStatus(option.value)}
                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                        />
                        <span className="text-sm font-medium text-gray-700">{option.label}</span>
                    </label>
                ))}
            </div>
            <div>
                 <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                <textarea
                    id="note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Mô tả thêm về tình trạng dụng cụ..."
                    rows={3}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
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
                className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-700 disabled:bg-primary-300 disabled:cursor-not-allowed"
                onClick={handleConfirm}
                disabled={!canConfirm}
            >
                Xác nhận
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

export default ReportToolModal;
