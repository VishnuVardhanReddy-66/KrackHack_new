
import React from 'react';
import { UserRole } from '../types';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Campus Home', icon: '🏠', roles: [UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN] },
  { id: 'hostel-mess', label: 'Hostel & Mess', icon: '🏨', roles: [UserRole.STUDENT, UserRole.ADMIN] },
  { id: 'programming-hub', label: 'Programming Arena', icon: '💻', roles: [UserRole.STUDENT, UserRole.FACULTY] },
  { id: 'grievances', label: 'Grievance Portal', icon: '📝', roles: [UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN] },
  { id: 'vault', label: 'Academic Records', icon: '📂', roles: [UserRole.STUDENT, UserRole.FACULTY] },
  { id: 'opportunities', label: 'Careers & Research', icon: '💼', roles: [UserRole.STUDENT] },
  { id: 'hub', label: 'Community Hub', icon: '🌐', roles: [UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN] },
];

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (id: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, onTabChange }) => {
  const filteredNav = NAV_ITEMS.filter(item => item.roles.includes(currentRole));

  return (
    <div className="w-64 h-full bg-[#fdfdfd] border-r border-black/5 flex flex-col shrink-0 z-50">
      <div className="p-10">
        <h1 className="text-xl font-black flex items-center gap-3 tracking-tighter text-[#242424]">
          <span className="w-8 h-8 bg-purple-600 rounded-md flex items-center justify-center text-white text-sm shadow-md">🛡️</span>
          AEGIS
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {filteredNav.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onTabChange(item.id)}
            className={`w-full flex items-center gap-4 px-5 py-3 rounded-md transition-all duration-200 ${
              activeTab === item.id
                ? 'bg-white text-purple-600 shadow-sm border border-black/5 font-bold'
                : 'text-[#616161] hover:text-[#242424] hover:bg-white/60'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span className="text-sm font-semibold tracking-tight">{item.label}</span>
          </motion.button>
        ))}
      </nav>

      <div className="p-6">
        <div className="p-4 rounded-lg bg-white border border-black/5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-600/10 flex items-center justify-center text-purple-600 font-bold text-[10px] uppercase">
              {currentRole[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-[11px] font-bold text-[#242424] truncate uppercase tracking-tight">{currentRole}</p>
              <p className="text-[9px] text-[#86868b] font-bold uppercase tracking-widest">IIT Mandi Node</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
