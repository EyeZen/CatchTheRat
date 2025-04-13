import { IGameBoard } from './IGameBoard';

interface IAiAgent {
    move(currentPosition: number, opponentPosition: number): number | null;
    setGameboard(gameboard: IGameBoard): void;
    getGameboard(): IGameBoard;
}

export default IAiAgent;