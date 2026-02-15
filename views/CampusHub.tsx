
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Announcement, Carpool, UserRole } from '../types';

interface CampusHubProps {
  initialSection?: 'ANNOUNCEMENTS' | 'CARPOOL';
  userRole?: UserRole;
  userSemester?: number;
  userId?: string;
  announcements: Announcement[];
  onAddAnnouncement: (ann: Announcement) => void;
  onRemoveAnnouncement: (id: string) => void;
  carpools?: Carpool[];
  onAddCarpool?: (cp: Carpool) => void;
  onJoinCarpool?: (id: string) => void;
}

export const CampusHub: React.FC<CampusHubProps> = ({ 
  initialSection = 'ANNOUNCEMENTS', 
  userRole, 
  userSemester,
  userId,
  announcements,
  onAddAnnouncement,
  onRemoveAnnouncement,
  carpools = [],
  onAddCarpool,
  onJoinCarpool
}) => {
  const isAdmin = userRole === UserRole.ADMIN;
  const isFaculty = userRole === UserRole.FACULTY;
  const isStudent = userRole === UserRole.STUDENT;

  // Determine available tabs based on role
  const availableTabs = isStudent ? (['ANNOUNCEMENTS', 'CARPOOL'] as const) : (['ANNOUNCEMENTS'] as const);
  
  const [tab, setTab] = useState<'ANNOUNCEMENTS' | 'CARPOOL'>(
    (isStudent && initialSection === 'CARPOOL') ? 'CARPOOL' : 'ANNOUNCEMENTS'
  );

  // Fix: Added missing state variables for composing and viewing announcements
  const [isComposing, setIsComposing] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // Synchronize internal tab state with initialSection prop for reactive sidebar navigation
  useEffect(() => {
    if (isStudent) {
      setTab(initialSection as 'ANNOUNCEMENTS' | 'CARPOOL');
    } else {
      setTab('ANNOUNCEMENTS');
    }
  }, [initialSection, isStudent]);
  
  // Carpool Form State
  const [carpoolFormData, setCarpoolFormData] = useState({
    from: '',
    to: '',
    time: '',
    carType: 'Sedan',
    max: 4,
    totalPrice: 500
  });

  const [composeData, setComposeData] = useState({
    title: '',
    content: '',
    elaboration: '',
    priority: 'MEDIUM' as 'HIGH' | 'MEDIUM' | 'LOW',
    targetAudience: 'GLOBAL' as 'GLOBAL' | 'STUDENT' | 'FACULTY',
    targetSemester: undefined as number | undefined,
    targetUserId: ''
  });

  const filteredAnnouncements = announcements.filter(ann => {
    if (isAdmin) return true;
    if (ann.targetAudience === 'GLOBAL') return true;
    if (ann.targetAudience === 'FACULTY' && userRole === UserRole.FACULTY) return true;
    if (ann.targetAudience === 'STUDENT' && userRole === UserRole.STUDENT) {
      if (ann.targetUserId) return ann.targetUserId.toUpperCase() === userId?.toUpperCase();
      if (!ann.targetSemester) return true;
      return ann.targetSemester === userSemester;
    }
    return false;
  });

  const handlePostAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    const newAnn: Announcement = {
      id: `admin-${Date.now()}`,
      title: composeData.title,
      author: isAdmin ? 'CAMPUS ADMIN' : 'FACULTY OFFICE',
      date: 'Just Now',
      content: composeData.content,
      elaboration: composeData.elaboration || composeData.content,
      priority: composeData.priority,
      targetAudience: composeData.targetAudience,
      targetSemester: composeData.targetSemester,
      targetUserId: composeData.targetUserId.trim() || undefined
    };
    onAddAnnouncement(newAnn);
    setIsComposing(false);
    setComposeData({ title: '', content: '', elaboration: '', priority: 'MEDIUM', targetAudience: 'GLOBAL', targetSemester: undefined, targetUserId: '' });
  };

  const handlePostCarpool = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddCarpool) return;
    const newCp: Carpool = {
      id: `cp-${Date.now()}`,
      author: userId || 'Unknown',
      from: carpoolFormData.from,
      to: carpoolFormData.to,
      time: carpoolFormData.time,
      carType: carpoolFormData.carType,
      joined: 1,
      max: carpoolFormData.max,
      totalPrice: carpoolFormData.totalPrice,
      status: 'OPEN',
      joinedUserIds: [userId || 'Unknown']
    };
    onAddCarpool(newCp);
    setCarpoolFormData({ from: '', to: '', time: '', carType: 'Sedan', max: 4, totalPrice: 500 });
  };

  return (
    <div className="space-y-12 animate-in fade-in duration-700 pb-20 px-4 md:px-0">
      {isStudent && (
        <div className="flex gap-4 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
          {availableTabs.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
                tab === t ? 'bg-[#5b5fc7] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      )}

      {tab === 'ANNOUNCEMENTS' && (
        <div className="max-w-6xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 pb-10">
            <div className="space-y-1">
              <h2 className="text-4xl font-black text-[#1d1d1f] tracking-tight uppercase">
                {isAdmin ? 'System Announcements' : 'Campus Stream'}
              </h2>
              <p className="text-[#86868b] text-[11px] font-black uppercase tracking-[0.4em] mt-1">
                {isAdmin ? 'Institutional Management Console' : 
                 isFaculty ? 'Authorized Faculty Briefings' : 
                 `Personalized Feed for Semester ${userSemester || 'General'}`}
              </p>
            </div>
            {isAdmin && (
              <button 
                onClick={() => setIsComposing(true)}
                className="bg-[#5b5fc7] text-white px-10 py-5 rounded-[20px] font-black text-[11px] uppercase tracking-[0.15em] shadow-xl hover:bg-[#4b4fa3] transition-all"
              >
                New Institutional Protocol ⊕
              </button>
            )}
          </div>
          
          <div className="space-y-6">
            {filteredAnnouncements.length > 0 ? filteredAnnouncements.map((ann) => (
              <motion.div 
                key={ann.id} 
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-md transition-all relative group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <span className={`w-3 h-3 rounded-full ${
                      ann.priority === 'HIGH' ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]' : 
                      ann.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {ann.targetUserId ? 'DIRECT PROTOCOL' : 
                       ann.targetAudience === 'FACULTY' ? 'FACULTY ONLY' : 
                       ann.targetAudience === 'STUDENT' ? (ann.targetSemester ? `SEM ${ann.targetSemester} PROTOCOL` : 'STUDENT WIDE') : 
                       'GLOBAL BROADCAST'}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-300 font-bold uppercase tracking-tight">{ann.date}</span>
                </div>
                <h4 className="text-3xl font-black text-slate-800 mb-4 tracking-tight leading-none group-hover:text-[#5b5fc7] transition-colors">{ann.title}</h4>
                <p className="text-slate-600 text-lg leading-relaxed mb-10 font-medium">{ann.content}</p>
                <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400">🏛️</div>
                    <span className="text-[12px] text-slate-400 font-bold uppercase tracking-tight">
                      Origin: <span className="text-indigo-600 font-black">{ann.author}</span>
                    </span>
                  </div>
                  <button 
                    onClick={() => setSelectedAnnouncement(ann)}
                    className="bg-slate-50 hover:bg-slate-100 px-8 py-3 rounded-2xl text-[#5b5fc7] text-[11px] font-black uppercase tracking-widest transition-all"
                  >
                    Examine Registry ❯
                  </button>
                </div>
              </motion.div>
            )) : (
              <div className="text-center py-32 bg-slate-50/50 rounded-[48px] border-2 border-dashed border-slate-100">
                <span className="text-6xl block mb-6 grayscale opacity-20">📡</span>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">No active transmissions</p>
              </div>
            )}
          </div>
        </div>
      )}

      {tab === 'CARPOOL' && isStudent && (
        <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-12">
          {/* LEFT WINDOW: CREATE CARPOOL */}
          <div className="xl:col-span-1">
            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8 sticky top-24">
              <div className="space-y-1">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Initiate Carpool</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Node Provisioning Protocol</p>
              </div>

              <form onSubmit={handlePostCarpool} className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1.5 block">Origin Node</label>
                    <input 
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#5b5fc7]/20"
                      placeholder="e.g. North Campus"
                      value={carpoolFormData.from}
                      onChange={e => setCarpoolFormData({...carpoolFormData, from: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1.5 block">Destination Node</label>
                    <input 
                      required
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#5b5fc7]/20"
                      placeholder="e.g. Mandi Market"
                      value={carpoolFormData.to}
                      onChange={e => setCarpoolFormData({...carpoolFormData, to: e.target.value})}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1.5 block">Schedule</label>
                      <input 
                        required
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#5b5fc7]/20"
                        placeholder="Time/Date"
                        value={carpoolFormData.time}
                        onChange={e => setCarpoolFormData({...carpoolFormData, time: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1.5 block">Car Capacity</label>
                      <input 
                        required
                        type="number"
                        className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#5b5fc7]/20"
                        value={carpoolFormData.max}
                        onChange={e => setCarpoolFormData({...carpoolFormData, max: parseInt(e.target.value)})}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-2 mb-1.5 block">Total Fuel Cost (₹)</label>
                    <input 
                      required
                      type="number"
                      className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 outline-none focus:ring-2 focus:ring-[#5b5fc7]/20"
                      value={carpoolFormData.totalPrice}
                      onChange={e => setCarpoolFormData({...carpoolFormData, totalPrice: parseInt(e.target.value)})}
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-[#5b5fc7] text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all"
                >
                  Broadcast Ride ❯
                </button>
              </form>
            </div>
          </div>

          {/* RIGHT WINDOW: AVAILABLE CARPOOLS */}
          <div className="xl:col-span-2 space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-black/5 pb-10">
              <div className="space-y-1">
                <h2 className="text-4xl font-black text-[#1d1d1f] tracking-tight uppercase">Active Logistics</h2>
                <p className="text-[#86868b] text-[11px] font-black uppercase tracking-[0.4em] mt-1">Real-time Campus Transport Grid</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {carpools.length > 0 ? carpools.map(cp => {
                const hasJoined = userId && cp.joinedUserIds.includes(userId);
                return (
                  <motion.div 
                    key={cp.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col justify-between"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-4 py-1.5 rounded-full uppercase border border-slate-100 tracking-widest">#{cp.id}</span>
                        <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                          cp.status === 'OPEN' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>
                          {cp.status}
                        </span>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-4">
                          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                          <h4 className="text-xl font-black text-slate-800 tracking-tight">{cp.from}</h4>
                        </div>
                        <div className="w-px h-6 bg-slate-100 ml-0.5" />
                        <div className="flex items-center gap-4">
                          <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
                          <h4 className="text-xl font-black text-slate-800 tracking-tight">{cp.to}</h4>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Schedule</p>
                          <p className="text-sm font-bold text-slate-700">{cp.time}</p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Seats Occupied</p>
                          <p className="text-sm font-bold text-slate-700">{cp.joined} / {cp.max}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-10 pt-8 border-t border-slate-50 flex items-center justify-between">
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contribution</p>
                        <p className="text-xl font-black text-blue-600">₹{Math.ceil(cp.totalPrice / (cp.joined || 1))}<span className="text-xs font-bold text-slate-300">/pp</span></p>
                      </div>
                      {cp.status === 'OPEN' && cp.author !== userId && !hasJoined && (
                        <button 
                          onClick={() => onJoinCarpool?.(cp.id)}
                          className="bg-slate-900 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl active:scale-[0.95] transition-all"
                        >
                          Join Fleet ❯
                        </button>
                      )}
                      {hasJoined && cp.author !== userId && (
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest border border-emerald-100 px-4 py-2 rounded-xl bg-emerald-50">Fleet Member</span>
                      )}
                      {cp.author === userId && (
                        <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest border border-indigo-100 px-4 py-2 rounded-xl">Your Ride</span>
                      )}
                    </div>
                  </motion.div>
                );
              }) : (
                <div className="col-span-full py-40 bg-slate-50/50 border-2 border-dashed border-slate-100 rounded-[64px] flex flex-col items-center justify-center">
                   <span className="text-6xl grayscale mb-6 opacity-20">🚗</span>
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em]">No active transit nodes detected</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {createPortal(
        <AnimatePresence>
          {selectedAnnouncement && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-3xl flex items-center justify-center p-6"
              onClick={() => setSelectedAnnouncement(null)}
            >
              <motion.div className="bg-white rounded-[56px] w-full max-w-2xl overflow-hidden shadow-2xl p-16 space-y-10" onClick={e => e.stopPropagation()}>
                <div className="border-b border-slate-50 pb-10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full uppercase tracking-widest">Registry ID: {selectedAnnouncement.id}</span>
                    <span className="text-[11px] font-black text-slate-400 uppercase">{selectedAnnouncement.date}</span>
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 tracking-tighter">{selectedAnnouncement.title}</h3>
                </div>
                <p className="text-xl font-bold text-slate-700 leading-relaxed italic border-l-4 border-indigo-100 pl-8">{selectedAnnouncement.content}</p>
                <div className="bg-slate-50 p-8 rounded-[32px] space-y-4">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Elaboration</p>
                   <p className="text-slate-600 leading-relaxed text-lg">{selectedAnnouncement.elaboration}</p>
                </div>
                <button onClick={() => setSelectedAnnouncement(null)} className="w-full bg-[#5b5fc7] text-white py-6 rounded-[24px] font-black uppercase tracking-widest">Close Registry ❯</button>
              </motion.div>
            </motion.div>
          )}

          {isComposing && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-3xl flex items-center justify-center p-6"
              onClick={() => setIsComposing(false)}
            >
              <motion.div className="bg-white rounded-[56px] w-full max-w-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                <form onSubmit={handlePostAnnouncement} className="p-16 space-y-10">
                  <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Initialize Broadcast</h3>
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-base font-bold text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Title" value={composeData.title} onChange={e => setComposeData({...composeData, title: e.target.value})} />
                       <select className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-bold" value={composeData.targetAudience} onChange={e => setComposeData({...composeData, targetAudience: e.target.value as any})}>
                          <option value="GLOBAL">Global Audience</option>
                          <option value="STUDENT">All Students</option>
                          <option value="FACULTY">All Faculty</option>
                       </select>
                    </div>
                    {composeData.targetAudience === 'STUDENT' && (
                      <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Optional Semester Target</label>
                           <select className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5" value={composeData.targetSemester} onChange={e => setComposeData({...composeData, targetSemester: e.target.value ? parseInt(e.target.value) : undefined})}>
                              <option value="">Full Student Body</option>
                              {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s} Students</option>)}
                           </select>
                        </div>
                        <div className="space-y-3">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Target Specific ID (b2XYYY)</label>
                           <input 
                              className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 text-sm font-bold uppercase" 
                              placeholder="e.g. B25001" 
                              value={composeData.targetUserId} 
                              onChange={e => setComposeData({...composeData, targetUserId: e.target.value})} 
                           />
                        </div>
                      </div>
                    )}
                    <textarea className="w-full bg-slate-50 border border-slate-100 rounded-[32px] px-8 py-6 text-base h-40 resize-none outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Message content..." value={composeData.content} onChange={e => setComposeData({...composeData, content: e.target.value})} />
                  </div>
                  <button type="submit" className="w-full bg-[#5b5fc7] text-white py-6 rounded-[24px] font-black uppercase tracking-widest shadow-xl">Transmit to Registry ❯</button>
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
