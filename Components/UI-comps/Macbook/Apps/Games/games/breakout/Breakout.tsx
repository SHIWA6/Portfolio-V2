/**
 * Breakout Game
 * 
 * Classic brick-breaking arcade game.
 * Move paddle to bounce ball and break all bricks.
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameComponentProps } from '../../types';

const PADDLE_WIDTH = 80;
const PADDLE_HEIGHT = 12;
const BALL_RADIUS = 8;
const BRICK_ROWS = 5;
const BRICK_COLS = 8;
const BRICK_HEIGHT = 20;
const BRICK_GAP = 4;

interface Brick {
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  active: boolean;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

const Breakout: React.FC<GameComponentProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);

  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'won' | 'lost'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);

  // Game state refs
  const paddleXRef = useRef(0);
  const ballRef = useRef({ x: 0, y: 0, dx: 4, dy: -4 });
  const bricksRef = useRef<Brick[]>([]);
  const mouseXRef = useRef(0);
  const levelRef = useRef(level);

  // Keep level ref in sync
  useEffect(() => {
    levelRef.current = level;
  }, [level]);

  // Create bricks
  const createBricks = useCallback((canvas: HTMLCanvasElement): Brick[] => {
    const bricks: Brick[] = [];
    const brickWidth = (canvas.width - BRICK_GAP * (BRICK_COLS + 1)) / BRICK_COLS;

    for (let row = 0; row < BRICK_ROWS; row++) {
      for (let col = 0; col < BRICK_COLS; col++) {
        bricks.push({
          x: BRICK_GAP + col * (brickWidth + BRICK_GAP),
          y: 50 + row * (BRICK_HEIGHT + BRICK_GAP),
          width: brickWidth,
          height: BRICK_HEIGHT,
          color: COLORS[row % COLORS.length],
          active: true,
        });
      }
    }
    return bricks;
  }, []);

  // Initialize game
  const initGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    paddleXRef.current = (canvas.width - PADDLE_WIDTH) / 2;
    ballRef.current = {
      x: canvas.width / 2,
      y: canvas.height - 60,
      dx: 4 * (Math.random() > 0.5 ? 1 : -1),
      dy: -4,
    };
    bricksRef.current = createBricks(canvas);
    setScore(0);
    setLives(3);
    setLevel(1);
  }, [createBricks]);

  // Reset ball position
  const resetBall = useCallback((canvas: HTMLCanvasElement) => {
    ballRef.current = {
      x: canvas.width / 2,
      y: canvas.height - 60,
      dx: 4 * (Math.random() > 0.5 ? 1 : -1),
      dy: -4,
    };
  }, []);

  // Store the resetBall function in a ref for use in the game loop
  const resetBallRef = useRef(resetBall);
  useEffect(() => {
    resetBallRef.current = resetBall;
  }, [resetBall]);

  // Start game
  const startGame = useCallback(() => {
    initGame();
    setGameState('playing');
  }, [initGame]);

  // Handle mouse move
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseXRef.current = e.clientX - rect.left;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'idle' || gameState === 'won' || gameState === 'lost') {
          startGame();
        } else if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame]);

  // Game loop control
  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    // Game loop function defined inside effect to avoid hook rules issues
    const runGameLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) {
        gameLoopRef.current = requestAnimationFrame(runGameLoop);
        return;
      }

      // Update paddle position (follow mouse)
      paddleXRef.current = Math.max(
        0,
        Math.min(canvas.width - PADDLE_WIDTH, mouseXRef.current - PADDLE_WIDTH / 2)
      );

      // Update ball
      const ball = ballRef.current;
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with walls
      if (ball.x - BALL_RADIUS <= 0 || ball.x + BALL_RADIUS >= canvas.width) {
        ball.dx *= -1;
        ball.x = Math.max(BALL_RADIUS, Math.min(canvas.width - BALL_RADIUS, ball.x));
      }
      if (ball.y - BALL_RADIUS <= 0) {
        ball.dy *= -1;
        ball.y = BALL_RADIUS;
      }

      // Ball collision with paddle
      if (
        ball.y + BALL_RADIUS >= canvas.height - 30 - PADDLE_HEIGHT &&
        ball.y + BALL_RADIUS <= canvas.height - 30 &&
        ball.x >= paddleXRef.current &&
        ball.x <= paddleXRef.current + PADDLE_WIDTH
      ) {
        const hitPos = (ball.x - paddleXRef.current) / PADDLE_WIDTH;
        ball.dx = 8 * (hitPos - 0.5);
        ball.dy = -Math.abs(ball.dy) * 1.02;
        ball.y = canvas.height - 30 - PADDLE_HEIGHT - BALL_RADIUS;
      }

      // Ball fell off bottom
      if (ball.y + BALL_RADIUS > canvas.height) {
        setLives(prev => {
          const newLives = prev - 1;
          if (newLives <= 0) {
            setGameState('lost');
          } else {
            resetBallRef.current(canvas);
          }
          return newLives;
        });
      }

      // Ball collision with bricks
      bricksRef.current.forEach(brick => {
        if (!brick.active) return;

        if (
          ball.x + BALL_RADIUS > brick.x &&
          ball.x - BALL_RADIUS < brick.x + brick.width &&
          ball.y + BALL_RADIUS > brick.y &&
          ball.y - BALL_RADIUS < brick.y + brick.height
        ) {
          brick.active = false;
          ball.dy *= -1;
          setScore(prev => prev + 10 * levelRef.current);
        }
      });

      // Check win
      if (bricksRef.current.every(b => !b.active)) {
        setGameState('won');
      }

      // Draw
      // Background
      ctx.fillStyle = '#111827';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Bricks
      bricksRef.current.forEach(brick => {
        if (!brick.active) return;
        ctx.fillStyle = brick.color;
        ctx.beginPath();
        ctx.roundRect(brick.x, brick.y, brick.width, brick.height, 4);
        ctx.fill();
      });

      // Paddle
      const gradient = ctx.createLinearGradient(
        paddleXRef.current, 0,
        paddleXRef.current + PADDLE_WIDTH, 0
      );
      gradient.addColorStop(0, '#3b82f6');
      gradient.addColorStop(1, '#8b5cf6');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(paddleXRef.current, canvas.height - 30, PADDLE_WIDTH, PADDLE_HEIGHT, 6);
      ctx.fill();

      // Ball
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Shadow under ball
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.ellipse(ball.x, canvas.height - 10, BALL_RADIUS * 1.5, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      gameLoopRef.current = requestAnimationFrame(runGameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(runGameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
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
          Score: <span className="text-purple-400 font-bold">{score}</span>
        </span>
        <span className="text-sm text-gray-300">
          Lives: <span className="text-red-400 font-bold">{'❤️'.repeat(lives)}</span>
        </span>
      </div>

      {/* Game canvas */}
      <div className="flex-1 relative min-h-0">
        <canvas ref={canvasRef} className="w-full h-full cursor-none" />

        {/* Overlay states */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-6xl mb-4">🧱</span>
            <h2 className="text-2xl font-bold text-white mb-2">Breakout</h2>
            <p className="text-gray-400 mb-6">Move mouse to control paddle</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-lg transition-colors"
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
              onClick={() => setGameState('playing')}
              className="px-6 py-3 bg-purple-500 hover:bg-purple-400 text-white font-semibold rounded-lg transition-colors"
            >
              Press Space to Resume
            </button>
          </div>
        )}

        {gameState === 'won' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-6xl mb-4">🏆</span>
            <h2 className="text-2xl font-bold text-green-400 mb-2">Level Complete!</h2>
            <p className="text-gray-300 text-lg mb-6">Score: {score}</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-green-500 hover:bg-green-400 text-white font-semibold rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        )}

        {gameState === 'lost' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-6xl mb-4">💔</span>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Game Over</h2>
            <p className="text-gray-300 text-lg mb-6">Final Score: {score}</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-red-500 hover:bg-red-400 text-white font-semibold rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Breakout;
