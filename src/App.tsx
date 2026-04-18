import React, { useState, useEffect, useRef } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MapScreen } from './components/MapScreen';
import { BattleScreen } from './components/BattleScreen';
import { ResultScreen } from './components/ResultScreen';
import { ShopModal } from './components/ShopModal';
import { ReviewScreen } from './components/ReviewScreen';
import { SettingsModal } from './components/SettingsModal';
import { AlertModal } from './components/Dialog';
import { AvatarRoom } from './components/AvatarRoom';
import { UserState, loadState, saveState, defaultState } from './utils/storage';
import { STAGES } from './utils/stageData';
import { Problem } from './utils/mathGenerator';
import { playFanfare } from './utils/sound';
import { fetchUserData, syncUserData } from './utils/api';
import { Loader2 } from 'lucide-react';

type Screen = 'welcome' | 'map' | 'battle' | 'result' | 'review' | 'avatar';

export default function App() {
  const [state, setState] = useState<UserState | null>(null);
  const [currentScreen, setCurrentScreen] = useState<Screen>('welcome');
  const [selectedStage, setSelectedStage] = useState<number>(1);
  const [lastScore, setLastScore] = useState<number>(0);
  const [isShopOpen, setIsShopOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [battleMode, setBattleMode] = useState<'normal' | 'review'>('normal');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncTrigger, setSyncTrigger] = useState(0);
  const [syncMessage, setSyncMessage] = useState<string>("동기화 중...");
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [showCrownPopup, setShowCrownPopup] = useState(false);

  useEffect(() => {
    // Remove splash screen after app is ready
    const hideSplash = () => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => {
          splash.style.visibility = 'hidden';
        }, 500);
      }
    };

    const loadedState = loadState();
    if (loadedState.nickname) {
      // Background sync on load if nickname exists
      setIsSyncing(true);
      setSyncMessage("동기화 중...");
      fetchUserData(loadedState.nickname).then(userData => {
        if (userData) {
          setState(userData);
        } else {
          setState(loadedState);
        }
        setCurrentScreen('map');
        setIsSyncing(false);
        hideSplash();
      }).catch(() => {
        setSyncMessage("서버 연결 실패, 로컬 데이터로 시작합니다.");
        setState(loadedState);
        setCurrentScreen('map');
        setIsSyncing(false);
        hideSplash();
      });
    } else {
      setState(loadedState);
      setTimeout(hideSplash, 1000);
    }
  }, []);

  useEffect(() => {
    if (currentScreen === 'battle') {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = '';
      };
      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }
  }, [currentScreen]);

  const prevSyncTrigger = useRef(0);

  useEffect(() => {
    if (state) {
      saveState(state); // Keep local backup
      if (syncTrigger > prevSyncTrigger.current) {
        prevSyncTrigger.current = syncTrigger;
        // Sync to Google Sheets in background
        syncUserData(state, state.total_score * 1.2).catch(console.error);
      }
    }
  }, [state, syncTrigger]);

  if (!state && !isSyncing) return null;

  const handleStart = async (nickname: string) => {
    setIsSyncing(true);
    setSyncMessage("동기화 중...");
    try {
      const userData = await fetchUserData(nickname);
      if (userData) {
        setState(userData);
      } else {
        const newState = { ...defaultState, nickname };
        setState(newState);
        syncUserData(newState).catch(console.error); // Do not await
      }
      setCurrentScreen('map');
      setIsSyncing(false);
    } catch (error) {
      console.error(error);
      setSyncMessage("서버 연결 실패, 로컬 데이터로 시작합니다.");
      const loadedState = loadState();
      if (loadedState.nickname === nickname) {
        setState(loadedState);
      } else {
        setState({ ...defaultState, nickname });
      }
      setCurrentScreen('map');
      setIsSyncing(false);
    }
  };

  const handleSelectStage = (stage: number) => {
    setSelectedStage(stage);
    setBattleMode('normal');
    setCurrentScreen('battle');
  };

  const handleStartReview = () => {
    setBattleMode('review');
    setCurrentScreen('battle');
  };

  const handleBattleComplete = (score: number, earnedGold: number, wrongProblems: Problem[]) => {
    setLastScore(score);
    
    // Update state
    const currentStageIndex = STAGES.findIndex(s => s.id === selectedStage);
    const nextStageId = currentStageIndex !== -1 && currentStageIndex < STAGES.length - 1 
      ? STAGES[currentStageIndex + 1].id 
      : null;

    const totalProblems = selectedStage > 100 ? (selectedStage === 104 ? 20 : 15) : 10;
    const isPassed = score >= Math.floor(totalProblems * 0.8);
    const isNewStageUnlocked = isPassed && nextStageId !== null && !state.unlocked_stages.includes(nextStageId);
    
    if (isNewStageUnlocked) {
      playFanfare();
    }

    // Boss Rewards Logic
    const isFinalBoss = selectedStage === 104;
    const isBoss1 = selectedStage === 101;
    const isBoss2 = selectedStage === 102;
    const isBoss3 = selectedStage === 103;
    
    if (isFinalBoss && isPassed && state.items.golden_crown === 0) {
      setShowCrownPopup(true);
      playFanfare();
    }

    setState(prev => {
      if (!prev) return prev;
      
      // Merge wrong problems (avoid duplicates)
      const newWrongProblems = [...prev.wrong_problems];
      wrongProblems.forEach(wp => {
        if (!newWrongProblems.find(p => p.id === wp.id)) {
          newWrongProblems.push(wp);
        }
      });

      // If review mode, remove correctly answered problems
      if (battleMode === 'review') {
        const wrongIds = wrongProblems.map(p => p.id);
        const correctlyAnswered = prev.wrong_problems.filter(p => !wrongIds.includes(p.id));
        correctlyAnswered.forEach(cp => {
          const idx = newWrongProblems.findIndex(p => p.id === cp.id);
          if (idx !== -1) newWrongProblems.splice(idx, 1);
        });
      }

      const newOwnedItems = [...prev.ownedItems];
      if (isBoss1 && isPassed && !newOwnedItems.includes('silver_shield')) newOwnedItems.push('silver_shield');
      if (isBoss2 && isPassed && !newOwnedItems.includes('steel_sword')) newOwnedItems.push('steel_sword');
      if (isBoss3 && isPassed && !newOwnedItems.includes('magic_armor')) newOwnedItems.push('magic_armor');
      if (isFinalBoss && isPassed && !newOwnedItems.includes('golden_crown_reward')) newOwnedItems.push('golden_crown_reward');

      return {
        ...prev,
        total_score: prev.total_score + score,
        gold: prev.gold + earnedGold,
        wrong_problems: newWrongProblems,
        ownedItems: newOwnedItems,
        equippedItems: {
          ...prev.equippedItems,
          head: (isFinalBoss && isPassed) ? 'golden_crown_reward' : prev.equippedItems.head
        },
        items: {
          ...prev.items,
          golden_crown: (isFinalBoss && isPassed) ? 1 : prev.items.golden_crown
        },
        unlocked_stages: isNewStageUnlocked && nextStageId !== null
          ? [...prev.unlocked_stages, nextStageId] 
          : prev.unlocked_stages,
        current_stage: isNewStageUnlocked && nextStageId !== null ? nextStageId : prev.current_stage
      };
    });
    
    setSyncTrigger(s => s + 1);
    setCurrentScreen('result');
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      {(!state || isSyncing) && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-white font-bold text-lg">{syncMessage}</p>
        </div>
      )}

      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
      )}

      {showCrownPopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gradient-to-b from-amber-500 to-amber-700 p-1 rounded-2xl max-w-sm w-full animate-bounce-slight">
            <div className="bg-slate-900 rounded-xl p-8 text-center flex flex-col items-center">
              <div className="text-6xl mb-4 drop-shadow-[0_0_15px_rgba(251,191,36,1)]">👑</div>
              <h2 className="text-2xl font-black text-amber-400 mb-2 drop-shadow-md">전설의 황금 왕관을 획득했습니다!</h2>
              <p className="text-slate-300 mb-6">수학의 주권자를 물리친 증표입니다. 아바타에 자동으로 장착되었습니다.</p>
              <button
                onClick={() => setShowCrownPopup(false)}
                className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold rounded-xl transition-colors"
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {currentScreen === 'welcome' && (
        <WelcomeScreen onStart={handleStart} />
      )}
      
      {currentScreen === 'map' && (
        <MapScreen 
          state={state} 
          onSelectStage={handleSelectStage} 
          onOpenShop={() => setIsShopOpen(true)}
          onOpenReview={() => setCurrentScreen('review')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenAvatar={() => setCurrentScreen('avatar')}
        />
      )}

      {currentScreen === 'avatar' && (
        <AvatarRoom 
          state={state} 
          setState={setState} 
          onBack={() => {
            setCurrentScreen('map');
          }} 
          onSync={() => setSyncTrigger(s => s + 1)}
        />
      )}

      {currentScreen === 'review' && (
        <ReviewScreen 
          state={state}
          onClose={() => setCurrentScreen('map')}
          onSolveAll={handleStartReview}
        />
      )}
      
      {currentScreen === 'battle' && (
        <BattleScreen 
          stage={selectedStage} 
          mode={battleMode}
          reviewProblems={battleMode === 'review' ? state.wrong_problems : undefined}
          state={state}
          setState={setState}
          onComplete={handleBattleComplete}
          onBack={() => setCurrentScreen('map')}
        />
      )}
      
      {currentScreen === 'result' && (() => {
        const currentStageIndex = STAGES.findIndex(s => s.id === selectedStage);
        const nextStageId = currentStageIndex !== -1 && currentStageIndex < STAGES.length - 1 
          ? STAGES[currentStageIndex + 1].id 
          : null;
        
        const totalProblems = selectedStage > 100 ? (selectedStage === 104 ? 20 : 15) : 10;
        const isUnlockedNext = lastScore >= Math.floor(totalProblems * 0.8) && nextStageId !== null && battleMode === 'normal';

        return (
          <ResultScreen 
            score={lastScore}
            total={battleMode === 'review' ? state.wrong_problems.length : totalProblems}
            stage={selectedStage}
            isUnlockedNext={isUnlockedNext}
            onNext={() => {
              if (nextStageId !== null) {
                setSelectedStage(nextStageId);
                setCurrentScreen('battle');
              }
            }}
            onRetry={() => setCurrentScreen('battle')}
            onMap={() => setCurrentScreen('map')}
          />
        );
      })()}

      {isShopOpen && (
        <ShopModal 
          state={state} 
          setState={setState} 
          onClose={() => setIsShopOpen(false)} 
          onSync={() => setSyncTrigger(s => s + 1)}
        />
      )}

      {isSettingsOpen && (
        <SettingsModal 
          state={state} 
          setState={setState} 
          onClose={() => setIsSettingsOpen(false)} 
          onSync={() => setSyncTrigger(s => s + 1)}
        />
      )}
    </div>
  );
}
