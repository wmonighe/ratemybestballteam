import { useState } from 'react';

export interface StreakState {
  streak: number;
  lastDate: string | null;
}

export function useStreak(initial: StreakState = { streak: 0, lastDate: null }): [StreakState, () => void] {
  const [state, setState] = useState<StreakState>(initial);

  const increment = () => {
    const today = new Date().toDateString();
    setState(prev => {
      if (prev.lastDate === today) return prev;
      const nextStreak = prev.lastDate ? prev.streak + 1 : 1;
      return { streak: nextStreak, lastDate: today };
    });
  };

  return [state, increment];
}
