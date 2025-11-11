

import React from 'react';
import { Notification } from '../types';

// SVG Icons
const MegaphoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-2.236 9.168-5.584C18.354 1.832 18 3.65 18 4.5v.5A2.5 2.5 0 0115.5 7.5V13c0 .597.237 1.17.658 1.584l.757.757A3.373 3.373 0 0116.5 19.5V21a1 1 0 01-1-1v-1.5a1.5 1.5 0 01-1.5-1.5v-3.428" /></svg>;
const GiftIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" /></svg>;
const MoneyIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01M12 18v-2m0-2v-2m0-2v-2m0-2V8m0 0h.01M12 5V4m0 1h.01M12 3V2m0 1h.01M12 21v-1m0 1v-1m0-1v-1m0-1v-1m0-1v-1m0-1V12m0-2V8m0-2V4m0-2V2" /></svg>;
const CancelIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const CompleteIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
const AlertIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>;

const ICONS: Record<Notification['icon'], { component: React.FC, color: string }> = {
    megaphone: { component: MegaphoneIcon, color: 'bg-blue-100 text-blue-600' },
    gift: { component: GiftIcon, color: 'bg-pink-100 text-pink-600' },
    money: { component: MoneyIcon, color: 'bg-green-100 text-green-600' },
    cancel: { component: CancelIcon, color: 'bg-red-100 text-red-600' },
    complete: { component: CompleteIcon, color: 'bg-teal-100 text-teal-600' },
    alert: { component: AlertIcon, color: 'bg-yellow-100 text-yellow-600' },
};

interface NotificationItemProps {
    notification: Notification;
    onClick: (notification: Notification) => void;
}

const NotificationItem: React.FC<NotificationItemProps> = ({ notification, onClick }) => {
    const Icon = ICONS[notification.icon].component;
    const iconColor = ICONS[notification.icon].color;

    return (
        <div 
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg shadow-sm hover:bg-gray-100 cursor-pointer transition-colors duration-200 border border-gray-200"
            onClick={() => onClick(notification)}
        >
            <div className={`flex-shrink-0 h-12 w-12 rounded-full flex items-center justify-center ${iconColor}`}>
                <Icon />
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                    <p className="text-md font-semibold text-gray-800 truncate">{notification.title}</p>
                    {!notification.isRead && <div className="flex-shrink-0 h-2.5 w-2.5 bg-primary rounded-full ml-2"></div>}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                <p className="text-xs text-gray-400 mt-1">{notification.timestamp}</p>
            </div>
        </div>
    );
}

export default NotificationItem;