import React, { useState, useEffect, useRef } from 'react';
import { Job, Message, UserRole } from '../types';
import MessageTemplatesModal from '../components/MessageTemplatesModal';

interface ChatScreenProps {
  job: Job;
  onBack: () => void;
  messages: Message[];
  onSendMessage: (jobId: string, text: string, imageUrl?: string) => void;
  userRole: UserRole;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ job, onBack, messages, onSendMessage, userRole }) => {
  const [newMessage, setNewMessage] = useState('');
  const [showTemplates, setShowTemplates] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(job.id, newMessage);
      setNewMessage('');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSendMessage(job.id, '', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    if (event.target) {
      event.target.value = '';
    }
  };
  
  const handleTemplateSelect = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
  };

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col font-sans">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*"
      />
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white shadow-md z-20 p-4 flex items-center space-x-3">
        <button onClick={onBack} className="text-gray-500 hover:text-primary-600">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-gray-800">{job.customerName}</h1>
          <p className="text-xs text-green-500 font-semibold">Đang hoạt động</p>
        </div>
      </header>
      
      {/* Messages Area */}
      <main className="flex-1 overflow-y-auto p-4 pt-20 pb-24 space-y-4">
        <div className="text-center text-xs text-gray-400">Hôm nay</div>

        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`${msg.sender === 'user' ? 'bg-primary-100 text-primary-900 rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none'} rounded-lg p-3 max-w-xs md:max-w-md shadow-sm`}>
              {msg.text && <p className="text-sm whitespace-pre-wrap">{msg.text}</p>}
              {msg.imageUrl && (
                <img src={msg.imageUrl} alt="Ảnh đính kèm" className="mt-1 rounded-lg max-w-full h-auto" />
              )}
              <p className={`text-right text-xs mt-1 ${msg.sender === 'user' ? 'text-primary-500' : 'text-gray-400'}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}
         <div ref={messagesEndRef} />
      </main>

      {/* Input Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setShowTemplates(true)}
            className="text-primary rounded-full p-2 flex-shrink-0 hover:bg-primary-50 transition-colors"
            aria-label="Tin nhắn mẫu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="text-primary rounded-full p-2 flex-shrink-0 hover:bg-primary-50 transition-colors"
            aria-label="Gửi ảnh"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
          </button>
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            className="flex-1 w-full px-4 py-2 bg-primary-100 border border-primary-200 text-primary-900 placeholder-primary-400 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-300"
          />
          <button 
            onClick={handleSend}
            className="bg-primary text-white rounded-full p-3 flex-shrink-0 hover:bg-primary-600 transition-colors disabled:bg-primary-300"
            disabled={!newMessage.trim()}
            aria-label="Gửi tin nhắn"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </footer>

      {showTemplates && (
        <MessageTemplatesModal 
            onClose={() => setShowTemplates(false)}
            onSelect={handleTemplateSelect}
            userRole={userRole}
        />
      )}
    </div>
  );
};

export default ChatScreen;