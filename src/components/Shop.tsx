import React, { useState } from 'react';
import { AvatarParts, UserState } from '../utils/storage';
import { ItemType, SHOP_ITEMS, ShopItem } from '../utils/items';
import { Coins, Check, Lock, Eye, Shield, Sword, Crown, Shirt, Palette } from 'lucide-react';
import { playClickSound } from '../utils/sound';

type ShopCategory = ItemType | 'color';

const CATEGORIES: { id: ShopCategory; label: string; icon: React.ReactNode }[] = [
  { id: 'head', label: '머리', icon: <Crown className="w-4 h-4" /> },
  { id: 'torso', label: '몸통', icon: <Shirt className="w-4 h-4" /> },
  { id: 'legs', label: '다리', icon: <Shirt className="w-4 h-4 rotate-180" /> },
  { id: 'rightHand', label: '무기/방패', icon: <Sword className="w-4 h-4" /> },
  { id: 'color', label: '색상', icon: <Palette className="w-4 h-4" /> },
];

const COLORS = [
  { name: '기본 회색', hex: '#cccccc', price: 0 },
  { name: '용기의 빨강', hex: '#ef4444', price: 50 },
  { name: '지혜의 파랑', hex: '#3b82f6', price: 50 },
  { name: '자연의 초록', hex: '#22c55e', price: 50 },
  { name: '햇살의 노랑', hex: '#eab308', price: 50 },
  { name: '신비의 보라', hex: '#a855f7', price: 100 },
  { name: '순백의 하양', hex: '#ffffff', price: 150 },
  { name: '칠흑의 검정', hex: '#171717', price: 150 },
];

const COLOR_PARTS: { id: AvatarParts; label: string }[] = [
  { id: 'head', label: '머리' },
  { id: 'body', label: '몸통' },
  { id: 'arms', label: '팔' },
  { id: 'legs', label: '다리' },
];

interface ShopProps {
  state: UserState;
  setState: React.Dispatch<React.SetStateAction<UserState | null>>;
  onSync?: () => void;
  previewItems: Record<string, string | null>;
  setPreviewItems: React.Dispatch<React.SetStateAction<Record<string, string | null>>>;
}

