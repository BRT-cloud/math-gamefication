import React from 'react';
import { motion } from 'motion/react';
import { X, BookOpen, CheckCircle2 } from 'lucide-react';
import { UserState } from '../utils/storage';
import { MathDisplay } from './MathDisplay';
import { DynamicSVG } from './DynamicSVG';

type ReviewScreenProps = {
  state: UserState;
  onClose: () => void;
  onSolveAll: () => void;
};

export function ReviewScreen({ state, onClose, onSolveAll }: ReviewScreenProps) {
  return (
    <div className="min-h-screen bg-slate-900 text-white p-4 md:p-8 flex flex-col">
      <header className="flex items-center justify-between mb-8 bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl max-w-4xl mx-auto w-full">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 bg-rose-500 rounded-full flex items-center justify-center shadow-lg shadow-rose-500/30">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight">오답 노트</h1>
            <p className="text-rose-400 font-bold">틀린 문제: {state.wrong_problems.length}개</p>
          </div>
        </div>
        <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
          <X className="w-8 h-8" />
        </button>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full">
        {state.wrong_problems.length === 0 ? (
          <div className="bg-slate-800 rounded-3xl p-12 text-center border border-slate-700">
            <CheckCircle2 className="w-20 h-20 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">오답이 없습니다!</h2>
            <p className="text-slate-400">모든 문제를 완벽하게 풀었네요. 대단해요!</p>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-end">
              <button
                onClick={onSolveAll}
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold py-3 px-6 rounded-xl transition-colors shadow-lg shadow-emerald-500/30 flex items-center gap-2"
              >
                <BookOpen className="w-5 h-5" />
                모두 다시 풀기 (보상 2배!)
              </button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {state.wrong_problems.map((problem, idx) => (
                <motion.div
                  key={problem.id + idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-slate-800 p-6 rounded-2xl border border-slate-700"
                >
                  <div className="text-sm text-slate-400 mb-4 font-bold">문제 {idx + 1}</div>
                  
                  {problem.svgType && (
                    <div className="mb-4">
                      <DynamicSVG type={problem.svgType} params={problem.svgParams} />
                    </div>
                  )}
                  
                  <div className="bg-slate-900 p-4 rounded-xl mb-4">
                    <MathDisplay text={problem.question} />
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-400">정답:</span>
                    <span className="text-emerald-400 font-bold text-lg">
                      {problem.answer} {problem.answerUnit || ''}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
