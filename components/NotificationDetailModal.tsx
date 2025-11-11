import React from 'react';
import { Notification, Job, User } from '../types';

// SVG Icons
const MegaphoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.584C18.354 1.832 18 3.65 18 4.5v.5A2.5 2.5 0 0115.5 7.5V13c0 .597.237 1.17.658 1.584l.757.757A3.373 3.373 0 0116.5 19.5V21a1 1 0 01-1-1v-1.5a1.5 1.5 0 01-1.5-1.5v-3.428" /></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01M12 18v-2m0-2v-2m0-2v-2m0-2V8m0 0h.01M12 5V4m0 1h.01M12 3V2m0 1h.01M12 21v-1m0 1v-1m0-1v-1m0-1v-1m0-1v-1m0-1V12m0-2V8m0-2V4m0-2V2" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CompleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

const ICONS: Record<Notification['icon'], { component: React.FC, color: string }> = {
    megaphone: { component: MegaphoneIcon, color: 'bg-blue-100 text-blue-600' },
    gift: { component: GiftIcon, color: 'bg-pink-100 text-pink-600' },
    money: { component: MoneyIcon, color: 'bg-green-100 text-green-600' },
    cancel: { component: CancelIcon, color: 'bg-red-100 text-red-600' },
    complete: { component: CompleteIcon, color: 'bg-teal-100 text-teal-600' },
    alert: { component: AlertIcon, color: 'bg-yellow-100 text-yellow-600' },
};

interface NotificationDetailModalProps {
  notification: Notification;
  onClose: () => void;
  complaintInfo?: {
    job: Job;
    collaborator: User;
  };
  onViewJob?: () => void;
  onStartChat?: () => void;
}

const InfoRow: React.FC<{ label: string; value: string; }> = ({ label, value }) => (
    <div className="flex justify-between items-center text-sm py-2 border-b border-gray-100">
        <span className="text-gray-500">{label}:</span>
        <span className="font-semibold text-gray-800 text-right">{value}</span>
    </div>
);


const NotificationDetailModal: React.FC<NotificationDetailModalProps> = ({ notification, onClose, complaintInfo, onViewJob, onStartChat }) => {
    const Icon = ICONS[notification.icon].component;
    const iconColor = ICONS[notification.icon].color;

    const renderDefaultView = () => (
      <>
        <div className="p-6 text-center overflow-y-auto">
            <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${iconColor}`}>
                <Icon />
            </div>
            <h3 className="text-xl leading-6 font-bold text-gray-900 mt-4" id="modal-title">
              {notification.title}
            </h3>
             <p className="text-sm text-gray-400 mt-1">{notification.timestamp}</p>
            <div className="mt-4 text-left">
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{notification.message}</p>
            </div>
        </div>
        <div className="bg-gray-50 px-4 py-3 rounded-b-xl flex-shrink-0">
          {onViewJob ? (
            <div className="flex space-x-3">
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                onClick={onClose}
              >
                Đã hiểu
              </button>
              <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-700"
                onClick={onViewJob}
              >
                Xem chi tiết
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-lg shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-600"
              onClick={onClose}
            >
              Đã hiểu
            </button>
          )}
        </div>
      </>
    );

    const renderComplaintView = () => {
        if (!complaintInfo) return renderDefaultView();
        const { job, collaborator } = complaintInfo;

        return (
            <>
                <div className="p-6 text-center overflow-y-auto">
                    <div className={`mx-auto flex items-center justify-center h-20 w-20 rounded-full ${iconColor}`}>
                        <Icon />
                    </div>
                    <h3 className="text-xl leading-6 font-bold text-gray-900 mt-4" id="modal-title">
                        {notification.title}
                    </h3>
                    <p className="text-sm text-gray-400 mt-1">{notification.timestamp}</p>
                    
                    <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg border">
                        <h4 className="font-bold text-primary mb-2">Chi tiết khiếu nại</h4>
                        <p className="text-sm font-semibold text-gray-800">Lý do: {job.complaint?.reason}</p>
                        <p className="text-sm text-gray-600 mt-1 whitespace-pre-wrap">{job.complaint?.message}</p>
                    </div>

                    <div className="mt-4 text-left space-y-1">
                         <InfoRow label="Cộng tác viên" value={collaborator.name} />
                         <InfoRow label="Khách hàng" value={job.customerName} />
                         <InfoRow label="Dịch vụ" value={job.serviceType} />
                         <InfoRow label="Thời gian" value={`${job.time}, ${job.date}`} />
                    </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 rounded-b-xl flex-shrink-0 space-y-2">
                    <div className="flex space-x-3">
                       <button
                            onClick={onViewJob}
                            className="w-full bg-white text-primary font-bold py-3 px-4 rounded-lg border-2 border-primary hover:bg-primary-50 transition-colors"
                        >
                            Xem chi tiết
                        </button>
                         <button
                            onClick={onStartChat}
                            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 transition-colors"
                        >
                            Nhắn tin
                        </button>
                    </div>
                    <button
                        type="button"
                        className="w-full text-center text-sm font-medium text-gray-500 hover:text-gray-700 py-1"
                        onClick={onClose}
                    >
                        Đóng
                    </button>
                </div>
            </>
        );
    };

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
          onClick={onClose}
        >
          <div 
            className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
           {complaintInfo ? renderComplaintView() : renderDefaultView()}
          </div>
          <style>{`
            @keyframes fade-in-up {
              0% { opacity: 0; transform: translateY(20px); }
              100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
          `}</style>
        </div>
    );
};

export default NotificationDetailModal;