export function Shop({ state, setState, onSync, previewItems, setPreviewItems }: ShopProps) {
  const { gold, ownedItems, equippedItems, ownedColors, avatarColors } = state;
  const [selectedCategory, setSelectedCategory] = useState<ShopCategory>('head');
  const [selectedColorPart, setSelectedColorPart] = useState<AvatarParts>('head');

  const handleEquip = (item: ShopItem) => {
    playClickSound();
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        equippedItems: {
          ...prev.equippedItems,
          [item.type]: item.id
        }
      };
    });
    setPreviewItems(prev => ({ ...prev, [item.type]: null }));
    if (onSync) onSync();
  };

  const handleUnequip = (type: ItemType) => {
    playClickSound();
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        equippedItems: {
          ...prev.equippedItems,
          [type]: null
        }
      };
    });
    setPreviewItems(prev => ({ ...prev, [type]: null }));
    if (onSync) onSync();
  };

  const handleBuy = (item: ShopItem) => {
    playClickSound();
    if (gold >= item.price) {
      setState(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          gold: prev.gold - item.price,
          ownedItems: [...prev.ownedItems, item.id]
        };
      });
      if (onSync) onSync();
    } else {
      alert('골드가 부족합니다!');
    }
  };

  const handlePreview = (item: ShopItem) => {
    playClickSound();
    setPreviewItems(prev => ({
      ...prev,
      [item.type]: prev[item.type] === item.id ? null : item.id
    }));
  };

  const changeColor = (part: AvatarParts, color: string) => {
    setState(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        avatarColors: {
          ...prev.avatarColors,
          [part]: color
        }
      };
    });
    if (onSync) onSync();
  };

  const buyColor = (color: string, price: number) => {
    if (gold >= price) {
      setState(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          gold: prev.gold - price,
          ownedColors: [...prev.ownedColors, color]
        };
      });
      if (onSync) onSync();
      return true;
    }
    return false;
  };

  const handleColorClick = (colorHex: string, price: number) => {
    playClickSound();
    if (ownedColors.includes(colorHex)) {
      changeColor(selectedColorPart, colorHex);
    } else {
      const success = buyColor(colorHex, price);
      if (success) {
        changeColor(selectedColorPart, colorHex);
      } else {
        alert('골드가 부족합니다!');
      }
    }
  };

  const filteredItems = SHOP_ITEMS.filter(item => item.type === selectedCategory);

  return (
    <div className="bg-white rounded-3xl shadow-xl p-6 flex flex-col h-full max-h-[600px] border border-slate-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">아바타 상점</h2>
        <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full">
          <Coins className="w-5 h-5 text-yellow-600" />
          <span className="font-bold text-yellow-700">{gold} G</span>
        </div>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => {
              playClickSound();
              setSelectedCategory(cat.id);
            }}
            className={`px-4 py-2.5 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${
              selectedCategory === cat.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto pr-2">
        {selectedCategory === 'color' ? (
          <div className="flex flex-col h-full">
            <div className="flex gap-2 mb-4">
              {COLOR_PARTS.map((part) => (
                <button
                  key={part.id}
                  onClick={() => setSelectedColorPart(part.id)}
                  className={`flex-1 py-2 rounded-xl font-bold text-sm transition-colors ${
                    selectedColorPart === part.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {part.label}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {COLORS.map((color) => {
                const isOwned = ownedColors.includes(color.hex);
                const isEquipped = avatarColors[selectedColorPart] === color.hex;

                return (
                  <button
                    key={color.hex}
                    onClick={() => handleColorClick(color.hex, color.price)}
                    className={`relative flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                      isEquipped
                        ? 'border-blue-500 bg-blue-50 shadow-sm'
                        : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full mb-2 shadow-inner border border-slate-200"
                      style={{ backgroundColor: color.hex }}
                    />
                    <span className="text-xs font-bold text-slate-700 mb-1">{color.name}</span>
                    
                    {isOwned ? (
                      <span className="text-[10px] font-bold text-blue-600 flex items-center gap-1">
                        {isEquipped ? <><Check className="w-3 h-3" /> 장착중</> : '보유중'}
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-yellow-600 flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {color.price} G
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredItems.map((item) => {
              const isOwned = ownedItems.includes(item.id) || (item.id === 'crown_gold' && state.items.golden_crown > 0);
              const isEquipped = equippedItems[item.type] === item.id;
              const isPreviewing = previewItems[item.type] === item.id;

              return (
                <div
                  key={item.id}
                  className={`flex flex-col items-start p-6 rounded-2xl border-2 transition-all w-full ${
                    isEquipped
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : isPreviewing
                      ? 'border-emerald-400 bg-emerald-50 shadow-sm'
                      : 'border-slate-200 hover:border-blue-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex justify-between items-start w-full mb-2">
                    <h3 className="font-bold text-slate-800 text-lg">{item.name}</h3>
                    {isOwned ? (
                      <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">보유중</span>
                    ) : (
                      <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full flex items-center gap-1">
                        <Lock className="w-3 h-3" /> {item.price} G
                      </span>
                    )}
                  </div>
                  <p 
                    className="text-sm text-slate-500 mb-4 flex-1 w-full"
                    style={{ 
                      display: '-webkit-box', 
                      WebkitLineClamp: 2, 
                      WebkitBoxOrient: 'vertical', 
                      overflow: 'hidden', 
                      wordBreak: 'keep-all' 
                    }}
                  >
                    {item.desc}
                  </p>
                  
                  <div className="flex flex-row justify-between w-full mt-auto gap-2">
                    {!isOwned && (
                      <button
                        onClick={() => handlePreview(item)}
                        className={`w-[48%] py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition-colors ${
                          isPreviewing 
                            ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
                            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                        }`}
                      >
                        <Eye className="w-4 h-4" /> {isPreviewing ? '미리보기 해제' : '장착해보기'}
                      </button>
                    )}
                    
                    {isOwned ? (
                      <button
                        onClick={() => isEquipped ? handleUnequip(item.type) : handleEquip(item)}
                        className={`w-full py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition-colors ${
                          isEquipped
                            ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isEquipped ? '장착 해제' : '장착하기'}
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuy(item)}
                        disabled={gold < item.price}
                        className={`w-[48%] py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-1 transition-colors ${
                          gold >= item.price
                            ? 'bg-yellow-400 text-yellow-900 hover:bg-yellow-500'
                            : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                      >
                        구매하기
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* For testing purposes */}
      <div className="mt-6 pt-4 border-t border-slate-100">
        <button
          onClick={() => {
            playClickSound();
            setState(prev => prev ? { ...prev, gold: prev.gold + 500 } : prev);
            if (onSync) onSync();
          }}
          className="w-full py-3 bg-emerald-100 text-emerald-700 rounded-xl font-bold hover:bg-emerald-200 transition-colors flex items-center justify-center gap-2"
        >
          <Coins className="w-5 h-5" />
          테스트용: 500G 획득
        </button>
      </div>
    </div>
  );
}
