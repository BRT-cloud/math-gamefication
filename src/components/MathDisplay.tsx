import React from 'react';

type MathDisplayProps = {
  text: string;
  className?: string;
};

export function MathDisplay({ text, className = "" }: MathDisplayProps) {
  // Simple parser for \frac{A}{B} and \n
  const parts = text.split(/(\\frac{\d+}{\d+}|\n)/g);

  return (
    <div className={`flex flex-wrap items-center font-bold font-mono ${className}`}>
      {parts.map((part, i) => {
        if (part === '\n') {
          return <div key={i} className="w-full h-0" />;
        }
        if (part.startsWith('\\frac{')) {
          const match = part.match(/\\frac{(\d+)}{(\d+)}/);
          if (match) {
            const num = match[1];
            const den = match[2];
            return (
              <div key={i} className="flex flex-col items-center mx-2 inline-flex align-middle">
                <span className="border-b-[3px] border-current px-1 leading-none pb-1">{num}</span>
                <span className="px-1 leading-none pt-1">{den}</span>
              </div>
            );
          }
        }
        
        // Handle other math symbols
        let displayPart = part;
        displayPart = displayPart.replace(/\\times/g, '×');
        displayPart = displayPart.replace(/\\div/g, '÷');
        
        return <span key={i} className="whitespace-pre-wrap break-keep">{displayPart}</span>;
      })}
    </div>
  );
}
