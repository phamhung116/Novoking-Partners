import React, { useState } from 'react';

interface FilterModalProps {
  wards: string[];
  initialSelectedWards: string[];
  onClose: () => void;
  onApply: (selectedWards: string[]) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ wards, initialSelectedWards, onClose, onApply }) => {
  const [localSelectedWards, setLocalSelectedWards] = useState<string[]>(initialSelectedWards);

  const handleToggleWard = (ward: string) => {
    setLocalSelectedWards(prev =>
      prev.includes(ward) ? prev.filter(w => w !== ward) : [...prev, ward]
    );
  };

  const handleApply = () => {
    onApply(localSelectedWards);
  };

  const handleReset = () => {
    setLocalSelectedWards([]);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end z-50 transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-t-2xl shadow-xl flex flex-col max-h-[80vh] animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-4 border-b flex justify-between items-center flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-800">Lọc theo khu vực</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </header>

        <main className="p-4 overflow-y-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {wards.map(ward => (
              <label key={ward} className={`flex items-center space-x-3 p-3 rounded-lg border-2 cursor-pointer transition-colors duration-200 ${localSelectedWards.includes(ward) ? 'border-primary bg-primary-50' : 'border-gray-200 bg-white'}`}>
                <input
                  type="checkbox"
                  checked={localSelectedWards.includes(ward)}
                  onChange={() => handleToggleWard(ward)}
                  className="h-5 w-5 rounded text-primary focus:ring-primary-500 border-gray-300"
                />
                <span className={`text-sm font-medium ${localSelectedWards.includes(ward) ? 'text-primary-800' : 'text-gray-700'}`}>{`Phường ${ward}`}</span>
              </label>
            ))}
          </div>
        </main>

        <footer className="p-4 border-t bg-gray-50 flex space-x-3 flex-shrink-0 rounded-b-2xl">
          <button 
            onClick={handleReset}
            className="w-full inline-flex justify-center rounded-lg px-4 py-3 bg-white text-sm font-bold text-gray-700 hover:bg-gray-100 border border-gray-300 shadow-sm"
          >
            Đặt lại ({localSelectedWards.length})
          </button>
          <button 
            onClick={handleApply}
            className="w-full inline-flex justify-center rounded-lg px-4 py-3 bg-primary text-sm font-bold text-white hover:bg-primary-600 shadow-sm"
          >
            Áp dụng
          </button>
        </footer>
      </div>
       <style>{`
        @keyframes slide-in-up {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default FilterModal;
