import { Job } from '../types';

/**
 * Phân tích chuỗi ngày tháng 'DD/MM/YYYY' thành đối tượng Date.
 * @param dateStr Chuỗi ngày tháng.
 * @returns Đối tượng Date.
 */
export const parseDateString = (dateStr: string): Date => {
  const [day, month, year] = dateStr.split('/').map(Number);
  // Tháng trong JavaScript bắt đầu từ 0 (0 = Tháng 1, 11 = Tháng 12)
  return new Date(year, month - 1, day);
};

/**
 * Định dạng đối tượng Date thành một chuỗi dễ đọc (ví dụ: "Thứ Sáu, 26/07/2024").
 * @param date Đối tượng Date.
 * @returns Chuỗi ngày tháng đã định dạng.
 */
export const formatDateForDisplay = (date: Date): string => {
  const formatted = new Intl.DateTimeFormat('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
  // Viết hoa chữ cái đầu của Thứ
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
};


/**
 * Định dạng ngày với các nhãn tương đối như "Hôm nay", "Ngày mai", hoặc Thứ trong tuần.
 * @param dateStr Chuỗi ngày tháng 'DD/MM/YYYY'.
 * @returns Chuỗi đã định dạng, ví dụ: "Hôm nay, 26/07/2024" hoặc "Thứ Ba, 30/07/2024".
 */
export const formatDateWithRelativeDay = (dateStr: string): string => {
    const jobDate = parseDateString(dateStr);
    const today = new Date();
    
    // Đặt lại giờ để so sánh ngày chính xác
    today.setHours(0, 0, 0, 0);
    jobDate.setHours(0, 0, 0, 0);

    const diffTime = jobDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Hôm nay, ${dateStr}`;
    } else if (diffDays === 1) {
      return `Ngày mai, ${dateStr}`;
    }
    
    // Đối với các ngày khác, hiển thị Thứ và ngày tháng đầy đủ
    return formatDateForDisplay(jobDate);
};

/**
 * Xác định buổi trong ngày từ thời gian bắt đầu công việc.
 * @param timeStr Chuỗi thời gian, ví dụ: '08:00 - 11:00'.
 * @returns 'sang', 'chieu', hoặc 'toi'.
 */
export const getTimeOfDay = (timeStr: string): 'sang' | 'chieu' | 'toi' => {
  const startTime = timeStr.split(' - ')[0];
  const hour = parseInt(startTime.split(':')[0], 10);

  if (hour < 12) {
    return 'sang'; // Buổi sáng: trước 12:00
  }
  if (hour < 18) {
    return 'chieu'; // Buổi chiều: từ 12:00 đến 17:59
  }
  return 'toi'; // Buổi tối: từ 18:00 trở đi
};


export interface GroupedJobs {
    [date: string]: {
        sang: Job[];
        chieu: Job[];
        toi: Job[];
    }
}

/**
 * Nhóm các công việc theo ngày và buổi.
 * @param jobs Danh sách công việc.
 * @returns Một đối tượng chứa các công việc đã được nhóm.
 */
export const groupJobsByDay = (jobs: Job[]): GroupedJobs => {
    return jobs.reduce((acc, job) => {
        const jobDate = parseDateString(job.date);
        const dateKey = jobDate.toISOString().split('T')[0]; // Sử dụng YYYY-MM-DD làm key
        const timeOfDay = getTimeOfDay(job.time);

        if (!acc[dateKey]) {
            acc[dateKey] = { sang: [], chieu: [], toi: [] };
        }

        acc[dateKey][timeOfDay].push(job);

        return acc;
    }, {} as GroupedJobs);
};

/**
 * Gets the start (Monday) and end (Sunday) of the week for a given date.
 * @param date The date within the desired week.
 * @returns A tuple with [startDate, endDate].
 */
export const getWeekRange = (date: Date): [Date, Date] => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay();
  // Adjust so Monday is the first day of the week (day 1), and Sunday is the last (day 0 -> 7)
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); 
  const monday = new Date(d.setDate(diff));

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  
  return [monday, sunday];
};