import { User, UserRole } from '../types';

// Dữ liệu người dùng dựa trên màn hình "Thông tin" được cung cấp.
export const MOCK_USER: User = {
  name: 'Nguyễn Minh Trang',
  // Sử dụng ảnh đại diện chuyên nghiệp hơn dựa trên ảnh chụp màn hình
  avatarUrl: 'https://i.pinimg.com/736x/52/1c/3f/521c3f949dd8dde93c874ae5db5032e9.jpg', 
  averageRating: 5,
  ratingCount: 12, // từ hình ảnh màn hình Tài khoản
  phone: '0788205251',
  email: 'a@gmail.com',
  dob: '01/01/2000',
  idNumber: '040011000400',
  address: '100 Hàm Tử, Ngũ Hành Sơn',
  role: UserRole.Partner,
};

export const MOCK_MANAGER: User = {
  name: 'Hồ Mai Anh',
  avatarUrl: 'https://i.pinimg.com/736x/3b/7f/27/3b7f275b84dd40209b52f19c131a52f6.jpg',
  averageRating: 0,
  ratingCount: 0,
  phone: '0123456789',
  email: 'manager@novoking.vn',
  dob: '01/01/1990',
  idNumber: '010011000100',
  address: '01 Vân Đồn, Sơn Trà',
  role: UserRole.Manager,
};
