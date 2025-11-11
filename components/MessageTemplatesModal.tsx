import React from 'react';
import { UserRole } from '../types';

interface MessageTemplatesModalProps {
  onClose: () => void;
  onSelect: (template: string) => void;
  userRole: UserRole;
}

const PARTNER_TEMPLATES = [
  'Chào bạn, tôi đang trên đường đến.',
  'Tôi sẽ đến muộn khoảng 10-15 phút, mong bạn thông cảm.',
  'Tôi đã đến nơi, bạn ở đâu ạ?',
  'Công việc đã hoàn thành. Cảm ơn bạn đã sử dụng dịch vụ!',
  'Vâng, tôi đã hiểu. Cảm ơn bạn đã thông báo.',
];

const MANAGER_TEMPLATES = [
  'Chào bạn, Novoking đã nhận được phản hồi của bạn và đang xem xét vấn đề.',
  'Chúng tôi thành thật xin lỗi về trải nghiệm chưa tốt của bạn. Chúng tôi sẽ xử lý ngay.',
  'Cảm ơn bạn đã phản hồi. Chúng tôi sẽ cho kiểm tra và liên hệ lại với bạn trong thời gian sớm nhất.',
  'Để giải quyết vấn đề, chúng tôi có thể đề xuất phương án [...] được không ạ?',
  'Cảm ơn bạn đã kiên nhẫn. Vấn đề của bạn đã được giải quyết.',
];


const MessageTemplatesModal: React.FC<MessageTemplatesModalProps> = ({ onClose, onSelect, userRole }) => {
  const templates = userRole === UserRole.Manager ? MANAGER_TEMPLATES : PARTNER_TEMPLATES;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-end z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-xl shadow-xl max-w-md w-full transform transition-all animate-slide-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-gray-200 text-center">
            <h3 className="text-lg font-semibold text-gray-900">Tin nhắn mẫu</h3>
        </div>
        
        <div className="p-2">
            {templates.map(template => (
                 <button 
                    key={template} 
                    onClick={() => onSelect(template)}
                    className="w-full text-left p-3 text-primary font-medium hover:bg-primary-50 rounded-lg transition-colors"
                >
                    {template}
                </button>
            ))}
        </div>

        <div className="p-4 border-t border-gray-200">
            <button
                type="button"
                className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-gray-100 text-sm font-medium text-gray-700 hover:bg-gray-200"
                onClick={onClose}
            >
                Đóng
            </button>
        </div>
      </div>
      <style>{`
        @keyframes slide-in-up {
          0% {
            transform: translateY(100%);
          }
          100% {
            transform: translateY(0);
          }
        }
        .animate-slide-in-up {
          animation: slide-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default MessageTemplatesModal;