

import React, { useState } from 'react';
import { Job, Message, InboxTab, Notification } from '../types';
import NotificationItem from '../components/NotificationItem';
import SystemNotificationCard from '../components/SystemNotificationCard';

interface InboxScreenProps {
  conversations: Job[];
  allMessages: Record<string, Message[]>;
  onSelectConversation: (job: Job) => void;
  notifications: Notification[];
  onSelectNotification: (notification: Notification) => void;
}

const ConversationItem: React.FC<{ job: Job; lastMessage: Message; onClick: (job: Job) => void; }> = ({ job, lastMessage, onClick }) => {
    return (
        <div 
            className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer transition-colors duration-200 border border-gray-200"
            onClick={() => onClick(job)}
        >
            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="text-md font-semibold text-gray-800 truncate">{job.customerName}</p>
                    <p className="text-xs text-gray-400">{lastMessage.timestamp}</p>
                </div>
                <p className="text-sm text-gray-500 truncate">
                    {lastMessage.sender === 'user' && 'Bạn: '}
                    {lastMessage.text}
                </p>
            </div>
        </div>
    );
}

const InboxScreen: React.FC<InboxScreenProps> = ({ conversations, allMessages, onSelectConversation, notifications, onSelectNotification }) => {
  const [activeTab, setActiveTab] = useState<InboxTab>(InboxTab.Messages);

  const getTabClass = (tab: InboxTab) => {
    return activeTab === tab
      ? 'bg-white text-primary'
      : 'text-blue-100 hover:bg-primary-600 hover:text-white';
  };

  const renderMessages = () => {
    const conversationsWithMessages = conversations.filter(job => allMessages[job.id] && allMessages[job.id].length > 0);

    if (conversationsWithMessages.length === 0) {
      return (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0l-8 5-8-5" />
          </svg>
          <p className="mt-4 text-lg text-gray-500">Bạn chưa có cuộc trò chuyện nào.</p>
          <p className="text-sm text-gray-400">Tin nhắn với khách hàng sẽ xuất hiện ở đây.</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {conversationsWithMessages.map(job => {
          const messages = allMessages[job.id] || [];
          const lastMessage = messages[messages.length - 1];
          if (!lastMessage) return null;

          return (
            <ConversationItem 
                key={job.id} 
                job={job} 
                lastMessage={lastMessage} 
                onClick={onSelectConversation}
            />
          );
        })}
      </div>
    );
  };

  const renderNotifications = () => {
    const systemNotifications = notifications.filter(n => n.type === 'system');
    const jobNotifications = notifications.filter(n => n.type === 'job');
    const latestSystemNotifications = systemNotifications.slice(0, 5);

    if (notifications.length === 0) {
      return (
        <div className="text-center py-20">
          <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <p className="mt-4 text-lg text-gray-500">Chưa có thông báo mới.</p>
          <p className="text-sm text-gray-400">Thông báo từ hệ thống sẽ hiển thị ở đây.</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {/* System Notifications Section */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-bold text-primary">Thông báo từ hệ thống</h2>
          <hr className="my-3 border-gray-200" />
          {latestSystemNotifications.length > 0 ? (
             <div className="flex space-x-4 overflow-x-auto pt-1 pb-2 -mx-4 px-4 scrolling-touch">
              {latestSystemNotifications.map(notification => (
                <SystemNotificationCard
                  key={notification.id}
                  notification={notification}
                  onClick={onSelectNotification}
                />
              ))}
            </div>
          ) : (
             <p className="pt-1 text-sm text-gray-400 text-center">Không có thông báo hệ thống nào.</p>
          )}
        </div>

        {/* Job Notifications Section */}
        <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <h2 className="text-lg font-bold text-primary">Thông báo công việc</h2>
          <hr className="my-3 border-gray-200" />
           {jobNotifications.length > 0 ? (
            <div className="space-y-3 pt-1">
              {jobNotifications.map(notification => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                  onClick={onSelectNotification}
                />
              ))}
            </div>
          ) : (
             <p className="pt-1 text-sm text-gray-400 text-center">Không có thông báo công việc nào.</p>
          )}
        </div>
        <style>{`
            .scrolling-touch {
                -webkit-overflow-scrolling: touch;
            }
        `}</style>
      </div>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <header className="bg-primary shadow-md p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4 text-center">Hộp thư</h1>
          <div className="grid grid-cols-2 gap-2 rounded-lg bg-primary-700 p-1">
            <button
              onClick={() => setActiveTab(InboxTab.Messages)}
              className={`flex items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700 ${getTabClass(InboxTab.Messages)}`}
            >
              <span>{InboxTab.Messages}</span>
            </button>
            <button
              onClick={() => setActiveTab(InboxTab.Notifications)}
              className={`flex items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700 ${getTabClass(InboxTab.Notifications)}`}
            >
              <span>{InboxTab.Notifications}</span>
            </button>
          </div>
        </div>
      </header>
      <main className="p-4">
        {activeTab === InboxTab.Messages ? renderMessages() : renderNotifications()}
      </main>
    </div>
  );
};

export default InboxScreen;