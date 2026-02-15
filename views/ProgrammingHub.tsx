
import React, { useState, useEffect, useMemo } from 'react';
import { Contest } from '../types';
import { contestService } from '../services/contestService';
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

// Initial Mock Hackathons Data
const INITIAL_HACKATHONS = [
  { id: 'h1', title: 'AEGIS Protocol Hack', date: '2026-03-15', platform: 'IIT Mandi', link: '#', isCommunity: false },
  { id: 'h2', title: 'Himalayan ML Summit', date: '2026-04-10', platform: 'Devfolio', link: '#', isCommunity: false },
  { id: 'h3', title: 'Global AI Sprint', date: '2026-05-22', platform: 'MLH', link: '#', isCommunity: false },
  { id: 'h4', title: 'North Campus CTF', date: '2026-06-05', platform: 'CyberHub', link: '#', isCommunity: false },
  { id: 'h5', title: 'FinTech Revolution', date: '2026-07-12', platform: 'HackerEarth', link: '#', isCommunity: false },
  { id: 'h6', title: 'Summer Code Jam', date: '2026-08-20', platform: 'Google', link: '#', isCommunity: false },
  { id: 'h7', title: 'Winter Build-A-Thon', date: '2026-11-05', platform: 'Microsoft', link: '#', isCommunity: false },
  { id: 'h8', title: 'Decentralized Future', date: '2026-12-15', platform: 'Web3 Foundation', link: '#', isCommunity: false },
  { id: 'h9', title: 'GenAI Challenge', date: '2026-02-18', platform: 'Google Cloud', link: '#', isCommunity: false },
  { id: 'h10', title: 'HealthTech Hack', date: '2026-09-30', platform: 'WHO Center', link: '#', isCommunity: false },
];

