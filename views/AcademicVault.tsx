
import React, { useState } from 'react';
import { UserRole, Course } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface CourseDetails extends Course {
  syllabusMid: string[];
  syllabusEnd: string[];
  schedule: { day: string; time: string; venue: string }[];
}

const MOCK_COURSES: CourseDetails[] = [
  { 
    id: '1', code: 'IC-102P', name: 'Foundation of Design Practicum', instructor: 'Deepak Raina', credits: 4, materialsCount: 14, progress: 42,
    syllabusMid: ['Design Thinking Process', 'Prototyping Basics', 'User Research Methodologies', 'Ideation Techniques'],
    syllabusEnd: ['High-fidelity Prototyping', 'User Testing', 'Design Iteration', 'Final Project Presentation'],
    schedule: [
      { day: 'Monday', time: '14:00 - 17:00', venue: 'Design Lab 1' },
      { day: 'Thursday', time: '09:00 - 12:00', venue: 'Design Lab 1' }
    ]
  },
  { 
    id: '2', code: 'IC-113', name: 'Complex and Vector Calculus', instructor: 'Samir Shukla', credits: 2, materialsCount: 22, progress: 38,
    syllabusMid: ['Limit & Continuity', 'Partial Derivatives', 'Multiple Integrals', 'Vector Fields'],
    syllabusEnd: ['Line Integrals', 'Surface Integrals', 'Green’s Theorem', 'Stokes’ Theorem'],
    schedule: [
      { day: 'Tuesday', time: '10:00 - 11:00', venue: 'LT-1' },
      { day: 'Friday', time: '11:00 - 12:00', venue: 'LT-1' }
    ]
  },
  { 
    id: '3', code: 'IC-252', name: 'Probability and Statistics', instructor: 'Dr. Sarita Azad', credits: 4, materialsCount: 18, progress: 55,
    syllabusMid: ['Random Variables', 'Probability Distributions', 'Expectation & Variance', 'Bayes Theorem'],
    syllabusEnd: ['Hypothesis Testing', 'Regression Analysis', 'ANOVA', 'Non-parametric Tests'],
    schedule: [
      { day: 'Monday', time: '09:00 - 10:00', venue: 'LT-2' },
      { day: 'Wednesday', time: '09:00 - 10:00', venue: 'LT-2' },
      { day: 'Friday', time: '14:00 - 16:00', venue: 'Tutorial Block B' }
    ]
  },
  { 
    id: '4', code: 'IC-253', name: 'Programming and Data Structures', instructor: 'Indu Joshi', credits: 3, materialsCount: 25, progress: 48,
    syllabusMid: ['Arrays & Linked Lists', 'Stacks & Queues', 'Time Complexity Analysis', 'Searching & Sorting'],
    syllabusEnd: ['Trees & Graphs', 'Hashing Techniques', 'Dynamic Programming Basics', 'Greedy Algorithms'],
    schedule: [
      { day: 'Tuesday', time: '14:00 - 16:00', venue: 'CS Lab 3' },
      { day: 'Thursday', time: '14:00 - 16:00', venue: 'CS Lab 3' }
    ]
  },
  { 
    id: '5', code: 'IC-161P', name: 'Applied Electronics Lab', instructor: 'Robin Khosla', credits: 2, materialsCount: 10, progress: 62,
    syllabusMid: ['Diode Characteristics', 'Transistor Biasing', 'Op-Amp Basics', 'Rectifiers'],
    syllabusEnd: ['Oscillators', 'Digital Gates', 'Flip-Flops', 'PCB Design Basics'],
    schedule: [
      { day: 'Wednesday', time: '10:00 - 13:00', venue: 'Electronics Lab A' }
    ]
  },
  { 
    id: '6', code: 'IC-140', name: 'Graphic Designs', instructor: 'Deepak Sachan', credits: 4, materialsCount: 12, progress: 30,
    syllabusMid: ['Typography Basics', 'Color Theory', 'Layout Composition', 'Adobe Illustrator Intro'],
    syllabusEnd: ['Branding & Identity', 'UX Principles', 'Motion Graphics', 'Portfolio Construction'],
    schedule: [
      { day: 'Monday', time: '11:00 - 13:00', venue: 'Studio 2' },
      { day: 'Friday', time: '09:00 - 11:00', venue: 'Studio 2' }
    ]
  }
];

