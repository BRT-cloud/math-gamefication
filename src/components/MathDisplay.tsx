import React from 'react';

type MathDisplayProps = {
  text: string;
};

export function MathDisplay({ text }: MathDisplayProps) {
  // Simple parser for \frac{A}{B}
  const parts = text.split(/(\\frac{\d+}{\d+})/g);

  return (
    <div className="flex items-center justify-center text-4xl font-bold font-mono text-slate-800">
      {parts.map((part, i) => {
        if (part.startsWith('\\frac{')) {
          const match = part.match(/\\frac{(\d+)}{(\d+)}/);
          if (match) {
            const num = match[1];
            const den = match[2];
            return (
              <div key={i} className="flex flex-col items-center mx-2">
                <span className="border-b-[3px] border-slate-800 px-1 leading-none pb-1">{num}</span>
                <span className="px-1 leading-none pt-1">{den}</span>
              </div>
            );
          }
        }
        
        // Handle other math symbols
        let displayPart = part;
        displayPart = displayPart.replace(/\\times/g, '×');
        displayPart = displayPart.replace(/\\div/g, '÷');
        
        return <span key={i} className="whitespace-pre">{displayPart}</span>;
      })}
    </div>
  );
}
