
import React, { useState } from 'react';
import { UserRole, Course } from '../types';

const MOCK_COURSES: Course[] = [
  { id: '1', code: 'CS301', name: 'Operating Systems', instructor: 'Dr. Mike Ross', credits: 4, materialsCount: 12, progress: 65 },
  { id: '2', code: 'CS302', name: 'Software Architecture', instructor: 'Prof. Harvey Specter', credits: 3, materialsCount: 8, progress: 82 },
  { id: '3', code: 'CS401', name: 'Machine Learning', instructor: 'Dr. Sarah Paulson', credits: 4, materialsCount: 15, progress: 45 },
];

export const AcademicVault: React.FC<{ role: UserRole }> = ({ role }) => {
  const [activeCourse, setActiveCourse] = useState<Course | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-2xl font-bold text-slate-800">My Courses</h3>
          <div className="flex gap-2">
            <button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded text-sm font-bold">All Semester</button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold">Active</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_COURSES.map(course => (
            <div 
              key={course.id}
              onClick={() => setActiveCourse(course)}
              className={`p-6 rounded-2xl border transition-all cursor-pointer ${
                activeCourse?.id === course.id ? 'border-blue-500 ring-2 ring-blue-500/10 bg-blue-50/30' : 'border-slate-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="font-mono text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">{course.code}</span>
                <span className="text-xs text-slate-400">{course.credits} Credits</span>
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-1">{course.name}</h4>
              <p className="text-slate-500 text-xs mb-4">{course.instructor}</p>
              
              <div className="flex items-center gap-2 mb-2">
                <div className="flex-1 bg-slate-100 h-1.5 rounded-full">
                  <div className="bg-blue-600 h-full" style={{ width: `${course.progress}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-500">{course.progress}%</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{course.materialsCount} Documents Available</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h4 className="text-lg font-bold mb-4">Transcript Preview</h4>
          <div className="space-y-3">
             {[
               { sem: 'Fall 2023', gpa: '3.92', status: 'Completed' },
               { sem: 'Spring 2023', gpa: '3.88', status: 'Completed' },
               { sem: 'Fall 2022', gpa: '3.75', status: 'Completed' },
             ].map((row, i) => (
               <div key={i} className="flex justify-between items-center py-2 border-b border-slate-50 last:border-0">
                 <span className="font-medium text-slate-700">{row.sem}</span>
                 <div className="flex gap-4 items-center">
                   <span className="font-mono font-bold text-blue-600">{row.gpa}</span>
                   <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-1 rounded font-bold">{row.status}</span>
                 </div>
               </div>
             ))}
          </div>
          <button className="w-full mt-6 bg-slate-800 text-white py-2 rounded-lg text-sm font-bold hover:bg-slate-900 transition-colors">
            Request Official Transcript
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit sticky top-0">
        <h4 className="text-lg font-bold text-slate-800 mb-6">Course Materials</h4>
        {activeCourse ? (
          <div className="space-y-4">
            <div className="bg-blue-50 p-4 rounded-xl mb-6">
              <p className="text-xs font-bold text-blue-600 uppercase mb-1">Active Selection</p>
              <p className="text-sm font-bold text-slate-800">{activeCourse.name}</p>
            </div>
            
            <div className="space-y-2">
              {[
                { name: 'Syllabus.pdf', size: '2.4 MB', type: 'PDF' },
                { name: 'Week 1 - Intro.pptx', size: '15.1 MB', type: 'Slides' },
                { name: 'Lecture Notes - OS Kernels.docx', size: '1.2 MB', type: 'Doc' },
                { name: 'Assignment 1 Brief.pdf', size: '540 KB', type: 'PDF' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-100 hover:bg-slate-50 group">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center text-lg">📄</div>
                    <div>
                      <p className="text-sm font-medium text-slate-800 leading-none">{doc.name}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{doc.size} · {doc.type}</p>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-blue-600">
                    <span className="text-lg">⬇️</span>
                  </button>
                </div>
              ))}
            </div>

            {role === UserRole.FACULTY && (
              <button className="w-full mt-6 border-2 border-dashed border-slate-300 py-4 rounded-xl text-slate-500 font-bold hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                + Upload New Material
              </button>
            )}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">📁</div>
            <p className="text-slate-500 text-sm">Select a course to view materials</p>
          </div>
        )}
      </div>
    </div>
  );
};
