
import React from 'react';
import { Sidebar } from './Sidebar';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  currentRole: UserRole;
  activeTab: string;
  onTabChange: (id: string, subSection?: any) => void;
  onLogout: () => void;
  activeSubTab: string;
  onSubTabChange: (id: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentRole, 
  activeTab, 
  onTabChange, 
  onLogout,
  activeSubTab,
  onSubTabChange
}) => {
  const subTabs = ['General', 'Exams'];

  return (
    <div className="flex h-screen w-full overflow-hidden selection:bg-purple-500/10">
      <Sidebar 
        currentRole={currentRole} 
        activeTab={activeTab} 
        onTabChange={onTabChange} 
      />
      
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Sticky Global Nav */}
        <header className="h-16 glass-nav px-12 flex items-center justify-between z-50 sticky top-0">
          <div className="flex items-center gap-8">
            <h2 className="text-[11px] font-black text-[#242424] tracking-[0.2em] uppercase">
              Student Information System / <span className="text-purple-600">{
                activeTab === 'hub' ? 'MORE' : 
                activeTab === 'announcements' ? 'ANNOUNCEMENTS' :
                activeTab === 'programming-hub' ? 'PROGRAMMING' :
                activeTab.replace('-', ' ')
              }</span>
            </h2>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={onLogout}
              className="btn-secondary !py-2 !px-4 text-[10px] uppercase tracking-widest"
            >
              Log Out
            </button>
          </div>
        </header>

        {/* Floating Sub-Navigation - Only visible for Dashboard (Campus Home) */}
        <AnimatePresence>
          {activeTab === 'dashboard' && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 56, opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sticky top-16 z-40 bg-white/60 backdrop-blur-md border-b border-black/5 px-12 flex items-center gap-4 overflow-hidden"
            >
              {subTabs.map((nav) => {
                const isActive = activeSubTab.toLowerCase() === nav.toLowerCase();
                return (
                  <button 
                    key={nav} 
                    onClick={() => onSubTabChange(nav.toLowerCase())}
                    className={`text-[10px] font-black uppercase tracking-[0.15em] h-10 px-6 transition-all relative flex items-center justify-center ${
                      isActive 
                        ? 'text-purple-600' 
                        : 'text-[#616161] bg-[#f6f6fc] rounded-sm hover:bg-[#ececf9]'
                    }`}
                  >
                    {nav}
                    {isActive && (
                      <motion.div 
                        layoutId="subtab-underline"
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-purple-600"
                      />
                    )}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex-1 overflow-y-auto pt-0">
          <div className="w-full max-w-[1400px] mx-auto">
            {children}
          </div>
          
          <footer className="py-24 px-12 text-center border-t border-black/5 mt-32">
            <p className="text-[9px] font-bold tracking-[0.4em] uppercase font-mono text-[#86868b]">
              AEGIS ECOSYSTEM • UNIVERSITY DIGITAL HUB • IIT MANDI
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
};
