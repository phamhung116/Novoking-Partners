import { Job, ServiceType } from '../types';

const serviceTypeMap: { [key in ServiceType]: string } = {
  'Dọn dẹp nhà': 'DDN',
  'Tổng vệ sinh': 'TVS',
  'Vệ sinh máy lạnh': 'VSML',
  'Vệ sinh sofa': 'VSS',
  'Vệ sinh công nghiệp': 'VSCN',
  'Dịch vụ chuyển nhà': 'DCN',
};

const idCounters: { [key: string]: number } = {
  DDN: 41047482,
  TVS: 31021234,
  VSML: 51098765,
  VSS: 61012345,
  VSCN: 71054321,
  DCN: 81098712,
};

const generateBookingId = (serviceType: ServiceType): string => {
  const prefix = serviceTypeMap[serviceType];
  idCounters[prefix]++;
  return `${prefix}-${idCounters[prefix]}`;
};

const updateJobId = (job: Job, idMap: Map<string, string>): Job => {
    const oldId = job.id;
    const newId = generateBookingId(job.serviceType);
    idMap.set(oldId, newId);
    return { ...job, id: newId };
};

const idMap = new Map<string, string>();


// Dữ liệu giả định cho các công việc đã hoàn thành và đã hủy trong tháng 11/2025
const MOCK_NOVEMBER_JOBS: Job[] = [
  {
    id: 'hist-nov-1',
    customerName: 'Trần Minh Hoàng',
    address: '55 Ngũ Hành Sơn, Phường Mỹ An, Ngũ Hành Sơn',
    date: '01/11/2025',
    time: '08:00 - 11:00',
    duration: 3,
    payment: 720000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0905111222',
    serviceType: 'Tổng vệ sinh' as ServiceType,
    status: 'completed' as const,
    checkinTime: '07:59, 01/11/2025',
    checkoutTime: '11:02, 01/11/2025',
    proofImageUrls: ['https://i.pinimg.com/736x/1b/48/73/1b4873d843825585098b6755b1f62506.jpg'],
    assignedToId: '040099001122', // Lê Thị Bích
  },
  {
    id: 'hist-nov-2',
    customerName: 'Lý Thu Thảo',
    address: 'Căn hộ 203, Chung cư HAGL Lakeview, Phường Thanh Khê',
    date: '02/11/2025',
    time: '14:00 - 16:00',
    duration: 2,
    payment: 360000,
    paymentMethod: 'Tiền mặt' as const,
    customerPhone: '0913222333',
    serviceType: 'Dọn dẹp nhà' as ServiceType,
    status: 'completed' as const,
    checkinTime: '14:01, 02/11/2025',
    checkoutTime: '16:00, 02/11/2025',
    assignedToId: '040095002233', // Phạm Minh Tuấn
  },
  {
    id: 'hist-nov-3',
    customerName: 'Nguyễn Văn Hùng',
    address: '123/45 Lê Duẩn, Phường Hải Châu',
    date: '02/11/2025',
    time: '09:30 - 11:30',
    duration: 2,
    payment: 120000,
    paymentMethod: 'Tiền mặt' as const,
    customerPhone: '0935444555',
    serviceType: 'Vệ sinh máy lạnh' as ServiceType,
    status: 'canceled' as const,
    notes: 'Lý do hủy: Khách hàng báo bận đột xuất',
    assignedToId: '040097004455', // Võ Tấn Phát
  },
  {
    id: 'hist-nov-4',
    customerName: 'Võ Thị Sáu',
    address: 'Biệt thự A10, Làng Châu Âu, Phường Sơn Trà',
    date: '01/11/2025',
    time: '13:00 - 17:00',
    duration: 4,
    payment: 1500000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0978555666',
    serviceType: 'Vệ sinh công nghiệp' as ServiceType,
    status: 'completed' as const,
    checkinTime: '13:05, 01/11/2025',
    checkoutTime: '17:10, 01/11/2025',
    complaint: {
      reason: 'Làm vỡ đồ',
      message: 'Cộng tác viên làm vỡ một bình hoa nhỏ trên bàn. Yêu cầu bồi thường.'
    },
    penalty: {
      // FIX: Add 'as const' to ensure the numeric literal '20' is not widened to 'number',
      // making it assignable to the specific union type '20 | 50 | 100' in the Job interface.
      percentage: 20 as const,
      linkedComplaintId: 'hist-nov-4',
      reason: 'Làm vỡ đồ: "Cộng tác viên làm vỡ một bình hoa nhỏ trên bàn. Yêu cầu bồi thường."'
    },
    assignedToId: '040011000400', // Nguyễn Minh Trang
  },
].map(job => updateJobId(job, idMap));

