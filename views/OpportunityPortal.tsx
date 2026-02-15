
import React, { useState, useRef } from 'react';
import { Opportunity } from '../types';
import { geminiService } from '../services/geminiService';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_OPPS: Opportunity[] = [
  { id: '1', title: 'Summer Software Intern', company: 'Google', type: 'INTERNSHIP', location: 'Mountain View, CA', deadline: '2025-12-15', tags: ['Java', 'Cloud', 'Remote-friendly'] },
  { id: '2', title: 'NLP Research Assistant', company: 'Campus AI Lab', type: 'RESEARCH', location: 'On-campus', deadline: '2025-11-20', tags: ['Python', 'PyTorch', 'Research'] },
  { id: '3', title: 'Frontend Developer', company: 'FinTech Startup', type: 'INTERNSHIP', location: 'Remote', deadline: '2025-12-01', tags: ['React', 'TypeScript', 'Tailwind'] },
  { id: '4', title: 'Junior SDE (Product)', company: 'Amazon', type: 'JOB', location: 'Bangalore, IN', deadline: '2026-01-10', tags: ['AWS', 'Distributed Systems'] },
  { id: '5', title: 'Himalayan Climate Study', company: 'IIT Mandi Research', type: 'RESEARCH', location: 'Kamand Valley', deadline: '2025-11-30', tags: ['DATA SCIENCE', 'CLIMATE'] },
  { id: '6', title: 'Full Stack Engineer', company: 'Microsoft', type: 'JOB', location: 'Hyderabad, IN', deadline: '2026-02-15', tags: ['AZURE', 'C#', '.NET'] },
];

type OpportunityType = 'ALL' | 'INTERNSHIP' | 'JOB' | 'RESEARCH';

