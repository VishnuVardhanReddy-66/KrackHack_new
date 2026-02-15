
import React, { useState } from 'react';
import { UserRole, Grievance, GrievanceStatus, ComplaintHistoryItem } from '../types';
import { geminiService } from '../services/geminiService';
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

type GrievanceCategory = 'Mess' | 'Staff' | 'Hostel' | 'Teacher' | 'Custom Inquiry';

interface CategoryConfig {
  icon: string;
  subCategories: string[];
}

const CATEGORY_MAP: Record<GrievanceCategory, CategoryConfig> = {
  'Mess': {
    icon: '🍱',
    subCategories: ['Food Quality', 'Hygiene Standards', 'Staff Behavior', 'Menu Non-compliance', 'Utensil Cleanliness']
  },
  'Staff': {
    icon: '👥',
    subCategories: ['Maintenance Delay', 'Security Misbehavior', 'Admin Office Delay', 'General Misconduct']
  },
  'Hostel': {
    icon: '🏢',
    subCategories: ['Water Supply Issue', 'Electricity/Power Cut', 'Internet Connectivity', 'Furniture Damage', 'Washroom Hygiene']
  },
  'Teacher': {
    icon: '👨‍🏫',
    subCategories: ['Course Coverage', 'Grading Grievance', 'Class Absence', 'Teaching Methodology', 'Availability for Doubts']
  },
  'Custom Inquiry': {
    icon: '❓',
    subCategories: ['Academic Query', 'Fee Structure', 'Document Request', 'Campus Event Info', 'Other']
  }
};