// Dữ liệu giả định cho các công việc đã hoàn thành và đã hủy trong tháng 10/2025
const MOCK_OCTOBER_JOBS: Job[] = [
  {
    id: 'hist-oct-1',
    customerName: 'Phan Anh Dũng',
    address: '12 An Thượng 1, Phường Ngũ Hành Sơn',
    date: '27/10/2025',
    time: '10:00 - 12:00',
    duration: 2,
    payment: 300000,
    paymentMethod: 'Tiền mặt' as const,
    customerPhone: '0905123123',
    serviceType: 'Dọn dẹp nhà' as ServiceType,
    status: 'completed' as const,
    checkinTime: '09:58, 27/10/2025',
    checkoutTime: '12:03, 27/10/2025',
    proofImageUrls: ['https://i.pinimg.com/736x/f6/8b/a9/f68ba9e891acc16955e6921c5f3ba1e8.jpg'],
    complaint: {
      reason: 'Dọn dẹp không sạch sẽ',
      message: 'Cộng tác viên lau sàn còn bẩn, nhiều góc khuất trong nhà vệ sinh bị bỏ qua. Yêu cầu kiểm tra và xử lý gấp.'
    },
    assignedToId: '040011000400', // Nguyễn Minh Trang
  },
  {
    id: 'hist-oct-2',
    customerName: 'Lê Thị Hà',
    address: '34 Pasteur, Phường Hải Châu',
    date: '26/10/2025',
    time: '15:00 - 17:00',
    duration: 2,
    payment: 130000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0913456456',
    serviceType: 'Vệ sinh công nghiệp' as ServiceType,
    status: 'canceled' as const,
    notes: 'Lý do hủy: Khách hàng báo bận đột xuất',
    assignedToId: '040099001122', // Lê Thị Bích
  },
  {
    id: 'hist-oct-3',
    customerName: 'Đặng Văn Lâm',
    address: 'Khu biệt thự The Point, Phường Ngũ Hành Sơn',
    date: '25/10/2025',
    time: '08:00 - 12:00',
    duration: 4,
    payment: 960000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0987112233',
    serviceType: 'Tổng vệ sinh' as ServiceType,
    status: 'completed' as const,
    checkinTime: '08:00, 25/10/2025',
    checkoutTime: '12:00, 25/10/2025',
    assignedToId: '040095002233', // Phạm Minh Tuấn
  },
  {
    id: 'hist-oct-4',
    customerName: 'Nguyễn Quang Hải',
    address: 'Văn phòng ABC, 102 Quang Trung, Phường Thanh Khê',
    date: '23/10/2025',
    time: '13:00 - 17:00',
    duration: 4,
    payment: 1650000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0905987654',
    serviceType: 'Vệ sinh công nghiệp' as ServiceType,
    status: 'completed' as const,
    checkinTime: '12:55, 23/10/2025',
    checkoutTime: '17:05, 23/10/2025',
    proofImageUrls: ['https://i.pinimg.com/736x/c9/2c/6e/c92c6e6e2213e4590327918541e2f6d6.jpg'],
    complaint: {
      reason: 'Quên không dọn dẹp',
      message: 'Cộng tác viên quên không đổ rác ở khu vực bếp. Mọi thứ khác đều ổn.'
    },
    assignedToId: '040097004455', // Võ Tấn Phát
  },
  {
    id: 'hist-oct-5',
    customerName: 'Bùi Thị Yến',
    address: '78 Lê Lợi, Phường Hải Châu',
    date: '22/10/2025',
    time: '09:00 - 11:00',
    duration: 2,
    payment: 120000,
    paymentMethod: 'Tiền mặt' as const,
    customerPhone: '0333444555',
    serviceType: 'Dọn dẹp nhà' as ServiceType,
    status: 'canceled' as const,
    notes: 'Lý do hủy: Kẹt xe, không đến kịp giờ',
    assignedToId: '040101003344', // Huỳnh Ngọc Mai
  },
  {
    id: 'hist-oct-6',
    customerName: 'Võ Hoàng Yến',
    address: 'Căn hộ 1502, Monarchy B, Phường Sơn Trà',
    date: '20/10/2025',
    time: '17:00 - 19:00',
    duration: 2,
    payment: 360000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0905667788',
    serviceType: 'Dọn dẹp nhà' as ServiceType,
    status: 'completed' as const,
    checkinTime: '17:02, 20/10/2025',
    checkoutTime: '19:00, 20/10/2025',
    assignedToId: '040096005566', // Đặng Thị Thu Hà
  },
  {
    id: 'hist-oct-7',
    customerName: 'Trịnh Thăng Bình',
    address: 'Homestay An Nhiên, 34 An Thượng 32, Phường Ngũ Hành Sơn',
    date: '18/10/2025',
    time: '11:00 - 14:00',
    duration: 3,
    payment: 500000,
    paymentMethod: 'Tiền mặt' as const,
    customerPhone: '0935123789',
    serviceType: 'Vệ sinh sofa' as ServiceType,
    status: 'completed' as const,
    checkinTime: '10:59, 18/10/2025',
    checkoutTime: '14:03, 18/10/2025',
    proofImageUrls: ['https://i.pinimg.com/736x/d6/97/81/d697814412c98858a7167f9991b30642.jpg'],
    complaint: {
      reason: 'Thiếu dụng cụ',
      message: 'CTV báo không mang theo đủ dụng cụ lau kính nên cửa kính vẫn còn hơi mờ.'
    },
    assignedToId: '040102006677', // Bùi Quang Hải
  },
  {
    id: 'hist-oct-8',
    customerName: 'Hồ Quang Hiếu',
    address: '99 Hoàng Diệu, Phường Hải Châu',
    date: '16/10/2025',
    time: '19:00 - 21:00',
    duration: 2,
    payment: 150000,
    paymentMethod: 'Tiền mặt' as const,
    customerPhone: '0905111333',
    serviceType: 'Dọn dẹp nhà' as ServiceType,
    status: 'canceled' as const,
    notes: 'Lý do hủy: Không liên lạc được với khách hàng',
    assignedToId: '040094007788', // Đỗ Thị Lan
  },
  {
    id: 'hist-oct-9',
    customerName: 'Mai Phương Thúy',
    address: 'Khách sạn Hyatt Regency, Phường Ngũ Hành Sơn',
    date: '10/10/2025',
    time: '09:00 - 13:00',
    duration: 4,
    payment: 900000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0905222888',
    serviceType: 'Dịch vụ chuyển nhà' as ServiceType,
    status: 'completed' as const,
    checkinTime: '09:00, 10/10/2025',
    checkoutTime: '13:00, 10/10/2025',
    assignedToId: '040093008899', // Hồ Văn Dũng
  },
  {
    id: 'hist-oct-10',
    customerName: 'Phạm Quỳnh Anh',
    address: '333 Lê Duẩn, Phường Thanh Khê',
    date: '08/10/2025',
    time: '14:00 - 17:00',
    duration: 3,
    payment: 440000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0905999000',
    serviceType: 'Dọn dẹp nhà' as ServiceType,
    status: 'completed' as const,
    checkinTime: '13:58, 08/10/2025',
    checkoutTime: '17:01, 08/10/2025',
    proofImageUrls: ['https://i.pinimg.com/736x/8e/29/5b/8e295b22b826859e07175510b0d55e2d.jpg'],
    complaint: {
        reason: 'Thái độ của cộng tác viên',
        message: 'Cộng tác viên có thái độ không thân thiện, gắt gỏng khi tôi hỏi thêm về dịch vụ.'
    },
    assignedToId: '040100009900', // Ngô Anh Khoa
  },
   {
    id: 'hist-oct-11',
    customerName: 'Đông Nhi',
    address: 'Văn phòng LogiGear, 72 Hàm Nghi, Phường Thanh Khê',
    date: '03/10/2025',
    time: '08:30 - 11:30',
    duration: 3,
    payment: 800000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0905121212',
    serviceType: 'Vệ sinh công nghiệp' as ServiceType,
    status: 'completed' as const,
    checkinTime: '08:29, 03/10/2025',
    checkoutTime: '11:30, 03/10/2025',
    assignedToId: '040098001111', // Dương Mỹ Linh
  },
].map(job => updateJobId(job, idMap));

