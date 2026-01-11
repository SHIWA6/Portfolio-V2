/**
 * Memory Match Game
 * 
 * Classic card matching memory game.
 * Find all matching pairs as fast as possible.
 */

'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { GameComponentProps } from '../../types';

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const EMOJIS = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎹', '🎸'];

const Memory: React.FC<GameComponentProps> = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'won'>('idle');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [bestTime, setBestTime] = useState<number | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('memory-best-time');
    return saved ? parseInt(saved, 10) : null;
  });

  // Initialize game
  const initGame = useCallback(() => {
    const shuffled = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    
    setCards(shuffled);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
    setIsLocked(false);
    setGameState('playing');
    setStartTime(Date.now());
    setElapsedTime(0);
  }, []);

  // Timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameState === 'playing' && startTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState, startTime]);

  // Handle card click
  const handleCardClick = useCallback((id: number) => {
    if (isLocked) return;
    
    const card = cards.find(c => c.id === id);
    if (!card || card.isFlipped || card.isMatched) return;

    const newCards = cards.map(c => 
      c.id === id ? { ...c, isFlipped: true } : c
    );
    setCards(newCards);

    const newFlipped = [...flippedCards, id];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      setIsLocked(true);

      const [firstId, secondId] = newFlipped;
      const firstCard = newCards.find(c => c.id === firstId);
      const secondCard = newCards.find(c => c.id === secondId);

      if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
        // Match found
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isMatched: true } 
              : c
          ));
          setMatches(prev => {
            const newMatches = prev + 1;
            if (newMatches === EMOJIS.length) {
              setGameState('won');
              const finalTime = Math.floor((Date.now() - (startTime || Date.now())) / 1000);
              if (!bestTime || finalTime < bestTime) {
                setBestTime(finalTime);
                localStorage.setItem('memory-best-time', finalTime.toString());
              }
            }
            return newMatches;
          });
          setFlippedCards([]);
          setIsLocked(false);
        }, 300);
      } else {
        // No match
        setTimeout(() => {
          setCards(prev => prev.map(c => 
            c.id === firstId || c.id === secondId 
              ? { ...c, isFlipped: false } 
              : c
          ));
          setFlippedCards([]);
          setIsLocked(false);
        }, 800);
      }
    }
  }, [cards, flippedCards, isLocked, startTime, bestTime]);

  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-teal-900 to-cyan-900 p-6">
      {/* Header */}
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Memory Match</h1>
        <p className="text-gray-300 text-sm">Find all matching pairs!</p>
      </div>

      {gameState === 'idle' ? (
        <button
          onClick={initGame}
          className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-white text-xl font-bold rounded-xl transition-colors"
        >
          Start Game
        </button>
      ) : (
        <>
          {/* Stats */}
          <div className="flex gap-6 mb-4 text-sm">
            <div className="text-center">
              <span className="text-gray-400">Time</span>
              <p className="text-white font-bold text-lg">{formatTime(elapsedTime)}</p>
            </div>
            <div className="text-center">
              <span className="text-gray-400">Moves</span>
              <p className="text-white font-bold text-lg">{moves}</p>
            </div>
            <div className="text-center">
              <span className="text-gray-400">Matches</span>
              <p className="text-white font-bold text-lg">{matches}/{EMOJIS.length}</p>
            </div>
            {bestTime && (
              <div className="text-center">
                <span className="text-gray-400">Best</span>
                <p className="text-yellow-400 font-bold text-lg">{formatTime(bestTime)}</p>
              </div>
            )}
          </div>

          {/* Game Board */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {cards.map(card => (
              <button
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                disabled={card.isFlipped || card.isMatched || isLocked}
                className={`
                  w-16 h-16 text-2xl rounded-lg transition-all duration-200 transform
                  ${card.isFlipped || card.isMatched
                    ? 'bg-white/90 scale-100 rotate-0'
                    : 'bg-gradient-to-br from-teal-500 to-emerald-500 hover:scale-105 hover:rotate-1'
                  }
                  ${card.isMatched ? 'opacity-60 scale-95' : ''}
                `}
              >
                {card.isFlipped || card.isMatched ? card.emoji : '?'}
              </button>
            ))}
          </div>

          {/* Win state */}
          {gameState === 'won' && (
            <div className="text-center mb-4 animate-pulse">
              <p className="text-2xl font-bold text-white mb-2">
                🎉 You Won! 🎉
              </p>
              <p className="text-gray-300">
                Completed in {formatTime(elapsedTime)} with {moves} moves
              </p>
              {elapsedTime === bestTime && (
                <p className="text-yellow-400 text-sm mt-1">🏆 New Best Time!</p>
              )}
            </div>
          )}

          {/* Restart button */}
          <button
            onClick={initGame}
            className="px-6 py-2 bg-teal-500 hover:bg-teal-400 text-white font-semibold rounded-lg transition-colors"
          >
            {gameState === 'won' ? 'Play Again' : 'Restart'}
          </button>
        </>
      )}
    </div>
  );
};

export default Memory;
