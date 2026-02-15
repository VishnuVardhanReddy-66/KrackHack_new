
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

const INITIAL_HACKATHONS = [
  // Jan
  { id: 'h1', title: 'New Year Code Sprint', date: '2026-01-15T09:00:00', platform: 'Campus Hub', link: '#', isCommunity: true },
  { id: 'h2', title: 'Himalayan ML Summit', date: '2026-01-28T10:00:00', platform: 'Devfolio', link: '#', isCommunity: false },
  // Feb
  { id: 'h3', title: 'Cyber Security Challenge', date: '2026-02-12T10:00:00', platform: 'TryHackMe', link: '#', isCommunity: true },
  { id: 'h4', title: 'Web3 Future Build', date: '2026-02-25T14:00:00', platform: 'EthGlobal', link: '#', isCommunity: false },
  // March (Current Context)
  { id: 'h5', title: 'AEGIS Ecosystem Hack', date: '2026-03-15T09:00:00', platform: 'IIT Mandi', link: '#', isCommunity: false },
  { id: 'h6', title: 'Open Source Sprint', date: '2026-03-18T11:00:00', platform: 'GitHub Community', link: '#', isCommunity: true },
  { id: 'h7', title: 'Robotics Workshop', date: '2026-03-25T09:00:00', platform: 'IEEE Student Branch', link: '#', isCommunity: true },
  // April
  { id: 'h8', title: 'DevOps Days Mandi', date: '2026-04-15T10:00:00', platform: 'Google', link: '#', isCommunity: false },
  { id: 'h9', title: 'FinTech Revolution', date: '2026-04-30T11:00:00', platform: 'HackerEarth', link: '#', isCommunity: false },
  // May
  { id: 'h10', title: 'Game Jam 2026', date: '2026-05-12T15:00:00', platform: 'Unity', link: '#', isCommunity: true },
  { id: 'h11', title: 'Robotics Expo', date: '2026-05-25T09:00:00', platform: 'IITM Robotics', link: '#', isCommunity: false },
  // June
  { id: 'h12', title: 'Cloud Native Summit', date: '2026-06-10T10:00:00', platform: 'CNCF', link: '#', isCommunity: false },
  { id: 'h13', title: 'Data Science Bowl', date: '2026-06-25T09:00:00', platform: 'Kaggle', link: '#', isCommunity: true },
  // July
  { id: 'h14', title: 'Summer Code Fest', date: '2026-07-15T10:00:00', platform: 'Student Hub', link: '#', isCommunity: true },
  { id: 'h15', title: 'Innovation Hub 2026', date: '2026-07-28T11:00:00', platform: 'TBI Mandi', link: '#', isCommunity: false },
  // August
  { id: 'h16', title: 'Independence Day Hack', date: '2026-08-12T09:00:00', platform: 'Gov of India', link: '#', isCommunity: true },
  { id: 'h17', title: 'Smart City Hackathon', date: '2026-08-25T10:00:00', platform: 'Microsoft', link: '#', isCommunity: false },
  // September
  { id: 'h18', title: 'Teacher Day Special Hack', date: '2026-09-10T09:00:00', platform: 'Academic Council', link: '#', isCommunity: true },
  { id: 'h19', title: 'ML Symposium', date: '2026-09-22T14:00:00', platform: 'Stanford AI', link: '#', isCommunity: false },
  // October
  { id: 'h20', title: 'Diwali Code Lights', date: '2026-10-15T10:00:00', platform: 'CodeClub', link: '#', isCommunity: true },
  { id: 'h21', title: 'Blockchain Week', date: '2026-10-28T09:00:00', platform: 'Polygon', link: '#', isCommunity: false },
  // November
  { id: 'h22', title: 'Children Day Code Jam', date: '2026-11-12T09:00:00', platform: 'UNICEF Tech', link: '#', isCommunity: true },
  { id: 'h23', title: 'Winter Build-a-Thon', date: '2026-11-25T10:00:00', platform: 'AWS', link: '#', isCommunity: false },
  // December
  { id: 'h24', title: 'Year End Grand Hack', date: '2026-12-15T09:00:00', platform: 'Global Hub', link: '#', isCommunity: false },
  { id: 'h25', title: 'New Year Sprint', date: '2026-12-31T20:00:00', platform: 'OpenSource', link: '#', isCommunity: true },
];

