
import React from 'react';
import { Sidebar } from './Sidebar';
import { UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (id: string) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentRole, 
  activeTab, 
  onTabChange, 
  onLogout 
}) => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 animate-in fade-in duration-300">
      <Sidebar 
        currentRole={currentRole} 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shadow-sm z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-bold text-slate-800 capitalize tracking-tight">
              {activeTab.replace('-', ' ')}
            </h2>
            <span className="w-1 h-1 bg-slate-300 rounded-full" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
              Session Active
            </span>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4 border-r border-slate-200 pr-6 mr-2">
              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors relative">
                <span className="text-xl">🔔</span>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                <span className="text-xl">⚙️</span>
              </button>
            </div>
            
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-red-600 text-white rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
            >
              <span>🚪</span> Logout
            </button>
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};
