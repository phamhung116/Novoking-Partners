import React, { useState } from 'react';

interface LoginScreenProps {
  onLogin: (phone: string, pass: string) => Promise<void>;
  onPasswordReset: (newPass: string) => void;
}

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

const LanguageIcon = () => (
     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
        <path d="M2 12h20"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
     </svg>
);

const VietnamFlagIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 600" className="w-6 h-4 rounded-sm flex-shrink-0">
        <rect width="900" height="600" fill="#DA251D"/>
        <path d="M450 150l106.9 328.6-280-203.1h346.2L343.1 478.6z" fill="#FFFF00"/>
    </svg>
);

const ResetSuccessPopup = ({ onClose }: { onClose: () => void }) => (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4 transition-opacity duration-300"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all opacity-100 scale-100 p-6 text-center animate-fade-in-up">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
          <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-2xl leading-6 font-bold text-gray-900 mt-4" id="modal-title">
          Đặt lại mật khẩu thành công!
        </h3>
        <div className="mt-2">
            <p className="text-sm text-gray-500">Bạn có thể đăng nhập bằng mật khẩu mới.</p>
        </div>
        <div className="mt-6">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-lg shadow-md px-4 py-3 bg-primary text-base font-bold text-white hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-transform transform hover:scale-105"
            onClick={onClose}
          >
            Về trang đăng nhập
          </button>
        </div>
      </div>
    </div>
);


