import React from 'react';

export function DynamicSVG({ type, params }: { type: string; params: any }) {
  if (type === 'polygon') {
    if (params.label === 'rect') {
      return (
        <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto drop-shadow-md">
          <rect x="10" y="20" width="80" height="60" fill="#84CC16" stroke="#4D7C0F" strokeWidth="3" />
          <text x="50" y="15" fontSize="10" textAnchor="middle" fill="#4D7C0F" fontWeight="bold">{params.width}cm</text>
          <text x="95" y="50" fontSize="10" textAnchor="start" fill="#4D7C0F" fontWeight="bold">{params.height}cm</text>
        </svg>
      );
    }
    const sides = params.sides;
    const points = Array.from({ length: sides }).map((_, i) => {
      const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
      return `${50 + 40 * Math.cos(angle)},${50 + 40 * Math.sin(angle)}`;
    }).join(' ');
    
    const colors = {
      3: { fill: '#F472B6', stroke: '#BE185D' },
      4: { fill: '#60A5FA', stroke: '#1D4ED8' },
      5: { fill: '#34D399', stroke: '#047857' }
    };
    const color = colors[sides as keyof typeof colors] || colors[3];

    return (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto drop-shadow-md">
        <polygon points={points} fill={color.fill} stroke={color.stroke} strokeWidth="3" />
        {params.label && params.label !== 'none' && (
          <text x="50" y="95" fontSize="12" textAnchor="middle" fill={color.stroke} fontWeight="bold">{params.label}</text>
        )}
      </svg>
    );
  }

  if (type === 'clock') {
    const { hour, minute } = params;
    const minuteAngle = (minute / 60) * 360 - 90;
    const hourAngle = ((hour % 12) / 12) * 360 + (minute / 60) * 30 - 90;

    return (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto drop-shadow-md">
        <circle cx="50" cy="50" r="45" fill="white" stroke="#334155" strokeWidth="4" />
        {Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 90) * (Math.PI / 180);
          const x1 = 50 + 38 * Math.cos(angle);
          const y1 = 50 + 38 * Math.sin(angle);
          const x2 = 50 + 42 * Math.cos(angle);
          const y2 = 50 + 42 * Math.sin(angle);
          return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#64748B" strokeWidth="2" />;
        })}
        <line x1="50" y1="50" x2={50 + 25 * Math.cos(hourAngle * Math.PI / 180)} y2={50 + 25 * Math.sin(hourAngle * Math.PI / 180)} stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
        <line x1="50" y1="50" x2={50 + 35 * Math.cos(minuteAngle * Math.PI / 180)} y2={50 + 35 * Math.sin(minuteAngle * Math.PI / 180)} stroke="#334155" strokeWidth="2" strokeLinecap="round" />
        <circle cx="50" cy="50" r="3" fill="#EF4444" />
      </svg>
    );
  }

  if (type === 'angle') {
    if (params.shape === 'triangle') {
      return (
        <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto drop-shadow-md">
          <polygon points="10,80 90,80 50,20" fill="#CFFAFE" stroke="#0891B2" strokeWidth="3" />
          <text x="25" y="75" fontSize="10" fill="#164E63" fontWeight="bold">{params.angles[0]}°</text>
          <text x="75" y="75" fontSize="10" textAnchor="end" fill="#164E63" fontWeight="bold">{params.angles[1]}°</text>
          <text x="50" y="40" fontSize="10" textAnchor="middle" fill="#164E63" fontWeight="bold">{params.angles[2]}°</text>
        </svg>
      );
    } else {
      return (
        <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto drop-shadow-md">
          <polygon points="20,80 80,80 90,20 10,20" fill="#FEF08A" stroke="#CA8A04" strokeWidth="3" />
          <text x="25" y="75" fontSize="10" fill="#854D0E" fontWeight="bold">{params.angles[0]}°</text>
          <text x="75" y="75" fontSize="10" textAnchor="end" fill="#854D0E" fontWeight="bold">{params.angles[1]}°</text>
          <text x="80" y="35" fontSize="10" textAnchor="end" fill="#854D0E" fontWeight="bold">{params.angles[2]}°</text>
          <text x="20" y="35" fontSize="10" fill="#854D0E" fontWeight="bold">{params.angles[3]}°</text>
        </svg>
      );
    }
  }

  if (type === 'prism') {
    return (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto drop-shadow-md">
        <path d="M 50 20 L 85 35 L 50 50 L 15 35 Z" fill="#A78BFA" stroke="#6D28D9" strokeWidth="2"/>
        <path d="M 15 35 L 50 50 L 50 85 L 15 70 Z" fill="#8B5CF6" stroke="#6D28D9" strokeWidth="2"/>
        <path d="M 85 35 L 50 50 L 50 85 L 85 70 Z" fill="#7C3AED" stroke="#5B21B6" strokeWidth="2"/>
        <text x="30" y="80" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">{params.w}</text>
        <text x="70" y="80" fontSize="10" fill="white" textAnchor="middle" fontWeight="bold">{params.d}</text>
        <text x="90" y="55" fontSize="10" fill="#5B21B6" fontWeight="bold">{params.h}</text>
      </svg>
    );
  }

  if (type === 'circle') {
    return (
      <svg viewBox="0 0 100 100" className="w-32 h-32 mx-auto drop-shadow-md">
        <circle cx="50" cy="50" r="40" fill="#FBCFE8" stroke="#DB2777" strokeWidth="3"/>
        <line x1="50" y1="50" x2="90" y2="50" stroke="#9D174D" strokeWidth="2" strokeDasharray="4"/>
        <circle cx="50" cy="50" r="2" fill="#9D174D" />
        <text x="70" y="45" fontSize="10" fill="#9D174D" textAnchor="middle" fontWeight="bold">{params.r}</text>
      </svg>
    );
  }

  return null;
}
