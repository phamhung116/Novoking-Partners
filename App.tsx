

import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Job, Page, Message, Tab, Notification, User, UserRole, Tool, ToolStatus, CompanyTool, CompanyToolStatus, WithdrawalRequest, CompanyTransaction, Transaction, ToolReport } from './types';
import SuccessPopup from './components/SuccessPopup';
import JobDetailModal from './components/JobDetailModal';
import LoginScreen from './screens/LoginScreen';
import OtpScreen from './screens/OtpScreen';
import ChatScreen from './screens/ChatScreen';
import ContactModal from './components/ContactModal';
import CancelJobModal from './components/CancelJobModal';
import { MOCK_JOBS } from './data/mockJobs';
import LocationPermissionModal from './components/LocationPermissionModal';
import ActionSuccessPopup from './components/ActionSuccessPopup';
import CameraView from './components/CameraView';
import { PARTNER_NOTIFICATIONS, MANAGER_NOTIFICATIONS } from './data/mockNotifications';
import NotificationDetailModal from './components/NotificationDetailModal';
import { MOCK_USER, MOCK_MANAGER } from './data/mockUser';
import HomeScreen from './screens/HomeScreen';
import InboxScreen from './screens/InboxScreen';
import HistoryScreen from './screens/HistoryScreen';
import AccountScreen from './screens/AccountScreen';
import BottomNav from './components/BottomNav';
import InformationScreen from './screens/InformationScreen';
import SupportScreen from './screens/SupportScreen';
import FinanceScreen from './screens/FinanceScreen';
import ReviewScreen from './screens/ReviewScreen';
import { MOCK_HISTORY_JOBS } from './data/mockHistory';
import { parseDateString, getWeekRange } from './utils/dateUtils';
import IncomeScreen from './screens/IncomeScreen';
import ToolsScreen from './screens/ToolsScreen';
import { MOCK_COLLABORATORS } from './data/mockCollaborators';
import CollaboratorListScreen from './screens/CollaboratorListScreen';
import EditCollaboratorModal from './components/EditCollaboratorModal';
import CollaboratorJobsScreen from './screens/CollaboratorJobsScreen';
import { PARTNER_MESSAGES, MANAGER_MESSAGES } from './data/mockMessages';
import ApplyPenaltyModal from './components/ApplyPenaltyModal';
import PenaltyNotificationPopup from './components/PenaltyNotificationPopup';
import KeepLoggedInScreen from './components/KeepLoggedInScreen';
import NewJobNotificationPopup from './components/NewJobNotificationPopup';
import { MOCK_TOOLS } from './data/mockTools';
import { MOCK_COMPANY_TOOLS } from './data/mockCompanyTools';
import { MOCK_TRANSACTIONS } from './data/mockTransactions';
import { MOCK_COMPANY_TRANSACTIONS } from './data/mockCompanyTransactions';
import IncomeReportScreen from './screens/IncomeReportScreen';


// Shape of the shared state object
interface SharedState {
  newJobs: Job[];
  acceptedJobs: Job[];
  historyJobs: Job[];
  allMessages: Record<string, Message[]>;
  collaborators: User[];
  usersDB: (User & { password?: string })[];
  tools: Tool[];
  companyTools: CompanyTool[]; // For manager
  withdrawalRequests: WithdrawalRequest[];
  partnerTransactions: Transaction[];
  companyTransactions: CompanyTransaction[];
  toolReports: ToolReport[];
}

// Shape of role-specific state
interface RoleSpecificState {
  notifications: Notification[];
}

// Helper function to send notifications to a specific role by updating localStorage
const sendNotificationToRole = (role: UserRole, notification: Notification) => {
    const roleKey = `novokingRoleState_${role}`;
    try {
        const roleStateJSON = localStorage.getItem(roleKey);
        const roleState: RoleSpecificState = roleStateJSON 
            ? JSON.parse(roleStateJSON) 
            : { notifications: role === UserRole.Manager ? MANAGER_NOTIFICATIONS : PARTNER_NOTIFICATIONS };
        
        // Add the new notification to the top of the list
        roleState.notifications.unshift(notification);
        
        localStorage.setItem(roleKey, JSON.stringify(roleState));
    } catch (error) {
        console.error(`Failed to send notification to role ${role}:`, error);
    }
};

