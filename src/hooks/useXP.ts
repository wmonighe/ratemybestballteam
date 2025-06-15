import { useState } from 'react';

export interface XPState {
  xp: number;
  level: number;
}

/** XP per rating and points to next level */
export const XP_PER_RATING = 5;
export const LEVEL_XP = 100;

export function useXP(initialXP = 0): [XPState, (points: number) => void] {
  const [state, setState] = useState<XPState>({
    xp: initialXP % LEVEL_XP,
    level: Math.floor(initialXP / LEVEL_XP),
  });

  const addXP = (points: number) => {
    setState(prev => {
      const total = prev.xp + points;
      const levelGain = Math.floor(total / LEVEL_XP);
      return {
        xp: total % LEVEL_XP,
        level: prev.level + levelGain,
      };
    });
  };

  return [state, addXP];
}
