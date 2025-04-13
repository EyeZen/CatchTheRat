import IAiAgent from "../types/IAiAgent";
import AgentBase from "./AgentBase";

/**
 * The AgentRat class extends the AgentBase class and implements the IAiAgent interface.
 * It represents the rat agent in the game and provides methods to move the rat based on the current position of the cat.
 */
class AgentRat extends AgentBase implements IAiAgent {

    /**
     * Moves the rat agent to a new position based on the current position and cat position.
     * @param currentPosition - The current position of the rat.
     * @param catPosition - The current position of the cat.
     * @returns The new position of the rat or null if no valid moves are available.
     */
    override processMove(currentPosition: number, opponentPosition: number, lastPosition: number | null): number | null {
        // Get all possible moves from the current position
        var allPossibleMoves = this.gameboard.validMoves[currentPosition];
        var possibleMoves = allPossibleMoves.filter((move) => move !== opponentPosition && !this.gameboard.validMoves[opponentPosition].includes(move));
        if (possibleMoves.length <= 0) {
            if (allPossibleMoves.length > 0) {
                // No valid moves, try to find a random move
                var nextMoveIndex = Math.floor(Math.random() * allPossibleMoves.length);
                var nextMove = allPossibleMoves[nextMoveIndex];
                return nextMove; // No valid moves, but return a random move
            }
            // No valid moves at all
            return currentPosition;
        }
        var nextMoveIndex = Math.random() * possibleMoves.length;
        var nextMove = possibleMoves[Math.floor(nextMoveIndex)];

        return nextMove;
    }
}

export default AgentRat;