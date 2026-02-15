
import React, { useState } from 'react';
import { UserRole, Grievance, GrievanceStatus } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface GrievanceViewProps {
  role: UserRole;
  userId: string;
  grievances: Grievance[];
  onAddGrievance: (g: Grievance) => void;
  onUpdateGrievance: (id: string, updates: Partial<Grievance>) => void;
}

export const GrievanceView: React.FC<GrievanceViewProps> = ({ role, userId, grievances, onAddGrievance, onUpdateGrievance }) => {
  const isAdmin = role === UserRole.ADMIN;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [formData, setFormData] = useState({ subCategory: '', description: '' });
  const [adminReply, setAdminReply] = useState<Record<string, string>>({});

  const userGrievances = grievances.filter(g => g.submittedBy === userId);

  const categories = {
    Mess: ['Quality', 'Hygiene', 'Staff'],
    Academic: ['Teacher', 'Course', 'Exam'],
    Hostel: ['Water', 'Internet', 'Maintenance']
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) return;
    const newG: Grievance = {
      id: `C-${Math.floor(100 + Math.random() * 900)}`,
      category: `${activeCategory} - ${formData.subCategory}`,
      description: formData.description,
      status: GrievanceStatus.PENDING,
      submittedBy: userId,
      date: new Date().toISOString().split('T')[0]
    };
    onAddGrievance(newG);
    setFormData({ subCategory: '', description: '' });
    setActiveCategory(null);
  };

  const handleAdminResolve = (id: string, status: GrievanceStatus) => {
    onUpdateGrievance(id, { 
      status, 
      adminComment: adminReply[id] || 'Processed by system administration.' 
    });
  };

  if (isAdmin) {
    return (
      <div className="space-y-12 pb-24 px-4 md:px-0">
        <div className="border-b border-black/5 pb-10">
          <p className="text-purple-600 text-[10px] font-black uppercase tracking-[0.4em]">Administrative Terminal</p>
          <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Grievance Adjudication</h2>
        </div>
        <div className="space-y-8">
          {grievances.map(g => (
            <motion.div key={g.id} layout className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8">
              <div className="flex justify-between items-start">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black bg-purple-600 text-white px-4 py-1 rounded-full uppercase">ID: {g.id}</span>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Origin: {g.submittedBy}</span>
                  </div>
                  <h4 className="text-2xl font-black text-slate-800 tracking-tight uppercase">{g.category}</h4>
                  <p className="text-slate-600 font-medium text-lg leading-relaxed">{g.description}</p>
                </div>
                <span className={`text-[10px] font-black px-6 py-2 rounded-full border ${
                  g.status === GrievanceStatus.RESOLVED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                }`}>
                  {g.status}
                </span>
              </div>

              <div className="bg-slate-50 p-8 rounded-[32px] space-y-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Response</p>
                <textarea 
                  className="w-full bg-white border border-slate-100 rounded-2xl p-6 text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20"
                  placeholder="Enter direct feedback for the user..."
                  value={adminReply[g.id] || g.adminComment || ''}
                  onChange={e => setAdminReply({ ...adminReply, [g.id]: e.target.value })}
                />
                <div className="flex gap-4">
                  <button onClick={() => handleAdminResolve(g.id, GrievanceStatus.RESOLVED)} className="bg-emerald-600 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-emerald-600/20">Authorize Resolution</button>
                  <button onClick={() => handleAdminResolve(g.id, GrievanceStatus.REJECTED)} className="bg-red-500 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Reject Packet</button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-24 px-4 md:px-0">
      <div className="border-b border-black/5 pb-10">
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Resolution Center</p>
        <h2 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Unified Registry</h2>
      </div>

      <section className="bg-white p-12 rounded-[56px] border border-slate-100 shadow-sm space-y-10">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Initialize Transmission</h3>
        <div className="grid grid-cols-3 gap-6">
          {Object.keys(categories).map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] transition-all border ${activeCategory === cat ? 'bg-blue-600 text-white border-blue-600 shadow-xl' : 'bg-slate-50 text-slate-400 border-slate-50'}`}>
              {cat} Hub
            </button>
          ))}
        </div>
        {activeCategory && (
          <form onSubmit={handleSubmit} className="space-y-6 pt-6 animate-in slide-in-from-top-4 duration-300">
            <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-5 text-sm font-bold" value={formData.subCategory} onChange={e => setFormData({ ...formData, subCategory: e.target.value })} required>
              <option value="">Select Sub-Domain</option>
              {(categories as any)[activeCategory].map((sub: string) => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <textarea className="w-full bg-slate-50 border border-slate-100 rounded-3xl p-8 text-sm font-medium h-40 outline-none" placeholder="Describe the protocol error..." value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
            <button type="submit" className="w-full bg-blue-600 text-white py-6 rounded-[24px] font-black uppercase tracking-widest shadow-xl shadow-blue-600/20 active:scale-[0.98]">Transmit Report ❯</button>
          </form>
        )}
      </section>

      <div className="space-y-8">
        <h3 className="text-2xl font-black text-slate-800 tracking-tight uppercase ml-4">Registry History</h3>
        {userGrievances.map(g => (
          <div key={g.id} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-6">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">ID: {g.id} • {g.date}</span>
                <h4 className="text-xl font-black text-slate-800 tracking-tight uppercase">{g.category}</h4>
              </div>
              <span className={`text-[9px] font-black uppercase px-6 py-2 rounded-full border ${
                g.status === GrievanceStatus.RESOLVED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
              }`}>{g.status}</span>
            </div>
            <p className="text-slate-600 font-medium">{g.description}</p>
            {g.adminComment && (
              <div className="bg-blue-50/50 p-6 rounded-[24px] border border-blue-100">
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-2">Admin Protocol Response</p>
                <p className="text-blue-800 font-bold italic">"{g.adminComment}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
