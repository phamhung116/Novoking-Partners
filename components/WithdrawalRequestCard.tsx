import React from 'react';
import { WithdrawalRequest, UserRole } from '../types';

interface WithdrawalRequestCardProps {
  request: WithdrawalRequest;
  userRole?: UserRole;
  onClick?: () => void;
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

const StatusBadge: React.FC<{ status: WithdrawalRequest['status'] }> = ({ status }) => {
    const statusInfo = {
        pending: { text: 'Đang chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
        approved: { text: 'Đã duyệt', color: 'bg-green-100 text-green-800' },
        rejected: { text: 'Đã từ chối', color: 'bg-red-100 text-red-800' },
    };
    const currentStatus = statusInfo[status];
    return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${currentStatus.color}`}>
            {currentStatus.text}
        </span>
    );
};

const WithdrawalRequestCard: React.FC<WithdrawalRequestCardProps> = ({ request, userRole = 'partner', onClick }) => {
  const isClickable = userRole === 'manager' && onClick;
  return (
    <div 
        className={`bg-white p-4 rounded-lg shadow-sm border border-gray-200 ${isClickable ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
        onClick={onClick}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-lg text-red-600">-{formatCurrency(request.amount)}đ</p>
                <StatusBadge status={request.status} />
            </div>
            <div className="text-right">
                <p className="text-sm font-semibold text-gray-800">{request.bankName}</p>
                <p className="text-sm text-gray-500">{request.accountNumber}</p>
            </div>
        </div>
        <hr className="my-3 border-gray-100" />
        <div className="space-y-1 text-sm">
            {userRole === 'manager' && (
                <p><span className="text-gray-500">Người yêu cầu:</span> <span className="font-semibold">{request.partnerName}</span></p>
            )}
            <p><span className="text-gray-500">Thời gian:</span> <span className="font-semibold">{formatDate(request.timestamp)}</span></p>
            {request.notes && <p><span className="text-gray-500">Ghi chú:</span> <span className="font-semibold">{request.notes}</span></p>}
        </div>
    </div>
  );
};

export default WithdrawalRequestCard;