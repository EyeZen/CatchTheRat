interface IGameState {
  ratPosition: number;
  catPosition: number;
  currentTurn: 'rat' | 'cat';
  gameOver: boolean;
  gameOverMessage: string;
}

export default IGameState;