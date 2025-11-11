import React, { useState, useMemo } from 'react';
import { User, UserRole, Transaction, WithdrawalRequest } from '../types';
import ConfirmationModal from '../components/ConfirmationModal';

interface AccountScreenProps {
    onLogout: () => void;
    user: User;
    onShowInformation: () => void;
    onShowSupport: () => void;
    onShowFinance: () => void;
    onShowReview: () => void;
    onShowCollaborators: () => void; // For Manager
    onShowTools: () => void; // For Partner
    onShowIncome: () => void; // For Partner Income Report
    currentWeekReviewCount: number;
    collaboratorCount: number; // For Manager
    partnerTransactions?: Transaction[];
    withdrawalRequests?: WithdrawalRequest[];
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN').format(amount);
};


const AccountScreen: React.FC<AccountScreenProps> = ({ onLogout, user, onShowInformation, onShowSupport, onShowFinance, onShowReview, onShowCollaborators, onShowTools, onShowIncome, currentWeekReviewCount, collaboratorCount, partnerTransactions, withdrawalRequests }) => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const balance = useMemo(() => {
    if (user.role !== UserRole.Partner || !partnerTransactions || !withdrawalRequests) {
      return 0;
    }
    // This logic is mirrored from FinanceScreen to ensure consistency
    const baseBalance = 975000;
    const transactionDelta = partnerTransactions.reduce((acc, txn) => {
      return txn.type === 'income' ? acc + txn.amount : acc - txn.amount;
    }, 0);
    const pendingWithdrawals = withdrawalRequests
      .filter(r => r.partnerId === user.idNumber && r.status === 'pending')
      .reduce((sum, r) => sum + r.amount, 0);
    return baseBalance + transactionDelta - pendingWithdrawals;
  }, [user, partnerTransactions, withdrawalRequests]);
  
  // Manager View
  if (user.role === UserRole.Manager) {
    return (
        <>
            <div className="p-4 bg-gray-50 min-h-screen">
                <header className="pt-2 mb-4">
                    <h1 className="text-2xl font-bold text-primary text-center">Tài khoản</h1>
                </header>
                
                <button 
                  onClick={onShowInformation}
                  className="w-full text-left bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200"
                >
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-primary">Thông tin Quản lý</h2>
                        <div className="rounded-lg h-8 w-8 flex items-center justify-center border border-primary-600">
                          <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                    </div>
                    <div className="flex items-center mt-4">
                        <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden">
                          <img 
                            src={user.avatarUrl}
                            alt="Avatar quản lý" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-4 flex-1">
                            <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                            <p className="text-sm text-gray-500">{user.phone}</p>
                        </div>
                    </div>
                </button>

                <button
                  onClick={onShowCollaborators}
                  className="w-full text-left bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200 mt-4"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-primary">Cộng tác viên</h2>
                    <div className="rounded-lg h-8 w-8 flex items-center justify-center border border-primary-600">
                      <svg className="h-5 w-5 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between items-center">
                    <p className="text-sm text-gray-500">Số lượng Cộng tác viên đang quản lý</p>
                    <p className="text-lg font-bold text-gray-800">{collaboratorCount}</p>
                  </div>
                </button>

                <div className="mt-8">
                    <button
                        onClick={() => setShowLogoutConfirm(true)}
                        className="w-full flex items-center justify-center space-x-2 text-left p-3 bg-white hover:bg-red-50 rounded-lg transition-colors text-red-600 font-semibold shadow-md border border-gray-200"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>Đăng xuất</span>
                    </button>
                </div>
            </div>
            
            <ConfirmationModal
                isOpen={showLogoutConfirm}
                onClose={() => setShowLogoutConfirm(false)}
                onConfirm={onLogout}
                title="Xác nhận Đăng xuất"
                message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?"
                confirmText="Đăng xuất"
                variant="primary"
            />
        </>
    );
  }
  
  // Partner View (existing code)
  return (
    <>
      <div className="p-4 bg-gray-50 min-h-screen">
        <header className="pt-2 mb-4">
          <h1 className="text-2xl font-bold text-primary text-center">Tài khoản</h1>
        </header>

        {/* Information Card */}
        <button 
          onClick={onShowInformation}
          className="w-full text-left bg-primary-50 rounded-lg shadow-md p-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200"
        >
          {/* Top Row: Title and Arrow */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Thông tin</h2>
            <div className="rounded-lg h-8 w-8 flex items-center justify-center border border-red-600">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Bottom Row: Avatar and Details */}
          <div className="flex items-center mt-4">
            {/* Avatar */}
            <div className="flex-shrink-0 h-16 w-16 rounded-full bg-gray-100 border-2 border-gray-200 overflow-hidden">
              <img 
                src={user.avatarUrl}
                alt="Avatar cộng tác viên" 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Details */}
            <div className="ml-4 flex-1">
                <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                <p className="text-sm text-gray-500">{user.phone}</p>
                <div className="flex items-center space-x-1 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">{user.averageRating}</span>
                    <span className="text-xs text-gray-500">({user.ratingCount} đánh giá)</span>
                </div>
            </div>
          </div>
        </button>
        
        {/* Finance Card */}
        <button
          onClick={onShowFinance}
          className="w-full text-left bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200 mt-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Tài chính</h2>
            <div className="rounded-lg h-8 w-8 flex items-center justify-center border border-red-600">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
             <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Tài khoản chính</p>
                <p className="text-lg font-bold text-gray-800">{formatCurrency(balance)}<span className="text-sm font-semibold">đ</span></p>
            </div>
          </div>
        </button>
        
        {/* Review Card */}
        <button
          onClick={onShowReview}
          className="w-full text-left bg-primary-50 rounded-lg shadow-md p-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200 mt-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Đánh giá</h2>
            <div className="rounded-lg h-8 w-8 flex items-center justify-center border border-red-600">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
             <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">Lượt đánh giá tuần này</p>
                <p className="text-lg font-bold text-gray-800">{currentWeekReviewCount} <span className="text-sm font-medium text-gray-600">lượt</span></p>
            </div>
          </div>
        </button>

        {/* Income Card */}
        <button
          onClick={onShowIncome}
          className="w-full text-left bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200 mt-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Thu nhập</h2>
            <div className="rounded-lg h-8 w-8 flex items-center justify-center border border-red-600">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">Báo cáo thu nhập cá nhân</p>
          </div>
        </button>

        {/* Tools Card */}
        <button
          onClick={onShowTools}
          className="w-full text-left bg-primary-50 rounded-lg shadow-md p-4 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200 mt-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Dụng cụ</h2>
            <div className="rounded-lg h-8 w-8 flex items-center justify-center border border-red-600">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">Báo cáo bộ dụng cụ cá nhân</p>
          </div>
        </button>

        {/* Support Card */}
        <button
          onClick={onShowSupport}
          className="w-full text-left bg-white rounded-lg shadow-md p-4 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary border border-gray-200 mt-4"
        >
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-primary">Hỗ trợ</h2>
            <div className="rounded-lg h-8 w-8 flex items-center justify-center border border-red-600">
              <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <div className="mt-2">
            <p className="text-sm text-gray-500">Hỗ trợ nhân sự và thời gian làm việc</p>
          </div>
        </button>


        {/* Đăng xuất section */}
        <div className="mt-8">
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-center space-x-2 text-left p-3 bg-white hover:bg-red-50 rounded-lg transition-colors text-red-600 font-semibold shadow-md border border-gray-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
      
      <ConfirmationModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={onLogout}
        title="Xác nhận Đăng xuất"
        message="Bạn có chắc chắn muốn đăng xuất khỏi tài khoản này không?"
        confirmText="Đăng xuất"
        variant="primary"
      />
    </>
  );
};

export default AccountScreen;
