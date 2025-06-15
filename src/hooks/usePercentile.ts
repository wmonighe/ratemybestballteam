import { useState } from 'react';

export function usePercentile(initial = 0): [number, (p: number) => void] {
  const [percentile, setPercentile] = useState(initial);
  const update = (p: number) => setPercentile(p);
  return [percentile, update];
}
