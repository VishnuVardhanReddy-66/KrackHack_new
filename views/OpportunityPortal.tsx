
import React, { useState } from 'react';
import { Opportunity } from '../types';
import { geminiService } from '../services/geminiService';

const MOCK_OPPS: Opportunity[] = [
  { id: '1', title: 'Summer Software Intern', company: 'Google', type: 'INTERNSHIP', location: 'Mountain View, CA', deadline: '2023-12-15', tags: ['Java', 'Cloud', 'Remote-friendly'] },
  { id: '2', title: 'NLP Research Assistant', company: 'Campus AI Lab', type: 'RESEARCH', location: 'On-campus', deadline: '2023-11-20', tags: ['Python', 'PyTorch', 'Research'] },
  { id: '3', title: 'Frontend Developer', company: 'FinTech Startup', type: 'INTERNSHIP', location: 'Remote', deadline: '2023-12-01', tags: ['React', 'TypeScript', 'Tailwind'] },
];

export const OpportunityPortal: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);

  const handleGetSuggestions = async () => {
    setLoading(true);
    const suggestions = await geminiService.suggestOpportunities("3rd year CS student, proficient in React, interested in machine learning and distributed systems");
    setAiSuggestions(suggestions);
    setLoading(false);
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Professional Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />
        
        <div className="relative z-10 p-8 md:p-12 lg:flex items-center gap-12">
          <div className="lg:w-2/3 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Career Development Node
            </div>
            
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Internship & Research <br />
              <span className="text-blue-500">Opportunity Portal</span>
            </h2>
            
            <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl">
              Discover and apply for internships, research positions, and career development opportunities tailored to your academic interests and career goals. Our centralized portal connects students with faculty-led research projects, industry partnerships, and professional experiences. Browse available positions, track your applications, and receive personalized recommendations based on your field of study and skills. Whether you're seeking hands-on research experience, industry internships, or collaborative projects, find opportunities that enhance your academic journey and prepare you for your future career.
            </p>

            <div className="flex flex-wrap gap-8 pt-4">
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-mono">240+</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Active Roles</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-mono">15</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Research Labs</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold text-white font-mono">42</span>
                <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Industry Partners</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/3">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
              <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2">
                <span>⚡</span> Trending Fields
              </h4>
              <div className="space-y-2">
                {['Quantum Computing', 'Sustainable Energy', 'FinTech Analytics', 'Robotics'].map(field => (
                  <div key={field} className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group cursor-default">
                    <span className="text-xs text-slate-400">{field}</span>
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-md group-hover:bg-blue-500 group-hover:text-white transition-all">Hot</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm sticky top-4 z-20">
        <div className="flex flex-wrap gap-2">
          <button className="bg-slate-900 text-white px-5 py-2 rounded-xl font-bold text-xs transition-transform active:scale-95 shadow-lg">All Opportunities</button>
          <button className="bg-slate-50 text-slate-600 px-5 py-2 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all border border-slate-100">Internships</button>
          <button className="bg-slate-50 text-slate-600 px-5 py-2 rounded-xl font-bold text-xs hover:bg-slate-100 transition-all border border-slate-100">Research Roles</button>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
            <input 
              type="text" 
              placeholder="Search roles, companies, or tech stack..." 
              className="w-full border border-slate-200 bg-slate-50 rounded-xl pl-9 pr-4 py-2 text-xs focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
          <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-xl font-bold text-xs hover:bg-slate-50 shadow-sm transition-all">Filter</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_OPPS.map(opp => (
            <div key={opp.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group flex flex-col relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-slate-50 p-4 rounded-2xl group-hover:bg-blue-50 transition-colors">
                  <span className="text-3xl">{opp.type === 'INTERNSHIP' ? '💼' : '🔬'}</span>
                </div>
                <div className="text-right">
                  <span className={`text-[9px] font-black px-2 py-1 rounded-full uppercase tracking-tighter ${
                    opp.type === 'INTERNSHIP' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                  }`}>
                    {opp.type}
                  </span>
                  <p className="text-[10px] font-bold text-slate-400 uppercase mt-2">Due {opp.deadline}</p>
                </div>
              </div>

              <h4 className="text-xl font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{opp.title}</h4>
              <p className="text-blue-600 font-bold text-sm mb-4">{opp.company}</p>
              
              <div className="flex items-center gap-2 mb-6 text-slate-500">
                <span className="text-xs flex items-center gap-1">📍 {opp.location}</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-8">
                {opp.tags.map(tag => (
                  <span key={tag} className="text-[10px] bg-slate-50 text-slate-600 px-2.5 py-1 rounded-lg font-bold border border-slate-100 group-hover:bg-white group-hover:border-blue-100 transition-all">{tag}</span>
                ))}
              </div>

              <div className="mt-auto pt-6 border-t border-slate-100">
                <button className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-all shadow-md">
                  Launch Application
                </button>
              </div>
              
              {/* Card Decoration */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 -mr-12 -mt-12 rounded-full scale-0 group-hover:scale-100 transition-transform duration-500" />
            </div>
          ))}
          
          <button className="bg-white border-2 border-dashed border-slate-200 p-6 rounded-2xl text-slate-400 font-bold hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/30 transition-all flex flex-col items-center justify-center gap-2 min-h-[300px]">
             <span className="text-4xl opacity-50">📤</span>
             <span>Load More Opportunities</span>
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-900 rounded-3xl p-6 text-white overflow-hidden relative shadow-2xl">
            <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span className="animate-pulse">✨</span> AI Matchmaker
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed mb-6">
              Our neural matching engine analyzes your academic record, skill set, and past projects to suggest precision-matched opportunities.
            </p>
            <button 
              onClick={handleGetSuggestions}
              disabled={loading}
              className="w-full bg-blue-600 py-3.5 rounded-xl font-bold hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
            >
              {loading ? 'Analyzing Profile...' : 'Sync Recommendations'}
            </button>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-blue-600/20 blur-3xl rounded-full" />
          </div>

          {aiSuggestions.length > 0 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-8 duration-500">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Top Career Matches</h5>
              {aiSuggestions.map((s, i) => (
                <div key={i} className="bg-white p-5 rounded-2xl border border-blue-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="relative z-10">
                    <p className="text-sm font-extrabold text-slate-800 mb-1.5 group-hover:text-blue-600 transition-colors">{s.title}</p>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{s.description}</p>
                  </div>
                  <div className="absolute left-0 top-0 h-full w-1 bg-blue-500 rounded-full" />
                </div>
              ))}
            </div>
          )}

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-4">Application Health</h4>
            <div className="space-y-4">
              {[
                { label: 'In Review', value: 3, color: 'bg-blue-500' },
                { label: 'Shortlisted', value: 1, color: 'bg-emerald-500' },
                { label: 'Interviews', value: 0, color: 'bg-amber-500' },
              ].map(stat => (
                <div key={stat.label}>
                  <div className="flex justify-between text-[10px] font-bold mb-1.5">
                    <span className="text-slate-500">{stat.label}</span>
                    <span className="text-slate-900">{stat.value}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div className={`${stat.color} h-full transition-all`} style={{ width: `${stat.value * 20}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
