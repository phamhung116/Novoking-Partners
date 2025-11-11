

import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { User, UserRole, CompanyTool, CompanyToolStatus, ToolReport } from '../types';
import ManagerToolDetailModal from '../components/ManagerToolDetailModal';
import ConfirmationModal from '../components/ConfirmationModal';
import AddToolModal from '../components/AddToolModal';
import PartnerToolDetailModal from '../components/PartnerToolDetailModal';
import ReportDamageModal from '../components/ReportDamageModal';
import ToolReportCard from '../components/ToolReportCard';
import ToolReportDetailModal from '../components/ToolReportDetailModal';

// --- PARTNER VIEW COMPONENTS ---

const PartnerToolStatusBadge: React.FC<{ status: CompanyToolStatus }> = ({ status }) => {
    const statusStyles: Record<CompanyToolStatus, string> = {
        'Khả dụng': 'bg-gray-100 text-gray-700',
        'Đang sử dụng': 'bg-blue-100 text-blue-700',
        'Hư hỏng': 'bg-red-100 text-red-700',
    };
    return (
        <span className={`inline-block mt-2 px-2 py-0.5 rounded-full text-xs font-semibold ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const PartnerToolCard: React.FC<{ tool: CompanyTool; onSelect: () => void; }> = ({ tool, onSelect }) => {
    return (
        <div onClick={onSelect} className="bg-white p-4 rounded-lg flex items-center space-x-4 shadow-sm border border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors">
            <img 
                src={tool.imageUrl || 'https://ohtavn.com/wp-content/uploads/2023/09/pro18.png'} 
                alt={tool.name}
                className="w-20 h-20 rounded-md object-cover flex-shrink-0 bg-gray-100"
                onError={(e) => { (e.target as HTMLImageElement).src = 'https://ohtavn.com/wp-content/uploads/2023/09/pro18.png'; }}
            />
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-800 truncate">{tool.name}</p>
                <p className="text-sm text-gray-500 mt-1">{tool.type}</p>
                <PartnerToolStatusBadge status={tool.status} />
            </div>
             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
        </div>
    );
};

// --- MANAGER VIEW COMPONENTS ---

const ManagerToolStatusBadge: React.FC<{ status: CompanyToolStatus }> = ({ status }) => {
    const statusStyles: Record<CompanyToolStatus, string> = {
        'Khả dụng': 'bg-green-100 text-green-700',
        'Đang sử dụng': 'bg-yellow-100 text-yellow-800',
        'Hư hỏng': 'bg-red-100 text-red-700',
    };
    return (
        <span className={`inline-block px-3 py-1 rounded-md text-xs font-semibold ${statusStyles[status]}`}>
            {status}
        </span>
    );
};

const ManagerToolCard: React.FC<{ tool: CompanyTool; collaboratorName: string | null; onSelect: () => void; onToggle: () => void; isSelected: boolean; }> = ({ tool, collaboratorName, onSelect, onToggle, isSelected }) => {
    return (
        <div 
            onClick={onSelect}
            className={`bg-white p-4 rounded-lg flex items-center space-x-4 shadow-sm border-2 cursor-pointer hover:shadow-md hover:border-primary-300 transition-all duration-200 ${isSelected ? 'border-primary' : 'border-gray-200'}`}
        >
            <input type="checkbox" className="h-5 w-5 text-primary rounded-sm border-gray-400 focus:ring-offset-0 focus:ring-2 focus:ring-primary-500" checked={isSelected} onChange={onToggle} onClick={(e) => e.stopPropagation()} />
            <div className="w-16 h-16 rounded-md flex-shrink-0 bg-gray-100 border border-gray-200 flex items-center justify-center">
                <img 
                    src={tool.imageUrl || 'https://ohtavn.com/wp-content/uploads/2023/09/pro18.png'} 
                    alt={tool.name} 
                    className="w-full h-full object-cover rounded-md" 
                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://ohtavn.com/wp-content/uploads/2023/09/pro18.png'; }}
                />
            </div>
            <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 truncate text-base">{tool.name}</p>
                <p className="text-sm text-gray-500">{tool.type}</p>
                <div className="flex items-center space-x-3 mt-2">
                    <ManagerToolStatusBadge status={tool.status} />
                    {collaboratorName && <p className="text-xs text-gray-500">Sở hữu: {collaboratorName}</p>}
                </div>
            </div>
        </div>
    );
};

const BulkActionToolbar: React.FC<{ count: number; onAssign: () => void; onDelete: () => void; onClear: () => void; }> = ({ count, onAssign, onDelete, onClear }) => (
    <div className="fixed bottom-14 left-0 right-0 bg-primary-800 text-white p-3 shadow-lg z-20 flex justify-between items-center animate-slide-in-up">
        <div className="flex items-center space-x-3">
            <button onClick={onClear} className="p-1 rounded-full hover:bg-white/10">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
            <span className="font-bold">{count} đã chọn</span>
        </div>
        <div className="flex space-x-2">
            <button onClick={onAssign} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg text-sm">Phân công</button>
            <button onClick={onDelete} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg text-sm">Xóa</button>
        </div>
        <style>{`
            @keyframes slide-in-up {
                0% { transform: translateY(100%); }
                100% { transform: translateY(0); }
            }
            .animate-slide-in-up { animation: slide-in-up 0.3s ease-out forwards; }
        `}</style>
    </div>
);

const BulkAssignModal: React.FC<{ isOpen: boolean; onClose: () => void; onConfirm: (collaboratorId: string) => void; collaborators: User[]; }> = ({ isOpen, onClose, onConfirm, collaborators }) => {
    const [selectedId, setSelectedId] = useState('');

    if (!isOpen) return null;

    const handleConfirm = () => {
        if (selectedId) {
            onConfirm(selectedId);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6 animate-fade-in-up" onClick={e => e.stopPropagation()}>
                <h3 className="text-lg font-bold text-gray-800 mb-4">Phân công cho Cộng tác viên</h3>
                <select value={selectedId} onChange={e => setSelectedId(e.target.value)} className="w-full p-2.5 bg-white text-gray-900 border border-gray-500 rounded-md text-sm focus:ring-primary focus:border-primary">
                    <option value="" disabled>-- Chọn một CTV --</option>
                    {collaborators.map(c => <option key={c.idNumber} value={c.idNumber}>{c.name}</option>)}
                </select>
                <div className="mt-6 flex space-x-3">
                    <button onClick={onClose} className="w-full bg-white text-gray-700 font-semibold py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-50">Hủy</button>
                    <button onClick={handleConfirm} disabled={!selectedId} className="w-full bg-primary text-white font-semibold py-2 px-4 rounded-lg hover:bg-primary-600 disabled:bg-gray-300">Xác nhận</button>
                </div>
            </div>
        </div>
    );
};

// --- MAIN SCREEN COMPONENT ---

interface ToolsScreenProps {
  userRole: UserRole;
  currentUser: User;
  companyTools: CompanyTool[];
  collaborators: User[];
  toolReports: ToolReport[];
  onAddCompanyTool: (newToolData: Omit<CompanyTool, 'id' | 'status' | 'assignedToId'>) => void;
  onUpdateCompanyTool: (tool: CompanyTool) => void;
  onDeleteCompanyTools: (toolIds: string[]) => void;
  onBulkAssignCompanyTools: (toolIds: string[], assignedToId: string) => void;
  // FIX: Updated prop type to match the data passed from ReportDamageModal.
  // This ensures the handler in App.tsx receives the correct data structure, without image URLs.
  onCreateToolReport: (data: Omit<ToolReport, 'id' | 'timestamp' | 'partnerId' | 'partnerName' | 'imageUrls'>) => void;
  onUpdateToolReport: (reportId: string, updates: Partial<ToolReport>) => void;
  onConfirmCompensation: (report: ToolReport) => void;
  onBack?: () => void;
  onTakePhoto: () => void;
  onChoosePhoto: () => void;
  previewImageUrls: string[];
  onRemovePreview: (index: number) => void;
  onClearProofs: () => void;
  // Obsolete props, kept for compatibility
  partnerTools: any[];
  onUpdatePartnerTool: (...args: any[]) => void;
}

const ToolsScreen: React.FC<ToolsScreenProps> = (props) => {
  const { userRole, currentUser, companyTools, collaborators, toolReports, onAddCompanyTool, onUpdateCompanyTool, onDeleteCompanyTools, onBulkAssignCompanyTools, onCreateToolReport, onUpdateToolReport, onConfirmCompensation, onBack, onTakePhoto, onChoosePhoto, previewImageUrls, onRemovePreview, onClearProofs } = props;
  
  // Common state for both roles
  const [activeTab, setActiveTab] = useState(userRole === 'manager' ? 'management' : 'my_tools');
  const [viewingReport, setViewingReport] = useState<ToolReport | null>(null);

  // Partner specific state
  const [viewingToolDetail, setViewingToolDetail] = useState<CompanyTool | null>(null);
  const [reportingTool, setReportingTool] = useState<CompanyTool | null>(null);
  const [partnerStatusFilter, setPartnerStatusFilter] = useState<'all' | CompanyToolStatus>('all');
  const [partnerTypeFilter, setPartnerTypeFilter] = useState<string>('all');
  
  // Manager specific state
  const [selectedTool, setSelectedTool] = useState<CompanyTool | null>(null);
  const [statusFilter, setStatusFilter] = useState<CompanyTool['status'] | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [collaboratorFilter, setCollaboratorFilter] = useState<string>('all');
  const [selectedToolIds, setSelectedToolIds] = useState<string[]>([]);
  const [isBulkAssignOpen, setIsBulkAssignOpen] = useState(false);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const selectAllCheckboxRef = useRef<HTMLInputElement>(null);

  const toolTypes = useMemo(() => [...new Set(companyTools.map(t => t.type))], [companyTools]);
  const collaboratorMap = useMemo(() => new Map(collaborators.map(c => [c.idNumber, c.name])), [collaborators]);

  const filteredManagerTools = useMemo(() => {
        return companyTools.filter(tool => {
            if (statusFilter !== 'all' && tool.status !== statusFilter) return false;
            if (typeFilter !== 'all' && tool.type !== typeFilter) return false;
            if (collaboratorFilter !== 'all' && tool.assignedToId !== collaboratorFilter) return false;
            return true;
        });
    }, [companyTools, statusFilter, typeFilter, collaboratorFilter]);
  
  const partnerToolTypes = useMemo(() => {
    const toolsForPartner = companyTools.filter(tool => tool.assignedToId === currentUser.idNumber);
    return [...new Set(toolsForPartner.map(t => t.type))];
  }, [companyTools, currentUser]);

  const assignedPartnerTools = useMemo(() => {
      return companyTools
        .filter(tool => tool.assignedToId === currentUser.idNumber)
        .filter(tool => {
            if (partnerStatusFilter !== 'all' && tool.status !== partnerStatusFilter) return false;
            if (partnerTypeFilter !== 'all' && tool.type !== partnerTypeFilter) return false;
            return true;
        });
  }, [companyTools, currentUser.idNumber, partnerStatusFilter, partnerTypeFilter]);
  
  const partnerToolReports = useMemo(() => {
      return toolReports.filter(report => report.partnerId === currentUser.idNumber);
  }, [toolReports, currentUser]);

  useEffect(() => {
      if (userRole === 'manager' && selectAllCheckboxRef.current) {
          const allFilteredIds = filteredManagerTools.map(t => t.id);
          const selectedInFiltered = selectedToolIds.filter(id => allFilteredIds.includes(id));
          if (selectedInFiltered.length > 0 && selectedInFiltered.length < allFilteredIds.length) {
              selectAllCheckboxRef.current.indeterminate = true;
          } else {
              selectAllCheckboxRef.current.indeterminate = false;
          }
      }
  }, [selectedToolIds, filteredManagerTools, userRole]);

  // --- Modal Opening/Closing Handlers ---
  const handleOpenReportModal = (tool: CompanyTool) => {
      setViewingToolDetail(null);
      setReportingTool(tool);
  };
  
  const handleCloseReportModal = () => {
      setReportingTool(null);
      onClearProofs();
  };

  const handleCreateReport = (data: Omit<ToolReport, 'id' | 'timestamp' | 'partnerId' | 'partnerName' | 'imageUrls'>) => {
      // FIX: Correctly pass the data up to the parent component without adding an empty `imageUrls` array.
      // The parent component (`App.tsx`) will now handle adding the images from its state.
      onCreateToolReport(data);
      handleCloseReportModal();
  };

  // --- Manager specific handlers ---
  const handleAddTool = (newToolData: Omit<CompanyTool, 'id' | 'status' | 'assignedToId'>) => { onAddCompanyTool(newToolData); setIsAddModalOpen(false); };
  const handleSaveTool = (updatedTool: CompanyTool) => { onUpdateCompanyTool(updatedTool); setSelectedTool(null); };
  const handleDeleteTool = (toolId: string) => { onDeleteCompanyTools([toolId]); setSelectedTool(null); };
  const handleToggleSelection = (toolId: string) => { setSelectedToolIds(prev => prev.includes(toolId) ? prev.filter(id => id !== toolId) : [...prev, toolId]); };
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => { e.target.checked ? setSelectedToolIds(filteredManagerTools.map(t => t.id)) : setSelectedToolIds([]); };
  const handleConfirmBulkDelete = () => { onDeleteCompanyTools(selectedToolIds); setIsBulkDeleteOpen(false); setSelectedToolIds([]); };
  const handleConfirmBulkAssign = (collaboratorId: string) => { onBulkAssignCompanyTools(selectedToolIds, collaboratorId); setIsBulkAssignOpen(false); setSelectedToolIds([]); };


  // --- RENDER LOGIC ---
  if (userRole === 'partner') {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-primary p-4 sticky top-0 z-10">
                 <div className="flex items-center justify-center relative mb-4">
                    {onBack && (
                        <button onClick={onBack} className="absolute left-0 text-white p-1 rounded-full hover:bg-white/10">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                    )}
                    <h1 className="text-xl font-bold text-white text-center">Dụng cụ</h1>
                </div>
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-primary-700 p-1">
                    <button onClick={() => setActiveTab('my_tools')} className={`rounded-md py-2 px-4 text-sm font-semibold transition-colors ${activeTab === 'my_tools' ? 'bg-white text-primary' : 'text-blue-100'}`}>Dụng cụ của tôi</button>
                    <button onClick={() => setActiveTab('reports')} className={`rounded-md py-2 px-4 text-sm font-semibold transition-colors ${activeTab === 'reports' ? 'bg-white text-primary' : 'text-blue-100'}`}>Danh sách báo cáo</button>
                </div>
            </header>
            <main className="p-4 space-y-3">
                {activeTab === 'my_tools' && (
                    <>
                        <div className="grid grid-cols-2 gap-3 mb-1">
                            <select
                                value={partnerStatusFilter}
                                onChange={e => setPartnerStatusFilter(e.target.value as any)}
                                className="w-full p-2 bg-white border border-black text-black rounded-md focus:ring-primary focus:border-primary text-sm"
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="Đang sử dụng">Đang sử dụng</option>
                                <option value="Hư hỏng">Hư hỏng</option>
                            </select>
                            <select
                                value={partnerTypeFilter}
                                onChange={e => setPartnerTypeFilter(e.target.value)}
                                className="w-full p-2 bg-white border border-black text-black rounded-md focus:ring-primary focus:border-primary text-sm"
                            >
                                <option value="all">Tất cả loại</option>
                                {partnerToolTypes.map(type => <option key={type} value={type}>{type}</option>)}
                            </select>
                        </div>
                        {assignedPartnerTools.length > 0 ? assignedPartnerTools.map(tool => (
                            <PartnerToolCard key={tool.id} tool={tool} onSelect={() => setViewingToolDetail(tool)} />
                        )) : <p className="text-center text-gray-500 pt-10">Không có dụng cụ nào phù hợp.</p>}
                    </>
                )}
                {activeTab === 'reports' && (
                    partnerToolReports.length > 0 ? partnerToolReports.map(report => (
                        <ToolReportCard key={report.id} report={report} onClick={() => setViewingReport(report)} />
                    )) : <p className="text-center text-gray-500 pt-10">Bạn chưa có báo cáo nào.</p>
                )}
            </main>

            {viewingToolDetail && <PartnerToolDetailModal tool={viewingToolDetail} onClose={() => setViewingToolDetail(null)} onReport={() => handleOpenReportModal(viewingToolDetail)} />}
            {reportingTool && <ReportDamageModal tool={reportingTool} onClose={handleCloseReportModal} onCreateReport={handleCreateReport} onTakePhoto={onTakePhoto} onChoosePhoto={onChoosePhoto} previewImageUrls={previewImageUrls} onRemovePreview={onRemovePreview} />}
            {viewingReport && <ToolReportDetailModal report={viewingReport} userRole="partner" onClose={() => setViewingReport(null)} onUpdateReport={onUpdateToolReport} onConfirmCompensation={onConfirmCompensation} />}
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
       <div className={`p-4 pb-24 ${selectedToolIds.length > 0 ? 'pb-32' : ''}`}>
          <h1 className="text-3xl font-bold text-primary text-center mb-4">Dụng cụ</h1>
          
          <div className="border-b border-gray-200">
              <nav className="-mb-px flex w-full" aria-label="Tabs">
                  <button onClick={() => setActiveTab('management')} className={`w-1/2 text-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'management' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                      Quản lý
                  </button>
                  <button onClick={() => setActiveTab('reports')} className={`w-1/2 text-center py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'reports' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}>
                      Báo cáo ({toolReports.filter(r => r.status === 'pending').length})
                  </button>
              </nav>
          </div>

          {activeTab === 'management' && (
              <div className="mt-4 space-y-4">
                  <button onClick={() => setIsAddModalOpen(true)} className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-colors duration-300 shadow-md">
                      Thêm dụng cụ
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)} className="w-full p-2.5 bg-white text-gray-900 border border-gray-500 rounded-md text-sm focus:ring-primary focus:border-primary">
                          <option value="all">Tất cả trạng thái</option>
                          <option value="Khả dụng">Khả dụng</option>
                          <option value="Đang sử dụng">Đang sử dụng</option>
                          <option value="Hư hỏng">Hư hỏng</option>
                      </select>
                      <select value={collaboratorFilter} onChange={e => setCollaboratorFilter(e.target.value)} className="w-full p-2.5 bg-white text-gray-900 border border-gray-500 rounded-md text-sm focus:ring-primary focus:border-primary">
                          <option value="all">Tất cả CTV</option>
                          {collaborators.map(c => <option key={c.idNumber} value={c.idNumber}>{c.name}</option>)}
                      </select>
                      <select value={typeFilter} onChange={e => setTypeFilter(e.target.value as any)} className="w-full p-2.5 bg-white text-gray-900 border border-gray-500 rounded-md text-sm focus:ring-primary focus:border-primary">
                          <option value="all">Tất cả loại</option>
                          {toolTypes.map(type => <option key={type} value={type}>{type}</option>)}
                      </select>
                  </div>

                  {filteredManagerTools.length > 0 ? (
                      <div className="space-y-3">
                          <div className="flex items-center space-x-3 px-2">
                              <input
                                  type="checkbox"
                                  ref={selectAllCheckboxRef}
                                  checked={selectedToolIds.length > 0 && selectedToolIds.length === filteredManagerTools.length}
                                  onChange={handleSelectAll}
                                  className="h-5 w-5 text-primary rounded-sm border-gray-400 focus:ring-offset-0 focus:ring-2 focus:ring-primary-500"
                              />
                              <label className="text-sm font-medium text-gray-600">Chọn tất cả</label>
                          </div>
                          {filteredManagerTools.map(tool => (
                              <ManagerToolCard 
                                  key={tool.id} 
                                  tool={tool} 
                                  onSelect={() => setSelectedTool(tool)}
                                  onToggle={() => handleToggleSelection(tool.id)}
                                  isSelected={selectedToolIds.includes(tool.id)}
                                  collaboratorName={tool.assignedToId ? collaboratorMap.get(tool.assignedToId) || null : null}
                              />
                          ))}
                      </div>
                  ) : (
                      <div className="text-center py-10">
                          <p className="text-gray-500">Không tìm thấy dụng cụ phù hợp.</p>
                      </div>
                  )}
              </div>
          )}

          {activeTab === 'reports' && (
              <div className="mt-4 space-y-3">
                {toolReports.length > 0 ? (
                    toolReports.map(report => (
                        <ToolReportCard key={report.id} report={report} onClick={() => setViewingReport(report)} />
                    ))
                ) : (
                    <p className="text-center text-gray-500 pt-10">Chưa có báo cáo nào từ cộng tác viên.</p>
                )}
              </div>
          )}
      </div>
      {selectedTool && <ManagerToolDetailModal tool={selectedTool} onClose={() => setSelectedTool(null)} onSave={handleSaveTool} onDelete={handleDeleteTool} collaborators={collaborators} collaboratorName={selectedTool.assignedToId ? collaboratorMap.get(selectedTool.assignedToId) || 'Không rõ' : null} />}
      {isAddModalOpen && <AddToolModal onClose={() => setIsAddModalOpen(false)} onAdd={handleAddTool} />}
      {selectedToolIds.length > 0 && <BulkActionToolbar count={selectedToolIds.length} onAssign={() => setIsBulkAssignOpen(true)} onDelete={() => setIsBulkDeleteOpen(true)} onClear={() => setSelectedToolIds([])} />}
      <BulkAssignModal isOpen={isBulkAssignOpen} onClose={() => setIsBulkAssignOpen(false)} onConfirm={handleConfirmBulkAssign} collaborators={collaborators} />
      <ConfirmationModal isOpen={isBulkDeleteOpen} onClose={() => setIsBulkDeleteOpen(false)} onConfirm={handleConfirmBulkDelete} title={`Xóa ${selectedToolIds.length} dụng cụ?`} message="Hành động này không thể hoàn tác. Bạn có chắc chắn muốn xóa các dụng cụ đã chọn không?" confirmText="Xác nhận Xóa" variant="danger" />
      {/* FIX: Corrected typo from onUpdateReport to onUpdateToolReport */}
      {viewingReport && <ToolReportDetailModal report={viewingReport} userRole="manager" onClose={() => setViewingReport(null)} onUpdateReport={onUpdateToolReport} onConfirmCompensation={onConfirmCompensation} />}
    </div>
  );
};

export default ToolsScreen;