import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ShieldAlert, XCircle, CheckCircle2, Ghost, Shield, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Keypad } from './Keypad';
import { MathDisplay } from './MathDisplay';
import { DynamicSVG } from './DynamicSVG';
import { generateProblems, Problem } from '../utils/mathGenerator';
import { playCorrectSound, playIncorrectSound, playClickSound } from '../utils/sound';
import { STAGES } from '../utils/stageData';

type BattleScreenProps = {
  stage: number;
  mode?: 'normal' | 'review';
  reviewProblems?: Problem[];
  shields: number;
  doubleXpCharges: number;
  onComplete: (score: number, earnedGold: number, wrongProblems: Problem[], usedShields: number, usedXpCharges: number) => void;
  onBack: () => void;
};

export function BattleScreen({ stage, mode = 'normal', reviewProblems, shields, doubleXpCharges, onComplete, onBack }: BattleScreenProps) {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState('');
  const [selectedUnit, setSelectedUnit] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [shieldActive, setShieldActive] = useState(false);
  
  const [hearts, setHearts] = useState(3);
  const [usedShields, setUsedShields] = useState(0);
  const [usedXpCharges, setUsedXpCharges] = useState(0);
  const [wrongProblems, setWrongProblems] = useState<Problem[]>([]);
  const [earnedGold, setEarnedGold] = useState(0);

  const stageData = STAGES.find(s => s.id === stage) || STAGES[0];

  useEffect(() => {
    if (mode === 'review' && reviewProblems) {
      setProblems(reviewProblems);
    } else {
      setProblems(generateProblems(stage, 10));
    }
  }, [stage, mode, reviewProblems]);

  if (problems.length === 0) return null;

  const currentProblem = problems[currentIndex];
  const totalProblems = problems.length;
  const remainingHP = totalProblems - currentIndex;

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
    
    const evaluate = (str: string) => {
      try {
        if (str.includes('/')) {
          const [num, den] = str.split('/');
          if (den === '0') return NaN;
          return parseFloat(num) / parseFloat(den);
        }
        return parseFloat(str);
      } catch {
        return NaN;
      }
    };

    const expectedVal = evaluate(currentProblem.answer);
    const inputVal = evaluate(input);

    if (!isNaN(expectedVal) && !isNaN(inputVal) && Math.abs(expectedVal - inputVal) < 0.0001) {
      isCorrect = true;
    } else if (input === currentProblem.answer) {
      isCorrect = true;
    }

    if (isCorrect && currentProblem.answerUnit && selectedUnit !== currentProblem.answerUnit) {
      isCorrect = false;
    }

    if (isCorrect) {
      playCorrectSound();
      setFeedback('correct');
      setScore((s) => s + 1);
      
      let baseGold = stage <= 4 ? 10 : 20;
      let goldReward = mode === 'review' ? baseGold * 2 : baseGold;
      
      if (doubleXpCharges - usedXpCharges > 0) {
        goldReward *= 2;
        setUsedXpCharges(c => c + 1);
      }
      
      setEarnedGold(g => g + goldReward);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#10B981', '#34D399', '#059669'],
      });
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

      if (shields - usedShields > 0) {
        setShieldActive(true);
        setUsedShields(s => s + 1);
      } else {
        setHearts(h => Math.max(0, h - 1));
      }
    }

    setTimeout(() => {
      setFeedback(null);
      setShieldActive(false);
      setInput('');
      setSelectedUnit(null);
      
      const isDead = (shields - usedShields <= 0 && hearts <= (isCorrect ? 1 : 0) && !isCorrect);
      
      if (currentIndex < totalProblems - 1 && !isDead) {
        setCurrentIndex((i) => i + 1);
      } else {
        onComplete(score + (isCorrect ? 1 : 0), earnedGold + (isCorrect ? (mode === 'review' ? (stage <= 4 ? 20 : 40) : (stage <= 4 ? 10 : 20)) * (doubleXpCharges - usedXpCharges > 0 ? 2 : 1) : 0), wrongProblems, usedShields, usedXpCharges + (isCorrect && doubleXpCharges - usedXpCharges > 0 ? 1 : 0));
      }
    }, shieldActive ? 2500 : 1500);
  };

  return (
    <div className="min-h-screen text-white flex flex-col relative overflow-hidden">
      {/* Dynamic Background */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${stageData.bg})` }}
      />
      <div className="absolute inset-0 z-0 bg-slate-900/60 backdrop-blur-[2px]" />

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

      {/* Stage 8 Special Effects (Lightning & 3D Shapes) */}
      {stage === 8 && (
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
          className="text-slate-300 hover:text-white font-bold transition-colors drop-shadow-md"
        >
          ← 지도
        </button>
        <div className="flex items-center space-x-2">
          <ShieldAlert className="w-6 h-6 text-rose-400 drop-shadow-md" />
          <span className="font-black text-xl drop-shadow-md">{mode === 'review' ? '오답 노트 복습' : stageData.title}</span>
        </div>
        <div className="flex items-center space-x-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <Heart key={i} className={`w-6 h-6 drop-shadow-md ${i < hearts ? 'text-rose-500 fill-rose-500' : 'text-slate-700/50'}`} />
          ))}
          {shields - usedShields > 0 && (
            <div className="ml-2 flex items-center text-cyan-300 drop-shadow-md">
              <Shield className="w-5 h-5 mr-1" />
              <span className="font-bold text-sm">x{shields - usedShields}</span>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-4 max-w-2xl mx-auto w-full relative z-10">
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
            className={`w-24 h-24 rounded-full flex items-center justify-center mb-4 shadow-2xl backdrop-blur-md border border-white/20 ${
              feedback === 'correct' ? 'bg-rose-500/80 shadow-rose-500/50' :
              'bg-slate-800/80 shadow-slate-900/50'
            }`}
          >
            <Ghost className={`w-12 h-12 ${feedback === 'correct' ? 'text-white' : 'text-rose-400 drop-shadow-md'}`} />
          </motion.div>
          
          <div className="w-full max-w-md">
            <div className="flex justify-between text-sm font-bold text-slate-300 mb-2 drop-shadow-md">
              <span>몬스터 체력 (남은 문제)</span>
              <span>{remainingHP} / {totalProblems}</span>
            </div>
            <div className="h-4 bg-slate-900/50 backdrop-blur-sm rounded-full overflow-hidden flex border border-white/10">
              {Array.from({ length: totalProblems }).map((_, i) => (
                <div
                  key={i}
                  className={`flex-1 border-r border-slate-900/50 last:border-0 transition-colors duration-500 ${
                    i < remainingHP ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Problem Area (Glassmorphism) */}
        <motion.div
          animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
          transition={{ duration: 0.4 }}
          className="w-full bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 mb-8 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          <div className="text-center mb-6">
            <span className="inline-block bg-white/20 text-white font-bold px-4 py-1 rounded-full text-sm mb-4 shadow-inner">
              문제 {currentIndex + 1} / {totalProblems}
            </span>
            
            {currentProblem.svgType && (
              <div className="mb-4 bg-white/5 rounded-xl p-4 border border-white/10">
                <DynamicSVG type={currentProblem.svgType} params={currentProblem.svgParams} />
              </div>
            )}

            <div className="drop-shadow-md">
              <MathDisplay text={currentProblem.question} />
            </div>
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

        {/* Keypad */}
        <div className="w-full mt-auto pb-8">
          <div className="bg-slate-900/40 backdrop-blur-md p-4 rounded-3xl border border-white/10 shadow-xl">
            <Keypad
              onInput={handleInput}
              onDelete={handleDelete}
              onClear={handleClear}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
