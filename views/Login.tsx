
import React, { useState } from 'react';
import { UserRole } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface LoginProps {
  onLogin: (role: UserRole, id: string, semester?: number) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [semesterCycle, setSemesterCycle] = useState<'ODD' | 'EVEN'>('ODD');
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const id = rollNumber.trim();

    if (role === UserRole.ADMIN) {
      if (id === 'Error' && password === '404') {
        onLogin(UserRole.ADMIN, 'Error');
      } else {
        setError('Unauthorized Admin Access. Invalid system key.');
      }
      return;
    }

    if (role === UserRole.FACULTY) {
      const facultyRegex = /^f(\d{3})$/i;
      const match = id.match(facultyRegex);
      if (match) {
        const num = parseInt(match[1]);
        if (num >= 1 && num <= 100) {
          if (password === match[1]) {
            onLogin(UserRole.FACULTY, id.toUpperCase());
          } else {
            setError('Incorrect password. Use the 3-digit suffix (e.g., 001).');
          }
        } else {
          setError('Faculty IDs range from f001 to f100.');
        }
      } else {
        setError('Invalid Faculty ID format. Use f001-f100.');
      }
      return;
    }

    if (role === UserRole.STUDENT) {
      const normalizedRoll = id.toLowerCase();
      const studentRegex = /^b2([2345])(\d{3})$/;
      const match = normalizedRoll.match(studentRegex);

      if (!match) {
        setError('Invalid Roll Number. Use b2[Year][001-500].');
        return;
      }

      const yearDigit = match[1];
      const sequence = match[2];
      if (password !== sequence) {
        setError('Incorrect password. Use the last 3 digits of your ID.');
        return;
      }

      const semMapOdd: Record<string, number> = { '5': 1, '4': 3, '3': 5, '2': 7 };
      const semMapEven: Record<string, number> = { '5': 2, '4': 4, '3': 6, '2': 8 };
      const mappedSemester = semesterCycle === 'ODD' ? semMapOdd[yearDigit] : semMapEven[yearDigit];
      
      onLogin(UserRole.STUDENT, normalizedRoll.toUpperCase(), mappedSemester);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f5f5f7]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white rounded-[48px] shadow-2xl p-10 border border-slate-100"
      >
        <div className="text-center space-y-4 mb-10">
          <div className="w-20 h-20 bg-purple-600 rounded-[28px] flex items-center justify-center text-4xl mx-auto shadow-xl shadow-purple-200">
            🛡️
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">AEGIS Protocol</h1>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Multi-Factor Secure Node Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex bg-slate-100 p-1.5 rounded-2xl">
            {(Object.values(UserRole)).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => { setRole(r); setError(null); }}
                className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  role === r ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Identity Tag</label>
              <input 
                required
                type="text"
                value={rollNumber}
                onChange={(e) => { setRollNumber(e.target.value); setError(null); }}
                placeholder={role === UserRole.STUDENT ? "b25001" : role === UserRole.FACULTY ? "f001" : "Admin ID"}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Cipher</label>
              <input 
                required
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                placeholder="••••••••"
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          {role === UserRole.STUDENT && (
            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cycle Sync</label>
              <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
                {(['ODD', 'EVEN'] as const).map(cycle => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setSemesterCycle(cycle)}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                      semesterCycle === cycle ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {cycle}
                  </button>
                ))}
              </div>
            </div>
          )}

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="bg-red-50 p-4 rounded-2xl border border-red-100">
                <p className="text-[10px] text-red-600 font-black uppercase tracking-widest text-center">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button type="submit" className="w-full bg-purple-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-purple-600/20 active:scale-[0.98]">Authorize ❯</button>
        </form>
      </motion.div>
    </div>
  );
};
