import React, { useState } from 'react';

interface OtpScreenProps {
  phone: string;
  onVerify: (otp: string) => void;
}

const OtpScreen: React.FC<OtpScreenProps> = ({ phone, onVerify }) => {
  const [otp, setOtp] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onVerify(otp);
  };

  const formattedPhone = `+84 ${phone.substring(1, 4)} *** ${phone.substring(7)}`;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
         <h1 className="text-4xl font-bold text-center text-primary-600 mb-2">NOVOKING</h1>
        <p className="text-center text-gray-500 mb-8">Xác thực tài khoản</p>

        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-800">Nhập mã OTP</h2>
            <p className="text-gray-500 mt-2">
                Chúng tôi đã gửi mã xác thực đến số điện thoại <br/>
                <span className="font-semibold text-gray-700">{formattedPhone}</span>
            </p>
          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div>
              <label htmlFor="otp" className="sr-only">
                Mã OTP
              </label>
              <input
                id="otp"
                name="otp"
                type="text"
                inputMode="numeric"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                maxLength={6}
                className="appearance-none block w-full px-3 py-3 bg-primary-700 text-white rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary-500 text-center text-2xl tracking-[.5em]"
                placeholder="_ _ _ _ _ _"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Xác nhận
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OtpScreen;