
import React, { useState, useMemo } from 'react';
import { UserRole } from '../types';
import { motion, Variants, AnimatePresence } from 'framer-motion';

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.8, ease: [0.28, 0.11, 0.32, 1] as any }
  }
};

const FeatureCard: React.FC<{ icon: string, title: string, desc: string }> = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
    className="bento-card p-10 flex flex-col gap-6"
  >
    <div className="text-4xl">{icon}</div>
    <div className="space-y-2">
      <h4 className="text-lg font-extrabold text-[#242424] tracking-tight">{title}</h4>
      <h5 className="text-sm text-[#616161] leading-relaxed font-medium">{desc}</h5>
    </div>
  </motion.div>
);

// Academic Events Data (Extracted from 2026 Calendar PDF)
const ACADEMIC_EVENTS = [
  // Even Semester 2026
  { date: '2026-01-05', title: 'Classes Begin', type: 'academic' },
  { date: '2026-01-26', title: 'Republic Day', type: 'holiday' },
  { date: '2026-03-01', endDate: '2026-03-08', title: 'Mid Break', type: 'break' },
  { date: '2026-03-12', title: 'Last Date: Midsem Sheets', type: 'academic' },
  { date: '2026-03-21', title: 'Id-ul-Fitr', type: 'holiday' },
  { date: '2026-03-26', title: 'Ram Navami', type: 'holiday' },
  { date: '2026-03-31', title: 'Mahavir Jayanti', type: 'holiday' },
  { date: '2026-04-03', title: 'Good Friday', type: 'holiday' },
  { date: '2026-04-03', endDate: '2026-04-05', title: 'Exodia Fest', type: 'fest' },
  { date: '2026-04-29', title: 'Last Day of Teaching', type: 'academic' },
  { date: '2026-05-11', title: 'Vacation Begins', type: 'break' },
  // Summer Term
  { date: '2026-06-01', title: 'Summer Classes Start', type: 'academic' },
  // Odd Semester 2026
  { date: '2026-08-03', title: 'Odd Sem Classes Start', type: 'academic' },
  { date: '2026-08-15', title: 'Independence Day', type: 'holiday' },
  { date: '2026-09-14', title: 'Mid sem TCF', type: 'academic' },
  { date: '2026-10-20', title: 'Dussehra', type: 'holiday' },
  { date: '2026-10-24', endDate: '2026-11-01', title: 'Mid Break', type: 'break' },
  { date: '2026-11-08', title: 'Diwali', type: 'holiday' },
  { date: '2026-11-26', title: 'Last Day of Teaching', type: 'academic' },
  { date: '2026-12-07', title: 'Vacation Begins', type: 'break' },
  { date: '2026-12-26', title: 'Christmas', type: 'holiday' },
];

