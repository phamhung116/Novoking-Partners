import React from 'react';
import { Job } from '../types';
import { parseDateString } from '../utils/dateUtils';

interface DateTabsProps {
  jobs: Job[];
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

const formatCustomDayOfWeek = (date: Date): string => {
    const dayIndex = date.getDay(); // Sunday - 0, Monday - 1, ..., Saturday - 6
    if (dayIndex === 0) {
        return 'Chủ nhật';
    }
    return `Thứ ${dayIndex + 1}`;
};


const DateTabs: React.FC<DateTabsProps> = ({ jobs, selectedDate, onSelectDate }) => {
  const weekDays: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 8; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    weekDays.push(date);
  }
  
  const getJobsCountForDate = (date: Date): number => {
    return jobs.filter(job => parseDateString(job.date).toDateString() === date.toDateString()).length;
  }

  return (
    <div className="bg-primary z-10 border-b border-primary-600">
        <div className="max-w-4xl mx-auto flex space-x-2 p-2 overflow-x-auto scrolling-touch">
        {weekDays.map((date, index) => {
            const isActive = date.toDateString() === selectedDate.toDateString();
            const jobCount = getJobsCountForDate(date);
            const dayOfWeek = formatCustomDayOfWeek(date);

            return (
            <button
                key={date.toISOString()}
                onClick={() => onSelectDate(date)}
                className={`relative flex-shrink-0 flex flex-col items-center justify-center w-20 h-20 rounded-lg transition-all duration-200 focus:outline-none ${
                isActive ? 'bg-white text-primary shadow-lg scale-105' : 'text-blue-100 hover:bg-primary-600 hover:text-white'
                }`}
            >
                {index === 0 ? (
                    <>
                        <span className="text-sm font-semibold" style={{ marginTop: '10px' }}>{dayOfWeek}</span>
                        <span className="text-xs">Hôm nay</span>
                        <span className="text-lg font-bold">
                            {date.getDate()}/{date.getMonth() + 1}
                        </span>
                    </>
                ) : (
                    <>
                        <span className="text-sm font-semibold">{dayOfWeek}</span>
                        <span className="text-lg font-bold mt-1">
                            {date.getDate()}/{date.getMonth() + 1}
                        </span>
                    </>
                )}
                {jobCount > 0 && (
                     <span className={`absolute top-1 right-1 flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${
                        isActive ? 'bg-primary text-white' : 'bg-white text-primary'
                     }`}>
                        {jobCount}
                    </span>
                )}
            </button>
            );
        })}
        </div>
         <style>{`
            .scrolling-touch {
                -webkit-overflow-scrolling: touch;
            }
            .scrolling-touch::-webkit-scrollbar {
                display: none;
            }
        `}</style>
    </div>
  );
};

export default DateTabs;