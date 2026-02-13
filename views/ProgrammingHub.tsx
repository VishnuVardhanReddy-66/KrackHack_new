
import React, { useState, useEffect } from 'react';
import { Contest } from '../types';
import { contestService } from '../services/contestService';

/**
 * High-precision countdown component that updates every second
 */
const PreciseCountdown: React.FC<{ targetTime: string; label?: string; variant?: 'spotlight' | 'card' | 'live' }> = ({ targetTime, label, variant = 'card' }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(null);
        return;
      }

      setTimeLeft({
        d: Math.floor(diff / (1000 * 60 * 60 * 24)),
        h: Math.floor((diff / (1000 * 60 * 60)) % 24),
        m: Math.floor((diff / 1000 / 60) % 60),
        s: Math.floor((diff / 1000) % 60)
      });
    };

    const timer = setInterval(calculate, 1000);
    calculate();
    return () => clearInterval(timer);
  }, [targetTime]);

  if (!timeLeft) {
    return <span className="text-red-500 font-bold uppercase text-[10px] tracking-widest animate-pulse">In Progress</span>;
  }

  const isEndingSoon = variant === 'live' && timeLeft.d === 0 && timeLeft.h === 0 && timeLeft.m < 30;

  return (
    <div className={`flex flex-col ${variant === 'spotlight' ? 'items-center lg:items-start' : 'items-start'}`}>
      {label && <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">{label}</span>}
      <div className={`font-mono font-bold flex gap-2 ${variant === 'spotlight' ? 'text-2xl md:text-3xl text-emerald-400' : 'text-sm text-slate-800'}`}>
        {timeLeft.d > 0 && (
          <span>{timeLeft.d}<span className="text-[10px] uppercase ml-0.5 opacity-60">d</span></span>
        )}
        <span className={isEndingSoon ? 'text-red-500' : ''}>
          {timeLeft.h.toString().padStart(2, '0')}<span className="text-[10px] uppercase ml-0.5 opacity-60">h</span>
        </span>
        <span className={isEndingSoon ? 'text-red-500' : ''}>
          {timeLeft.m.toString().padStart(2, '0')}<span className="text-[10px] uppercase ml-0.5 opacity-60">m</span>
        </span>
        <span className={isEndingSoon ? 'text-red-500 animate-pulse' : ''}>
          {timeLeft.s.toString().padStart(2, '0')}<span className="text-[10px] uppercase ml-0.5 opacity-60">s</span>
        </span>
      </div>
    </div>
  );
};

