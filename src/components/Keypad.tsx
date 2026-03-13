import React from 'react';

type KeypadProps = {
  onInput: (val: string) => void;
  onDelete: () => void;
  onSubmit: () => void;
  onClear: () => void;
};

export function Keypad({ onInput, onDelete, onSubmit, onClear }: KeypadProps) {
  const keys = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '.', '0', '/'
  ];

  return (
    <div className="bg-slate-800 p-4 rounded-2xl shadow-xl w-full max-w-sm mx-auto">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {keys.map((k) => (
          <button
            key={k}
            onClick={() => onInput(k)}
            className="bg-slate-700 hover:bg-slate-600 active:bg-slate-500 text-white text-2xl font-bold py-4 rounded-xl transition-colors"
          >
            {k}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={onClear}
          className="bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-xl font-bold py-4 rounded-xl transition-colors"
        >
          C
        </button>
        <button
          onClick={onDelete}
          className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-xl font-bold py-4 rounded-xl transition-colors"
        >
          DEL
        </button>
        <button
          onClick={onSubmit}
          className="bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 text-white text-xl font-bold py-4 rounded-xl transition-colors"
        >
          ENTER
        </button>
      </div>
    </div>
  );
}
