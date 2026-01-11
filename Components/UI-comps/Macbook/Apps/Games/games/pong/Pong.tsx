/**
 * Pong Game
 * 
 * Classic Pong game with keyboard or mouse controls.
 * Play against AI opponent.
 */

'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameComponentProps } from '../../types';

const PADDLE_HEIGHT = 80;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 12;
const BALL_SPEED = 5;
const PADDLE_SPEED = 6;
const AI_SPEED = 4;
const WINNING_SCORE = 5;

const Pong: React.FC<GameComponentProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameLoopRef = useRef<number | null>(null);
  
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'gameover'>('idle');
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [winner, setWinner] = useState<'player' | 'ai' | null>(null);

  // Game state refs
  const playerYRef = useRef(0);
  const aiYRef = useRef(0);
  const ballRef = useRef({ x: 0, y: 0, dx: BALL_SPEED, dy: BALL_SPEED });
  const keysRef = useRef({ up: false, down: false });

  // Initialize positions
  const initPositions = useCallback((canvas: HTMLCanvasElement) => {
    playerYRef.current = (canvas.height - PADDLE_HEIGHT) / 2;
    aiYRef.current = (canvas.height - PADDLE_HEIGHT) / 2;
    ballRef.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: (Math.random() > 0.5 ? 1 : -1) * BALL_SPEED,
      dy: (Math.random() * 2 - 1) * BALL_SPEED,
    };
  }, []);

  // Reset ball after score
  const resetBall = useCallback((canvas: HTMLCanvasElement, direction: number) => {
    ballRef.current = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      dx: direction * BALL_SPEED,
      dy: (Math.random() * 2 - 1) * BALL_SPEED,
    };
  }, []);

  // Start game
  const startGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    initPositions(canvas);
    setScores({ player: 0, ai: 0 });
    setWinner(null);
    setGameState('playing');
  }, [initPositions]);

  // Game loop - inside useEffect to avoid recursive callback
  useEffect(() => {
    if (gameState !== 'playing') return;

    const runGameLoop = () => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext('2d');
      if (!canvas || !ctx) return;

      // Update player paddle
      if (keysRef.current.up) {
        playerYRef.current = Math.max(0, playerYRef.current - PADDLE_SPEED);
      }
      if (keysRef.current.down) {
        playerYRef.current = Math.min(canvas.height - PADDLE_HEIGHT, playerYRef.current + PADDLE_SPEED);
      }

      // Update AI paddle
      const aiCenter = aiYRef.current + PADDLE_HEIGHT / 2;
      const ballY = ballRef.current.y;
      if (aiCenter < ballY - 20) {
        aiYRef.current = Math.min(canvas.height - PADDLE_HEIGHT, aiYRef.current + AI_SPEED);
      } else if (aiCenter > ballY + 20) {
        aiYRef.current = Math.max(0, aiYRef.current - AI_SPEED);
      }

      // Update ball
      const ball = ballRef.current;
      ball.x += ball.dx;
      ball.y += ball.dy;

      // Ball collision with top/bottom walls
      if (ball.y <= BALL_SIZE / 2 || ball.y >= canvas.height - BALL_SIZE / 2) {
        ball.dy *= -1;
        ball.y = Math.max(BALL_SIZE / 2, Math.min(canvas.height - BALL_SIZE / 2, ball.y));
      }

      // Ball collision with player paddle
      if (
        ball.x - BALL_SIZE / 2 <= PADDLE_WIDTH + 20 &&
        ball.y >= playerYRef.current &&
        ball.y <= playerYRef.current + PADDLE_HEIGHT &&
        ball.dx < 0
      ) {
        const hitPos = (ball.y - playerYRef.current) / PADDLE_HEIGHT;
        ball.dx = Math.abs(ball.dx) * 1.05;
        ball.dy = (hitPos - 0.5) * BALL_SPEED * 2;
      }

      // Ball collision with AI paddle
      if (
        ball.x + BALL_SIZE / 2 >= canvas.width - PADDLE_WIDTH - 20 &&
        ball.y >= aiYRef.current &&
        ball.y <= aiYRef.current + PADDLE_HEIGHT &&
        ball.dx > 0
      ) {
        const hitPos = (ball.y - aiYRef.current) / PADDLE_HEIGHT;
        ball.dx = -Math.abs(ball.dx) * 1.05;
        ball.dy = (hitPos - 0.5) * BALL_SPEED * 2;
      }

      // Score
      if (ball.x < 0) {
        setScores(prev => {
          const newScore = { ...prev, ai: prev.ai + 1 };
          if (newScore.ai >= WINNING_SCORE) {
            setWinner('ai');
            setGameState('gameover');
          } else {
            resetBall(canvas, -1);
          }
          return newScore;
        });
      } else if (ball.x > canvas.width) {
        setScores(prev => {
          const newScore = { ...prev, player: prev.player + 1 };
          if (newScore.player >= WINNING_SCORE) {
            setWinner('player');
            setGameState('gameover');
          } else {
            resetBall(canvas, 1);
          }
          return newScore;
        });
      }

      // Draw
      // Background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Center line
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(canvas.width / 2, 0);
      ctx.lineTo(canvas.width / 2, canvas.height);
      ctx.stroke();
      ctx.setLineDash([]);

      // Player paddle
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(20, playerYRef.current, PADDLE_WIDTH, PADDLE_HEIGHT);

      // AI paddle
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(canvas.width - 20 - PADDLE_WIDTH, aiYRef.current, PADDLE_WIDTH, PADDLE_HEIGHT);

      // Ball
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
      ctx.fill();

      // Continue loop
      gameLoopRef.current = requestAnimationFrame(runGameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(runGameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, resetBall]);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'w', 's', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameState === 'idle' || gameState === 'gameover') {
          startGame();
        } else if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
        return;
      }

      if (e.key === 'ArrowUp' || e.key === 'w') keysRef.current.up = true;
      if (e.key === 'ArrowDown' || e.key === 's') keysRef.current.down = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') keysRef.current.up = false;
      if (e.key === 'ArrowDown' || e.key === 's') keysRef.current.down = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState, startGame]);

  // Resize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (gameState === 'idle') {
        initPositions(canvas);
      }
    };

    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [gameState, initPositions]);

  return (
    <div className="h-full flex flex-col bg-black">
      {/* Score bar */}
      <div className="shrink-0 h-12 bg-gray-900 border-b border-gray-800 flex items-center justify-center gap-12 px-4">
        <div className="text-center">
          <span className="text-blue-400 font-bold text-2xl">{scores.player}</span>
          <span className="text-gray-500 text-xs ml-2">You</span>
        </div>
        <span className="text-gray-600">vs</span>
        <div className="text-center">
          <span className="text-red-400 font-bold text-2xl">{scores.ai}</span>
          <span className="text-gray-500 text-xs ml-2">CPU</span>
        </div>
      </div>

      {/* Game canvas */}
      <div className="flex-1 relative min-h-0">
        <canvas ref={canvasRef} className="w-full h-full" />

        {/* Overlay states */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-6xl mb-4">🏓</span>
            <h2 className="text-2xl font-bold text-white mb-2">Pong</h2>
            <p className="text-gray-400 mb-1">Use Arrow Keys or W/S to move</p>
            <p className="text-gray-500 text-sm mb-6">First to {WINNING_SCORE} wins!</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
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
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              Press Space to Resume
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-6xl mb-4">{winner === 'player' ? '🏆' : '😢'}</span>
            <h2 className={`text-2xl font-bold mb-2 ${winner === 'player' ? 'text-green-400' : 'text-red-400'}`}>
              {winner === 'player' ? 'You Win!' : 'Game Over'}
            </h2>
            <p className="text-gray-300 mb-6">
              Final Score: {scores.player} - {scores.ai}
            </p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pong;
