import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'motion/react';
import { Lock, Unlock, Star, Map as MapIcon, ChevronRight, Coins, Shield, BookOpen, Store, Settings, Heart, Search, Magnet, Crown, CloudFog, X, Key, FlaskConical } from 'lucide-react';
import { UserState } from '../utils/storage';
import { STAGES } from '../utils/stageData';
import { playClickSound, playItemSound } from '../utils/sound';
import { AlertModal, ConfirmModal } from './Dialog';

type MapScreenProps = {
  state: UserState;
  onSelectStage: (stage: number) => void;
  onOpenShop: () => void;
  onOpenReview: () => void;
  onOpenSettings: () => void;
};

export function MapScreen({ state, onSelectStage, onOpenShop, onOpenReview, onOpenSettings }: MapScreenProps) {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -100]);

  const [selectedItem, setSelectedItem] = useState<{ id: keyof UserState['items'], name: string, desc: string } | null>(null);
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleItemClick = (itemId: keyof UserState['items'], name: string, desc: string) => {
    playClickSound();
    setSelectedItem({ id: itemId, name, desc });
  };

  const unlockedStageIndexes = state.unlocked_stages.map(id => STAGES.findIndex(s => s.id === id)).filter(idx => idx !== -1);
  const maxStageIndex = unlockedStageIndexes.length > 0 ? Math.max(...unlockedStageIndexes) : 0;
  const currentMaxStage = STAGES[maxStageIndex]?.id || 1;

  return (
    <div className="min-h-screen bg-slate-900 text-white pb-32 relative overflow-hidden">
      {/* Parallax Background */}
      <motion.div 
        style={{ y: y1 }}
        className="absolute inset-0 z-0 opacity-30 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-center bg-fixed" />
        <div className="absolute inset-0 bg-slate-900/60" />
      </motion.div>

      {/* Item Usage Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-slate-800 border border-slate-700 rounded-3xl p-6 max-w-sm w-full shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-cyan-400" />
              <button 
                onClick={() => { playClickSound(); setSelectedItem(null); }}
                className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="text-center mb-6 mt-4">
                <div className="w-16 h-16 bg-slate-700 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-inner border border-slate-600">
                  {selectedItem.id === 'golden_key' && <Key className="w-8 h-8 text-amber-400" />}
                  {selectedItem.id === 'xp_potion' && <FlaskConical className="w-8 h-8 text-fuchsia-400" />}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{selectedItem.name}</h3>
                <p className="text-slate-300 text-sm">{selectedItem.desc}</p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => { playClickSound(); setSelectedItem(null); }}
                  className="flex-1 py-3 rounded-xl font-bold bg-slate-700 hover:bg-slate-600 text-white transition-colors"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto p-4 md:p-8 relative z-10">
        <header className="flex flex-col md:flex-row items-center justify-between mb-16 bg-slate-800/80 backdrop-blur-md p-6 rounded-3xl border border-slate-700 shadow-2xl gap-4">
          <div className="flex items-center space-x-4">
            <div className={`w-14 h-14 ${state.avatarColor} rounded-full flex items-center justify-center shadow-lg border-2 border-white/20`}>
              <MapIcon className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight drop-shadow-md flex items-center gap-2">
                {state.nickname} 원정대원
                {state.items.golden_crown > 0 && <Crown className="w-6 h-6 text-yellow-400 drop-shadow-md" />}
              </h1>
              <p className="text-emerald-400 font-bold drop-shadow-md">총 점수: {state.total_score}점</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-wrap justify-center gap-y-3">
            <div className="flex items-center space-x-2 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-700 shadow-inner">
              <Coins className="w-5 h-5 text-amber-400" />
              <span className="font-bold text-amber-400">{state.gold} G</span>
            </div>
            <button 
              onClick={() => { playClickSound(); onOpenShop(); }}
              className="bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <Store className="w-5 h-5" />
              상점
            </button>
            <button 
              onClick={() => { playClickSound(); onOpenReview(); }}
              className="bg-rose-500 hover:bg-rose-400 text-white font-bold px-4 py-2 rounded-xl transition-colors flex items-center gap-2 shadow-lg shadow-rose-500/20"
            >
              <BookOpen className="w-5 h-5" />
              오답 노트
            </button>
            <button 
              onClick={() => { playClickSound(); onOpenSettings(); }}
              className="bg-slate-700 hover:bg-slate-600 text-white p-2 rounded-xl transition-colors shadow-lg"
              title="설정"
            >
              <Settings className="w-6 h-6" />
            </button>
            <button 
              onClick={() => { 
                playClickSound(); 
                setConfirmLogout(true);
              }}
              className="bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-xl transition-colors shadow-lg font-bold text-sm"
            >
              로그아웃
            </button>
          </div>
        </header>

        {/* Winding Path Map */}
        <div className="relative max-w-2xl mx-auto py-10">
          {/* Path Line */}
          <div className="absolute top-0 bottom-0 left-1/2 w-2 bg-slate-700/50 -translate-x-1/2 rounded-full z-0" />

          <div className="flex flex-col gap-16">
            {STAGES.map((stage, index) => {
              const isUnlocked = state.unlocked_stages.includes(stage.id);
              const isCurrent = currentMaxStage === stage.id;
              const isLeft = index % 2 === 0;

              return (
                <motion.div
                  key={stage.id}
                  initial={{ opacity: 0, x: isLeft ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`relative w-[85%] md:w-[45%] ${isLeft ? 'self-start' : 'self-end'}`}
                >
                  {/* Connection Node */}
                  <div className={`absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full border-4 border-slate-900 z-10 ${
                    isLeft ? '-right-[8.5%] md:-right-[11.5%]' : '-left-[8.5%] md:-left-[11.5%]'
                  } ${isUnlocked ? 'bg-emerald-400 shadow-[0_0_15px_rgba(52,211,153,0.8)]' : 'bg-slate-700'}`} />

                  {/* Avatar Indicator */}
                  {isCurrent && (
                    <motion.div 
                      animate={{ y: [-5, 5, -5] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className={`absolute top-0 -translate-y-full z-30 ${isLeft ? 'right-4' : 'left-4'}`}
                    >
                      <div className={`w-10 h-10 ${state.avatarColor} rounded-full border-2 border-white shadow-xl flex items-center justify-center`}>
                        <MapIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-white mx-auto -mt-[2px]" />
                    </motion.div>
                  )}

                  <button
                    onClick={() => {
                      if (isUnlocked) {
                        playClickSound();
                        onSelectStage(stage.id);
                      }
                    }}
                    disabled={!isUnlocked}
                    className={`w-full relative overflow-hidden group rounded-3xl text-left transition-all duration-300 shadow-2xl ${
                      isUnlocked
                        ? 'cursor-pointer hover:-translate-y-2 hover:shadow-emerald-500/20'
                        : 'cursor-not-allowed'
                    }`}
                  >
                    {/* Stage Background Image */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${stage.bg})` }}
                    />
                    
                    {/* Glassmorphism Overlay */}
                    <div className={`absolute inset-0 backdrop-blur-sm ${isUnlocked ? 'bg-slate-900/60 group-hover:bg-slate-900/40' : 'bg-slate-900/80'} transition-colors`} />

                    {/* Fog of War for Locked Stages */}
                    {!isUnlocked && (
                      <div className="absolute inset-0 backdrop-blur-md bg-slate-900/90 flex flex-col items-center justify-center z-20">
                        <CloudFog className="w-12 h-12 text-slate-500 mb-2 opacity-50" />
                        <Lock className="w-6 h-6 text-slate-400" />
                      </div>
                    )}

                    <div className="relative z-10 p-6 border border-white/10 rounded-3xl h-full flex flex-col">
                      <div className="flex justify-between items-start mb-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border border-white/20 ${
                          isUnlocked ? stage.color : 'bg-slate-800'
                        }`}>
                          {isUnlocked ? <Unlock className="w-6 h-6 text-white" /> : <Lock className="w-6 h-6 text-slate-500" />}
                        </div>
                        {isUnlocked && (
                          <div className="flex space-x-1">
                            <Star className="w-6 h-6 text-amber-400 fill-amber-400 drop-shadow-md" />
                          </div>
                        )}
                      </div>

                      {!stage.isBoss && (
                        <h2 className="text-2xl font-black mb-1 drop-shadow-lg text-white">Stage {stage.id}</h2>
                      )}
                      <h3 className="text-lg font-bold text-emerald-300 mb-2 drop-shadow-md">{stage.title}</h3>
                      <p className="text-slate-300 font-medium text-sm drop-shadow-md">{stage.desc}</p>

                      {isUnlocked && (
                        <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-4 group-hover:translate-x-0">
                          <div className="w-8 h-8 bg-white/20 backdrop-blur-md text-white rounded-full flex items-center justify-center border border-white/30">
                            <ChevronRight className="w-5 h-5" />
                          </div>
                        </div>
                      )}
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Inventory Sidebar / Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-xl border-t border-slate-700/50 p-4 z-40 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="max-w-4xl mx-auto flex items-center justify-between overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-3 min-w-max">
            <span className="text-slate-400 font-bold mr-2 drop-shadow-md">인벤토리</span>
            
            {/* Heart Potion */}
            <button 
              onClick={() => handleItemClick('heart_potion', '하트 물약', '전투 중 사용하면 하트를 1개 회복합니다.')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${state.items.heart_potion > 0 ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-600 text-white cursor-pointer shadow-lg' : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed grayscale'}`}
            >
              <Heart className={`w-5 h-5 ${state.items.heart_potion > 0 ? 'text-rose-500' : 'text-slate-600'}`} />
              <span className="font-bold">x{state.items.heart_potion}</span>
            </button>

            {/* Sacred Shield */}
            <button 
              onClick={() => handleItemClick('sacred_shield', '신성한 방패', '전투 중 사용하면 다음 오답 시 하트 감소를 1회 막아줍니다.')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${state.items.sacred_shield > 0 ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-600 text-white cursor-pointer shadow-lg' : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed grayscale'}`}
            >
              <Shield className={`w-5 h-5 ${state.items.sacred_shield > 0 ? 'text-sky-400' : 'text-slate-600'}`} />
              <span className="font-bold">x{state.items.sacred_shield}</span>
            </button>

            {/* Magic Magnifier */}
            <button 
              onClick={() => handleItemClick('magic_magnifier', '마법 돋보기', '전투 중 사용하면 문제의 힌트나 공식을 보여줍니다.')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${state.items.magic_magnifier > 0 ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-600 text-white cursor-pointer shadow-lg' : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed grayscale'}`}
            >
              <Search className={`w-5 h-5 ${state.items.magic_magnifier > 0 ? 'text-emerald-400' : 'text-slate-600'}`} />
              <span className="font-bold">x{state.items.magic_magnifier}</span>
            </button>

            {/* Lucky Horseshoe */}
            <button 
              onClick={() => handleItemClick('lucky_horseshoe', '행운의 편자', '전투 중 사용하면 다음 3문제 동안 획득하는 골드가 2배가 됩니다.')}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl transition-all border ${state.items.lucky_horseshoe > 0 ? 'bg-slate-800/80 hover:bg-slate-700 border-slate-600 text-white cursor-pointer shadow-lg' : 'bg-slate-900/50 border-slate-800 text-slate-600 cursor-not-allowed grayscale'}`}
            >
              <Magnet className={`w-5 h-5 ${state.items.lucky_horseshoe > 0 ? 'text-amber-500' : 'text-slate-600'}`} />
              <span className="font-bold">x{state.items.lucky_horseshoe}</span>
            </button>
          </div>
        </div>
      </div>

      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}

      {confirmLogout && (
        <ConfirmModal 
          message="로그아웃 하시겠습니까? 초기 화면으로 돌아갑니다." 
          onConfirm={() => {
            localStorage.removeItem('math_expedition_state');
            window.location.reload();
          }} 
          onClose={() => setConfirmLogout(false)} 
        />
      )}
    </div>
  );
}
