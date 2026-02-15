import React, { useState, useMemo } from 'react';
import { UserRole, Course, User, Announcement } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';

interface CourseDetails extends Course {
  syllabusMid: string[];
  syllabusEnd: string[];
  midSemDate: string;
  endSemDate: string;
  teacher: string;
}

const GRADE_POINTS: Record<string, number> = {
  'S': 10, 'A': 9, 'B': 8, 'C': 7, 'D': 6, 'E': 4, 'F': 0
};

interface AcademicVaultProps {
  user: User;
  onBroadcast?: (ann: Announcement) => void;
  allCourses?: CourseDetails[];
  onAddCourse?: (course: any) => void;
  onRemoveCourse?: (id: string) => void;
}

export const AcademicVault: React.FC<AcademicVaultProps> = ({ 
  user, 
  allCourses = [],
  onAddCourse,
  onRemoveCourse
}) => {
  const [activeCourse, setActiveCourse] = useState<CourseDetails | null>(null);
  const [viewType, setViewType] = useState<'CURRENT' | 'ARCHIVED' | 'GPA'>('CURRENT');
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [isAddingCourse, setIsAddingCourse] = useState(false);
  
  // Course Form State (for Admin)
  const [courseData, setCourseData] = useState({
    code: '',
    name: '',
    credits: 3,
    instructor: '',
    syllabusMid: '',
    syllabusEnd: '',
    midSemDate: '',
    endSemDate: ''
  });

  const isFaculty = user.role === UserRole.FACULTY;
  const isAdmin = user.role === UserRole.ADMIN;
  const currentSemester = user.semester || 1;

  const gpaStats = useMemo(() => {
    if (isFaculty || isAdmin) return null;
    
    const semData: { sem: number, sgpa: string, credits: number }[] = [];
    let totalPoints = 0;
    let totalCredits = 0;

    for (let s = 1; s < currentSemester; s++) {
      const semCourses = allCourses.filter(c => c.semester === s && c.grade);
      const semCredits = semCourses.reduce((acc, c) => acc + c.credits, 0);
      const semPoints = semCourses.reduce((acc, c) => acc + (c.credits * GRADE_POINTS[c.grade || 'F']), 0);
      
      const sgpa = semCredits ? (semPoints / semCredits).toFixed(2) : '0.00';
      semData.push({ sem: s, sgpa, credits: semCredits });
      
      totalPoints += semPoints;
      totalCredits += semCredits;
    }

    const cgpa = totalCredits ? (totalPoints / totalCredits).toFixed(2) : '0.00';
    return { cgpa, semHistory: semData };
  }, [isFaculty, isAdmin, currentSemester, allCourses]);

  const displayedCourses = useMemo(() => {
    if (isAdmin) {
      return allCourses.filter(c => c.semester === selectedSemester);
    }
    if (isFaculty) {
      return allCourses.filter(c => c.instructor.includes(user.name.replace('Prof. ', ''))); 
    }
    if (viewType === 'CURRENT') {
      return allCourses.filter(c => c.semester === currentSemester);
    } else if (viewType === 'ARCHIVED') {
      return allCourses.filter(c => c.semester < currentSemester);
    }
    return [];
  }, [viewType, currentSemester, isFaculty, isAdmin, allCourses, user.name, selectedSemester]);

  const handlePostCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddCourse) return;
    const newCourse = {
      id: `${selectedSemester}-${courseData.code}`,
      code: courseData.code,
      name: courseData.name,
      credits: courseData.credits,
      instructor: courseData.instructor,
      teacher: courseData.instructor,
      semester: selectedSemester,
      materialsCount: 0,
      progress: 0,
      syllabusMid: courseData.syllabusMid.split(',').map(s => s.trim()),
      syllabusEnd: courseData.syllabusEnd.split(',').map(s => s.trim()),
      midSemDate: courseData.midSemDate || 'TBD',
      endSemDate: courseData.endSemDate || 'TBD',
    };
    onAddCourse(newCourse);
    setIsAddingCourse(false);
    setCourseData({ code: '', name: '', credits: 3, instructor: '', syllabusMid: '', syllabusEnd: '', midSemDate: '', endSemDate: '' });
  };

  return (
    <div className="py-12 px-6 md:px-12 relative min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        
        <header className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8 border-b border-black/5 pb-12">
          <div className="space-y-2">
            <h3 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              {isAdmin ? 'Course Registry' : 'Academic Vault'}
            </h3>
            <div className="flex items-center gap-4 text-slate-400">
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Node ID: {user.id}</span>
               <div className="w-1 h-1 bg-slate-200 rounded-full" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">Auth Level: {user.role}</span>
            </div>
          </div>
          
          {!isAdmin && (
            <div className="flex items-center gap-10 bg-white p-8 rounded-[40px] border border-slate-100 shadow-xl shadow-slate-200/40">
              <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Aggregated CGPA</p>
                  <p className="text-4xl font-black text-[#5b5fc7] leading-none">{gpaStats?.cgpa || '0.00'}</p>
              </div>
              <div className="w-px h-12 bg-slate-100" />
              <div className="text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">{isFaculty ? 'Teaching' : 'Current'} Semester</p>
                  <p className="text-4xl font-black text-slate-800 leading-none">0{currentSemester}</p>
              </div>
            </div>
          )}

          {isAdmin && (
            <div className="flex items-center gap-6">
              <button 
                onClick={() => setIsAddingCourse(true)}
                className="bg-indigo-600 text-white px-10 py-5 rounded-[24px] font-black text-[11px] uppercase tracking-widest shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all"
              >
                Provision Course ⊕
              </button>
            </div>
          )}
        </header>

        {isAdmin ? (
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
             <div className="flex gap-6 items-center">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Semester Node:</span>
                <div className="flex gap-2">
                   {[1,2,3,4,5,6,7,8].map(s => (
                     <button
                        key={s}
                        onClick={() => setSelectedSemester(s)}
                        className={`w-12 h-12 rounded-2xl font-black text-xs transition-all ${selectedSemester === s ? 'bg-indigo-600 text-white shadow-lg' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                     >
                       0{s}
                     </button>
                   ))}
                </div>
             </div>
             <div className="text-right">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Active Registry</p>
                <p className="text-sm font-bold text-slate-800">Semester 0{selectedSemester} Cluster</p>
             </div>
          </div>
        ) : (
          <div className="flex gap-4 p-1.5 bg-slate-100/50 rounded-2xl w-fit border border-slate-200/60">
            {(['CURRENT', 'ARCHIVED', 'GPA'] as const).map(t => (
              <button
                key={t}
                onClick={() => setViewType(t)}
                className={`px-10 py-3 rounded-xl text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
                  viewType === t ? 'bg-[#5b5fc7] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {t === 'GPA' ? 'GPA Protocol' : `${t} Nodes`}
              </button>
            ))}
          </div>
        )}

        <AnimatePresence mode="wait">
          {viewType === 'GPA' && !isAdmin && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-[48px] border border-slate-100 p-12 shadow-sm"
            >
              <h4 className="text-2xl font-black text-slate-800 mb-10 tracking-tight uppercase">Registry History (SGPA)</h4>
              <div className="overflow-hidden rounded-3xl border border-slate-50">
                <table className="w-full text-left">
                  <thead className="bg-slate-50">
                    <tr className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                      <th className="px-10 py-6">Semester Node</th>
                      <th className="px-10 py-6">Course Count</th>
                      <th className="px-10 py-6">Credits Earned</th>
                      <th className="px-10 py-6">SGPA Efficiency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {gpaStats?.semHistory.map((h) => (
                      <tr key={h.sem} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-10 py-6 font-black text-slate-800 uppercase tracking-tighter">Semester 0{h.sem}</td>
                        <td className="px-10 py-6 text-slate-500 font-bold">{allCourses.filter(c => c.semester === h.sem).length} Units</td>
                        <td className="px-10 py-6 text-slate-500 font-bold">{h.credits} Credits</td>
                        <td className="px-10 py-6">
                           <span className="text-xl font-black text-[#5b5fc7] tracking-tight">{h.sgpa}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {viewType !== 'GPA' && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {displayedCourses.length > 0 ? displayedCourses.map((course) => (
                <motion.div 
                  key={course.id} 
                  layoutId={course.id}
                  onClick={() => setActiveCourse(course)}
                  whileHover={{ y: -10, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.08)" }}
                  className="bg-white p-10 rounded-[56px] border border-slate-100 shadow-sm cursor-pointer group flex flex-col justify-between h-[380px] transition-all relative overflow-hidden"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">{course.code}</span>
                        <h4 className="text-2xl font-black text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors">{course.name}</h4>
                      </div>
                      {course.grade && !isAdmin && (
                        <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-3xl flex items-center justify-center border border-emerald-100">
                           <span className="text-xl font-black">{course.grade}</span>
                        </div>
                      )}
                      {isAdmin && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); onRemoveCourse?.(course.id); }}
                          className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-500 hover:text-white flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                    <div className="flex flex-col gap-2">
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Instructor: {course.instructor}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{course.credits} Academic Credits</p>
                    </div>
                  </div>

                  {!isAdmin && (
                    <div className="space-y-4">
                      <div className="flex justify-between text-[9px] font-black text-slate-300 uppercase tracking-widest">
                          <span>Registry Sync</span>
                          <span>{course.progress || 0}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                          <motion.div 
                            initial={{ width: 0 }} 
                            animate={{ width: `${course.progress || 0}%` }} 
                            className="h-full bg-indigo-500" 
                          />
                      </div>
                    </div>
                  )}

                  {isAdmin && (
                    <div className="pt-6 border-t border-slate-50 mt-auto">
                       <p className="text-indigo-600 font-black text-[9px] uppercase tracking-widest">Edit Node Protocol ❯</p>
                    </div>
                  )}
                </motion.div>
              )) : (
                <div className="col-span-full py-40 bg-slate-50/50 border-2 border-dashed border-slate-200/50 rounded-[64px] flex flex-col items-center justify-center">
                  <span className="text-7xl block mb-8 grayscale opacity-20">📡</span>
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.5em]">No records found for this registry node</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Detail Modal */}
      {createPortal(
        <AnimatePresence>
          {activeCourse && (
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-slate-900/40 backdrop-blur-3xl flex items-center justify-center p-6"
              onClick={() => setActiveCourse(null)}
            >
              <motion.div 
                layoutId={activeCourse.id}
                className="bg-white rounded-[64px] w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl p-16 space-y-12 relative scroll-smooth"
                onClick={e => e.stopPropagation()}
              >
                <button onClick={() => setActiveCourse(null)} className="absolute top-10 right-10 w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-800 transition-all text-xl">✕</button>

                <div className="space-y-8">
                  <div className="space-y-2">
                    <p className="text-indigo-600 font-black text-[10px] uppercase tracking-[0.4em]">{activeCourse.code} • Institutional Registry</p>
                    <h3 className="text-5xl font-black text-slate-900 tracking-tighter leading-none">{activeCourse.name}</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-10 border-t border-slate-50">
                    <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-50">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Instructor</p>
                       <p className="text-sm font-bold text-slate-800">{activeCourse.teacher}</p>
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-50">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Credits</p>
                       <p className="text-sm font-bold text-slate-800">{activeCourse.credits} Units</p>
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Mid-Sem Date</p>
                       <p className="text-sm font-bold text-slate-800">{activeCourse.midSemDate}</p>
                    </div>
                    <div className="bg-slate-50/50 p-6 rounded-[32px] border border-slate-100">
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">End-Sem Date</p>
                       <p className="text-sm font-bold text-slate-800">{activeCourse.endSemDate}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                   <div className="space-y-6">
                      <h4 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                         <span className="w-2 h-2 bg-indigo-500 rounded-full" />
                         Mid-Sem Syllabus
                      </h4>
                      <div className="space-y-3">
                        {activeCourse.syllabusMid?.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                             <span className="text-[10px] font-black text-slate-300">0{i+1}</span>
                             <p className="text-sm font-medium text-slate-600">{item}</p>
                          </div>
                        )) || <p className="text-xs text-slate-400">Registry content pending...</p>}
                      </div>
                   </div>
                   <div className="space-y-6">
                      <h4 className="text-xl font-black text-slate-800 uppercase tracking-widest flex items-center gap-3">
                         <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                         End-Sem Syllabus
                      </h4>
                      <div className="space-y-3">
                        {activeCourse.syllabusEnd?.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
                             <span className="text-[10px] font-black text-slate-300">0{i+1}</span>
                             <p className="text-sm font-medium text-slate-600">{item}</p>
                          </div>
                        )) || <p className="text-xs text-slate-400">Registry content pending...</p>}
                      </div>
                   </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* Add Course Modal (Admin Only) */}
      {isAdmin && createPortal(
        <AnimatePresence>
          {isAddingCourse && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[1000] bg-slate-900/60 backdrop-blur-3xl flex items-center justify-center p-6" onClick={() => setIsAddingCourse(false)}>
              <motion.div className="bg-white rounded-[56px] w-full max-w-3xl overflow-hidden shadow-2xl p-16 space-y-10" onClick={e => e.stopPropagation()}>
                <h3 className="text-4xl font-black text-slate-800 tracking-tighter uppercase leading-none">Provision Course Node - Sem 0{selectedSemester}</h3>
                <form onSubmit={handlePostCourse} className="space-y-8">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Unique Code</label>
                       <input required className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. CS101" value={courseData.code} onChange={e => setCourseData({...courseData, code: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Registry Title</label>
                       <input required className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Intro to ML" value={courseData.name} onChange={e => setCourseData({...courseData, name: e.target.value})} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Credits</label>
                       <input required type="number" className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="0" value={courseData.credits} onChange={e => setCourseData({...courseData, credits: parseInt(e.target.value)})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Lead Instructor</label>
                       <input required className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="Dr. Name" value={courseData.instructor} onChange={e => setCourseData({...courseData, instructor: e.target.value})} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mid-Sem Syllabus (Comma Separated)</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Unit 1, Unit 2" value={courseData.syllabusMid} onChange={e => setCourseData({...courseData, syllabusMid: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">End-Sem Syllabus (Comma Separated)</label>
                       <input className="w-full bg-slate-50 border border-slate-100 rounded-[24px] px-8 py-5 font-bold outline-none focus:ring-2 focus:ring-indigo-500/20" placeholder="e.g. Unit 3, Final Review" value={courseData.syllabusEnd} onChange={e => setCourseData({...courseData, syllabusEnd: e.target.value})} />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-indigo-600 text-white py-6 rounded-[24px] font-black uppercase tracking-widest shadow-xl active:scale-[0.98] transition-all">Provision Registry ❯</button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
};