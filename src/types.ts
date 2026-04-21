export type Theme = 'blue' | 'pink' | 'purple' | 'green';

export interface Settings {
  snakeSpeed: number;
  theme: Theme;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

export interface GameState {
  score: number;
  highScore: number;
  isGameOver: boolean;
  isPaused: boolean;
}
