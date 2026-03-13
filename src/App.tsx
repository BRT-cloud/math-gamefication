import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MapScreen } from './components/MapScreen';
import { BattleScreen } from './components/BattleScreen';
import { ResultScreen } from './components/ResultScreen';
import { ShopModal } from './components/ShopModal';
import { ReviewScreen } from './components/ReviewScreen';
import { SettingsModal } from './components/SettingsModal';
import { UserState, loadState, saveState, defaultState } from './utils/storage';
import { Problem } from './utils/mathGenerator';
import { playFanfare } from './utils/sound';
import { fetchUserData, syncUserData } from './utils/api';
import { Loader2 } from 'lucide-react';

type Screen = 'welcome' | 'map' | 'battle' | 'result' | 'review';

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

  useEffect(() => {
    const loadedState = loadState();
    if (loadedState.nickname) {
      // Background sync on load if nickname exists
      setIsSyncing(true);
      fetchUserData(loadedState.nickname).then(userData => {
        if (userData) {
          setState(userData);
        } else {
          setState(loadedState);
        }
        setCurrentScreen('map');
        setIsSyncing(false);
      }).catch(() => {
        setState(loadedState);
        setCurrentScreen('map');
        setIsSyncing(false);
      });
    } else {
      setState(loadedState);
    }
  }, []);

  useEffect(() => {
    if (state) {
      saveState(state); // Keep local backup
      if (syncTrigger > 0) {
        // Sync to Google Sheets in background
        setIsSyncing(true);
        syncUserData(state, state.total_score * 1.2).finally(() => {
          setIsSyncing(false);
        });
      }
    }
  }, [state, syncTrigger]);

  if (!state) return null;

  const handleStart = async (nickname: string) => {
    setIsSyncing(true);
    try {
      const userData = await fetchUserData(nickname);
      if (userData) {
        setState(userData);
      } else {
        const newState = { ...defaultState, nickname };
        setState(newState);
        await syncUserData(newState);
      }
      setCurrentScreen('map');
    } catch (error) {
      console.error(error);
      setState({ ...defaultState, nickname });
      setCurrentScreen('map');
    } finally {
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

  const handleUseItem = (itemId: keyof UserState['items']) => {
    setState(prev => {
      if (!prev || prev.items[itemId] <= 0) return prev;
      
      const newItems = { ...prev.items, [itemId]: prev.items[itemId] - 1 };
      
      if (itemId === 'golden_key') {
        const nextStage = Math.max(...prev.unlocked_stages) + 1;
        if (nextStage <= 8 && !prev.unlocked_stages.includes(nextStage)) {
          alert(`황금 열쇠를 사용하여 Stage ${nextStage}이(가) 열렸습니다!`);
          return { ...prev, items: newItems, unlocked_stages: [...prev.unlocked_stages, nextStage] };
        } else {
          alert('더 이상 열 수 있는 스테이지가 없습니다.');
          return prev; // Don't consume key
        }
      } else if (itemId === 'xp_potion') {
        alert('경험치 물약을 사용했습니다! 다음 10문제 동안 골드를 2배로 획득합니다.');
        return { ...prev, items: newItems, doubleXpCharges: prev.doubleXpCharges + 10 };
      }
      
      return { ...prev, items: newItems };
    });
    setSyncTrigger(s => s + 1);
  };

  const handleBattleComplete = (score: number, earnedGold: number, wrongProblems: Problem[], usedShields: number, usedXpCharges: number) => {
    setLastScore(score);
    
    // Update state
    const isPassed = score >= 8;
    const isNewStageUnlocked = isPassed && !state.unlocked_stages.includes(selectedStage + 1) && selectedStage < 8;
    
    if (isNewStageUnlocked) {
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

      return {
        ...prev,
        total_score: prev.total_score + score,
        gold: prev.gold + earnedGold,
        items: {
          ...prev.items,
          shield: Math.max(0, prev.items.shield - usedShields),
        },
        doubleXpCharges: Math.max(0, prev.doubleXpCharges - usedXpCharges),
        wrong_problems: newWrongProblems,
        unlocked_stages: isNewStageUnlocked 
          ? [...prev.unlocked_stages, selectedStage + 1] 
          : prev.unlocked_stages,
        current_stage: isNewStageUnlocked ? selectedStage + 1 : prev.current_stage
      };
    });
    
    setSyncTrigger(s => s + 1);
    setCurrentScreen('result');
  };

  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      {isSyncing && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-white font-bold text-lg">데이터를 동기화 중입니다...</p>
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
          onUseItem={handleUseItem}
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
          shields={state.items.shield}
          doubleXpCharges={state.doubleXpCharges}
          onComplete={handleBattleComplete}
          onBack={() => setCurrentScreen('map')}
        />
      )}
      
      {currentScreen === 'result' && (
        <ResultScreen 
          score={lastScore}
          total={battleMode === 'review' ? state.wrong_problems.length : 10}
          stage={selectedStage}
          isUnlockedNext={lastScore >= 8 && selectedStage < 8 && battleMode === 'normal'}
          onNext={() => {
            setSelectedStage(s => s + 1);
            setCurrentScreen('battle');
          }}
          onRetry={() => setCurrentScreen('battle')}
          onMap={() => setCurrentScreen('map')}
        />
      )}

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
