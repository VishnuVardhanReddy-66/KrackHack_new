
import React from 'react';
import { UserRole } from '../types';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '🏠', roles: [UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN] },
  { id: 'hostel-mess', label: 'Hostel & Mess', icon: '🏨', roles: [UserRole.STUDENT, UserRole.ADMIN] },
  { id: 'programming-hub', label: 'Programming Hub', icon: '💻', roles: [UserRole.STUDENT, UserRole.FACULTY] },
  { id: 'grievances', label: 'Grievances', icon: '📝', roles: [UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN] },
  { id: 'vault', label: 'Academic Vault', icon: '📂', roles: [UserRole.STUDENT, UserRole.FACULTY] },
  { id: 'opportunities', label: 'Opportunity Portal', icon: '💼', roles: [UserRole.STUDENT] },
  { id: 'hub', label: 'Campus Hub', icon: '🌐', roles: [UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN] },
  { id: 'admin-panel', label: 'System Admin', icon: '⚙️', roles: [UserRole.ADMIN] },
];

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, onTabChange }) => {
  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(currentRole));

  return (
    <div className="w-64 h-full bg-slate-900 text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-blue-500">🛡️</span> AEGIS
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-mono">IIT Mandi Protocol</p>
      </div>

      <nav className="flex-1 mt-6 px-3">
        {filteredNav.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-slate-800/50 m-3 rounded-xl border border-slate-700">
        <p className="text-xs text-slate-400 mb-2">Logged in as</p>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 text-xs font-bold">
            {currentRole[0]}
          </div>
          <div className="overflow-hidden">
            <p className="text-sm font-semibold truncate leading-tight">{currentRole}</p>
            <p className="text-[10px] text-slate-500 truncate">IIT Mandi Secure Node</p>
          </div>
        </div>
      </div>
    </div>
  );
};
