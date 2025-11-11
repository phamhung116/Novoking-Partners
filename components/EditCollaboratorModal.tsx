import React, { useState, useEffect } from 'react';
import { User } from '../types';

interface EditCollaboratorModalProps {
  collaborator: User;
  onClose: () => void;
  onSave: (updatedCollaborator: User) => void;
}

const InputField: React.FC<{ label: string; name: keyof User; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; type?: string; }> = ({ label, name, value, onChange, type = 'text' }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
        />
    </div>
);


const EditCollaboratorModal: React.FC<EditCollaboratorModalProps> = ({ collaborator, onClose, onSave }) => {
  const [formData, setFormData] = useState<User>(collaborator);

  // Ensure form data is always in sync with the selected collaborator prop.
  useEffect(() => {
    setFormData(collaborator);
  }, [collaborator]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };
  
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-xl max-w-lg w-full transform transition-all animate-fade-in-up"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Chỉnh sửa thông tin Cộng tác viên</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
                <InputField label="Họ và Tên" name="name" value={formData.name || ''} onChange={handleChange} />
                <InputField label="Số điện thoại" name="phone" value={formData.phone || ''} onChange={handleChange} type="tel" />
                <InputField label="Email" name="email" value={formData.email || ''} onChange={handleChange} type="email" />
                <InputField label="Địa chỉ" name="address" value={formData.address || ''} onChange={handleChange} />
                <InputField label="Ngày sinh (DD/MM/YYYY)" name="dob" value={formData.dob || ''} onChange={handleChange} />
                <InputField label="Số CCCD" name="idNumber" value={formData.idNumber || ''} onChange={handleChange} />
            </div>
            
            <div className="bg-gray-50 p-4 rounded-b-xl flex space-x-3">
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300"
                    onClick={onClose}
                >
                    Hủy
                </button>
                <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-700"
                >
                    Lưu thay đổi
                </button>
            </div>
        </form>
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
export default EditCollaboratorModal;