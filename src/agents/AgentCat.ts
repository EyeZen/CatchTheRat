import IAiAgent from "../types/IAiAgent";
import AgentBase from "./AgentBase";

/**
 * The AgentCat class extends the AgentBase class and implements the IAiAgent interface.
 * It represents the cat agent in the game and provides methods to move the cat based on the current position of the rat.
 */
class AgentCat extends AgentBase implements IAiAgent {
    
    /**
     * Moves the rat agent to a new position based on the current position and cat position.
     * @param currentPosition - The current position of the rat.
     * @param catPosition - The current position of the cat.
     * @returns The new position of the rat or null if no valid moves are available.
     */
    override processMove(currentPosition: number, opponetPosition: number, lastPosition: number | null): number | null {
        
        var allPossibleMoves = this.gameboard.validMoves[currentPosition];
        var possibleMoves = allPossibleMoves.filter((move) => move === opponetPosition || this.gameboard.validMoves[opponetPosition].includes(move));

        if (possibleMoves.length <= 0) {
            // No valid moves, try to find a random move
            if (allPossibleMoves.length > 0) {
                var nextMoveIndex = Math.floor(Math.random() * allPossibleMoves.length);
                var nextMove = allPossibleMoves[nextMoveIndex];
                return nextMove; // No valid moves, but return a random move
            }
            // No valid moves at all
            return currentPosition;
        }
        // Choose a random valid move
        var nextMoveIndex = Math.random() * possibleMoves.length;
        var nextMove = possibleMoves[Math.floor(nextMoveIndex)];

        return nextMove;
    }

}

export default AgentCat;