

import React, { useState, useMemo } from 'react';
import { Job } from '../types';
import { parseDateString, getWeekRange } from '../utils/dateUtils';


// Helper functions for date manipulation
const formatDateForDisplay = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};

const generateWeeklyOptions = (): { label: string, value: [Date, Date] }[] => {
    const options = [];
    // Hardcode "today" to match mock data context
    const today = new Date('2025-10-27T10:00:00Z');
    for (let i = 0; i < 6; i++) {
        const weekDate = new Date(today);
        weekDate.setDate(today.getDate() - i * 7);
        const [start, end] = getWeekRange(weekDate);
        options.push({
            label: `${formatDateForDisplay(start)} - ${formatDateForDisplay(end)}`,
            value: [start, end],
        });
    }
    return options;
};


interface ReviewScreenProps {
  onBack: () => void;
  historyJobs: Job[];
}

const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={`w-5 h-5 ${className}`} viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

const ProgressBar: React.FC<{ percentage: number }> = ({ percentage }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
        <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
    </div>
);


const ReviewScreen: React.FC<ReviewScreenProps> = ({ onBack, historyJobs }) => {
  const weeklyOptions = useMemo(() => generateWeeklyOptions(), []);
  const [selectedWeek, setSelectedWeek] = useState(weeklyOptions[0]);
  const [isWeekSelectorOpen, setIsWeekSelectorOpen] = useState(false);

  const reviewData = useMemo(() => {
    const [start, end] = selectedWeek.value;

    // Filter for completed jobs within the selected week
    const completedJobsInWeek = historyJobs.filter(job => {
        const jobDate = parseDateString(job.date);
        return job.status === 'completed' && jobDate >= start && jobDate <= end;
    });

    // The total number of reviews is the count of completed jobs
    const totalReviews = completedJobsInWeek.length;

    // Calculate income from these specific jobs
    const getFinalPayment = (job: Job): number => {
        return job.penalty ? job.payment * (1 - job.penalty.percentage / 100) : job.payment;
    };
    const weeklyIncome = completedJobsInWeek.reduce((sum, job) => sum + getFinalPayment(job), 0);
    
    // Per requirement, all reviews are 5-star
    const goodReviews = totalReviews; // 5-star reviews
    const averageReviews = 0;       // 1-4 star reviews

    // Average rating is 5 if there are reviews, otherwise 0
    const averageRating = totalReviews > 0 ? 5 : 0;
    
    // Set up the rating distribution graph data
    const ratingsDistribution = [
        { stars: 5, count: goodReviews },
        { stars: 4, count: 0 },
        { stars: 3, count: 0 },
        { stars: 2, count: 0 },
        { stars: 1, count: 0 },
    ].map(r => ({
        ...r,
        percentage: totalReviews > 0 ? (r.count / totalReviews) * 100 : 0,
    }));

    return {
        completedJobs: totalReviews,
        weeklyIncome,
        averageRating,
        totalReviews,
        ratings: ratingsDistribution,
        goodReviews,
        averageReviews,
    };
  }, [selectedWeek, historyJobs]);
  
  const handleSelectWeek = (option: { label: string, value: [Date, Date] }) => {
    setSelectedWeek(option);
    setIsWeekSelectorOpen(false);
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount);
  };
  
  return (
    <div className="min-h-screen font-sans bg-gray-100">
        <header className="bg-white p-4 flex items-center space-x-3 fixed top-0 left-0 right-0 z-20 shadow-md">
            <button onClick={onBack} className="text-primary hover:bg-gray-100 p-1 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
            </button>
            <h1 className="text-xl font-bold text-primary">Đánh giá</h1>
        </header>

        <main className="pt-20 p-4 space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-5">
                {/* Week Selector */}
                <div className="relative mb-6">
                    <button 
                      onClick={() => setIsWeekSelectorOpen(!isWeekSelectorOpen)}
                      className="inline-flex items-center justify-between w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-700"
                    >
                        <span>{selectedWeek.label}</span>
                        <svg className={`w-5 h-5 text-gray-500 transition-transform ${isWeekSelectorOpen ? 'transform rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>
                    {isWeekSelectorOpen && (
                        <div className="absolute top-full mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                            {weeklyOptions.map(opt => (
                                <button 
                                    key={opt.label}
                                    onClick={() => handleSelectWeek(opt)}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg"
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Summary */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-primary-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-primary-800 font-medium">Công việc hoàn thành</p>
                        <p className="text-3xl font-bold text-primary mt-1">{reviewData.completedJobs}</p>
                    </div>
                    <div className="bg-red-50 rounded-lg p-3 text-center">
                        <p className="text-sm text-red-700 font-medium">Thu nhập tuần này</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{formatCurrency(reviewData.weeklyIncome)}<span className="text-xl">đ</span></p>
                    </div>
                </div>

                {/* Rating Breakdown */}
                <div className="flex items-center mb-8">
                    <div className="flex-shrink-0 pr-6 border-r border-gray-200 text-center">
                        <p className="text-5xl font-bold text-primary">{reviewData.averageRating}<span className="text-2xl text-gray-400">/5</span></p>
                        <div className="flex justify-center space-x-1 my-2">
                            {[...Array(5)].map((_, i) => <StarIcon key={i} className={i < Math.round(reviewData.averageRating) ? "text-yellow-400 w-6 h-6" : "text-gray-300 w-6 h-6"} />)}
                        </div>
                        <p className="text-sm text-gray-500 font-semibold">{reviewData.totalReviews} đánh giá</p>
                    </div>

                    <div className="flex-1 pl-6 space-y-2">
                        {reviewData.ratings.map(r => (
                            <div key={r.stars} className="flex items-center space-x-3">
                                <span className="text-sm font-medium text-gray-600 flex items-center">{r.stars} <StarIcon className="text-yellow-400 w-4 h-4 ml-1" /></span>
                                <ProgressBar percentage={r.percentage} />
                                <span className="text-sm font-semibold text-gray-500 w-10 text-right">{Math.round(r.percentage)}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comparison Cards */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                        <p className="font-bold text-gray-800">Tốt</p>
                        <p className="text-xs text-gray-500 flex items-center justify-center">5 <StarIcon className="text-yellow-400 w-3 h-3 ml-0.5" /></p>
                        <p className="text-5xl font-bold text-gray-900 my-2">{reviewData.goodReviews}</p>
                    </div>
                     <div className="bg-white rounded-lg p-4 text-center border border-gray-200">
                        <p className="font-bold text-gray-800">Trung bình</p>
                        <p className="text-xs text-gray-500 flex items-center justify-center">1~4 <StarIcon className="text-yellow-400 w-3 h-3 ml-0.5" /></p>
                        <p className="text-5xl font-bold text-gray-900 my-2">{reviewData.averageReviews}</p>
                    </div>
                </div>
            </div>
            
            {/* Achievements Section */}
            <div className="bg-white rounded-xl shadow-lg p-5">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Thành tích</h2>
              <div className="grid grid-cols-4 gap-2 text-center">
                
                <div>
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center relative">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="32" cy="32" r="32" fill="#FBBF24"/>
                      <path d="M32 0C49.6731 0 64 14.3269 64 32C64 34.3316 63.6406 36.5833 62.9688 38.7188L32 32V0Z" fill="#F97316"/>
                      <path d="M0 32C0 14.3269 14.3269 0 32 0V32H0Z" fill="#FB923C"/>
                      <circle cx="32" cy="32" r="16" fill="#FEF3C7"/>
                      <path d="M32 22V32L39 36" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M22.0503 24.5L23.4645 23.0858" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M42 44.5L43.5 43" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M16 38L14 37" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Đúng giờ</p>
                  <p className="mt-1 text-2xl font-bold text-primary">0</p>
                </div>

                <div>
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center relative">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="32" cy="32" r="32" fill="#FCD34D"/>
                      <path d="M35 50H29V38H35V50Z" fill="#FBBF24"/>
                      <path d="M33 22L33 38" stroke="#A16207" strokeWidth="3" strokeLinecap="round"/>
                      <path d="M26 38L40 38" stroke="#A16207" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      <path d="M26 42H40L38 50H28L26 42Z" fill="#FFFFFF" stroke="#F3F4F6" strokeWidth="1"/>
                      <path d="M18 30L19 28L20 30L19 32L18 30Z" fill="white"/>
                      <path d="M48 40L48.5 39L49 40L48.5 41L48 40Z" fill="white" fillOpacity="0.8"/>
                    </svg>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Sạch sẽ</p>
                  <p className="mt-1 text-2xl font-bold text-primary">0</p>
                </div>

                <div>
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center relative">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="32" cy="32" r="32" fill="#FCD34D"/>
                      <path d="M48 38C48 44.6274 42.6274 50 36 50H28C21.3726 50 16 44.6274 16 38V30C16 23.3726 21.3726 18 28 18H36C42.6274 18 48 23.3726 48 30V38Z" fill="#EC4899"/>
                      <path d="M32 28.4C30.2 26.4 27.2 26.8 25.8 28.8C24.4 30.8 25.4 33.6 27.2 34.8L32 38L36.8 34.8C38.6 33.6 39.6 30.8 38.2 28.8C36.8 26.8 33.8 26.4 32 28.4Z" fill="white"/>
                      <path d="M20 22L21 20L22 22L21 24L20 22Z" fill="white"/>
                      <path d="M46 48L46.5 47L47 48L46.5 49L46 48Z" fill="white" fillOpacity="0.8"/>
                    </svg>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Vui vẻ</p>
                  <p className="mt-1 text-2xl font-bold text-primary">0</p>
                </div>

                <div>
                  <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center relative">
                    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="32" cy="32" r="32" fill="#854D0E"/>
                      <path d="M0 32L32 0" stroke="#A16207" strokeWidth="2"/>
                      <path d="M0 64L64 0" stroke="#A16207" strokeWidth="2"/>
                      <path d="M32 64L64 32" stroke="#A16207" strokeWidth="2"/>
                      <circle cx="32" cy="28" r="14" fill="#FDE68A"/>
                      <circle cx="38" cy="26" r="2" fill="#854D0E"/>
                      <circle cx="26" cy="26" r="2" fill="#854D0E"/>
                      <path d="M28 34C28 32 36 32 36 34" stroke="#854D0E" strokeWidth="2" strokeLinecap="round" fill="none"/>
                      <circle cx="22" cy="46" r="8" fill="#FDE68A"/>
                      <circle cx="25" cy="45" r="1.5" fill="#854D0E"/>
                      <circle cx="19" cy="45" r="1.5" fill="#854D0E"/>
                      <path d="M20 49C20 48 24 48 24 49" stroke="#854D0E" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                      <path d="M20 18L21 16L22 18L21 20L20 18Z" fill="white"/>
                      <path d="M48 50L48.5 49L49 50L48.5 51L48 50Z" fill="white" fillOpacity="0.8"/>
                    </svg>
                  </div>
                  <p className="mt-2 text-sm font-medium text-gray-700">Thân thiện</p>
                  <p className="mt-1 text-2xl font-bold text-primary">0</p>
                </div>

              </div>
            </div>
        </main>
    </div>
  );
};

export default ReviewScreen;