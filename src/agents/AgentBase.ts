import IGameBoard from "../types/IGameBoard";
import IAiAgent from "../types/IAiAgent";

/**
 * The AgentBase class implements the IAiAgent interface and serves as a base class for AI agents in the game.
 * It provides methods to set and get the gameboard, as well as a method to calculate the next move.
 */
class AgentBase implements IAiAgent {

    //#region Properties

    protected gameboard: IGameBoard;
    protected calculateMove: Function | null = null; // Function to calculate the next move
    protected lastPosition: number | null = null; // Last position of the agent

    //#endregion

    //#region Constructor
    
    /**
     * Constructor for the AgentRat class.
     * @param gameboard - The gameboard object containing checkpoints and valid moves.
     */
    constructor(gameboard: IGameBoard, calculateMove: Function | null = null) {
        this.gameboard = gameboard;
        this.calculateMove = calculateMove;
    }

    //#endregion

    //#region  IRatAgent methods
    /**
     * Sets the gameboard for the agent.
     * @param gameboard - The gameboard object containing checkpoints and valid moves.
     */
    setGameboard(gameboard: IGameBoard): void {
        this.gameboard = gameboard;
    }

    /**
     * Gets the current gameboard of the agent.
     * @returns The current gameboard object.
     */
    getGameboard(): IGameBoard {
        return this.gameboard;
    }

    /**
     * Sets the function to calculate the next move for the agent.
     * @param moveFunction - The function to calculate the next move.
     */
    setMoveFunction(moveFunction: Function): void {
        this.calculateMove = moveFunction;
    }

    /**
     * Gets the function to calculate the next move for the agent.
     * @returns The function to calculate the next move or null if not set.
     */
    getMoveFunction(): Function | null {
        return this.calculateMove;
    }

    /**
     * Moves the rat agent to a new position based on the current position and cat position.
     * @param currentPosition - The current position of the rat.
     * @param catPosition - The current position of the cat.
     * @returns The new position of the rat or null if no valid moves are available.
     */
    move(currentPosition: number, opponentPosition: number): number | null {

        if (currentPosition == this.lastPosition) return currentPosition; // No move if the position is the same as the last one

        var lastPosition = this.lastPosition;
        this.lastPosition = currentPosition; // Update the last position

        // Check if a custom move function is provided
        // If so, use it to calculate the next move
        if (this.calculateMove) {
            return this.calculateMove(currentPosition, opponentPosition, lastPosition);
        }

        // Default behavior
        return this.processMove(currentPosition, opponentPosition, lastPosition);
    }

    /**
     * Processes the move for the agent based on the current position, opponent position, and last position.
     * @param currentPosition - The current position of the agent.
     * @param opponentPosition - The current position of the opponent.
     * @param lastPosition - The last position of the agent.
     * @returns The new position of the agent or null if no valid moves are available.
     */
    processMove(currentPosition: number, opponentPosition: number, lastPosition: number | null): number | null {
        // Default behavior: 
        var allPossibleMoves = this.gameboard.validMoves[currentPosition];
        var nextMoveIndex = Math.floor(Math.random() * allPossibleMoves.length);
        var nextMove = allPossibleMoves[nextMoveIndex];
        
        return nextMove;
    }

    //#endregion
}

export default AgentBase;