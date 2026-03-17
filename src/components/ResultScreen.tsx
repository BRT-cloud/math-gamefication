import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Key, Trophy, ArrowRight, RotateCcw, Coins } from 'lucide-react';
import confetti from 'canvas-confetti';
import { playClickSound } from '../utils/sound';

type ResultScreenProps = {
  score: number;
  total: number;
  stage: number;
  isUnlockedNext: boolean;
  onNext: () => void;
  onRetry: () => void;
  onMap: () => void;
};

export function ResultScreen({ score, total, stage, isUnlockedNext, onNext, onRetry, onMap }: ResultScreenProps) {
  const percentage = (score / total) * 100;
  const passed = percentage >= 80;

  useEffect(() => {
    if (passed) {
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#FBBF24', '#F59E0B', '#D97706']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#FBBF24', '#F59E0B', '#D97706']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [passed]);

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center border border-slate-700 relative overflow-hidden"
      >
        {passed && (
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-amber-500/20 to-transparent pointer-events-none" />
        )}

        <div className="relative z-10">
          <div className={`w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 shadow-xl ${
            passed ? 'bg-amber-500 shadow-amber-500/30' : 'bg-slate-700'
          }`}>
            {passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <RotateCcw className="w-12 h-12 text-slate-400" />
            )}
          </div>

          <h2 className="text-3xl font-black text-white mb-2">
            {passed ? '미션 성공!' : '미션 실패'}
          </h2>
          <p className="text-slate-400 font-medium mb-8">
            {passed ? '몬스터를 물리쳤습니다!' : '조금 더 연습이 필요해요.'}
          </p>

          <div className="bg-slate-900 rounded-2xl p-6 mb-8">
            <div className="text-5xl font-black text-white mb-2">
              {score} <span className="text-2xl text-slate-500">/ {total}</span>
            </div>
            <p className="text-emerald-400 font-bold mb-4">정답률 {percentage.toFixed(0)}%</p>
            
            {score > 0 && (
              <div className="flex items-center justify-center gap-2 bg-amber-500/10 text-amber-400 py-2 px-4 rounded-xl border border-amber-500/20">
                <Coins className="w-5 h-5" />
                <span className="font-bold">골드 획득!</span>
              </div>
            )}
          </div>

          {passed && isUnlockedNext && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 mb-8 flex items-center justify-center space-x-3"
            >
              <Key className="w-6 h-6 text-amber-500" />
              <span className="text-amber-500 font-bold">다음 스테이지 오픈!</span>
            </motion.div>
          )}

          <div className="space-y-3">
            {passed && isUnlockedNext && stage < 15 ? (
              <button
                onClick={() => { playClickSound(); onNext(); }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <span>다음 스테이지로</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => { playClickSound(); onRetry(); }}
                className="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center space-x-2"
              >
                <span>다시 도전하기</span>
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => { playClickSound(); onMap(); }}
              className="w-full bg-slate-700 hover:bg-slate-600 text-white font-bold py-4 rounded-xl transition-colors"
            >
              지도로 돌아가기
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
