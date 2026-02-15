
import React, { useState, useMemo } from 'react';
import { MessName, MessMenu, ResidentialRequest } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

const MESSES: MessName[] = ['Alder', 'Oak', 'Pine', 'Peepal', 'Tulsi'];
const VEG_MESSES: MessName[] = ['Pine', 'Peepal', 'Tulsi'];

const MOCK_MENU: MessMenu[] = [
  { 
    day: 'Monday', 
    breakfast: 'Aloo onion paratha, Chutney, Curd, Milk, Bread, Butter & Jam, Tea/Coffee/Bournvita, Sprouts', 
    lunch: 'Rajma, Cabbage-Matar, Jeera Rice, Roti, Curd, Green Salad', 
    snacks: 'Tea/Coffee/Biscuits', 
    dinner: 'Sarson Ka Saag, Dal Tadka, Rice Kheer, Roti, Rice, Green Salad' 
  },
  { 
    day: 'Tuesday', 
    breakfast: 'Poori Chana, Halwa, Daliya/Milk, Bread, Butter & Jam, Tea/Coffee/Bournvita, Sprouts', 
    lunch: 'Mix Dal, Veg Kofta, Roti, Rice, Green Salad', 
    snacks: 'Tea/Coffee/Samosa', 
    dinner: 'Lauki Chana, Dal Makhni, Motichur Laddu, Roti, Rice, Green Salad' 
  },
  { 
    day: 'Wednesday', 
    breakfast: 'Mix Paratha, Dhaniya Chutney, Curd, Fruits/2 Eggs, Milk, Bread, Butter & Jam, Tea/Coffee/Bournvita, Sprouts', 
    lunch: 'Kadhi Pakora, Aloo Zeera, Masala Papad/Fryums, Roti, Jeera Rice, Green Salad', 
    snacks: 'Tea/Coffee/Biscuits', 
    dinner: 'Paneer Do Pyaza/Chicken Curry, Dal Fry, Sooji Ka Halwa, Roti, Rice, Green Salad' 
  },
  { 
    day: 'Thursday', 
    breakfast: 'Idli, Sambar & Chutney, Fruits/2 Eggs, Daliya/Milk, Bread, Butter & Jam, Tea/Coffee/Bournvita, Sprouts', 
    lunch: 'Sitaful, White Chole, Poori, Masala Chaach, Rice, Green Salad', 
    snacks: 'Tea/Coffee/Pakora', 
    dinner: 'Mix Veg, Black Masoor Dal, Gulab Jamun/Rasgulla, Roti, Rice, Green Salad' 
  },
  { 
    day: 'Friday', 
    breakfast: 'Uttapam, Sambhar, Chutney, Fruits/2 Omelette, Daliya/Milk, Bread, Butter & Jam, Tea/Coffee/Bournvita, Sprouts', 
    lunch: 'Aloo Gazar Gobhi, Moong Masoor Dal, Rice, Bundi Raita, Green Salad', 
    snacks: 'Tea/Coffee/Biscuits', 
    dinner: 'Palak Paneer/Egg Curry, Roongi Dal, Balushaahi, Roti, Rice, Green Salad' 
  },
  { 
    day: 'Saturday', 
    breakfast: 'Methi/Palak Paratha, Aloo Tamatar Sabji, 2 Banana/2 Eggs, Milk, Bread, Butter & Jam, Tea/Coffee/Bournvita, Sprouts', 
    lunch: 'Dry Paneer/Egg Bhurji, Chana Dal, Roti, Rice, Green Salad', 
    snacks: 'Tea/Coffee/Mathri', 
    dinner: 'Aloo Matar, Arhar Dal, Garam Sewayi, Roti, Rice, Green Salad' 
  },
  { 
    day: 'Sunday', 
    breakfast: 'Masala Onion Dosa, Sambhar, Coconut Chutney, Daliya/Milk, Bread, Butter & Jam, Tea/Coffee/Bournvita, Sprouts', 
    lunch: 'Bhature, Chole, Green Chutney, Fried Masala Khichdi, Butter Milk, Salad', 
    snacks: 'Tea/Coffee/Biscuits', 
    dinner: 'Paneer/Chicken Biryani, Aloo Soyabean, Veg Raita, Ice-Cream/Gajar Halwa, Roti, Green Salad' 
  },
];

