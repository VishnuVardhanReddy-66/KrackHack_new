
import React, { useState } from 'react';
import { UserRole } from '../types';
import { motion } from 'framer-motion';

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

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-white relative overflow-hidden">
      {/* Mesh Decor */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-purple-100 rounded-full blur-[150px] opacity-40 animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-100 rounded-full blur-[150px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-pink-100 rounded-full blur-[120px] opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <div className="w-full max-w-md px-8 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.28, 0.11, 0.32, 1] }}
          className="bg-white/70 backdrop-blur-2xl p-12 rounded-[40px] border border-white/60 shadow-[0_20px_80px_rgba(0,0,0,0.06)]"
        >
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-[#5b5fc7] rounded-2xl shadow-xl mb-6">
              <span className="text-3xl">🛡️</span>
            </div>
            <h1 className="text-3xl font-black text-[#242424] tracking-tight">AEGIS Protocol</h1>
            <p className="text-[#616161] text-xs font-bold mt-2 uppercase tracking-[0.3em]">Access Authorized Node</p>
          </div>

          <div className="flex p-1 bg-black/5 rounded-xl mb-10">
            {(Object.keys(UserRole) as Array<keyof typeof UserRole>).map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(UserRole[role])}
                className={`flex-1 py-2.5 text-[10px] font-black rounded-lg transition-all uppercase tracking-widest ${
                  selectedRole === UserRole[role]
                    ? 'bg-white text-[#242424] shadow-sm'
                    : 'text-[#616161] hover:text-[#242424]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="block text-[10px] font-black text-[#616161] uppercase tracking-widest ml-1">
                {getLabel()}
              </label>
              <input
                type="text"
                required
                value={idValue}
                onChange={(e) => setIdValue(e.target.value)}
                placeholder="Enter identifier..."
                className="w-full bg-white border border-black/5 rounded-xl px-6 py-4 text-[#242424] placeholder:text-[#d2d2d7] focus:ring-2 focus:ring-purple-500/20 outline-none transition-all font-bold"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-[#616161] uppercase tracking-widest ml-1">
                Security Token
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border border-black/5 rounded-xl px-6 py-4 text-[#242424] placeholder:text-[#d2d2d7] focus:ring-2 focus:ring-purple-500/20 outline-none transition-all font-bold"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-5 text-xs uppercase tracking-[0.2em]"
            >
              Authorize Session
            </button>
          </form>

          <div className="mt-12 text-center">
            <p className="text-[#616161] text-[9px] uppercase tracking-[0.4em] font-mono">
              ENCRYPTED SECURE CHANNEL ALPHA
            </p>
          </div>
        </motion.div>
        
        <p className="text-center text-[#86868b] text-[10px] mt-10 leading-relaxed font-medium">
          Authorized personnel only. Infrastructure managed by AEGIS Core. <br />
          Network activity is logged for security auditing.
        </p>
      </div>
    </div>
  );
};
