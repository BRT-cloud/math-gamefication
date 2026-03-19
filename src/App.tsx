import React, { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { MapScreen } from './components/MapScreen';
import { BattleScreen } from './components/BattleScreen';
import { ResultScreen } from './components/ResultScreen';
import { ShopModal } from './components/ShopModal';
import { ReviewScreen } from './components/ReviewScreen';
import { SettingsModal } from './components/SettingsModal';
import { AlertModal } from './components/Dialog';
import { UserState, loadState, saveState, defaultState } from './utils/storage';
import { STAGES } from './utils/stageData';
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
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

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
        syncUserData(state, state.total_score * 1.2).catch(console.error);
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
        syncUserData(newState).catch(console.error); // Do not await
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

  const handleBattleComplete = (score: number, earnedGold: number, wrongProblems: Problem[]) => {
    setLastScore(score);
    
    // Update state
    const currentStageIndex = STAGES.findIndex(s => s.id === selectedStage);
    const nextStageId = currentStageIndex !== -1 && currentStageIndex < STAGES.length - 1 
      ? STAGES[currentStageIndex + 1].id 
      : null;

    const isPassed = score >= 8;
    const isNewStageUnlocked = isPassed && nextStageId !== null && !state.unlocked_stages.includes(nextStageId);
    
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
        wrong_problems: newWrongProblems,
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
      {isSyncing && (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center">
          <Loader2 className="w-12 h-12 text-emerald-500 animate-spin mb-4" />
          <p className="text-white font-bold text-lg">데이터를 동기화 중입니다...</p>
        </div>
      )}

      {alertMessage && (
        <AlertModal message={alertMessage} onClose={() => setAlertMessage(null)} />
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
        const isUnlockedNext = lastScore >= 8 && nextStageId !== null && battleMode === 'normal';

        return (
          <ResultScreen 
            score={lastScore}
            total={battleMode === 'review' ? state.wrong_problems.length : 10}
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
