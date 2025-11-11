import React from 'react';

interface KeepLoggedInScreenProps {
  onConfirm: () => void;
  onDecline: () => void;
}

const KeepLoggedInScreen: React.FC<KeepLoggedInScreenProps> = ({ onConfirm, onDecline }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full mx-auto">
         <h1 className="text-4xl font-bold text-center text-primary-600 mb-2">NOVOKING</h1>
        <p className="text-center text-gray-500 mb-8">Xác thực thành công</p>

        <div className="bg-white p-8 rounded-2xl shadow-lg text-center">
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <svg className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Duy trì đăng nhập?</h2>
            <p className="text-gray-500 mt-2">
              Bạn có muốn duy trì đăng nhập trên thiết bị này không?
            </p>
          <div className="mt-6 space-y-3">
              <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={onConfirm}
              >
                Có, duy trì đăng nhập
              </button>
               <button
                type="button"
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                onClick={onDecline}
              >
                Không, cảm ơn
              </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default KeepLoggedInScreen;
