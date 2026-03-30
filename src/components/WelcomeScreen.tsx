import React, { useState } from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../utils/sound';

type WelcomeScreenProps = {
  onStart: (nickname: string) => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      playClickSound();
      onStart(name.trim());
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Image Layer */}
      <div 
        className="absolute inset-0 z-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1537210249814-b9a10a161ae4?auto=format&fit=crop&q=80&w=1920&h=1080")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.6) contrast(1.2) saturate(1.2)'
        }}
      />
      
      {/* Galaxy / Milky Way Overlay Effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
        {/* Nebula Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[140%] h-[140%] opacity-40" style={{
          background: `
            radial-gradient(circle at 20% 30%, #312e81 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, #4c1d95 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, #1e1b4b 0%, transparent 70%),
            radial-gradient(circle at 70% 20%, #0f172a 0%, transparent 40%)
          `,
          filter: 'blur(80px)',
          transform: 'rotate(-15deg)'
        }} />
        
        {/* Stars Layer */}
        <div className="absolute inset-0 opacity-50" style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 10%, white, transparent),
            radial-gradient(1px 1px at 20% 30%, white, transparent),
            radial-gradient(1px 1px at 30% 50%, white, transparent),
            radial-gradient(1px 1px at 40% 80%, white, transparent),
            radial-gradient(1px 1px at 50% 20%, white, transparent),
            radial-gradient(1px 1px at 60% 70%, white, transparent),
            radial-gradient(1px 1px at 70% 40%, white, transparent),
            radial-gradient(1px 1px at 80% 90%, white, transparent),
            radial-gradient(1px 1px at 90% 10%, white, transparent),
            radial-gradient(2px 2px at 15% 15%, #94a3b8, transparent),
            radial-gradient(2px 2px at 85% 85%, #94a3b8, transparent),
            radial-gradient(1.5px 1.5px at 45% 45%, #f8fafc, transparent),
            radial-gradient(1.5px 1.5px at 75% 25%, #f8fafc, transparent)
          `,
          backgroundSize: '400px 400px'
        }} />

        {/* Milky Way Core Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[40%] opacity-20 rotate-[-35deg]" style={{
          background: 'radial-gradient(ellipse at center, #6366f1 0%, transparent 70%)',
          filter: 'blur(100px)'
        }} />
      </div>

      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="bg-slate-800/60 backdrop-blur-lg p-10 rounded-3xl shadow-2xl max-w-2xl w-full text-center border border-slate-700/50 overflow-hidden relative z-20"
      >
        <h1 className="text-5xl font-black text-white mb-2 tracking-tight">수학 원정대</h1>
        <h2 className="text-emerald-400 font-bold text-2xl mb-12">연산의 탑</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="원정대원 이름 입력"
              className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-4 text-white text-center text-xl font-bold focus:outline-none focus:border-emerald-500 transition-colors placeholder:text-slate-500"
              maxLength={10}
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xl py-4 rounded-xl transition-all active:scale-95"
          >
            모험 시작하기
          </button>
        </form>
      </motion.div>
    </div>
  );
}
