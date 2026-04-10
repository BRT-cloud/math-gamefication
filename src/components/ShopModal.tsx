import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Shield, Coins, Heart, Search, Crown, Magnet, Sword, Zap, Flame, Dices, Feather, Sparkles, Shirt } from 'lucide-react';
import { UserState } from '../utils/storage';
import { playCoinSound, playIncorrectSound, playClickSound } from '../utils/sound';
import { AlertModal } from './Dialog';

type ShopModalProps = {
  state: UserState;
  setState: React.Dispatch<React.SetStateAction<UserState | null>>;
  onClose: () => void;
  onSync?: () => void;
};

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

const RARITY_STYLES: Record<Rarity, string> = {
  common: 'bg-slate-800 border-slate-700',
  rare: 'bg-blue-900/40 border-blue-500/50',
  epic: 'bg-purple-900/40 border-purple-500/50',
  legendary: 'bg-amber-900/40 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]',
};

const ITEMS = [
  // Consumables (Common)
  { id: 'heart_potion', type: 'consumable', rarity: 'common' as Rarity, name: '하트 물약', desc: '체력 1 회복', price: 30, icon: Heart, color: 'text-rose-500', action: (s: UserState) => ({ ...s, items: { ...s.items, heart_potion: s.items.heart_potion + 1 } }) },
  { id: 'sacred_shield', type: 'consumable', rarity: 'common' as Rarity, name: '신성한 방패', desc: '오답 시 하트 감소 방어 (1회용)', price: 40, icon: Shield, color: 'text-sky-400', action: (s: UserState) => ({ ...s, items: { ...s.items, sacred_shield: s.items.sacred_shield + 1 } }) },
  { id: 'magic_magnifier', type: 'consumable', rarity: 'common' as Rarity, name: '마법 돋보기', desc: '문제의 힌트/공식을 알려줌', price: 20, icon: Search, color: 'text-emerald-400', action: (s: UserState) => ({ ...s, items: { ...s.items, magic_magnifier: s.items.magic_magnifier + 1 } }) },
  { id: 'lucky_horseshoe', type: 'consumable', rarity: 'common' as Rarity, name: '행운의 편자', desc: '다음 3문제 골드 2배', price: 50, icon: Magnet, color: 'text-amber-500', action: (s: UserState) => ({ ...s, items: { ...s.items, lucky_horseshoe: s.items.lucky_horseshoe + 1 } }) },
  
  // Consumables (Rare & Epic)
  { id: 'answer_magnet', type: 'consumable', rarity: 'rare' as Rarity, name: '정답 자석', desc: '3문제 동안 오답 하나 제거 (객관식)', price: 150, icon: Magnet, color: 'text-pink-400', action: (s: UserState) => ({ ...s, items: { ...s.items, answer_magnet: s.items.answer_magnet + 1 } }) },
  { id: 'lucky_dice', type: 'consumable', rarity: 'rare' as Rarity, name: '행운의 주사위', desc: '클리어 시 골드 1~3배 랜덤 획득', price: 200, icon: Dices, color: 'text-emerald-300', action: (s: UserState) => ({ ...s, items: { ...s.items, lucky_dice: s.items.lucky_dice + 1 } }) },
  { id: 'resurrection_feather', type: 'consumable', rarity: 'epic' as Rarity, name: '부활의 깃털', desc: '게임 오버 시 절반의 체력으로 부활', price: 400, icon: Feather, color: 'text-cyan-300', action: (s: UserState) => ({ ...s, items: { ...s.items, resurrection_feather: s.items.resurrection_feather + 1 } }) },

  // Equipment (Epic & Legendary)
  { id: 'fairy_dust', type: 'equipment', rarity: 'epic' as Rarity, name: '요정의 가루 (오라)', desc: '움직일 때 반짝이는 잔상 효과', price: 500, icon: Sparkles, color: 'text-pink-300', action: (s: UserState) => ({ ...s, ownedItems: [...s.ownedItems, 'fairy_dust'] }) },
  { id: 'flames_of_wrath', type: 'equipment', rarity: 'epic' as Rarity, name: '분노의 불길 (오라)', desc: '발밑에서 솟구치는 불길 이펙트', price: 600, icon: Flame, color: 'text-orange-500', action: (s: UserState) => ({ ...s, ownedItems: [...s.ownedItems, 'flames_of_wrath'] }) },
  { id: 'ice_shield', type: 'equipment', rarity: 'legendary' as Rarity, name: '얼음 방패', desc: '투명한 푸른색 방패와 눈송이 효과', price: 700, icon: Shield, color: 'text-cyan-200', action: (s: UserState) => ({ ...s, ownedItems: [...s.ownedItems, 'ice_shield'] }) },
  { id: 'fire_sword', type: 'equipment', rarity: 'legendary' as Rarity, name: '화염의 검', desc: '검 주변에서 붉은색 파티클이 일렁임', price: 800, icon: Sword, color: 'text-red-500', action: (s: UserState) => ({ ...s, ownedItems: [...s.ownedItems, 'fire_sword'] }) },
  { id: 'thunder_staff', type: 'equipment', rarity: 'legendary' as Rarity, name: '번개 지팡이', desc: '공격 시 번개 애니메이션 발생', price: 900, icon: Zap, color: 'text-yellow-300', action: (s: UserState) => ({ ...s, ownedItems: [...s.ownedItems, 'thunder_staff'] }) },
  { id: 'void_armor', type: 'equipment', rarity: 'legendary' as Rarity, name: '심연의 갑옷', desc: '보라색 아우라가 몸을 감쌈', price: 1200, icon: Shield, color: 'text-purple-500', action: (s: UserState) => ({ ...s, ownedItems: [...s.ownedItems, 'void_armor'] }) },
  { id: 'golden_crown', type: 'equipment', rarity: 'legendary' as Rarity, name: '황금 왕관', desc: '닉네임 옆에 표시되는 명예 아이템', price: 500, icon: Crown, color: 'text-yellow-400', action: (s: UserState) => ({ ...s, ownedItems: [...s.ownedItems, 'golden_crown'] }) },
];

