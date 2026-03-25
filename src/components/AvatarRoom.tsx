import React, { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import { Avatar } from './Avatar';
import { Shop } from './Shop';
import { ArrowLeft } from 'lucide-react';
import { playClickSound } from '../utils/sound';

import { UserState } from '../utils/storage';

interface AvatarRoomProps {
  state: UserState;
  setState: React.Dispatch<React.SetStateAction<UserState | null>>;
  onBack: () => void;
  onSync?: () => void;
}

export function AvatarRoom({ state, setState, onBack, onSync }: AvatarRoomProps) {
  const [previewItems, setPreviewItems] = useState<Record<string, string | null>>({});

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center p-4 md:p-8 font-sans">
      <div className="w-full max-w-6xl">
        <header className="mb-8 flex items-center gap-4">
          <button 
            onClick={() => { playClickSound(); onBack(); }}
            className="bg-slate-800 hover:bg-slate-700 text-white p-3 rounded-2xl transition-colors shadow-lg border border-slate-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
              아바타 <span className="text-emerald-400">룸</span>
            </h1>
            <p className="text-slate-400 mt-1 font-medium">나만의 peeps 스타일 아바타를 꾸며보세요!</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* 3D Canvas Area */}
          <div className="lg:col-span-3 h-[500px] lg:h-[600px] bg-slate-800 rounded-3xl shadow-2xl overflow-hidden relative border border-slate-700">
            {/* Performance mode: gl={{ antialias: false, powerPreference: "high-performance" }} */}
            <Canvas
              camera={{ position: [0, 2, 8], fov: 45 }}
              gl={{ antialias: false, powerPreference: "high-performance" }}
              dpr={[1, 1.5]} // Limit pixel ratio for performance
            >
              <color attach="background" args={['#1e293b']} />
              
              {/* Peeps Style Lighting */}
              <ambientLight intensity={0.6} />
              <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow={false} />
              <directionalLight position={[-5, 5, -5]} intensity={0.4} castShadow={false} />
              <directionalLight position={[0, 5, 5]} intensity={0.3} castShadow={false} />
              
              <Suspense fallback={null}>
                <Avatar state={state} previewItems={previewItems} />
                {/* Fake shadow for grounding */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.49, 0]}>
                  <circleGeometry args={[1.5, 32]} />
                  <meshBasicMaterial color="#000000" transparent opacity={0.2} />
                </mesh>
              </Suspense>

              {/* Controls */}
              <OrbitControls 
                enablePan={false} 
                enableZoom={true} 
                minDistance={4} 
                maxDistance={12}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
              />
            </Canvas>
            
            <div className="absolute bottom-4 left-4 bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-full text-xs font-bold text-slate-300 shadow-sm border border-slate-700">
              드래그하여 회전 • 스크롤하여 확대/축소
            </div>
          </div>

          {/* Shop UI Area */}
          <div className="lg:col-span-2">
            <Shop 
              state={state} 
              setState={setState} 
              onSync={onSync} 
              previewItems={previewItems}
              setPreviewItems={setPreviewItems}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
