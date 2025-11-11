import React, { useState, useMemo } from 'react';
import { User, Job } from '../types';
import JobList from '../components/JobList';
import { parseDateString } from '../utils/dateUtils';

// Define status types
type JobStatus = 'accepted' | 'in_progress' | 'completed' | 'canceled';
type FilterStatus = 'all' | JobStatus;

interface CollaboratorJobsScreenProps {
  collaborator: User;
  jobs: Job[];
  onBack: () => void;
  onSelectJob: (job: Job) => void;
}

const STATUS_TABS: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'accepted', label: 'Đã nhận' },
  { key: 'in_progress', label: 'Đang thực hiện' },
  { key: 'completed', label: 'Đã hoàn thành' },
  { key: 'canceled', label: 'Đã hủy' },
];

// Helper to get months from the current month back to the start of the year
const getMonthsForCurrentYear = (): Date[] => {
    const months: Date[] = [];
    const today = new Date();
    const currentMonthIndex = today.getMonth();
    today.setDate(1);

    for (let i = 0; i <= currentMonthIndex; i++) {
        const monthDate = new Date(today);
        monthDate.setMonth(today.getMonth() - i);
        months.push(monthDate);
    }
    return months;
};


const CollaboratorJobsScreen: React.FC<CollaboratorJobsScreenProps> = ({ collaborator, jobs, onBack, onSelectJob }) => {
  const [activeStatus, setActiveStatus] = useState<FilterStatus>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedMonth, setSelectedMonth] = useState<Date | 'all'>('all');
  const availableMonths = useMemo(() => getMonthsForCurrentYear(), []);

  const filteredJobs = useMemo(() => {
    const monthFilteredJobs = selectedMonth === 'all'
      ? jobs
      : jobs.filter(job => {
          const jobDate = parseDateString(job.date);
          return jobDate.getFullYear() === (selectedMonth as Date).getFullYear() && jobDate.getMonth() === (selectedMonth as Date).getMonth();
        });

    const statusFilteredJobs = activeStatus === 'all'
      ? monthFilteredJobs
      : monthFilteredJobs.filter(job => job.status === activeStatus);

    if (!searchTerm) {
      return statusFilteredJobs;
    }

    const lowercasedFilter = searchTerm.toLowerCase();
    return statusFilteredJobs.filter(job =>
      job.customerName.toLowerCase().includes(lowercasedFilter) ||
      job.address.toLowerCase().includes(lowercasedFilter) ||
      job.serviceType.toLowerCase().includes(lowercasedFilter)
    );
  }, [jobs, selectedMonth, activeStatus, searchTerm]);

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <header className="bg-primary p-4 space-y-3 fixed top-0 left-0 right-0 z-20 shadow-md">
        {/* Top bar with back button and title */}
        <div className="flex items-center space-x-3">
            <button onClick={onBack} className="text-white hover:bg-primary-600 p-1 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            </button>
            <div className="min-w-0">
            <h1 className="text-xl font-bold text-white truncate">Công việc của CTV</h1>
            <p className="text-sm text-blue-200 truncate">{collaborator.name}</p>
            </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm theo khách hàng, địa chỉ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-primary-700 border border-primary-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder-blue-200"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-200" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        {/* Month Selector */}
        <div className="flex items-center space-x-2">
            <label htmlFor="month-filter" className="flex-shrink-0 text-sm font-semibold text-blue-200">Xem theo tháng:</label>
            <select
                id="month-filter"
                value={selectedMonth === 'all' ? 'all' : selectedMonth.toISOString()}
                onChange={(e) => {
                    if (e.target.value === 'all') {
                        setSelectedMonth('all');
                    } else {
                        setSelectedMonth(new Date(e.target.value));
                    }
                }}
                className="w-full bg-primary-700 border border-primary-500 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white text-sm p-2 appearance-none text-center"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%2393c5fd' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'right 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em',
                  paddingRight: '2.5rem',
                }}
            >
                <option value="all">Tất cả</option>
                {availableMonths.map(month => (
                    <option key={month.toISOString()} value={month.toISOString()}>
                        Tháng {month.getMonth() + 1}/{month.getFullYear()}
                    </option>
                ))}
            </select>
        </div>
        
        {/* Status Filter Tabs */}
        <div className="flex space-x-2 overflow-x-auto scrolling-touch pb-2 -mx-4 px-4">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveStatus(tab.key)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                activeStatus === tab.key ? 'bg-white text-primary shadow' : 'bg-primary-700 text-blue-100 hover:bg-primary-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Adjust padding top to account for the larger header */}
      <main className="pt-[18rem] p-4">
        <JobList 
          jobs={filteredJobs} 
          onJobClick={onSelectJob} 
          emptyMessage="Không tìm thấy công việc phù hợp."
        />
      </main>
      <style>{`
        .scrolling-touch { -webkit-overflow-scrolling: touch; }
        .scrolling-touch::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default CollaboratorJobsScreen;
