import React, { useState } from 'react';
import { ToolReport, UserRole } from '../types';
import ImageViewer from './ImageViewer';

interface ToolReportDetailModalProps {
  report: ToolReport;
  userRole: UserRole;
  onClose: () => void;
  onUpdateReport: (reportId: string, updates: Partial<ToolReport>) => void;
  onConfirmCompensation: (report: ToolReport) => void;
}

const formatDate = (isoString: string) => new Date(isoString).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
const formatCurrency = (amount: number) => new Intl.NumberFormat('vi-VN').format(amount);

const InfoRow: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
        <p className="text-sm text-gray-500 flex-shrink-0 mr-4">{label}</p>
        <div className="text-sm font-semibold text-gray-800 text-right">{value}</div>
    </div>
);

const StatusBadge: React.FC<{ status: ToolReport['status'] }> = ({ status }) => {
    const statusInfo = {
        pending: { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
        confirmed: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
        compensation_required: { text: 'Cần bồi thường', color: 'bg-orange-100 text-orange-800' },
        resolved: { text: 'Đã giải quyết', color: 'bg-green-100 text-green-800' },
    };
    return <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusInfo[status].color}`}>{statusInfo[status].text}</span>;
};

const ToolReportDetailModal: React.FC<ToolReportDetailModalProps> = ({ report, userRole, onClose, onUpdateReport, onConfirmCompensation }) => {
  const [compensationAmount, setCompensationAmount] = useState('');
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleOpenImageViewer = (index: number) => { setSelectedImageIndex(index); setIsImageViewerOpen(true); };

  const handleConfirmReport = () => onUpdateReport(report.id, { status: 'confirmed' });
  const handleRequestCompensation = () => {
    const amount = parseInt(compensationAmount);
    if (!isNaN(amount) && amount > 0) {
      onUpdateReport(report.id, { status: 'compensation_required', compensationAmount: amount });
    }
  };

  const renderManagerActions = () => {
    if (report.status === 'pending') {
      return <button onClick={handleConfirmReport} className="w-full bg-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-primary-600">Xác nhận đã xem</button>;
    }
    if (report.status === 'confirmed') {
      return (
        <div className="space-y-3">
          <input type="number" value={compensationAmount} onChange={e => setCompensationAmount(e.target.value)} placeholder="Nhập số tiền bồi thường (VND)" className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"/>
          <button onClick={handleRequestCompensation} disabled={!compensationAmount} className="w-full bg-secondary text-white font-semibold py-3 px-4 rounded-lg hover:bg-secondary-600 disabled:bg-gray-300">Yêu cầu bồi thường</button>
        </div>
      );
    }
    return null;
  };
  
  const renderPartnerActions = () => {
    if (report.status === 'compensation_required') {
      return <button onClick={() => onConfirmCompensation(report)} className="w-full bg-secondary text-white font-semibold py-3 px-4 rounded-lg hover:bg-secondary-600">Xác nhận bồi thường</button>;
    }
    return null;
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full flex flex-col max-h-[90vh] animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
          <header className="p-5 border-b border-gray-200 flex justify-between items-center flex-shrink-0">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết Báo cáo</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </header>

          <main className="p-6 overflow-y-auto">
            <div className="space-y-1 mb-4">
              <InfoRow label="Dụng cụ" value={report.toolName} />
              <InfoRow label="Người báo cáo" value={report.partnerName} />
              <InfoRow label="Thời gian" value={formatDate(report.timestamp)} />
              <InfoRow label="Trạng thái" value={<StatusBadge status={report.status} />} />
              <InfoRow label="Tình trạng báo cáo" value={report.reportedStatus} />
               {report.compensationAmount && <InfoRow label="Tiền bồi thường" value={<span className="text-red-600">{formatCurrency(report.compensationAmount)}đ</span>} />}
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg border">
              <h4 className="font-bold text-gray-800 mb-2">Lý do/Sự việc</h4>
              <p className="text-sm text-gray-600 whitespace-pre-wrap">{report.reason}</p>
            </div>
            
            {report.imageUrls.length > 0 && (
              <div className="mt-4">
                <h4 className="font-bold text-gray-800 mb-2">Hình ảnh minh chứng</h4>
                <div className="grid grid-cols-3 gap-2">
                    {report.imageUrls.map((url, index) => (
                        <div key={index} className="relative cursor-pointer" onClick={() => handleOpenImageViewer(index)}>
                            <img src={url} alt={`Minh chứng ${index + 1}`} className="rounded-lg w-full h-24 object-cover" />
                        </div>
                    ))}
                </div>
              </div>
            )}
          </main>

          <footer className="bg-gray-50 p-4 rounded-b-xl flex-shrink-0">
            {userRole === 'manager' ? renderManagerActions() : renderPartnerActions()}
          </footer>
        </div>
        <style>{`@keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } } .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }`}</style>
      </div>
      {isImageViewerOpen && <ImageViewer images={report.imageUrls} startIndex={selectedImageIndex} onClose={() => setIsImageViewerOpen(false)} />}
    </>
  );
};

export default ToolReportDetailModal;