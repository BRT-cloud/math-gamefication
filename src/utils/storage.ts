import { Problem } from './mathGenerator';

export type UserState = {
  nickname: string;
  current_stage: number;
  total_score: number;
  unlocked_stages: number[];
  gold: number;
  avatarColor: string;
  wrong_problems: Problem[];
  items: {
    heart_potion: number;
    sacred_shield: number;
    magic_magnifier: number;
    lucky_horseshoe: number;
    golden_crown: number;
  };
  doubleXpCharges: number;
};

const STORAGE_KEY = 'math_expedition_state';

export const defaultState: UserState = {
  nickname: '',
  current_stage: 1,
  total_score: 0,
  unlocked_stages: [1],
  gold: 0,
  avatarColor: 'bg-emerald-500',
  wrong_problems: [],
  items: {
    heart_potion: 0,
    sacred_shield: 0,
    magic_magnifier: 0,
    lucky_horseshoe: 0,
    golden_crown: 0,
  },
  doubleXpCharges: 0,
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
        wrong_problems: parsed.wrong_problems || [],
        items: parsed.items || {
          heart_potion: 0,
          sacred_shield: parsed.shields || 0, // Migrate old shields
          magic_magnifier: 0,
          lucky_horseshoe: 0,
          golden_crown: 0,
        },
        doubleXpCharges: parsed.doubleXpCharges || 0,
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
