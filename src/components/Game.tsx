import React, { useEffect, useRef, useState } from 'react';
import IGameState from '../types/IGameState';
import IGameBoard from '../types/IGameBoard';
import { AgentRat, AgentCat } from '../agents';
import { useSettings } from '../context/SettingsProvider';
import { useMoveHistory } from '../context/MoveHistoryContext';
import Actors from '../types/Actors';

interface GameProps {
  paused: boolean;
  setPaused: (paused: boolean) => void;
}

const Game: React.FC<GameProps> = ({ paused, setPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<IGameState>({
    ratPosition: 0,
    catPosition: 2,
    currentTurn: Actors.RAT,
    gameOver: false,
    gameOverMessage: ''
  });
  const { moveHistory, addMove, clearHistory } = useMoveHistory();

  const { dispatchCatAgent, dispatchRatAgent, movementSpeed } = useSettings();
  const MAX_SPEED_FACTOR = 5;
  const MAX_SPEED = 1000;
  const getSpeed = (movementFactor: number) => MAX_SPEED * ((MAX_SPEED_FACTOR - movementFactor) / MAX_SPEED_FACTOR);
  const MOVES_REPETITION_LIMIT = 3;

  // Define checkpoint positions in a circle
  const radius = 150;
  const centerX = 200;
  const centerY = 250;
  
  const gameboard : IGameBoard = { checkpoints: [], validMoves: {} };

  // Checkpoint Graph
  // Define the positions of the checkpoints in a circle
  gameboard.checkpoints = [
    { // Top
      x: centerX,
      y: centerY - radius,
      id: 0
    },
    { // Top Right
      x: centerX + radius * Math.cos(-Math.PI / 5),
      y: centerY + radius * Math.sin(-Math.PI / 5),
      id: 1
    },
    { // Bottom Right
      x: centerX + radius * Math.cos(Math.PI / 5),
      y: centerY + radius * Math.sin(Math.PI / 5),
      id: 2
    },
    { // Bottom Left
      x: centerX + radius * Math.cos(4 * Math.PI / 5),
      y: centerY + radius * Math.sin(4 * Math.PI / 5),
      id: 3
    },
    { // Top Left
      x: centerX + radius * Math.cos(-4 * Math.PI / 5),
      y: centerY + radius * Math.sin(-4 * Math.PI / 5),
      id: 4
    },
    { // Center
      x: centerX,
      y: centerY,
      id: 5
    }
  ];

  // Define valid moves for each checkpoint
  // Only checkpoints 0, 2, and 4 are connected to the center (5)
  gameboard.validMoves = {
    0: [1, 4, 5],    // Top can move to top-right, top-left, and center
    1: [0, 2],       // Top-right can move to top and bottom-right
    2: [1, 3, 5],    // Bottom-right can move to top-right, bottom-left, and center
    3: [2, 4],       // Bottom-left can move to bottom-right and top-left
    4: [3, 0, 5],    // Top-left can move to bottom-left, top, and center
    5: [0, 2, 4]     // Center can move to top, bottom-right, and top-left
  };

  const ratAgent = new AgentRat(gameboard);
  const catAgent = new AgentCat(gameboard);

  const isValidMove = (from: number, to: number) => {
    return gameboard.validMoves[from].includes(to);
  };

  const canCatCatchRat = (ratPos: number, catPos: number): boolean => {
    // Check if cat can catch rat in one move
    return ratPos === catPos || gameboard.validMoves[catPos].includes(ratPos);
  };

  const isRatCaptured = (ratPos: number, catPos: number): boolean => {
    // Check if rat can escape from cat's position
    return gameboard.validMoves[ratPos].every(possibleRatMove => canCatCatchRat(possibleRatMove, catPos));
  };

  const checkRepetitiveMoves = () => {
    var repetitionMovesLength = 4 * MOVES_REPETITION_LIMIT;
    var recentMoves = moveHistory.slice(-repetitionMovesLength);
    console.dir(recentMoves);
    if (recentMoves.length < repetitionMovesLength) return false;

    var movePair1 = recentMoves.slice(0, 4).map(move => `${move.from}-${move.to}`).join('|');
    var movePair2 = recentMoves.slice(4, 8).map(move => `${move.from}-${move.to}`).join('|');
    var movePair3 = recentMoves.slice(8, 12).map(move => `${move.from}-${move.to}`).join('|');

    if (movePair1 == movePair2 && movePair2 == movePair3) {
      return true;
    }
    return false;
  };

  // Draw the game board
  const drawBoard = (ctx: CanvasRenderingContext2D) => {
    ctx.clearRect(0, 0, 400, 500);
    
    // Draw the circle
    ctx.beginPath();
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Draw lines to center (only from checkpoints 0, 2, and 4)
    ctx.beginPath();
    ctx.moveTo(gameboard.checkpoints[0].x, gameboard.checkpoints[0].y);
    ctx.lineTo(gameboard.checkpoints[5].x, gameboard.checkpoints[5].y);
    ctx.moveTo(gameboard.checkpoints[2].x, gameboard.checkpoints[2].y);
    ctx.lineTo(gameboard.checkpoints[5].x, gameboard.checkpoints[5].y);
    ctx.moveTo(gameboard.checkpoints[4].x, gameboard.checkpoints[4].y);
    ctx.lineTo(gameboard.checkpoints[5].x, gameboard.checkpoints[5].y);
    ctx.stroke();

    // Draw checkpoints
    gameboard.checkpoints.forEach((point, index) => {
      
      var isCheckpointActive: boolean = (gameState.currentTurn === Actors.CAT && gameState.catPosition === point.id) || (gameState.currentTurn === Actors.RAT && gameState.ratPosition === point.id);
      if (isCheckpointActive) {
        ctx.fillStyle = '#19bd60';
      } else {
        ctx.fillStyle = '#e5e7eb';
      }

      var isAgentDispatched: boolean = (dispatchCatAgent && gameState.catPosition === point.id) || (dispatchRatAgent && gameState.ratPosition === point.id);
      if (isAgentDispatched) {
        ctx.strokeStyle = '#ff6600';
        ctx.lineWidth = 4;
      } else {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
      }

      ctx.beginPath();
      ctx.arc(point.x, point.y, 20, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Add checkpoint number
      ctx.fillStyle = '#374151';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(index.toString(), point.x, point.y);
    });
  };

  const handleCheckpointClick = (checkpointId: number) => {
    if (gameState.gameOver || paused) return;

    const currentPosition = gameState.currentTurn === Actors.RAT
      ? gameState.ratPosition 
      : gameState.catPosition;
    
    const move = {
      actor: gameState.currentTurn,
      from: currentPosition,
      to: checkpointId,
    };

    if (!isValidMove(currentPosition, checkpointId)) return;
    if (gameState.currentTurn === Actors.RAT && canCatCatchRat(checkpointId, gameState.catPosition)) return;
    if (gameState.currentTurn === Actors.CAT && isRatCaptured(gameState.ratPosition, checkpointId)) {
      setGameState((prev) => ({
        ...prev,
        catPosition: checkpointId,
        currentTurn: Actors.NONE,
        gameOver: true,
        gameOverMessage: 'Cat caught the Rat! Game Over.'
      }));
      addMove(move); // Add move to global history
      return;
    }
    addMove(move);     // Add move to global history

    // Check if the game should end due to repetitive moves
    if (checkRepetitiveMoves()) {
      setGameState((prev) => ({
        ...prev,
        gameOver: true,
        gameOverMessage: 'Game ended due to repetitive moves!'
      }));
      return;
    }

    setGameState((prev) => ({
      ...prev,
      catPosition: prev.currentTurn === Actors.CAT ? checkpointId : prev.catPosition,
      ratPosition: prev.currentTurn === Actors.RAT ? checkpointId : prev.ratPosition,
      currentTurn: prev.currentTurn === Actors.RAT ? Actors.CAT : Actors.RAT,
    }));
  };

  const resetGame = () => {
    clearHistory();
    setGameState({
      ratPosition: 0,
      catPosition: 2,
      currentTurn: Actors.RAT,
      gameOver: false,
      gameOverMessage: ''
    });
  };

  // Draw the game board and characters on canvas
  // This effect runs every time the game state changes
  // and updates the canvas accordingly
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    drawBoard(ctx);

    if (paused || gameState.gameOver) {
      // Draw the paused overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = paused ? '#ffffff' : '#ff0000'; // White text
      ctx.font = '36px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(paused ? 'Paused' : 'Game Over', canvas.width / 2, canvas.height / 2);
      return; // Skip further drawing when paused
    }

    // Draw rat and cat
    const ratPoint = gameboard.checkpoints[gameState.ratPosition];
    const catPoint = gameboard.checkpoints[gameState.catPosition];

    ctx.fillStyle = '#4f46e5';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐀', ratPoint.x, ratPoint.y);
    
    ctx.fillStyle = '#ef4444';
    ctx.fillText('🐱', catPoint.x, catPoint.y);

    if (dispatchRatAgent && gameState.currentTurn === Actors.RAT) {
      setTimeout(() => {
        if (!paused) {
          const nextMove = ratAgent.move(gameState.ratPosition, gameState.catPosition);
          if (nextMove !== null) handleCheckpointClick(nextMove);
        }
      }, getSpeed(movementSpeed));
    } else if (dispatchCatAgent && gameState.currentTurn === Actors.CAT) {
      setTimeout(() => {
        if (!paused) {
          const nextMove = catAgent.move(gameState.catPosition, gameState.ratPosition);
          if (nextMove !== null) handleCheckpointClick(nextMove);
        }
      }, getSpeed(movementSpeed));
    }
  }, [gameState, dispatchCatAgent, dispatchRatAgent, paused]); // Add paused to dependencies

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          onClick={(e) => {
            if (paused) return;

            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            gameboard.checkpoints.forEach(point => {
              const distance = Math.sqrt(
                Math.pow(x - point.x, 2) + Math.pow(y - point.y, 2)
              );
              if (distance < 20) {
                handleCheckpointClick(point.id);
              }
            });
          }}
          className="cursor-pointer"
        />
      </div>

      <div className="text-center">
        <p className={"text-lg font-semibold mb-2"}>
          {gameState.gameOver 
            ? gameState.gameOverMessage
            : `Current turn: ${gameState.currentTurn === Actors.RAT ? 'Rat' : 'Cat'}`}
        </p>
        <button
          onClick={resetGame}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Reset Game
        </button>
        <button
          onClick={() => setPaused(!paused)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors ml-2"
        >
          {paused ? 'Continue' : 'Pause'}
        </button>
      </div>
    </div>
  );
};

export default Game;