type Flow = 'login' | 'forgot_phone' | 'forgot_otp' | 'reset_password';

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onPasswordReset }) => {
  const [flow, setFlow] = useState<Flow>('login');
  
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);

  const [showResetSuccess, setShowResetSuccess] = useState(false);

  const resetFormStates = () => {
    setError('');
    setPassword('');
    setOtp('');
    setNewPassword('');
    setConfirmNewPassword('');
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !password) return;
    setError('');
    setIsLoading(true);
    try {
      await onLogin(phone, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone) return;
    setError('');
    setIsLoading(true);
    setTimeout(() => {
        setIsLoading(false);
        if (phone === '0788205251') {
            setFlow('forgot_otp');
        } else {
            setError('Số điện thoại chưa được đăng ký, vui lòng liên hệ Novoking.');
        }
    }, 1000);
  };
  
  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    // Any OTP is valid as per requirements
    setFlow('reset_password');
    resetFormStates();
  };
  
  const handleResetPasswordSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (newPassword !== confirmNewPassword) {
          setError('Mật khẩu không khớp. Vui lòng nhập lại.');
          return;
      }
      if (newPassword.length < 3) {
          setError('Mật khẩu phải có ít nhất 3 ký tự.');
          return;
      }
      
      onPasswordReset(newPassword);
      setShowResetSuccess(true);
  };

  const handleCloseSuccessPopup = () => {
    setShowResetSuccess(false);
    setFlow('login');
    resetFormStates();
  };

  const renderLoginForm = () => (
      <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div>
            <label htmlFor="phone" className="block text-sm font-bold text-gray-800 mb-2">
              Số điện thoại
            </label>
            <div className="flex items-center bg-primary-700 rounded-lg shadow-sm">
              <div className="pl-3 pr-2 border-r border-primary-500 flex items-center space-x-2">
                <VietnamFlagIcon />
                <span className="text-sm font-semibold text-blue-200">+84</span>
              </div>
              <input
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                className="appearance-none block w-full pl-3 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none sm:text-sm"
                placeholder="Số điện thoại"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password"  className="block text-sm font-bold text-gray-800 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={isPasswordVisible ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-3 bg-primary-700 text-white rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                placeholder="Mật khẩu"
              />
              <button 
                  type="button" 
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                  {isPasswordVisible ? <EyeClosedIcon /> : <EyeOpenIcon />}
              </button>
            </div>
          </div>
          
          <div className="text-right">
              <button type="button" onClick={() => { setFlow('forgot_phone'); resetFormStates(); }} className="text-sm font-semibold text-primary hover:text-primary-700 hover:underline">
                  Quên mật khẩu?
              </button>
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button
              type="submit"
              disabled={!phone || !password || isLoading}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold transition-colors duration-300 ${!phone || !password || isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'}`}
            >
              {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </div>
      </form>
  );

  const renderForgotPasswordForm = () => (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Lấy lại mật khẩu</h2>
            <p className="text-gray-500 mt-2">Vui lòng nhập số điện thoại đã đăng ký.</p>
        </div>
        <form onSubmit={handlePhoneSubmit} className="space-y-6">
            <div>
              <label htmlFor="phone-forgot" className="block text-sm font-bold text-gray-800 mb-2">
                Số điện thoại
              </label>
              <div className="flex items-center bg-primary-700 rounded-lg shadow-sm">
                <div className="pl-3 pr-2 border-r border-primary-500 flex items-center space-x-2">
                  <VietnamFlagIcon />
                  <span className="text-sm font-semibold text-blue-200">+84</span>
                </div>
                <input
                  id="phone-forgot"
                  name="phone-forgot"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/[^0-9]/g, ''))}
                  className="appearance-none block w-full pl-3 py-3 bg-transparent text-white placeholder-gray-400 focus:outline-none sm:text-sm"
                  placeholder="Số điện thoại"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600 text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={!phone || isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold transition-colors duration-300 ${!phone || isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'}`}
              >
                {isLoading ? 'Đang gửi...' : 'Xác nhận'}
              </button>
            </div>
             <div className="text-center">
              <button type="button" onClick={() => { setFlow('login'); resetFormStates(); }} className="text-sm font-semibold text-gray-400 hover:underline">
                  Quay lại đăng nhập
              </button>
            </div>
        </form>
    </div>
  );

  const renderOtpForm = () => (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Xác thực OTP</h2>
            <p className="text-gray-500 mt-2">
                Chúng tôi đã gửi mã xác thực đến số điện thoại <br/>
                <span className="font-semibold text-gray-700">{`+84 ${phone.substring(1)}`}</span>
            </p>
        </div>
        <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label htmlFor="otp" className="sr-only">Mã OTP</label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={6}
                className="appearance-none block w-full px-3 py-3 bg-primary-700 text-white rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 text-center text-2xl tracking-[.5em]"
                placeholder="_ _ _ _ _ _"
              />
            </div>
             {error && <p className="text-sm text-red-600 text-center">{error}</p>}
            <div>
              <button
                type="submit"
                disabled={!otp || isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold transition-colors duration-300 ${!otp || isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'}`}
              >
                {isLoading ? 'Đang xác thực...' : 'Xác nhận'}
              </button>
            </div>
             <div className="text-center">
              <button type="button" onClick={() => { setFlow('forgot_phone'); resetFormStates(); }} className="text-sm font-semibold text-gray-400 hover:underline">
                  Quay lại
              </button>
            </div>
        </form>
    </div>
  );
  
  const renderResetPasswordForm = () => (
    <div>
        <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Tạo mật khẩu mới</h2>
            <p className="text-gray-500 mt-2">Vui lòng nhập mật khẩu mới của bạn.</p>
        </div>
        <form onSubmit={handleResetPasswordSubmit} className="space-y-6">
            <div>
              <label htmlFor="new-password"  className="block text-sm font-bold text-gray-800 mb-2">
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
                  className="appearance-none block w-full px-3 py-3 bg-primary-700 text-white rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
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
              <label htmlFor="confirm-new-password"  className="block text-sm font-bold text-gray-800 mb-2">
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
                  className="appearance-none block w-full px-3 py-3 bg-primary-700 text-white rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
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

            <div>
              <button
                type="submit"
                disabled={!newPassword || !confirmNewPassword || isLoading}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-bold transition-colors duration-300 ${!newPassword || !confirmNewPassword || isLoading ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500'}`}
              >
                {isLoading ? 'Đang lưu...' : 'Xác nhận'}
              </button>
            </div>
             <div className="text-center">
              <button type="button" onClick={() => { setFlow('login'); resetFormStates(); }} className="text-sm font-semibold text-gray-400 hover:underline">
                  Quay lại đăng nhập
              </button>
            </div>
        </form>
    </div>
  );

  const renderContent = () => {
    switch (flow) {
      case 'forgot_phone': return renderForgotPasswordForm();
      case 'forgot_otp': return renderOtpForm();
      case 'reset_password': return renderResetPasswordForm();
      case 'login':
      default: return renderLoginForm();
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col p-6 font-sans">
      <header className="w-full">
        <div className="flex justify-end">
            <button className="flex items-center space-x-1 text-gray-700 font-medium">
                <LanguageIcon />
                <span>Tiếng Việt</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
        </div>
      </header>
      
      <main className="flex-1 flex flex-col justify-center">
        <div className="w-full max-w-sm mx-auto">
          <div className="text-center mb-12">
            <img src="https://novoking.vn/wp-content/uploads/2021/05/cropped-BIEU-TUONG-1.png" alt="Novoking Logo" className="h-20 w-auto mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-primary">NOVOKING</h1>
            <p className="text-gray-500 font-medium mt-1">Dành cho Cộng tác viên</p>
          </div>

          {renderContent()}

        </div>
      </main>
      <footer className="w-full text-center py-4">
        <p className="text-xs text-gray-400">
            Phiên bản 1.0.0 &nbsp;&nbsp; Mã 3267000
        </p>
      </footer>

      {showResetSuccess && <ResetSuccessPopup onClose={handleCloseSuccessPopup} />}

      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default LoginScreen;