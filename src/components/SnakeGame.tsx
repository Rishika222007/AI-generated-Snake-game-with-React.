import { useEffect, useRef, useState, useCallback } from 'react';
import { Settings, Theme } from '../types';

interface Point {
  x: number;
  y: number;
}

interface SnakeGameProps {
  settings: Settings;
  onScoreChange: (score: number) => void;
  isPaused: boolean;
}

export default function SnakeGame({ settings, onScoreChange, isPaused }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<{
    snake: Point[];
    food: Point;
    direction: Point;
    isGameOver: boolean;
  }>({
    snake: [{ x: 10, y: 10 }],
    food: { x: 5, y: 5 },
    direction: { x: 1, y: 0 },
    isGameOver: false,
  });

  const gridSize = 20;
  const lastUpdate = useRef(0);
  const nextDirection = useRef({ x: 1, y: 0 });

  const getThemeColor = (theme: Theme) => {
    switch (theme) {
      case 'blue': return '#00FFFF'; // cyan
      case 'pink': return '#FF00FF'; // magenta
      case 'purple': return '#FF00FF';
      case 'green': return '#FFFF00'; // yellow
      default: return '#00FFFF';
    }
  };

  const spawnFood = useCallback((snake: Point[]) => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * 20),
        y: Math.floor(Math.random() * 20),
      };
      if (!snake.some(p => p.x === newFood.x && p.y === newFood.y)) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setGameState({
      snake: [{ x: 10, y: 10 }],
      food: spawnFood([{ x: 10, y: 10 }]),
      direction: { x: 1, y: 0 },
      isGameOver: false,
    });
    nextDirection.current = { x: 1, y: 0 };
    onScoreChange(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (gameState.direction.y === 0) nextDirection.current = { x: 0, y: -1 };
          break;
        case 'ArrowDown':
          if (gameState.direction.y === 0) nextDirection.current = { x: 0, y: 1 };
          break;
        case 'ArrowLeft':
          if (gameState.direction.x === 0) nextDirection.current = { x: -1, y: 0 };
          break;
        case 'ArrowRight':
          if (gameState.direction.x === 0) nextDirection.current = { x: 1, y: 0 };
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.direction]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let rafId: number;

    const loop = (timestamp: number) => {
      if (!lastUpdate.current) lastUpdate.current = timestamp;
      const deltaTime = timestamp - lastUpdate.current;

      const speedThreshold = 200 - (settings.snakeSpeed * 1.5);

      if (deltaTime > speedThreshold && !isPaused && !gameState.isGameOver) {
        lastUpdate.current = timestamp;

        setGameState(prev => {
          const newDirection = nextDirection.current;
          const head = prev.snake[0];
          const newHead = {
            x: (head.x + newDirection.x + 20) % 20,
            y: (head.y + newDirection.y + 20) % 20,
          };

          if (prev.snake.some(p => p.x === newHead.x && p.y === newHead.y)) {
            return { ...prev, isGameOver: true };
          }

          const newSnake = [newHead, ...prev.snake];
          let newFood = prev.food;

          if (newHead.x === prev.food.x && newHead.y === prev.food.y) {
            newFood = spawnFood(newSnake);
            onScoreChange(newSnake.length - 1);
          } else {
            newSnake.pop();
          }

          return {
            ...prev,
            snake: newSnake,
            food: newFood,
            direction: newDirection,
          };
        });
      }

      // Render Background
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Matrix Grid (Glitch Style)
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= 20; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, 400);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(400, i * gridSize);
        ctx.stroke();
      }

      const themeColor = getThemeColor(settings.theme);

      // Draw Food (Circle)
      ctx.fillStyle = '#FF00FF'; // Food is always magenta for contrast
      ctx.shadowBlur = 0;
      ctx.beginPath();
      const foodRadius = gridSize / 4.5; // Smaller than snake (which is gridSize / 3)
      ctx.arc(
        gameState.food.x * gridSize + gridSize / 2,
        gameState.food.y * gridSize + gridSize / 2,
        foodRadius,
        0,
        Math.PI * 2
      );
      ctx.fill();
      
      // Food outline glitch (Circle)
      ctx.strokeStyle = '#00FFFF';
      ctx.beginPath();
      ctx.arc(
        gameState.food.x * gridSize + gridSize / 2,
        gameState.food.y * gridSize + gridSize / 2,
        foodRadius + 2,
        0,
        Math.PI * 2
      );
      ctx.stroke();

      // Draw Snake (Circles)
      gameState.snake.forEach((segment, i) => {
        ctx.fillStyle = i === 0 ? '#00FFFF' : themeColor;
        ctx.beginPath();
        const radius = gridSize / 3; // Smaller circular segments
        ctx.arc(
          segment.x * gridSize + gridSize / 2,
          segment.y * gridSize + gridSize / 2,
          radius,
          0,
          Math.PI * 2
        );
        ctx.fill();
        
        // Glitch artifact on head
        if (i === 0 && Math.random() > 0.8) {
           ctx.fillStyle = '#FF00FF';
           ctx.beginPath();
           ctx.arc(
             segment.x * gridSize + gridSize / 2 + (Math.random() - 0.5) * 6,
             segment.y * gridSize + gridSize / 2 + (Math.random() - 0.5) * 6,
             radius / 1.5,
             0,
             Math.PI * 2
           );
           ctx.fill();
        }
      });

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [gameState, isPaused, settings, onScoreChange, spawnFood]);

  return (
    <div className="relative group w-full max-w-[400px]">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-auto bg-dark border-4 border-cyan image-rendering-pixelated"
      />
      
      {gameState.isGameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-dark/90 border-4 border-magenta m-[4px]">
          <h2 className="text-5xl font-glitch mb-4 text-magenta tracking-widest text-center">
            SYS_FAIL
          </h2>
          <button
            onClick={resetGame}
            className="hard-button px-8 py-3 font-bold text-xl"
          >
            REBOOT
          </button>
        </div>
      )}

      {isPaused && !gameState.isGameOver && (
        <div className="absolute inset-0 flex items-center justify-center bg-dark/80 border-4 border-cyan m-[4px]">
          <div className="text-cyan font-bold text-3xl font-mono tracking-[0.3em] uppercase bg-dark px-4 py-2 border-y-2 border-magenta">
             [PAUSED]
          </div>
        </div>
      )}
    </div>
  );
}
