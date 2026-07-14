export interface Player {
  id: number;
  name: string;
  color: string; // Red, Blue, Yellow, Purple, Green, Pink, Grey
  stars: number;
  points: number;
  wins: number;
  draws: number;
  losses: number;
}

export type Matchup = [number, number] | number; // [home, away] (PvP) or single player ID (Sim)
export type GameweekSchedule = 'ALL_SIM' | Matchup[];

export interface RecordedMatchResult {
  type: 'PVP' | 'SIM';
  homeId?: number;
  awayId?: number;
  playerId?: number; // for Sim
  result: 'HOME' | 'AWAY' | 'DRAW' | 'WIN' | 'LOSS'; // HOME/AWAY/DRAW for PvP, WIN/DRAW/LOSS for Sim
}

export interface GameweekState {
  results: Record<string, RecordedMatchResult>; // Key: "home-away" or "sim-playerId"
}

export interface SeasonState {
  currentRound: number;
  schedule: GameweekSchedule[];
  gameweekResults: Record<number, Record<string, RecordedMatchResult>>; // gameweekIndex -> key -> result
}

export type AppPhase = 'SETUP' | 'DASHBOARD' | 'OFFSEASON' | 'VICTORY' | 'SUPERDUPER';

export interface AppState {
  players: Player[];
  seasonCount: number;
  targetScore: number;
  currentPhase: AppPhase;
  seasonState: SeasonState;
  winnerName: string;
  winReason: string;
  gameMode?: 'STANDARD' | 'LONG';
}
