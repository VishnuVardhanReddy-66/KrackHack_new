
import React, { useState } from 'react';
import { UserRole, Grievance, GrievanceStatus } from '../types';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence, Variants } from 'framer-motion';

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0, filter: 'blur(5px)' },
  visible: { 
    y: 0, 
    opacity: 1,
    filter: 'blur(0px)',
    transition: { type: "spring", stiffness: 100, damping: 20 }
  }
};

export const GrievanceView: React.FC<{ role: UserRole }> = ({ role }) => {
  const [grievances, setGrievances] = useState<Grievance[]>([
    {
      id: 'G-74291',
      title: 'Lab AC malfunctioning',
      description: 'The air conditioning in Lab 402 has been leaking and making loud noises for 3 days.',
      category: 'Infrastructure',
      status: GrievanceStatus.PENDING,
      submittedBy: 'Alex Johnson',
      submittedDate: '2023-10-24'
    }
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    studentName: '',
    rollNumber: '',
    department: 'CSE',
    complaintType: 'Academic',
    priority: 'Medium',
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const complaintId = `G-${Math.floor(10000 + Math.random() * 90000)}`;
    const newG: Grievance = {
      id: complaintId,
      title: `${formData.complaintType} Issue`,
      description: formData.description,
      category: formData.complaintType,
      status: GrievanceStatus.PENDING,
      submittedBy: formData.studentName,
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setGrievances([newG, ...grievances]);
    setShowForm(false);
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-16"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-black/5 pb-10">
        <div className="space-y-2">
          <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Secure Portal</p>
          <h2 className="text-4xl font-black text-[#1d1d1f] tracking-tight">Grievance Redressal</h2>
          <p className="text-[#86868b] text-sm">Direct encrypted channel for campus concerns.</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="px-8 py-3 bg-[#1d1d1f] text-white rounded-full font-bold text-xs shadow-lg hover:bg-black transition-all"
        >
          {showForm ? 'Cancel Report' : 'Submit Grievance'}
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {showForm ? (
          <motion.div 
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="bento-card p-12 max-w-4xl mx-auto space-y-12 shadow-2xl border-none"
          >
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-[#1d1d1f] tracking-tight">Report Details</h3>
              <p className="text-[#86868b] text-xs font-medium uppercase tracking-widest">Node Node: IITM-SEC-01</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">Identity</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#f5f5f7] border border-black/5 rounded-xl px-5 py-4 text-[#1d1d1f] focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold placeholder:text-[#d2d2d7]"
                    placeholder="Full Name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">Node ID</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#f5f5f7] border border-black/5 rounded-xl px-5 py-4 text-[#1d1d1f] focus:ring-2 focus:ring-blue-500 outline-none transition-all font-mono font-bold placeholder:text-[#d2d2d7]"
                    placeholder="B21001"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">Detailed Disclosure</label>
                <textarea 
                  rows={6}
                  className="w-full bg-[#f5f5f7] border border-black/5 rounded-2xl px-6 py-6 text-[#1d1d1f] focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium leading-relaxed placeholder:text-[#d2d2d7]"
                  placeholder="Explain the anomaly..."
                  required
                />
              </div>

              <button className="w-full py-5 bg-blue-600 text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] shadow-lg hover:bg-blue-500 transition-all">
                Transmit Protocol
              </button>
            </form>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <p className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.3em] font-mono">HISTORY LOGS</p>
              {grievances.map(g => (
                <motion.div 
                  key={g.id} 
                  variants={itemVariants}
                  whileHover={{ scale: 1.01 }}
                  className="bento-card p-10 group"
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black font-mono text-blue-600 uppercase tracking-widest">{g.id}</span>
                      <h4 className="text-xl font-bold text-[#1d1d1f] tracking-tight">{g.title}</h4>
                    </div>
                    <span className="px-3 py-1 bg-[#f5f5f7] text-[#1d1d1f] border border-black/5 rounded-full text-[9px] font-black uppercase tracking-widest">
                      {g.status}
                    </span>
                  </div>
                  <p className="text-[#6e6e73] text-sm leading-relaxed italic line-clamp-2">{g.description}</p>
                  
                  <div className="mt-8 pt-8 border-t border-black/5 flex justify-between items-center">
                    <div className="flex gap-8">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-[#86868b] uppercase tracking-widest">SUBMITTED</p>
                        <p className="text-[11px] font-bold text-[#1d1d1f]">{g.submittedBy}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-[#86868b] uppercase tracking-widest">TIMESTAMP</p>
                        <p className="text-[11px] font-bold text-[#1d1d1f]">{g.submittedDate}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Inspect</button>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="space-y-8">
              <motion.div variants={itemVariants} className="bento-card p-10 bg-[#f5f5f7]/50 space-y-6">
                <h4 className="text-sm font-black text-[#1d1d1f] uppercase tracking-tight">Track Report</h4>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="G-XXXXX" 
                    className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 text-sm font-mono focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <button className="w-full bg-[#1d1d1f] text-white py-3 rounded-xl text-[10px] font-black uppercase tracking-widest">Verify</button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="bento-card p-10 space-y-6">
                <h4 className="text-[10px] font-black text-[#86868b] uppercase tracking-[0.2em]">DIRECTIVES</h4>
                <div className="space-y-6">
                  {['Academic Cell', 'Hostel Office', 'Dean SW'].map(cell => (
                    <div key={cell} className="flex justify-between items-center">
                      <span className="text-xs font-bold text-[#1d1d1f]">{cell}</span>
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full shadow-[0_0_6px_rgba(34,197,94,0.3)]" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
