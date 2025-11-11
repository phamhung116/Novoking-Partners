import React from 'react';
import { Transaction, Job } from '../types';

interface PartnerTransactionDetailModalProps {
  transaction: Transaction;
  job?: Job;
  onClose: () => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="text-sm font-semibold text-gray-800 text-right ml-4">{value}</div>
    </div>
);

const PartnerTransactionDetailModal: React.FC<PartnerTransactionDetailModalProps> = ({ transaction, job, onClose }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  const sign = isIncome ? '+' : '-';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết giao dịch</h2>
        </div>
        <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="text-center mb-4">
                <p className={`text-4xl font-bold ${amountColor}`}>{sign}{formatCurrency(transaction.amount)}đ</p>
                <p className="font-semibold text-gray-700 mt-1">{transaction.title}</p>
            </div>
            <div className="space-y-1">
                <InfoRow label="Mã giao dịch" value={transaction.id} />
                <InfoRow label="Loại giao dịch" value={isIncome ? 'Thu nhập' : 'Chi phí'} />
                {transaction.timestamp && <InfoRow label="Thời gian" value={transaction.timestamp} />}
                {job && (
                    <InfoRow label="Mã Booking" value={job.id} />
                )}
            </div>
        </div>
        <div className="bg-gray-50 p-4 rounded-b-xl">
            <button onClick={onClose} className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600">
                Đóng
            </button>
        </div>
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

export default PartnerTransactionDetailModal;
