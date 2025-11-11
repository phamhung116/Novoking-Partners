import React from 'react';
import { Job } from '../types';
import JobCard from './JobCard';

interface JobListProps {
  jobs: Job[];
  onJobClick?: (job: Job) => void;
  emptyMessage: string;
}

const JobList: React.FC<JobListProps> = ({ jobs, onJobClick, emptyMessage }) => {
  if (jobs.length === 0) {
    return (
        <div className="text-center py-20">
            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
            </svg>
            <p className="mt-4 text-lg text-gray-500">{emptyMessage}</p>
        </div>
    );
  }

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {jobs.map(job => (
        <JobCard
          key={job.id}
          job={job}
          onCardClick={onJobClick}
        />
      ))}
    </div>
  );
};

export default JobList;