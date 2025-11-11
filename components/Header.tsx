import React from 'react';
import { Tab } from '../types';

interface HeaderProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
  newJobCount: number;
}

const Header: React.FC<HeaderProps> = ({ activeTab, onTabChange, newJobCount }) => {
  const getTabClass = (tab: Tab) => {
    return activeTab === tab
      ? 'bg-white text-primary'
      : 'text-blue-100 hover:bg-primary-600 hover:text-white';
  };
  
  const getBadgeClass = (tab: Tab) => {
    return activeTab === tab 
      ? 'bg-primary text-white'
      : 'bg-white text-primary'
  }

  return (
    <header className="bg-primary shadow-md p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center">
            <h1 className="text-2xl font-bold tracking-wider text-white">NOVOKING</h1>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 rounded-lg bg-primary-700 p-1">
          <button
            onClick={() => onTabChange(Tab.New)}
            className={`flex items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700 ${getTabClass(Tab.New)}`}
          >
            <span>{Tab.New}</span>
            <span className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${getBadgeClass(Tab.New)}`}>
              {newJobCount}
            </span>
          </button>
          <button
            onClick={() => onTabChange(Tab.Accepted)}
            className={`flex items-center justify-center gap-2 rounded-md py-2 px-4 text-sm font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-700 ${getTabClass(Tab.Accepted)}`}
          >
            <span>{Tab.Accepted}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;