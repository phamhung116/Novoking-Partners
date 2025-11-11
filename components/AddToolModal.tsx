import React, { useState } from 'react';
import { CompanyTool } from '../types';

interface AddToolModalProps {
  onClose: () => void;
  onAdd: (newToolData: Omit<CompanyTool, 'id' | 'status' | 'assignedToId'>) => void;
}

const AddToolModal: React.FC<AddToolModalProps> = ({ onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    imageUrl: '',
    purchaseDate: '',
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.type || !formData.purchaseDate) {
      alert('Vui lòng điền đầy đủ các trường bắt buộc: Tên, Loại, Ngày mua.');
      return;
    }
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Thêm dụng cụ mới</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
        
        <form onSubmit={handleSubmit}>
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-sm">
                <div>
                  <label className="font-medium text-gray-700">Tên dụng cụ</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} required className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Loại dụng cụ</label>
                  <input type="text" name="type" value={formData.type} onChange={handleChange} required className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">URL Hình ảnh</label>
                  <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Ngày mua (dd/mm/yyyy)</label>
                  <input type="text" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} required className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary" />
                </div>
                <div>
                  <label className="font-medium text-gray-700">Ghi chú</label>
                  <textarea name="notes" value={formData.notes} onChange={handleChange} rows={3} className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary"></textarea>
                </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-b-xl flex space-x-3">
                <button type="button" onClick={onClose} className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-100 border border-gray-300">Hủy</button>
                <button type="submit" className="w-full inline-flex justify-center rounded-lg px-4 py-2 bg-primary text-sm font-medium text-white hover:bg-primary-700">Xác nhận</button>
            </div>
        </form>
        <style>{`
          @keyframes fade-in-up { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        `}</style>
      </div>
    </div>
  );
};

export default AddToolModal;
