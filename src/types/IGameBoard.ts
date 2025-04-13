import { ICheckpoint } from "./ICheckpoint";

interface IGameBoard {
    checkpoints: ICheckpoint[]; // Array of checkpoints with their coordinates
    validMoves: Record<number, number[]>; // Valid moves for each checkpoint
}

export default IGameBoard;