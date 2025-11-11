import React from 'react';
import { Page, UserRole } from '../types';

// SVGs for icons
const HomeIcon = ({ active }: { active: boolean }) => (
  <svg className={`h-6 w-6 ${active ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const InboxIcon = ({ active }: { active: boolean }) => (
  <svg className={`h-6 w-6 ${active ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const HistoryIcon = ({ active }: { active: boolean }) => (
  <svg className={`h-6 w-6 ${active ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AccountIcon = ({ active }: { active: boolean }) => (
  <svg className={`h-6 w-6 ${active ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const IncomeIcon = ({ active }: { active: boolean }) => (
  <svg className={`h-6 w-6 ${active ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

const ToolsIcon = ({ active }: { active: boolean }) => (
  <svg className={`h-6 w-6 ${active ? 'text-primary' : 'text-gray-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
  </svg>
);

interface BottomNavProps {
  activePage: Page;
  onPageChange: (page: Page) => void;
  userRole: UserRole;
  hasUnread?: boolean;
}

const NavItem: React.FC<{
  page: Page;
  icon: React.ReactNode;
  active: boolean;
  onClick: (page: Page) => void;
  showDot?: boolean;
}> = ({ page, icon, active, onClick, showDot }) => (
  <button
    onClick={() => onClick(page)}
    className="flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200"
  >
    <div className="relative">
      {icon}
      {showDot && (
        <span className="absolute -top-0.5 -right-0.5 block h-2.5 w-2.5 rounded-full bg-red-600"></span>
      )}
    </div>
    <span className={`text-xs mt-1 ${active ? 'text-primary font-semibold' : 'text-gray-500'}`}>
      {page}
    </span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ activePage, onPageChange, userRole, hasUnread }) => {
  const partnerPages = [
    { page: Page.Home, icon: <HomeIcon active={activePage === Page.Home} /> },
    { page: Page.History, icon: <HistoryIcon active={activePage === Page.History} /> },
    { page: Page.Inbox, icon: <InboxIcon active={activePage === Page.Inbox} />, showDot: hasUnread },
    { page: Page.Account, icon: <AccountIcon active={activePage === Page.Account} /> },
  ];

  // As requested: "Tài khoản, Hộp thư, Thu nhập, Dụng cụ" from right to left
  // This means the array order for rendering left-to-right is the reverse.
  const managerPages = [
    { page: Page.Tools, icon: <ToolsIcon active={activePage === Page.Tools} /> },
    { page: Page.Income, icon: <IncomeIcon active={activePage === Page.Income} /> },
    { page: Page.Inbox, icon: <InboxIcon active={activePage === Page.Inbox} />, showDot: hasUnread },
    { page: Page.Account, icon: <AccountIcon active={activePage === Page.Account} /> },
  ];

  const pages = userRole === UserRole.Manager ? managerPages : partnerPages;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] z-10 flex">
      {pages.map(({ page, icon, showDot }) => (
        <NavItem
          key={page}
          page={page}
          icon={icon}
          active={activePage === page}
          onClick={onPageChange}
          showDot={showDot}
        />
      ))}
    </nav>
  );
};

export default BottomNav;