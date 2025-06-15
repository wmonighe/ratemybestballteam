import { renderHook, act } from '@testing-library/react-hooks';
import { useXP, XP_PER_RATING } from '../hooks/useXP';

describe('useXP', () => {
  it('increments level and xp correctly', () => {
    const { result } = renderHook(() => useXP(95));
    act(() => {
      const [, addXP] = result.current;
      addXP(XP_PER_RATING);
    });
    const [state] = result.current;
    expect(state.level).toBe(1);
    expect(state.xp).toBe(0);
  });
});
