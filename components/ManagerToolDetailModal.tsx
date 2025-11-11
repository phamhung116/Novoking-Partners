import React, { useState, useEffect } from 'react';
import { CompanyTool, User, CompanyToolStatus } from '../types';
import ConfirmationModal from './ConfirmationModal';

interface ManagerToolDetailModalProps {
  tool: CompanyTool;
  collaboratorName: string | null;
  collaborators: User[];
  onClose: () => void;
  onSave: (updatedTool: CompanyTool) => void;
  onDelete: (toolId: string) => void;
}

const InfoRow: React.FC<{ label: string; value: string | React.ReactNode }> = ({ label, value }) => (
    <div className="flex justify-between items-start py-3 border-b border-gray-100 last:border-b-0">
        <p className="text-sm text-gray-600 flex-shrink-0 mr-4">{label}</p>
        <div className="text-sm font-semibold text-gray-800 text-right">{value}</div>
    </div>
);

const StatusBadge: React.FC<{ status: CompanyTool['status'] }> = ({ status }) => {
    const statusStyles: Record<CompanyToolStatus, string> = {
        'Khả dụng': 'bg-green-100 text-green-800',
        'Đang sử dụng': 'bg-yellow-100 text-yellow-800',
        'Hư hỏng': 'bg-red-100 text-red-800',
    };
    return (
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const ManagerToolDetailModal: React.FC<ManagerToolDetailModalProps> = ({ tool, collaboratorName, collaborators, onClose, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<CompanyTool>(tool);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    setFormData(tool);
    setIsEditing(false); // Reset to view mode when tool prop changes
  }, [tool]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
        const newFormData = { ...prev, [name]: value };

        // Automatic status change logic
        if (name === 'assignedToId') {
            if (value) { // A collaborator is selected
                newFormData.status = 'Đang sử dụng';
            } else { // 'Chưa phân công' is selected
                newFormData.status = 'Khả dụng';
            }
        }
        
        return newFormData;
    });
  };

  const handleSave = () => {
    onSave(formData);
  };
  
  const handleDelete = () => {
    onDelete(tool.id);
    setIsDeleteConfirmOpen(false);
  };

  const renderViewMode = () => (
    <>
      <div className="p-6 max-h-[60vh] overflow-y-auto">
        <div className="w-full h-40 bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
            <img 
                src={tool.imageUrl || 'https://ohtavn.com/wp-content/uploads/2023/09/pro18.png'} 
                alt={tool.name} 
                className="w-full h-full object-cover rounded-lg" 
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://ohtavn.com/wp-content/uploads/2023/09/pro18.png'; }}
            />
        </div>
        <h3 className="text-lg font-bold text-primary mb-4">{tool.name}</h3>
        <div className="space-y-1">
          <InfoRow label="Loại dụng cụ" value={tool.type} />
          <InfoRow label="Ngày mua" value={tool.purchaseDate} />
          <InfoRow label="Trạng thái" value={<StatusBadge status={tool.status} />} />
          <InfoRow label="Cộng tác viên" value={collaboratorName || 'Chưa phân công'} />
          <InfoRow label="Ghi chú" value={tool.notes || 'Không có'} />
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-b-xl flex space-x-3">
        <button onClick={onClose} className="w-full bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50">
          Đóng
        </button>
        <button onClick={() => setIsEditing(true)} className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600">
          Chỉnh sửa
        </button>
      </div>
    </>
  );

  const renderEditMode = () => (
    <>
      <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4 text-sm">
        <div>
          <label className="font-medium text-gray-700">Tên dụng cụ</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="font-medium text-gray-700">Loại dụng cụ</label>
          <input type="text" name="type" value={formData.type} onChange={handleChange} className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="font-medium text-gray-700">URL Hình ảnh</label>
          <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="font-medium text-gray-700">Ngày mua (dd/mm/yyyy)</label>
          <input type="text" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary" />
        </div>
        <div>
          <label className="font-medium text-gray-700">Trạng thái</label>
          <select name="status" value={formData.status} onChange={handleChange} className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary" disabled={!!formData.assignedToId}>
            <option value="Khả dụng">Khả dụng</option>
            <option value="Đang sử dụng">Đang sử dụng</option>
            <option value="Hư hỏng">Hư hỏng</option>
          </select>
        </div>
        <div>
          <label className="font-medium text-gray-700">Phân công</label>
          <select name="assignedToId" value={formData.assignedToId || ''} onChange={handleChange} className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary">
            <option value="">Chưa phân công</option>
            {collaborators.map(c => <option key={c.idNumber} value={c.idNumber}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="font-medium text-gray-700">Ghi chú</label>
          <textarea name="notes" value={formData.notes || ''} onChange={handleChange} rows={3} className="mt-1 w-full p-2 bg-white text-gray-900 border border-gray-500 rounded-md focus:ring-primary focus:border-primary"></textarea>
        </div>
         <div className="pt-4">
            <button type="button" onClick={() => setIsDeleteConfirmOpen(true)} className="w-full flex items-center justify-center space-x-2 text-left p-2 bg-red-50 hover:bg-red-100 rounded-lg transition-colors text-red-600 font-semibold border border-red-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
                <span>Xóa dụng cụ này</span>
            </button>
        </div>
      </div>
      <div className="bg-gray-50 p-4 rounded-b-xl flex space-x-3">
        <button onClick={() => setIsEditing(false)} className="w-full bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50">
          Hủy
        </button>
        <button onClick={handleSave} className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600">
          Lưu thay đổi
        </button>
      </div>
    </>
  );

  return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
        <div className="bg-white rounded-xl shadow-xl max-w-sm w-full transform transition-all animate-fade-in-up" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-900">{isEditing ? 'Chỉnh sửa Dụng cụ' : 'Chi tiết Dụng cụ'}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            {isEditing ? renderEditMode() : renderViewMode()}
        </div>
        <style>{`
            @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
            }
            .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
        `}</style>
        </div>
        <ConfirmationModal
            isOpen={isDeleteConfirmOpen}
            onClose={() => setIsDeleteConfirmOpen(false)}
            onConfirm={handleDelete}
            title="Xóa Dụng cụ?"
            message={`Bạn có chắc chắn muốn xóa dụng cụ "${tool.name}" không? Hành động này không thể hoàn tác.`}
            confirmText="Xác nhận Xóa"
            variant="danger"
        />
    </>
  );
};

export default ManagerToolDetailModal;