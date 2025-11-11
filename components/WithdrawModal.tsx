import React, { useState, useMemo, useEffect, useRef } from 'react';
import { VIETNAM_BANKS } from '../constants';

interface WithdrawModalProps {
  onClose: () => void;
  onCreateRequest: (data: { amount: number; bankName: string; accountNumber: string; notes?: string }) => void;
}

const formatCurrency = (value: string) => {
  return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

const unformatCurrency = (value: string) => {
  return value.replace(/,/g, "");
};

const WithdrawModal: React.FC<WithdrawModalProps> = ({ onClose, onCreateRequest }) => {
  const [amount, setAmount] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [notes, setNotes] = useState('');

  const [bankSearch, setBankSearch] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredBanks = useMemo(() => {
    if (!bankSearch) return VIETNAM_BANKS;
    const lowercasedSearch = bankSearch.toLowerCase();
    return VIETNAM_BANKS.filter(
      bank => bank.name.toLowerCase().includes(lowercasedSearch) || bank.shortName.toLowerCase().includes(lowercasedSearch)
    );
  }, [bankSearch]);
  
  const canSubmit = amount && bankName && accountNumber;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onCreateRequest({
      amount: Number(unformatCurrency(amount)),
      bankName,
      accountNumber,
      notes,
    });
  };

  const handleBankSelect = (bank: { name: string; shortName: string }) => {
    setBankName(`${bank.shortName} - ${bank.name}`);
    setBankSearch(`${bank.shortName} - ${bank.name}`);
    setIsDropdownOpen(false);
  };
  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
            <h3 className="text-lg font-semibold text-gray-900">Tạo yêu cầu rút tiền</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Bank Selection */}
            <div ref={dropdownRef} className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Ngân hàng</label>
                <input
                    type="text"
                    value={bankSearch}
                    onChange={(e) => {
                        setBankSearch(e.target.value);
                        setBankName(''); // Clear final selection when user types
                        setIsDropdownOpen(true);
                    }}
                    onFocus={() => setIsDropdownOpen(true)}
                    placeholder="Tìm kiếm ngân hàng"
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                />
                {isDropdownOpen && (
                    <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md mt-1 max-h-40 overflow-y-auto shadow-lg">
                        {filteredBanks.map(bank => (
                            <li
                                key={bank.shortName}
                                onClick={() => handleBankSelect(bank)}
                                className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-sm text-gray-900"
                            >
                                {bank.shortName} - {bank.name}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tài khoản</label>
                <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
                    inputMode="numeric"
                    placeholder="Nhập số tài khoản"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Số tiền</label>
                <input
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(formatCurrency(e.target.value))}
                    inputMode="numeric"
                    placeholder="Nhập số tiền cần rút"
                    required
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                />
            </div>
            
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú (tùy chọn)</label>
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Thêm ghi chú..."
                    rows={2}
                    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white text-gray-900"
                />
            </div>

            <div className="bg-gray-50 -m-6 mt-4 p-4 rounded-b-xl flex space-x-3">
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                    onClick={onClose}
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-700 disabled:bg-primary-300"
                    disabled={!canSubmit}
                >
                    Gửi yêu cầu
                </button>
            </div>
        </form>
      </div>
      <style>{`
        @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default WithdrawModal;