import React from 'react';
import { CompanyTool } from '../types';

interface PartnerToolDetailModalProps {
  tool: CompanyTool;
  onClose: () => void;
  onReport: () => void;
}

const InfoRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
        <p className="text-sm text-gray-600 flex-shrink-0 mr-4">{label}</p>
        <div className="text-sm font-semibold text-gray-800 text-right">{value}</div>
    </div>
);

const PartnerToolDetailModal: React.FC<PartnerToolDetailModalProps> = ({ tool, onClose, onReport }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết Dụng cụ</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <div className="p-6 max-h-[60vh] overflow-y-auto">
            <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <img 
                    src={tool.imageUrl || 'https://ohtavn.com/wp-content/uploads/2023/09/pro18.png'} 
                    alt={tool.name} 
                    className="w-full h-full object-cover rounded-lg" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ohtavn.com/wp-content/uploads/2023/09/pro18.png'; }}
                />
            </div>
            <h3 className="text-lg font-bold text-primary mb-4">{tool.name}</h3>
            <div className="space-y-1">
              <InfoRow label="Loại dụng cụ" value={tool.type} />
              <InfoRow label="Ngày mua" value={tool.purchaseDate} />
              <InfoRow label="Ghi chú" value={tool.notes || 'Không có'} />
            </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-b-xl flex space-x-3">
            <button onClick={onReport} className="w-full bg-secondary text-white font-semibold py-3 px-4 rounded-lg hover:bg-secondary-600">
                Báo cáo hư hỏng
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

export default PartnerToolDetailModal;