export function ShopModal({ state, setState, onClose, onSync }: ShopModalProps) {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmItem, setConfirmItem] = useState<typeof ITEMS[0] | null>(null);

  const isThursday = new Date().getDay() === 4;
  const availableItems = [...ITEMS];
  if (isThursday) {
    availableItems.push({
      id: 'burning_thursday_cloak', type: 'equipment', rarity: 'legendary' as Rarity, name: '불타는 목요일 망토', desc: '목요일 한정! 불타오르는 망토', price: 1000, icon: Shirt, color: 'text-orange-500', action: (s: UserState) => ({ ...s, ownedItems: [...s.ownedItems, 'burning_thursday_cloak'] })
    });
  }

  const handleBuyClick = (item: typeof ITEMS[0]) => {
    if (item.type === 'equipment' && state.ownedItems.includes(item.id)) {
      playIncorrectSound();
      setAlertMessage('이미 보유하고 있는 아이템입니다.');
      return;
    }

    if (state.gold < item.price) {
      playIncorrectSound();
      setAlertMessage('골드가 부족합니다!');
      return;
    }

    if (item.price >= 500) {
      playClickSound();
      setConfirmItem(item);
    } else {
      executePurchase(item);
    }
  };

  const executePurchase = (item: typeof ITEMS[0]) => {
    playCoinSound();
    setState(prev => {
      if (!prev) return prev;
      const newState = item.action(prev);
      return {
        ...newState,
        gold: prev.gold - item.price,
      };
    });
    setConfirmItem(null);
    if (onSync) onSync();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 border border-slate-700 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
      >
        <div className="p-6 border-b border-slate-700 flex justify-between items-center bg-slate-800/50 shrink-0">
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <Coins className="w-6 h-6 text-amber-400" />
            아이템 상점
          </h2>
          <button onClick={() => { playClickSound(); onClose(); }} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 bg-slate-900/50 flex-1 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6 bg-slate-800 p-4 rounded-2xl border border-slate-700 shrink-0">
            <span className="text-slate-300 font-bold">보유 골드</span>
            <span className="text-amber-400 font-black text-xl flex items-center gap-1">
              {state.gold} G
            </span>
          </div>

          <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {availableItems.map(item => {
              const isOwned = item.type === 'equipment' && state.ownedItems.includes(item.id);
              return (
                <div key={item.id} className={`${RARITY_STYLES[item.rarity]} p-4 rounded-2xl border flex items-center justify-between transition-transform hover:scale-[1.02]`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl bg-slate-900/80 flex items-center justify-center ${item.color} shadow-inner`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold">{item.name}</h3>
                        {item.rarity === 'legendary' && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full border border-amber-500/30">전설</span>}
                        {item.rarity === 'epic' && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/30">영웅</span>}
                        {item.rarity === 'rare' && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">희귀</span>}
                      </div>
                      <p className="text-slate-300 text-sm mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleBuyClick(item)}
                    disabled={isOwned}
                    className={`${isOwned ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-slate-900'} font-black px-4 py-2 rounded-xl transition-colors flex items-center gap-1 shadow-lg`}
                  >
                    {isOwned ? '보유중' : `${item.price} G`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      <AnimatePresence>
        {confirmItem && (
          <div className="fixed inset-0 bg-black/80 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-slate-800 border border-amber-500/50 rounded-3xl p-6 max-w-sm w-full shadow-[0_0_30px_rgba(245,158,11,0.15)] text-center"
            >
              <div className={`w-20 h-20 mx-auto rounded-2xl bg-slate-900 flex items-center justify-center ${confirmItem.color} mb-4 border border-slate-700`}>
                <confirmItem.icon className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-white mb-2">{confirmItem.name}</h3>
              <p className="text-slate-300 mb-6">정말 구매하시겠습니까?<br/><span className="text-amber-400 font-bold">{confirmItem.price} G</span>가 소모됩니다.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmItem(null)}
                  className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={() => executePurchase(confirmItem)}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-slate-900 font-black py-3 rounded-xl transition-colors"
                >
                  구매하기
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}
    </div>
  );
}
