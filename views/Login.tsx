
import React, { useState } from 'react';
import { UserRole } from '../types';

interface LoginProps {
  onLogin: (role: UserRole, id: string) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.STUDENT);
  const [idValue, setIdValue] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idValue.trim()) {
      onLogin(selectedRole, idValue);
    }
  };

  const getLabel = () => {
    switch (selectedRole) {
      case UserRole.STUDENT: return 'Roll Number';
      case UserRole.FACULTY: return 'Faculty ID';
      case UserRole.ADMIN: return 'Admin ID';
      default: return 'ID';
    }
  };

  const getPlaceholder = () => {
    switch (selectedRole) {
      case UserRole.STUDENT: return 'e.g. B21001';
      case UserRole.FACULTY: return 'e.g. F-1024';
      case UserRole.ADMIN: return 'Administrator Username';
      default: return 'Enter your ID';
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 relative overflow-hidden font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-800 rounded-full blur-[120px]" />
      </div>

      <div className="w-full max-w-md px-6 relative z-10 animate-in fade-in zoom-in duration-500">
        <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/30 mb-4">
              <span className="text-3xl">🛡️</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">AEGIS Protocol</h1>
            <p className="text-slate-400 text-sm mt-2">IIT Mandi Unified Digital Ecosystem</p>
          </div>

          <div className="flex p-1 bg-slate-900/50 rounded-xl mb-8 border border-white/5">
            {(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(UserRole[role])}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  selectedRole === UserRole[role]
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                {getLabel()}
              </label>
              <input
                type="text"
                required
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
                placeholder={getPlaceholder()}
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
              />
            </div>

            <div className="flex items-center justify-between text-[11px] px-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input type="checkbox" className="rounded border-white/10 bg-slate-900" />
                Remember Me
              </label>
              <button type="button" className="text-blue-400 font-bold hover:underline">Forgot ID/Pass?</button>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98]"
            >
              Initialize Session
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 text-[10px] uppercase tracking-widest font-mono">
              Secure Auth Node: 10.42.0.1
            </p>
          </div>
        </div>
        
        <p className="text-center text-slate-600 text-[10px] mt-6 leading-relaxed">
          Access is restricted to authorized personnel of IIT Mandi.<br />
          Unauthorized access attempts are logged and monitored.
        </p>
      </div>
    </div>
  );
};