const HOSTEL_CHARGES = [
  { item: 'Hostel Fees', amount: 25000 },
  { item: 'Electricity & Water', amount: 2500 },
  { item: 'Medical Insurance', amount: 1000 },
  { item: 'Hostel Security', amount: 10000 },
];

const MESS_CHARGES = [
  { item: 'Mess Fees', amount: 18000 },
  { item: 'Mess Admission Fee', amount: 1000 },
];

const WARDEN_CONTACTS = [
  { name: 'Dr. Arjun Mehta', contact: '+91 98765 43210', post: 'Chief Warden' },
  { name: 'Dr. Kavita Rao', contact: '+91 87654 32109', post: 'Warden (Surajtaal)' },
  { name: 'Prof. Rajesh Khanna', contact: '+91 76543 21098', post: 'Associate Warden' },
];

const EMERGENCY_HELPLINES = [
  { name: 'Campus Security', number: '01905-267112' },
  { name: 'Medical Emergency', number: '01905-267015' },
  { name: 'Ambulance', number: '102 / 108' },
];

const MAINTENANCE_LOGS = [
  { hostel: 'Surajtaal - α', tasks: [
    { item: 'Water Filter', date: '2026-03-05' },
    { item: 'Geyser Check', date: '2026-03-12' },
    { item: 'Washing Machine', date: '2026-03-20' }
  ]},
  { hostel: 'Surajtaal - β', tasks: [
    { item: 'Oven/Kettle', date: '2026-03-08' },
    { item: 'Water Filter', date: '2026-03-15' },
    { item: 'Geyser Check', date: '2026-03-22' }
  ]}
];

