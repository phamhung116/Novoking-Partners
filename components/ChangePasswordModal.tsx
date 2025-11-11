import React, { useState } from 'react';

// Eye icon components for password visibility
const EyeOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
);

const EyeClosedIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7 .946-3.012 3.42-5.38 6.542-6.325m3.151.425A1.5 1.5 0 0113.5 6a1.5 1.5 0 011.5 1.5c0 .356-.126.686-.337.95l2.43 2.431A.5.5 0 0117 11.5v.5a3 3 0 11-5.06-2.31l-2.029-2.03A10.025 10.025 0 0112 5c4.478 0 8.268 2.943 9.542 7a10.05 10.05 0 01-1.375 2.825M17.5 17.5l-15-15" />
    </svg>
);

interface ChangePasswordModalProps {
  phone: string;
  onClose: () => void;
  onPasswordChange: (newPass: string) => void;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ phone, onClose, onPasswordChange }) => {
  const [step, setStep] = useState<'otp' | 'reset' | 'success'>('otp');
  
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [error, setError] = useState('');
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const formattedPhone = `+84 ${phone.substring(1, 4)} *** ${phone.substring(7)}`;

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    // As per requirement, any OTP is valid
    setError('');
    setStep('reset');
  };

  const handleResetPasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmNewPassword) {
      setError('Mật khẩu không khớp. Vui lòng nhập lại.');
      return;
    }
    if (newPassword.length < 3) {
      setError('Mật khẩu phải có ít nhất 3 ký tự.');
      return;
    }
    
    onPasswordChange(newPassword);
    setStep('success');
  };

  const renderOtpForm = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Xác thực OTP</h2>
        <p className="text-gray-500 mt-2">
          Mã OTP sẽ được gửi đến số điện thoại <br/>
          <span className="font-semibold text-gray-700">{formattedPhone}</span>
        </p>
      </div>
      <form onSubmit={handleOtpSubmit} className="space-y-6">
        <div>
          <label htmlFor="otp-change" className="sr-only">Mã OTP</label>
          <input
            id="otp-change"
            name="otp-change"
            type="text"
            inputMode="numeric"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
            maxLength={6}
            className="appearance-none block w-full px-3 py-3 bg-gray-100 text-gray-900 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 text-center text-2xl tracking-[.5em]"
            placeholder="_ _ _ _ _ _"
          />
        </div>
        <div>
          <button
            type="submit"
            disabled={!otp}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300"
          >
            Xác nhận
          </button>
        </div>
        <div className="text-center">
          <button type="button" onClick={onClose} className="text-sm font-semibold text-gray-500 hover:underline">
            Hủy
          </button>
        </div>
      </form>
    </div>
  );

  const renderResetPasswordForm = () => (
    <div className="p-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Tạo mật khẩu mới</h2>
        <p className="text-gray-500 mt-2">Vui lòng nhập mật khẩu mới của bạn.</p>
      </div>
      <form onSubmit={handleResetPasswordSubmit} className="space-y-4">
        <div>
          <label htmlFor="new-password"  className="block text-sm font-bold text-gray-800 mb-2 sr-only">
            Mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="new-password"
              name="new-password"
              type={isNewPasswordVisible ? 'text' : 'password'}
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-3 bg-gray-100 text-gray-900 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
              placeholder="Nhập mật khẩu mới"
            />
            <button 
                type="button" 
                onClick={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
                {isNewPasswordVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="confirm-new-password"  className="block text-sm font-bold text-gray-800 mb-2 sr-only">
            Nhập lại mật khẩu mới
          </label>
          <div className="relative">
            <input
              id="confirm-new-password"
              name="confirm-new-password"
              type={isConfirmPasswordVisible ? 'text' : 'password'}
              required
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              className="appearance-none block w-full px-3 py-3 bg-gray-100 text-gray-900 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
              placeholder="Nhập lại mật khẩu mới"
            />
            <button 
                type="button" 
                onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
                {isConfirmPasswordVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
            </button>
          </div>
        </div>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <div className="pt-2">
          <button
            type="submit"
            disabled={!newPassword || !confirmNewPassword}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-300"
          >
            Xác nhận
          </button>
        </div>
        <div className="text-center">
          <button type="button" onClick={() => setStep('otp')} className="text-sm font-semibold text-gray-500 hover:underline">
            Quay lại
          </button>
        </div>
      </form>
    </div>
  );

  const renderSuccess = () => (
    <div className="p-6 text-center">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl leading-6 font-bold text-gray-900 mt-4" id="modal-title">
          Đổi mật khẩu thành công!
        </h3>
        <div className="mt-2">
            <p className="text-sm text-gray-500">Bạn có thể sử dụng mật khẩu mới cho lần đăng nhập sau.</p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg shadow-md px-4 py-3 bg-primary text-base font-bold text-white hover:bg-primary-600"
            onClick={onClose}
          >
            Hoàn tất
          </button>
        </div>
      </div>
  );

  const renderContent = () => {
    switch (step) {
      case 'otp': return renderOtpForm();
      case 'reset': return renderResetPasswordForm();
      case 'success': return renderSuccess();
      default: return null;
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        {renderContent()}
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

export default ChangePasswordModal;