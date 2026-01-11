/**
 * 3D Cube Runner Game
 * 
 * Simple endless runner with CSS 3D perspective.
 * Dodge obstacles by moving left/right.
 */

'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameComponentProps } from '../../types';

interface Obstacle {
  id: number;
  lane: number;
  z: number;
}

const LANES = [-1, 0, 1];
const LANE_WIDTH = 60;
const OBSTACLE_SPEED = 0.8;
const SPAWN_RATE = 60; // frames between spawns

const CubeRunner: React.FC<GameComponentProps> = () => {
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(() => {
    if (typeof window === 'undefined') return 0;
    const saved = localStorage.getItem('cuberunner-highscore');
    return saved ? parseInt(saved, 10) : 0;
  });
  const [playerLane, setPlayerLane] = useState(0);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  
  const frameRef = useRef(0);
  const gameLoopRef = useRef<number | null>(null);
  const obstacleIdRef = useRef(0);

  // Start game
  const startGame = useCallback(() => {
    setScore(0);
    setPlayerLane(0);
    setObstacles([]);
    frameRef.current = 0;
    obstacleIdRef.current = 0;
    setGameState('playing');
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const loop = () => {
      frameRef.current++;

      // Spawn obstacles
      if (frameRef.current % SPAWN_RATE === 0) {
        const lane = LANES[Math.floor(Math.random() * LANES.length)];
        setObstacles(prev => [
          ...prev,
          { id: obstacleIdRef.current++, lane, z: 1000 }
        ]);
      }

      // Update obstacles
      setObstacles(prev => {
        const updated = prev
          .map(obs => ({ ...obs, z: obs.z - OBSTACLE_SPEED * 10 }))
          .filter(obs => obs.z > -100);

        // Check collisions
        for (const obs of updated) {
          if (obs.z < 50 && obs.z > -20 && obs.lane === playerLane) {
            // Collision!
            setGameState('gameover');
            setScore(s => {
              if (s > highScore) {
                setHighScore(s);
                localStorage.setItem('cuberunner-highscore', s.toString());
              }
              return s;
            });
            return prev;
          }
        }

        return updated;
      });

      // Update score
      setScore(prev => prev + 1);

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameState, playerLane, highScore]);

  // Handle keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key === ' ') {
        if (gameState !== 'playing') {
          startGame();
        }
        return;
      }

      if (gameState !== 'playing') return;

      if (e.key === 'ArrowLeft' || e.key === 'a') {
        setPlayerLane(prev => Math.max(-1, prev - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd') {
        setPlayerLane(prev => Math.min(1, prev + 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState, startGame]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-purple-900 via-indigo-900 to-black overflow-hidden">
      {/* Score bar */}
      <div className="shrink-0 h-10 bg-black/50 flex items-center justify-between px-4">
        <span className="text-sm text-gray-300">
          Score: <span className="text-cyan-400 font-bold">{score}</span>
        </span>
        <span className="text-sm text-gray-300">
          Best: <span className="text-yellow-400 font-bold">{highScore}</span>
        </span>
      </div>

      {/* Game area */}
      <div 
        className="flex-1 relative min-h-0"
        style={{ 
          perspective: '500px',
          perspectiveOrigin: '50% 70%',
        }}
      >
        {/* Road */}
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2"
          style={{
            width: '300px',
            height: '400px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(50,50,80,0.8) 100%)',
            transform: 'translateX(-50%) rotateX(60deg)',
            transformOrigin: 'bottom',
          }}
        >
          {/* Lane markers */}
          <div className="absolute inset-0 flex justify-center gap-[60px]">
            {[0, 1, 2, 3].map(i => (
              <div 
                key={i} 
                className="w-0.5 h-full bg-gradient-to-b from-transparent via-white/20 to-white/40"
              />
            ))}
          </div>
        </div>

        {/* Player cube */}
        <div
          className="absolute bottom-16 left-1/2 w-10 h-10 transition-transform duration-100"
          style={{
            transform: `translateX(calc(-50% + ${playerLane * LANE_WIDTH}px))`,
          }}
        >
          <div 
            className="w-full h-full bg-gradient-to-br from-cyan-400 to-blue-600 rounded shadow-lg shadow-cyan-500/50"
            style={{
              animation: gameState === 'playing' ? 'pulse 0.5s ease-in-out infinite' : 'none',
            }}
          />
        </div>

        {/* Obstacles */}
        {obstacles.map(obs => {
          const scale = Math.max(0.1, 1 - obs.z / 1000);
          const y = 200 - (obs.z / 1000) * 300;
          
          return (
            <div
              key={obs.id}
              className="absolute left-1/2 w-8 h-8 bg-red-500 rounded"
              style={{
                transform: `translateX(calc(-50% + ${obs.lane * LANE_WIDTH * scale}px)) scale(${scale})`,
                bottom: `${60 + y * scale}px`,
                opacity: scale,
              }}
            />
          );
        })}

        {/* Overlay states */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60">
            <span className="text-6xl mb-4">🏃</span>
            <h2 className="text-2xl font-bold text-white mb-2">Cube Runner</h2>
            <p className="text-gray-400 mb-1">Use ← → or A/D to move</p>
            <p className="text-gray-500 text-sm mb-6">Dodge the obstacles!</p>
            <button
              onClick={startGame}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition-colors"
            >
              Press Space to Start
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
            <span className="text-6xl mb-4">💥</span>
            <h2 className="text-2xl font-bold text-red-400 mb-2">Game Over</h2>
            <p className="text-gray-300 text-lg mb-1">Score: {score}</p>
            {score >= highScore && score > 0 && (
              <p className="text-yellow-400 text-sm mb-4">🏆 New High Score!</p>
            )}
            <button
              onClick={startGame}
              className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-white font-semibold rounded-lg transition-colors"
            >
              Play Again
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
};

export default CubeRunner;
