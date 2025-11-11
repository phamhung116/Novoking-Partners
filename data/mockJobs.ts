import { Job } from '../types';

// Helper to generate dates dynamically based on the current date
const getJobDate = (dayOffset: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + dayOffset);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Month is 0-indexed
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
};


export const MOCK_JOBS: Job[] = [
  // == Jobs with existing message history (pre-accepted) ==
  {
    id: 'job-1',
    customerName: 'Nguyễn Thị Lan',
    address: '123 Lê Duẩn, Phường Hải Châu',
    date: '25/07/2024', // Past date
    time: '08:00 - 11:00',
    duration: 3,
    payment: 180000,
    paymentMethod: 'Chuyển khoản',
    customerPhone: '0905123456',
    serviceType: 'Dọn dẹp nhà',
  },
  {
    id: 'job-2',
    customerName: 'Trần Văn An',
    address: '456 Bạch Đằng, Phường Hải Châu',
    date: '25/07/2024', // Past date
    time: '14:00 - 16:00',
    duration: 2,
    payment: 120000,
    paymentMethod: 'Tiền mặt',
    customerPhone: '0913789012',
    serviceType: 'Vệ sinh sofa',
  },
  {
    id: 'job-4',
    customerName: 'Phạm Minh Tuấn',
    address: '101 Hùng Vương, Phường Hải Châu',
    date: '26/07/2024', // Past date
    time: '15:00 - 18:00',
    duration: 3,
    payment: 195000,
    paymentMethod: 'Chuyển khoản',
    customerPhone: '0777901234',
    serviceType: 'Dọn dẹp nhà',
  },

  // == NEW JOBS for the user to accept ==
  // Today's Jobs
  {
    id: 'new-job-today-1',
    customerName: 'Lê Hoàng Yến',
    address: '789 Nguyễn Văn Linh, Phường Thanh Khê',
    date: getJobDate(0),
    time: '09:00 - 13:00',
    duration: 4,
    payment: 240000,
    paymentMethod: 'Chuyển khoản',
    customerPhone: '0988345678',
    serviceType: 'Tổng vệ sinh',
    notes: 'Khách hàng yêu cầu tập trung dọn dẹp khu vực ban công và lau sạch cửa kính.\nLưu ý: có một chậu cây cảnh dễ vỡ ở ban công.',
  },
  {
    id: 'new-job-today-2',
    customerName: 'Võ Thị Thu Hà',
    address: '222 Trần Phú, Phường Hải Châu',
    date: getJobDate(0),
    time: '18:30 - 20:30',
    duration: 2,
    payment: 150000,
    paymentMethod: 'Tiền mặt',
    customerPhone: '0333567890',
    serviceType: 'Dọn dẹp nhà',
    notes: 'Lau sàn nhà bằng nước lau sàn khách đã chuẩn bị. Không cần hút bụi.',
  },
  // Tomorrow's Jobs
  {
    id: 'new-job-tomorrow-1',
    customerName: 'Đặng Ngọc Mai',
    address: '333 Hoàng Diệu, Phường Hải Châu',
    date: getJobDate(1),
    time: '07:30 - 10:30',
    duration: 3,
    payment: 180000,
    paymentMethod: 'Tiền mặt',
    customerPhone: '0935112233',
    serviceType: 'Vệ sinh máy lạnh',
    notes: 'Nhà có nuôi chó, vui lòng chú ý khi ra vào.',
  },
  {
    id: 'new-job-tomorrow-2',
    customerName: 'Huỳnh Tấn Phát',
    address: '55 Ông Ích Khiêm, Phường Hải Châu',
    date: getJobDate(1),
    time: '14:00 - 17:00',
    duration: 3,
    payment: 200000,
    paymentMethod: 'Chuyển khoản',
    customerPhone: '0945123789',
    serviceType: 'Dịch vụ chuyển nhà',
  },
  // Jobs in 2 days
  {
    id: 'new-job-2days-1',
    customerName: 'Ngô Bảo Châu',
    address: 'Biệt thự A1, khu Euro Village, Phường Sơn Trà',
    date: getJobDate(2),
    time: '10:00 - 12:00',
    duration: 2,
    payment: 150000,
    paymentMethod: 'Tiền mặt',
    customerPhone: '0987654321',
    serviceType: 'Vệ sinh công nghiệp',
  },
    // Jobs in 3 days
  {
    id: 'new-job-3days-1',
    customerName: 'Mai Phương Thúy',
    address: 'Căn hộ 12A, Tòa nhà Azura, Phường Sơn Trà',
    date: getJobDate(3),
    time: '16:00 - 19:00',
    duration: 3,
    payment: 210000,
    paymentMethod: 'Chuyển khoản',
    customerPhone: '0369871234',
    serviceType: 'Dọn dẹp nhà',
  },
];