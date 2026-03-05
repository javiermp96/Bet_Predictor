export interface League {
  id: number;
  name: string;
  country: string;
  logo: string;
  season?: number;
}

export interface Team {
  id: number;
  name: string;
  shortCode: string;
  logo: string;
}

export interface Player {
  id: number;
  teamId: number;
  name: string;
  position: 'Goalkeeper' | 'Defender' | 'Midfielder' | 'Attacker';
  photo: string;
}

export interface Match {
  id: string; // or number
  leagueId?: number;
  league?: string | League;
  date: string;
  time?: string;
  status: 'NS' | 'LIVE' | 'HT' | 'FT' | 'CANC' | 'FINISH';
  homeTeam: string | Team;
  awayTeam: string | Team;
  score?: {
    home: number | null;
    away: number | null;
  };
  odds?: {
    home: number;
    draw: number;
    away: number;
  };
}

export interface PredictionMarket {
  type: 'MATCH_EVENT' | 'PLAYER_PROP';
  market: '1X2' | 'DOUBLE_CHANCE' | 'OVER_UNDER' | 'BTTS' | 'ASIAN_HANDICAP' | 'CORRECT_SCORE' | 'CORNERS' | 'CARDS' | 'PLAYER_SHOTS' | 'PLAYER_CARDS' | 'COMBO';
  selection: string;
  probability: number;
  impliedOdds: number;
  marketOdds?: number;
  edge?: number;
}

export interface MatchPredictions {
  matchId: string;
  topTeamPredictions: PredictionMarket[];
  topPlayerPredictions: PredictionMarket[];
  confidenceScore: number;
}

export interface MatchEvents {
  btts: number;
  over2_5: number;
  cornersOver9_5: number;
  cardsOver4_5: number;
}

export interface PlayerProp {
  name: string;
  event: string;
  probability: number;
}

export interface Prediction {
  matchId: string;
  prediction: string;
  confidence: number;
  reasoning: string;
  suggestedBet: string;
  probability: {
    home: number;
    draw: number;
    away: number;
  };
  events?: MatchEvents;
  keyPlayers?: PlayerProp[];
  advanced?: MatchPredictions;
}

export interface MatchAnalysis extends Match {
  prediction?: Prediction;
}
