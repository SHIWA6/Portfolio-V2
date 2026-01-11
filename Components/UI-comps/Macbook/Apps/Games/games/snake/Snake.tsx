/**
 * Snake Game
 * 
 * Classic snake game implementation using canvas.
 * - Arrow keys to move
 * - Eat food to grow
 * - Avoid walls and yourself
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameComponentProps } from '../../types';

interface Position {
  x: number;
  y: number;
}

type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;
const SPEED_INCREMENT = 5;
const MIN_SPEED = 50;

const Snake: React.FC<GameComponentProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  const directionRef = useRef<Direction>('RIGHT');
  const nextDirectionRef = useRef<Direction>('RIGHT');
  
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('snake-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });

  const snakeRef = useRef<Position[]>([{ x: 10, y: 10 }]);
  const foodRef = useRef<Position>({ x: 15, y: 10 });
  const speedRef = useRef(INITIAL_SPEED);
  const highScoreRef = useRef(highScore);

  // Keep highScoreRef in sync
  useEffect(() => {
    highScoreRef.current = highScore;
  }, [highScore]);

  // Generate random food position
  const generateFood = useCallback((snake: Position[], cols: number, rows: number): Position => {
    let newFood: Position;
    do {
      newFood = {
        x: Math.floor(Math.random() * cols),
        y: Math.floor(Math.random() * rows),
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    return newFood;
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cols = Math.floor(canvas.width / GRID_SIZE);
    const rows = Math.floor(canvas.height / GRID_SIZE);
    
    snakeRef.current = [{ x: Math.floor(cols / 2), y: Math.floor(rows / 2) }];
    directionRef.current = 'RIGHT';
    nextDirectionRef.current = 'RIGHT';
    speedRef.current = INITIAL_SPEED;
    foodRef.current = generateFood(snakeRef.current, cols, rows);
    setScore(0);
  }, [generateFood]);

  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameState('playing');
  }, [initGame]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    setGameState(prev => prev === 'playing' ? 'paused' : 'playing');
  }, []);

  // Game loop - defined inside useEffect to avoid recursive callback issue
  useEffect(() => {
    if (gameState !== 'playing') return;

    const runGameLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      const cols = Math.floor(canvas.width / GRID_SIZE);
      const rows = Math.floor(canvas.height / GRID_SIZE);

      // Update direction
      directionRef.current = nextDirectionRef.current;

      // Calculate new head position
      const head = { ...snakeRef.current[0] };
      switch (directionRef.current) {
        case 'UP': head.y -= 1; break;
        case 'DOWN': head.y += 1; break;
        case 'LEFT': head.x -= 1; break;
        case 'RIGHT': head.x += 1; break;
      }

      // Check wall collision
      if (head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows) {
        setGameState('gameover');
        return;
      }

      // Check self collision
      if (snakeRef.current.some(segment => segment.x === head.x && segment.y === head.y)) {
        setGameState('gameover');
        return;
      }

      // Add new head
      snakeRef.current.unshift(head);

      // Check food collision
      if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
        setScore(prev => {
          const newScore = prev + 10;
          if (newScore > highScoreRef.current) {
            setHighScore(newScore);
            localStorage.setItem('snake-highscore', newScore.toString());
          }
          return newScore;
        });
        foodRef.current = generateFood(snakeRef.current, cols, rows);
        // Increase speed
        speedRef.current = Math.max(MIN_SPEED, speedRef.current - SPEED_INCREMENT);
      } else {
        // Remove tail
        snakeRef.current.pop();
      }

      // Draw
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw grid (subtle)
      ctx.strokeStyle = '#1f2937';
      ctx.lineWidth = 0.5;
      for (let x = 0; x <= cols; x++) {
        ctx.beginPath();
        ctx.moveTo(x * GRID_SIZE, 0);
        ctx.lineTo(x * GRID_SIZE, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y <= rows; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * GRID_SIZE);
        ctx.lineTo(canvas.width, y * GRID_SIZE);
        ctx.stroke();
      }

      // Draw food
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(
        foodRef.current.x * GRID_SIZE + GRID_SIZE / 2,
        foodRef.current.y * GRID_SIZE + GRID_SIZE / 2,
        GRID_SIZE / 2 - 2,
        0,
        Math.PI * 2
      );
      ctx.fill();

      // Draw snake
      snakeRef.current.forEach((segment, index) => {
        const isHead = index === 0;
        ctx.fillStyle = isHead ? '#22c55e' : '#4ade80';
        ctx.beginPath();
        ctx.roundRect(
          segment.x * GRID_SIZE + 1,
          segment.y * GRID_SIZE + 1,
          GRID_SIZE - 2,
          GRID_SIZE - 2,
          isHead ? 6 : 4
        );
        ctx.fill();
      });

      // Schedule next frame
      gameLoopRef.current = window.setTimeout(() => {
        requestAnimationFrame(runGameLoop);
      }, speedRef.current);
    };

    // Start the loop
    runGameLoop();

    return () => {
      if (gameLoopRef.current) {
        clearTimeout(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameState, generateFood]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent arrow keys from scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (gameState === 'idle' || gameState === 'gameover') {
        if (e.key === ' ' || e.key === 'Enter') {
          startGame();
        }
        return;
      }

      if (e.key === ' ') {
        togglePause();
        return;
      }

      if (gameState !== 'playing') return;

      const current = directionRef.current;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          if (current !== 'DOWN') nextDirectionRef.current = 'UP';
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          if (current !== 'UP') nextDirectionRef.current = 'DOWN';
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          if (current !== 'RIGHT') nextDirectionRef.current = 'LEFT';
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          if (current !== 'LEFT') nextDirectionRef.current = 'RIGHT';
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame, togglePause]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.floor(rect.width / GRID_SIZE) * GRID_SIZE;
      canvas.height = Math.floor(rect.height / GRID_SIZE) * GRID_SIZE;
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Score bar */}
      <div className="shrink-0 h-10 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <span className="text-sm text-gray-300">
          Score: <span className="text-green-400 font-bold">{score}</span>
        </span>
        <span className="text-sm text-gray-300">
          High Score: <span className="text-yellow-400 font-bold">{highScore}</span>
        </span>
      </div>

      {/* Game canvas */}
      <div className="flex-1 relative min-h-0 p-2">
        <canvas 
          ref={canvasRef} 
          className="w-full h-full"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Overlay states */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-6xl mb-4">🐍</span>
            <h2 className="text-2xl font-bold text-white mb-2">Snake</h2>
            <p className="text-gray-400 mb-6">Use arrow keys or WASD to move</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg transition-colors"
            >
              Press Space to Start
            </button>
          </div>
        )}

        {gameState === 'paused' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-4xl mb-4">⏸️</span>
            <h2 className="text-2xl font-bold text-white mb-4">Paused</h2>
            <button
              onClick={togglePause}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              Press Space to Resume
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-6xl mb-4">💀</span>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Game Over</h2>
            <p className="text-gray-300 text-lg mb-1">Score: {score}</p>
            {score >= highScore && score > 0 && (
              <p className="text-yellow-400 text-sm mb-4">🏆 New High Score!</p>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Snake;
