import { UserState } from './storage';

const API_URL = import.meta.env.VITE_GOOGLE_SHEETS_API_URL || '';

export const fetchUserData = async (nickname: string): Promise<UserState | null> => {
  if (!API_URL) {
    console.warn('API_URL is not defined. Using local storage fallback.');
    return null;
  }
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({ action: 'getUser', nickname }),
    });
    const result = await response.json();
    if (result.success && result.data) {
      try {
        const fullState = JSON.parse(result.data.Wrong_Note);
        return {
          ...fullState,
          nickname: result.data.Nickname,
          gold: Number(result.data.Gold) || 0,
        };
      } catch (e) {
        console.error('Failed to parse Wrong_Note', e);
      }
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    return null;
  }
};

export const syncUserData = async (state: UserState, totalAttempted: number = 0) => {
  if (!API_URL) return;
  
  const accuracy = totalAttempted > 0 ? Math.round((state.total_score / totalAttempted) * 100) : 0;
  
  try {
    await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'saveUser',
        nickname: state.nickname,
        level: Math.max(...state.unlocked_stages),
        gold: state.gold,
        solvedCount: state.total_score,
        accuracy: accuracy,
        wrongNote: JSON.stringify(state),
      }),
    });
  } catch (error) {
    console.error('Failed to sync user data:', error);
  }
};
