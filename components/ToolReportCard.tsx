import React from 'react';
import { ToolReport, ToolReportStatus } from '../types';

interface ToolReportCardProps {
  report: ToolReport;
  onClick: () => void;
}

const formatDate = (isoString: string) => {
  return new Date(isoString).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const StatusBadge: React.FC<{ status: ToolReportStatus }> = ({ status }) => {
    const statusInfo: Record<ToolReportStatus, { text: string, color: string }> = {
        pending: { text: 'Chờ xử lý', color: 'bg-yellow-100 text-yellow-800' },
        confirmed: { text: 'Đã xác nhận', color: 'bg-blue-100 text-blue-800' },
        compensation_required: { text: 'Cần bồi thường', color: 'bg-orange-100 text-orange-800' },
        resolved: { text: 'Đã giải quyết', color: 'bg-green-100 text-green-800' },
    };
    const currentStatus = statusInfo[status];
    return (
        <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${currentStatus.color}`}>
            {currentStatus.text}
        </span>
    );
};


const ToolReportCard: React.FC<ToolReportCardProps> = ({ report, onClick }) => {
  return (
    <div 
        className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onClick}
    >
        <div className="flex justify-between items-start">
            <div>
                <p className="font-bold text-gray-800 truncate">{report.toolName}</p>
                <p className="text-sm text-gray-500">Người báo cáo: {report.partnerName}</p>
            </div>
            <StatusBadge status={report.status} />
        </div>
        <div className="text-right text-xs text-gray-400 mt-2">
            {formatDate(report.timestamp)}
        </div>
    </div>
  );
};

export default ToolReportCard;