import React from 'react';
import { Job } from '../types';
import JobCard from './JobCard';
import { getTimeOfDay } from '../utils/dateUtils';

// --- Cập nhật Interface ---
interface TimeOfDaySectionProps {
  title: string;
  jobs: Job[];
  onJobClick: (job: Job) => void;
  backgroundUrl?: string;
  titleColorClass?: string; // Prop để tùy chỉnh màu chữ
}

// --- Cập nhật Component TimeOfDaySection ---
const TimeOfDaySection: React.FC<TimeOfDaySectionProps> = ({ title, jobs, onJobClick, backgroundUrl, titleColorClass }) => {
    if (jobs.length === 0) return null;

    const sectionStyle = backgroundUrl ? {
        backgroundImage: `url('${backgroundUrl}')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    } : {};

    // 💡 Cập nhật: Ưu tiên titleColorClass nếu có, nếu không thì dùng màu mặc định.
    // Lớp màu chữ mặc định là 'text-primary-600' (như ban đầu nếu không có background).
    const defaultColorClass = backgroundUrl ? 'text-white' : 'text-primary-600';
    const finalColorClass = titleColorClass || defaultColorClass;

    return (
        <div style={sectionStyle}>
            <div className="max-w-4xl mx-auto px-4 py-6">
                <h3 
                    // 💡 Cập nhật: Sử dụng finalColorClass. Đã loại bỏ logic đổ bóng chữ (textShadow).
                    className={`text-xl font-bold mb-3 ${finalColorClass}`}
                >
                    {title}
                </h3>
                <div className="space-y-4">
                    {jobs.map(job => <JobCard key={job.id} job={job} onCardClick={onJobClick} />)}
                </div>
            </div>
        </div>
    );
}

// --- Phần AcceptedJobsByDay được cập nhật để truyền các prop mới ---
interface AcceptedJobsByDayProps {
    jobs: Job[];
    onJobClick: (job: Job) => void;
}

const AcceptedJobsByDay: React.FC<AcceptedJobsByDayProps> = ({ jobs, onJobClick }) => {
    if (jobs.length === 0) {
        return (
            <div className="text-center py-20 px-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-lg text-gray-500">Không có công việc nào được nhận cho ngày này.</p>
            </div>
        );
    }
    
    const jobsByTime = {
        sang: jobs.filter(j => getTimeOfDay(j.time) === 'sang'),
        chieu: jobs.filter(j => getTimeOfDay(j.time) === 'chieu'),
        toi: jobs.filter(j => getTimeOfDay(j.time) === 'toi')
    };
    
    const backgroundImages = {
        sang: 'https://i.pinimg.com/736x/18/fc/a6/18fca636dbb7cb675564ad3dc2e2a359.jpg',
        chieu: 'https://i.pinimg.com/736x/b4/45/77/b44577a388078e4f7409290cf5c8068b.jpg',
        toi: 'https://i.pinimg.com/736x/52/08/56/520856f9598551d83d7c1cf5b9b8a661.jpg'
    };

    return (
        <div>
            {/* Buổi sáng: titleColorClass="text-primary" */}
            <TimeOfDaySection 
                title="Buổi sáng" 
                jobs={jobsByTime.sang} 
                onJobClick={onJobClick} 
                backgroundUrl={backgroundImages.sang} 
                titleColorClass="text-primary" 
            /> 
            {/* Buổi chiều: titleColorClass="text-secondary" */}
            <TimeOfDaySection 
                title="Buổi chiều" 
                jobs={jobsByTime.chieu} 
                onJobClick={onJobClick} 
                backgroundUrl={backgroundImages.chieu} 
                titleColorClass="text-secondary" 
            />
            {/* Buổi tối: titleColorClass="text-white" */}
            <TimeOfDaySection 
                title="Buổi tối" 
                jobs={jobsByTime.toi} 
                onJobClick={onJobClick} 
                backgroundUrl={backgroundImages.toi} 
                titleColorClass="text-white" 
            />
        </div>
    );
};

export default AcceptedJobsByDay;