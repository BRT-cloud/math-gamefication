/// <reference types="vite/client" />
import { UserState } from './storage';
import { sanitizeInput } from './security';

const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '';
const TIMEOUT_MS = 8000; // Increased to 8 seconds for better reliability with GAS cold starts

export const fetchUserData = async (nickname: string): Promise<UserState | null> => {
  if (!API_URL) {
    console.warn('API_URL is not defined. Using local storage fallback.');
    throw new Error('API_URL_MISSING');
  }
  
  const sanitizedNickname = sanitizeInput(nickname);
  
  const controller = new AbortController();
  const id = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);
  
  try {
    const separator = API_URL.includes('?') ? '&' : '?';
    const cacheBuster = `${separator}t=${new Date().getTime()}`;
    const response = await fetch(`${API_URL}${cacheBuster}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'getUser', nickname: sanitizedNickname }),
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
            answer_magnet: Number(fullState.items?.answer_magnet) || 0,
            lucky_dice: Number(fullState.items?.lucky_dice) || 0,
            resurrection_feather: Number(fullState.items?.resurrection_feather) || 0,
          }
        };
      } catch (e) {
        console.error('Failed to parse Wrong_Note', e);
      }
    }
    return null;
  } catch (error) {
    clearTimeout(id);
    
    const isTimeout = error instanceof Error && (error.name === 'AbortError' || error.message === 'Timeout');
    const errorMessage = isTimeout ? '서버 응답 시간이 초과되었습니다.' : (error instanceof Error ? error.message : String(error));
    
    // Log a more helpful and less scary message
    console.warn(`Google Sheets API 연동 실패 (${isTimeout ? '타임아웃' : '에러'}):`, errorMessage);
    console.warn('💡 팁: Google Apps Script 배포 시 "액세스 권한이 있는 사용자"를 "모든 사용자"로 설정했는지 확인하세요.');
    
    throw error;
  }
};

export const syncUserData = async (state: UserState, totalAttempted: number = 0) => {
  if (!API_URL) return;
  
  const sanitizedNickname = sanitizeInput(state.nickname);
  const accuracy = totalAttempted > 0 ? Math.round((state.total_score / totalAttempted) * 100) : 0;
  
  const controller = new AbortController();
  const id = setTimeout(() => {
    controller.abort();
  }, TIMEOUT_MS);
  
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
        nickname: sanitizedNickname,
        level: state.unlocked_stages.length,
        gold: state.gold,
        solvedCount: state.total_score,
        accuracy: accuracy,
        wrongNote: JSON.stringify({ ...state, nickname: sanitizedNickname }),
      }),
      redirect: 'follow',
      signal: controller.signal
    });
    clearTimeout(id);
  } catch (error) {
    clearTimeout(id);
    const isTimeout = error instanceof Error && (error.name === 'AbortError' || error.message === 'Timeout');
    console.warn(`Google Sheets API 동기화 실패 (${isTimeout ? '타임아웃' : '에러'}):`, error instanceof Error ? error.message : String(error));
  }
};
