import React, { useState } from 'react';
import { Job, Tab } from '../types';
import Header from '../components/Header';
import JobList from '../components/JobList';
import AcceptedJobsByDay from '../components/AcceptedJobsByDay';
import DateTabs from '../components/DateTabs';
import { parseDateString } from '../utils/dateUtils';
import FilterModal from '../components/FilterModal';
import { DA_NANG_WARDS } from '../constants';

interface HomeScreenProps {
  newJobs: Job[];
  acceptedJobs: Job[];
  onSelectJob: (job: Job) => void;
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

// Helper for robust string matching (case-insensitive, ignores diacritics)
const normalizeString = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

const HomeScreen: React.FC<HomeScreenProps> = ({ newJobs, acceptedJobs, onSelectJob, activeTab, onTabChange }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedWards, setSelectedWards] = useState<string[]>([]);

  const filteredNewJobs = selectedWards.length === 0
    ? newJobs
    : newJobs.filter(job => {
        const normalizedAddress = normalizeString(job.address);
        return selectedWards.some(ward => normalizedAddress.includes(normalizeString(ward)));
    });

  return (
    <div className="min-h-screen">
      <div className="fixed top-0 left-0 right-0 z-10">
        <Header
          activeTab={activeTab}
          onTabChange={onTabChange}
          newJobCount={newJobs.length}
        />
        {activeTab === Tab.Accepted && (
          <DateTabs
            jobs={acceptedJobs}
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
        )}
      </div>

      <main>
        {(() => {
          switch (activeTab) {
            case Tab.New:
              return (
                <div className="p-4 pt-32 sm:pt-24">
                  <div className="mb-4 flex justify-end" style={{ marginTop: '10px' }}>
                    <button
                      onClick={() => setIsFilterOpen(true)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-semibold border-2 transition-colors duration-200 ${selectedWards.length > 0 ? 'bg-primary-50 border-primary text-primary-700' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                      </svg>
                      <span>Lọc theo khu vực</span>
                      {selectedWards.length > 0 &&
                        <span className={`flex items-center justify-center h-5 w-5 rounded-full text-xs font-bold ${selectedWards.length > 0 ? 'bg-primary text-white' : ''}`}>
                          {selectedWards.length}
                        </span>
                      }
                    </button>
                  </div>
                  <JobList
                    jobs={filteredNewJobs}
                    onJobClick={onSelectJob}
                    emptyMessage={selectedWards.length > 0 ? "Không tìm thấy công việc phù hợp." : "Hiện tại không có việc mới nào."}
                  />
                </div>
              );
            case Tab.Accepted:
              const jobsForSelectedDay = acceptedJobs.filter(job => {
                const jobDate = parseDateString(job.date);
                return jobDate.toDateString() === selectedDate.toDateString();
              });

              return (
                <div className="pt-60 sm:pt-52">
                  <AcceptedJobsByDay
                    jobs={jobsForSelectedDay}
                    onJobClick={onSelectJob}
                  />
                </div>
              );
            default:
              return null;
          }
        })()}
      </main>
      {isFilterOpen && (
        <FilterModal
          wards={DA_NANG_WARDS}
          initialSelectedWards={selectedWards}
          onClose={() => setIsFilterOpen(false)}
          onApply={(wards) => {
            setSelectedWards(wards);
            setIsFilterOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default HomeScreen;