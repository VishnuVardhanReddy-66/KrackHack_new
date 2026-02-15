
import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Opportunity } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const COLLEGE_OPPS: Opportunity[] = [
  { id: '1', title: 'Summer Research Fellowship', company: 'IIT Mandi Research Office', type: 'RESEARCH', location: 'Kamand Valley', deadline: '2026-03-15', tags: ['STIPEND', 'HIMALAYAN STUDIES'] },
  { id: '2', title: 'SDE Intern - Summer 2026', company: 'CDC - Institutional Partner', type: 'INTERNSHIP', location: 'Bangalore / Remote', deadline: '2026-04-10', tags: ['PLACEMENT UNIT', 'TECH'] },
  { id: '3', title: 'Winter Industrial Training', company: 'Partner Manufacturing Hub', type: 'INTERNSHIP', location: 'Chandigarh', deadline: '2025-11-20', tags: ['CORE ENGINEERING'] },
  { id: '4', title: 'Junior Scientist (ML)', company: 'AI Lab, South Campus', type: 'RESEARCH', location: 'Kamand Valley', deadline: '2026-05-01', tags: ['FACULTY LED', 'AI/ML'] },
  { id: '5', title: 'Institutional SDE-1 Role', company: 'Placement Cell - Tech Corp', type: 'JOB', location: 'Pune', deadline: '2026-01-15', tags: ['FULL TIME', 'INSTITUTIONAL'] },
  { id: '6', title: 'Sustainability Analyst', company: 'IIT Mandi Green Office', type: 'JOB', location: 'Kamand Valley', deadline: '2026-02-10', tags: ['CAMPUS ROLE'] },
];

type OpportunityType = 'ALL' | 'INTERNSHIP' | 'JOB' | 'RESEARCH';
type AppStatus = 'PENDING' | 'APPROVED' | 'NOT_APPLIED';

