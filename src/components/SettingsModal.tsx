import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Settings2, Trash2, Unlock, Coins, BookX } from 'lucide-react';
import { UserState } from '../utils/storage';
import { playClickSound } from '../utils/sound';
import { AlertModal, ConfirmModal } from './Dialog';

import { STAGES } from '../utils/stageData';

type SettingsModalProps = {
  state: UserState;
  setState: React.Dispatch<React.SetStateAction<UserState | null>>;
  onClose: () => void;
  onSync?: () => void;
};

export function SettingsModal({ state, setState, onClose, onSync }: SettingsModalProps) {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ message: string, onConfirm: () => void } | null>(null);

  const handleResetAll = () => {
    playClickSound();
    setConfirmAction({
      message: '모든 데이터가 삭제됩니다. 정말 초기화하시겠습니까?',
      onConfirm: () => {
        localStorage.clear();
        window.location.reload();
      }
    });
  };

  const handleClearWrongProblems = () => {
    playClickSound();
    setConfirmAction({
      message: '오답 노트를 비우시겠습니까?',
      onConfirm: () => {
        setState(prev => prev ? { ...prev, wrong_problems: [] } : prev);
        if (onSync) onSync();
        setTimeout(() => setAlertMessage('오답 노트가 비워졌습니다.'), 100);
      }
    });
  };

  const handleResetGold = () => {
    playClickSound();
    setConfirmAction({
      message: '골드를 0으로 초기화하시겠습니까?',
      onConfirm: () => {
        setState(prev => prev ? { ...prev, gold: 0 } : prev);
        if (onSync) onSync();
        setTimeout(() => setAlertMessage('골드가 초기화되었습니다.'), 100);
      }
    });
  };

  const handleUnlockAll = () => {
    playClickSound();
    setConfirmAction({
      message: '모든 스테이지를 잠금 해제하시겠습니까? (테스트 모드)',
      onConfirm: () => {
        setState(prev => prev ? { ...prev, unlocked_stages: STAGES.map(s => s.id) } : prev);
        if (onSync) onSync();
        setTimeout(() => setAlertMessage('모든 스테이지가 열렸습니다!'), 100);
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Settings2 className="w-6 h-6 text-slate-400" />
            설정 및 관리
          </h2>
          <button onClick={() => { playClickSound(); onClose(); }} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 bg-slate-900/50 space-y-4">
          <button
            onClick={handleClearWrongProblems}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold p-4 rounded-2xl transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <BookX className="w-5 h-5 text-rose-400" />
              <span>오답 노트 비우기</span>
            </div>
          </button>

          <button
            onClick={handleResetGold}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold p-4 rounded-2xl transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Coins className="w-5 h-5 text-amber-400" />
              <span>골드 초기화</span>
            </div>
          </button>

          <button
            onClick={handleUnlockAll}
            className="w-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-bold p-4 rounded-2xl transition-colors flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <Unlock className="w-5 h-5 text-emerald-400" />
              <span>모든 스테이지 잠금 해제 (테스트)</span>
            </div>
          </button>

          <div className="pt-4 border-t border-slate-700">
            <button
              onClick={handleResetAll}
              className="w-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-500 font-bold p-4 rounded-2xl transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <Trash2 className="w-5 h-5" />
                <span>모든 데이터 초기화</span>
              </div>
            </button>
          </div>
        </div>
      </motion.div>

      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}

      {confirmAction && (
        <ConfirmModal 
          message={confirmAction.message} 
          onConfirm={confirmAction.onConfirm} 
          onClose={() => setConfirmAction(null)} 
        />
      )}
    </div>
  );
}
