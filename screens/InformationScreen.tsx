import React, { useState } from 'react';
import { User, UserRole } from '../types';
import ChangePasswordModal from '../components/ChangePasswordModal';

interface InformationScreenProps {
  user: User;
  onBack: () => void;
  onPasswordChange: (newPass: string) => void;
}

const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; isBlue?: boolean }> = ({ label, value, isBlue = false }) => (
    <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-sm font-bold text-right ${isBlue ? 'text-primary' : 'text-gray-800'}`}>{value}</p>
    </div>
);

const InformationScreen: React.FC<InformationScreenProps> = ({ user, onBack, onPasswordChange }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  
  return (
    <div className="min-h-screen font-sans bg-gray-50">
      {/* Header */}
      <header className="bg-primary p-4 flex items-center space-x-3 fixed top-0 left-0 right-0 z-20">
        <button onClick={onBack} className="text-white hover:bg-white/10 p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-white">Thông tin</h1>
      </header>
      
      <div>
        <div className="relative bg-primary pb-20 pt-16">
            <div className="absolute -bottom-1 w-full h-16 bg-gray-50" style={{borderTopLeftRadius: '1.5rem', borderTopRightRadius: '1.5rem'}}></div>
            <div className="relative flex flex-col items-center pt-4 z-10">
                <div className="w-28 h-28 rounded-full border-4 border-white shadow-lg overflow-hidden">
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <h2 className="mt-4 text-2xl font-bold text-white">{user.name}</h2>
            </div>
        </div>
        
        <div className="p-4 -mt-16 relative z-10">
            {/* Info Card */}
            <div className="bg-white rounded-xl shadow-md p-5">
                 {user.role === UserRole.Partner && (
                    <InfoRow 
                        label="Chất lượng phục vụ trung bình:" 
                        value={
                            <div className="flex items-center space-x-1">
                                <span className="font-bold text-primary">{user.averageRating}</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        }
                    />
                 )}
                 <InfoRow label="Số điện thoại:" value={user.phone} isBlue />
                 <InfoRow label="Email:" value={user.email} isBlue />
                 <InfoRow label="Ngày sinh:" value={user.dob} isBlue />
                 <InfoRow label="Số CCCD:" value={user.idNumber} isBlue />
                 <InfoRow label="Địa chỉ:" value={user.address} isBlue />
            </div>

            {/* Other Options */}
            <div className="mt-6 space-y-4">
                 <button className="w-full flex justify-between items-center bg-white rounded-xl shadow-md p-4 hover:bg-gray-50 transition-colors">
                    <span className="font-semibold text-gray-800">Điều kiện và điều khoản hợp tác</span>
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                 <button 
                   onClick={() => setIsChangingPassword(true)}
                   className="w-full flex items-center justify-center space-x-2 p-3 bg-white hover:bg-red-50 rounded-lg transition-colors text-red-600 font-semibold shadow-md border border-gray-200"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                         <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2V7a5 5 0 00-5-5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                         <path d="M8 7a2 2 0 114 0v2a2 2 0 11-4 0V7z" />
                    </svg>
                    <span>Đổi mật khẩu</span>
                </button>
            </div>
        </div>
      </div>

      {isChangingPassword && (
        <ChangePasswordModal 
          phone={user.phone}
          onClose={() => setIsChangingPassword(false)}
          onPasswordChange={onPasswordChange}
        />
      )}
    </div>
  );
};

export default InformationScreen;