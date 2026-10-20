export type FPosition = "GK" | "DEF" | "MID" | "FWD";

export interface FantasyPlayer {
  id: string;
  name: string;
  teamId: string;
  position: FPosition;
  price: number;       // AED millions e.g. 8.5 = AED 8.5M
  totalPoints: number;
  form: number;        // avg pts last 3 GWs
  selectedBy: number;  // % of managers
  goals: number;
  assists: number;
  cleanSheets: number;
}

export interface FantasyUser {
  email: string;
  name: string;
  teamName: string;
  avatarColor: string;
}

export interface FantasySquad {
  playerIds: string[];   // 15 selected
  captainId: string;
  viceCaptainId: string;
}

export interface FantasyGWEntry {
  gw: number;
  points: number;
  transfers: number;
  hits: number;
  rank: number;
  captainId: string;
  captainPoints: number;
}

export interface FantasyState {
  user: FantasyUser | null;
  squad: FantasySquad | null;
  gwHistory: FantasyGWEntry[];
  isAuthenticated: boolean;
  onboardingComplete: boolean;
  freeTransfers: number;

  login: (phone: string) => void;
  setProfile: (name: string, avatarColor: string) => void;
  setTeamName: (teamName: string) => void;
  setSquad: (squad: FantasySquad) => void;
  makeTransfer: (outId: string, inId: string) => void;
  logout: () => void;
  syncUser: (data: {
    email: string;
    name: string;
    teamName: string;
    avatarColor: string;
    onboardingComplete: boolean;
    freeTransfers: number;
    totalPoints: number;
    squad?: FantasySquad;
  }) => void;
}
