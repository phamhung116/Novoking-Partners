import React from 'react';
import { Job } from '../types';
import { formatDateWithRelativeDay } from '../utils/dateUtils';

interface JobCardProps {
  job: Job;
  onCardClick?: (job: Job) => void;
}

const InfoRow: React.FC<{ icon: React.ReactNode; label?: string; value: string | React.ReactNode }> = ({ icon, label, value }) => (
    <div className="flex items-start space-x-3">
      <div className="text-primary pt-1">{icon}</div>
      <div className="text-sm">
        {label ? (
            <>
                <p className="text-gray-500">{label}</p>
                <p className="font-semibold text-gray-800">{value}</p>
            </>
        ) : (
            <p className="font-semibold text-gray-800 pt-0.5">{value}</p>
        )}
      </div>
    </div>
  );

const StatusInfo: React.FC<{ status: Job['status'] }> = ({ status }) => {
    if (!status || status === 'accepted') return null;

    if (status === 'completed' || status === 'canceled') {
        const config = {
            completed: {
                text: 'Đã hoàn thành',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>,
                classes: 'bg-green-50 text-green-700 border-green-200',
            },
            canceled: {
                text: 'Đã hủy',
                icon: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
                classes: 'bg-gray-100 text-gray-600 border-gray-200',
            }
        };
        const currentConfig = config[status];
        return (
            <div className="flex items-center space-x-3">
                {currentConfig.icon}
                <div className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg text-base font-semibold border ${currentConfig.classes}`}>
                    <span>{currentConfig.text}</span>
                </div>
            </div>
        );
    }

    if (status === 'in_progress') {
        return (
             <div className="flex items-center space-x-3">
                <div className="pt-0.5 text-orange-500">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.414-1.414L11 9.586V6z" clipRule="evenodd" /></svg>
                </div>
                <div className="text-base">
                    <p className="font-semibold text-gray-800">
                        <span className="text-orange-500">Đang thực hiện</span>
                    </p>
                </div>
            </div>
        )
    }

    return null;
}


const JobCard: React.FC<JobCardProps> = ({ job, onCardClick }) => {
    
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const getLocationFromAddress = (address: string): string | null => {
    // Priority 1: Match a component that follows a Ward component. This is likely the District.
    // e.g., "...Phường X, Quận Y" or "...Phường X, Y" -> returns "Y"
    const wardAndDistrictMatch = address.match(/Phường\s+[^,]+,\s*([^,]+)/);
    if (wardAndDistrictMatch && wardAndDistrictMatch[1]) {
        return wardAndDistrictMatch[1].trim();
    }

    // Priority 2: Match an explicit District name. e.g., "... Quận Y" -> "Y"
    const districtMatch = address.match(/(?:Quận|Huyện)\s+([^,]+)/);
    if (districtMatch && districtMatch[1]) {
        return districtMatch[1].trim();
    }
    
    // Priority 3: Match a Ward name if no district found. e.g., "... Phường X" -> "X"
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
    // If address contains both ward and district like "... Phường X, Y", remove the ward part.
    // This cleans up the address for display. e.g., "..., Phường Phước Mỹ, Sơn Trà" -> "..., Sơn Trà"
    return address.replace(/,\s*Phường\s+[^,]+(?=,\s*[^,]+$)/, '');
  };

  const location = getLocationFromAddress(job.address);
  const displayAddress = formatAddress(job.address);
    
  const borderClass = (() => {
    if (job.penalty) {
      return 'border-2 border-dashed border-red-400 bg-rose-50';
    }
    switch (job.status) {
      case 'completed':
        return 'border-2 border-green-500';
      case 'in_progress':
        return 'border-2 border-orange-500';
      case 'canceled':
        return 'border-2 border-gray-400 bg-gray-50';
      default:
        return 'border border-gray-200';
    }
  })();

  const paymentColorClass = (() => {
    if (job.status === 'canceled') {
      return 'text-gray-500';
    }
    if (job.penalty) {
      return 'text-red-600';
    }
    if (job.status === 'completed') {
      return 'text-green-600';
    }
    // Default for 'accepted', 'in_progress' and new jobs
    return 'text-red-600';
  })();
  
  const finalPayment = job.penalty ? job.payment * (1 - job.penalty.percentage / 100) : job.payment;

  return (
    <div 
      className={`bg-white rounded-lg shadow-md overflow-hidden transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer ${borderClass}`}
      onClick={() => onCardClick && onCardClick(job)}
    >
      <div className="p-5">
        {job.penalty && (
          <div className="flex items-center space-x-2 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
            </svg>
            <span className="font-bold text-sm text-red-700">Áp dụng kỉ luật - Phạt giảm tiền</span>
          </div>
        )}
        <div className="flex justify-between items-start">
            <div>
              <h3 className="text-2xl font-bold text-primary">{location ? location : `Khách hàng: ${job.customerName}`}</h3>
              <p className="text-sm text-gray-500 font-medium mt-1">{job.serviceType}</p>
            </div>
            <div className="text-right">
                {job.penalty ? (
                    <>
                        <p className="text-lg font-semibold text-gray-400 line-through">{formatCurrency(job.payment)}</p>
                        <p className={`text-2xl font-bold ${paymentColorClass}`}>{formatCurrency(finalPayment)}</p>
                    </>
                ) : (
                    <p className={`text-2xl font-bold ${paymentColorClass}`}>{formatCurrency(job.payment)}</p>
                )}
                <p className={`text-md font-semibold ${paymentColorClass}`}>/{job.duration} giờ</p>
            </div>
        </div>

        <hr className="my-3 border-gray-200" />

        <div className="space-y-3">
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
          <StatusInfo status={job.status} />
        </div>
      </div>
    </div>
  );
};

export default JobCard;