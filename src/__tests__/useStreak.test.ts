import { renderHook, act } from '@testing-library/react-hooks';
import { useStreak } from '../hooks/useStreak';

describe('useStreak', () => {
  it('increments streak once per day', () => {
    const { result } = renderHook(() => useStreak());
    act(() => {
      const [, inc] = result.current;
      inc();
    });
    const [state] = result.current;
    expect(state.streak).toBe(1);
    act(() => {
      const [, inc] = result.current;
      inc();
    });
    const [afterSecond] = result.current;
    expect(afterSecond.streak).toBe(1);
  });
});
