export type ServiceType = 'Dọn dẹp nhà' | 'Tổng vệ sinh' | 'Vệ sinh máy lạnh' | 'Vệ sinh sofa' | 'Vệ sinh công nghiệp' | 'Dịch vụ chuyển nhà';

export interface Job {
  id: string;
  customerName: string;
  address: string;
  date: string;
  time: string;
  duration: number; // in hours
  payment: number; // in VND
  paymentMethod?: 'Tiền mặt' | 'Chuyển khoản';
  customerPhone: string;
  serviceType: ServiceType;
  status?: 'accepted' | 'in_progress' | 'completed' | 'canceled';
  checkinTime?: string;
  checkoutTime?: string;
  proofImageUrls?: string[];
  notes?: string;
  complaint?: {
    reason: string;
    message: string;
  };
  penalty?: {
    percentage: 20 | 50 | 100;
    linkedComplaintId: string;
    reason: string; // Storing reason from linked complaint for easy display
  };
  assignedToId?: string; // Links to User's idNumber
}

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'customer';
  timestamp: string;
  imageUrl?: string;
}

export interface Notification {
  id: string;
  type: 'system' | 'job';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  icon: 'megaphone' | 'gift' | 'money' | 'cancel' | 'complete' | 'alert';
  jobId?: string;
  isPopupShown?: boolean;
}

export enum UserRole {
  Partner = 'partner',
  Manager = 'manager',
}

export interface User {
  name: string;
  avatarUrl: string;
  averageRating: number;
  ratingCount: number;
  phone: string;
  email: string;
  dob: string; // date of birth
  idNumber: string; // cccd
  address: string;
  role: UserRole;
}

export enum Tab {
  New = 'VIỆC MỚI',
  Accepted = 'ĐÃ NHẬN'
}

export enum Page {
  Home = 'Trang chủ',
  Inbox = 'Hộp thư',
  History = 'Lịch sử công việc',
  Account = 'Tài khoản',
  // Manager pages
  Income = 'Thu nhập',
  Tools = 'Dụng cụ',
}

export enum InboxTab {
  Messages = 'TIN NHẮN',
  Notifications = 'THÔNG BÁO',
}

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  title: string;
  timestamp: string;
  amount: number;
  relatedJobId?: string;
}

// Obsolete type for partner tool view, replaced by CompanyTool
export type ToolStatus = 'Đủ' | 'Thiếu' | 'Hỏng';

// Obsolete type for partner tool view, replaced by CompanyTool
export interface Tool {
  id: string;
  name: string;
  quantity: number;
  status: ToolStatus;
  lastUpdated: string;
  imageUrl: string;
}

export type CompanyToolStatus = 'Khả dụng' | 'Đang sử dụng' | 'Hư hỏng';

export interface CompanyTool {
  id: string;
  name: string;
  type: string;
  status: CompanyToolStatus;
  imageUrl: string;
  purchaseDate: string; // Added purchase date
  notes?: string; // Added optional notes
  assignedToId?: string; // Links to User's idNumber
}

// New Types for Manager Income Screen
export type CompanyTransactionType = 'income' | 'expense';
export type CompanyTransactionCategory = 'Thu nhập Booking' | 'Thu nhập Phạt' | 'Chi phí Rút tiền' | 'Chi phí Đền bù';

export interface CompanyTransaction {
  id: string;
  type: CompanyTransactionType;
  category: CompanyTransactionCategory;
  title: string;
  amount: number;
  date: string; // "DD/MM/YYYY" format for consistency
  relatedCollaboratorId?: string;
  relatedJobId?: string;
}

export interface WithdrawalRequest {
  id: string;
  partnerId: string; // User's idNumber
  partnerName: string;
  amount: number;
  bankName: string;
  accountNumber: string;
  notes?: string;
  timestamp: string; // ISO string
  status: 'pending' | 'approved' | 'rejected';
}

export type ToolReportStatus = 'pending' | 'confirmed' | 'compensation_required' | 'resolved';

export interface ToolReport {
    id: string;
    toolId: string;
    toolName: string;
    partnerId: string;
    partnerName: string;
    reason: string;
    imageUrls: string[];
    timestamp: string; // ISO string
    status: ToolReportStatus;
    reportedStatus: string;
    compensationAmount?: number;
}