const Countdown: React.FC<{ targetTime: string, color?: string }> = ({ targetTime, color = "#1d1d1f" }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  useEffect(() => {
    const calculate = () => {
      const now = new Date().getTime();
      const target = new Date(targetTime).getTime();
      const diff = target - now;
      if (diff <= 0) return setTimeLeft(null);

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

  if (!timeLeft) return <span className="text-blue-600 font-black tracking-widest uppercase">EVENT LIVE NOW</span>;

  return (
    <div className="flex gap-8 font-black" style={{ color }}>
      {Object.entries(timeLeft).map(([key, val]) => (
        <div key={key} className="flex flex-col items-center">
          <span className="text-5xl md:text-7xl tracking-tighter tabular-nums">{val.toString().padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-[0.4em] opacity-40 mt-1">{key === 'd' ? 'D' : key === 'h' ? 'H' : key === 'm' ? 'M' : 'S'}</span>
        </div>
      ))}
    </div>
  );
};

export const ProgrammingHub: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [hackathons, setHackathons] = useState<any[]>(INITIAL_HACKATHONS);
  const [loading, setLoading] = useState(true);
  const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: string, items: any[] } | null>(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 2, 1)); 
  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false);
  
  const [hostFormData, setHostFormData] = useState({
    title: '',
    type: 'CONTEST' as 'CONTEST' | 'HACKATHON',
    date: '',
    link: '',
    platform: ''
  });

  const loadData = async () => {
    setLoading(true);
    const result = await contestService.fetchContests();
    setContests(result.data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const spotlightContest = useMemo(() => {
    const now = new Date().getTime();
    return contests
      .filter(c => new Date(c.rawStartTime).getTime() > now)
      .sort((a, b) => new Date(a.rawStartTime).getTime() - new Date(b.rawStartTime).getTime())[0];
  }, [contests]);

  const spotlightHackathon = useMemo(() => {
    const now = new Date().getTime();
    return hackathons
      .filter(h => new Date(h.date).getTime() > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];
  }, [hackathons]);

  const getDaysInMonth = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const handleDateClick = (dateStr: string) => {
    const contestMatches = contests.filter(item => {
      const itemDate = new Date(item.rawStartTime).toISOString().split('T')[0];
      return itemDate === dateStr;
    });

    const hackathonMatches = hackathons.filter(item => item.date === dateStr);
    const totalMatches = [...contestMatches, ...hackathonMatches];
    
    if (totalMatches.length > 0) {
      setSelectedDateEvents({ date: dateStr, items: totalMatches });
    }
  };

  const handleHostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hostFormData.type === 'CONTEST') {
      const newContest: Contest = {
        id: `user-c-${Date.now()}`,
        title: hostFormData.title,
        platform: hostFormData.platform || 'Community Host',
        startTime: new Date(hostFormData.date).toLocaleString(),
        rawStartTime: new Date(hostFormData.date).toISOString(),
        endTime: new Date(new Date(hostFormData.date).getTime() + 7200000).toISOString(),
        duration: '2h',
        link: hostFormData.link,
        status: 'UPCOMING',
        isCommunity: true
      } as any;
      setContests(prev => [...prev, newContest].sort((a, b) => new Date(a.rawStartTime).getTime() - new Date(b.rawStartTime).getTime()));
    } else {
      const newHack = {
        id: `user-h-${Date.now()}`,
        title: hostFormData.title,
        date: hostFormData.date,
        platform: hostFormData.platform || 'Community Host',
        link: hostFormData.link,
        isCommunity: true
      };
      setHackathons(prev => [...prev, newHack].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }
    setHostFormData({ title: '', type: 'CONTEST', date: '', link: '', platform: '' });
    setIsHostingModalOpen(false);
  };

  const renderMonthCalendar = () => {
    const { firstDay, daysInMonth } = getDaysInMonth(currentMonthDate.getFullYear(), currentMonthDate.getMonth());
    const days = Array.from({ length: 42 }, (_, i) => {
      const day = i - firstDay + 1;
      return (day > 0 && day <= daysInMonth) ? day : null;
    });

    return (
      <div className="bg-white border border-black/5 rounded-[40px] p-10 shadow-sm space-y-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h4 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              {currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Contest Schedule</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1))} className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-100 hover:bg-slate-50 transition-all text-slate-400">❮</button>
            <button onClick={() => setCurrentMonthDate(new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1))} className="w-12 h-12 flex items-center justify-center rounded-full border border-slate-100 hover:bg-slate-50 transition-all text-slate-400">❯</button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
            <div key={d} className="text-[10px] font-black text-slate-400 text-center py-4 uppercase tracking-[0.2em]">{d}</div>
          ))}
          {days.map((day, i) => {
            if (!day) return <div key={i} className="aspect-square" />;
            const dateStr = `${currentMonthDate.getFullYear()}-${(currentMonthDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
            const matchesContest = contests.some(c => new Date(c.rawStartTime).toISOString().split('T')[0] === dateStr);
            const matchesHack = hackathons.some(h => h.date === dateStr);
            const hasEvent = matchesContest || matchesHack;

            return (
              <button
                key={i}
                onClick={() => hasEvent && handleDateClick(dateStr)}
                className={`aspect-square flex flex-col items-center justify-center rounded-2xl text-base font-bold transition-all relative group ${
                  hasEvent 
                    ? 'bg-blue-600 text-white shadow-xl shadow-blue-200 hover:scale-110 active:scale-95' 
                    : 'text-slate-400 hover:bg-slate-50'
                }`}
              >
                {day}
                <div className="flex gap-1 mt-1">
                  {matchesContest && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  {matchesHack && <span className="w-1.5 h-1.5 bg-amber-300 rounded-full" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const renderYearCalendar = () => {
    const year = 2026;
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="bg-white border border-black/5 rounded-[40px] p-12 shadow-sm space-y-12">
        <div className="flex justify-between items-end border-b border-black/5 pb-8">
          <div className="space-y-2">
            <h4 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Hackathon Master 2026</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Yearly Protocol Synchronization</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-[2px] bg-purple-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Hub</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-[2px] bg-amber-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Community Hub</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-16">
          {months.map(m => {
            const { firstDay, daysInMonth } = getDaysInMonth(year, m);
            const days = Array.from({ length: 42 }, (_, i) => {
              const day = i - firstDay + 1;
              return (day > 0 && day <= daysInMonth) ? day : null;
            });
            const monthName = new Date(year, m, 1).toLocaleString('default', { month: 'short' });
            
            return (
              <div key={m} className="space-y-4">
                <p className="text-[12px] font-black text-slate-800 uppercase tracking-widest border-b border-slate-50 pb-2">{monthName}</p>
                <div className="grid grid-cols-7 gap-1">
                  {days.map((day, di) => {
                    if (!day) return <div key={di} className="w-4 h-4" />;
                    const dateStr = `${year}-${(m + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
                    const hackMatch = hackathons.find(h => h.date === dateStr);
                    return (
                      <button
                        key={di}
                        onClick={() => hackMatch && handleDateClick(dateStr)}
                        className={`w-4 h-4 rounded-[2px] transition-all ${
                          hackMatch 
                            ? (hackMatch.isCommunity ? 'bg-amber-500 scale-125 hover:bg-amber-600 shadow-md shadow-amber-200' : 'bg-purple-500 scale-125 hover:bg-purple-600 shadow-md shadow-purple-200')
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
                        title={hackMatch ? `Hackathon on ${dateStr}` : ''}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-32 py-12"
    >
      {/* SECTION 1: CONTEST SPOTLIGHT */}
      <section className="space-y-16">
        <div className="flex flex-col items-center text-center space-y-12">
          <motion.div variants={itemVariants} className="space-y-4">
            <span className="text-blue-600 font-black text-[12px] uppercase tracking-[0.6em]">LATEST UPCOMING CONTEST</span>
            <h2 className="text-5xl md:text-8xl font-black text-[#1d1d1f] tracking-tighter leading-tight max-w-4xl">
              {spotlightContest?.title || (loading ? "Calibrating..." : "No Events Ready")}
              {(spotlightContest as any)?.isCommunity && (
                <span className="ml-4 text-xs font-black bg-amber-500 text-white px-3 py-1 rounded-full uppercase tracking-widest align-middle">Community</span>
              )}
            </h2>
          </motion.div>

          {spotlightContest && (
            <motion.div variants={itemVariants}>
              <Countdown targetTime={spotlightContest.rawStartTime} />
            </motion.div>
          )}

          <motion.div variants={itemVariants} className="flex gap-4">
            {spotlightContest && (
              <a href={spotlightContest.link} target="_blank" className="px-12 py-5 bg-blue-600 text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-[0.98]">
                Click Here to Enter Arena
              </a>
            )}
            <button 
              onClick={() => setIsHostingModalOpen(true)}
              className="px-12 py-5 bg-white border border-black/5 rounded-full font-black text-[11px] uppercase tracking-widest text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all active:scale-[0.98] shadow-sm"
            >
              Host New Event
            </button>
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          {renderMonthCalendar()}
        </motion.div>
      </section>

      {/* SECTION 2: HACKATHON SPOTLIGHT */}
      <section className="space-y-16">
        <div className="flex flex-col items-center text-center space-y-12 pt-20 border-t border-black/5">
          <motion.div variants={itemVariants} className="space-y-4">
            <span className="text-purple-600 font-black text-[12px] uppercase tracking-[0.6em]">LATEST UPCOMING HACKATHON</span>
            <h2 className="text-5xl md:text-8xl font-black text-[#1d1d1f] tracking-tighter leading-tight max-w-4xl">
              {spotlightHackathon?.title || "Searching Ecosystem..."}
              {spotlightHackathon?.isCommunity && (
                <span className="ml-4 text-xs font-black bg-amber-500 text-white px-3 py-1 rounded-full uppercase tracking-widest align-middle">Community</span>
              )}
            </h2>
          </motion.div>

          {spotlightHackathon && (
            <motion.div variants={itemVariants}>
              <Countdown targetTime={spotlightHackathon.date} color="#5b5fc7" />
            </motion.div>
          )}

          <motion.div variants={itemVariants}>
            {spotlightHackathon && (
              <a href={spotlightHackathon.link} target="_blank" className="px-12 py-5 bg-[#1d1d1f] text-white rounded-full font-black text-[11px] uppercase tracking-widest shadow-2xl hover:bg-black transition-all active:scale-[0.98]">
                Click Here to Access Portal
              </a>
            )}
          </motion.div>
        </div>

        <motion.div variants={itemVariants}>
          {renderYearCalendar()}
        </motion.div>
      </section>

      {/* Hosting Modal */}
      <AnimatePresence>
        {isHostingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
            onClick={() => setIsHostingModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden border border-black/5"
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleHostSubmit} className="p-12 space-y-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Ecosystem Expansion</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Host New Arena Event</h3>
                  </div>
                  <button type="button" onClick={() => setIsHostingModalOpen(false)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 hover:text-slate-800 transition-all">✕</button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Event Title</label>
                    <input 
                      required
                      value={hostFormData.title}
                      onChange={e => setHostFormData({...hostFormData, title: e.target.value})}
                      placeholder="e.g. Campus Algolympics 2026"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Type</label>
                      <select 
                        value={hostFormData.type}
                        onChange={e => setHostFormData({...hostFormData, type: e.target.value as any})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                      >
                        <option value="CONTEST">Contest</option>
                        <option value="HACKATHON">Hackathon</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                      <input 
                        required
                        type="datetime-local"
                        value={hostFormData.date}
                        onChange={e => setHostFormData({...hostFormData, date: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Platform / Host Org</label>
                    <input 
                      required
                      value={hostFormData.platform}
                      onChange={e => setHostFormData({...hostFormData, platform: e.target.value})}
                      placeholder="e.g. Student Council / CodeClub"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registration/Arena Link</label>
                    <input 
                      required
                      value={hostFormData.link}
                      onChange={e => setHostFormData({...hostFormData, link: e.target.value})}
                      placeholder="https://arena.campus.edu/..."
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
                >
                  Broadcast to Campus Protocol ❯
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Details Modal */}
      <AnimatePresence>
        {selectedDateEvents && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/40 backdrop-blur-md"
            onClick={() => setSelectedDateEvents(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#f5f5f7] rounded-[40px] w-full max-w-lg shadow-[0_32px_128px_rgba(0,0,0,0.3)] overflow-hidden border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Temporal Data Hub</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">
                      {new Date(selectedDateEvents.date).toLocaleDateString('default', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                  </div>
                  <button 
                    onClick={() => setSelectedDateEvents(null)} 
                    className="w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-slate-500 transition-colors"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {selectedDateEvents.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm hover:shadow-md transition-all group flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                          <span className="text-[9px] font-black uppercase bg-slate-100 text-slate-500 px-3 py-1 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all tracking-widest">
                            {item.platform || item.site || 'Platform Hub'}
                          </span>
                          {item.isCommunity && (
                            <span className="text-[9px] font-black uppercase bg-amber-100 text-amber-600 px-3 py-1 rounded-full tracking-widest">
                              Community
                            </span>
                          )}
                        </div>
                        {item.duration && (
                          <span className="text-[10px] font-mono text-blue-600 font-black bg-blue-50 px-2 py-0.5 rounded">
                            {item.duration}
                          </span>
                        )}
                      </div>
                      
                      <div className="mb-8">
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Event Reference</p>
                        <h4 className="text-xl font-black text-slate-800 leading-tight tracking-tight">
                          {item.title}
                        </h4>
                      </div>

                      <a 
                        href={item.link || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full text-center py-4 bg-blue-600 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                      >
                        Click Here ❯
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
