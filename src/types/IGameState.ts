import { Actor } from "./Actors";

interface IGameState {
  ratPosition: number;
  catPosition: number;
  currentTurn: Actor;
  gameOver: boolean;
  gameOverMessage: string;
}

export default IGameState;