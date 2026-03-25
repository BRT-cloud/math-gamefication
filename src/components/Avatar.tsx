import React, { useRef, useMemo, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { Group } from 'three';
import { useGLTF } from '@react-three/drei';
import { UserState } from '../utils/storage';

// 외부 고퀄리티 모델 URL 매핑 (실제 에셋 URL로 교체하여 사용)
// .glb 또는 .gltf 파일 경로를 여기에 입력하면 실시간으로 로드됩니다.
const MODEL_URLS: Record<string, string> = {
  // Base Parts (기본 아바타 부위)
  head_base: '', // e.g., '/models/base/head.glb'
  torso_base: '', // e.g., '/models/base/torso.glb'
  legs_base: '', // e.g., '/models/base/legs.glb'
  arm_left_base: '',
  arm_right_base: '',

  // Shop Items - Head
  cap_red: '',
  glasses_nerd: '',
  hat_wizard: '',
  helmet_knight: '',
  headband_ninja: '',
  crown_gold: '',
  mask_cyberpunk: '',
  halo_angel: '',

  // Shop Items - Torso
  shirt_blue: '',
  suit_black: '',
  robe_wizard: '',
  armor_iron: '',
  jacket_leather: '',
  armor_golden: '',

  // Shop Items - Legs
  pants_black: '',
  pants_white: '',
  shoes_red: '',
  boots_knight: '',
  pants_camo: '',
  skirt_pleated: '',

  // Shop Items - RightHand
  sword_wooden: '',
  shield_basic: '',
  sword_iron: '',
  book_magic: '',
  wand_magic: '',
  axe_battle: '',
  staff_crystal: '',
};

// GLTF 모델을 로드하는 컴포넌트 (URL이 없거나 로드 실패 시 fallback 렌더링)
function ModularPart({ itemId, fallback }: { itemId?: string | null; fallback: React.ReactNode }) {
  const url = itemId ? MODEL_URLS[itemId] : '';
  
  if (!url) {
    return <>{fallback}</>;
  }

  return (
    <Suspense fallback={fallback}>
      <GLTFLoader url={url} fallback={fallback} />
    </Suspense>
  );
}

function GLTFLoader({ url, fallback }: { url: string; fallback: React.ReactNode }) {
  try {
    const { scene } = useGLTF(url);
    const clone = useMemo(() => scene.clone(), [scene]);
    return <primitive object={clone} />;
  } catch (e) {
    console.warn(`Failed to load model: ${url}`);
    return <>{fallback}</>;
  }
}

interface AvatarProps {
  state: UserState;
  previewItems?: Record<string, string | null>;
}

export function Avatar({ state, previewItems = {} }: AvatarProps) {
  const groupRef = useRef<Group>(null);
  const avatarColors = state.avatarColors;

  // Merge equipped items with preview items
  const activeItems = {
    head: previewItems.head !== undefined ? previewItems.head : state.equippedItems.head,
    torso: previewItems.torso !== undefined ? previewItems.torso : state.equippedItems.torso,
    legs: previewItems.legs !== undefined ? previewItems.legs : state.equippedItems.legs,
    rightHand: previewItems.rightHand !== undefined ? previewItems.rightHand : state.equippedItems.rightHand,
  };

  // Backward compatibility for golden crown
  if (state.items.golden_crown > 0 && !activeItems.head && previewItems.head === undefined) {
    activeItems.head = 'crown_gold';
  }

  // Simple idle animation (breathing)
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 2) * 0.05 - 0.5;
      // 약간의 자연스러운 회전
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* ==========================================
          LEGS NODE (하체 노드 - 최하단)
      ========================================== */}
      <group name="LegsNode" position={[0, 0.4, 0]}>
        <ModularPart 
          itemId={activeItems.legs || 'legs_base'} 
          fallback={
            // 기존의 Fallback 렌더링 로직
            activeItems.legs === 'pants_black' ? (
              <>
                <mesh position={[-0.3, 0, 0]}><capsuleGeometry args={[0.22, 0.6, 4, 16]} /><meshStandardMaterial color="#1f2937" roughness={0.8} /></mesh>
                <mesh position={[0.3, 0, 0]}><capsuleGeometry args={[0.22, 0.6, 4, 16]} /><meshStandardMaterial color="#1f2937" roughness={0.8} /></mesh>
              </>
            ) : activeItems.legs === 'pants_white' ? (
              <>
                <mesh position={[-0.3, 0, 0]}><capsuleGeometry args={[0.22, 0.6, 4, 16]} /><meshStandardMaterial color="#f8fafc" roughness={0.8} /></mesh>
                <mesh position={[0.3, 0, 0]}><capsuleGeometry args={[0.22, 0.6, 4, 16]} /><meshStandardMaterial color="#f8fafc" roughness={0.8} /></mesh>
              </>
            ) : activeItems.legs === 'shoes_red' ? (
              <>
                <mesh position={[-0.3, 0, 0]}><capsuleGeometry args={[0.2, 0.6, 4, 16]} /><meshStandardMaterial color={avatarColors.legs} roughness={0.5} /></mesh>
                <mesh position={[0.3, 0, 0]}><capsuleGeometry args={[0.2, 0.6, 4, 16]} /><meshStandardMaterial color={avatarColors.legs} roughness={0.5} /></mesh>
                <mesh position={[-0.3, -0.4, 0.1]}><boxGeometry args={[0.5, 0.3, 0.6]} /><meshStandardMaterial color="#ef4444" roughness={0.6} /></mesh>
                <mesh position={[0.3, -0.4, 0.1]}><boxGeometry args={[0.5, 0.3, 0.6]} /><meshStandardMaterial color="#ef4444" roughness={0.6} /></mesh>
              </>
            ) : activeItems.legs === 'boots_knight' ? (
              <>
                <mesh position={[-0.3, 0, 0]}><capsuleGeometry args={[0.2, 0.6, 4, 16]} /><meshStandardMaterial color={avatarColors.legs} roughness={0.5} /></mesh>
                <mesh position={[0.3, 0, 0]}><capsuleGeometry args={[0.2, 0.6, 4, 16]} /><meshStandardMaterial color={avatarColors.legs} roughness={0.5} /></mesh>
                <mesh position={[-0.3, -0.3, 0.05]}><cylinderGeometry args={[0.25, 0.28, 0.5, 16]} /><meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} /></mesh>
                <mesh position={[0.3, -0.3, 0.05]}><cylinderGeometry args={[0.25, 0.28, 0.5, 16]} /><meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} /></mesh>
              </>
            ) : activeItems.legs === 'pants_camo' ? (
              <>
                <mesh position={[-0.3, 0, 0]}><capsuleGeometry args={[0.22, 0.6, 4, 16]} /><meshStandardMaterial color="#4b5320" roughness={0.9} /></mesh>
                <mesh position={[0.3, 0, 0]}><capsuleGeometry args={[0.22, 0.6, 4, 16]} /><meshStandardMaterial color="#4b5320" roughness={0.9} /></mesh>
              </>
            ) : activeItems.legs === 'skirt_pleated' ? (
              <>
                <mesh position={[0, 0.1, 0]}><cylinderGeometry args={[0.5, 0.7, 0.6, 16]} /><meshStandardMaterial color="#be123c" roughness={0.8} /></mesh>
                <mesh position={[-0.3, -0.2, 0]}><capsuleGeometry args={[0.18, 0.4, 4, 16]} /><meshStandardMaterial color={avatarColors.legs} roughness={0.5} /></mesh>
                <mesh position={[0.3, -0.2, 0]}><capsuleGeometry args={[0.18, 0.4, 4, 16]} /><meshStandardMaterial color={avatarColors.legs} roughness={0.5} /></mesh>
              </>
            ) : (
              <>
                <mesh position={[-0.3, 0, 0]}><capsuleGeometry args={[0.2, 0.6, 4, 16]} /><meshStandardMaterial color={avatarColors.legs} roughness={0.5} /></mesh>
                <mesh position={[0.3, 0, 0]}><capsuleGeometry args={[0.2, 0.6, 4, 16]} /><meshStandardMaterial color={avatarColors.legs} roughness={0.5} /></mesh>
              </>
            )
          } 
        />
      </group>

      {/* ==========================================
          TORSO NODE (상체 노드 - 하체 위에 위치)
      ========================================== */}
      <group name="TorsoNode" position={[0, 1.5, 0]}>
        <ModularPart 
          itemId={activeItems.torso || 'torso_base'} 
          fallback={
            activeItems.torso === 'shirt_blue' ? (
              <mesh><capsuleGeometry args={[0.65, 1.0, 4, 16]} /><meshStandardMaterial color="#3b82f6" roughness={0.7} /></mesh>
            ) : activeItems.torso === 'suit_black' ? (
              <group>
                <mesh><capsuleGeometry args={[0.65, 1.0, 4, 16]} /><meshStandardMaterial color="#171717" roughness={0.9} /></mesh>
                <mesh position={[0, 0.1, 0.66]}><boxGeometry args={[0.1, 0.6, 0.05]} /><meshStandardMaterial color="#ef4444" /></mesh>
                <mesh position={[0, 0.45, 0.64]}><boxGeometry args={[0.3, 0.2, 0.05]} /><meshStandardMaterial color="#ffffff" /></mesh>
              </group>
            ) : activeItems.torso === 'robe_wizard' ? (
              <group>
                <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.5, 0.7, 1.4, 16]} /><meshStandardMaterial color="#4c1d95" roughness={0.9} /></mesh>
                <mesh position={[0, -0.2, 0]}><cylinderGeometry args={[0.62, 0.62, 0.1, 16]} /><meshStandardMaterial color="#f59e0b" /></mesh>
              </group>
            ) : activeItems.torso === 'armor_iron' ? (
              <group>
                <mesh><capsuleGeometry args={[0.7, 1.1, 4, 16]} /><meshStandardMaterial color="#94a3b8" metalness={0.6} roughness={0.3} /></mesh>
                <mesh position={[0, 0.2, 0.65]}><boxGeometry args={[0.4, 0.4, 0.2]} /><meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} /></mesh>
              </group>
            ) : activeItems.torso === 'jacket_leather' ? (
              <group>
                <mesh><capsuleGeometry args={[0.65, 1.05, 4, 16]} /><meshStandardMaterial color="#1f2937" roughness={0.8} /></mesh>
                <mesh position={[0, 0, 0.66]}><boxGeometry args={[0.2, 0.9, 0.05]} /><meshStandardMaterial color="#e5e7eb" /></mesh>
              </group>
            ) : activeItems.torso === 'armor_golden' ? (
              <group>
                <mesh><capsuleGeometry args={[0.7, 1.1, 4, 16]} /><meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} /></mesh>
                <mesh position={[0, 0.2, 0.65]}><boxGeometry args={[0.4, 0.4, 0.2]} /><meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} /></mesh>
                <mesh position={[0, -0.2, 0.68]}><boxGeometry args={[0.2, 0.2, 0.1]} /><meshStandardMaterial color="#ef4444" /></mesh>
              </group>
            ) : (
              <mesh><capsuleGeometry args={[0.6, 1.0, 4, 16]} /><meshStandardMaterial color={avatarColors.body} roughness={0.5} /></mesh>
            )
          } 
        />

        {/* --- LEFT ARM NODE --- */}
        {/* 팔이 기본적으로 아래를 향하도록 rotation을 [0, 0, 0]으로 설정 */}
        <group name="LeftArmNode" position={[-0.75, 0.2, 0]} rotation={[0, 0, 0]}>
          <ModularPart 
            itemId="arm_left_base" 
            fallback={
              <mesh position={[0, -0.2, 0]}>
                <capsuleGeometry args={[0.2, 0.8, 4, 16]} />
                <meshStandardMaterial color={avatarColors.arms} roughness={0.5} />
              </mesh>
            } 
          />
        </group>

        {/* --- RIGHT ARM NODE --- */}
        {/* 팔이 기본적으로 아래를 향하도록 rotation을 [0, 0, 0]으로 설정 */}
        <group name="RightArmNode" position={[0.75, 0.2, 0]} rotation={[0, 0, 0]}>
          <ModularPart 
            itemId="arm_right_base" 
            fallback={
              <mesh position={[0, -0.2, 0]}>
                <capsuleGeometry args={[0.2, 0.8, 4, 16]} />
                <meshStandardMaterial color={avatarColors.arms} roughness={0.5} />
              </mesh>
            } 
          />
          
          {/* ==========================================
              WEAPON ATTACHMENT NODE (오른손 끝에 무기 장착)
              외부 모델 사용 시, 이 노드는 아바타의 'RightHand' 본(Bone)에 해당합니다.
              무기 모델은 이 노드의 자식으로 추가되어 손의 움직임을 정확히 따라갑니다.
          ========================================== */}
          <group name="RightHandAttachment" position={[0, -0.6, 0]}>
            <ModularPart 
              itemId={activeItems.rightHand} 
              fallback={
                activeItems.rightHand === 'sword_wooden' ? (
                  <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.05, 0.05, 0.4]} /><meshStandardMaterial color="#8B4513" /></mesh>
                    <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.4, 0.1, 0.1]} /><meshStandardMaterial color="#654321" /></mesh>
                    <mesh position={[0, 0.7, 0]}><boxGeometry args={[0.15, 0.9, 0.05]} /><meshStandardMaterial color="#D2B48C" /></mesh>
                  </group>
                ) : activeItems.rightHand === 'sword_iron' ? (
                  <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.04, 0.04, 0.4]} /><meshStandardMaterial color="#1e293b" /></mesh>
                    <mesh position={[0, 0.2, 0]}><boxGeometry args={[0.5, 0.05, 0.1]} /><meshStandardMaterial color="#f59e0b" metalness={0.8} roughness={0.2} /></mesh>
                    <mesh position={[0, 0.8, 0]}><boxGeometry args={[0.1, 1.1, 0.02]} /><meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} /></mesh>
                  </group>
                ) : activeItems.rightHand === 'book_magic' ? (
                  <group rotation={[0, Math.PI / 2, 0]} position={[0.2, 0, 0]}>
                    <mesh position={[0, 0, 0]}><boxGeometry args={[0.4, 0.5, 0.1]} /><meshStandardMaterial color="#7e22ce" /></mesh>
                    <mesh position={[0.02, 0, 0]}><boxGeometry args={[0.38, 0.48, 0.12]} /><meshStandardMaterial color="#fef3c7" /></mesh>
                  </group>
                ) : activeItems.rightHand === 'shield_basic' ? (
                  <group rotation={[0, Math.PI / 2, 0]} position={[0, 0, 0]}>
                    <mesh position={[0.1, 0, 0]}><cylinderGeometry args={[0.4, 0.4, 0.1, 16]} /><meshStandardMaterial color="#8B4513" /></mesh>
                    <mesh position={[0.1, 0.06, 0]}><cylinderGeometry args={[0.3, 0.3, 0.1, 16]} /><meshStandardMaterial color="#A0522D" /></mesh>
                  </group>
                ) : activeItems.rightHand === 'wand_magic' ? (
                  <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <mesh position={[0, 0.4, 0]}><cylinderGeometry args={[0.04, 0.06, 1.2]} /><meshStandardMaterial color="#4a044e" /></mesh>
                    <mesh position={[0, 1.0, 0]}><sphereGeometry args={[0.15, 16, 16]} /><meshStandardMaterial color="#d946ef" emissive="#d946ef" emissiveIntensity={0.5} /></mesh>
                  </group>
                ) : activeItems.rightHand === 'axe_battle' ? (
                  <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <mesh position={[0, 0.3, 0]}><cylinderGeometry args={[0.05, 0.05, 1.4]} /><meshStandardMaterial color="#3f271d" /></mesh>
                    <mesh position={[0, 0.8, 0]}><boxGeometry args={[0.8, 0.3, 0.05]} /><meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} /></mesh>
                    <mesh position={[0.4, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.3, 0.3, 0.04]} /><meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} /></mesh>
                    <mesh position={[-0.4, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}><boxGeometry args={[0.3, 0.3, 0.04]} /><meshStandardMaterial color="#e2e8f0" metalness={0.8} roughness={0.2} /></mesh>
                  </group>
                ) : activeItems.rightHand === 'staff_crystal' ? (
                  <group rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
                    <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.06, 0.04, 1.8]} /><meshStandardMaterial color="#1e3a8a" /></mesh>
                    <mesh position={[0, 1.5, 0]}><octahedronGeometry args={[0.25]} /><meshStandardMaterial color="#38bdf8" emissive="#0ea5e9" emissiveIntensity={0.8} transparent opacity={0.9} /></mesh>
                    <mesh position={[0, 1.5, 0]}><sphereGeometry args={[0.3, 8, 8]} /><meshStandardMaterial color="#bae6fd" wireframe /></mesh>
                  </group>
                ) : null
              } 
            />
          </group>
        </group>

        {/* ==========================================
            HEAD NODE (머리 노드 - 상체에 종속됨)
        ========================================== */}
        <group name="HeadNode" position={[0, 1.3, 0]}>
          <ModularPart 
            itemId="head_base" 
            fallback={
              <group>
                <mesh>
                  <sphereGeometry args={[0.7, 32, 32]} />
                  <meshStandardMaterial color={avatarColors.head} roughness={0.4} />
                </mesh>
                {/* Face */}
                <group position={[0, 0, 0.65]}>
                  <mesh position={[-0.25, 0.1, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#111827" /></mesh>
                  <mesh position={[0.25, 0.1, 0]}><sphereGeometry args={[0.08, 16, 16]} /><meshStandardMaterial color="#111827" /></mesh>
                  <mesh position={[0, -0.15, 0.02]} rotation={[0.2, 0, 0]}><capsuleGeometry args={[0.04, 0.15, 4, 8]} /><meshStandardMaterial color="#111827" /></mesh>
                </group>
              </group>
            } 
          />

          {/* ==========================================
              HAT ATTACHMENT NODE (머리 위에 모자 장착)
              외부 모델 사용 시, 이 노드는 아바타의 'Head' 본(Bone)에 해당합니다.
              모자나 안경 같은 액세서리는 이 노드에 장착되어 머리의 회전을 따라갑니다.
          ========================================== */}
          <group name="HatAttachment" position={[0, 0.4, 0]}>
            <ModularPart 
              itemId={activeItems.head} 
              fallback={
                activeItems.head === 'cap_red' ? (
                  <group position={[0, 0, 0]}>
                    <mesh position={[0, 0.1, 0]}><sphereGeometry args={[0.72, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2]} /><meshStandardMaterial color="#ef4444" roughness={0.8} /></mesh>
                    <mesh position={[0, 0.1, 0.4]} rotation={[-0.1, 0, 0]}><cylinderGeometry args={[0.7, 0.7, 0.05, 32, 1, false, 0, Math.PI]} /><meshStandardMaterial color="#ef4444" roughness={0.8} /></mesh>
                  </group>
                ) : activeItems.head === 'hat_wizard' ? (
                  <group position={[0, 0.2, 0]}>
                    <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.9, 0.9, 0.05, 32]} /><meshStandardMaterial color="#4c1d95" roughness={0.9} /></mesh>
                    <mesh position={[0, 0.6, 0]}><coneGeometry args={[0.5, 1.2, 32]} /><meshStandardMaterial color="#4c1d95" roughness={0.9} /></mesh>
                  </group>
                ) : activeItems.head === 'helmet_knight' ? (
                  <group position={[0, -0.3, 0]}>
                    <mesh><cylinderGeometry args={[0.75, 0.75, 0.8, 32]} /><meshStandardMaterial color="#94a3b8" metalness={0.7} roughness={0.3} /></mesh>
                    <mesh position={[0, 0.1, 0.76]}><boxGeometry args={[0.6, 0.1, 0.05]} /><meshStandardMaterial color="#0f172a" /></mesh>
                    <mesh position={[0, 0.6, -0.2]} rotation={[0.3, 0, 0]}><boxGeometry args={[0.1, 0.6, 0.4]} /><meshStandardMaterial color="#ef4444" /></mesh>
                  </group>
                ) : activeItems.head === 'headband_ninja' ? (
                  <group position={[0, -0.1, 0]}>
                    <mesh><cylinderGeometry args={[0.71, 0.71, 0.15, 32]} /><meshStandardMaterial color="#ef4444" /></mesh>
                    <mesh position={[0.5, -0.2, -0.6]} rotation={[0.5, 0.5, 0]}><boxGeometry args={[0.1, 0.5, 0.02]} /><meshStandardMaterial color="#ef4444" /></mesh>
                    <mesh position={[0.3, -0.3, -0.65]} rotation={[0.3, 0.2, 0]}><boxGeometry args={[0.1, 0.4, 0.02]} /><meshStandardMaterial color="#ef4444" /></mesh>
                  </group>
                ) : activeItems.head === 'glasses_nerd' ? (
                  <group position={[0, -0.3, 0.7]}>
                    <mesh position={[-0.25, 0, 0]}><torusGeometry args={[0.15, 0.04, 8, 24]} /><meshStandardMaterial color="#111827" /></mesh>
                    <mesh position={[0.25, 0, 0]}><torusGeometry args={[0.15, 0.04, 8, 24]} /><meshStandardMaterial color="#111827" /></mesh>
                    <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}><cylinderGeometry args={[0.02, 0.02, 0.2]} /><meshStandardMaterial color="#111827" /></mesh>
                  </group>
                ) : activeItems.head === 'crown_gold' ? (
                  <group position={[0, 0.2, 0]}>
                    <mesh position={[0, 0, 0]}><cylinderGeometry args={[0.5, 0.4, 0.4, 16]} /><meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} /></mesh>
                    {Array.from({ length: 8 }).map((_, i) => {
                      const angle = (i / 8) * Math.PI * 2;
                      const radius = 0.45;
                      const x = Math.cos(angle) * radius;
                      const z = Math.sin(angle) * radius;
                      return (
                        <mesh key={i} position={[x, 0.3, z]} rotation={[0, -angle, 0]}>
                          <coneGeometry args={[0.15, 0.4, 4]} />
                          <meshStandardMaterial color="#FBBF24" metalness={0.8} roughness={0.2} />
                        </mesh>
                      );
                    })}
                    {Array.from({ length: 4 }).map((_, i) => {
                      const angle = (i / 4) * Math.PI * 2;
                      const radius = 0.52;
                      const x = Math.cos(angle) * radius;
                      const z = Math.sin(angle) * radius;
                      const colors = ['#EF4444', '#3B82F6', '#10B981', '#8B5CF6'];
                      return (
                        <mesh key={`jewel-${i}`} position={[x, 0, z]}>
                          <sphereGeometry args={[0.08, 8, 8]} />
                          <meshStandardMaterial color={colors[i]} metalness={0.5} roughness={0.1} />
                        </mesh>
                      );
                    })}
                  </group>
                ) : activeItems.head === 'mask_cyberpunk' ? (
                  <group position={[0, -0.4, 0.68]}>
                    <mesh position={[0, 0, 0]}><boxGeometry args={[0.6, 0.3, 0.1]} /><meshStandardMaterial color="#111827" roughness={0.8} /></mesh>
                    <mesh position={[0, 0.05, 0.06]}><boxGeometry args={[0.5, 0.05, 0.05]} /><meshStandardMaterial color="#22d3ee" emissive="#06b6d4" emissiveIntensity={1} /></mesh>
                    <mesh position={[0, -0.05, 0.06]}><boxGeometry args={[0.3, 0.02, 0.05]} /><meshStandardMaterial color="#f43f5e" emissive="#e11d48" emissiveIntensity={1} /></mesh>
                  </group>
                ) : activeItems.head === 'halo_angel' ? (
                  <group position={[0, 0.6, 0]} rotation={[-0.2, 0, 0]}>
                    <mesh><torusGeometry args={[0.4, 0.05, 16, 32]} /><meshStandardMaterial color="#fef08a" emissive="#fde047" emissiveIntensity={0.8} /></mesh>
                  </group>
                ) : null
              } 
            />
          </group>
        </group>
      </group>
    </group>
  );
}
