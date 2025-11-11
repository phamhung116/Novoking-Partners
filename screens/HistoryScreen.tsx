import React, { useState, useMemo } from 'react';
import { Job } from '../types';
import { parseDateString } from '../utils/dateUtils';
import JobCard from '../components/JobCard';

interface HistoryScreenProps {
  jobs: Job[];
  onSelectJob: (job: Job) => void;
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
};

// Helper to get months from the current month back to the start of the year
const getMonthsForCurrentYear = (): Date[] => {
    const months: Date[] = [];
    const today = new Date();
    const currentMonthIndex = today.getMonth(); // 0 for Jan, 11 for Dec
    today.setDate(1); // Standardize to the first day of the month

    for (let i = 0; i <= currentMonthIndex; i++) {
        const monthDate = new Date(today);
        monthDate.setMonth(today.getMonth() - i);
        months.push(monthDate);
    }
    return months;
};

type FilterStatus = 'all' | 'completed' | 'canceled';

const HistoryScreen: React.FC<HistoryScreenProps> = ({ jobs, onSelectJob }) => {
  const [selectedMonth, setSelectedMonth] = useState<Date>(() => {
    const today = new Date();
    today.setDate(1);
    return today;
  });
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');


  const availableMonths = useMemo(() => getMonthsForCurrentYear(), []);

  const monthJobs = useMemo(() => {
    // Helper to parse start time from a string like '08:00 - 11:00' into minutes from midnight.
    const getStartTimeInMinutes = (timeStr: string): number => {
        const startTime = timeStr.split(' - ')[0]; // e.g., '08:00'
        const [hour, minute] = startTime.split(':').map(Number);
        return hour * 60 + minute;
    };

    return jobs
      .filter(job => {
        const jobDate = parseDateString(job.date);
        return jobDate.getFullYear() === selectedMonth.getFullYear() && jobDate.getMonth() === selectedMonth.getMonth();
      })
      .sort((a, b) => {
        const dateComparison = parseDateString(b.date).getTime() - parseDateString(a.date).getTime();
        // If dates are different, sort by date descending (most recent first)
        if (dateComparison !== 0) {
          return dateComparison;
        }
        
        // If dates are the same, sort by time descending (later times first)
        const timeB = getStartTimeInMinutes(b.time);
        const timeA = getStartTimeInMinutes(a.time);
        return timeB - timeA;
      });
  }, [jobs, selectedMonth]);
  
  const summary = useMemo(() => {
    const getFinalPayment = (job: Job): number => {
        if (job.penalty) {
            return job.payment * (1 - job.penalty.percentage / 100);
        }
        return job.payment;
    };
    
    const completedJobs = monthJobs.filter(j => j.status === 'completed');
    const canceledJobs = monthJobs.filter(j => j.status === 'canceled');
    
    const totalIncome = completedJobs.reduce((sum, job) => sum + getFinalPayment(job), 0);

    return {
      completedCount: completedJobs.length,
      canceledCount: canceledJobs.length,
      totalIncome: totalIncome,
    };
  }, [monthJobs]);

  const displayJobs = useMemo(() => {
    let result = monthJobs;

    if (filterStatus !== 'all') {
      result = result.filter(job => job.status === filterStatus);
    }

    if (searchTerm.trim() !== '') {
      const lowercasedFilter = searchTerm.toLowerCase();
      result = result.filter(job =>
        job.customerName.toLowerCase().includes(lowercasedFilter) ||
        job.address.toLowerCase().includes(lowercasedFilter) ||
        job.serviceType.toLowerCase().includes(lowercasedFilter)
      );
    }

    return result;
  }, [monthJobs, filterStatus, searchTerm]);
  
  const filterTabs: { key: FilterStatus, label: string }[] = [
    { key: 'all', label: 'Tất cả' },
    { key: 'completed', label: 'Đã hoàn thành' },
    { key: 'canceled', label: 'Đã hủy' },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-primary shadow-md p-4 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-white text-center">Lịch sử công việc</h1>
        {/* Month Selector */}
        <div className="mt-4 flex space-x-2 overflow-x-auto scrolling-touch pb-2 -mx-4 px-4">
          {availableMonths.map(month => {
            const isSelected = month.getMonth() === selectedMonth.getMonth() && month.getFullYear() === selectedMonth.getFullYear();
            return (
              <button
                key={month.toISOString()}
                onClick={() => setSelectedMonth(month)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  isSelected ? 'bg-primary-700 text-white shadow' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Tháng {month.getMonth() + 1}/{month.getFullYear()}
              </button>
            )
          })}
        </div>
      </header>
      
      <main className="p-4 space-y-4">
        {/* Search and Filter */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm theo tên khách hàng, địa chỉ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-100 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-gray-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          <div className="flex space-x-2">
            {filterTabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setFilterStatus(tab.key)}
                className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors duration-200 ${
                  filterStatus === tab.key 
                  ? 'bg-primary text-white shadow' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {monthJobs.length > 0 ? (
          <>
            {/* Summary Card */}
            <div className="bg-primary-50 rounded-lg shadow p-4 border-2 border-primary">
                <h2 className="text-lg font-bold text-primary mb-3">
                    Tổng kết Tháng {selectedMonth.getMonth() + 1}/{selectedMonth.getFullYear()}
                </h2>
                <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                        <p className="text-2xl font-bold text-green-600">{summary.completedCount}</p>
                        <p className="text-sm text-gray-600">Hoàn thành</p>
                    </div>
                     <div>
                        <p className="text-2xl font-bold text-gray-600">{summary.canceledCount}</p>
                        <p className="text-sm text-gray-600">Đã hủy</p>
                    </div>
                </div>
                <hr className="my-3"/>
                <div className="flex justify-between items-center">
                    <p className="font-semibold text-gray-600">Tổng thu nhập:</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(summary.totalIncome)}</p>
                </div>
            </div>

            {/* Job List */}
            {displayJobs.length > 0 ? (
              <div className="space-y-4">
                {displayJobs.map(job => (
                  <JobCard key={job.id} job={job} onCardClick={onSelectJob} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="mt-4 text-lg text-gray-600">Không tìm thấy công việc</p>
                <p className="text-sm text-gray-500">Vui lòng thử lại với từ khóa hoặc bộ lọc khác.</p>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="mt-4 text-lg text-gray-500">Không có công việc nào trong tháng này.</p>
            <p className="text-sm text-gray-400">Hãy thử chọn một tháng khác để xem.</p>
          </div>
        )}
      </main>
      <style>{`
            .scrolling-touch { -webkit-overflow-scrolling: touch; }
            .scrolling-touch::-webkit-scrollbar { display: none; }
        `}</style>
    </div>
  );
};

export default HistoryScreen;