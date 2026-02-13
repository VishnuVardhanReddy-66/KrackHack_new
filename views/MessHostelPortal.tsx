
import React, { useState } from 'react';
import { MessName, MessMenu, GrievanceStatus } from '../types';

const MESSES: MessName[] = ['Alder', 'Oak', 'Pine', 'Peepal', 'Tulsi'];
const HOSTELS = ['Surajtaal - α', 'Surajtaal - β', 'Surajtaal - γ'];

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
  { item: 'Room Rent', amount: 5000, frequency: 'Per Semester' },
  { item: 'Electricity & Water', amount: 2500, frequency: 'Per Semester' },
  { item: 'Medical Insurance', amount: 1000, frequency: 'Annual' },
  { item: 'Hostel Security (Refundable)', amount: 10000, frequency: 'One Time' },
];

const MESS_CHARGES = [
  { item: 'Mess Advance', amount: 15000, frequency: 'Per Semester' },
  { item: 'Mess Admission Fee', amount: 1000, frequency: 'One Time' },
];

export const MessHostelPortal: React.FC = () => {
  const [activeMess, setActiveMess] = useState<MessName>('Alder');
  const [complaintText, setComplaintText] = useState('');
  const [complaintType, setComplaintType] = useState('Mess - Food Quality');
  const [submitted, setSubmitted] = useState(false);

  const handleComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setComplaintText('');
    }, 3000);
  };

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mess Section */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-xl font-bold text-slate-800">Mess Explorer</h3>
              <div className="flex bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-full">
                {MESSES.map(m => (
                  <button
                    key={m}
                    onClick={() => setActiveMess(m)}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all whitespace-nowrap ${
                      activeMess === m ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase">Currently Viewing</p>
                  <p className="text-lg font-bold text-slate-800">{activeMess} Mess - IIT Mandi</p>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-md hover:bg-blue-700 w-full sm:w-auto transition-colors">
                  Apply for Rebate
                </button>
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
                    {MOCK_MENU.map((item, i) => (
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
              <p className="text-[10px] text-center text-slate-400 italic mt-4">
                * Menu transcribed from Mess Committee Schedule (v2024-A). Subject to availability.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">File a Residential Complaint</h3>
            <form onSubmit={handleComplaint} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Category</label>
                  <select 
                    className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    value={complaintType}
                    onChange={(e) => setComplaintType(e.target.value)}
                  >
                    <option>Mess - Food Quality</option>
                    <option>Mess - Hygiene</option>
                    <option>Mess - Service</option>
                    <option>Hostel - Maintenance</option>
                    <option>Hostel - Internet</option>
                    <option>Hostel - Electricity</option>
                    <option>Hostel - Water Supply</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Facility Name</label>
                  <select className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                    <optgroup label="Messes">
                      {MESSES.map(m => <option key={m}>{m} Mess</option>)}
                    </optgroup>
                    <optgroup label="Hostels">
                      {HOSTELS.map(h => <option key={h}>{h}</option>)}
                    </optgroup>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Issue Description</label>
                <textarea 
                  rows={3}
                  className="w-full border border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Describe the issue in detail..."
                  value={complaintText}
                  onChange={(e) => setComplaintText(e.target.value)}
                  required
                />
              </div>
              <button 
                type="submit"
                disabled={submitted}
                className={`w-full py-3 rounded-xl font-bold transition-all shadow-lg ${
                  submitted ? 'bg-emerald-500 text-white' : 'bg-slate-900 text-white hover:bg-black'
                }`}
              >
                {submitted ? '✅ Complaint Lodged Successfully' : 'Submit Complaint to Warden/Committee'}
              </button>
            </form>
          </div>
        </div>

        {/* Sidebar Charges Section */}
        <div className="space-y-6">
          <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
            <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
              <span>💳</span> Billing Details
            </h4>
            
            <div className="space-y-6 relative z-10">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Hostel Charges</p>
                <div className="space-y-2">
                  {HOSTEL_CHARGES.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">{c.item}</span>
                      <span className="font-mono font-bold">₹{c.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Mess Charges</p>
                <div className="space-y-2">
                  {MESS_CHARGES.map((c, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">{c.item}</span>
                      <span className="font-mono font-bold">₹{c.amount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800">
                <div className="bg-blue-600/20 p-4 rounded-xl border border-blue-500/30">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-xs font-bold text-blue-400">Total Outstanding</span>
                    <span className="text-xl font-mono font-bold text-white">₹33,500</span>
                  </div>
                  <p className="text-[10px] text-blue-300">Due Date: 15th Nov, 2023</p>
                  <button className="w-full mt-4 bg-blue-600 py-2 rounded-lg text-sm font-bold hover:bg-blue-500 transition-colors">
                    Pay via SBI iCollect
                  </button>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl -mr-16 -mt-16 pointer-events-none" />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h4 className="text-sm font-bold text-slate-800 uppercase mb-4">Residential Quick Links</h4>
            <div className="space-y-3">
              {[
                { name: 'Room Change Request', icon: '🛏️' },
                { name: 'Late Night Pass', icon: '🌙' },
                { name: 'Guest Room Booking', icon: '👤' },
                { name: 'Mess Rebate History', icon: '📜' },
                { name: 'Hostel Out-pass', icon: '🎫' },
              ].map(link => (
                <button key={link.name} className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-50 hover:bg-slate-50 group transition-all text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{link.icon}</span>
                    <span className="text-xs font-bold text-slate-600">{link.name}</span>
                  </div>
                  <span className="text-slate-300 group-hover:text-blue-600 transition-colors">→</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