export const GrievanceView: React.FC<{ role: UserRole }> = ({ role }) => {
  const [complaints, setComplaints] = useState<ComplaintHistoryItem[]>([
    { id: 'C-001', category: 'Hostel - Water Supply Issue', description: 'No water in Block C since morning.', status: 'RESOLVED', date: '2024-02-10' }
  ]);
  
  const [activeCategory, setActiveCategory] = useState<GrievanceCategory | null>(null);
  const [formData, setFormData] = useState({ subCategory: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'grievance-boxes': true,
    'complaint-history': false,
  });

  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCategorySelect = (category: GrievanceCategory) => {
    setActiveCategory(category);
    setFormData({ subCategory: CATEGORY_MAP[category].subCategories[0], description: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCategory) return;

    setIsSubmitting(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const newC: ComplaintHistoryItem = {
      id: `C-${Math.floor(100 + Math.random() * 900)}`,
      category: `${activeCategory} - ${formData.subCategory}`,
      description: formData.description,
      status: 'PENDING',
      date: new Date().toISOString().split('T')[0]
    };

    setComplaints([newC, ...complaints]);
    setFormData({ subCategory: '', description: '' });
    setActiveCategory(null);
    setIsSubmitting(false);
    setOpenSections(prev => ({ ...prev, 'complaint-history': true }));
  };

  return (
    <motion.div 
      initial="hidden" 
      animate="visible" 
      variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
      className="space-y-12 pb-20 px-4 md:px-0"
    >
      <motion.div variants={itemVariants} className="space-y-2 border-b border-black/5 pb-10">
        <p className="text-blue-600 text-[10px] font-black uppercase tracking-[0.4em]">Integrated Protocol</p>
        <h2 className="text-4xl font-black text-[#1d1d1f] tracking-tight">Unified Redressal Center</h2>
        <p className="text-[#86868b] text-sm font-medium">Categorized grievance submission for specialized administrative response.</p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <AccordionSection 
          title="File a New Grievance" 
          id="grievance-boxes" 
          isOpen={openSections['grievance-boxes']} 
          onToggle={toggleSection}
          icon="⚡"
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
            {(Object.keys(CATEGORY_MAP) as GrievanceCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all ${
                  activeCategory === cat 
                    ? 'bg-blue-600 border-blue-600 shadow-xl shadow-blue-200 text-white scale-105' 
                    : 'bg-white border-slate-100 text-slate-400 hover:border-blue-200 hover:bg-blue-50/50'
                }`}
              >
                <span className="text-3xl mb-3">{CATEGORY_MAP[cat].icon}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest text-center ${activeCategory === cat ? 'text-white' : 'text-slate-600'}`}>
                  {cat}
                </span>
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeCategory && (
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-slate-50/50 border border-slate-100 rounded-3xl p-8"
              >
                <div className="flex items-center gap-3 mb-8">
                  <span className="text-2xl">{CATEGORY_MAP[activeCategory].icon}</span>
                  <h4 className="text-xl font-black text-slate-800 tracking-tight">
                    {activeCategory} Grievance Details
                  </h4>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Specifics</label>
                      <select 
                        required
                        className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm font-bold text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer shadow-sm"
                        value={formData.subCategory}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                      >
                        {CATEGORY_MAP[activeCategory].subCategories.map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Issue Description</label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-5 text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all leading-relaxed shadow-sm"
                      placeholder={`Please describe the ${activeCategory.toLowerCase()} issue in detail...`}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="flex-1 bg-blue-600 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98] disabled:opacity-50"
                    >
                      {isSubmitting ? 'Transmitting...' : 'Submit to Academic Council ❯'}
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setActiveCategory(null)}
                      className="px-8 bg-white border border-slate-200 text-slate-400 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all active:scale-[0.98]"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {!activeCategory && (
            <div className="text-center py-16 border-2 border-dashed border-slate-100 rounded-[40px] bg-slate-50/30">
              <span className="text-4xl block mb-4 opacity-20">📂</span>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Select a Category Above to Initialize Request</p>
            </div>
          )}
        </AccordionSection>

        <AccordionSection 
          title="Grievance Status Tracker" 
          id="complaint-history" 
          isOpen={openSections['complaint-history']} 
          onToggle={toggleSection}
          icon="📊"
          badge={`${complaints.length} Records`}
        >
          <div className="space-y-4">
            {complaints.length > 0 ? complaints.map(c => (
              <div key={c.id} className="p-6 rounded-3xl border border-slate-100 bg-white flex flex-col md:flex-row justify-between md:items-center gap-6 group hover:border-blue-300 transition-all shadow-sm">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-blue-600 font-black bg-blue-50 px-3 py-1 rounded-full">{c.id}</span>
                    <span className="text-xs font-black text-slate-800 uppercase tracking-tight">{c.category}</span>
                  </div>
                  <p className="text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">{c.description}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`text-[9px] font-black uppercase px-4 py-1.5 rounded-full border ${
                    c.status === 'RESOLVED' 
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
                      : 'bg-amber-50 text-amber-600 border-amber-100 animate-pulse'
                  }`}>
                    {c.status}
                  </span>
                  <p className="text-[10px] text-slate-400 font-mono font-bold tracking-tighter opacity-60">Submitted: {c.date}</p>
                </div>
              </div>
            )) : (
              <div className="text-center py-20">
                <span className="text-5xl block mb-4 opacity-10">📭</span>
                <p className="text-[10px] text-slate-300 font-black uppercase tracking-[0.5em]">System Archives Empty</p>
              </div>
            )}
          </div>
        </AccordionSection>
      </motion.div>

      {/* Analytics Card */}
      <motion.div variants={itemVariants} className="bg-slate-900 rounded-[40px] p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-600/10 to-transparent pointer-events-none" />
        <div className="relative z-10 space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            Real-time Resolution Metrics
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-1">
              <p className="text-3xl font-black font-mono">24h</p>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Avg. Response Time</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black font-mono">98%</p>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Resolution Rate</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black font-mono">14</p>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Active Adjudicators</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-black font-mono">1.2k</p>
              <p className="text-[9px] text-white/40 font-black uppercase tracking-widest">Records Processed</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
