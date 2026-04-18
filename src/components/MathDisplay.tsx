import React from 'react';
import katex from 'katex';

type MathDisplayProps = {
  text: string;
  className?: string;
};

export function MathDisplay({ text, className = "" }: MathDisplayProps) {
  // Split by newlines first
  const lines = text.split('\n');

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {lines.map((line, i) => {
        // Split line into math and non-math parts
        // This regex looks for \frac{...}{...}, \times, \div
        const parts = line.split(/(\\frac\{[^{}]*\}\{[^{}]*\}|\\times|\\div)/g);

        return (
          <div key={i} className="flex flex-wrap items-center justify-center gap-x-1 leading-relaxed">
            {parts.map((part, j) => {
              if (part.startsWith('\\')) {
                try {
                  const html = katex.renderToString(part, {
                    throwOnError: false,
                    displayMode: false,
                    output: 'html'
                  });
                  return (
                    <span 
                      key={j} 
                      className="inline-block align-middle mx-0.5"
                      dangerouslySetInnerHTML={{ __html: html }} 
                    />
                  );
                } catch (e) {
                  return <span key={j}>{part}</span>;
                }
              }
              return (
                <span key={j} className="whitespace-pre-wrap">
                  {part}
                </span>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