export const ProgrammingHub: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [hackathons, setHackathons] = useState<any[]>(INITIAL_HACKATHONS);
  const [loading, setLoading] = useState(true);
  const [selectedDateEvents, setSelectedDateEvents] = useState<{ date: string, items: any[] } | null>(null);
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date(2026, 2, 1)); 
  const [isHostingModalOpen, setIsHostingModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date().getTime());

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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date().getTime()), 1000);
    return () => clearInterval(timer);
  }, []);

  const masterSpotlight = useMemo(() => {
    const upcomingContests = contests
      .filter(c => new Date(c.rawStartTime).getTime() > currentTime)
      .map(c => ({ ...c, startTime: c.rawStartTime, typeLabel: 'Contest', themeColor: 'text-blue-600', btnColor: 'bg-blue-600' }));
      
    const upcomingHackathons = hackathons
      .filter(h => new Date(h.date).getTime() > currentTime)
      .map(h => ({ ...h, startTime: h.date, typeLabel: 'Hackathon', themeColor: 'text-purple-600', btnColor: 'bg-slate-900' }));

    const all = [...upcomingContests, ...upcomingHackathons].sort((a, b) => 
      new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );

    return all[0];
  }, [contests, hackathons, currentTime]);

  const handleDateClick = (dateStr: string) => {
    const contestMatches = contests.filter(item => {
      const itemDate = new Date(item.rawStartTime).toISOString().split('T')[0];
      return itemDate === dateStr;
    });

    const hackathonMatches = hackathons.filter(item => item.date.split('T')[0] === dateStr);
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
        platform: hostFormData.platform || 'Community Hub',
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
        platform: hostFormData.platform || 'Community Hub',
        link: hostFormData.link,
        isCommunity: true
      };
      setHackathons(prev => [...prev, newHack].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    }
    setHostFormData({ title: '', type: 'CONTEST', date: '', link: '', platform: '' });
    setIsHostingModalOpen(false);
  };

  const renderMonthCalendar = () => {
    const getMonthDetails = (year: number, month: number) => {
      const first = new Date(year, month, 1).getDay();
      const days = new Date(year, month + 1, 0).getDate();
      return { firstDay: first, daysInMonth: days };
    };

    const { firstDay, daysInMonth } = getMonthDetails(currentMonthDate.getFullYear(), currentMonthDate.getMonth());

    const days = Array.from({ length: 42 }, (_, i) => {
      const day = i - firstDay + 1;
      return (day > 0 && day <= daysInMonth) ? day : null;
    });

    return (
      <div className="bg-white border border-black/5 rounded-[48px] p-10 shadow-sm space-y-8">
        <div className="flex justify-between items-center">
          <div className="space-y-1">
            <h4 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
              {currentMonthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monthly Arena Schedule</p>
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
            const matchesHack = hackathons.some(h => h.date.split('T')[0] === dateStr);
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
    const getMonthDetails = (year: number, month: number) => {
      const first = new Date(year, month, 1).getDay();
      const days = new Date(year, month + 1, 0).getDate();
      return { firstDay: first, daysInMonth: days };
    };

    const year = 2026;
    const months = Array.from({ length: 12 }, (_, i) => i);

    return (
      <div className="bg-white border border-black/5 rounded-[48px] p-12 shadow-sm space-y-12">
        <div className="flex justify-between items-end border-b border-black/5 pb-8">
          <div className="space-y-2">
            <h4 className="text-3xl font-black text-slate-800 tracking-tight uppercase">Master Roadmap 2026</h4>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Institutional Pulse Synchronization</p>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-[2px] bg-blue-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Events</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-[2px] bg-amber-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Community Initiatives</span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-12 gap-y-16">
          {months.map(m => {
            const { firstDay, daysInMonth } = getMonthDetails(year, m);
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
                    const hackMatch = hackathons.find(h => h.date.split('T')[0] === dateStr);
                    const contestMatch = contests.find(c => new Date(c.rawStartTime).toISOString().split('T')[0] === dateStr);
                    return (
                      <button
                        key={di}
                        onClick={() => (hackMatch || contestMatch) && handleDateClick(dateStr)}
                        className={`w-4 h-4 rounded-[2px] transition-all ${
                          hackMatch || contestMatch
                            ? (hackMatch?.isCommunity ? 'bg-amber-500 scale-125 hover:bg-amber-600 shadow-md shadow-amber-200' : 'bg-blue-500 scale-125 hover:bg-blue-600 shadow-md shadow-blue-200')
                            : 'bg-slate-100 hover:bg-slate-200'
                        }`}
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
      className="space-y-12 py-12 px-4 md:px-0"
    >
      {/* SECTION 1: MASTER ARENA SPOTLIGHT */}
      <section className="space-y-12 pt-8">
        <div className="flex flex-col items-center text-center space-y-12 py-24 px-8 rounded-[64px] bg-slate-50/50 border border-slate-100 relative overflow-hidden shadow-sm">
          {/* Immersive background elements */}
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-[0.03]">
             <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, #000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
          </div>
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-600/5 blur-[120px] rounded-full" />
          <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-purple-600/5 blur-[120px] rounded-full" />

          <motion.div variants={itemVariants} className="space-y-6 relative z-10">
            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-slate-100 shadow-sm">
               <span className="relative flex h-2 w-2">
                 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                 <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
               </span>
               <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Arena Sync Engaged</span>
            </div>
            
            <div className="space-y-4">
              <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">Upcoming Featured {masterSpotlight?.typeLabel || 'Domain'}</p>
              <h2 className="text-5xl md:text-8xl font-black text-[#1d1d1f] tracking-tighter leading-[0.9] max-w-5xl">
                {masterSpotlight?.title || (loading ? "Calibrating..." : "Scanning for Active Hubs")}
                {masterSpotlight?.isCommunity && (
                  <span className="ml-4 text-xs font-black bg-amber-500 text-white px-5 py-2 rounded-full uppercase tracking-widest align-middle shadow-lg shadow-amber-200">Community</span>
                )}
              </h2>
              {masterSpotlight && (
                <div className="flex flex-col items-center gap-2 mt-8">
                  <p className="text-slate-500 font-bold uppercase tracking-widest text-lg">Scheduled for {masterSpotlight.startTime}</p>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-6 relative z-10">
            {masterSpotlight && (
              <a 
                href={masterSpotlight.link} 
                target="_blank" 
                className={`px-16 py-6 ${masterSpotlight.btnColor} text-white rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all active:scale-[0.98] flex items-center gap-3`}
              >
                Access Event Portal ❯
              </a>
            )}
            <button 
              onClick={() => setIsHostingModalOpen(true)}
              className="px-16 py-6 bg-white border border-slate-100 rounded-[24px] font-black text-[11px] uppercase tracking-[0.2em] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all active:scale-[0.98] shadow-sm flex items-center gap-3"
            >
              Broadcast New Event ⊕
            </button>
          </motion.div>
        </div>
      </section>

      {/* SECTION 2: CALENDAR VIEWS */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
        <motion.div variants={itemVariants} className="xl:col-span-1">
          {renderMonthCalendar()}
        </motion.div>
        <motion.div variants={itemVariants} className="xl:col-span-2">
          {renderYearCalendar()}
        </motion.div>
      </div>

      {/* Hosting Modal */}
      <AnimatePresence>
        {isHostingModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl"
            onClick={() => setIsHostingModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-[48px] w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100"
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleHostSubmit} className="p-12 space-y-10">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Institutional Expansion</p>
                    <h3 className="text-3xl font-black text-slate-800 tracking-tight leading-none">Initialize New Event</h3>
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
                      placeholder="e.g. Algolympics 2026"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Domain Type</label>
                      <select 
                        value={hostFormData.type}
                        onChange={e => setHostFormData({...hostFormData, type: e.target.value as any})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      >
                        <option value="CONTEST">Contest</option>
                        <option value="HACKATHON">Hackathon</option>
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Scheduled Date</label>
                      <input 
                        required
                        type="datetime-local"
                        value={hostFormData.date}
                        onChange={e => setHostFormData({...hostFormData, date: e.target.value})}
                        className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Host Organization</label>
                    <input 
                      required
                      value={hostFormData.platform}
                      onChange={e => setHostFormData({...hostFormData, platform: e.target.value})}
                      placeholder="e.g. CodeClub / Student Hub"
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Portal Link</label>
                    <input 
                      required
                      value={hostFormData.link}
                      onChange={e => setHostFormData({...hostFormData, link: e.target.value})}
                      placeholder="https://arena.campus.edu/..."
                      className="w-full bg-slate-50 border-none rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 transition-all outline-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:bg-black transition-all active:scale-[0.98]"
                >
                  Broadcast to Campus ❯
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
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-xl"
            onClick={() => setSelectedDateEvents(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#f5f5f7] rounded-[48px] w-full max-w-lg shadow-2xl overflow-hidden border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-10 space-y-8">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Arena Metadata Hub</p>
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
                      className="bg-white p-6 rounded-[32px] border border-black/5 shadow-sm hover:shadow-md transition-all group flex flex-col"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex gap-2">
                          <span className="text-[9px] font-black uppercase bg-slate-50 text-slate-500 px-4 py-1.5 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all tracking-widest">
                            {item.platform || item.site || 'Platform Hub'}
                          </span>
                          {item.isCommunity && (
                            <span className="text-[9px] font-black uppercase bg-amber-50 text-amber-600 px-4 py-1.5 rounded-full tracking-widest border border-amber-100">
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
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Event Registry</p>
                        <h4 className="text-2xl font-black text-slate-800 leading-tight tracking-tight">
                          {item.title}
                        </h4>
                      </div>

                      <a 
                        href={item.link || '#'} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block w-full text-center py-5 bg-slate-900 text-white rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-black transition-all shadow-lg active:scale-[0.98]"
                      >
                        Enter ❯
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