export const OpportunityPortal: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<OpportunityType>('ALL');
  const [applicationStates, setApplicationStates] = useState<Record<string, AppStatus>>({});
  const [selectedOpp, setSelectedOpp] = useState<Opportunity | null>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedOpp) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedOpp]);

  const filterTo = (filter: OpportunityType) => {
    setActiveFilter(filter);
    if (resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleApply = (id: string) => {
    setApplicationStates(prev => ({
      ...prev,
      [id]: 'PENDING'
    }));
    // Close modal after application or stay to show status? Let's stay to show status.
  };

  const filteredOpps = activeFilter === 'ALL' 
    ? COLLEGE_OPPS 
    : COLLEGE_OPPS.filter(opp => opp.type === activeFilter);

  const getSectionTitle = () => {
    switch (activeFilter) {
      case 'INTERNSHIP': return 'Institutional Internships';
      case 'JOB': return 'Full-time Placements';
      case 'RESEARCH': return 'Faculty Research Hub';
      default: return 'College Career Ecosystem';
    }
  };

  return (
    <div className="space-y-16 pb-32 px-4 md:px-0 animate-in fade-in duration-700">
      {/* Institutional Hero Section */}
      <section className="space-y-4">
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.5em] ml-1">Career Development Center</p>
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 leading-none">
          Institutional Career Hub
        </h2>
        <p className="text-slate-400 text-lg max-w-3xl font-medium leading-relaxed">
          Access specialized opportunities exclusively curated for students of IIT Mandi. Coordinate with the placement cell and research labs through a unified gateway.
        </p>
      </section>

      {/* Main Track Selection */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Internships Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-white p-10 rounded-[48px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-8 transition-all"
        >
          <div className="w-20 h-20 bg-[#FDF4F2] rounded-[32px] flex items-center justify-center text-4xl">
            💼
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">INTERNSHIPS</h4>
              <span className="text-lg font-black text-blue-600 font-mono">142</span>
            </div>
            <p className="text-base text-slate-400 font-medium leading-relaxed">
              Summer and winter industrial training programs.
            </p>
          </div>
          <button 
            onClick={() => filterTo('INTERNSHIP')}
            className="w-full py-5 rounded-2xl border border-slate-100 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all mt-4"
          >
            ACCESS DOMAIN PORTALS ❯
          </button>
        </motion.div>

        {/* Job Opportunities Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-white p-10 rounded-[48px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-8 transition-all"
        >
          <div className="w-20 h-20 bg-[#F2F7FD] rounded-[32px] flex items-center justify-center text-4xl">
            🚀
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">JOB OPPORTUNITIES</h4>
              <span className="text-lg font-black text-blue-600 font-mono">84</span>
            </div>
            <p className="text-base text-slate-400 font-medium leading-relaxed">
              Full-time placements with institutional partners.
            </p>
          </div>
          <button 
            onClick={() => filterTo('JOB')}
            className="w-full py-5 rounded-2xl border border-slate-100 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all mt-4"
          >
            ACCESS DOMAIN PORTALS ❯
          </button>
        </motion.div>

        {/* Research Projects Card */}
        <motion.div
          whileHover={{ y: -10 }}
          className="bg-white p-10 rounded-[48px] shadow-[0_10px_40px_rgba(0,0,0,0.03)] border border-slate-50 flex flex-col gap-8 transition-all"
        >
          <div className="w-20 h-20 bg-[#F9F2FD] rounded-[32px] flex items-center justify-center text-4xl">
            🔬
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <h4 className="text-2xl font-black text-slate-800 tracking-tight">RESEARCH PROJECTS</h4>
              <span className="text-lg font-black text-blue-600 font-mono">29</span>
            </div>
            <p className="text-base text-slate-400 font-medium leading-relaxed">
              Faculty-led academic exploration and innovation.
            </p>
          </div>
          <button 
            onClick={() => filterTo('RESEARCH')}
            className="w-full py-5 rounded-2xl border border-slate-100 text-[11px] font-black uppercase tracking-[0.15em] text-slate-400 hover:bg-slate-50 hover:text-blue-600 transition-all mt-4"
          >
            ACCESS DOMAIN PORTALS ❯
          </button>
        </motion.div>
      </section>

      {/* Results Section */}
      <div className="space-y-12 pt-10" ref={resultsRef}>
        <div className="flex justify-between items-end border-b border-slate-100 pb-8 px-4">
          <div>
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">
              {getSectionTitle()}
            </h3>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mt-3">
              Official Registry • {filteredOpps.length} Active Listings
            </p>
          </div>
          {activeFilter !== 'ALL' && (
            <button 
              onClick={() => setActiveFilter('ALL')}
              className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline"
            >
              Clear Filter ↺
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOpps.map(opp => {
            const status = applicationStates[opp.id] || 'NOT_APPLIED';
            return (
              <div 
                key={opp.id} 
                onClick={() => setSelectedOpp(opp)}
                className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-xl transition-all group flex flex-col relative overflow-hidden cursor-pointer"
              >
                <div className="flex justify-between items-start mb-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-[24px] flex items-center justify-center text-3xl group-hover:bg-blue-50 transition-colors">
                    {opp.type === 'INTERNSHIP' ? '💼' : (opp.type === 'JOB' ? '🚀' : '🔬')}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                      opp.type === 'INTERNSHIP' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      (opp.type === 'JOB' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-purple-50 text-purple-600 border-purple-100')
                    }`}>
                      {opp.type}
                    </span>
                    {status !== 'NOT_APPLIED' && (
                      <motion.span 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className={`text-[8px] font-black px-3 py-1 border rounded-full uppercase tracking-widest ${
                          status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                        }`}
                      >
                        {status === 'APPROVED' ? 'Approved' : 'Pending'}
                      </motion.span>
                    )}
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="text-2xl font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">{opp.title}</h4>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">{opp.company}</p>
                </div>
                
                <div className="flex items-center gap-2 mb-8 text-slate-400">
                  <span className="text-xs font-bold flex items-center gap-1.5">
                    <span className="text-red-400 opacity-60">📍</span> {opp.location}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-10">
                  {opp.tags.map(tag => (
                    <span key={tag} className="text-[9px] bg-slate-50 text-slate-400 px-3 py-1.5 rounded-xl font-black uppercase tracking-tight">{tag}</span>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">DUE {opp.deadline}</span>
                  <span className="text-blue-600 font-black text-[10px] uppercase tracking-widest group-hover:underline">
                    {status === 'NOT_APPLIED' ? 'View & Apply' : 'Check Status ❯'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DETAIL MODAL VIA PORTAL */}
      {createPortal(
        <AnimatePresence>
          {selectedOpp && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-3xl flex items-center justify-center p-6"
              onClick={() => setSelectedOpp(null)}
            >
              <motion.div 
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
                className="bg-white rounded-[48px] w-full max-w-4xl overflow-hidden shadow-2xl max-h-[90vh] overflow-y-auto custom-scrollbar"
                onClick={e => e.stopPropagation()}
              >
                <div className="p-12 md:p-16 space-y-12">
                  {/* Modal Header */}
                  <div className="flex justify-between items-start">
                    <div className="space-y-6">
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-black px-5 py-2 rounded-full uppercase tracking-widest border ${
                          selectedOpp.type === 'INTERNSHIP' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                          (selectedOpp.type === 'JOB' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-purple-50 text-purple-600 border-purple-100')
                        }`}>
                          {selectedOpp.type} Domain
                        </span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Institutional Portal</span>
                      </div>
                      <h3 className="text-5xl font-black text-slate-800 tracking-tighter leading-none">{selectedOpp.title}</h3>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl">🏛️</div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Authorized Provider</p>
                            <p className="text-xl font-bold text-slate-700">{selectedOpp.company}</p>
                         </div>
                      </div>
                    </div>
                    <button onClick={() => setSelectedOpp(null)} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-800 transition-all text-xl">✕</button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12 pt-8 border-t border-slate-50">
                    {/* Left: Detailed Info */}
                    <div className="md:col-span-2 space-y-10">
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Opportunity Overview</h4>
                        <p className="text-slate-600 leading-relaxed font-medium text-lg">
                          This institutional program is hosted by {selectedOpp.company} in coordination with the Career Development Center. It offers participants direct exposure to {selectedOpp.tags.join(' and ')} environments, specifically tailored for the IIT Mandi curriculum.
                        </p>
                        <p className="text-slate-500 leading-relaxed font-medium">
                          Selected candidates will work under faculty supervision or corporate mentors. Key responsibilities include technical development, data analysis, and report synchronization with the academic vault.
                        </p>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-slate-900 uppercase tracking-widest">Key Requirements</h4>
                        <ul className="space-y-3">
                          {['Minimum CGPA of 7.5', 'No active disciplinary records', 'Endorsement from Department HOD', 'Commitment for the full duration'].map((req, i) => (
                            <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                              <span className="w-2 h-2 bg-blue-500 rounded-full" />
                              {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Right: Actions & Status */}
                    <div className="space-y-8">
                       <div className="bg-slate-50 p-8 rounded-[32px] border border-slate-100 space-y-6">
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Protocol</p>
                             {applicationStates[selectedOpp.id] === 'PENDING' ? (
                               <div className="space-y-6">
                                  <div className="flex items-center gap-3">
                                     <span className="w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
                                     <span className="text-xl font-black text-slate-800 tracking-tight">Pending Approval</span>
                                  </div>
                                  
                                  {/* Timeline Motif */}
                                  <div className="space-y-4 pt-2">
                                     <div className="flex gap-4 items-start">
                                        <div className="w-4 h-4 bg-emerald-500 rounded-full flex-shrink-0 mt-1" />
                                        <div>
                                           <p className="text-[11px] font-black text-slate-800 uppercase">Application Received</p>
                                           <p className="text-[9px] font-bold text-slate-400 uppercase">Sync Successful</p>
                                        </div>
                                     </div>
                                     <div className="w-px h-6 bg-slate-200 ml-2" />
                                     <div className="flex gap-4 items-start opacity-40">
                                        <div className="w-4 h-4 bg-slate-300 rounded-full flex-shrink-0 mt-1" />
                                        <div>
                                           <p className="text-[11px] font-black text-slate-800 uppercase">Faculty Review</p>
                                           <p className="text-[9px] font-bold text-slate-400 uppercase">Queue Position: #4</p>
                                        </div>
                                     </div>
                                     <div className="w-px h-6 bg-slate-200 ml-2" />
                                     <div className="flex gap-4 items-start opacity-40">
                                        <div className="w-4 h-4 bg-slate-300 rounded-full flex-shrink-0 mt-1" />
                                        <div>
                                           <p className="text-[11px] font-black text-slate-800 uppercase">Final Adjudication</p>
                                           <p className="text-[9px] font-bold text-slate-400 uppercase">CDC Office</p>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                             ) : applicationStates[selectedOpp.id] === 'APPROVED' ? (
                                <div className="space-y-2">
                                   <div className="flex items-center gap-3">
                                      <span className="w-3 h-3 bg-emerald-500 rounded-full" />
                                      <span className="text-xl font-black text-slate-800 tracking-tight">Access Granted</span>
                                   </div>
                                   <p className="text-[11px] font-medium text-slate-500">Your application has been vetted by the institutional review board.</p>
                                </div>
                             ) : (
                                <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                      <span className="w-3 h-3 bg-slate-300 rounded-full" />
                                      <span className="text-xl font-black text-slate-400 tracking-tight">Not Initialized</span>
                                   </div>
                                   <button 
                                      onClick={() => handleApply(selectedOpp.id)}
                                      className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl hover:bg-blue-700 transition-all active:scale-[0.98]"
                                   >
                                      Initialize Apply ❯
                                   </button>
                                </div>
                             )}
                          </div>
                       </div>

                       <div className="p-8 border border-slate-100 rounded-[32px] space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Metadata Sync</p>
                          <div className="space-y-3">
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">Institutional ID</span>
                                <span className="text-xs font-mono font-black text-slate-800">#{selectedOpp.id.padStart(4, '0')}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-500">Portal Deadline</span>
                                <span className="text-xs font-mono font-black text-red-500">{selectedOpp.deadline}</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};