// More data for 2025
const MOCK_2025_EXTRA_JOBS: Job[] = [
    // Q1 2025
    { id: 'hist-25-q1-1', customerName: 'Trần Quyết Thắng', address: '1 Đống Đa, Hải Châu', date: '15/01/2025', time: '09:00-11:00', duration: 2, payment: 240000, serviceType: 'Dọn dẹp nhà' as ServiceType, status: 'completed' as const, assignedToId: '040099001122', customerPhone: '0987654321'},
    { id: 'hist-25-q1-2', customerName: 'Bùi Anh Tuấn', address: '2 Cù Chính Lan, Thanh Khê', date: '20/02/2025', time: '14:00-17:00', duration: 3, payment: 800000, serviceType: 'Tổng vệ sinh' as ServiceType, status: 'completed' as const, assignedToId: '040095002233', customerPhone: '0987123456'},
    { id: 'hist-25-q1-3', customerName: 'Phạm Thị Hương', address: '3 Tôn Thất Đạm, Thanh Khê', date: '05/03/2025', time: '10:00-12:00', duration: 2, payment: 400000, serviceType: 'Vệ sinh máy lạnh' as ServiceType, status: 'completed' as const, assignedToId: '040101003344', customerPhone: '0987789012'},
    { id: 'hist-25-q1-4', customerName: 'Cao Thái Sơn', address: '4 Lý Thường Kiệt, Hải Châu', date: '12/03/2025', time: '18:00-20:00', duration: 2, payment: 280000, serviceType: 'Dọn dẹp nhà' as ServiceType, status: 'completed' as const, assignedToId: '040011000400', customerPhone: '0987654321'},
    // Q2 2025
    { id: 'hist-25-q2-1', customerName: 'Lê Minh Châu', address: '4 Nguyễn Hữu Thọ, Hải Châu', date: '10/04/2025', time: '08:00-12:00', duration: 4, payment: 1200000, serviceType: 'Vệ sinh công nghiệp' as ServiceType, status: 'completed' as const, assignedToId: '040097004455', customerPhone: '0976543210'},
    { id: 'hist-25-q2-2', customerName: 'Hoàng Thị Yến', address: '5 Võ Văn Kiệt, Sơn Trà', date: '18/05/2025', time: '13:00-15:00', duration: 2, payment: 440000, serviceType: 'Vệ sinh sofa' as ServiceType, status: 'completed' as const, assignedToId: '040096005566', customerPhone: '0976123456'},
    { id: 'hist-25-q2-3', customerName: 'Nguyễn Thanh Tùng', address: '6 Phạm Văn Đồng, Sơn Trà', date: '25/06/2025', time: '09:00-11:00', duration: 2, payment: 240000, serviceType: 'Dọn dẹp nhà' as ServiceType, status: 'completed' as const, assignedToId: '040102006677', customerPhone: '0976789012'},
    { id: 'hist-25-q2-4', customerName: 'Noo Phước Thịnh', address: '7 Trần Hưng Đạo, Sơn Trà', date: '01/06/2025', time: '16:00-18:00', duration: 2, payment: 260000, serviceType: 'Dọn dẹp nhà' as ServiceType, status: 'completed' as const, assignedToId: '040011000400', customerPhone: '0976543210'},
    // Q3 2025
    { id: 'hist-25-q3-1', customerName: 'Đỗ Hùng Dũng', address: '7 Hoàng Sa, Sơn Trà', date: '01/07/2025', time: '15:00-18:00', duration: 3, payment: 840000, serviceType: 'Tổng vệ sinh' as ServiceType, status: 'completed' as const, assignedToId: '040094007788', customerPhone: '0965432109'},
    { id: 'hist-25-q3-2', customerName: 'Trần Thị Mỹ Linh', address: '8 Trường Sa, Ngũ Hành Sơn', date: '15/08/2025', time: '10:00-12:00', duration: 2, payment: 240000, serviceType: 'Dọn dẹp nhà' as ServiceType, status: 'completed' as const, assignedToId: '040093008899', customerPhone: '0965123456'},
    { id: 'hist-25-q3-3', customerName: 'Lý Công Hoàng Anh', address: '9 Lê Văn Hiến, Ngũ Hành Sơn', date: '20/09/2025', time: '09:00-11:00', duration: 2, payment: 300000, serviceType: 'Vệ sinh máy lạnh' as ServiceType, status: 'completed' as const, assignedToId: '040100009900', customerPhone: '0965789012'},
].map(job => updateJobId(job, idMap));