export const OpportunityPortal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [activeFilter, setActiveFilter] = useState<OpportunityType>('ALL');
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleGetSuggestions = async () => {
    setLoading(true);
    const suggestions = await geminiService.suggestOpportunities("3rd year CS student, proficient in React, interested in machine learning and distributed systems");
    setAiSuggestions(suggestions);
    setLoading(false);
  };

  const scrollToResults = (filter: OpportunityType) => {
    setActiveFilter(filter);
    // Timeout to ensure state transition doesn't conflict with immediate scroll
    setTimeout(() => {
      const element = document.getElementById('opportunities-display-grid');
      if (element) {
        const offset = 80; // Offset for header
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = element.getBoundingClientRect().top;
        const elementPosition = elementRect - bodyRect;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  };

  const filteredOpps = activeFilter === 'ALL' 
    ? MOCK_OPPS 
    : MOCK_OPPS.filter(opp => opp.type === activeFilter);

  const getSectionTitle = () => {
    switch (activeFilter) {
      case 'INTERNSHIP': return 'Internship Portals';
      case 'JOB': return 'Career Opportunities';
      case 'RESEARCH': return 'Research Initiatives';
      default: return 'Unified Career Ecosystem';
    }
  };

  return (
    <div className="space-y-12 pb-20 px-4 md:px-0">
      {/* Professional Hero Section */}
      <section className="relative overflow-hidden rounded-[40px] bg-slate-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 p-10 md:p-16 lg:flex items-center gap-12">
          <div className="lg:w-2/3 space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Career Development Center
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
              Career & Research <br />
              <span className="text-blue-500">Acceleration Program</span>
            </h2>
            
            <p className="text-slate-400 text-sm md:text-lg leading-relaxed max-w-2xl font-medium">
              A unified ecosystem for students to discover specialized research, elite internships, and global career hubs. Synchronize your profile with institutional needs.
            </p>

            <div className="flex flex-wrap gap-10 pt-4">
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white font-mono">240+</span>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Active Roles</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white font-mono">15</span>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Research Labs</span>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black text-white font-mono">42</span>
                <span className="text-[10px] text-slate-500 uppercase font-black tracking-[0.2em]">Industry Partners</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/3">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-[32px] p-8 space-y-6">
              <h4 className="text-sm font-black text-slate-300 flex items-center gap-3 uppercase tracking-widest">
                <span>⚡</span> Trending Fields
              </h4>
              <div className="space-y-3">
                {['Quantum Computing', 'Sustainable Energy', 'FinTech Analytics', 'Robotics'].map(field => (
                  <div key={field} className="flex justify-between items-center p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group cursor-default border border-transparent hover:border-white/10">
                    <span className="text-xs font-bold text-slate-400">{field}</span>
                    <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full group-hover:bg-blue-500 group-hover:text-white transition-all uppercase">Active</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Tracks (The "Boxes") */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { id: 'INTERNSHIP', label: 'Internships', icon: '💼', count: '142', color: 'blue', desc: 'Summer and winter industrial training programs.' },
          { id: 'JOB', label: 'Job Opportunities', icon: '🚀', count: '84', color: 'indigo', desc: 'Full-time placements with institutional partners.' },
          { id: 'RESEARCH', label: 'Research Projects', icon: '🔬', count: '29', color: 'purple', desc: 'Faculty-led academic exploration and innovation.' },
        ].map((track) => (
          <motion.div
            key={track.id}
            onClick={() => scrollToResults(track.id as OpportunityType)}
            whileHover={{ y: -8, boxShadow: "0 20px 50px rgba(0,0,0,0.06)" }}
            className="bg-white border border-slate-100 p-8 rounded-[40px] shadow-sm flex flex-col gap-6 group transition-all cursor-pointer"
          >
            <div className={`w-16 h-16 rounded-3xl bg-${track.color}-50 flex items-center justify-center text-3xl group-hover:bg-${track.color}-600 group-hover:text-white transition-all duration-500`}>
              {track.icon}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">{track.label}</h4>
                <span className={`text-sm font-black text-${track.color}-600 font-mono`}>{track.count}</span>
              </div>
              <p className="text-sm text-slate-400 font-medium leading-relaxed">{track.desc}</p>
            </div>
            <button className={`mt-auto w-full py-4 rounded-2xl border border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:bg-${track.color}-600 group-hover:text-white group-hover:border-transparent transition-all`}>
              Access Domain Portals ❯
            </button>
          </motion.div>
        ))}
      </section>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-10 rounded-[40px] border border-slate-100 shadow-sm" id="opportunities-display-grid">
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => scrollToResults('ALL')}
            className={`${activeFilter === 'ALL' ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-50 text-slate-500'} px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all active:scale-95 border border-transparent`}
          >
            All Portals
          </button>
          <button 
            onClick={() => scrollToResults('INTERNSHIP')}
            className={`${activeFilter === 'INTERNSHIP' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-white text-slate-500'} px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-100 shadow-sm`}
          >
            Internships
          </button>
          <button 
            onClick={() => scrollToResults('JOB')}
            className={`${activeFilter === 'JOB' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white text-slate-500'} px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-100 shadow-sm`}
          >
            Jobs
          </button>
          <button 
            onClick={() => scrollToResults('RESEARCH')}
            className={`${activeFilter === 'RESEARCH' ? 'bg-purple-600 text-white shadow-lg shadow-purple-200' : 'bg-white text-slate-500'} px-8 py-3.5 rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-slate-50 transition-all border border-slate-100 shadow-sm`}
          >
            Research Roles
          </button>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-96">
            <span className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 text-lg">🔍</span>
            <input 
              type="text" 
              placeholder="Search roles, labs, or tech stack..." 
              className="w-full border border-slate-100 bg-slate-50/50 rounded-[20px] pl-14 pr-6 py-4 text-sm font-bold focus:ring-4 focus:ring-blue-500/5 outline-none transition-all placeholder:text-slate-300"
            />
          </div>
          <button className="bg-white border border-slate-100 text-slate-600 w-14 h-14 rounded-[20px] font-bold hover:bg-slate-50 shadow-sm transition-all flex items-center justify-center shrink-0">
            ⚙️
          </button>
        </div>
      </div>

      <div className="space-y-12" ref={resultsRef}>
        {/* Animated Title Section */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeFilter}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="border-b border-slate-100 pb-8 px-4"
          >
            <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">
              {getSectionTitle()}
            </h3>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] mt-3">
              Portal Sync Active • Found {filteredOpps.length} Results
            </p>
          </motion.div>
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredOpps.length > 0 ? filteredOpps.map(opp => (
              <div key={opp.id} className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-200 transition-all group flex flex-col relative overflow-hidden">
                <div className="flex justify-between items-start mb-10">
                  <div className="w-20 h-20 bg-slate-50 rounded-[30px] flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                    <span className="text-4xl">{opp.type === 'INTERNSHIP' ? '💼' : (opp.type === 'JOB' ? '🚀' : '🔬')}</span>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${
                      opp.type === 'INTERNSHIP' ? 'bg-blue-50 text-blue-600 border-blue-100' : 
                      (opp.type === 'JOB' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-purple-50 text-purple-600 border-purple-100')
                    }`}>
                      {opp.type}
                    </span>
                    <p className="text-[10px] font-black text-slate-300 uppercase mt-2 tracking-tight">DUE {opp.deadline}</p>
                  </div>
                </div>

                <div className="mb-10">
                  <h4 className="text-3xl font-black text-slate-800 mb-1 group-hover:text-blue-600 transition-colors tracking-tight leading-[1.1]">{opp.title}</h4>
                  <p className="text-blue-600 font-black text-base uppercase tracking-widest">{opp.company}</p>
                </div>
                
                <div className="flex items-center gap-3 mb-10 text-slate-500">
                  <span className="text-sm font-bold flex items-center gap-2">
                    <span className="text-red-500">📍</span> {opp.location}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {opp.tags.map(tag => (
                    <span key={tag} className="text-[10px] bg-slate-50 text-slate-400 px-4 py-2 rounded-2xl font-black border border-slate-50 group-hover:bg-white group-hover:border-blue-100 transition-all uppercase tracking-tight">{tag}</span>
                  ))}
                </div>

                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 -mr-16 -mt-16 rounded-full scale-0 group-hover:scale-150 transition-transform duration-700" />
              </div>
            )) : (
              <div className="col-span-full py-32 text-center bg-slate-50 rounded-[48px] border border-dashed border-slate-200">
                <span className="text-6xl opacity-20 block mb-6">🔍</span>
                <p className="text-[11px] font-black uppercase tracking-[0.4em] text-slate-400">No synchronized results found for this filter</p>
              </div>
            )}
            
            <button className="bg-slate-50/30 border-2 border-dashed border-slate-100 p-8 rounded-[48px] text-slate-400 font-black hover:border-blue-200 hover:text-blue-500 hover:bg-white transition-all flex flex-col items-center justify-center gap-6 min-h-[400px]">
               <span className="text-6xl opacity-20">📤</span>
               <span className="text-[11px] uppercase tracking-[0.3em] max-w-[150px]">Synchronize Additional Resources</span>
            </button>
          </div>

          <div className="space-y-8">
            <div className="bg-slate-900 rounded-[48px] p-10 text-white overflow-hidden relative shadow-2xl">
              <h4 className="text-lg font-black mb-6 flex items-center gap-3 uppercase tracking-widest">
                <span className="animate-pulse">✨</span> AI Matchmaker
              </h4>
              <p className="text-slate-400 text-sm leading-relaxed mb-8 font-medium">
                Our neural matching engine analyzes your academic record, skill set, and past projects to suggest precision-matched opportunities.
              </p>
              <button 
                onClick={handleGetSuggestions}
                disabled={loading}
                className="w-full bg-blue-600 py-6 rounded-3xl font-black text-[11px] uppercase tracking-[0.2em] hover:bg-blue-500 transition-all disabled:opacity-50 shadow-xl shadow-blue-600/20 active:scale-[0.98]"
              >
                {loading ? 'Analyzing Profile...' : 'Sync Recommendations'}
              </button>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-600/10 blur-3xl rounded-full" />
            </div>

            {aiSuggestions.length > 0 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] px-4">Top Career Matches</h5>
                {aiSuggestions.map((s, i) => (
                  <div key={i} className="bg-white p-8 rounded-[32px] border border-blue-100 shadow-sm hover:shadow-xl transition-all relative overflow-hidden group">
                    <div className="relative z-10">
                      <p className="text-base font-black text-slate-800 mb-2 group-hover:text-blue-600 transition-colors tracking-tight leading-tight">{s.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-bold">{s.description}</p>
                    </div>
                    <div className="absolute left-0 top-0 h-full w-1.5 bg-blue-500 rounded-full" />
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm">
              <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.3em] mb-10">Application Health</h4>
              <div className="space-y-8">
                {[
                  { label: 'In Review', value: 3, color: 'bg-blue-500' },
                  { label: 'Shortlisted', value: 1, color: 'bg-emerald-500' },
                  { label: 'Interviews', value: 0, color: 'bg-amber-500' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-[11px] font-black uppercase mb-3">
                      <span className="text-slate-400 tracking-widest">{stat.label}</span>
                      <span className="text-slate-800">{stat.value}</span>
                    </div>
                    <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden shadow-inner">
                      <div className={`${stat.color} h-full transition-all duration-1000`} style={{ width: `${stat.value * 20}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
