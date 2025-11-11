import React, { useState } from 'react';
import { Job, UserRole } from '../types';
import { formatDateWithRelativeDay } from '../utils/dateUtils';
import ImageViewer from './ImageViewer';

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onAccept: (jobId: string) => void;
  isAccepted: boolean;
  onStartChat: (job: Job) => void;
  onContact: (job: Job) => void;
  onCancelJob: (job: Job) => void;
  onStartCheckin: (job: Job) => void;
  onCheckout: (jobId:string) => void;
  onUploadProof: (jobId: string) => void;
  onTakePhoto: () => void;
  onChoosePhoto: () => void;
  previewImageUrls: string[];
  onRemovePreview: (index: number) => void;
  viewerRole: UserRole;
  onApplyPenalty: (job: Job) => void;
}

const InfoRow: React.FC<{ icon?: React.ReactNode; label?: string; value: string | React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
      {icon && <div className="text-primary pt-1">{icon}</div>}
      <div className="text-sm w-full">
        {label ? (
          <div className="flex justify-between items-start py-1">
            <p className="font-semibold text-gray-500">{label}</p>
            <p className="text-gray-800 text-right ml-4">{value}</p>
          </div>
        ) : (
          <p className="font-semibold text-gray-800 pt-0.5">{value}</p>
        )}
      </div>
    </div>
);

