import { Team } from '../types';

export async function fetchNextTeam(): Promise<Team> {
  const res = await fetch('/api/nextTeam');
  if (!res.ok) throw new Error('Failed to load next team');
  return res.json();
}
