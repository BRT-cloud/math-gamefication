import React, { useState } from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../utils/sound';
import { Avatar } from './Avatar';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { defaultState } from '../utils/storage';

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
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', bounce: 0.5 }}
        className="bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-700 overflow-hidden"
      >
        <div className="mb-6 bg-slate-900/50 rounded-2xl border border-slate-700/50 overflow-hidden shadow-inner h-64 relative">
          <Canvas camera={{ position: [0, 1.5, 4], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[5, 5, 5]} intensity={1} />
            <Environment preset="city" />
            <Avatar state={defaultState} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={2} />
          </Canvas>
          <div className="absolute bottom-2 right-2 text-[10px] text-slate-500 pointer-events-none opacity-50">
            드래그하여 회전
          </div>
        </div>
        
        <h1 className="text-4xl font-black text-white mb-2 tracking-tight">수학 원정대</h1>
        <p className="text-emerald-400 font-bold text-xl mb-8">연산의 탑</p>
        
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