const TRANSCRIPT_DATA = [
  { year: '2025-26', sem: 'Sem II (Jan - Apr)', sgpa: 'Ongoing', cgpa: '9.20', status: 'ACTIVE' },
  { year: '2025-26', sem: 'Sem I (Aug - Dec)', sgpa: '9.20', cgpa: '9.20', status: 'COMPLETED' },
];

export const AcademicVault: React.FC<{ role: UserRole }> = ({ role }) => {
  const [activeCourse, setActiveCourse] = useState<CourseDetails | null>(null);

  return (
    <div className="py-8 px-4 md:px-0 relative min-h-screen">
      <div className="space-y-12">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-black/5 pb-10">
          <div className="space-y-1">
            <h3 className="text-4xl font-black text-slate-800 tracking-tight uppercase">Academic Records</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em]">Unified System • 2025-26 Sem II</p>
          </div>
          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl shadow-inner">
            <button className="bg-white text-blue-600 shadow-sm px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest">Current Semester</button>
            <button className="text-slate-400 hover:text-slate-600 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all">Archived Records</button>
          </div>
        </div>

        {/* Grid of Courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {MOCK_COURSES.map(course => (
            <motion.div 
              key={course.id}
              layoutId={`course-card-${course.id}`}
              whileHover={{ y: -8, boxShadow: "0 30px 60px rgba(0,0,0,0.06)" }}
              onClick={() => setActiveCourse(course)}
              className="p-10 rounded-[48px] border border-slate-100 bg-white hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden group shadow-sm"
            >
              <div className="flex justify-between items-start mb-10">
                <span className="font-mono text-[10px] font-black bg-slate-50 text-slate-400 px-4 py-2 rounded-full group-hover:bg-blue-600 group-hover:text-white transition-all uppercase tracking-[0.2em] border border-slate-100 group-hover:border-transparent">
                  {course.code}
                </span>
                <div className="flex flex-col items-end">
                  <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Credits</span>
                  <span className="text-xl font-black text-slate-800">{course.credits}</span>
                </div>
              </div>
              
              <div className="mb-12 min-h-[80px]">
                <h4 className="text-2xl font-black text-slate-800 mb-2 leading-tight tracking-tight group-hover:text-blue-600 transition-colors">{course.name}</h4>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{course.instructor}</p>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-end text-[9px] font-black uppercase tracking-widest text-slate-400">
                  <span>Knowledge Sync</span>
                  <span className="text-blue-600 font-mono text-xs">{course.progress}%</span>
                </div>
                <div className="w-full bg-slate-50 h-2.5 rounded-full overflow-hidden shadow-inner">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${course.progress}%` }}
                    className="bg-blue-600 h-full rounded-full shadow-[0_0_15px_rgba(37,99,235,0.3)]" 
                  />
                </div>
              </div>

              <div className="absolute bottom-0 right-0 w-32 h-32 bg-blue-600/5 -mr-16 -mb-16 rounded-full transition-transform duration-1000 group-hover:scale-150" />
            </motion.div>
          ))}
        </div>

        {/* Temporal Performance Hub (Transcript) */}
        <div className="bg-white rounded-[56px] border border-slate-100 p-12 shadow-sm space-y-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-50 pb-10">
            <div className="space-y-2">
              <p className="text-blue-600 font-black text-[10px] uppercase tracking-[0.4em]">Performance Metadata</p>
              <h4 className="text-4xl font-black text-slate-800 tracking-tighter uppercase">Academic Performance Status</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest max-w-lg leading-relaxed">System tracking active for 10.0 grade point protocol • Continuous synchronization enabled.</p>
            </div>
            <div className="text-right bg-slate-50 p-8 rounded-[32px] border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregated CGPA</p>
              <p className="text-5xl font-black text-blue-600 font-mono leading-none tracking-tighter">9.20</p>
            </div>
          </div>

          <div className="rounded-[32px] border border-slate-50 overflow-hidden shadow-sm">
             <div className="grid grid-cols-4 bg-slate-50/80 p-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
               <span>Academic Cycle</span>
               <span className="text-center">SGPA Protocol</span>
               <span className="text-center">CGPA Protocol</span>
               <span className="text-right">Sync Status</span>
             </div>
             <div>
               {TRANSCRIPT_DATA.map((row, i) => (
                 <div key={i} className={`grid grid-cols-4 items-center p-8 border-b border-slate-50 last:border-0 transition-all group hover:bg-slate-50/50`}>
                   <div className="flex flex-col">
                     <span className="text-sm font-black text-slate-800 tracking-tight">{row.year}</span>
                     <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{row.sem}</span>
                   </div>
                   <div className="text-center">
                     <span className={`font-mono text-base font-black ${row.status === 'ACTIVE' ? 'text-blue-400 animate-pulse italic' : 'text-blue-600'}`}>
                       {row.sgpa}
                     </span>
                   </div>
                   <div className="text-center">
                     <span className="font-mono text-base font-black text-slate-800">{row.cgpa}</span>
                   </div>
                   <div className="text-right">
                     <span className={`text-[9px] px-5 py-2 rounded-full font-black uppercase tracking-[0.15em] border ${
                       row.status === 'COMPLETED' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-sm shadow-emerald-100' 
                        : 'bg-blue-50 text-blue-600 border-blue-100 animate-pulse'
                     }`}>
                       {row.status}
                     </span>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </div>
      </div>

      {/* Course Detail Overlay */}
      <AnimatePresence>
        {activeCourse && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-2xl"
            onClick={() => setActiveCourse(null)}
          >
            <motion.div
              layoutId={`course-card-${activeCourse.id}`}
              className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[64px] shadow-2xl overflow-y-auto custom-scrollbar border border-white/20"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-12 md:p-20 space-y-16">
                {/* Overlay Header */}
                <div className="flex justify-between items-start gap-10">
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <span className="font-mono text-xs font-black bg-blue-600 text-white px-5 py-2 rounded-full uppercase tracking-widest shadow-lg shadow-blue-600/20">
                        {activeCourse.code}
                      </span>
                      <span className="text-[11px] font-black text-slate-400 uppercase tracking-[0.4em]">Course ID: {activeCourse.id.padStart(4, '0')}</span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-black text-slate-800 tracking-tighter leading-none">{activeCourse.name}</h2>
                    <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl border border-slate-100">👨‍🏫</div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Instructor</p>
                        <p className="text-xl font-bold text-slate-800">{activeCourse.instructor}</p>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveCourse(null)}
                    className="w-16 h-16 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all text-xl shadow-inner"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                  {/* Left Column: Syllabus Segregation */}
                  <div className="lg:col-span-2 space-y-12">
                    <div className="space-y-8">
                      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                        <span className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-black">M</span>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Mid Sem Syllabus</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeCourse.syllabusMid.map((topic, i) => (
                          <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:border-blue-200 transition-all">
                            <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-blue-600 shadow-sm">{i+1}</span>
                            <span className="text-sm font-bold text-slate-600">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-8">
                      <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                        <span className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-black">E</span>
                        <h3 className="text-2xl font-black text-slate-800 uppercase tracking-tight">End Sem Syllabus</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {activeCourse.syllabusEnd.map((topic, i) => (
                          <div key={i} className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-100 group hover:border-purple-200 transition-all">
                            <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[10px] font-black text-purple-600 shadow-sm">{i+1}</span>
                            <span className="text-sm font-bold text-slate-600">{topic}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Credits & Schedule */}
                  <div className="space-y-12">
                    <div className="bg-slate-900 rounded-[48px] p-10 text-white relative overflow-hidden shadow-2xl">
                      <div className="relative z-10 space-y-8">
                        <div>
                          <p className="text-blue-400 font-black text-[10px] uppercase tracking-[0.4em] mb-4">Course Credits</p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-7xl font-black tracking-tighter">{activeCourse.credits}</span>
                            <span className="text-xl font-bold opacity-40 uppercase tracking-widest">Points</span>
                          </div>
                        </div>
                        <div className="pt-8 border-t border-white/10 flex justify-between items-center">
                          <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</span>
                          <span className="px-4 py-1.5 bg-blue-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">Authorized</span>
                        </div>
                      </div>
                      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-blue-500/20 blur-3xl rounded-full" />
                    </div>

                    <div className="space-y-8 bg-white border border-slate-100 p-10 rounded-[48px] shadow-sm">
                      <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-[0.4em] mb-4">Weekly Schedule</h4>
                      <div className="space-y-4">
                        {activeCourse.schedule.map((slot, i) => (
                          <div key={i} className="p-6 rounded-3xl bg-slate-50 border border-slate-100 space-y-3 hover:bg-white hover:border-blue-200 transition-all group">
                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight group-hover:text-blue-600 transition-colors">{slot.day}</p>
                            <div className="flex flex-col gap-1">
                              <p className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                                <span className="opacity-40">🕒</span> {slot.time}
                              </p>
                              <p className="text-[11px] font-bold text-slate-500 flex items-center gap-2">
                                <span className="opacity-40">📍</span> {slot.venue}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
