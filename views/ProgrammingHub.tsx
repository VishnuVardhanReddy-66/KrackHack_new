
import React, { useState, useEffect } from 'react';
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

const Countdown: React.FC<{ targetTime: string }> = ({ targetTime }) => {
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

  if (!timeLeft) return <span className="text-blue-600 font-black tracking-widest uppercase">LIVE NOW</span>;

  return (
    <div className="flex gap-8 font-black text-[#1d1d1f]">
      {Object.entries(timeLeft).map(([key, val]) => (
        <div key={key} className="flex flex-col items-center">
          <span className="text-5xl md:text-7xl tracking-tighter tabular-nums">{val.toString().padStart(2, '0')}</span>
          <span className="text-[9px] uppercase tracking-[0.4em] text-[#86868b] mt-1">{key === 'd' ? 'D' : key === 'h' ? 'H' : key === 'm' ? 'M' : 'S'}</span>
        </div>
      ))}
    </div>
  );
};

export const ProgrammingHub: React.FC = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    const result = await contestService.fetchContests();
    setContests(result.data);
    setLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const upcoming = contests.filter(c => c.status === 'UPCOMING');
  const spotlight = upcoming[0];

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-24"
    >
      <section className="min-h-[60vh] flex flex-col justify-center items-center text-center space-y-12 relative">
        <motion.div variants={itemVariants} className="space-y-4">
          <span className="text-blue-600 font-black text-[10px] uppercase tracking-[0.6em]">COMPETITIVE ARENA</span>
          <h2 className="text-5xl md:text-8xl font-black text-[#1d1d1f] tracking-tighter leading-tight max-w-4xl">
            {spotlight?.title || "Fetching Contests..."}
          </h2>
        </motion.div>

        {spotlight && (
          <motion.div variants={itemVariants}>
            <Countdown targetTime={spotlight.rawStartTime} />
          </motion.div>
        )}

        <motion.div variants={itemVariants} className="flex gap-4">
          <a href={spotlight?.link} target="_blank" className="px-10 py-4 bg-[#1d1d1f] text-white rounded-full font-bold text-sm shadow-xl hover:bg-black transition-all">
            Enter Contest
          </a>
          <button onClick={loadData} className="px-10 py-4 bg-[#f5f5f7] rounded-full font-bold text-sm text-[#1d1d1f] hover:bg-[#e8e8ed] transition-all">
            Sync Data
          </button>
        </motion.div>
      </section>

      <section className="space-y-10">
        <motion.div variants={itemVariants} className="border-b border-black/5 pb-6 flex justify-between items-end">
          <h3 className="text-2xl font-black text-[#1d1d1f] tracking-tight">Global Calendar</h3>
          <p className="text-[10px] font-bold text-[#86868b] uppercase tracking-[0.3em] font-mono">Real-time Node</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {upcoming.slice(1, 7).map((contest) => (
            <motion.div 
              key={contest.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bento-card p-8 flex flex-col justify-between group cursor-default h-[340px]"
            >
              <div className="space-y-5">
                <div className="flex justify-between items-center">
                   <span className="px-2.5 py-1 bg-[#f5f5f7] text-[#86868b] rounded-lg text-[9px] font-black uppercase tracking-widest">
                     {contest.platform}
                   </span>
                   <span className="text-[10px] font-mono text-blue-600 font-bold">{contest.duration}</span>
                </div>
                <h4 className="text-xl font-bold text-[#1d1d1f] tracking-tight group-hover:text-blue-600 transition-colors leading-snug">
                  {contest.title}
                </h4>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-[#86868b] uppercase tracking-[0.2em] font-mono">STARTS</p>
                  <p className="text-xs font-bold text-[#1d1d1f]">{contest.startTime}</p>
                </div>
                <a href={contest.link} className="block text-center py-3 bg-[#f5f5f7] hover:bg-[#1d1d1f] text-[#1d1d1f] hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">
                  Details
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
};
