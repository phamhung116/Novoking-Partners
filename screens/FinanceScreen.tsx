import React, { useState, useMemo } from 'react';
import { MOCK_TRANSACTIONS } from '../data/mockTransactions';
import { Transaction, WithdrawalRequest, User, Job } from '../types';
import WithdrawModal from '../components/WithdrawModal';
import WithdrawalRequestCard from '../components/WithdrawalRequestCard';
import PartnerTransactionDetailModal from '../components/PartnerTransactionDetailModal';

interface FinanceScreenProps {
  onBack: () => void;
  currentUser: User;
  withdrawalRequests: WithdrawalRequest[];
  onCreateWithdrawalRequest: (
    data: { amount: number; bankName: string; accountNumber: string; notes?: string },
    partner: User
  ) => void;
  historyJobs: Job[];
  partnerTransactions: Transaction[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};

const TransactionItem: React.FC<{ transaction: Transaction; onClick: () => void }> = ({ transaction, onClick }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-500' : 'text-gray-800';
  const iconBgColor = isIncome ? 'bg-primary' : 'bg-rose-500';
  const amountPrefix = isIncome ? '+' : '-';

  return (
    <div onClick={onClick} className="flex items-center p-3 bg-white rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
      <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${iconBgColor}`}>
        <span className="text-white font-bold text-xl">$</span>
      </div>
      <div className="flex-1 ml-4 min-w-0">
        <p className="font-semibold text-gray-900 truncate">{transaction.title}</p>
        {transaction.timestamp && <p className="text-sm text-gray-500">{transaction.timestamp}</p>}
      </div>
      <div className="text-right ml-2">
        <p className={`font-bold whitespace-nowrap ${amountColor}`}>{amountPrefix}{formatCurrency(transaction.amount)}đ</p>
      </div>
    </div>
  );
};

type TransactionFilter = 'Tất cả' | 'Lương' | 'Thưởng' | 'Chi phí' | 'Rút tiền';
const FILTER_CATEGORIES: TransactionFilter[] = ['Tất cả', 'Lương', 'Thưởng', 'Chi phí', 'Rút tiền'];

const FinanceScreen: React.FC<FinanceScreenProps> = ({ onBack, currentUser, withdrawalRequests, onCreateWithdrawalRequest, historyJobs, partnerTransactions }) => {
  const [activeTab, setActiveTab] = useState<'transactions' | 'requests'>('transactions');
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [transactionFilter, setTransactionFilter] = useState<TransactionFilter>('Tất cả');


  const getTabClass = (tab: 'transactions' | 'requests') => {
    return activeTab === tab ? 'bg-white text-primary font-bold' : 'text-white';
  }

  const handleCreateRequest = (data: { amount: number; bankName: string; accountNumber: string; notes?: string }) => {
    onCreateWithdrawalRequest(data, currentUser);
    setIsWithdrawModalOpen(false);
  };

  const partnerRequests = withdrawalRequests.filter(req => req.partnerId === currentUser.idNumber);

  const selectedJob = selectedTransaction?.relatedJobId
    ? historyJobs.find(job => job.id === selectedTransaction.relatedJobId)
    : undefined;

  const balance = useMemo(() => {
    // Set a base balance for demo purposes.
    const baseBalance = 975000;

    // Calculate the total income and expenses from transactions.
    const transactionDelta = partnerTransactions.reduce((acc, txn) => {
      return txn.type === 'income' ? acc + txn.amount : acc - txn.amount;
    }, 0);

    // Calculate the total amount from pending withdrawal requests.
    const pendingWithdrawals = withdrawalRequests
      .filter(r => r.partnerId === currentUser.idNumber && r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);

    // The available balance is the base balance + transaction changes - any money on hold for withdrawal.
    return baseBalance + transactionDelta - pendingWithdrawals;
  }, [partnerTransactions, withdrawalRequests, currentUser.idNumber]);

  const filteredTransactions = useMemo(() => {
    if (transactionFilter === 'Tất cả') {
      return partnerTransactions;
    }
    return partnerTransactions.filter(txn => {
      const title = txn.title.toLowerCase();
      const type = txn.type;

      switch (transactionFilter) {
        case 'Lương':
          return type === 'income' && title.includes('công việc');
        case 'Thưởng':
          return type === 'income' && !title.includes('công việc');
        case 'Chi phí':
          return type === 'expense' && !title.includes('rút tiền');
        case 'Rút tiền':
          return type === 'expense' && title.includes('rút tiền');
        default:
          return true;
      }
    });
  }, [partnerTransactions, transactionFilter]);
  
  return (
    <div className="min-h-screen font-sans bg-gray-100">
      {/* Header Section */}
      <header className="relative text-white pb-24 bg-primary overflow-hidden">

        <div className="relative z-10">
          <div className="p-4 flex items-center space-x-3">
            <button onClick={onBack} className="p-1 rounded-full hover:bg-white/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">Tài chính</h1>
          </div>
          
          <div className="text-center mt-4">
              <p className="text-lg text-blue-200">Tài khoản chính</p>
              <p className="text-5xl font-bold mt-2 tracking-tight">
                  {formatCurrency(balance)}<span className="text-3xl align-top font-semibold">đ</span>
              </p>
          </div>
          
          <div className="mt-8 px-10 flex justify-center">
              <button onClick={() => setIsWithdrawModalOpen(true)} className="w-1/2 bg-rose-500 text-white font-semibold py-2 px-4 rounded-full shadow-lg flex items-center justify-center space-x-2 hover:bg-rose-600 transition-colors text-sm">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>
                  <span>Rút tiền</span>
              </button>
          </div>
        </div>
        <div 
            className="absolute -bottom-px w-full h-8 bg-gray-100" 
            style={{ borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem' }}
        ></div>
      </header>

      {/* Main Content */}
      <main className="p-4 -mt-10 relative z-10">
        {/* Tab Control */}
        <div className="bg-primary-700 p-1 rounded-full flex mb-4 shadow-md">
            <button onClick={() => setActiveTab('transactions')} className={`w-1/2 py-2 rounded-full transition-all duration-300 text-sm ${getTabClass('transactions')}`}>GIAO DỊCH</button>
            <button onClick={() => setActiveTab('requests')} className={`w-1/2 py-2 rounded-full transition-all duration-300 text-sm ${getTabClass('requests')}`}>YÊU CẦU</button>
        </div>
        
        {/* Content based on tab */}
        {activeTab === 'transactions' && (
          <div className="space-y-3">
            {/* Filter Buttons */}
            <div className="flex space-x-2 overflow-x-auto scrolling-touch pb-2">
              {FILTER_CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => setTransactionFilter(category)}
                  className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                    transactionFilter === category
                      ? 'bg-primary text-white shadow'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            
            <div className="flex justify-between items-center pt-2">
              <h2 className="text-xl font-bold text-gray-800">Gần đây</h2>
              <button className="flex items-center justify-center h-8 w-8 bg-rose-100 rounded-full text-rose-500 hover:bg-rose-200 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>

            {filteredTransactions.length > 0 ? (
              filteredTransactions.map(txn => (
                <TransactionItem key={txn.id} transaction={txn} onClick={() => setSelectedTransaction(txn)} />
              ))
            ) : (
              <div className="text-center py-10 text-gray-500 bg-white rounded-lg">
                <p>Không có giao dịch nào.</p>
              </div>
            )}
          </div>
        )}


        {activeTab === 'requests' && (
          partnerRequests.length > 0 ? (
            <div className="space-y-3">
              {partnerRequests.map(req => (
                <WithdrawalRequestCard key={req.id} request={req} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
                <p className="mt-4 text-lg text-gray-500">Chưa có yêu cầu nào.</p>
            </div>
          )
        )}
      </main>

      {isWithdrawModalOpen && (
        <WithdrawModal
          onClose={() => setIsWithdrawModalOpen(false)}
          onCreateRequest={handleCreateRequest}
        />
      )}

      {selectedTransaction && (
        <PartnerTransactionDetailModal
            transaction={selectedTransaction}
            job={selectedJob}
            onClose={() => setSelectedTransaction(null)}
        />
      )}
      <style>{`
            .scrolling-touch { -webkit-overflow-scrolling: touch; }
            .scrolling-touch::-webkit-scrollbar { display: none; }
        `}</style>
    </div>
  );
};

export default FinanceScreen;