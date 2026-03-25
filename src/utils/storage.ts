import { Problem } from './mathGenerator';

export type AvatarParts = 'head' | 'body' | 'arms' | 'legs';

export type UserState = {
  nickname: string;
  current_stage: number;
  total_score: number;
  unlocked_stages: number[];
  gold: number;
  avatarColor: string;
  avatarColors: Record<AvatarParts, string>;
  ownedColors: string[];
  wrong_problems: Problem[];
  items: {
    heart_potion: number;
    sacred_shield: number;
    magic_magnifier: number;
    lucky_horseshoe: number;
    golden_crown: number;
  };
  doubleXpCharges: number;
  equippedItems: {
    head: string | null;
    torso: string | null;
    legs: string | null;
    rightHand: string | null;
  };
  ownedItems: string[];
};

const STORAGE_KEY = 'math_expedition_state';

export const defaultState: UserState = {
  nickname: '',
  current_stage: 1,
  total_score: 0,
  unlocked_stages: [1],
  gold: 0,
  avatarColor: 'bg-emerald-500',
  avatarColors: {
    head: '#cccccc',
    body: '#cccccc',
    arms: '#cccccc',
    legs: '#cccccc',
  },
  ownedColors: ['#cccccc'],
  wrong_problems: [],
  items: {
    heart_potion: 0,
    sacred_shield: 0,
    magic_magnifier: 0,
    lucky_horseshoe: 0,
    golden_crown: 0,
  },
  doubleXpCharges: 0,
  equippedItems: {
    head: null,
    torso: null,
    legs: null,
    rightHand: null,
  },
  ownedItems: [],
};

export function loadState(): UserState {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...defaultState,
        ...parsed,
        gold: parsed.gold || 0,
        avatarColor: parsed.avatarColor || 'bg-emerald-500',
        avatarColors: parsed.avatarColors || defaultState.avatarColors,
        ownedColors: parsed.ownedColors || defaultState.ownedColors,
        wrong_problems: parsed.wrong_problems || [],
        items: {
          heart_potion: Number(parsed.items?.heart_potion) || 0,
          sacred_shield: Number(parsed.items?.sacred_shield) || Number(parsed.shields) || 0,
          magic_magnifier: Number(parsed.items?.magic_magnifier) || 0,
          lucky_horseshoe: Number(parsed.items?.lucky_horseshoe) || Number(parsed.items?.magnet) || 0,
          golden_crown: Number(parsed.items?.golden_crown) || 0,
        },
        doubleXpCharges: parsed.doubleXpCharges || 0,
        equippedItems: parsed.equippedItems || defaultState.equippedItems,
        ownedItems: parsed.ownedItems || defaultState.ownedItems,
      };
    }
  } catch (e) {
    console.error('Failed to load state', e);
  }
  return defaultState;
}

export function saveState(state: UserState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Failed to save state', e);
  }
}