const JobDetailModal: React.FC<JobDetailModalProps> = ({ job, onClose, onAccept, isAccepted, onStartChat, onContact, onCancelJob, onStartCheckin, onCheckout, onUploadProof, onTakePhoto, onChoosePhoto, previewImageUrls, onRemovePreview, viewerRole, onApplyPenalty }) => {
    
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const handleOpenImageViewer = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageViewerOpen(true);
  };

  const handleCloseImageViewer = () => {
    setIsImageViewerOpen(false);
  };
    
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getLocationFromAddress = (address: string): string | null => {
    // Priority 1: Match a component that follows a Ward component. This is likely the District.
    const wardAndDistrictMatch = address.match(/Phường\s+[^,]+,\s*([^,]+)/);
    if (wardAndDistrictMatch && wardAndDistrictMatch[1]) {
        return wardAndDistrictMatch[1].trim();
    }

    // Priority 2: Match an explicit District name.
    const districtMatch = address.match(/(?:Quận|Huyện)\s+([^,]+)/);
    if (districtMatch && districtMatch[1]) {
        return districtMatch[1].trim();
    }
    
    // Priority 3: Match a Ward name if no district found.
    const wardMatch = address.match(/Phường\s+([^,]+)/);
    if (wardMatch && wardMatch[1]) {
        return wardMatch[1].trim();
    }
    
    // Fallback: take the last component of the address
    const parts = address.split(',').map(p => p.trim()).filter(Boolean);
    if (parts.length > 1) {
        return parts[parts.length - 1];
    }
    
    return null;
  }
  
  const formatAddress = (address: string): string => {
    // Removes the "Phường" part for a cleaner display when a district is also present.
    return address.replace(/,\s*Phường\s+[^,]+(?=,\s*[^,]+$)/, '');
  };
  
  const location = getLocationFromAddress(job.address);
  const displayAddress = formatAddress(job.address);
  const finalPayment = job.penalty ? job.payment * (1 - job.penalty.percentage / 100) : job.payment;
  
  const renderActionButtons = () => {
    if (!isAccepted) {
      return (
        <button
            onClick={() => onAccept(job.id)}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300 shadow-lg hover:shadow-xl"
        >
            Nhận việc
        </button>
      )
    }

    switch(job.status) {
      case 'in_progress':
        if (viewerRole === UserRole.Partner) {
            return (
              <button
                onClick={() => onCheckout(job.id)}
                className="w-full bg-red-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                <span>Xác nhận kết thúc công việc</span>
              </button>
            );
        }
        return null;
      case 'completed':
          if (viewerRole === UserRole.Manager && !job.penalty) {
            return (
                 <button
                    onClick={() => onApplyPenalty(job)}
                    className="w-full bg-secondary text-white font-bold py-3 px-4 rounded-lg hover:bg-secondary-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" /></svg>
                    <span>Áp dụng phạt tiền</span>
                </button>
            )
        }
        return (
          <div className="text-center py-2 px-4 rounded-lg bg-green-100 text-green-800 font-semibold border border-green-200">
              Công việc đã hoàn thành
          </div>
        );
      case 'canceled':
        return (
          <div className="text-center py-2 px-4 rounded-lg bg-red-100 text-red-800 font-semibold border border-red-200">
              Công việc đã bị hủy
          </div>
        );
      case 'accepted':
      default:
        if (viewerRole === UserRole.Partner) {
            return (
              <button
                  onClick={() => onStartCheckin(job)}
                  className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
              >
                  <span>Xác nhận bắt đầu công việc</span>
              </button>
            );
        }
        return null;
    }
  }

  const showCancelButton = 
    isAccepted && 
    (job.status === 'accepted' || (viewerRole === UserRole.Manager && job.status === 'in_progress'));

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-40 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-xl shadow-xl max-w-lg w-full transform transition-all opacity-100 scale-100 animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Chi tiết công việc</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-primary">{location ? location : `Khách hàng: ${job.customerName}`}</h3>
                  <p className="text-sm text-gray-500 font-medium mt-1">{job.serviceType}</p>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                    {job.penalty ? (
                        <>
                            <p className="text-lg font-semibold text-gray-500 line-through">{formatCurrency(job.payment)}</p>
                            <p className="text-2xl font-bold text-red-600">{formatCurrency(finalPayment)}</p>
                        </>
                    ) : (
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(job.payment)}</p>
                    )}
                    <p className="text-md font-semibold text-red-600">/{job.duration} giờ</p>
                </div>
            </div>

            <hr className="mb-4 border-gray-200" />

            <div className="space-y-4">
              {location && (
                  <InfoRow 
                    icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM3.465 14.493a1.23 1.23 0 0 0 .41 1.412A9.957 9.957 0 0 0 10 18c2.31 0 4.438-.784 6.131-2.095a1.23 1.23 0 0 0 .41-1.412A9.99 9.99 0 0 0 10 12a9.99 9.99 0 0 0-6.535 2.493Z" /></svg>}
                    value={job.customerName}
                  />
              )}
              <InfoRow 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" /></svg>}
                value={displayAddress}
              />
               <InfoRow 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg>}
                value={formatDateWithRelativeDay(job.date)}
              />
               <InfoRow 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>}
                value={job.time}
              />
              <InfoRow 
                icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" /><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm3 0a1 1 0 011-1h1a1 1 0 110 2H8a1 1 0 01-1-1z" clipRule="evenodd" /></svg>}
                value={job.paymentMethod || 'Tiền mặt'}
              />
            </div>
            
             {job.penalty && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                  <h4 className="text-md font-bold text-red-800">Thông tin kỷ luật</h4>
                  <div className="mt-2 text-sm space-y-1">
                      <div className="flex justify-between"><span className="text-gray-600">Mức phạt:</span><span className="font-semibold text-red-700">{job.penalty.percentage}% tổng thu nhập</span></div>
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 flex-shrink-0 mr-2">Lý do:</span><span className="font-semibold text-red-700 text-right">{job.penalty.reason}</span>
                      </div>
                  </div>
                </div>
              </div>
            )}
            
            {(job.notes || job.checkinTime || job.checkoutTime || job.status === 'completed' || job.status === 'canceled') && (
              <div className="mt-6 pt-4 border-t border-gray-200 space-y-4">
                
                {job.notes && (
                  <InfoRow 
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    }
                    label={job.status === 'canceled' ? 'Lý do hủy' : 'Ghi chú'}
                    value={<span className="whitespace-pre-wrap">{job.status === 'canceled' ? job.notes.replace('Lý do hủy: ','') : job.notes}</span>}
                  />
                )}
                
                {(job.checkinTime || job.checkoutTime) && (
                  <div className="space-y-2 pl-8">
                    {job.checkinTime && <p className="text-sm text-gray-600"><span className="font-semibold">Bắt đầu:</span> {job.checkinTime}</p>}
                    {job.checkoutTime && <p className="text-sm text-gray-600"><span className="font-semibold">Kết thúc:</span> {job.checkoutTime}</p>}
                  </div>
                )}

                {job.status === 'completed' && (
                  <div>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className="text-md font-semibold text-gray-800">Minh chứng hoàn thành</h4>
                        {previewImageUrls.length > 0 && !job.proofImageUrls && (
                            <span className="text-sm font-medium text-gray-500">{`${previewImageUrls.length} / 10 ảnh`}</span>
                        )}
                    </div>

                    {job.proofImageUrls && job.proofImageUrls.length > 0 ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                            {job.proofImageUrls.map((url, index) => (
                                <div key={index} className="relative cursor-pointer" onClick={() => handleOpenImageViewer(index)}>
                                    <img src={url} alt={`Minh chứng ${index + 1}`} className="rounded-lg w-full h-24 object-cover" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {previewImageUrls.length > 0 && (
                                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                                    {previewImageUrls.map((url, index) => (
                                        <div key={url} className="relative group">
                                            <img src={url} alt="Minh chứng xem trước" className="rounded-lg w-full h-24 object-cover" />
                                            <button 
                                                onClick={() => onRemovePreview(index)}
                                                className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1.5 hover:bg-opacity-75 transition-colors"
                                                aria-label="Xóa ảnh"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {previewImageUrls.length < 10 && viewerRole === UserRole.Partner ? (
                                <div className="flex space-x-3">
                                    <button 
                                        onClick={onTakePhoto}
                                        className="w-full flex items-center justify-center space-x-2 p-3 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors text-sm font-semibold border border-primary-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" /></svg>
                                        <span>Chụp ảnh</span>
                                    </button>
                                    <button 
                                        onClick={onChoosePhoto}
                                        className="w-full flex items-center justify-center space-x-2 p-3 bg-primary-50 text-primary-700 hover:bg-primary-100 rounded-lg transition-colors text-sm font-semibold border border-primary-200"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" /></svg>
                                        <span>Chọn từ Album</span>
                                    </button>
                                </div>
                            ) : (
                              previewImageUrls.length >= 10 && <p className="text-center text-sm text-gray-500 p-2 bg-gray-100 rounded-lg">Bạn đã đạt số lượng ảnh tối đa.</p>
                            )}

                            {previewImageUrls.length > 0 && (
                                <button onClick={() => onUploadProof(job.id)} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                    Gửi minh chứng
                                </button>
                            )}
                        </div>
                    )}
                  </div>
                )}
              </div>
            )}
        </div>
        
        <div className="bg-gray-50 p-4 rounded-b-xl space-y-3">
            {viewerRole === UserRole.Partner && isAccepted && job.status !== 'completed' && job.status !== 'canceled' && (
                <div className="flex space-x-3">
                    <button
                        onClick={() => onStartChat(job)}
                        className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 5a2 2 0 012-2h12a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm1.5 1a.5.5 0 000 1h8a.5.5 0 000-1h-8zM3 9a.5.5 0 000 1h4a.5.5 0 000-1H3z" />
                        </svg>
                        <span>Nhắn tin</span>
                    </button>
                    <button
                        onClick={() => onContact(job)}
                        className="w-full bg-gray-700 text-white font-bold py-3 px-4 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                        </svg>
                        <span>Liên hệ</span>
                    </button>
                </div>
            )}

            {renderActionButtons()}

            {showCancelButton && (
                 <button
                    onClick={() => onCancelJob(job)}
                    className="w-full bg-transparent text-red-600 font-bold py-2 px-4 rounded-lg hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-300"
                >
                    Hủy công việc
                </button>
            )}
        </div>
      </div>
      {isImageViewerOpen && job.proofImageUrls && (
        <ImageViewer
          images={job.proofImageUrls}
          startIndex={selectedImageIndex}
          onClose={handleCloseImageViewer}
        />
      )}
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default JobDetailModal;