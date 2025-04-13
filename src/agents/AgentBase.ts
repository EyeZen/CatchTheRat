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
    protected lastThreeMoves: number[] = []; // Last position of the agent

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
        var lastPosition = this.lastThreeMoves[this.lastThreeMoves.length - 1] || null; // Get the last position of the agent
        if (currentPosition == lastPosition) return currentPosition; // No move if the position is the same as the last one

        this.lastThreeMoves.push(currentPosition); // Update the last position
        if (this.lastThreeMoves.length > 3) {
            this.lastThreeMoves.shift(); // Keep only the last three moves
        }

        
        // Check if a custom move function is provided
        // If so, use it to calculate the next move
        var nextMoveGenerator = this.calculateMove ?? this.processMove;
        nextMoveGenerator = nextMoveGenerator.bind(this);

        var isMoveRepetitive: boolean = true;
        var nextMove: number | null = null;

        const MAX_MOVE_CALC_TRIES = 2;
        for (let i = 0; i < MAX_MOVE_CALC_TRIES && isMoveRepetitive; i++) {
            nextMove =  nextMoveGenerator(currentPosition, opponentPosition, lastPosition);

            if (nextMove === null) break;
            
            // check if generated next-move will make a sequence of three repetitive moves
            if (this.lastThreeMoves.length < 3) {
                isMoveRepetitive = false;
                break;
            }
            
            var expectedLastThreeMoves = this.lastThreeMoves.slice(-2);
            expectedLastThreeMoves.push(nextMove);
            isMoveRepetitive = expectedLastThreeMoves.every((move, index) => index === 0 || move === expectedLastThreeMoves[index - 1]);
        }

        return nextMove;
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