export const ProgrammingHub: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFallback, setIsFallback] = useState(false);
  const [activeFilter, setActiveFilter] = useState('ALL');

  const loadData = async () => {
    setLoading(true);
    try {
      const result = await contestService.fetchContests();
      setContests(result.data);
      setIsFallback(result.isFallback);
    } catch (err) {
      console.error('Failed to sync programming feed', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Refresh every 5 minutes
    const syncInterval = setInterval(loadData, 300000);
    return () => clearInterval(syncInterval);
  }, []);

  // Separate live and upcoming (sorted by start_time ascending already from service)
  const liveContests = contests.filter(c => c.status === 'LIVE');
  const upcomingContests = contests.filter(c => c.status === 'UPCOMING');

  // Hero Spotlight: Nearest UPCOMING contest (not live)
  const spotlight = upcomingContests[0];

  // Filter logic for upcoming calendar
  const getFilteredUpcoming = () => {
    if (activeFilter === 'ALL') return upcomingContests;
    const filter = activeFilter.toLowerCase();
    return upcomingContests.filter(c => c.platform.toLowerCase().includes(filter));
  };

  const filteredUpcoming = getFilteredUpcoming();

  const getPlatformStyle = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('codeforces')) return 'bg-red-50 text-red-600 border-red-100';
    if (p.includes('codechef')) return 'bg-amber-50 text-amber-700 border-amber-100';
    if (p.includes('leetcode')) return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    if (p.includes('atcoder')) return 'bg-slate-50 text-slate-700 border-slate-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  return (
    <div className="space-y-12 pb-24 animate-in fade-in duration-1000">
      {/* 🏆 HERO: NEAREST UPCOMING CONTEST */}
      <section className="relative overflow-hidden rounded-[2.5rem] bg-slate-950 text-white shadow-2xl border border-white/5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_-20%,rgba(16,185,129,0.2),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_120%,rgba(59,130,246,0.15),transparent)]" />
        
        <div className="relative z-10 p-10 md:p-14 lg:flex items-center gap-20">
          <div className="lg:w-3/5 space-y-8 text-center lg:text-left">
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Upcoming Challenge
              </div>
              {isFallback && (
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[10px] font-black uppercase tracking-widest">
                  Offline Sync Node
                </div>
              )}
            </div>
            
            <div className="space-y-4">
              <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-[1.1]">
                {spotlight?.title || (loading ? "Searching Feeds..." : "No Upcoming Events")}
              </h2>
              {spotlight && (
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest ${getPlatformStyle(spotlight.platform)}`}>
                    {spotlight.platform}
                  </span>
                  <span className="text-slate-400 font-medium">•</span>
                  <span className="text-slate-300 font-bold text-sm">{spotlight.duration} Duration</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 pt-4">
               {spotlight && (
                 <>
                   <PreciseCountdown targetTime={spotlight.rawStartTime} label="Contest Pulse" variant="spotlight" />
                   <div className="flex flex-col items-center lg:items-start">
                     <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Start Time (IST)</span>
                     <p className="text-xl md:text-2xl font-bold text-slate-200">{spotlight.startTime}</p>
                   </div>
                 </>
               )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6">
               {spotlight && (
                 <a 
                   href={spotlight.link} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="px-10 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-2xl font-black text-sm transition-all shadow-xl shadow-emerald-500/20 active:scale-95 text-center"
                 >
                   REGISTER NOW
                 </a>
               )}
               <button 
                 onClick={loadData}
                 disabled={loading}
                 className="px-6 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-bold transition-all text-center disabled:opacity-50"
               >
                 {loading ? "Syncing..." : "Refresh Feed"}
               </button>
            </div>
          </div>

          <div className="hidden lg:block lg:w-2/5">
             <div className="aspect-square bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-10 flex flex-col justify-center items-center text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="text-8xl mb-6">💻</span>
                <h4 className="text-xl font-black text-white mb-2">Algorithm Node</h4>
                <p className="text-slate-400 text-xs leading-relaxed max-w-[200px]">
                  Real-time synchronization with global competitive platforms.
                </p>
             </div>
          </div>
        </div>
      </section>

      {/* 🔴 LIVE ARENA: ONLY IF ACTIVE */}
      {liveContests.length > 0 && (
        <section className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-4">
               <span className="relative flex h-4 w-4">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-4 w-4 bg-red-600"></span>
               </span>
               LIVE ARENA
            </h3>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-sm">
              {liveContests.length} Active Sessions
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {liveContests.map(contest => (
              <div key={contest.id} className="bg-white rounded-[2.5rem] p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:border-red-500/30 transition-all group relative overflow-hidden">
                <div className="relative z-10 space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black border ${getPlatformStyle(contest.platform)}`}>
                        {contest.platform[0]}
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{contest.platform}</p>
                        <p className="text-xs font-bold text-red-600 animate-pulse">Running Now</p>
                      </div>
                    </div>
                    <PreciseCountdown targetTime={contest.endTime} label="Ends In" variant="live" />
                  </div>

                  <h4 className="text-xl font-bold leading-tight min-h-[3.5rem] group-hover:text-red-600 transition-colors line-clamp-2">
                    {contest.title}
                  </h4>

                  <a 
                    href={contest.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="w-full block text-center bg-slate-900 hover:bg-red-600 text-white py-4 rounded-2xl text-xs font-black transition-all shadow-lg active:scale-95"
                  >
                    JOIN ARENA
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 📅 UPCOMING CALENDAR */}
      <section className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm sticky top-20 z-20">
          <div className="flex items-center gap-4">
            <div className="text-3xl">📅</div>
            <div>
              <h3 className="text-xl font-black text-slate-900 uppercase">Upcoming Calendar</h3>
              <p className="text-xs text-slate-500 font-medium">Synchronized Feed (Local Time: IST)</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-2xl overflow-x-auto max-w-full">
            {['ALL', 'CODEFORCES', 'CODECHEF', 'LEETCODE', 'ATCODER'].map(t => (
              <button 
                key={t}
                onClick={() => setActiveFilter(t)}
                className={`px-5 py-2.5 text-[10px] font-black rounded-xl transition-all whitespace-nowrap ${
                  activeFilter === t ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {loading ? (
            <div className="py-32 flex flex-col items-center justify-center bg-white rounded-[2.5rem] border border-dashed border-slate-200">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6" />
              <p className="text-slate-500 font-black uppercase tracking-widest text-xs">Syncing Global Datastreams...</p>
            </div>
          ) : filteredUpcoming.length === 0 ? (
            <div className="py-32 text-center bg-white rounded-[2.5rem] border border-slate-200">
               <span className="text-5xl mb-6 block">🔭</span>
              <p className="text-slate-500 font-bold">No upcoming contests detected for this filter.</p>
            </div>
          ) : (
            filteredUpcoming.map(contest => (
              <div key={contest.id} className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col md:flex-row justify-between items-center group">
                <div className="flex items-center gap-8 w-full md:w-auto mb-6 md:mb-0">
                  <div className={`w-16 h-16 rounded-[1.25rem] border flex items-center justify-center text-2xl font-black shrink-0 ${getPlatformStyle(contest.platform)}`}>
                    {contest.platform[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-slate-900 text-xl group-hover:text-blue-600 transition-colors line-clamp-1">{contest.title}</h4>
                    <div className="flex flex-wrap items-center gap-x-6 gap-y-1 mt-1">
                      <span className="text-xs text-slate-500 font-bold">Platform: <span className="text-slate-900 uppercase">{contest.platform}</span></span>
                      <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                      <span className="text-xs text-slate-500 font-bold">Duration: <span className="text-slate-900">{contest.duration}</span></span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-10 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-center md:text-right">
                    <PreciseCountdown targetTime={contest.rawStartTime} label="Contest Pulse" />
                    <p className="text-xs font-mono font-bold text-slate-500 mt-1">{contest.startTime}</p>
                  </div>
                  <a 
                    href={contest.link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-slate-900 text-white px-10 py-4 rounded-2xl text-xs font-black hover:bg-blue-600 transition-all shadow-lg active:scale-95 text-center whitespace-nowrap min-w-[160px]"
                  >
                    REGISTER
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};
