
import React, { useState, useEffect } from 'react';

interface CampusHubProps {
  initialSection?: 'ANNOUNCEMENTS' | 'CARPOOL' | 'MAP';
}

export const CampusHub: React.FC<CampusHubProps> = ({ initialSection = 'ANNOUNCEMENTS' }) => {
  const [tab, setTab] = useState<'ANNOUNCEMENTS' | 'CARPOOL' | 'MAP'>(initialSection);
  const [mapLoading, setMapLoading] = useState(true);
  
  // Updated source to official IIT Mandi campus map URL
  const [mapUrl, setMapUrl] = useState("https://www.iitmandi.ac.in/main/images/North_campus_map.jpg");
  const [fallbackLevel, setFallbackLevel] = useState(0);

  // Sync internal tab if initialSection prop changes
  useEffect(() => {
    setTab(initialSection);
  }, [initialSection]);

  const handleMapError = () => {
    if (fallbackLevel === 0) {
      // Try secondary official campus map source
      setMapUrl("https://www.iitmandi.ac.in/main/images/Campus_map_new.jpg");
      setFallbackLevel(1);
    } else if (fallbackLevel === 1) {
      // Final attempt: Reliable archive link for the same map
      setMapUrl("https://raw.githubusercontent.com/iit-mandi/campus-map/master/north_campus.jpg");
      setFallbackLevel(2);
      setMapLoading(false);
    } else {
      setMapLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <div className="flex gap-4 p-1 bg-white border border-slate-200 rounded-2xl w-fit shadow-sm">
        {(['ANNOUNCEMENTS', 'CARPOOL', 'MAP'] as const).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-8 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all ${
              tab === t ? 'bg-[#5b5fc7] text-white shadow-lg' : 'text-slate-500 hover:text-slate-800'
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
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${
                      ann.priority === 'HIGH' ? 'bg-red-500' : 
                      ann.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{ann.priority} Priority</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">{ann.date}</span>
                </div>
                <h4 className="text-xl font-bold text-slate-800 mb-2">{ann.title}</h4>
                <p className="text-slate-600 text-sm leading-relaxed mb-4 font-medium">{ann.content}</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-50">
                  <span className="text-[11px] text-slate-500 font-bold">By: <span className="text-[#5b5fc7] uppercase">{ann.author}</span></span>
                  <button className="text-[#5b5fc7] text-[10px] font-black uppercase tracking-widest hover:underline">Read Full Memo</button>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm h-fit">
            <h4 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Quick Shortcuts</h4>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Exam Portal', icon: '📝' },
                { label: 'Bus Schedule', icon: '🚌' },
                { label: 'Mess Menu', icon: '🍱' },
                { label: 'Hostel Fees', icon: '💳' },
              ].map(item => (
                <button key={item.label} className="p-5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center gap-3 hover:bg-white hover:border-[#5b5fc7]/30 transition-all hover:shadow-md">
                  <span className="text-3xl">{item.icon}</span>
                  <span className="text-[10px] font-black text-slate-600 uppercase tracking-wider">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {tab === 'CARPOOL' && (
        <div className="space-y-8">
          <div className="bg-[#5b5fc7] p-10 rounded-3xl text-white flex flex-col md:flex-row justify-between items-center shadow-xl relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-4xl font-black mb-3 tracking-tight">AEGIS CAB Pools</h4>
              <p className="text-blue-100 font-medium text-lg">Coordinate rides with fellow students & reduce campus footprint.</p>
            </div>
            <button className="mt-6 md:mt-0 bg-white text-[#5b5fc7] px-8 py-4 rounded-xl font-black uppercase tracking-widest shadow-lg hover:bg-blue-50 transition-all z-10">Create Pool</button>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { from: 'Main Gate', to: 'Downtown', time: '18:30', riders: 2, max: 4, author: 'Siddharth' },
              { from: 'Railway Station', to: 'South Campus', time: '09:00', riders: 3, max: 4, author: 'Priyanka' },
              { from: 'Hostel A', to: 'Airport', time: '11:45', riders: 1, max: 4, author: 'Kevin' },
            ].map((pool, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm relative group overflow-hidden hover:shadow-xl transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-2xl shadow-inner">🚗</div>
                  <div>
                    <p className="text-sm font-black text-slate-800">{pool.author}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">Rating: ⭐ 4.9</p>
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Route</span>
                    <span className="text-xs font-bold text-slate-800">{pool.from} → {pool.to}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-slate-50/50">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Departure</span>
                    <span className="text-xs font-mono font-bold text-[#5b5fc7]">{pool.time}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                  <div className="flex -space-x-2">
                    {[...Array(pool.riders)].map((_, j) => (
                      <div key={j} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 shadow-sm" />
                    ))}
                    <div className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-black text-slate-400 shadow-sm">+{pool.max - pool.riders}</div>
                  </div>
                  <button className="text-[#5b5fc7] text-[10px] font-black uppercase tracking-widest group-hover:underline">Request Join</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'MAP' && (
        <div className="bg-white p-1 rounded-3xl border border-slate-200 shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 min-h-[700px]">
           <div className="relative w-full min-h-[700px] bg-[#0c0c14] overflow-hidden group flex items-center justify-center">
              {mapLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 bg-[#0c0c14]">
                  <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-4" />
                  <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em]">Connecting to Campus Satellite...</p>
                </div>
              )}
              
              <img 
                src={mapUrl} 
                alt="IIT Mandi Campus Satellite Map"
                className={`w-full h-full object-contain transition-opacity duration-1000 ${mapLoading ? 'opacity-0' : 'opacity-100'}`}
                onLoad={() => setMapLoading(false)}
                onError={handleMapError}
              />
              
              <div className="absolute bottom-10 left-10 flex flex-col gap-3 z-30">
                <button className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl hover:bg-white hover:text-black transition-all active:scale-95">
                  <span className="text-xl">+</span>
                </button>
                <button className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl flex items-center justify-center font-black text-white shadow-2xl hover:bg-white hover:text-black transition-all active:scale-95">
                  <span className="text-xl">-</span>
                </button>
              </div>

              <div className="absolute top-10 right-10 bg-black/40 backdrop-blur-2xl px-8 py-4 rounded-full border border-white/10 flex items-center gap-4 shadow-2xl z-30">
                 <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                 <span className="text-[11px] font-black text-white uppercase tracking-[0.25em]">IIT Mandi North Campus Active</span>
              </div>

              <div className="absolute top-10 left-10 z-30">
                <div className="bg-purple-600/90 backdrop-blur-md px-6 py-3 rounded-lg border border-purple-400/30">
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">Satellite View</p>
                  <h4 className="text-xl font-black text-white tracking-tight">Kamand Valley Node</h4>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};
