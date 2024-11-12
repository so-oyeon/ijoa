export interface WordPositionInfo {
  word: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GazeInfo {
  eyemovementState: number;
  fixationX: number;
  fixationY: number;
  leftOpenness: number;
  rightOpenness: number;
  timestamp: number;
  trackingState: number;
  x: number;
  y: number;
}