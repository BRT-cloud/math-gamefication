import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Shield, Key, Droplet, Coins, FlaskConical } from 'lucide-react';
import { UserState } from '../utils/storage';
import { playCoinSound, playIncorrectSound, playClickSound } from '../utils/sound';
import { AlertModal } from './Dialog';

type ShopModalProps = {
  state: UserState;
  setState: React.Dispatch<React.SetStateAction<UserState | null>>;
  onClose: () => void;
  onSync?: () => void;
};

const ITEMS = [
  { id: 'potion_red', type: 'avatar', name: '빨간 마법 물약', desc: '아바타를 빨간색으로 변경', price: 50, icon: Droplet, color: 'text-red-500', action: (s: UserState) => ({ ...s, avatarColor: 'bg-red-500' }) },
  { id: 'potion_blue', type: 'avatar', name: '파란 마법 물약', desc: '아바타를 파란색으로 변경', price: 50, icon: Droplet, color: 'text-blue-500', action: (s: UserState) => ({ ...s, avatarColor: 'bg-blue-500' }) },
  { id: 'shield', type: 'item', name: '수호의 방패', desc: '틀려도 하트를 1회 보호', price: 30, icon: Shield, color: 'text-slate-400', action: (s: UserState) => ({ ...s, items: { ...s.items, shield: s.items.shield + 1 } }) },
  { id: 'golden_key', type: 'item', name: '황금 열쇠', desc: '다음 스테이지 즉시 오픈', price: 200, icon: Key, color: 'text-amber-400', action: (s: UserState) => ({ ...s, items: { ...s.items, golden_key: s.items.golden_key + 1 } }) },
  { id: 'xp_potion', type: 'item', name: '경험치 물약', desc: '10문제 동안 획득 골드 2배', price: 100, icon: FlaskConical, color: 'text-purple-400', action: (s: UserState) => ({ ...s, items: { ...s.items, xp_potion: s.items.xp_potion + 1 } }) },
];

export function ShopModal({ state, setState, onClose, onSync }: ShopModalProps) {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  const handleBuy = (item: typeof ITEMS[0]) => {
    if (state.gold >= item.price) {
      playCoinSound();
      setState(prev => {
        if (!prev) return prev;
        const newState = item.action(prev);
        return {
          ...newState,
          gold: prev.gold - item.price,
        };
      });
      if (onSync) onSync();
    } else {
      playIncorrectSound();
      setAlertMessage('골드가 부족합니다!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
      >
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-400" />
            아이템 상점
          </h2>
          <button onClick={() => { playClickSound(); onClose(); }} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 bg-slate-900/50">
          <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-2xl border border-slate-700">
            <span className="text-slate-300 font-bold">보유 골드</span>
            <span className="text-amber-400 font-black text-xl flex items-center gap-1">
              {state.gold} G
            </span>
          </div>

          <div className="space-y-4">
            {ITEMS.map(item => (
              <div key={item.id} className="bg-slate-800 p-4 rounded-2xl border border-slate-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center ${item.color}`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{item.name}</h3>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleBuy(item)}
                  className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-black px-4 py-2 rounded-xl transition-colors flex items-center gap-1"
                >
                  {item.price} G
                </button>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </div>
  );
}