const App: React.FC = () => {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginAttemptPhone, setLoginAttemptPhone] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // App Navigation State
  const [activePage, setActivePage] = useState<Page>(Page.Home);
  const [activeSubPage, setActiveSubPage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.New);
  
  // Shared State (synced across all roles)
  const [newJobs, setNewJobs] = useState<Job[]>([]);
  const [acceptedJobs, setAcceptedJobs] = useState<Job[]>([]);
  const [historyJobs, setHistoryJobs] = useState<Job[]>([]);
  const [allMessages, setAllMessages] = useState<Record<string, Message[]>>({});
  const [collaborators, setCollaborators] = useState<User[]>([]);
  const [usersDB, setUsersDB] = useState<(User & { password?: string })[]>([]);
  const [tools, setTools] = useState<Tool[]>([]);
  const [companyTools, setCompanyTools] = useState<CompanyTool[]>([]);
  const [withdrawalRequests, setWithdrawalRequests] = useState<WithdrawalRequest[]>([]);
  const [partnerTransactions, setPartnerTransactions] = useState<Transaction[]>([]);
  const [companyTransactions, setCompanyTransactions] = useState<CompanyTransaction[]>([]);
  const [toolReports, setToolReports] = useState<ToolReport[]>([]);
  
  // Role-Specific State
  const [notifications, setNotifications] = useState<Notification[]>([]);

  // UI State
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState<boolean>(false);
  const [lastAcceptedJob, setLastAcceptedJob] = useState<Job | null>(null);
  const [chattingWithJob, setChattingWithJob] = useState<Job | null>(null);
  const [showContactModalForJob, setShowContactModalForJob] = useState<Job | null>(null);
  const [cancellingJob, setCancellingJob] = useState<Job | null>(null);
  const [chatOrigin, setChatOrigin] = useState<'inbox' | 'details' | 'notification' | null>(null);
  const [showLocationPermission, setShowLocationPermission] = useState<Job | null>(null);
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);
  const [applyingPenaltyToJob, setApplyingPenaltyToJob] = useState<Job | null>(null);
  const [proofFiles, setProofFiles] = useState<File[]>([]);
  const [proofPreviewUrls, setProofPreviewUrls] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [complaintDetails, setComplaintDetails] = useState<{ job: Job, collaborator: User, notification: Notification } | null>(null);
  const [editingCollaborator, setEditingCollaborator] = useState<User | null>(null);
  const [viewingJobsForCollaborator, setViewingJobsForCollaborator] = useState<User | null>(null);
  const [popupNotificationQueue, setPopupNotificationQueue] = useState<Notification[]>([]);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [showKeepLoggedInPrompt, setShowKeepLoggedInPrompt] = useState<boolean>(false);
  const [notificationJob, setNotificationJob] = useState<Job | null>(null);
  const [isViewingFromNotification, setIsViewingFromNotification] = useState<boolean>(false);


  // Storage Keys
  const SHARED_STATE_KEY = 'novokingSharedState';
  const getRoleSpecificKey = (role: UserRole) => `novokingRoleState_${role}`;

  // Function to initialize all data from scratch (first time use)
  const initializeFreshState = useCallback(() => {
    // Shared Data
    const preAcceptedIds = ['job-1', 'job-2', 'job-4'];
    
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of day for comparison

    const initialNew = MOCK_JOBS
      .filter(j => !preAcceptedIds.includes(j.id))
      .filter(job => {
          const jobDate = parseDateString(job.date);
          jobDate.setHours(0, 0, 0, 0);
          return jobDate >= today;
      });

    const initialAccepted = MOCK_JOBS.filter(j => preAcceptedIds.includes(j.id))
      .map(j => ({ ...j, status: 'accepted' as const }));
      
    setNewJobs(initialNew);
    setAcceptedJobs(initialAccepted);
    setHistoryJobs(MOCK_HISTORY_JOBS);
    setCollaborators(MOCK_COLLABORATORS);
    setTools(MOCK_TOOLS);
    setCompanyTools(MOCK_COMPANY_TOOLS);
    setUsersDB([
      ...MOCK_COLLABORATORS.map(c => ({...c, password: '123'})),
      { ...MOCK_MANAGER, password: '1' }
    ]);
    // A mix of messages for demo purposes
    setAllMessages({ ...PARTNER_MESSAGES, ...MANAGER_MESSAGES });
    setWithdrawalRequests([]);
    setPartnerTransactions(MOCK_TRANSACTIONS);
    setCompanyTransactions(MOCK_COMPANY_TRANSACTIONS);
    setToolReports([]);

    // Role-specific Data
    localStorage.setItem(getRoleSpecificKey(UserRole.Partner), JSON.stringify({ notifications: PARTNER_NOTIFICATIONS }));
    localStorage.setItem(getRoleSpecificKey(UserRole.Manager), JSON.stringify({ notifications: MANAGER_NOTIFICATIONS }));

  }, []);

  const triggerNewJobNotification = useCallback((currentState: Pick<SharedState, 'newJobs' | 'acceptedJobs' | 'historyJobs'>) => {
    setTimeout(() => {
      // --- Start of new time calculation logic ---
      const now = new Date();
      let startTime: Date;
      const duration = 2; // Job duration in hours

      const isAfterCutoff = now.getHours() > 20 || (now.getHours() === 20 && now.getMinutes() > 30);

      if (isAfterCutoff) {
          // Schedule for tomorrow morning
          let tomorrow = new Date(now);
          tomorrow.setDate(now.getDate() + 1);
          tomorrow.setHours(8, 0, 0, 0);
          startTime = tomorrow;
      } else {
          // Schedule for today
          // Propose a start time ~1 hour from now
          const proposedStartTime = new Date(now.getTime() + 60 * 60 * 1000);

          // Round up to the next 30-minute interval
          const ms = 1000 * 60 * 30; // 30 minutes
          const roundedMs = Math.ceil(proposedStartTime.getTime() / ms) * ms;
          let roundedStartTime = new Date(roundedMs);

          // Check if the rounded start time is 21:00 or later
          if (roundedStartTime.getHours() >= 21) {
              // If it is, schedule for tomorrow morning instead
              let tomorrow = new Date(now);
              tomorrow.setDate(now.getDate() + 1);
              tomorrow.setHours(8, 0, 0, 0);
              startTime = tomorrow;
          } else {
              // It's for today
              startTime = roundedStartTime;
          }
      }

      const endTime = new Date(startTime.getTime() + duration * 60 * 60 * 1000);
      
      const formatTime = (date: Date) => date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
      const formatDate = (date: Date) => date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });

      const dateString = formatDate(startTime); // Date is derived from the final startTime
      const timeString = `${formatTime(startTime)} - ${formatTime(endTime)}`;
      // --- End of new time calculation logic ---

      const newJobForNotification: Job = {
          id: 'new-job-notification-1',
          customerName: 'Trần Thu Trang',
          address: '100 Võ Nguyên Giáp, Phường Phước Mỹ, Sơn Trà',
          date: dateString,
          time: timeString,
          duration: duration,
          payment: 200000,
          paymentMethod: 'Chuyển khoản',
          customerPhone: '0905113114',
          serviceType: 'Dọn dẹp nhà',
          notes: 'Cơ hội việc làm mới! Khách hàng yêu cầu gấp, ưu tiên cộng tác viên nhận việc sớm.',
      };
      
      const isJobPresent = currentState.newJobs.some(j => j.id === newJobForNotification.id) ||
                           currentState.acceptedJobs.some(j => j.id === newJobForNotification.id) ||
                           currentState.historyJobs.some(j => j.id === newJobForNotification.id);
                           
      if (!isJobPresent) {
          setNotificationJob(newJobForNotification);
      }
  }, 1000);
}, []);


  // Effect to load state from localStorage ONCE on initial app load
  useEffect(() => {
    const savedAuth = localStorage.getItem('isAuthenticated');
    const savedUser = localStorage.getItem('currentUser');
    const savedSharedStateJSON = localStorage.getItem(SHARED_STATE_KEY);
    let savedSharedState: SharedState | null = null;
    
    if (savedSharedStateJSON) {
        savedSharedState = JSON.parse(savedSharedStateJSON);
        setNewJobs(savedSharedState.newJobs);
        setAcceptedJobs(savedSharedState.acceptedJobs);
        setHistoryJobs(savedSharedState.historyJobs);
        setAllMessages(savedSharedState.allMessages);
        setCollaborators(savedSharedState.collaborators);
        setUsersDB(savedSharedState.usersDB);
        setTools(savedSharedState.tools || []);
        setCompanyTools(savedSharedState.companyTools || []);
        setWithdrawalRequests(savedSharedState.withdrawalRequests || []);
        setPartnerTransactions(savedSharedState.partnerTransactions || []);
        setCompanyTransactions(savedSharedState.companyTransactions || []);
        setToolReports(savedSharedState.toolReports || []);
    } else {
        // First time ever running the app
        initializeFreshState();
    }

    if (savedAuth === 'true' && savedUser) {
        const user: User = JSON.parse(savedUser);
        const role = user.role;
        const roleSpecificKey = getRoleSpecificKey(role);
        const savedRoleStateJSON = localStorage.getItem(roleSpecificKey);
        
        if (savedRoleStateJSON) {
            const savedRoleState: RoleSpecificState = JSON.parse(savedRoleStateJSON);
            setNotifications(savedRoleState.notifications);
        } else {
            // This case might happen if new roles are added, initialize their specific data
            setNotifications(role === UserRole.Manager ? MANAGER_NOTIFICATIONS : PARTNER_NOTIFICATIONS);
        }
        
        setIsAuthenticated(true);
        setCurrentUser(user);
        setUserRole(role);
        setActivePage(role === UserRole.Manager ? Page.Tools : Page.Home);

        if (user.role === UserRole.Partner && savedSharedState) {
            triggerNewJobNotification(savedSharedState);
        }
    }
  }, [initializeFreshState, triggerNewJobNotification]);

  // Effect to SAVE SHARED state to localStorage
  useEffect(() => {
      const stateToSave: SharedState = {
          newJobs,
          acceptedJobs,
          historyJobs,
          allMessages,
          collaborators,
          usersDB,
          tools,
          companyTools,
          withdrawalRequests,
          partnerTransactions,
          companyTransactions,
          toolReports,
      };
      localStorage.setItem(SHARED_STATE_KEY, JSON.stringify(stateToSave));
  }, [newJobs, acceptedJobs, historyJobs, allMessages, collaborators, usersDB, tools, companyTools, withdrawalRequests, partnerTransactions, companyTransactions, toolReports]);

  // Effect to SAVE ROLE-SPECIFIC state to localStorage
  useEffect(() => {
    if (isAuthenticated && userRole) {
        const stateToSave: RoleSpecificState = { notifications };
        localStorage.setItem(getRoleSpecificKey(userRole), JSON.stringify(stateToSave));
    }
  }, [isAuthenticated, userRole, notifications]);
  
  // Effect to manage notification queue
  useEffect(() => {
    if (userRole === UserRole.Partner) {
        const unshownPopupNotifications = notifications.filter(
            n => !n.isPopupShown && (
                n.title.includes('Áp dụng kỷ luật') || 
                n.title.includes('Công việc bị quản lý hủy')
            )
        );
        if (unshownPopupNotifications.length > 0) {
            setPopupNotificationQueue(prev => {
                const newNotifications = unshownPopupNotifications.filter(
                    n => !prev.some(qn => qn.id === n.id) && !popupNotificationQueue.some(qn => qn.id === n.id)
                );
                return [...prev, ...newNotifications];
            });
        }
    }
  }, [notifications, userRole]);

  // Misc Effects
  useEffect(() => {
    return () => { proofPreviewUrls.forEach(url => URL.revokeObjectURL(url)); };
  }, [proofPreviewUrls]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activePage, activeSubPage, viewingJobsForCollaborator]);

  const handleLoginAttempt = (phone: string, pass: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Normalize phone numbers by removing leading '0' before comparison.
      // This allows users to enter their phone number with or without the leading 0.
      const normalize = (p: string) => p.startsWith('0') ? p.substring(1) : p;
      const normalizedInputPhone = normalize(phone);

      const user = usersDB.find(u => normalize(u.phone) === normalizedInputPhone);

      if (user && user.password === pass) {
        setLoginAttemptPhone(user.phone); // Use the canonical phone number from the DB
        setCurrentUser(user);
        setUserRole(user.role);
        setActivePage(user.role === UserRole.Manager ? Page.Tools : Page.Home);
        resolve();
      } else {
        reject(new Error('Số điện thoại hoặc mật khẩu không chính xác.'));
      }
    });
  };

  const handleOtpVerification = (otp: string) => {
    if (loginAttemptPhone && currentUser) {
        // Load role-specific data for the user logging in
        const role = currentUser.role;
        const roleSpecificKey = getRoleSpecificKey(role);
        const savedRoleStateJSON = localStorage.getItem(roleSpecificKey);
        
        if (savedRoleStateJSON) {
            const savedRoleState: RoleSpecificState = JSON.parse(savedRoleStateJSON);
            setNotifications(savedRoleState.notifications);
        } else {
            // Fallback if role-specific data is missing
            setNotifications(role === UserRole.Manager ? MANAGER_NOTIFICATIONS : PARTNER_NOTIFICATIONS);
        }
        
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        setLoginAttemptPhone(null);
        setShowKeepLoggedInPrompt(true);
    }
  };

  const handleKeepLoggedInDecision = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    setShowKeepLoggedInPrompt(false);

    if (currentUser?.role === UserRole.Partner) {
      triggerNewJobNotification({ newJobs, acceptedJobs, historyJobs });
    }
  };

  const handlePasswordReset = (newPassword: string) => {
    if (!currentUser) return;
    setUsersDB(prev => prev.map(u => 
        u.phone === currentUser.phone ? { ...u, password: newPassword } : u
    ));
    console.log(`Password for user ${currentUser.phone} has been updated to: ${newPassword}`);
  };
  
  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    
    setCurrentUser(null);
    setUserRole(null);
    setActivePage(Page.Home);
    setActiveSubPage(null);
    setNotifications([]); // Clear role-specific data
  };

  const handleSelectJob = (job: Job) => {
    setSelectedJob(job);
  };

  const handleClearProofs = useCallback(() => {
    proofPreviewUrls.forEach(url => URL.revokeObjectURL(url));
    setProofFiles([]);
    setProofPreviewUrls([]);
  }, [proofPreviewUrls]);

  const handleRemoveProofPreview = useCallback((indexToRemove: number) => {
    URL.revokeObjectURL(proofPreviewUrls[indexToRemove]);
    setProofFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setProofPreviewUrls(prev => prev.filter((_, index) => index !== indexToRemove));
  }, [proofPreviewUrls]);

  const handleCloseDetailModal = () => {
    if (isViewingFromNotification && selectedJob) {
      const alreadyAccepted = acceptedJobs.some(j => j.id === selectedJob.id);
      if (!alreadyAccepted) {
          setNewJobs(prev => [selectedJob, ...prev]);
      }
    }
    setIsViewingFromNotification(false);
    setSelectedJob(null);
    handleClearProofs();
  };

  const handleAcceptJob = useCallback((jobId: string) => {
    const jobToAccept = newJobs.find(job => job.id === jobId) || (isViewingFromNotification && selectedJob?.id === jobId ? selectedJob : null);
    if (jobToAccept) {
      const newAcceptedJob = { ...jobToAccept, status: 'accepted' as const };
      setNewJobs(prev => prev.filter(job => job.id !== jobId));
      setAcceptedJobs(prev => [newAcceptedJob, ...prev]);
      setLastAcceptedJob(newAcceptedJob);
      setShowSuccessPopup(true);
      if (isViewingFromNotification) {
          setIsViewingFromNotification(false);
      }
    }
    setSelectedJob(null);
  }, [newJobs, selectedJob, isViewingFromNotification]);

  const handleOpenCancelModal = (job: Job) => {
    setSelectedJob(null);
    setCancellingJob(job);
  };

  const handleCloseCancelModal = () => {
    setCancellingJob(null);
  };

  const handleConfirmCancelJob = useCallback((jobId: string, reason: string) => {
    const jobToCancel = acceptedJobs.find(job => job.id === jobId);
    if (jobToCancel) {
        const canceledJob = { ...jobToCancel, status: 'canceled' as const, notes: `Lý do hủy: ${reason}` };
        setAcceptedJobs(prev => prev.filter(job => job.id !== jobId));
        setHistoryJobs(prev => [canceledJob, ...prev]);

        if (userRole === UserRole.Manager) {
            setActionSuccessMessage('Hủy công việc thành công!');
            const newNotification: Notification = {
                id: `cancel-mgr-${jobId}-${Date.now()}`,
                type: 'job',
                jobId: jobId,
                title: 'Công việc bị quản lý hủy',
                message: `Công việc ngày ${jobToCancel.date} của khách hàng ${jobToCancel.customerName} đã bị quản lý hủy.`,
                timestamp: 'Vừa xong',
                isRead: false,
                icon: 'cancel',
                isPopupShown: false,
            };
            sendNotificationToRole(UserRole.Partner, newNotification);
        } else if (userRole === UserRole.Partner) {
             setActionSuccessMessage('Hủy công việc thành công!');
        }
    }
    setCancellingJob(null);
  }, [acceptedJobs, userRole]);
  
  const handleStartChat = (job: Job, origin: 'inbox' | 'details' | 'notification' = 'details') => {
    if(complaintDetails) { // If coming from complaint, close other modals first
      setComplaintDetails(null);
      setSelectedJob(null);
      handleCloseNotificationModal();
    } else {
       setSelectedJob(null);
    }
    setChatOrigin(origin);
    setChattingWithJob(job);
  };

  const handleCloseChat = () => {
    const jobToReturnTo = chattingWithJob;
    setChattingWithJob(null);

    if (chatOrigin === 'details' && jobToReturnTo) {
      setSelectedJob(jobToReturnTo);
    } else if (chatOrigin === 'notification' && jobToReturnTo && userRole === UserRole.Manager) {
        const notification = notifications.find(n => n.jobId === jobToReturnTo.id);
        if (notification) {
            handleSelectNotification(notification);
        }
    } else if (chatOrigin !== 'inbox') {
        setActivePage(Page.Inbox);
    }
    setChatOrigin(null);
  };
  
  const handleSendMessage = useCallback((jobId: string, text: string, imageUrl?: string) => {
    if (!text.trim() && !imageUrl) return;

    const newMessage: Message = {
        id: `msg-${jobId}-${Date.now()}`,
        text,
        sender: userRole === UserRole.Manager ? 'user' : 'user', // Simplified sender logic
        timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        imageUrl,
    };

    setAllMessages(prev => ({
        ...prev,
        [jobId]: [...(prev[jobId] || []), newMessage]
    }));
  }, [userRole]);

  const handleOpenContactModal = (job: Job) => {
    setShowContactModalForJob(job);
  };

  const handleCloseContactModal = () => {
    setShowContactModalForJob(null);
  };
  
  const handlePhoneCall = (phone: string) => {
    alert(`Đang gọi tới số: ${phone}`);
    handleCloseContactModal();
  };

  const handleAppCall = () => {
    alert('Bắt đầu cuộc gọi trên ứng dụng...');
    handleCloseContactModal();
  };

  const handleClosePopup = () => {
    setShowSuccessPopup(false);
    setLastAcceptedJob(null);
  };

  const handleStartCheckin = (job: Job) => {
    setSelectedJob(null);
    setShowLocationPermission(job);
  };

  const handleConfirmLocationPermission = (jobId: string) => {
    const now = new Date();
    const checkinTime = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString('vi-VN');

    setAcceptedJobs(jobs => jobs.map(j => j.id === jobId ? { ...j, status: 'in_progress' as const, checkinTime } : j));
    // FIX: Corrected typo in status from 'in__progress' to 'in_progress'
    if(selectedJob?.id === jobId) setSelectedJob(prev => prev ? ({...prev, status: 'in_progress' as const, checkinTime}) : null);

    setShowLocationPermission(null);
    setActionSuccessMessage('Chấm công bắt đầu thành công!');
  };

  const handleCheckout = (jobId: string) => {
    const now = new Date();
    const checkoutTime = now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) + ', ' + now.toLocaleDateString('vi-VN');

    const jobToComplete = acceptedJobs.find(j => j.id === jobId);
    if (jobToComplete) {
        const completedJob = { ...jobToComplete, status: 'completed' as const, checkoutTime };
        setAcceptedJobs(prev => prev.map(job => (job.id === jobId ? completedJob : job)));
        if (selectedJob?.id === jobId) {
            setSelectedJob(completedJob);
        }
    }
    setActionSuccessMessage('Chấm công kết thúc thành công!');
  };
  
  const handleUploadProof = async (jobId: string) => {
    if (proofFiles.length === 0) {
        alert('Vui lòng chọn hoặc chụp ảnh minh chứng trước khi gửi.');
        return;
    }
    
    const fileToBase64 = (file: File): Promise<string> => 
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });

    const proofImageUrls = await Promise.all(proofFiles.map(fileToBase64));
    const jobToFinalize = acceptedJobs.find(j => j.id === jobId);

    if (jobToFinalize) {
      const finalizedJob = { ...jobToFinalize, proofImageUrls };
      setHistoryJobs(prev => [finalizedJob, ...prev.filter(j => j.id !== jobId)]);
      setAcceptedJobs(prev => prev.filter(j => j.id !== jobId));
      handleCloseDetailModal();
      setActionSuccessMessage('Đăng tải minh chứng thành công!');
    }
  };
  
  const handleTakePhoto = async () => {
    if (proofFiles.length >= 10) {
        alert('Bạn chỉ có thể đăng tải tối đa 10 ảnh.');
        return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop());
      setIsCameraOpen(true);
    } catch (error) {
      console.error('Lỗi truy cập camera:', error);
      alert('Không thể truy cập camera. Vui lòng kiểm tra quyền truy cập trong cài đặt trình duyệt.');
    }
  };

  const handleChoosePhoto = () => {
    fileInputRef.current?.click();
  };

  // FIX: Parameter 'blob' implicitly has an 'any' type, but a better type may be inferred from usage.
  const handleCapturePhoto = useCallback((blob: any) => {
    if (proofFiles.length >= 10) {
        alert('Bạn chỉ có thể đăng tải tối đa 10 ảnh.');
        setIsCameraOpen(false);
        return;
    }
    const capturedFile = new File([blob], `proof-${Date.now()}.jpg`, { type: 'image/jpeg' });
    const newPreviewUrl = URL.createObjectURL(capturedFile);
    setProofFiles(prev => [...prev, capturedFile]);
    setProofPreviewUrls(prev => [...prev, newPreviewUrl]);
    setIsCameraOpen(false);
  }, [proofFiles.length]);

  const handleCloseCamera = () => {
    setIsCameraOpen(false);
  };
  
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
        const currentTotal = proofFiles.length;
        const availableSlots = 10 - currentTotal;
        
        if (availableSlots <= 0) {
            alert('Bạn đã đạt đến giới hạn 10 ảnh.');
            return;
        }

        const newFiles = Array.from(files).slice(0, availableSlots);
        if (files.length > availableSlots) {
            alert(`Bạn chỉ có thể thêm ${availableSlots} ảnh nữa. Đã thêm ${availableSlots} ảnh đầu tiên.`);
        }

        const newFileObjects = newFiles.map(file => file);
        const newPreviewUrls = newFiles.map(file => URL.createObjectURL(file));
        setProofFiles(prev => [...prev, ...newFileObjects]);
        setProofPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    }
    if (event.target) {
        event.target.value = '';
    }
  };
  
  const handleCloseNotificationModal = useCallback(() => {
    setSelectedNotification(null);
    if(complaintDetails) {
        setComplaintDetails(null);
    }
  }, [complaintDetails]);

  const handleSelectNotification = useCallback((notification: Notification) => {
    setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n));
    
    if (userRole === UserRole.Manager && notification.jobId && notification.title.includes('Khiếu nại')) {
        const job = historyJobs.find(j => j.id === notification.jobId);
        const collaborator = collaborators.find(c => c.role === UserRole.Partner); // Simplified assumption

        if (job && job.complaint && collaborator) {
            setComplaintDetails({ job, collaborator, notification });
        } else {
            setSelectedNotification(notification);
        }
    } else {
        setSelectedNotification(notification);
    }
  }, [userRole, historyJobs, collaborators]);

  const handleViewJobFromComplaint = (job: Job) => {
      handleSelectJob(job);
  };
  
  const handleViewJobFromNotification = useCallback((jobId: string) => {
    const job = historyJobs.find(j => j.id === jobId);
    if (job) {
      handleCloseNotificationModal();
      handleSelectJob(job);
    }
  }, [historyJobs, handleCloseNotificationModal]);
  
  const handleChatFromComplaint = (job: Job) => {
    if (job.complaint) {
        const automatedMessage = `Chào bạn, Novoking đã nhận được phản hồi của bạn về công việc ngày ${job.date}.\n\nNỘI DUNG KHIẾU NẠI:\n- Lý do: ${job.complaint.reason}\n- Chi tiết: ${job.complaint.message}\n\nChúng tôi đang xem xét vấn đề và sẽ phản hồi lại bạn trong thời gian sớm nhất. Xin cảm ơn.`;
        handleSendMessage(job.id, automatedMessage);
    }
    handleStartChat(job, 'notification');
  };

  const currentWeekReviewCount = useMemo(() => {
      const today = new Date('2025-10-27T10:00:00Z'); 
      const [start, end] = getWeekRange(today);
      return historyJobs.filter(job => {
          const jobDate = parseDateString(job.date);
          return job.status === 'completed' && jobDate >= start && jobDate <= end;
      }).length;
  }, [historyJobs]);

  const handleSaveCollaborator = useCallback((updatedCollaborator: User) => {
      setCollaborators(prev => 
          prev.map(c => c.idNumber === updatedCollaborator.idNumber ? updatedCollaborator : c)
      );
      setUsersDB(prev => 
          prev.map(u => u.idNumber === updatedCollaborator.idNumber ? { ...u, ...updatedCollaborator } : u)
      );
      setEditingCollaborator(null);
      setActionSuccessMessage('Cập nhật thông tin thành công!');

       const newNotification: Notification = {
            id: `info-update-${updatedCollaborator.idNumber}-${Date.now()}`,
            type: 'system',
            title: 'Thông tin tài khoản được cập nhật',
            message: `Quản lý đã cập nhật thông tin tài khoản của bạn. Vui lòng kiểm tra lại trong mục Tài khoản.`,
            timestamp: 'Vừa xong',
            isRead: false,
            icon: 'alert',
        };
        sendNotificationToRole(UserRole.Partner, newNotification);
  }, []);
  
  const handleOpenPenaltyModal = (job: Job) => {
    setSelectedJob(null);
    setApplyingPenaltyToJob(job);
  };

  const handleClosePenaltyModal = () => {
    setApplyingPenaltyToJob(null);
  };
  
  const handleConfirmPenalty = useCallback((jobId: string, percentage: 20 | 50 | 100, linkedComplaintId: string) => {
    const jobToUpdate = historyJobs.find(j => j.id === jobId);
    const complaintJob = historyJobs.find(j => j.id === linkedComplaintId);

    if (jobToUpdate && complaintJob && complaintJob.complaint) {
        const fullReason = `${complaintJob.complaint.reason}: "${complaintJob.complaint.message}"`;
        const updatedJob = {
            ...jobToUpdate,
            penalty: {
                percentage,
                linkedComplaintId,
                reason: fullReason,
            }
        };
        setHistoryJobs(prev => prev.map(j => j.id === jobId ? updatedJob : j));
        
        if (userRole === UserRole.Manager) {
            setActionSuccessMessage('Áp dụng phạt tiền thành công!');
        }
        
        const newNotification: Notification = {
            id: `penalty-${jobId}-${Date.now()}`,
            type: 'job',
            jobId: jobId,
            title: 'Áp dụng kỷ luật phạt tiền',
            message: `Công việc ngày ${jobToUpdate.date} đã bị áp dụng phạt ${percentage}%. Số tiền thực nhận đã được cập nhật.`,
            timestamp: 'Vừa xong',
            isRead: false,
            icon: 'alert',
            isPopupShown: false,
        };
        sendNotificationToRole(UserRole.Partner, newNotification);
        handleClosePenaltyModal();
    }
  }, [historyJobs, userRole]);

  const jobsWithComplaints = useMemo(() => historyJobs.filter(j => j.complaint), [historyJobs]);

  const handlePageChange = useCallback((page: Page) => {
    setActivePage(page);
    setActiveSubPage(null);
    setViewingJobsForCollaborator(null);
  }, []);

  const hasUnreadNotifications = useMemo(() => notifications.some(n => !n.isRead), [notifications]);

  const handleClosePopupNotification = useCallback(() => {
    if (popupNotificationQueue.length > 0) {
        const currentNotification = popupNotificationQueue[0];
        // Mark as shown in the main notifications list
        setNotifications(prev =>
            prev.map(n =>
                n.id === currentNotification.id ? { ...n, isPopupShown: true } : n
            )
        );
        // Remove from the queue
        setPopupNotificationQueue(prev => prev.slice(1));
    }
    setIsPopupVisible(false);
  }, [popupNotificationQueue]);
  
  // Effect to show next popup from queue
  useEffect(() => {
      if (popupNotificationQueue.length > 0 && !isPopupVisible && !selectedJob && !complaintDetails && !chattingWithJob && !cancellingJob && !applyingPenaltyToJob) {
          setIsPopupVisible(true);
      }
  }, [popupNotificationQueue, isPopupVisible, selectedJob, complaintDetails, chattingWithJob, cancellingJob, applyingPenaltyToJob]);

  const handleViewJobFromPopupNotification = useCallback((jobId: string) => {
    const job = [...acceptedJobs, ...historyJobs].find(j => j.id === jobId);
    if (job) {
      handleSelectJob(job);
    }
    handleClosePopupNotification();
  }, [acceptedJobs, historyJobs, handleClosePopupNotification]);

  const jobsForAcceptedTab = useMemo(() => {
    // Lọc lịch sử để chỉ lấy các công việc đã hoàn thành, vì các công việc đã hủy không nên xuất hiện lại trong tab "Đã Nhận".
    const completedHistoryJobs = historyJobs.filter(job => job.status === 'completed');
    // Kết hợp các công việc từ danh sách "accepted" đang hoạt động (bao gồm các trạng thái 'accepted', 'in_progress', 'completed' trước khi có minh chứng)
    // với các công việc 'completed' đã hoàn tất từ lịch sử.
    return [...acceptedJobs, ...completedHistoryJobs];
  }, [acceptedJobs, historyJobs]);

  const handleViewDetailsFromNotification = (job: Job) => {
      setNotificationJob(null);
      setSelectedJob(job);
      setIsViewingFromNotification(true);
  };

  const handleSkipFromNotification = (job: Job) => {
      setNotificationJob(null);
      setNewJobs(prev => [job, ...prev]);
  };

  const handleUpdatePartnerTool = (toolId: string, status: ToolStatus, note: string) => {
    setTools(prev => prev.map(t => t.id === toolId ? { ...t, status, lastUpdated: 'Vừa xong' } : t));
    setActionSuccessMessage('Báo cáo tình trạng dụng cụ thành công!');
    // In a real app, you might also send this report to a server or create a notification for the manager.
  };

  const handleAddCompanyTool = (newToolData: Omit<CompanyTool, 'id' | 'status' | 'assignedToId'>) => {
    const newTool: CompanyTool = {
      ...newToolData,
      id: `ctool-${Date.now()}`,
      status: 'Khả dụng', // New tools are always available by default
      assignedToId: undefined,
    };
    setCompanyTools(prev => [newTool, ...prev]);
    setActionSuccessMessage('Thêm dụng cụ mới thành công!');
  };

  const handleUpdateCompanyTool = (updatedTool: CompanyTool) => {
    setCompanyTools(prev => prev.map(t => t.id === updatedTool.id ? updatedTool : t));
    setActionSuccessMessage('Cập nhật thông tin dụng cụ thành công!');
  };

  const handleDeleteCompanyTools = (toolIds: string[]) => {
    setCompanyTools(prev => prev.filter(t => !toolIds.includes(t.id)));
    setActionSuccessMessage(`Đã xóa ${toolIds.length} dụng cụ thành công!`);
  };

  const handleBulkAssignCompanyTools = (toolIds: string[], assignedToId: string) => {
    setCompanyTools(prev => prev.map(t => {
      if (toolIds.includes(t.id)) {
        return {
          ...t,
          assignedToId: assignedToId,
          status: 'Đang sử dụng' as CompanyToolStatus,
        };
      }
      return t;
    }));
    setActionSuccessMessage(`Đã phân công ${toolIds.length} dụng cụ thành công!`);
  };

  const handleCreateWithdrawalRequest = useCallback((
    data: { amount: number; bankName: string; accountNumber: string; notes?: string },
    partner: User
  ) => {
    const newRequest: WithdrawalRequest = {
        id: `WR-${Date.now()}`,
        partnerId: partner.idNumber,
        partnerName: partner.name,
        amount: data.amount,
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        notes: data.notes,
        timestamp: new Date().toISOString(),
        status: 'pending' as const,
    };

    setWithdrawalRequests(prev => [newRequest, ...prev]);
    setActionSuccessMessage('Gửi yêu cầu rút tiền thành công!');

    // NOTIFICATION TO MANAGER
    const notificationForManager: Notification = {
        id: `notify-wr-${newRequest.id}`,
        type: 'system',
        title: 'Yêu cầu rút tiền mới',
        message: `CTV ${partner.name} vừa gửi yêu cầu rút tiền mới số tiền ${new Intl.NumberFormat('vi-VN').format(data.amount)}đ.`,
        timestamp: 'Vừa xong',
        isRead: false,
        icon: 'money',
    };
    sendNotificationToRole(UserRole.Manager, notificationForManager);
  }, []);

  const handleUpdateWithdrawalRequestStatus = useCallback((requestId: string, status: 'approved' | 'rejected') => {
      const request = withdrawalRequests.find(r => r.id === requestId);
      if (!request) return;

      setWithdrawalRequests(prev => prev.map(r => r.id === requestId ? { ...r, status } : r));
      
      let notificationTitle = '';
      let notificationMessage = '';
      let successMessage = '';
      
      if (status === 'approved') {
          successMessage = 'Đã duyệt yêu cầu rút tiền!';
          notificationTitle = 'Yêu cầu rút tiền đã được duyệt';
          notificationMessage = `Yêu cầu rút tiền ${new Intl.NumberFormat('vi-VN').format(request.amount)}đ của bạn đã được duyệt.`;

          // Create manager's expense transaction
          const newCompanyTransaction: CompanyTransaction = {
              id: `ctx-withdraw-${Date.now()}`,
              type: 'expense',
              category: 'Chi phí Rút tiền',
              title: `${request.partnerName} rút tiền`,
              amount: request.amount,
              date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric'}),
              relatedCollaboratorId: request.partnerId,
          };
          setCompanyTransactions(prev => [newCompanyTransaction, ...prev]);
          
          // Create partner's expense transaction to finalize deduction
          const newPartnerTransaction: Transaction = {
              id: `ptx-withdraw-${Date.now()}`,
              type: 'expense',
              title: 'Rút tiền thành công',
              timestamp: new Date().toLocaleString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric'
              }).replace(',', ''),
              amount: request.amount,
          };
          setPartnerTransactions(prev => [newPartnerTransaction, ...prev]);

      } else { // rejected
            successMessage = 'Đã từ chối yêu cầu rút tiền!';
            notificationTitle = 'Yêu cầu rút tiền bị từ chối';
            notificationMessage = `Yêu cầu rút tiền ${new Intl.NumberFormat('vi-VN').format(request.amount)}đ của bạn đã bị từ chối.`;
      }
      setActionSuccessMessage(successMessage);

      // NOTIFICATION TO PARTNER
      const notificationForPartner: Notification = {
          id: `notify-wr-status-${request.id}`,
          type: 'system',
          title: notificationTitle,
          message: notificationMessage,
          timestamp: 'Vừa xong',
          isRead: false,
          icon: status === 'approved' ? 'complete' : 'cancel',
      };
      sendNotificationToRole(UserRole.Partner, notificationForPartner);
  }, [withdrawalRequests]);
  
  const handleCreateToolReport = useCallback(async (
      data: Omit<ToolReport, 'id' | 'timestamp' | 'partnerId' | 'partnerName' | 'imageUrls'>
  ) => {
      if (!currentUser) return;
      
      const fileToBase64 = (file: File): Promise<string> =>
          new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = error => reject(error);
          });
          
      const imageUrls = await Promise.all(proofFiles.map(fileToBase64));

      const newReport: ToolReport = {
          ...data,
          id: `TR-${Date.now()}`,
          partnerId: currentUser.idNumber,
          partnerName: currentUser.name,
          timestamp: new Date().toISOString(),
          status: 'pending',
          imageUrls: imageUrls,
      };
      setToolReports(prev => [newReport, ...prev]);
      setActionSuccessMessage('Gửi báo cáo thành công!');

      // NOTIFICATION TO MANAGER
      const notificationForManager: Notification = {
          id: `notify-tr-${newReport.id}`,
          type: 'system',
          title: 'Báo cáo dụng cụ mới',
          message: `CTV ${currentUser.name} vừa báo cáo về dụng cụ "${newReport.toolName}".`,
          timestamp: 'Vừa xong',
          isRead: false,
          icon: 'alert',
      };
      sendNotificationToRole(UserRole.Manager, notificationForManager);
  }, [currentUser, proofFiles]);
  
  const handleUpdateToolReport = useCallback((reportId: string, updates: Partial<ToolReport>) => {
    let updatedReport: ToolReport | null = null;
    setToolReports(prev =>
        prev.map(r => {
            if (r.id === reportId) {
                updatedReport = { ...r, ...updates };
                return updatedReport;
            }
            return r;
        })
    );

    if (updatedReport) {
        let title = '';
        let message = '';

        if (updates.status === 'confirmed') {
            title = 'Báo cáo dụng cụ đã được xác nhận';
            message = `Báo cáo của bạn cho dụng cụ "${updatedReport.toolName}" đã được quản lý xác nhận.`;
            setActionSuccessMessage('Đã xác nhận báo cáo!');
        } else if (updates.status === 'compensation_required') {
            title = 'Yêu cầu bồi thường dụng cụ';
            message = `Quản lý yêu cầu bạn bồi thường ${new Intl.NumberFormat('vi-VN').format(updates.compensationAmount || 0)}đ cho dụng cụ "${updatedReport.toolName}". Vui lòng xem chi tiết.`;
            setActionSuccessMessage('Đã gửi yêu cầu bồi thường!');
        }

        if (title && message) {
            const newNotification: Notification = {
                id: `report-update-${reportId}-${Date.now()}`,
                type: 'system',
                title: title,
                message: message,
                timestamp: 'Vừa xong',
                isRead: false,
                icon: 'alert',
            };
            sendNotificationToRole(UserRole.Partner, newNotification);
        }
    }
}, []);

  const handleConfirmCompensation = useCallback((report: ToolReport) => {
    if (!report.compensationAmount) return;

    setToolReports(prev => prev.map(r => r.id === report.id ? { ...r, status: 'resolved' } : r));

    const newPartnerTransaction: Transaction = {
        id: `ptx-comp-${Date.now()}`,
        type: 'expense',
        title: `Phí đền bù dụng cụ: ${report.toolName}`,
        timestamp: new Date().toLocaleString('vi-VN', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' }).replace(',', ''),
        amount: report.compensationAmount,
    };
    setPartnerTransactions(prev => [newPartnerTransaction, ...prev]);

    const newCompanyTransaction: CompanyTransaction = {
        id: `ctx-comp-${Date.now()}`,
        type: 'expense',
        category: 'Chi phí Đền bù',
        title: `Đền bù hư hỏng: ${report.toolName} (CTV: ${report.partnerName})`,
        amount: report.compensationAmount,
        date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        relatedCollaboratorId: report.partnerId,
    };
    setCompanyTransactions(prev => [newCompanyTransaction, ...prev]);

    const newNotification: Notification = {
        id: `comp-confirm-${report.id}-${Date.now()}`,
        type: 'system',
        title: 'Xác nhận bồi thường thành công',
        message: `Bạn đã xác nhận bồi thường ${new Intl.NumberFormat('vi-VN').format(report.compensationAmount)}đ cho dụng cụ "${report.toolName}". Khoản phí đã được trừ vào tài khoản.`,
        timestamp: 'Vừa xong',
        isRead: false,
        icon: 'complete',
    };
    setNotifications(prev => [newNotification, ...prev]);
    setActionSuccessMessage('Xác nhận bồi thường thành công!');

}, []);


  const renderContent = () => {
    if (!currentUser || !userRole) return null;

    if (viewingJobsForCollaborator) {
      const jobsForCollaborator = [...acceptedJobs, ...historyJobs]
          .sort((a,b) => parseDateString(b.date).getTime() - parseDateString(a.date).getTime());
      
      return <CollaboratorJobsScreen
          collaborator={viewingJobsForCollaborator}
          jobs={jobsForCollaborator}
          onBack={() => setViewingJobsForCollaborator(null)}
          onSelectJob={handleSelectJob}
      />;
    }

    if (activeSubPage === 'information') {
      return <InformationScreen 
        user={currentUser} 
        onBack={() => setActiveSubPage(null)} 
        onPasswordChange={handlePasswordReset}
      />;
    }
    if (activeSubPage === 'support') {
      return <SupportScreen onBack={() => setActiveSubPage(null)} />;
    }
    if (activeSubPage === 'finance') {
      return <FinanceScreen 
                onBack={() => setActiveSubPage(null)} 
                currentUser={currentUser}
                withdrawalRequests={withdrawalRequests}
                onCreateWithdrawalRequest={handleCreateWithdrawalRequest}
                historyJobs={historyJobs}
                partnerTransactions={partnerTransactions}
             />;
    }
    if (activeSubPage === 'review') {
      return <ReviewScreen onBack={() => setActiveSubPage(null)} historyJobs={historyJobs} />;
    }
    if (activeSubPage === 'income_report') {
      return <IncomeReportScreen onBack={() => setActiveSubPage(null)} historyJobs={historyJobs} />;
    }
    if (activeSubPage === 'collaborators') {
      return <CollaboratorListScreen 
        collaborators={collaborators}
        onBack={() => setActiveSubPage(null)}
        onEdit={(collaborator) => setEditingCollaborator(collaborator)}
        onViewJobs={(collaborator) => setViewingJobsForCollaborator(collaborator)}
      />;
    }
     if (activeSubPage === 'tools') {
      return <ToolsScreen 
                userRole={userRole}
                currentUser={currentUser}
                companyTools={companyTools}
                collaborators={collaborators}
                toolReports={toolReports}
                onAddCompanyTool={handleAddCompanyTool}
                onUpdateCompanyTool={handleUpdateCompanyTool}
                onDeleteCompanyTools={handleDeleteCompanyTools}
                onBulkAssignCompanyTools={handleBulkAssignCompanyTools}
                onCreateToolReport={handleCreateToolReport}
                onUpdateToolReport={handleUpdateToolReport}
                onConfirmCompensation={handleConfirmCompensation}
                onBack={() => setActiveSubPage(null)}
                // Image handling props
                onTakePhoto={handleTakePhoto}
                onChoosePhoto={handleChoosePhoto}
                previewImageUrls={proofPreviewUrls}
                onRemovePreview={handleRemoveProofPreview}
                onClearProofs={handleClearProofs}
                // Obsolete props
                partnerTools={tools}
                onUpdatePartnerTool={handleUpdatePartnerTool}
             />;
    }
    
    switch (activePage) {
      case Page.Home:
        return (
          <HomeScreen 
            newJobs={newJobs}
            acceptedJobs={jobsForAcceptedTab}
            onSelectJob={handleSelectJob}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        );
      case Page.Inbox:
        const conversations = userRole === UserRole.Partner 
            ? acceptedJobs.filter(j => allMessages[j.id]?.length > 0)
            : historyJobs.filter(j => allMessages[j.id]?.length > 0 && j.complaint);
            
        return (
            <InboxScreen 
                conversations={conversations}
                allMessages={allMessages}
                onSelectConversation={(job) => handleStartChat(job, 'inbox')}
                notifications={notifications}
                onSelectNotification={handleSelectNotification}
            />
        );
      case Page.History:
        return <HistoryScreen jobs={historyJobs} onSelectJob={handleSelectJob} />;
      case Page.Account:
        return <AccountScreen 
                  user={currentUser}
                  onLogout={handleLogout} 
                  onShowInformation={() => setActiveSubPage('information')}
                  onShowSupport={() => setActiveSubPage('support')}
                  onShowFinance={() => setActiveSubPage('finance')}
                  onShowReview={() => setActiveSubPage('review')}
                  onShowIncome={() => setActiveSubPage('income_report')}
                  onShowCollaborators={() => setActiveSubPage('collaborators')}
                  onShowTools={() => setActiveSubPage('tools')}
                  currentWeekReviewCount={currentWeekReviewCount}
                  collaboratorCount={collaborators.length}
                  partnerTransactions={partnerTransactions}
                  withdrawalRequests={withdrawalRequests}
               />;
      case Page.Income:
        return <IncomeScreen 
                  jobs={historyJobs} 
                  collaborators={collaborators} 
                  withdrawalRequests={withdrawalRequests} 
                  companyTransactions={companyTransactions}
                  onUpdateWithdrawalRequestStatus={handleUpdateWithdrawalRequestStatus}
               />;
      case Page.Tools:
        return (
            <ToolsScreen 
                userRole={userRole}
                currentUser={currentUser}
                partnerTools={tools}
                companyTools={companyTools}
                collaborators={collaborators}
                toolReports={toolReports}
                onUpdatePartnerTool={handleUpdatePartnerTool}
                onAddCompanyTool={handleAddCompanyTool}
                onUpdateCompanyTool={handleUpdateCompanyTool}
                onDeleteCompanyTools={handleDeleteCompanyTools}
                onBulkAssignCompanyTools={handleBulkAssignCompanyTools}
                onCreateToolReport={handleCreateToolReport}
                onUpdateToolReport={handleUpdateToolReport}
                onConfirmCompensation={handleConfirmCompensation}
                // Image handling props
                onTakePhoto={handleTakePhoto}
                onChoosePhoto={handleChoosePhoto}
                previewImageUrls={proofPreviewUrls}
                onRemovePreview={handleRemoveProofPreview}
                onClearProofs={handleClearProofs}
            />
        );
      default:
        return userRole === UserRole.Manager ? (
            <ToolsScreen 
                userRole={userRole}
                currentUser={currentUser}
                partnerTools={tools}
                companyTools={companyTools}
                collaborators={collaborators}
                toolReports={toolReports}
                onUpdatePartnerTool={handleUpdatePartnerTool}
                onAddCompanyTool={handleAddCompanyTool}
                onUpdateCompanyTool={handleUpdateCompanyTool}
                onDeleteCompanyTools={handleDeleteCompanyTools}
                onBulkAssignCompanyTools={handleBulkAssignCompanyTools}
                onCreateToolReport={handleCreateToolReport}
                onUpdateToolReport={handleUpdateToolReport}
                onConfirmCompensation={handleConfirmCompensation}
                // Image handling props
                onTakePhoto={handleTakePhoto}
                onChoosePhoto={handleChoosePhoto}
                previewImageUrls={proofPreviewUrls}
                onRemovePreview={handleRemoveProofPreview}
                onClearProofs={handleClearProofs}
            />
        ) : <HomeScreen 
            newJobs={newJobs}
            acceptedJobs={jobsForAcceptedTab}
            onSelectJob={handleSelectJob}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />;
    }
  };

  if (!isAuthenticated || !userRole) {
    if (showKeepLoggedInPrompt && currentUser) {
      return <KeepLoggedInScreen onConfirm={handleKeepLoggedInDecision} onDecline={handleKeepLoggedInDecision} />;
    }
    if (!loginAttemptPhone) {
      return <LoginScreen onLogin={handleLoginAttempt} onPasswordReset={handlePasswordReset} />;
    }
    return <OtpScreen phone={loginAttemptPhone} onVerify={handleOtpVerification} />;
  }
  
  if (chattingWithJob) {
    return <ChatScreen 
      job={chattingWithJob} 
      onBack={handleCloseChat} 
      messages={allMessages[chattingWithJob.id] || []}
      onSendMessage={handleSendMessage}
      userRole={userRole}
    />;
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20">
       <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
        multiple
      />
      <main>
        {renderContent()}
      </main>

      <BottomNav activePage={activePage} onPageChange={handlePageChange} userRole={userRole} hasUnread={hasUnreadNotifications} />

      {isCameraOpen && (
        <CameraView onCapture={handleCapturePhoto} onClose={handleCloseCamera} />
      )}

      {selectedJob && currentUser && (
        <JobDetailModal 
          job={selectedJob} 
          onClose={handleCloseDetailModal}
          onAccept={handleAcceptJob}
          isAccepted={[...acceptedJobs, ...historyJobs].some(j => j.id === selectedJob.id)}
          onStartChat={(job) => handleStartChat(job, 'details')}
          onContact={handleOpenContactModal}
          onCancelJob={handleOpenCancelModal}
          onStartCheckin={handleStartCheckin}
          onCheckout={handleCheckout}
          onUploadProof={handleUploadProof}
          onTakePhoto={handleTakePhoto}
          onChoosePhoto={handleChoosePhoto}
          previewImageUrls={proofPreviewUrls}
          onRemovePreview={handleRemoveProofPreview}
          viewerRole={currentUser.role}
          onApplyPenalty={handleOpenPenaltyModal}
        />
      )}

      {showSuccessPopup && lastAcceptedJob && (
        <SuccessPopup job={lastAcceptedJob} onClose={handleClosePopup} />
      )}
      
      {showContactModalForJob && (
        <ContactModal 
            job={showContactModalForJob}
            onClose={handleCloseContactModal}
            onPhoneCall={handlePhoneCall}
            onAppCall={handleAppCall}
        />
      )}
      {cancellingJob && (
        <CancelJobModal 
          job={cancellingJob}
          onClose={handleCloseCancelModal}
          onConfirm={handleConfirmCancelJob}
        />
      )}
      {showLocationPermission && (
        <LocationPermissionModal
          onClose={() => setShowLocationPermission(null)}
          onConfirm={() => handleConfirmLocationPermission(showLocationPermission.id)}
        />
      )}
      {actionSuccessMessage && (
        <ActionSuccessPopup
          message={actionSuccessMessage}
          onClose={() => setActionSuccessMessage(null)}
        />
      )}
      {(selectedNotification || complaintDetails) && (
        <NotificationDetailModal 
          notification={selectedNotification || complaintDetails!.notification}
          onClose={handleCloseNotificationModal}
          complaintInfo={complaintDetails ? { job: complaintDetails.job, collaborator: complaintDetails.collaborator } : undefined}
          onViewJob={
            complaintDetails 
                ? () => {
                  handleCloseNotificationModal();
                  handleViewJobFromComplaint(complaintDetails.job)
                }
                : (selectedNotification?.jobId && (selectedNotification.title.includes('Áp dụng kỷ luật') || selectedNotification.title.includes('Công việc bị quản lý hủy'))) 
                    ? () => handleViewJobFromNotification(selectedNotification.jobId!) 
                    : undefined
          }
          onStartChat={complaintDetails ? () => handleChatFromComplaint(complaintDetails.job) : undefined}
        />
      )}
      {editingCollaborator && (
        <EditCollaboratorModal 
          collaborator={editingCollaborator}
          onClose={() => setEditingCollaborator(null)}
          onSave={handleSaveCollaborator}
        />
      )}
      {applyingPenaltyToJob && (
        <ApplyPenaltyModal
          job={applyingPenaltyToJob}
          complaintJobs={jobsWithComplaints}
          onClose={handleClosePenaltyModal}
          onConfirm={handleConfirmPenalty}
        />
      )}
      {isPopupVisible && popupNotificationQueue.length > 0 && userRole === UserRole.Partner && (
          <PenaltyNotificationPopup
            notification={popupNotificationQueue[0]}
            onClose={handleClosePopupNotification}
            onViewJob={handleViewJobFromPopupNotification}
          />
        )}
      {notificationJob && userRole === UserRole.Partner && (
          <NewJobNotificationPopup
              job={notificationJob}
              onViewDetails={handleViewDetailsFromNotification}
              onSkip={handleSkipFromNotification}
          />
      )}
    </div>
  );
};

export default App;