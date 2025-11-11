import React from 'react';

interface SupportScreenProps {
  onBack: () => void;
}

const DailySupportIllustration = () => (
    <div className="flex justify-center items-center mb-6">
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="w-48 h-auto">
        {/* Background blob */}
        <path fill="#F0F4FF" d="M165.6,85.2C165.6,104.9,139,118,109,118C79,118,52.4,104.9,52.4,85.2C52.4,65.6,79,52.4,109,52.4C139,52.4,165.6,65.6,165.6,85.2Z" transform="translate(-10, -20) scale(1.1) rotate(15, 100, 75)"></path>
        
        {/* Laptop */}
        <rect x="80" y="80" width="55" height="35" rx="4" fill="#AAB8C2"/>
        <rect x="75" y="115" width="65" height="4" rx="2" fill="#657786"/>
        <rect x="85" y="84" width="45" height="23" fill="#E1E8ED"/>

        {/* Person */}
        <path d="M 80,80 C 80,65 105,65 105,80 Z" fill="#F08080" />
        <circle cx="92.5" cy="55" r="12" fill="#FFD4B8" />
        <path d="M 84,40 C 70,45 70,65 84,70" stroke="#0a5c98" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="81" cy="55" r="4" fill="#0a5c98" />
        
        {/* Speech Bubble */}
        <path d="M 60,30 C 40,30 40,50 60,50 L 70,50 L 70,30 Z" fill="#E1E8ED" />
        <path d="M 65,36 H 50" stroke="#AAB8C2" strokeWidth="2" strokeLinecap="round" />
        <path d="M 62,42 H 50" stroke="#AAB8C2" strokeWidth="2" strokeLinecap="round" />

        {/* Checkmark Circle */}
        <circle cx="130" cy="45" r="14" fill="white" stroke="#E1E8ED" strokeWidth="1"/>
        <path d="M125 45 L 129 49 L 136 42" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
);

const HRSupportIllustration = () => (
    <div className="flex justify-center items-center mb-6">
      <svg viewBox="0 0 200 150" xmlns="http://www.w3.org/2000/svg" className="w-48 h-auto">
        {/* Main Phone Body */}
        <rect x="60" y="20" width="80" height="120" rx="12" fill="#667EEA" />
        <rect x="65" y="25" width="70" height="110" rx="8" fill="#EBF4FF" />
        
        {/* Support Agent */}
        <circle cx="100" cy="80" r="15" fill="#FFD4B8" /> {/* Head */}
        <path d="M90 95 C 95 105, 105 105, 110 95 Z" fill="#4299E1" /> {/* Body */}
        <path d="M85 70 C 75 75, 75 90, 85 95" stroke="#2D3748" strokeWidth="3" fill="none" strokeLinecap="round" /> {/* Headset band */}
        <circle cx="83" cy="83" r="4" fill="#2D3748" /> {/* Earpiece */}
        
        {/* User Avatars on the right */}
        <g transform="translate(145, 45)">
            <circle cx="0" cy="0" r="10" fill="white" stroke="#CBD5E0" strokeWidth="1.5" />
            <path d="M -5 5 C -5 -2, 5 -2, 5 5 Z" fill="#A0AEC0" />
            <circle cx="0" cy="-2" r="3" fill="#A0AEC0" />
        </g>
        <g transform="translate(150, 75)">
            <circle cx="0" cy="0" r="10" fill="white" stroke="#CBD5E0" strokeWidth="1.5" />
            <path d="M -5 5 C -5 -2, 5 -2, 5 5 Z" fill="#A0AEC0" />
            <circle cx="0" cy="-2" r="3" fill="#A0AEC0" />
             <path d="M -3 0 Q 0 3, 3 0" stroke="#718096" strokeWidth="1" fill="none" />
        </g>
        <g transform="translate(145, 105)">
            <circle cx="0" cy="0" r="10" fill="white" stroke="#CBD5E0" strokeWidth="1.5" />
            <path d="M -5 5 C -5 -2, 5 -2, 5 5 Z" fill="#A0AEC0" />
            <circle cx="0" cy="-2" r="3" fill="#A0AEC0" />
        </g>
        
        {/* Checkmark Circle on the left */}
        <circle cx="75" cy="50" r="12" fill="white" stroke="#E2E8F0" strokeWidth="1.5"/>
        <path d="M71 50 l 3 3 l 5 -5" stroke="#48BB78" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
);


const SupportScreen: React.FC<SupportScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex items-center space-x-3 fixed top-0 left-0 right-0 z-20">
        <button onClick={onBack} className="text-primary hover:bg-primary-50 p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-primary">Hỗ trợ</h1>
      </header>
      
      <main className="pt-20 p-4 space-y-4">
        {/* Session 1: Daily Support */}
        <div className="bg-white rounded-xl shadow-md p-6">
            <DailySupportIllustration />
            <h2 className="text-xl font-bold text-center text-primary mb-6">Hỗ trợ công việc hằng ngày</h2>
            <div className="text-left space-y-6 text-base">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Thứ 2 - Thứ 7:</h3>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <p className="font-semibold text-gray-600">Giờ hành chính</p>
                            <p className="text-gray-800 mt-1">08:30 - 12:00</p>
                            <p className="text-gray-800">13:30 - 18:00</p>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-600">Ngoài giờ</p>
                            <p className="text-gray-800 mt-1">07:00 - 08:30</p>
                            <p className="text-gray-800">12:00 - 13:30</p>
                            <p className="text-gray-800">18:00 - 21:00</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 className="font-bold text-lg text-gray-800">Chủ nhật</h3>
                    <p className="text-gray-800 mt-1">08:00 - 18:00</p>
                </div>
            </div>
            
            <button className="mt-8 w-full bg-[#ED7B7B] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                Gọi tổng đài
            </button>
        </div>

        {/* Session 2: HR Support */}
        <div className="bg-white rounded-xl shadow-md p-6">
            <HRSupportIllustration />
            <div className="text-center">
                <h2 className="text-xl font-bold text-primary">Hỗ trợ vấn đề về nhân sự</h2>
                <p className="text-md text-gray-500 mt-1">(mở, khóa tài khoản, xin tạm nghỉ...)</p>
            </div>
            <div className="text-left space-y-6 text-base mt-6">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Thứ 2 - Thứ 6:</h3>
                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <p className="font-semibold text-gray-600">Giờ hành chính</p>
                            <p className="text-gray-800 mt-1">08:30 - 12:00</p>
                            <p className="text-gray-800">13:30 - 18:00</p>
                        </div>
                        <div className="flex-1">
                            <p className="font-semibold text-gray-600">Ngoài giờ</p>
                            <p className="text-gray-500 mt-1 italic">Tổng đài không hỗ trợ ngoài giờ làm việc.</p>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Thứ 7:</h3>
                    <div className="flex-1">
                        <p className="font-semibold text-gray-600">Giờ hành chính</p>
                        <p className="text-gray-800 mt-1">08:30 - 12:00</p>
                    </div>
                </div>
            </div>
            
            <button className="mt-8 w-full bg-[#ED7B7B] text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity">
                Gọi tổng đài
            </button>
        </div>
      </main>
    </div>
  );
};

export default SupportScreen;