export interface RateRequest {
  teamId: string;
  rating: 'up' | 'down';
}
export interface Stats {
  teamsRated: number;
  xp: number;
  level: number;
  streak: number;
  percentile: number;
}

export async function rateTeam(req: RateRequest): Promise<Stats> {
  const res = await fetch('/api/rate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req),
  });
  if (!res.ok) throw new Error('Failed to rate team');
  return res.json();
}
