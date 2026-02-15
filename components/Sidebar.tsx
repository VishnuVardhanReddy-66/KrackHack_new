import React, { useState } from 'react';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (id: string, subSection?: any) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentRole, activeTab, onTabChange }) => {
  const [isMoreOpen, setIsMoreOpen] = useState(activeTab === 'hub');

  const menuItems = [
    { id: 'dashboard', label: 'Campus Home', icon: '🏛️' },
    { id: 'vault', label: 'Academic Vault', icon: '📂', roles: [UserRole.STUDENT, UserRole.FACULTY, UserRole.ADMIN] },
    { id: 'hostel-mess', label: 'Mess & Hostel', icon: '🍱', roles: [UserRole.STUDENT] },
    { id: 'programming-hub', label: 'Programming', icon: '💻', roles: [UserRole.STUDENT] },
    { id: 'opportunities', label: 'Career Hub', icon: '💼', roles: [UserRole.STUDENT] },
    { id: 'announcements', label: 'Announcements', icon: '📢', roles: [UserRole.FACULTY, UserRole.ADMIN] },
    { id: 'grievances', label: 'Grievance Center', icon: '🛡️' },
    { 
      id: 'hub', 
      label: 'More', 
      icon: '✨', 
      hasSubmenu: true,
      roles: [UserRole.STUDENT],
      subItems: [
        { id: 'ANNOUNCEMENTS', label: 'Announcements', icon: '📢' },
        { id: 'CARPOOL', label: 'Carpool', icon: '🚗' }
      ]
    },
    { id: 'admin-panel', label: 'Admin Hub', icon: '⚙️', roles: [UserRole.ADMIN] },
  ];

  return (
    <aside className="w-64 bg-slate-900 h-full flex flex-col border-r border-white/5 relative z-[60]">
      <div className="p-8 border-b border-white/5 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-600/20">
            <span className="text-xl">🛡️</span>
          </div>
          <div>
            <h1 className="text-sm font-black text-white tracking-widest uppercase">AEGIS</h1>
            <p className="text-[8px] font-black text-purple-400 tracking-[0.3em] uppercase opacity-60">System Core</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        {menuItems
          .filter(item => !item.roles || item.roles.includes(currentRole))
          .map((item) => {
            const isActive = activeTab === item.id;
            
            if (item.hasSubmenu) {
              return (
                <div key={item.id} className="space-y-1">
                  <button
                    onClick={() => {
                      setIsMoreOpen(!isMoreOpen);
                      onTabChange('hub');
                    }}
                    className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all relative group ${
                      isActive 
                        ? 'bg-purple-600/20 text-white' 
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                      <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                    </div>
                    <motion.span 
                      animate={{ rotate: isMoreOpen ? 180 : 0 }}
                      className="text-[10px] opacity-40"
                    >
                      ▼
                    </motion.span>
                  </button>
                  
                  <AnimatePresence>
                    {isMoreOpen && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-black/20 rounded-2xl ml-2 mr-2"
                      >
                        {item.subItems?.map(sub => (
                          <button
                            key={sub.id}
                            onClick={() => onTabChange('hub', sub.id)}
                            className="w-full flex items-center gap-3 px-8 py-3 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-left"
                          >
                            <span className="text-sm">{sub.icon}</span>
                            <span className="text-[9px] font-bold uppercase tracking-widest">{sub.label}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all relative group ${
                  isActive 
                    ? 'bg-purple-600 text-white shadow-xl shadow-purple-600/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{item.icon}</span>
                <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                {isActive && (
                  <motion.div 
                    layoutId="sidebar-active-indicator"
                    className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </button>
            );
          })}
      </nav>

      <div className="p-8 border-t border-white/5 space-y-4">
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
          <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden ring-2 ring-purple-600/30">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${currentRole}`} alt="Profile" />
          </div>
          <div className="overflow-hidden">
            <p className="text-[10px] font-black text-white truncate uppercase tracking-tighter">{currentRole}</p>
            <p className="text-[8px] font-bold text-slate-500 truncate uppercase">Authorized Access</p>
          </div>
        </div>
      </div>
    </aside>
  );
};