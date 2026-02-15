import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { createPortal } from 'react-dom';
import { Announcement } from '../types';

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as any }
  }
};

interface AdminHubProps {
  announcements: Announcement[];
  onAdd: (ann: Announcement) => void;
  onRemove: (id: string) => void;
}

export const AdminHub: React.FC<AdminHubProps> = ({ 
  announcements, 
  onAdd, 
  onRemove
}) => {
  const [isComposingAnn, setIsComposingAnn] = useState(false);

  // Announcement State
  const [annData, setAnnData] = useState({
    title: '',
    content: '',
    elaboration: '',
    priority: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
    targetAudience: 'GLOBAL' as 'GLOBAL' | 'STUDENT' | 'FACULTY',
    targetSemester: undefined as number | undefined,
    targetUserId: ''
  });

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = {
      id: `admin-${Date.now()}`,
      title: annData.title,
      author: 'ADMIN SYSTEM',
      date: 'Just Now',
      content: annData.content,
      elaboration: annData.elaboration || annData.content,
      priority: annData.priority,
      targetAudience: annData.targetAudience,
      targetSemester: annData.targetAudience === 'STUDENT' ? annData.targetSemester : undefined,
      targetUserId: annData.targetUserId.trim() ? annData.targetUserId.trim().toUpperCase() : undefined
    };
    onAdd(newAnn);
    setIsComposingAnn(false);
    setAnnData({ title: '', content: '', elaboration: '', priority: 'MEDIUM', targetAudience: 'GLOBAL', targetSemester: undefined, targetUserId: '' });
  };

  return (
    <div className="space-y-12 pb-24 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 pb-10">
        <div className="space-y-2">
          <p className="text-purple-600 text-[10px] font-black uppercase tracking-[0.4em]">Administrative Terminal</p>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Institutional Command Hub</h2>
          <p className="text-slate-400 text-xs font-medium tracking-widest uppercase">Announcement & Protocol Management</p>
        </div>
      </div>

      <div className="space-y-10">
        <div className="flex justify-between items-center bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
           <div className="space-y-1">
              <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase leading-none">Global Announcements</h4>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Transmissions: {announcements.length}</p>
           </div>
           <button 
              onClick={() => setIsComposingAnn(true)}
              className="bg-purple-600 text-white px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-purple-600/20 active:scale-[0.98] transition-all"
            >
              Initialize Protocol ⊕
            </button>
        </div>
        
        <div className="space-y-6">
          {announcements.map((ann) => (
            <motion.div key={ann.id} variants={itemVariants} initial="hidden" animate="visible" className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm relative overflow-hidden group">
              <div className="flex justify-between items-start">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${ann.priority === 'HIGH' ? 'bg-red-500' : 'bg-blue-500'}`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {ann.targetUserId ? `Direct: ${ann.targetUserId}` : ann.targetAudience}
                    </span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight leading-none group-hover:text-purple-600 transition-colors">{ann.title}</h4>
                  <p className="text-slate-500 font-medium max-w-2xl">{ann.content}</p>
                </div>
                <button onClick={() => onRemove(ann.id)} className="p-3 bg-slate-50 text-slate-300 hover:text-red-500 rounded-2xl transition-all">✕</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {createPortal(
        <AnimatePresence>
          {isComposingAnn && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-3xl flex items-center justify-center p-6" onClick={() => setIsComposingAnn(false)}>
              <motion.div className="bg-white rounded-[56px] w-full max-w-3xl overflow-hidden shadow-2xl p-16 space-y-10" onClick={e => e.stopPropagation()}>
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Broadcast Protocol</h3>
                <form onSubmit={handlePostAnnouncement} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Title</label>
                       <input required className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-bold outline-none focus:ring-2 focus:ring-purple-500/20" placeholder="Title" value={annData.title} onChange={e => setAnnData({...annData, title: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Cluster</label>
                       <select className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-bold" value={annData.targetAudience} onChange={e => setAnnData({...annData, targetAudience: e.target.value as any})}>
                          <option value="GLOBAL">Global</option>
                          <option value="FACULTY">Faculty Registry</option>
                          <option value="STUDENT">Student Registry</option>
                       </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                     <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Protocol Content</label>
                     <textarea required className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-8 py-6 text-sm h-32 resize-none outline-none focus:ring-2 focus:ring-purple-500/20" placeholder="Message content..." value={annData.content} onChange={e => setAnnData({...annData, content: e.target.value})} />
                  </div>
                  <button type="submit" className="w-full bg-purple-600 text-white py-6 rounded-[24px] font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all">Transmit ❯</button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};