
import React, { useState } from 'react';

export const CampusHub: React.FC = () => {
  const [tab, setTab] = useState<'ANNOUNCEMENTS' | 'CARPOOL' | 'MAP'>('ANNOUNCEMENTS');

  return (
    <div className="space-y-6">
      <div className="flex gap-4 p-1 bg-white border border-slate-200 rounded-2xl w-fit">
        {(['ANNOUNCEMENTS', 'CARPOOL', 'MAP'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
              tab === t ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'ANNOUNCEMENTS' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {[
              { title: 'Campus Network Maintenance', author: 'IT Admin', date: '2 hours ago', content: 'Scheduled maintenance for the campus backbone network will occur this Sunday from 2 AM to 6 AM.', priority: 'HIGH' },
              { title: 'Annual Cultural Fest Registrations', author: 'Student Council', date: '5 hours ago', content: 'Registrations for Aegis Fest 2024 are now open. Grab your slots for competitive programming and tech quiz!', priority: 'MEDIUM' },
              { title: 'New Research Grants Available', author: 'Research Office', date: '1 day ago', content: 'Applications are invited for the quarterly research grant for interdisciplinary projects.', priority: 'LOW' },
            ].map((ann, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      ann.priority === 'HIGH' ? 'bg-red-500' : 
                      ann.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ann.priority} Priority</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">{ann.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-4">{ann.content}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-xs text-slate-500">Posted by: <span className="font-bold text-slate-700">{ann.author}</span></span>
                  <button className="text-blue-600 text-xs font-bold hover:underline">Read Full Memo</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm h-fit">
            <h4 className="text-lg font-bold mb-4">Quick Shortcuts</h4>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Exam Portal', icon: '📝' },
                { label: 'Bus Schedule', icon: '🚌' },
                { label: 'Mess Menu', icon: '🍱' },
                { label: 'Hostel Fees', icon: '💳' },
              ].map(item => (
                <button key={item.label} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-2 hover:bg-slate-100 transition-colors">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-bold text-slate-600">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'CARPOOL' && (
        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center">
            <div>
              <h4 className="text-3xl font-bold mb-2">AEGIS CAB Pools</h4>
              <p className="text-blue-100">Coordinate rides with fellow students & reduce campus footprint.</p>
            </div>
            <button className="mt-6 md:mt-0 bg-white text-blue-600 px-6 py-3 rounded-xl font-bold hover:bg-blue-50 transition-colors">Create Pool</button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { from: 'Main Gate', to: 'Downtown', time: '18:30', riders: 2, max: 4, author: 'Siddharth' },
              { from: 'Railway Station', to: 'South Campus', time: '09:00', riders: 3, max: 4, author: 'Priyanka' },
              { from: 'Hostel A', to: 'Airport', time: '11:45', riders: 1, max: 4, author: 'Kevin' },
            ].map((pool, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-xl">🚗</div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{pool.author}</p>
                    <p className="text-[10px] text-slate-400">Rating: ⭐ 4.9</p>
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">From</span>
                    <span className="text-sm font-bold text-slate-800">{pool.from}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">To</span>
                    <span className="text-sm font-bold text-slate-800">{pool.to}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-slate-500">Time</span>
                    <span className="text-sm font-mono font-bold text-blue-600">{pool.time}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex -space-x-2">
                    {[...Array(pool.riders)].map((_, j) => (
                      <div key={j} className="w-6 h-6 rounded-full border-2 border-white bg-slate-200" />
                    ))}
                    <div className="w-6 h-6 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-400">+{pool.max - pool.riders}</div>
                  </div>
                  <button className="text-blue-600 text-sm font-bold group-hover:underline">Request Join</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'MAP' && (
        <div className="bg-white p-8 rounded-3xl border border-slate-200 min-h-[500px] flex flex-col items-center justify-center text-center">
           <div className="w-full h-96 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 mb-8 relative">
              <span className="text-6xl mb-4">🗺️</span>
              <p className="font-bold">Interactive 3D Campus Map</p>
              <p className="text-sm">Click on buildings for room layouts and contact info</p>
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                <button className="w-8 h-8 bg-white shadow-sm border rounded-lg flex items-center justify-center font-bold text-slate-800">+</button>
                <button className="w-8 h-8 bg-white shadow-sm border rounded-lg flex items-center justify-center font-bold text-slate-800">-</button>
              </div>
           </div>
           <div className="flex gap-4">
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-blue-500"></span>
               <span className="text-xs font-medium text-slate-600">Academic Blocks</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
               <span className="text-xs font-medium text-slate-600">Hostels</span>
             </div>
             <div className="flex items-center gap-2">
               <span className="w-3 h-3 rounded-full bg-amber-500"></span>
               <span className="text-xs font-medium text-slate-600">Dining</span>
             </div>
           </div>
        </div>
      )}
    </div>
  );
};
