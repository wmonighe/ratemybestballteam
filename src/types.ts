export interface Team {
  id: string;
  name: string;
  players: {
    QB: string[];
    RB: string[];
    WR: string[];
    TE: string[];
  };
  yesVotes?: number;
  noVotes?: number;
}
