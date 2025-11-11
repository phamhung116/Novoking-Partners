import React, { useState, useMemo } from 'react';
import { User } from '../types';

interface CollaboratorListScreenProps {
  collaborators: User[];
  onBack: () => void;
  onEdit: (collaborator: User) => void;
  onViewJobs: (collaborator: User) => void;
}

const Avatar: React.FC<{ user: User }> = ({ user }) => {
  const [imgError, setImgError] = useState(false);

  if (user.avatarUrl && !imgError) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.name}
        className="w-12 h-12 rounded-full object-cover border-2 border-gray-100"
        onError={() => setImgError(true)}
      />
    );
  }

  const getInitials = (name: string) => {
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center border-2 border-gray-100">
      <span className="text-primary font-bold text-lg">{getInitials(user.name)}</span>
    </div>
  );
};

const CollaboratorListScreen: React.FC<CollaboratorListScreenProps> = ({ collaborators, onBack, onEdit, onViewJobs }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCollaborators = useMemo(() => {
    if (!searchTerm) {
      return collaborators;
    }
    const lowercasedFilter = searchTerm.toLowerCase();
    return collaborators.filter(collab =>
      collab.name.toLowerCase().includes(lowercasedFilter) ||
      collab.phone.includes(lowercasedFilter)
    );
  }, [searchTerm, collaborators]);

  return (
    <div className="min-h-screen font-sans bg-gray-50">
      <header className="bg-gray-50 p-4 flex items-center space-x-3 fixed top-0 left-0 right-0 z-20 border-b border-gray-200">
        <button onClick={onBack} className="text-primary hover:bg-primary-50 p-1 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="text-xl font-bold text-primary">Danh sách Cộng tác viên</h1>
      </header>

      <main className="pt-20 p-4">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Tìm theo tên hoặc SĐT..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-primary-50 border border-primary-200 text-primary-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary placeholder-primary-400"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-3">
          {filteredCollaborators.length > 0 ? (
            filteredCollaborators.map(collab => (
              <div key={collab.idNumber} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar user={collab} />
                    <div>
                      <p className="font-bold text-gray-800">{collab.name}</p>
                      <p className="text-sm text-gray-500">{collab.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => onEdit(collab)} 
                      className="p-2 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition-colors"
                      aria-label={`Chỉnh sửa ${collab.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                        <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button 
                      onClick={() => onViewJobs(collab)} 
                      className="p-2 bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition-colors"
                      aria-label={`Xem công việc của ${collab.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-gray-500">Không tìm thấy cộng tác viên.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CollaboratorListScreen;