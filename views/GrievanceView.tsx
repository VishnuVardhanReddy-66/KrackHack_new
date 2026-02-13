
import React, { useState, useEffect } from 'react';
import { UserRole, Grievance, GrievanceStatus } from '../types';
import { geminiService } from '../services/geminiService';

const MOCK_GRIEVANCES: Grievance[] = [
  {
    id: 'G-001',
    title: 'Lab AC malfunctioning',
    description: 'The air conditioning in Lab 402 has been leaking and making loud noises for 3 days.',
    category: 'Infrastructure',
    status: GrievanceStatus.PENDING,
    submittedBy: 'Alex Johnson',
    submittedDate: '2023-10-24'
  },
  {
    id: 'G-002',
    title: 'WiFi instability in Library',
    description: 'The WiFi signal keeps dropping in the East Wing of the central library.',
    category: 'IT Support',
    status: GrievanceStatus.IN_PROGRESS,
    submittedBy: 'Jamie Doe',
    submittedDate: '2023-10-23'
  }
];

export const GrievanceView: React.FC<{ role: UserRole }> = ({ role }) => {
  const [grievances, setGrievances] = useState<Grievance[]>(MOCK_GRIEVANCES);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newG: Grievance = {
      id: `G-00${grievances.length + 1}`,
      title: newTitle,
      description: newDesc,
      category: aiAnalysis?.category || 'General',
      status: GrievanceStatus.PENDING,
      submittedBy: 'Current User',
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setGrievances([newG, ...grievances]);
    setShowForm(false);
    setNewTitle('');
    setNewDesc('');
    setAiAnalysis(null);
  };

  const handleAiAnalysis = async () => {
    if (!newTitle || !newDesc) return;
    setIsAnalyzing(true);
    const result = await geminiService.analyzeGrievance(newTitle, newDesc);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold text-slate-800">Campus Grievance System</h3>
          <p className="text-slate-500">Track and manage campus issues efficiently.</p>
        </div>
        {role === UserRole.STUDENT && (
          <button 
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors"
          >
            {showForm ? 'Cancel' : 'Submit New Grievance'}
          </button>
        )}
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-in fade-in slide-in-from-top-4">
          <h4 className="text-lg font-bold mb-4 text-slate-800">New Submission</h4>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Issue Title</label>
              <input 
                type="text" 
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Brief summary of the issue"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
              <textarea 
                rows={4}
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Please provide details..."
                required
              />
            </div>
            
            <div className="flex items-center gap-4">
              <button 
                type="button"
                onClick={handleAiAnalysis}
                disabled={isAnalyzing || !newTitle || !newDesc}
                className="text-blue-600 text-sm font-bold flex items-center gap-2 hover:underline disabled:opacity-50"
              >
                {isAnalyzing ? '✨ Analyzing...' : '✨ Smart Categorize (AI)'}
              </button>
              {aiAnalysis && (
                <div className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">
                  Auto-categorized as: <span className="font-bold">{aiAnalysis.category}</span> ({aiAnalysis.urgency} Priority)
                </div>
              )}
            </div>

            <button type="submit" className="w-full bg-slate-800 text-white py-2 rounded-lg font-bold hover:bg-slate-900 transition-colors">
              Submit Grievance
            </button>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {grievances.map((g) => (
          <div key={g.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:border-blue-200 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded">{g.id}</span>
                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${
                  g.status === GrievanceStatus.PENDING ? 'bg-amber-100 text-amber-700' :
                  g.status === GrievanceStatus.IN_PROGRESS ? 'bg-blue-100 text-blue-700' :
                  'bg-emerald-100 text-emerald-700'
                }`}>
                  {g.status}
                </span>
              </div>
              <span className="text-xs text-slate-400">{g.submittedDate}</span>
            </div>
            <h4 className="text-lg font-bold text-slate-800 mb-1">{g.title}</h4>
            <p className="text-slate-600 text-sm mb-4">{g.description}</p>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Category:</span>
                  <span className="text-xs font-semibold text-slate-700">{g.category}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">By:</span>
                  <span className="text-xs font-semibold text-slate-700">{g.submittedBy}</span>
                </div>
              </div>
              {role !== UserRole.STUDENT && g.status !== GrievanceStatus.RESOLVED && (
                <button className="text-blue-600 text-xs font-bold hover:underline">
                  Add Resolution
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