// Data for 2024
const MOCK_2024_JOBS: Job[] = [
    // Q1 2024
    { id: 'hist-24-q1-1', customerName: 'Nguyễn Công Phượng', address: '10 Cầu Rồng, Hải Châu', date: '10/01/2024', time: '09:00-12:00', duration: 3, payment: 700000, serviceType: 'Tổng vệ sinh' as ServiceType, status: 'completed' as const, assignedToId: '040011000400', customerPhone: '0954321098'},
    { id: 'hist-24-q1-2', customerName: 'Lương Xuân Trường', address: '11 Cầu Sông Hàn, Sơn Trà', date: '15/02/2024', time: '14:00-16:00', duration: 2, payment: 240000, serviceType: 'Dọn dẹp nhà' as ServiceType, status: 'completed' as const, assignedToId: '040099001122', customerPhone: '0954123456'},
    { id: 'hist-24-q1-3', customerName: 'Vũ Văn Thanh', address: '12 Cầu Tình Yêu, Sơn Trà', date: '20/03/2024', time: '10:00-12:00', duration: 2, payment: 400000, serviceType: 'Vệ sinh sofa' as ServiceType, status: 'completed' as const, assignedToId: '040095002233', customerPhone: '0954789012'},
    // Q2 2024
    { id: 'hist-24-q2-1', customerName: 'Nguyễn Văn Toàn', address: '14 Bãi biển Mỹ Khê, Ngũ Hành Sơn', date: '05/04/2024', time: '08:00-11:00', duration: 3, payment: 900000, serviceType: 'Vệ sinh công nghiệp' as ServiceType, status: 'completed' as const, assignedToId: '040101003344', customerPhone: '0943210987'},
    { id: 'hist-24-q2-2', customerName: 'Nguyễn Tuấn Anh', address: '15 Bà Nà Hills, Hòa Vang', date: '10/05/2024', time: '13:00-17:00', duration: 4, payment: 1000000, serviceType: 'Tổng vệ sinh' as ServiceType, status: 'completed' as const, assignedToId: '040097004455', customerPhone: '0943123456'},
    { id: 'hist-24-q2-3', customerName: 'Hà Đức Chinh', address: '16 Ngũ Hành Sơn', date: '15/06/2024', time: '09:00-11:00', duration: 2, payment: 240000, serviceType: 'Dọn dẹp nhà' as ServiceType, status: 'completed' as const, assignedToId: '040096005566', customerPhone: '0943789012'},
    { id: 'hist-24-q2-4', customerName: 'Sơn Tùng M-TP', address: '17 Resort Intercontinental, Sơn Trà', date: '22/06/2024', time: '10:00-14:00', duration: 4, payment: 1600000, serviceType: 'Vệ sinh công nghiệp' as ServiceType, status: 'completed' as const, assignedToId: '040011000400', customerPhone: '0943789012'},
    // Q3 2024
    { id: 'hist-24-q3-1', customerName: 'Phan Văn Đức', address: '17 Chùa Linh Ứng, Sơn Trà', date: '20/07/2024', time: '14:00-16:00', duration: 2, payment: 300000, serviceType: 'Vệ sinh máy lạnh' as ServiceType, status: 'completed' as const, assignedToId: '040102006677', customerPhone: '0932109876'},
    { id: 'hist-24-q3-2', customerName: 'Bùi Tiến Dũng', address: '18 Cầu Vàng, Hòa Vang', date: '25/08/2024', time: '10:00-13:00', duration: 3, payment: 360000, serviceType: 'Dọn dẹp nhà' as ServiceType, status: 'completed' as const, assignedToId: '040094007788', customerPhone: '0932123456'},
    { id: 'hist-24-q3-3', customerName: 'Đoàn Văn Hậu', address: '19 Bán đảo Sơn Trà', date: '30/09/2024', time: '08:00-12:00', duration: 4, payment: 1100000, serviceType: 'Tổng vệ sinh' as ServiceType, status: 'completed' as const, assignedToId: '040093008899', customerPhone: '0932789012'},
    // Q4 2024
    { id: 'hist-24-q4-1', customerName: 'Quế Ngọc Hải', address: '20 Chợ Cồn, Hải Châu', date: '05/10/2024', time: '13:00-15:00', duration: 2, payment: 240000, serviceType: 'Dọn dẹp nhà' as ServiceType, status: 'completed' as const, assignedToId: '040100009900', customerPhone: '0921098765'},
    { id: 'hist-24-q4-2', customerName: 'Trần Đình Trọng', address: '21 Chợ Hàn, Hải Châu', date: '10/11/2024', time: '09:00-11:00', duration: 2, payment: 440000, serviceType: 'Vệ sinh sofa' as ServiceType, status: 'completed' as const, assignedToId: '040098001111', customerPhone: '0921123456'},
    { id: 'hist-24-q4-3', customerName: 'Đỗ Duy Mạnh', address: '22 Công viên APEC, Hải Châu', date: '15/12/2024', time: '15:00-19:00', duration: 4, payment: 1200000, serviceType: 'Vệ sinh công nghiệp' as ServiceType, status: 'completed' as const, assignedToId: '040097002222', customerPhone: '0921789012'},
].map(job => updateJobId(job, idMap));

