import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShieldAlert, XCircle, CheckCircle2, Ghost, Shield, Zap, Search, Magnet, Skull } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Keypad } from './Keypad';
import { MathDisplay } from './MathDisplay';
import { DynamicSVG } from './DynamicSVG';
import { generateProblems, Problem } from '../utils/mathGenerator';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../utils/sound';
import { STAGES } from '../utils/stageData';
import { UserState } from '../utils/storage';
import { ConfirmModal } from './Dialog';

type BattleScreenProps = {
  stage: number;
  mode?: 'normal' | 'review';
  reviewProblems?: Problem[];
  state: UserState;
  setState: React.Dispatch<React.SetStateAction<UserState | null>>;
  onComplete: (score: number, earnedGold: number, wrongProblems: Problem[]) => void;
  onBack: () => void;
};

export function BattleScreen({ stage, mode = 'normal', reviewProblems, state, setState, onComplete, onBack }: BattleScreenProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [isBossShaking, setIsBossShaking] = useState(false);
  const [bossFlash, setBossFlash] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  
  const [hearts, setHearts] = useState(3);
  const [wrongProblems, setWrongProblems] = useState<Problem[]>([]);
  const [earnedGold, setEarnedGold] = useState(0);

  // Item states
  const [hasShield, setHasShield] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [luckyTurns, setLuckyTurns] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [confirmItem, setConfirmItem] = useState<{ id: keyof UserState['items'], name: string } | null>(null);

  const stageData = STAGES.find(s => s.id === stage) || STAGES[0];

  useEffect(() => {
    if (mode === 'review' && reviewProblems) {
      setProblems(reviewProblems);
    } else {
      // Mid-boss (101-114): 15 problems, Final boss (115): 20 problems
      const count = stage > 100 ? (stage === 115 ? 20 : 15) : 10;
      setProblems(generateProblems(stage, count));
    }
  }, [stage, mode, reviewProblems]);

  const totalProblems = problems.length;
  const currentProblem = problems[currentIndex];
  const remainingHP = totalProblems - currentIndex;

  const isMidBoss = stage > 100 && stage < 115;
  const isFinalBoss = stage === 115;
  const isStageBoss = mode === 'normal' && currentIndex === totalProblems - 1 && stage <= 15;
  const isBossMode = isMidBoss || isFinalBoss || isStageBoss;

  // Boss BGM
  useEffect(() => {
    let bgm: HTMLAudioElement | null = null;
    if (isBossMode) {
      bgm = new Audio('https://cdn.freesound.org/previews/568/568393_12891969-lq.mp3');
      bgm.loop = true;
      bgm.volume = 0.2;
      // Delay BGM start to let siren play first if it's the start of the encounter
      const shouldShowWarning = (isMidBoss || isFinalBoss) ? currentIndex === 0 : isStageBoss;
      if (shouldShowWarning) {
        setTimeout(() => bgm?.play().catch(() => {}), 2000);
      } else {
        bgm.play().catch(() => {});
      }
    }
    return () => {
      if (bgm) {
        bgm.pause();
        bgm.currentTime = 0;
      }
    };
  }, [isBossMode]); // Only re-run if isBossMode changes

  // Boss Warning Siren
  useEffect(() => {
    const shouldShowWarning = (isMidBoss || isFinalBoss) ? currentIndex === 0 : isStageBoss;

    if (shouldShowWarning && !feedback) {
      setShowWarning(true);
      if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
      
      const siren = new Audio('https://cdn.freesound.org/previews/333/333404_5121236-lq.mp3');
      siren.volume = 0.3;
      siren.play().catch(() => {});

      setTimeout(() => {
        setShowWarning(false);
      }, 2000);
    }
  }, [isMidBoss, isFinalBoss, isStageBoss, currentIndex]);

  if (problems.length === 0) return null;

  const handleUseItem = (itemId: keyof UserState['items']) => {
    if (state.items[itemId] <= 0) return;
    
    // Check if item can be used
    if (itemId === 'heart_potion' && hearts >= 3) return;
    if (itemId === 'sacred_shield' && hasShield) return;
    if (itemId === 'magic_magnifier' && showHint) return;
    if (itemId === 'lucky_horseshoe' && luckyTurns > 0) return;

    const itemNames: Record<keyof UserState['items'], string> = {
      heart_potion: '하트 포션',
      sacred_shield: '신성한 방패',
      magic_magnifier: '마법 돋보기',
      lucky_horseshoe: '행운의 편자',
      golden_crown: '황금 왕관'
    };

    setConfirmItem({ id: itemId, name: itemNames[itemId] });
  };

  const confirmUseItem = () => {
    if (!confirmItem) return;
    const itemId = confirmItem.id;

    playClickSound();
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        items: {
          ...prev.items,
          [itemId]: prev.items[itemId] - 1
        }
      };
    });

    if (itemId === 'heart_potion') {
      setHearts(h => Math.min(3, h + 1));
    } else if (itemId === 'sacred_shield') {
      setHasShield(true);
    } else if (itemId === 'magic_magnifier') {
      setShowHint(true);
    } else if (itemId === 'lucky_horseshoe') {
      setLuckyTurns(3);
    }
    
    setConfirmItem(null);
  };

  const handleInput = (val: string) => {
    if (feedback || shieldActive) return;
    playClickSound();
    setInput((prev) => prev + val);
  };

  const handleDelete = () => {
    if (feedback || shieldActive) return;
    playClickSound();
    setInput((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    if (feedback || shieldActive) return;
    playClickSound();
    setInput('');
  };

  const handleSubmit = () => {
    if (feedback || shieldActive || !input) return;
    playClickSound();

    let isCorrect = false;
    
    const cleanExpected = currentProblem.answer.replace(/[^0-9.]/g, '');
    const cleanInput = input.replace(/[^0-9.]/g, '');
    
    if (cleanExpected === cleanInput && cleanExpected !== '') {
      isCorrect = true;
    }

    if (isCorrect && currentProblem.answerUnit && selectedUnit && selectedUnit !== currentProblem.answerUnit) {
      // If user provided a unit, it must match. But if they didn't provide a unit, we allow it if the number is correct.
      isCorrect = false;
    }

    let currentGoldReward = 0;
    
    if (luckyTurns > 0) {
      setLuckyTurns(c => c - 1);
    }

    if (isCorrect) {
      playCorrectSound();
      setFeedback('correct');
      setScore((s) => s + 1);
      
      if (isBossMode) {
        setIsBossShaking(true);
        setBossFlash(true);
        setTimeout(() => {
          setIsBossShaking(false);
          setBossFlash(false);
        }, 500);
      }
      
      let baseGold = stage <= 4 ? 10 : 20;
      if (isBossMode) baseGold *= 2;
      currentGoldReward = mode === 'review' ? baseGold * 2 : baseGold;
      
      if (luckyTurns > 0) {
        currentGoldReward *= 2;
      }
      
      setEarnedGold(g => g + currentGoldReward);

      if (isFinalBoss && currentIndex === totalProblems - 1) {
        // Extra grand confetti for final boss victory
        const duration = 5 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval = setInterval(() => {
          const timeLeft = animationEnd - Date.now();

          if (timeLeft <= 0) {
            return clearInterval(interval);
          }

          const particleCount = 50 * (timeLeft / duration);
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
          confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);
      } else {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#10B981', '#34D399', '#059669'],
        });
      }
    } else {
      playIncorrectSound();
      setFeedback('incorrect');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      
      if (navigator.vibrate) {
        navigator.vibrate(200);
      }

      setWrongProblems(prev => {
        if (!prev.find(p => p.id === currentProblem.id)) {
          return [...prev, currentProblem];
        }
        return prev;
      });

      if (hasShield) {
        setShieldActive(true);
        setHasShield(false);
      } else {
        setHearts(h => Math.max(0, h - 1));
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setShieldActive(false);
      setInput('');
      setSelectedUnit(null);
      setShowHint(false);
      
      const isDead = (!isCorrect && !hasShield && hearts - 1 <= 0);
      
      if (currentIndex < totalProblems - 1 && !isDead) {
        setCurrentIndex((i) => i + 1);
      } else {
        onComplete(score + (isCorrect ? 1 : 0), earnedGold + currentGoldReward, wrongProblems);
      }
    }, shieldActive ? 2500 : 1500);
  };

  return (
    <div className={`min-h-screen text-white flex flex-col relative overflow-hidden ${isBossMode ? (isFinalBoss ? 'bg-purple-950' : 'bg-red-950') : ''} ${isBossShaking ? 'animate-shake' : ''}`}>
      {/* Dynamic Background */}
      <div 
        className={`absolute inset-0 z-0 bg-cover bg-center transition-opacity duration-1000 ${isBossMode ? 'opacity-30 mix-blend-multiply' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${stageData.bg})` }}
      />
      <div className={`absolute inset-0 z-0 backdrop-blur-[2px] ${isFinalBoss ? 'bg-purple-900/80' : isMidBoss ? `${stageData.color.replace('bg-', 'bg-').replace('600', '900')}/80` : isStageBoss ? 'bg-red-900/80' : 'bg-slate-900/60'}`} />

      {/* Boss Vignette */}
      {isBossMode && (
        <div className={`pointer-events-none fixed inset-0 z-0 ${isFinalBoss ? 'shadow-[inset_0_0_150px_rgba(147,51,234,0.6)]' : isMidBoss ? 'shadow-[inset_0_0_150px_rgba(0,0,0,0.8)]' : 'shadow-[inset_0_0_150px_rgba(220,38,38,0.6)]'}`} />
      )}

      {/* Warning Shake Overlay */}
      <AnimatePresence>
        {showWarning && (
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1, x: [-10, 10, -10, 10, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className={`absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm ${isFinalBoss ? 'bg-purple-900/80' : 'bg-red-900/80'}`}
          >
            <h1 className={`text-6xl md:text-8xl font-black tracking-widest ${isFinalBoss ? 'text-purple-500 drop-shadow-[0_0_30px_rgba(168,85,247,1)]' : 'text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,1)]'}`}>
              WARNING
            </h1>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Stage 1-4: 연산의 숲 (Floating Numbers) */}
      {stage <= 4 && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-30">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-emerald-300 font-black text-4xl drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100,
                rotate: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: -100,
                rotate: Math.random() * 360 + 180
              }}
              transition={{ 
                duration: Math.random() * 10 + 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
              }}
            >
              {Math.floor(Math.random() * 10)}
            </motion.div>
          ))}
        </div>
      )}

      {/* Stage 5: 도형의 땅 (Geometric Shapes) */}
      {stage === 5 && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
          {Array.from({ length: 15 }).map((_, i) => {
            const isTriangle = i % 2 === 0;
            return (
              <motion.div
                key={i}
                className={`absolute border-4 border-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] ${isTriangle ? 'w-0 h-0 border-l-[30px] border-r-[30px] border-b-[50px] border-l-transparent border-r-transparent border-t-0 bg-transparent' : 'w-16 h-16 bg-transparent'}`}
                initial={{ 
                  x: Math.random() * window.innerWidth, 
                  y: window.innerHeight + 100,
                  rotate: Math.random() * 360,
                  scale: Math.random() * 0.5 + 0.5
                }}
                animate={{ 
                  y: -100,
                  rotate: Math.random() * 360 + 180
                }}
                transition={{ 
                  duration: Math.random() * 12 + 8, 
                  repeat: Infinity, 
                  ease: "linear",
                  delay: Math.random() * 5
                }}
              />
            );
          })}
        </div>
      )}

      {/* Stage 6: 각도의 계곡 (Angle Lines & Protractors) */}
      {stage === 6 && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
          {Array.from({ length: 10 }).map((_, i) => (
            <motion.svg
              key={i}
              className="absolute text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.8)]"
              width="100" height="100" viewBox="0 0 100 100"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100,
                rotate: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: -100,
                rotate: Math.random() * 360 + 180
              }}
              transition={{ 
                duration: Math.random() * 15 + 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
              }}
            >
              <path d="M 10 90 L 90 90 L 50 10 Z" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
              <path d="M 30 90 A 20 20 0 0 0 45 70" fill="none" stroke="currentColor" strokeWidth="2" />
              <text x="35" y="85" fill="currentColor" fontSize="12">60°</text>
            </motion.svg>
          ))}
        </div>
      )}

      {/* Stage 7: 측정의 늪 (Rulers) */}
      {stage === 7 && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-20">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-64 h-8 border-2 border-teal-400 bg-teal-900/30 backdrop-blur-sm drop-shadow-[0_0_10px_rgba(45,212,191,0.5)] flex items-end justify-between px-2 pb-1"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100,
                rotate: Math.random() * 45 - 22.5,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: -100,
                x: `calc(${Math.random() * 100}vw)`
              }}
              transition={{ 
                duration: Math.random() * 20 + 15, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
              }}
            >
              {Array.from({ length: 10 }).map((_, j) => (
                <div key={j} className={`w-0.5 bg-teal-400 ${j % 5 === 0 ? 'h-4' : 'h-2'}`} />
              ))}
            </motion.div>
          ))}
        </div>
      )}

      {/* Stage 15 Special Effects (Lightning & 3D Shapes) */}
      {stage === 15 && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 bg-indigo-900/40 mix-blend-overlay" />
          
          {/* Lightning Flashes */}
          <motion.div 
            animate={{ opacity: [0, 0, 0.8, 0, 0, 0.5, 0, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear", times: [0, 0.8, 0.82, 0.85, 0.9, 0.92, 0.95, 1] }}
            className="absolute inset-0 bg-white/30 mix-blend-overlay"
          />
          
          {/* Floating 3D Cubes */}
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.svg
              key={`cube-${i}`}
              className="absolute text-indigo-300 opacity-40 drop-shadow-[0_0_15px_rgba(165,180,252,0.8)]"
              width="60" height="60" viewBox="0 0 60 60"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100,
                rotate: Math.random() * 360,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: -100,
                rotate: Math.random() * 360 + 180
              }}
              transition={{ 
                duration: Math.random() * 15 + 10, 
                repeat: Infinity, 
                ease: "linear",
                delay: Math.random() * 5
              }}
            >
              <path d="M30 5 L55 20 L55 45 L30 60 L5 45 L5 20 Z" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M5 20 L30 35 L55 20" fill="none" stroke="currentColor" strokeWidth="2" />
              <path d="M30 35 L30 60" fill="none" stroke="currentColor" strokeWidth="2" />
            </motion.svg>
          ))}

          {/* Magic Dust Particles */}
          {Array.from({ length: 25 }).map((_, i) => (
            <motion.div
              key={`dust-${i}`}
              className="absolute w-1.5 h-1.5 bg-fuchsia-300 rounded-full shadow-[0_0_8px_rgba(240,171,252,1)]"
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: window.innerHeight + 100,
                scale: Math.random() * 0.5 + 0.5,
                opacity: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                y: -100,
                x: `calc(${Math.random() * 100}vw + ${Math.sin(i) * 100}px)`,
                opacity: [0, 1, 0]
              }}
              transition={{ 
                duration: Math.random() * 6 + 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: Math.random() * 5
              }}
            />
          ))}
        </div>
      )}

      {/* Shield Animation Overlay */}
      <AnimatePresence>
        {shieldActive && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-none"
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1.5, rotate: 0 }}
              exit={{ scale: 2, opacity: 0, filter: 'blur(10px)' }}
              transition={{ type: 'spring', damping: 12 }}
              className="flex flex-col items-center"
            >
              <Shield className="w-32 h-32 text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.8)]" />
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 text-2xl font-black text-cyan-400 bg-slate-900/80 px-6 py-3 rounded-full border border-cyan-400/50"
              >
                방패가 당신을 지켜주었습니다!
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="p-4 flex items-center justify-between border-b border-white/10 bg-slate-900/40 backdrop-blur-md sticky top-0 z-10">
        <button
          onClick={() => { playClickSound(); onBack(); }}
          className="text-white hover:text-slate-200 font-bold transition-colors [text-shadow:2px_2px_4px_rgba(0,0,0,0.8)]"
        >
          ← 지도
        </button>
        <div className="flex items-center space-x-2">
          {isBossMode ? <Skull className="w-6 h-6 text-red-400 drop-shadow-md" /> : <ShieldAlert className="w-6 h-6 text-rose-400 drop-shadow-md" />}
          <span className="font-black text-xl text-white [text-shadow:2px_2px_4px_rgba(0,0,0,0.8)]">{mode === 'review' ? '오답 노트 복습' : stageData.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className={`w-6 h-6 drop-shadow-md ${i < hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-700/50'}`} />
          ))}
          {hasShield && (
            <div className="ml-2 flex items-center text-cyan-300 drop-shadow-md">
              <Shield className="w-5 h-5 mr-1" />
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full relative z-10 pb-40">
        {/* Monster Area */}
        <div className="w-full mb-8 flex flex-col items-center">
          <motion.div
            animate={
              feedback === 'correct' ? { scale: [1, 0.8, 1.2, 1], rotate: [-10, 10, -10, 0], opacity: [1, 0.5, 1] } :
              feedback === 'incorrect' ? { x: [-10, 10, -10, 10, 0] } :
              { y: [-5, 5, -5] }
            }
            transition={
              feedback ? { duration: 0.5 } :
              { repeat: Infinity, duration: 2, ease: "easeInOut" }
            }
            className={`w-32 h-32 md:w-40 md:h-40 rounded-full flex items-center justify-center mb-4 shadow-2xl backdrop-blur-md border border-white/20 transition-colors duration-200 text-6xl md:text-7xl ${
              bossFlash ? 'bg-white brightness-200' :
              feedback === 'correct' ? 'bg-rose-500/80 shadow-rose-500/50' :
              isFinalBoss ? 'bg-purple-900/80 shadow-purple-900/50' :
              isMidBoss ? 'bg-orange-900/80 shadow-orange-900/50' :
              isStageBoss ? 'bg-red-900/80 shadow-red-900/50' :
              'bg-slate-800/80 shadow-slate-900/50'
            }`}
          >
            {isFinalBoss ? (
              <span className={feedback === 'correct' ? 'grayscale opacity-50' : 'drop-shadow-[0_0_15px_rgba(168,85,247,0.8)]'}>🤖</span>
            ) : isMidBoss ? (
              <span className={feedback === 'correct' ? 'grayscale opacity-50' : 'drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]'}>🐉</span>
            ) : isStageBoss ? (
              <span className={feedback === 'correct' ? 'grayscale opacity-50' : 'drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]'}>🧌</span>
            ) : (
              <span className={feedback === 'correct' ? 'grayscale opacity-50' : 'drop-shadow-md'}>👻</span>
            )}
          </motion.div>
          
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm font-bold text-white mb-2 [text-shadow:2px_2px_4px_rgba(0,0,0,0.8)]">
              <span>{isBossMode ? '보스 체력' : '몬스터 체력'} (남은 문제)</span>
              <span>{remainingHP} / {totalProblems}</span>
            </div>
            <div className={`h-6 rounded-full overflow-hidden flex border border-white/20 ${isBossMode ? 'bg-red-950/80' : 'bg-slate-900/50 backdrop-blur-sm'}`}>
              {Array.from({ length: totalProblems }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 border-r border-black/20 last:border-0 transition-colors duration-500 ${
                    i < remainingHP ? (isBossMode ? 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.8)]' : 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]') : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Problem Area */}
        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full max-w-[90%] bg-black/50 border border-white/20 rounded-3xl p-8 md:p-10 mb-4 shadow-[0_8px_32px_rgba(0,0,0,0.5)] relative overflow-y-auto max-h-[50vh] break-keep"
        >
          <div className="text-center mb-6">
            <span className="inline-block bg-white/20 text-white font-bold px-4 py-1 rounded-full text-sm mb-4 shadow-inner [text-shadow:2px_2px_4px_rgba(0,0,0,0.8)]">
              문제 {currentIndex + 1} / {totalProblems} {currentProblem.isWordProblem && '(문장제)'}
            </span>
            
            {currentProblem.svgType && (
              <div className="mb-4 bg-white/5 rounded-xl p-4 border border-white/10 flex justify-center">
                <DynamicSVG type={currentProblem.svgType} params={currentProblem.svgParams} />
              </div>
            )}

            <div className={`[text-shadow:2px_2px_4px_rgba(0,0,0,0.8)] ${currentProblem.isWordProblem ? 'text-[1.2rem] leading-[1.6] text-cyan-400 px-2 py-4' : 'text-white text-4xl md:text-5xl leading-relaxed'}`}>
              <MathDisplay text={currentProblem.question} className={currentProblem.isWordProblem ? 'text-left justify-start' : 'text-center justify-center'} />
            </div>
            
            {showHint && currentProblem.hint && (
              <div className="mt-4 p-3 bg-emerald-900/50 border border-emerald-500/50 rounded-xl text-emerald-200 text-sm [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]">
                💡 힌트: <MathDisplay text={currentProblem.hint} className="text-sm inline-flex" />
              </div>
            )}
          </div>

          {/* Input Display */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center justify-center space-x-4">
              <div className={`text-5xl font-mono font-black border-b-4 pb-2 min-w-[120px] text-center transition-colors drop-shadow-md ${
                feedback === 'correct' ? 'text-emerald-400 border-emerald-400' :
                feedback === 'incorrect' ? 'text-rose-400 border-rose-400' :
                'text-white border-white/50'
              }`}>
                {input || '?'}
              </div>
              
              <AnimatePresence>
                {feedback === 'correct' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <CheckCircle2 className="w-12 h-12 text-emerald-400 drop-shadow-md" />
                  </motion.div>
                )}
                {feedback === 'incorrect' && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                  >
                    <XCircle className="w-12 h-12 text-rose-400 drop-shadow-md" />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Unit Selection */}
            {currentProblem.unitOptions && (
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {currentProblem.unitOptions.map(unit => (
                  <button
                    key={unit}
                    onClick={() => !feedback && setSelectedUnit(unit)}
                    className={`px-4 py-2 rounded-xl font-bold transition-colors shadow-lg border ${
                      selectedUnit === unit 
                        ? 'bg-emerald-500/80 border-emerald-400 text-white shadow-emerald-500/30' 
                        : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Item Quick Slots */}
        <div className="w-full max-w-[90%] flex justify-center gap-3 mb-4">
          <button 
            onClick={() => handleUseItem('heart_potion')} 
            disabled={state.items.heart_potion <= 0 || hearts >= 3}
            className={`flex flex-col items-center justify-center w-14 h-14 bg-slate-800/80 border border-slate-600 rounded-xl transition-all ${state.items.heart_potion <= 0 || hearts >= 3 ? 'opacity-50 grayscale' : 'hover:bg-slate-700'} relative`}
          >
            <Heart className="w-6 h-6 text-rose-500" />
            <span className="absolute -top-2 -right-2 bg-rose-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-slate-800">{state.items.heart_potion}</span>
          </button>
          <button 
            onClick={() => handleUseItem('sacred_shield')} 
            disabled={state.items.sacred_shield <= 0 || hasShield}
            className={`flex flex-col items-center justify-center w-14 h-14 bg-slate-800/80 border ${hasShield ? 'border-sky-400 shadow-[0_0_10px_rgba(56,189,248,0.8)]' : 'border-slate-600'} rounded-xl transition-all ${state.items.sacred_shield <= 0 && !hasShield ? 'opacity-50 grayscale' : 'hover:bg-slate-700'} relative`}
          >
            <Shield className={`w-6 h-6 ${hasShield ? 'text-sky-300 animate-pulse' : 'text-sky-400'}`} />
            <span className="absolute -top-2 -right-2 bg-sky-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-slate-800">{state.items.sacred_shield}</span>
          </button>
          <button 
            onClick={() => handleUseItem('magic_magnifier')} 
            disabled={state.items.magic_magnifier <= 0 || showHint || !currentProblem.hint}
            className={`flex flex-col items-center justify-center w-14 h-14 bg-slate-800/80 border ${showHint ? 'border-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]' : 'border-slate-600'} rounded-xl transition-all ${state.items.magic_magnifier <= 0 && !showHint ? 'opacity-50 grayscale' : (!currentProblem.hint ? 'opacity-50' : 'hover:bg-slate-700')} relative`}
          >
            <Search className={`w-6 h-6 ${showHint ? 'text-emerald-300 animate-pulse' : 'text-emerald-500'}`} />
            <span className="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-slate-800">{state.items.magic_magnifier}</span>
          </button>
          <button 
            onClick={() => handleUseItem('lucky_horseshoe')} 
            disabled={state.items.lucky_horseshoe <= 0 || luckyTurns > 0}
            className={`flex flex-col items-center justify-center w-14 h-14 bg-slate-800/80 border ${luckyTurns > 0 ? 'border-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.8)]' : 'border-slate-600'} rounded-xl transition-all ${state.items.lucky_horseshoe <= 0 && luckyTurns === 0 ? 'opacity-50 grayscale' : 'hover:bg-slate-700'} relative`}
          >
            <Magnet className={`w-6 h-6 ${luckyTurns > 0 ? 'text-amber-300 animate-pulse' : 'text-amber-500'}`} />
            <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center border border-slate-800">{state.items.lucky_horseshoe}</span>
            {luckyTurns > 0 && (
              <span className="absolute -bottom-2 bg-amber-500 text-slate-900 text-[10px] font-bold px-1 rounded-sm">
                {luckyTurns}회
              </span>
            )}
          </button>
        </div>

        {/* Keypad */}
        <div className="w-full mt-auto">
          <div className="bg-black/60 backdrop-blur-md p-4 rounded-3xl border border-white/20 shadow-2xl">
            <Keypad
              onInput={handleInput}
              onDelete={handleDelete}
              onClear={handleClear}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>

      {confirmItem && (
        <ConfirmModal
          message={`'${confirmItem.name}' 아이템을 사용하시겠습니까?`}
          onConfirm={confirmUseItem}
          onClose={() => setConfirmItem(null)}
        />
      )}
    </div>
  );
}
