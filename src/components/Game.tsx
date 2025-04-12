import React, { useEffect, useRef, useState } from 'react';

interface Point {
  x: number;
  y: number;
  id: number;
}

interface GameState {
  ratPosition: number;
  catPosition: number;
  currentTurn: 'rat' | 'cat';
  gameOver: boolean;
  gameOverMessage: string;
}

const Game: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>({
    ratPosition: 0,
    catPosition: 2,
    currentTurn: 'rat',
    gameOver: false,
    gameOverMessage: ''
  });

  // Define checkpoint positions in a circle
  const radius = 150;
  const centerX = 200;
  const centerY = 250;
  
  // Checkpoint Graph
  // Define the positions of the checkpoints in a circle
  const checkpoints: Point[] = [
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
  const validMoves: Record<number, number[]> = {
    0: [1, 4, 5],    // Top can move to top-right, top-left, and center
    1: [0, 2],       // Top-right can move to top and bottom-right
    2: [1, 3, 5],    // Bottom-right can move to top-right, bottom-left, and center
    3: [2, 4],       // Bottom-left can move to bottom-right and top-left
    4: [3, 0, 5],    // Top-left can move to bottom-left, top, and center
    5: [0, 2, 4]     // Center can move to top, bottom-right, and top-left
  };

  const isValidMove = (from: number, to: number) => {
    return validMoves[from].includes(to);
  };

  const canCatCatchRat = (ratPos: number, catPos: number): boolean => {
    // Check if cat can catch rat in one move
    return validMoves[catPos].includes(ratPos);
  };

  const isRatCaptured = (ratPos: number, catPos: number): boolean => {
    // Check if rat can escape from cat's position
    return validMoves[ratPos].every(possibleRatMove =>
      // validMoves[catPos].includes(possibleRatMove)
      canCatCatchRat(possibleRatMove, catPos)
    );
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
    ctx.moveTo(checkpoints[0].x, checkpoints[0].y);
    ctx.lineTo(checkpoints[5].x, checkpoints[5].y);
    ctx.moveTo(checkpoints[2].x, checkpoints[2].y);
    ctx.lineTo(checkpoints[5].x, checkpoints[5].y);
    ctx.moveTo(checkpoints[4].x, checkpoints[4].y);
    ctx.lineTo(checkpoints[5].x, checkpoints[5].y);
    ctx.stroke();

    // Draw checkpoints
    checkpoints.forEach((point, index) => {
      
      if (
        (gameState.currentTurn === "cat" && gameState.catPosition === point.id) ||
        (gameState.currentTurn === "rat" && gameState.ratPosition === point.id)
      ) {
        ctx.fillStyle = '#19bd60';
      } else {
        ctx.fillStyle = '#e5e7eb';
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
    if (gameState.gameOver) return;

    const currentPosition = gameState.currentTurn === 'rat' 
      ? gameState.ratPosition 
      : gameState.catPosition;

    if (!isValidMove(currentPosition, checkpointId)) return;
    var newPosition = checkpointId;

    if (gameState.currentTurn === 'rat' && canCatCatchRat(newPosition, gameState.catPosition)) {
        return;
    } else if (isRatCaptured(gameState.ratPosition, newPosition)) {
      setGameState(prev => ({
        ...prev,
        catPosition: newPosition,
        gameOver: true,
        gameOverMessage: "Game Over - Cat wins! Cat can catch the rat in the next move!"
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      catPosition: prev.currentTurn === 'cat' ? newPosition : prev.catPosition,
      ratPosition: prev.currentTurn === 'rat' ? newPosition : prev.ratPosition,
      currentTurn: prev.currentTurn === 'rat' ? 'cat' : 'rat'
    }));
  };

  const resetGame = () => {
    setGameState({
      ratPosition: 0,
      catPosition: 2,
      currentTurn: 'rat',
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

    // Draw rat and cat
    const ratPoint = checkpoints[gameState.ratPosition];
    const catPoint = checkpoints[gameState.catPosition];

    // Add icons for rat and cat using Lucide React components as reference
    ctx.fillStyle = '#4f46e5';
    ctx.font = '24px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🐀', ratPoint.x, ratPoint.y);
    
    ctx.fillStyle = '#ef4444';
    ctx.fillText('🐱', catPoint.x, catPoint.y);
  }, [gameState]);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <canvas
          ref={canvasRef}
          width={400}
          height={500}
          onClick={(e) => {
            const rect = canvasRef.current?.getBoundingClientRect();
            if (!rect) return;

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Check if click is near any checkpoint
            checkpoints.forEach(point => {
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
            : `Current turn: ${gameState.currentTurn === 'rat' ? 'Rat' : 'Cat'}`}
        </p>
        <button
          onClick={resetGame}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
        >
          Reset Game
        </button>
      </div>
    </div>
  );
};

export default Game;