interface AccordionSectionProps {
  title: string;
  id: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
  icon?: string;
  badge?: string;
  badgeColor?: string;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({ title, id, isOpen, onToggle, children, icon, badge, badgeColor }) => (
  <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mb-4">
    <button 
      onClick={() => onToggle(id)}
      className="w-full flex items-center justify-between p-6 text-left group transition-colors hover:bg-slate-50"
    >
      <div className="flex items-center gap-4">
        {icon && <span className="text-xl">{icon}</span>}
        <h3 className="text-lg font-bold text-slate-800">{title}</h3>
        {badge && (
          <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest ${badgeColor || 'bg-slate-100 text-slate-500'}`}>
            {badge}
          </span>
        )}
      </div>
      <motion.span 
        animate={{ rotate: isOpen ? 180 : 0 }}
        className="text-blue-600 transition-colors"
      >
        ▼
      </motion.span>
    </button>
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-slate-100"
        >
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const MessHostelPortal: React.FC = () => {
  const [activeMess, setActiveMess] = useState<MessName>('Alder');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'warden-contacts': false,
    'emergency-support': false,
    'maintenance': false
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [activeLink, setActiveLink] = useState<string | null>(null);
  const [linkSubView, setLinkSubView] = useState<'form' | 'history'>('form');
  const [showPaymentGateways, setShowPaymentGateways] = useState(false);
  const [requestHistory, setRequestHistory] = useState<ResidentialRequest[]>([]);

  const filteredMenu = useMemo(() => {
    const isVeg = VEG_MESSES.includes(activeMess);
    if (!isVeg) return MOCK_MENU;

    const nonVegTerms = ['Chicken', 'Egg', 'Omelette', 'Bhurji', 'Biryani', 'Fish', 'Mutton'];
    return MOCK_MENU.map(item => {
      const clean = (str: string) => str.split(', ').filter(part => !nonVegTerms.some(term => part.toLowerCase().includes(term.toLowerCase()))).join(', ');
      return {
        ...item,
        breakfast: clean(item.breakfast),
        lunch: clean(item.lunch),
        dinner: clean(item.dinner),
      };
    });
  }, [activeMess]);

  const handleLinkRequest = (type: ResidentialRequest['type'], details: any) => {
    const newReq: ResidentialRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0],
      details
    };
    setRequestHistory([newReq, ...requestHistory]);
    setLinkSubView('history');
  };

  const billingCalculations = useMemo(() => {
    const hostelTotal = HOSTEL_CHARGES.reduce((acc, c) => acc + c.amount, 0);
    const messTotal = MESS_CHARGES.reduce((acc, c) => acc + c.amount, 0);
    const subtotal = hostelTotal + messTotal;
    const gst = subtotal * 0.18;
    const total = subtotal + gst;
    return { hostelTotal, messTotal, subtotal, gst, total };
  }, []);

  const QuickLinkButton = ({ id, icon, label }: { id: string, icon: string, label: string }) => (
    <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-blue-300 transition-all shadow-sm">
      <button 
        onClick={() => {
          setActiveLink(activeLink === id ? null : id);
          setLinkSubView('form');
        }}
        className="w-full flex items-center justify-between p-6 text-left group"
      >
        <div className="flex items-center gap-4">
          <span className="text-2xl">{icon}</span>
          <span className="text-sm font-bold text-slate-700 tracking-tight">{label}</span>
        </div>
        <motion.span 
          animate={{ rotate: activeLink === id ? 180 : 0 }}
          className="text-blue-600 transition-colors"
        >
          ▼
        </motion.span>
      </button>
      
      <AnimatePresence>
        {activeLink === id && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-slate-100 bg-slate-50/20"
          >
            <div className="flex border-b border-slate-100">
              <button 
                onClick={() => setLinkSubView('form')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${linkSubView === 'form' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Operation
              </button>
              <button 
                onClick={() => setLinkSubView('history')}
                className={`flex-1 py-3 text-[10px] font-black uppercase tracking-widest transition-colors ${linkSubView === 'history' ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                History
              </button>
            </div>
            <div className="p-6">
              {linkSubView === 'form' ? (
                <RequestForm type={id} onSubmit={(data) => handleLinkRequest(id as any, data)} />
              ) : (
                <div className="space-y-3">
                  {requestHistory.filter(r => r.type === id).length > 0 ? (
                    requestHistory.filter(r => r.type === id).map(r => (
                      <div key={r.id} className="p-4 bg-white border border-slate-200 rounded-xl text-[11px] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 shadow-sm">
                        <div className="space-y-1">
                          <p className="font-black text-slate-800 tracking-tight">{r.id} • {r.date}</p>
                          <div className="text-slate-500 font-medium">
                            {Object.entries(r.details).map(([k, v]: any) => (
                              <p key={k} className="capitalize text-[10px]"><span className="text-slate-400 font-bold">{k.replace(/([A-Z])/g, ' $1')}:</span> {v}</p>
                            ))}
                          </div>
                        </div>
                        <span className={`px-3 py-1 self-start sm:self-center rounded-full font-black uppercase tracking-widest text-[9px] border ${
                          r.status === 'PENDING' ? 'bg-amber-50 text-amber-600 border-amber-100' : 
                          r.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'
                        }`}>{r.status}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 opacity-40">
                      <span className="text-4xl block mb-2">📂</span>
                      <p className="text-[10px] font-black uppercase tracking-widest">No local archives</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-slate-800">Mess Menu</h3>
              <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-full">
                {MESSES.map(m => (
                  <button
                    key={m}
                    onClick={() => setActiveMess(m)}
                    className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                      activeMess === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {m} {VEG_MESSES.includes(m) ? '🌱' : '🍖'}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left">
                <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-4 py-3">Day</th>
                    <th className="px-4 py-3">Breakfast</th>
                    <th className="px-4 py-3">Lunch</th>
                    <th className="px-4 py-3">Dinner</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-100">
                  {filteredMenu.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-4 font-bold text-slate-800">{item.day}</td>
                      <td className="px-4 py-4 text-slate-600 text-xs leading-relaxed">{item.breakfast}</td>
                      <td className="px-4 py-4 text-slate-600 text-xs leading-relaxed">{item.lunch}</td>
                      <td className="px-4 py-4 text-slate-600 text-xs leading-relaxed">{item.dinner}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-bold text-slate-800 px-2 tracking-tight">Quick Services</h3>
            <div className="flex flex-col gap-4">
              <QuickLinkButton id="ROOM_CHANGE" icon="🛏️" label="Room Change Request" />
              <QuickLinkButton id="LATE_PASS" icon="🌙" label="Late Night Pass" />
              <QuickLinkButton id="GUEST_BOOKING" icon="👤" label="Guest Room Booking" />
              <QuickLinkButton id="MESS_CHANGE" icon="🍱" label="Mess Change" />
              <QuickLinkButton id="OUT_PASS" icon="🎫" label="Hostel Out-pass" />
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm overflow-hidden relative">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2 text-slate-800">
              <span>💳</span> Billing & Dues
            </h4>
            
            <div className="space-y-6 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-500">Net Payable Amount</span>
                <span className="text-2xl font-mono font-black text-slate-900 tracking-tighter">₹{billingCalculations.total.toLocaleString()}</span>
              </div>
              
              <div className="p-6 bg-blue-50 border border-blue-100 rounded-2xl space-y-4 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-125 duration-500" />
                
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-2 relative z-10">Detailed Breakdown</p>
                
                <div className="space-y-3 relative z-10">
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-blue-800">Hostel Fees Total</span>
                    <span className="text-xs font-mono font-black text-blue-900">₹{billingCalculations.hostelTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[11px] font-bold text-blue-800">Mess Fees Total</span>
                    <span className="text-xs font-mono font-black text-blue-900">₹{billingCalculations.messTotal.toLocaleString()}</span>
                  </div>
                  <div className="pt-2 mt-2 border-t border-blue-200 flex justify-between items-center">
                    <span className="text-[11px] font-black text-blue-600 uppercase">Subtotal</span>
                    <span className="text-sm font-mono font-black text-blue-900">₹{billingCalculations.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-medium text-blue-500 italic">Central Service Tax (18%)</span>
                    <span className="text-xs font-mono font-bold text-blue-700">+ ₹{billingCalculations.gst.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            <button 
              onClick={() => setShowPaymentGateways(!showPaymentGateways)}
              className="w-full bg-blue-600 text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-[0.98]"
            >
              Authorize Secure Payment
            </button>

            <AnimatePresence>
              {showPaymentGateways && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2"
                >
                  {['PhonePe / GPay', 'SBI iCollect', 'Net Banking', 'Visa/MasterCard'].map(gate => (
                    <button key={gate} className="p-3 bg-white border border-slate-200 rounded-xl text-[9px] font-black uppercase text-slate-500 hover:border-blue-300 hover:text-blue-600 hover:shadow-sm transition-all shadow-sm">
                      {gate}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          <AccordionSection 
            title="Warden Contact" 
            id="warden-contacts" 
            isOpen={openSections['warden-contacts']} 
            onToggle={toggleSection}
            icon="👔"
          >
            <div className="space-y-4">
              {WARDEN_CONTACTS.map((w, i) => (
                <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-slate-100 bg-white group hover:border-blue-300 transition-all shadow-sm">
                  <div>
                    <p className="text-xs font-bold text-slate-800">{w.name}</p>
                    <p className="text-[10px] text-slate-400 font-black uppercase mt-0.5 tracking-tight">{w.post}</p>
                  </div>
                  <a href={`tel:${w.contact}`} className="text-[10px] font-mono font-black text-blue-600 hover:underline">{w.contact}</a>
                </div>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Emergency Support" 
            id="emergency-support" 
            isOpen={openSections['emergency-support']} 
            onToggle={toggleSection}
            icon="🚨"
          >
            <div className="space-y-3 bg-red-50 p-4 rounded-xl border border-red-100">
              {EMERGENCY_HELPLINES.map((h, i) => (
                <div key={i} className="flex justify-between items-center text-red-700">
                  <span className="text-[11px] font-bold">{h.name}</span>
                  <a href={`tel:${h.number}`} className="text-[11px] font-mono font-black hover:underline">{h.number}</a>
                </div>
              ))}
            </div>
          </AccordionSection>

          <AccordionSection 
            title="Maintenance Schedule" 
            id="maintenance" 
            isOpen={openSections['maintenance']} 
            onToggle={toggleSection}
            icon="🛠️"
          >
            <div className="space-y-6">
              {MAINTENANCE_LOGS.map((log, i) => (
                <div key={i}>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-3 border-b border-slate-100 pb-1">{log.hostel}</p>
                  <div className="space-y-2">
                    {log.tasks.map((task, j) => (
                      <div key={j} className="flex justify-between items-center py-2 px-3 rounded-xl border border-slate-50 bg-white hover:border-blue-200 transition-all shadow-sm">
                        <span className="text-[11px] text-slate-600 font-bold">{task.item}</span>
                        <span className="text-[10px] text-blue-600 font-black font-mono bg-blue-50 px-2.5 py-1 rounded-lg">{task.date}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </AccordionSection>
        </div>
      </div>
    </div>
  );
};

// Specialized Form Component
const RequestForm: React.FC<{ type: string, onSubmit: (data: any) => void }> = ({ type, onSubmit }) => {
  const [data, setData] = useState<any>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalData = { ...data };
    if (data.reasonType === 'custom') {
      finalData.reason = data.customReason;
      delete finalData.reasonType;
      delete finalData.customReason;
    }
    onSubmit(finalData);
    setData({});
  };

  const inputClass = "w-full bg-white border border-slate-200 p-3.5 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/10 transition-all placeholder:text-slate-300 shadow-sm";
  const labelClass = "text-[9px] font-black text-slate-400 uppercase ml-2 mb-1.5 block tracking-widest";

  switch (type) {
    case 'ROOM_CHANGE':
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Current Room</label>
            <input className={inputClass} placeholder="e.g. S-101" required onChange={e => setData({...data, current: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Preferred Room</label>
            <input className={inputClass} placeholder="e.g. S-202" required onChange={e => setData({...data, preferred: e.target.value})} />
          </div>
          <div>
            <label className={labelClass}>Reason for change</label>
            <textarea className={inputClass} rows={3} placeholder="Provide a valid justification..." required onChange={e => setData({...data, reason: e.target.value})} />
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">Submit Request</button>
        </form>
      );
    case 'LATE_PASS':
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Out Time</label>
              <input type="time" className={inputClass} required onChange={e => setData({...data, out: e.target.value})} />
            </div>
            <div className="flex-1">
              <label className={labelClass}>In Time</label>
              <input type="time" className={inputClass} required onChange={e => setData({...data, in: e.target.value})} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Reason Category</label>
            <select className={inputClass} required onChange={e => setData({...data, reasonType: e.target.value})}>
              <option value="">Select Reason</option>
              <option value="Lab Work / Project">Lab Work / Project</option>
              <option value="Academic Event">Academic Event</option>
              <option value="Personal Reason">Personal Reason</option>
              <option value="custom">Other (Custom)</option>
            </select>
          </div>
          {data.reasonType === 'custom' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
              <label className={labelClass}>Custom Reason</label>
              <input className={inputClass} placeholder="Enter your reason..." required onChange={e => setData({...data, customReason: e.target.value})} />
            </motion.div>
          )}
          <div>
            <label className={labelClass}>Specific Details</label>
            <textarea className={inputClass} rows={2} placeholder="Explain briefly..." onChange={e => setData({...data, details: e.target.value})} />
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">Apply Pass</button>
        </form>
      );
    case 'MESS_CHANGE':
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Previous Mess</label>
              <select className={inputClass} required onChange={e => setData({...data, previousMess: e.target.value})}>
                <option value="">Select</option>
                {MESSES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Preferred Mess</label>
              <select className={inputClass} required onChange={e => setData({...data, preferredMess: e.target.value})}>
                <option value="">Select</option>
                {MESSES.map(m => <option key={m}>{m}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Reason for change</label>
            <select className={inputClass} required onChange={e => setData({...data, reasonType: e.target.value})}>
              <option value="">Select Reason</option>
              <option value="Food Quality Preference">Food Quality Preference</option>
              <option value="Location Convenience">Location Convenience</option>
              <option value="Timing Preference">Timing Preference</option>
              <option value="Dietary Requirements">Dietary Requirements</option>
              <option value="Peer Group Movement">Peer Group Movement</option>
              <option value="custom">Other (Custom)</option>
            </select>
          </div>
          {data.reasonType === 'custom' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
              <label className={labelClass}>Custom Reason</label>
              <input className={inputClass} placeholder="Specify your custom reason..." required onChange={e => setData({...data, customReason: e.target.value})} />
            </motion.div>
          )}
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">Submit Change Request</button>
        </form>
      );
    case 'OUT_PASS':
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Out Date</label>
              <input type="date" className={inputClass} required onChange={e => setData({...data, outDate: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>In Date</label>
              <input type="date" className={inputClass} required onChange={e => setData({...data, inDate: e.target.value})} />
            </div>
          </div>
          <div>
            <label className={labelClass}>Reason Category</label>
            <select className={inputClass} required onChange={e => setData({...data, reasonType: e.target.value})}>
              <option value="">Select Reason</option>
              <option value="Home Visit">Home Visit</option>
              <option value="Emergency">Emergency</option>
              <option value="Internship/Job">Internship/Job</option>
              <option value="custom">Other (Custom)</option>
            </select>
          </div>
          {data.reasonType === 'custom' && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}>
              <label className={labelClass}>Custom Reason</label>
              <input className={inputClass} placeholder="Explain exit purpose..." required onChange={e => setData({...data, customReason: e.target.value})} />
            </motion.div>
          )}
          <div>
            <label className={labelClass}>Brief Context</label>
            <textarea className={inputClass} rows={3} placeholder="Provide details for campus exit..." onChange={e => setData({...data, context: e.target.value})} />
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">Request Exit Pass</button>
        </form>
      );
    case 'GUEST_BOOKING':
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}>Total Rooms</label>
              <input type="number" min="1" className={inputClass} placeholder="0" required onChange={e => setData({...data, rooms: e.target.value})} />
            </div>
            <div>
              <label className={labelClass}>Room Type</label>
              <select className={inputClass} required onChange={e => setData({...data, roomType: e.target.value})}>
                <option value="Single">Single Bedroom</option>
                <option value="Double">Double Bedroom</option>
              </select>
            </div>
          </div>
          <div>
            <label className={labelClass}>Guest Identities</label>
            <textarea className={inputClass} rows={2} placeholder="Names separated by comma..." required onChange={e => setData({...data, guests: e.target.value})} />
          </div>
          <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl text-[10px] font-black flex justify-between text-blue-900 shadow-sm">
            <span>Estimated Billing</span>
            <span className="font-mono">₹{(Number(data.rooms || 0) * 1200).toLocaleString()}</span>
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">Book Guest Room</button>
        </form>
      );
    default:
      return (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className={labelClass}>Description</label>
            <textarea className={inputClass} rows={4} placeholder="Enter full details for administrative review..." required onChange={e => setData({...data, raw: e.target.value})} />
          </div>
          <button className="w-full bg-blue-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-md active:scale-[0.98]">Submit Request</button>
        </form>
      );
  }
};