const MOCK_HISTORY_JOBS_LEGACY: Job[] = [
  // Existing October Jobs
  {
    id: 'hist-job-1',
    customerName: 'Trần Thị Bích',
    address: '25 Nguyễn Chí Thanh, Phường Hải Châu',
    date: '15/10/2025',
    time: '09:00 - 12:00',
    duration: 3,
    payment: 720000,
    paymentMethod: 'Tiền mặt' as const,
    customerPhone: '0905111222',
    serviceType: 'Tổng vệ sinh' as ServiceType,
    status: 'completed' as const,
    checkinTime: '09:00, 15/10/2025',
    checkoutTime: '12:05, 15/10/2025',
    proofImageUrls: ['https://i.pinimg.com/736x/8e/29/5b/8e295b22b826859e07175510b0d55e2d.jpg'],
    assignedToId: '040097002222', // Lý Bảo Châu
  },
  {
    id: 'hist-job-2',
    customerName: 'Hoàng Văn Dũng',
    address: 'K1/123 Tô Hiến Thành, Phường Sơn Trà',
    date: '12/10/2025',
    time: '14:00 - 16:00',
    duration: 2,
    payment: 130000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0913333444',
    serviceType: 'Vệ sinh công nghiệp' as ServiceType,
    status: 'canceled' as const,
    notes: 'Lý do hủy: Lý do cá nhân đột xuất',
    assignedToId: '040095003333', // Vương Thị Yến
  },
  {
    id: 'hist-job-5',
    customerName: 'Vũ Ngọc Ánh',
    address: '111 Phan Châu Trinh, Phường Hải Châu',
    date: '05/10/2025',
    time: '08:00 - 10:00',
    duration: 2,
    payment: 240000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0905888999',
    serviceType: 'Dọn dẹp nhà' as ServiceType,
    status: 'completed' as const,
    checkinTime: '07:58, 05/10/2025',
    checkoutTime: '10:02, 05/10/2025',
    assignedToId: '040092004444', // Trịnh Văn Lâm
  },
  // September 2025 Jobs
  {
    id: 'hist-job-3',
    customerName: 'Lê Anh Khoa',
    address: 'Căn hộ 505, Tòa B, FPT Plaza 2, Phường Ngũ Hành Sơn',
    date: '28/09/2025',
    time: '18:00 - 20:00',
    duration: 2,
    payment: 300000,
    paymentMethod: 'Tiền mặt' as const,
    customerPhone: '0987654321',
    serviceType: 'Dọn dẹp nhà' as ServiceType,
    status: 'completed' as const,
    checkinTime: '18:01, 28/09/2025',
    checkoutTime: '20:00, 28/09/2025',
    proofImageUrls: ['https://i.pinimg.com/736x/1b/48/73/1b4873d843825585098b6755b1f62506.jpg'],
    assignedToId: '040096005555', // Trần Văn An
  },
  {
    id: 'hist-job-4',
    customerName: 'Đỗ Mỹ Linh',
    address: 'Khách sạn Mường Thanh, Võ Nguyên Giáp, Phường Ngũ Hành Sơn',
    date: '10/09/2025',
    time: '10:00 - 14:00',
    duration: 4,
    payment: 700000,
    paymentMethod: 'Chuyển khoản' as const,
    customerPhone: '0945555666',
    serviceType: 'Vệ sinh máy lạnh' as ServiceType,
    status: 'completed' as const,
    checkinTime: '10:00, 10/09/2025',
    checkoutTime: '14:00, 10/09/2025',
    assignedToId: '040011000400', // Nguyễn Minh Trang
  },
].map(job => updateJobId(job, idMap));

// Final step: update linkedComplaintId
const allJobsWithNewIds: Job[] = [
  ...MOCK_NOVEMBER_JOBS,
  ...MOCK_OCTOBER_JOBS,
  ...MOCK_2025_EXTRA_JOBS,
  ...MOCK_2024_JOBS,
  ...MOCK_HISTORY_JOBS_LEGACY,
].map(job => {
    if (job.penalty?.linkedComplaintId) {
        const newLinkedId = idMap.get(job.penalty.linkedComplaintId);
        if (newLinkedId) {
            return { ...job, penalty: { ...job.penalty, linkedComplaintId: newLinkedId } };
        }
    }
    return job;
});


export const MOCK_HISTORY_JOBS: Job[] = allJobsWithNewIds;

// Export the map for other files to use
export const ID_MAP = idMap;
