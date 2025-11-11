import React, { useState, useMemo, useCallback } from 'react';
import { Job, User, ServiceType, CompanyTransaction as FullTransaction, WithdrawalRequest } from '../types';
import { parseDateString } from '../utils/dateUtils';
import WithdrawalRequestCard from '../components/WithdrawalRequestCard';
import WithdrawalRequestDetailModal from '../components/WithdrawalRequestDetailModal';

interface IncomeScreenProps {
  jobs: Job[];
  collaborators: User[];
  withdrawalRequests: WithdrawalRequest[];
  companyTransactions: FullTransaction[];
  onUpdateWithdrawalRequestStatus: (requestId: string, status: 'approved' | 'rejected') => void;
}

// Augment the transaction type with a parsed Date object for easier sorting and filtering
type TransactionWithDate = FullTransaction & { parsedDate: Date };

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

// --- MODAL FOR TRANSACTION DETAILS ---
const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="text-sm font-semibold text-gray-800 text-right ml-4">{value}</div>
    </div>
);

const TransactionDetailModal: React.FC<{
  transaction: TransactionWithDate;
  job?: Job;
  collaborator?: User;
  onClose: () => void;
}> = ({ transaction, job, collaborator, onClose }) => {
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
                <InfoRow label="Hạng mục" value={transaction.category} />
                <InfoRow label="Ngày" value={transaction.date} />
                {job && (
                    <>
                        <InfoRow label="Mã Booking" value={job.id} />
                        <InfoRow label="Dịch vụ" value={job.serviceType} />
                        <InfoRow label="Khách hàng" value={job.customerName} />
                    </>
                )}
                {collaborator && (
                    <InfoRow label="Cộng tác viên" value={collaborator.name} />
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


const TransactionCard: React.FC<{
  transaction: TransactionWithDate;
  collaboratorName?: string;
  onClick: () => void;
  timestamp?: string;
}> = ({ transaction, collaboratorName, onClick, timestamp }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-600' : 'text-red-600';
  const sign = isIncome ? '+' : '';

  let title = transaction.title;
  if (transaction.category === 'Thu nhập Booking' && transaction.relatedJobId) {
    title = `Thu nhập Booking - ${transaction.relatedJobId}`;
  } else if (transaction.category === 'Thu nhập Phạt' && transaction.relatedJobId) {
    title = `Thu nhập Phạt - ${transaction.relatedJobId}`;
  }


  return (
    <div onClick={onClick} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-start cursor-pointer hover:bg-gray-50 transition-colors">
      <div className="min-w-0">
        <p className="font-bold text-gray-800 truncate">{title}</p>
        <p className="text-sm text-gray-500 mt-1">{timestamp || transaction.date}</p>
        {collaboratorName && <p className="text-sm text-primary font-semibold mt-1">CTV: {collaboratorName}</p>}
      </div>
      <div className="text-right ml-4 flex-shrink-0">
        <p className={`font-bold text-lg whitespace-nowrap ${amountColor}`}>
          {sign}{formatCurrency(transaction.amount)}đ
        </p>
      </div>
    </div>
  );
};


const IncomeScreen: React.FC<IncomeScreenProps> = ({ jobs, collaborators, withdrawalRequests, companyTransactions, onUpdateWithdrawalRequestStatus }) => {
  const [activeTab, setActiveTab] = useState<'history' | 'requests'>('history');
  const [timePeriod, setTimePeriod] = useState<'year' | 'quarter' | 'month'>('year');
  const [filters, setFilters] = useState({
    year: '2025',
    month: 'all',
    quarter: 'all',
    serviceType: 'all',
    collaboratorId: 'all',
  });
  const [selectedTransaction, setSelectedTransaction] = useState<TransactionWithDate | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawalRequest | null>(null);

  const allServiceTypes = useMemo(() => [...new Set(jobs.map(j => j.serviceType))], [jobs]);

  const allTransactions = useMemo((): TransactionWithDate[] => {
    const transactions: TransactionWithDate[] = [];

    // From Job Income & Penalties
    jobs.forEach(job => {
      if (job.status === 'completed') {
        transactions.push({
          id: `income-${job.id}`,
          type: 'income',
          category: 'Thu nhập Booking',
          title: `Thu nhập CV ${job.serviceType}`,
          amount: job.payment,
          date: job.date,
          parsedDate: parseDateString(job.date),
          relatedJobId: job.id,
          relatedCollaboratorId: job.assignedToId,
        });
      }
      if (job.penalty) {
        const penaltyAmount = job.payment * (job.penalty.percentage / 100);
        transactions.push({
          id: `penalty-${job.id}`,
          type: 'income',
          category: 'Thu nhập Phạt',
          title: `Thu phạt CV của ${job.customerName}`,
          amount: penaltyAmount,
          date: job.date,
          parsedDate: parseDateString(job.date),
          relatedJobId: job.id,
          relatedCollaboratorId: job.assignedToId,
        });
      }
    });

    // From other company transactions (withdrawals, operational costs)
    companyTransactions.forEach(txn => {
      transactions.push({
        ...txn,
        parsedDate: parseDateString(txn.date),
      });
    });

    return transactions.sort((a, b) => b.parsedDate.getTime() - a.parsedDate.getTime());
  }, [jobs, companyTransactions]);

  const filteredTransactions = useMemo(() => {
    return allTransactions.filter(t => {
      const date = t.parsedDate;
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // 1-12
      const quarter = Math.floor(date.getMonth() / 3) + 1; // 1-4

      if (filters.year !== 'all' && year !== parseInt(filters.year)) return false;
      
      if (timePeriod === 'month' && filters.month !== 'all' && month !== parseInt(filters.month)) return false;
      if (timePeriod === 'quarter' && filters.quarter !== 'all' && quarter !== parseInt(filters.quarter)) return false;

      if (filters.collaboratorId !== 'all' && t.relatedCollaboratorId !== filters.collaboratorId) return false;
      
      if (filters.serviceType !== 'all') {
        if (!t.relatedJobId) return false; // Hide non-job transactions if filtering by service
        const relatedJob = jobs.find(j => j.id === t.relatedJobId);
        if (!relatedJob || relatedJob.serviceType !== filters.serviceType) return false;
      }
      
      return true;
    });
  }, [allTransactions, filters, jobs, timePeriod]);

  const summary = useMemo(() => {
    const totalIncome = filteredTransactions.reduce((sum, t) => t.type === 'income' ? sum + t.amount : sum, 0);
    const totalExpense = filteredTransactions.reduce((sum, t) => t.type === 'expense' ? sum + t.amount : sum, 0);
    const bookingCount = new Set(filteredTransactions.filter(t => t.relatedJobId).map(t => t.relatedJobId)).size;
    
    return { totalIncome, totalExpense, bookingCount };
  }, [filteredTransactions]);
  
  const handleExportCSV = useCallback(() => {
    const headers = ['Ngày', 'Loại Giao Dịch', 'Hạng Mục', 'Nội Dung', 'Số Tiền', 'Cộng Tác Viên', 'Mã Công Việc'];
    const collaboratorMap = new Map(collaborators.map(c => [c.idNumber, c.name]));

    const rows = filteredTransactions.map(t => {
      const collaboratorName = t.relatedCollaboratorId ? collaboratorMap.get(t.relatedCollaboratorId) || '' : '';
      const amount = t.type === 'income' ? t.amount : -t.amount;
      return [t.date, t.type, t.category, `"${t.title.replace(/"/g, '""')}"`, amount, collaboratorName, t.relatedJobId || ''].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "lich_su_giao_dich.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [filteredTransactions, collaborators]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };
  
  const handleTimePeriodChange = (period: 'year' | 'quarter' | 'month') => {
    setTimePeriod(period);
    setFilters(prev => ({
        ...prev,
        month: 'all',
        quarter: 'all',
    }));
  };

  const collaboratorMap = useMemo(() => new Map(collaborators.map(c => [c.idNumber, c.name])), [collaborators]);
  const jobMap = useMemo(() => new Map(jobs.map(j => [j.id, j])), [jobs]);

  const selectedTransactionJob = selectedTransaction?.relatedJobId ? jobMap.get(selectedTransaction.relatedJobId) : undefined;
  const selectedTransactionCollaborator = selectedTransaction?.relatedCollaboratorId ? collaborators.find(c => c.idNumber === selectedTransaction.relatedCollaboratorId) : undefined;

  const pendingWithdrawalRequests = useMemo(() => 
    withdrawalRequests.filter(req => req.status === 'pending')
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
  [withdrawalRequests]);


  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white p-4 sticky top-0 z-10 text-primary border-b">
        <h1 className="text-xl font-bold text-center">Thu nhập</h1>
      </header>
      <main className="p-4">
        <div className="w-full flex border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('history')}
            className={`w-1/2 py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'history' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
          >
            Lịch sử Giao dịch
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`w-1/2 py-3 px-4 text-sm font-semibold transition-colors ${activeTab === 'requests' ? 'border-b-2 border-primary text-primary' : 'text-gray-500 hover:text-primary'}`}
          >
            Yêu cầu Rút tiền
          </button>
        </div>

        {activeTab === 'history' && (
          <div className="space-y-4">
             {/* Filters */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-3">
              <div className="grid grid-cols-3 gap-1 rounded-lg bg-gray-200 p-1">
                  <button onClick={() => handleTimePeriodChange('month')} className={`py-1.5 rounded-md text-sm font-semibold transition-all ${timePeriod === 'month' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>Tháng</button>
                  <button onClick={() => handleTimePeriodChange('quarter')} className={`py-1.5 rounded-md text-sm font-semibold transition-all ${timePeriod === 'quarter' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>Quý</button>
                  <button onClick={() => handleTimePeriodChange('year')} className={`py-1.5 rounded-md text-sm font-semibold transition-all ${timePeriod === 'year' ? 'bg-primary text-white shadow' : 'text-gray-500'}`}>Năm</button>
              </div>
              
              <div className={`grid ${timePeriod === 'year' ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
                <select name="year" value={filters.year} onChange={handleFilterChange} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm text-gray-900">
                  <option value="2025">Năm 2025</option>
                  <option value="2024">Năm 2024</option>
                  <option value="all">Tất cả các năm</option>
                </select>

                {timePeriod === 'month' && (
                  <select name="month" value={filters.month} onChange={handleFilterChange} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm text-gray-900">
                    <option value="all">Tất cả tháng</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
                      <option key={m} value={m}>Tháng {m}</option>
                    ))}
                  </select>
                )}

                {timePeriod === 'quarter' && (
                  <select name="quarter" value={filters.quarter} onChange={handleFilterChange} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm text-gray-900">
                    <option value="all">Tất cả quý</option>
                    <option value="1">Quý 1</option>
                    <option value="2">Quý 2</option>
                    <option value="3">Quý 3</option>
                    <option value="4">Quý 4</option>
                  </select>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <select name="serviceType" value={filters.serviceType} onChange={handleFilterChange} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm text-gray-900">
                  <option value="all">Tất cả dịch vụ</option>
                  {allServiceTypes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <select name="collaboratorId" value={filters.collaboratorId} onChange={handleFilterChange} className="w-full p-2 bg-white border border-gray-300 rounded-md focus:ring-primary focus:border-primary text-sm text-gray-900">
                  <option value="all">Tất cả CTV</option>
                  {collaborators.map(c => <option key={c.idNumber} value={c.idNumber}>{c.name}</option>)}
                </select>
              </div>
            </div>

            {/* Summary */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="grid grid-cols-3 text-center">
                <div className="px-2">
                  <p className="text-sm text-gray-500">Tổng thu</p>
                  <p className="text-2xl font-bold text-green-500 mt-1">{formatCurrency(summary.totalIncome)}đ</p>
                </div>
                <div className="px-2 border-l border-r border-gray-200">
                  <p className="text-sm text-gray-500">Tổng chi</p>
                  <p className="text-2xl font-bold text-red-500 mt-1">{formatCurrency(summary.totalExpense)}đ</p>
                </div>
                <div className="px-2">
                  <p className="text-sm text-gray-500">Số việc</p>
                  <p className="text-2xl font-bold text-primary mt-1">{summary.bookingCount}</p>
                </div>
              </div>
            </div>

            {/* Export Button */}
            <button onClick={handleExportCSV} className="w-full bg-white p-3 rounded-lg shadow-sm border border-gray-200 text-center text-gray-700 font-semibold hover:bg-gray-50 transition-colors">
              Xuất File (.csv)
            </button>
            
            {/* Transaction List */}
            <div className="space-y-3">
              {filteredTransactions.map(t => {
                  const collaboratorName = t.relatedCollaboratorId ? collaboratorMap.get(t.relatedCollaboratorId) : undefined;
                  const relatedJob = t.relatedJobId ? jobMap.get(t.relatedJobId) : undefined;
                  const timestamp = relatedJob?.checkoutTime ? `${relatedJob.checkoutTime.split(',')[0]}, ${t.date}` : t.date;

                  return (
                      <TransactionCard 
                          key={t.id} 
                          transaction={t} 
                          collaboratorName={collaboratorName} 
                          timestamp={timestamp}
                          onClick={() => setSelectedTransaction(t)}
                      />
                  );
              })}
            </div>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-10"><p className="text-gray-500">Không có giao dịch nào phù hợp.</p></div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          pendingWithdrawalRequests.length > 0 ? (
             <div className="space-y-3">
              {pendingWithdrawalRequests.map(req => (
                <WithdrawalRequestCard key={req.id} request={req} userRole="manager" onClick={() => setSelectedRequest(req)} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg shadow-sm">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="mt-4 text-lg text-gray-500">Chưa có yêu cầu nào.</p>
                <p className="text-sm text-gray-400">Các yêu cầu rút tiền từ CTV sẽ hiển thị ở đây.</p>
            </div>
          )
        )}
      </main>
      {selectedTransaction && (
        <TransactionDetailModal 
          transaction={selectedTransaction}
          job={selectedTransactionJob}
          collaborator={selectedTransactionCollaborator}
          onClose={() => setSelectedTransaction(null)}
        />
      )}
      {selectedRequest && (
        <WithdrawalRequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onUpdateStatus={onUpdateWithdrawalRequestStatus}
        />
      )}
    </div>
  );
};

export default IncomeScreen;