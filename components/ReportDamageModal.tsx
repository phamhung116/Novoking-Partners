import React, { useState, useRef } from 'react';
import { CompanyTool, ToolReport } from '../types';

interface ReportDamageModalProps {
  tool: CompanyTool;
  onClose: () => void;
  onCreateReport: (data: Omit<ToolReport, 'id' | 'timestamp' | 'partnerId' | 'partnerName' | 'imageUrls'>) => void;
  onTakePhoto: () => void;
  onChoosePhoto: () => void;
  previewImageUrls: string[];
  onRemovePreview: (index: number) => void;
}

const ReportDamageModal: React.FC<ReportDamageModalProps> = ({ tool, onClose, onCreateReport, onTakePhoto, onChoosePhoto, previewImageUrls, onRemovePreview }) => {
  const [reportedStatus, setReportedStatus] = useState<string>('');
  const [reason, setReason] = useState('');

  const canSubmit = reason.trim() !== '' && reportedStatus.trim() !== '';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onCreateReport({
      toolId: tool.id,
      toolName: tool.name,
      reportedStatus,
      reason,
      status: 'pending', // Initial status
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Báo cáo hư hỏng</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                <p className="font-semibold text-gray-800">{tool.name}</p>
                <div>
                    <label htmlFor="reportedStatus" className="block text-sm font-medium text-gray-700 mb-1">Tình trạng dụng cụ</label>
                    <input
                        id="reportedStatus"
                        value={reportedStatus}
                        onChange={(e) => setReportedStatus(e.target.value)}
                        placeholder="Ví dụ: Bị gãy, hoạt động yếu, bị thiếu..."
                        required
                        className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                </div>
                <div>
                    <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">Trình bày lý do/sự việc</label>
                    <textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="Mô tả chi tiết..." rows={4} required className="w-full mt-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"/>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-700">Đính kèm hình ảnh minh chứng</h4>
                        {previewImageUrls.length > 0 && <span className="text-sm font-medium text-gray-500">{`${previewImageUrls.length} / 10 ảnh`}</span>}
                    </div>
                    <div className="space-y-3">
                        {previewImageUrls.length > 0 && (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                {previewImageUrls.map((url, index) => (
                                    <div key={url} className="relative group">
                                        <img src={url} alt="Minh chứng xem trước" className="rounded-lg w-full h-24 object-cover" />
                                        <button type="button" onClick={() => onRemovePreview(index)} className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition-colors" aria-label="Xóa ảnh">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                        {previewImageUrls.length < 10 && (
                            <div className="flex space-x-3">
                                <button type="button" onClick={onTakePhoto} className="w-full flex items-center justify-center space-x-2 p-3 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors text-sm font-semibold border border-primary-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                    <span>Chụp ảnh</span>
                                </button>
                                <button type="button" onClick={onChoosePhoto} className="w-full flex items-center justify-center space-x-2 p-3 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors text-sm font-semibold border border-primary-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                    <span>Chọn từ Album</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-b-xl flex space-x-3">
                <button type="button" className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300" onClick={onClose}>Hủy</button>
                <button type="submit" className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-700 disabled:bg-primary-300" disabled={!canSubmit}>Gửi báo cáo</button>
            </div>
        </form>
        <style>{`
          @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
};

export default ReportDamageModal;