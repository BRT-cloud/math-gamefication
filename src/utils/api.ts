/// <reference types="vite/client" />
import { UserState } from './storage';

const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '';
const TIMEOUT_MS = 3000; // 3 seconds timeout

export const fetchUserData = async (nickname: string): Promise<UserState | null> => {
  if (!API_URL) {
    console.warn('API_URL is not defined. Using local storage fallback.');
    throw new Error('API_URL_MISSING');
  }
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(new Error('Timeout')), TIMEOUT_MS);
  
  try {
    const separator = API_URL.includes('?') ? '&' : '?';
    const cacheBuster = `${separator}t=${new Date().getTime()}`;
    const response = await fetch(`${API_URL}${cacheBuster}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'getUser', nickname }),
      redirect: 'follow',
      signal: controller.signal
    });
    
    const result = await response.json();
    clearTimeout(id);
    
    if (result.success && result.data) {
      try {
        const fullState = JSON.parse(result.data.Wrong_Note);
        return {
          ...fullState,
          nickname: result.data.Nickname,
          gold: Number(result.data.Gold) || 0,
          items: {
            heart_potion: Number(fullState.items?.heart_potion) || 0,
            sacred_shield: Number(fullState.items?.sacred_shield) || 0,
            magic_magnifier: Number(fullState.items?.magic_magnifier) || 0,
            lucky_horseshoe: Number(fullState.items?.lucky_horseshoe) || Number(fullState.items?.magnet) || Number(result.data.magnet) || 0,
            golden_crown: Number(fullState.items?.golden_crown) || 0,
          }
        };
      } catch (e) {
        console.error('Failed to parse Wrong_Note', e);
      }
    }
    return null;
  } catch (error) {
    clearTimeout(id);
    // Log a more helpful and less scary message
    console.warn('Google Sheets API 연동 실패 (로컬 데이터로 대체됩니다):', error instanceof Error ? error.message : String(error));
    console.warn('💡 팁: Google Apps Script 배포 시 "액세스 권한이 있는 사용자"를 "모든 사용자"로 설정했는지 확인하세요.');
    throw error;
  }
};

export const syncUserData = async (state: UserState, totalAttempted: number = 0) => {
  if (!API_URL) return;
  
  const accuracy = totalAttempted > 0 ? Math.round((state.total_score / totalAttempted) * 100) : 0;
  
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(new Error('Timeout')), TIMEOUT_MS);
  
  try {
    const separator = API_URL.includes('?') ? '&' : '?';
    const cacheBuster = `${separator}t=${new Date().getTime()}`;
    await fetch(`${API_URL}${cacheBuster}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'saveUser',
        nickname: state.nickname,
        level: state.unlocked_stages.length,
        gold: state.gold,
        solvedCount: state.total_score,
        accuracy: accuracy,
        wrongNote: JSON.stringify(state),
      }),
      redirect: 'follow',
      signal: controller.signal
    });
    clearTimeout(id);
  } catch (error) {
    clearTimeout(id);
    console.warn('Google Sheets API 동기화 실패:', error instanceof Error ? error.message : String(error));
  }
};