const CampusCalendar: React.FC = () => {
  const [view, setView] = useState<'month' | 'week' | 'day'>('month');
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 1));

  const nextDate = () => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else d.setDate(d.getDate() + 1);
    setCurrentDate(d);
  };

  const prevDate = () => {
    const d = new Date(currentDate);
    if (view === 'month') d.setMonth(d.getMonth() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else d.setDate(d.getDate() - 1);
    setCurrentDate(d);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentDate);
  const calendarDays = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    if (day > 0 && day <= daysInMonth) return day;
    return null;
  });

  const getEventsForDay = (day: number) => {
    const checkDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    return ACADEMIC_EVENTS.filter(e => {
      const start = new Date(e.date);
      if (e.endDate) {
        const end = new Date(e.endDate);
        return checkDate >= start && checkDate <= end;
      }
      return start.toDateString() === checkDate.toDateString();
    });
  };

  const getEventStyle = (type: string) => {
    switch (type) {
      case 'holiday': return 'bg-red-50 border-red-200 text-red-600';
      case 'break': return 'bg-amber-50 border-amber-200 text-amber-600';
      case 'academic': return 'bg-blue-50 border-blue-200 text-blue-600';
      case 'fest': return 'bg-purple-50 border-purple-200 text-purple-600';
      default: return 'bg-slate-50 border-slate-200 text-slate-600';
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden mt-12">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex flex-col lg:flex-row justify-between items-center gap-6">
        <div className="flex flex-col">
          <h3 className="text-xl font-black text-slate-800 tracking-tight uppercase">Academic Calendar 2026</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">{currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
            {(['month', 'week', 'day'] as const).map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                  view === v ? 'bg-[#5b5fc7] text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {v}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button onClick={prevDate} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">❮</button>
            <button onClick={nextDate} className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center hover:bg-slate-50 transition-all">❯</button>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Calendar Legend */}
        <div className="flex flex-wrap gap-4 px-2">
          {[
            { label: 'Public Holidays', color: 'bg-red-500' },
            { label: 'Mid/Summer Breaks', color: 'bg-amber-500' },
            { label: 'Academic Milestones', color: 'bg-blue-500' },
            { label: 'Campus Fests', color: 'bg-purple-500' },
          ].map(item => (
            <div key={item.label} className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</span>
            </div>
          ))}
        </div>

        {view === 'month' && (
          <div className="grid grid-cols-7 border-t border-l border-slate-100">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="p-4 border-r border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50/30 text-center">
                {d}
              </div>
            ))}
            {calendarDays.map((day, i) => {
              const events = day ? getEventsForDay(day) : [];
              return (
                <div key={i} className={`min-h-[160px] p-4 border-r border-b border-slate-100 group transition-all ${day ? 'hover:bg-slate-50/50' : 'bg-slate-50/10'}`}>
                  {day && (
                    <div className="flex flex-col h-full">
                      <span className={`text-sm font-black transition-colors mb-2 ${events.some(e => e.type === 'holiday') ? 'text-red-500' : 'text-slate-300 group-hover:text-slate-800'}`}>{day}</span>
                      <div className="space-y-1 overflow-y-auto max-h-[100px] scrollbar-hide">
                        {events.map((e, ei) => (
                          <div key={ei} className={`px-2 py-1.5 rounded border-l-2 text-[9px] font-bold leading-tight ${getEventStyle(e.type)}`}>
                            {e.title}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {view === 'week' && (
          <div className="space-y-4">
             {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((dayName, idx) => {
               const dayDate = new Date(currentDate);
               const diff = currentDate.getDay() - (currentDate.getDay() === 0 ? -6 : 1);
               dayDate.setDate(currentDate.getDate() - diff + idx);
               const events = ACADEMIC_EVENTS.filter(e => {
                 const start = new Date(e.date);
                 if (e.endDate) {
                    const end = new Date(e.endDate);
                    return dayDate >= start && dayDate <= end;
                 }
                 return start.toDateString() === dayDate.toDateString();
               });

               return (
                 <div key={dayName} className={`flex gap-6 items-start p-6 rounded-2xl border transition-all ${events.length > 0 ? 'bg-white border-slate-200 shadow-sm' : 'border-slate-50 opacity-40'}`}>
                    <div className="w-16 flex flex-col items-center">
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{dayName}</span>
                       <span className={`text-2xl font-black ${events.some(e => e.type === 'holiday') ? 'text-red-500' : 'text-slate-800'}`}>{dayDate.getDate()}</span>
                    </div>
                    <div className="flex-1 space-y-3">
                       {events.length > 0 ? events.map((e, ei) => (
                         <div key={ei} className={`p-5 rounded-2xl border shadow-sm flex flex-col gap-2 group transition-all ${getEventStyle(e.type)}`}>
                            <p className="text-[9px] font-black uppercase tracking-[0.2em] opacity-60">{e.type}</p>
                            <h4 className="text-lg font-black tracking-tight">{e.title}</h4>
                            <p className="text-[10px] font-bold opacity-60">Full Day Event • Campus Hub Kamand</p>
                         </div>
                       )) : (
                         <p className="text-[10px] text-slate-400 font-medium italic mt-2">No scheduled academic activity.</p>
                       )}
                    </div>
                 </div>
               );
             })}
          </div>
        )}

        {view === 'day' && (
          <div className="space-y-6 max-w-2xl mx-auto py-12">
            <div className="text-center space-y-2 mb-12">
              <h4 className="text-4xl font-black text-slate-800 tracking-tight">{currentDate.getDate()} {currentDate.toLocaleString('default', { month: 'long' })}</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Campus Timeline Status</p>
            </div>
            
            <div className="space-y-4">
              {ACADEMIC_EVENTS.filter(e => {
                const start = new Date(e.date);
                if (e.endDate) {
                  const end = new Date(e.endDate);
                  return currentDate >= start && currentDate <= end;
                }
                return start.toDateString() === currentDate.toDateString();
              }).map((e, ei) => (
                <div key={ei} className={`p-10 rounded-[40px] border flex flex-col justify-between gap-6 transition-all ${getEventStyle(e.type)}`}>
                  <div className="space-y-3">
                    <span className="px-3 py-1 bg-white/20 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/20">{e.type}</span>
                    <h5 className="text-3xl font-black tracking-tight">{e.title}</h5>
                    <p className="text-[11px] font-bold opacity-70 leading-relaxed max-w-md">This event is part of the official IIT Mandi 2026 Academic Calendar. Please refer to the Dean (Academics) office for any official changes.</p>
                  </div>
                </div>
              ))}
              
              {ACADEMIC_EVENTS.filter(e => {
                const start = new Date(e.date);
                if (e.endDate) {
                  const end = new Date(e.endDate);
                  return currentDate >= start && currentDate <= end;
                }
                return start.toDateString() === currentDate.toDateString();
              }).length === 0 && (
                <div className="text-center py-24 border-2 border-dashed border-slate-100 rounded-[40px]">
                  <span className="text-4xl block mb-4">📖</span>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest">Normal Teaching/Research Day</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const DEFAULT_CAMPUS_IMAGES = [
  "https://www.iitmandi.ac.in/main/images/slider/campus_view.jpg",
  "https://www.iitmandi.ac.in/main/images/slider/slide3.jpg",
  "https://www.iitmandi.ac.in/main/images/slider/slide1.jpg"
];

const FALLBACK_CAMPUS_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop";

interface DashboardProps {
  role: UserRole;
  subTab: string;
  onNavigateToHub?: (section: 'ANNOUNCEMENTS' | 'CARPOOL') => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ role, subTab, onNavigateToHub }) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [logoFailed, setLogoFailed] = useState(false);
  const [sliderImages, setSliderImages] = useState(DEFAULT_CAMPUS_IMAGES);

  const nextImage = () => {
    setCurrentImgIndex((prev) => (prev + 1) % sliderImages.length);
  };

  const prevImage = () => {
    setCurrentImgIndex((prev) => (prev - 1 + sliderImages.length) % sliderImages.length);
  };

  const handleSliderError = (index: number) => {
    if (sliderImages[index] !== FALLBACK_CAMPUS_IMAGE) {
      const newImages = [...sliderImages];
      newImages[index] = FALLBACK_CAMPUS_IMAGE;
      setSliderImages(newImages);
    }
  };

  const renderSubContent = () => {
    switch (subTab) {
      case 'exams':
        return (
          <div className="px-12 py-20 space-y-12">
            <h2 className="text-3xl font-black text-[#1a1a1a]">Exam Schedule</h2>
            <div className="bento-card overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-[#f9f9fb] border-b border-black/5">
                  <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-10 py-5">Date</th>
                    <th className="px-10 py-5">Course Code</th>
                    <th className="px-10 py-5">Course Name</th>
                    <th className="px-10 py-5">Venue</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5 text-sm">
                  {[
                    { date: '02 Mar 2026', code: 'CS301', name: 'Database Management', venue: 'LT-1, North Campus' },
                    { date: '04 Mar 2026', code: 'CS302', name: 'Software Engineering', venue: 'LT-2, North Campus' },
                    { date: '06 Mar 2026', code: 'CS303', name: 'Theory of Computation', venue: 'LT-1, North Campus' },
                    { date: '09 Mar 2026', code: 'HS201', name: 'Professional Ethics', venue: 'Main Auditorium' },
                    { date: '11 Mar 2026', code: 'CS351', name: 'Artificial Intelligence', venue: 'CS Lab 1' },
                    { date: '13 Mar 2026', code: 'CS352', name: 'Web Technologies', venue: 'CS Lab 2' },
                    { date: '16 Mar 2026', code: 'MA201', name: 'Numerical Methods', venue: 'LT-1, North Campus' },
                    { date: '18 Mar 2026', code: 'EC210', name: 'Signal Processing', venue: 'Main Auditorium' },
                  ].map((exam, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-colors">
                      <td className="px-10 py-6 font-bold">{exam.date}</td>
                      <td className="px-10 py-6 font-mono text-purple-600">{exam.code}</td>
                      <td className="px-10 py-6">{exam.name}</td>
                      <td className="px-10 py-6 text-slate-500">{exam.venue}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      default:
        return (
          <div className="bg-white">
            <div className="bg-white border-b border-slate-200 shadow-[0_4px_12px_rgba(0,0,0,0.04)] px-6 py-8">
              <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
                <div className="w-[60px] sm:w-[80px] shrink-0 flex items-center justify-center">
                  {!logoFailed ? (
                    <img 
                      src="https://www.iitmandi.ac.in/images/logo.png" 
                      alt="IIT Mandi Logo" 
                      className="w-full h-auto object-contain"
                      style={{ width: '80px' }}
                      onError={() => setLogoFailed(true)}
                    />
                  ) : (
                    <div className="w-[60px] sm:w-[80px] h-[60px] sm:h-[80px] bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
                      <span className="text-[#1e40af] font-black text-xl tracking-tighter">IIT</span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-0.5">
                  <h1 
                    className="text-[1.5rem] font-medium text-[#1e40af] leading-tight"
                    style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                  >
                    भारतीय प्रौद्योगिकी संस्थान मण्डी
                  </h1>
                  <h2 className="text-[1.25rem] font-bold text-[#1e293b] tracking-tight uppercase leading-tight">
                    INDIAN INSTITUTE OF TECHNOLOGY MANDI
                  </h2>
                </div>
              </div>
            </div>

            <section className="relative w-full aspect-[21/9] min-h-[500px] overflow-hidden group shadow-2xl bg-slate-100">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={currentImgIndex}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.6, ease: "easeInOut" }}
                  src={sliderImages[currentImgIndex]} 
                  alt={`Campus View ${currentImgIndex + 1}`}
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  onError={() => handleSliderError(currentImgIndex)}
                />
              </AnimatePresence>
              
              <button 
                onClick={prevImage}
                className="absolute left-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 z-10 backdrop-blur-sm"
              >
                <span className="text-3xl font-bold">❮</span>
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-10 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-black/30 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-black/60 z-10 backdrop-blur-sm"
              >
                <span className="text-3xl font-bold">❯</span>
              </button>

              <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {sliderImages.map((_, i) => (
                  <div 
                    key={i} 
                    className={`h-1.5 rounded-full transition-all ${i === currentImgIndex ? 'w-8 bg-white' : 'w-2 bg-white/40'}`} 
                  />
                ))}
              </div>
            </section>

            <section className="px-12 py-24 bg-white">
              <div className="flex flex-col lg:flex-row justify-between items-start gap-16">
                <div className="space-y-8 flex-1">
                  <h2 className="text-6xl font-bold text-[#1a1a1a] relative inline-block">
                    About IIT Mandi
                    <div className="absolute -bottom-3 left-0 w-full h-[6px] bg-[#0070c0]" />
                  </h2>
                  <p className="max-w-4xl text-xl text-[#616161] leading-relaxed pt-4 font-medium">
                    Indian Institute of Technology Mandi (IIT Mandi) is one of the eight newer IITs established by the Ministry of Education, Government of India. Nestled in the picturesque Uhl River valley in the Shivalik Range of the Himalayas, the campus provides a serene and innovative environment for over 2,400 students and world-class faculty.
                  </p>
                  <p className="max-w-4xl text-lg text-[#86868b] leading-relaxed font-medium">
                    The Institute offers an environment that fosters curiosity and innovation. Our mission is to be a leader in science and technology education, knowledge creation, and innovation, in an India-centric and world-relevant manner.
                  </p>
                </div>
                
                <div className="w-full lg:w-96 space-y-8">
                  <button className="w-full bg-[#FFB81C] text-[#002147] py-6 px-8 rounded-sm font-black text-base uppercase tracking-[0.2em] shadow-xl hover:bg-[#e0a21a] hover:-translate-y-1 transition-all">
                    DIRECTOR'S OFFICE
                  </button>
                  <div className="bento-card p-10 border-l-[12px] border-l-[#0070c0] bg-[#f8f9fa] shadow-lg">
                    <p className="text-[11px] font-black text-[#86868b] uppercase tracking-[0.4em] mb-4">Strategic Focus</p>
                    <h4 className="text-xl font-bold text-[#1a1a1a] leading-tight mb-3 tracking-tight">Sustainable Mountain Development</h4>
                    <p className="text-sm text-[#616161] font-medium leading-relaxed">Pioneering green technologies for the Himalayan region and establishing a world-class innovation ecosystem.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Academic Hub Section */}
            <section className="px-12 py-32 border-t border-black/5 bg-[#fdfdfd]">
               <div className="flex flex-col gap-16">
                <div>
                   <p className="text-[#5b5fc7] font-black text-[12px] uppercase tracking-[0.5em] mb-4">University Timeline</p>
                   <h2 className="text-5xl font-black text-[#1a1a1a] tracking-tight">Official Academic Hub</h2>
                   <p className="text-slate-500 text-sm mt-4 font-medium max-w-2xl italic leading-relaxed">
                     The official 2026 Academic Calendar for IIT Mandi. This synchronized temporal hub manages teaching days, examination windows, and official residential breaks.
                   </p>
                </div>
                <CampusCalendar />
              </div>
            </section>

            <section className="px-12 py-32 border-t border-black/5 bg-[#fdfdfd]">
               <div className="flex flex-col gap-16">
                <div>
                   <p className="text-purple-600 font-black text-[12px] uppercase tracking-[0.5em] mb-4">Ecosystem Services</p>
                   <h2 className="text-5xl font-black text-[#1a1a1a] tracking-tight">Unified Digital Hub</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <FeatureCard 
                    icon="📂" 
                    title="Academic Vault" 
                    desc="Unified access to your transcripts and course records in a secure digital hub with instant verification." 
                  />
                  <FeatureCard 
                    icon="🍱" 
                    title="Mess & Hostel" 
                    desc="Manage your dining, rebates, and residential maintenance through a single integrated dashboard." 
                  />
                  <FeatureCard 
                    icon="💼" 
                    title="Career Portal" 
                    desc="Direct linkage to faculty-led research, startup incubation, and global internship opportunities." 
                  />
                </div>
              </div>
            </section>
          </div>
        );
    }
  };

  return (
    <div className="w-full h-full">
      {renderSubContent()}
    </div>
  );
};
