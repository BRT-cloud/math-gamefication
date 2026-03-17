import React from 'react';
import { motion } from 'motion/react';
import { playClickSound } from '../utils/sound';

export function AlertModal({ message, onClose }: { message: string, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
      >
        <p className="text-white text-lg mb-6 font-medium whitespace-pre-wrap">{message}</p>
        <button 
          onClick={() => { playClickSound(); onClose(); }} 
          className="w-full py-3 rounded-xl font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-900 transition-colors"
        >
          확인
        </button>
      </motion.div>
    </div>
  );
}

export function ConfirmModal({ message, onConfirm, onClose }: { message: string, onConfirm: () => void, onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl text-center"
      >
        <p className="text-white text-lg mb-6 font-medium whitespace-pre-wrap">{message}</p>
        <div className="flex gap-3">
          <button 
            onClick={() => { playClickSound(); onClose(); }} 
            className="flex-1 py-3 rounded-xl font-bold bg-slate-700 hover:bg-slate-600 text-white transition-colors"
          >
            취소
          </button>
          <button 
            onClick={() => { playClickSound(); onConfirm(); onClose(); }} 
            className="flex-1 py-3 rounded-xl font-bold bg-rose-500 hover:bg-rose-400 text-white transition-colors"
          >
            확인
          </button>
        </div>
      </motion.div>
    </div>
  );
}
