import React from 'react';
import { WithdrawalRequest } from '../types';

interface WithdrawalRequestDetailModalProps {
  request: WithdrawalRequest;
  onClose: () => void;
  onUpdateStatus: (requestId: string, status: 'approved' | 'rejected') => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="text-sm font-semibold text-gray-800 text-right ml-4">{value}</div>
    </div>
);

const WithdrawalRequestDetailModal: React.FC<WithdrawalRequestDetailModalProps> = ({ request, onClose, onUpdateStatus }) => {
  
  const handleApprove = () => {
    onUpdateStatus(request.id, 'approved');
    onClose();
  };

  const handleReject = () => {
    onUpdateStatus(request.id, 'rejected');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết Yêu cầu Rút tiền</h2>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="text-center mb-4">
                <p className="text-4xl font-bold text-red-600">-{formatCurrency(request.amount)}đ</p>
                <p className="font-semibold text-gray-700 mt-1">Yêu cầu từ {request.partnerName}</p>
            </div>
            <div className="space-y-1">
                <InfoRow label="Mã yêu cầu" value={request.id} />
                <InfoRow label="Người yêu cầu" value={request.partnerName} />
                <InfoRow label="Thời gian" value={formatDate(request.timestamp)} />
                <InfoRow label="Ngân hàng" value={request.bankName} />
                <InfoRow label="Số tài khoản" value={request.accountNumber} />
                {request.notes && (
                    <InfoRow label="Ghi chú" value={request.notes} />
                )}
            </div>
        </div>
        {request.status === 'pending' && (
            <div className="bg-gray-50 p-4 rounded-b-xl flex space-x-3">
                <button onClick={handleReject} className="w-full bg-red-50 text-red-600 font-semibold py-2 px-3 rounded-lg hover:bg-red-100 transition-colors text-sm">
                    Từ chối
                </button>
                <button onClick={handleApprove} className="w-full bg-green-50 text-green-600 font-semibold py-2 px-3 rounded-lg hover:bg-green-100 transition-colors text-sm">
                    Duyệt
                </button>
            </div>
        )}
        <style>{`
            @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
};

export default WithdrawalRequestDetailModal;