/**
 * GamesApp Component
 * 
 * Main game launcher window - the entry point for the games system.
 * 
 * Architecture:
 * - This component handles ONLY UI state and routing
 * - Game logic lives in individual game components
 * - Game metadata comes from data/games.ts
 * - All games are lazy-loaded when opened
 * 
 * Features:
 * - Finder-style grid layout
 * - Category filtering
 * - Keyboard navigation
 * - Smooth transitions between launcher and games
 */

'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GameCategory } from './types';
import { GAMES, CATEGORIES, getGamesByCategory, getGameById } from './data/games';
import {
  CategorySidebar,
  GameGrid,
  GameInfoBar,
  GamePlayer,
} from './components';

/**
 * Main Games App - acts as game launcher/hub
 */
const GamesApp: React.FC = () => {
  // UI State
  const [activeCategory, setActiveCategory] = useState<GameCategory>('all');
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [playingGameId, setPlayingGameId] = useState<string | null>(null);

  // Get filtered games based on category
  const filteredGames = useMemo(() => {
    return getGamesByCategory(activeCategory);
  }, [activeCategory]);

  // Get selected game object
  const selectedGame = useMemo(() => {
    return selectedGameId ? getGameById(selectedGameId) : null;
  }, [selectedGameId]);

  // Get currently playing game object
  const playingGame = useMemo(() => {
    return playingGameId ? getGameById(playingGameId) : null;
  }, [playingGameId]);

  // Calculate game counts per category
  const gameCounts = useMemo(() => {
    const counts: Record<GameCategory, number> = {
      all: GAMES.filter(g => g.status !== 'coming-soon').length,
      '2d': GAMES.filter(g => g.category === '2d' && g.status !== 'coming-soon').length,
      '3d': GAMES.filter(g => g.category === '3d' && g.status !== 'coming-soon').length,
      lightweight: GAMES.filter(g => g.category === 'lightweight' && g.status !== 'coming-soon').length,
    };
    return counts;
  }, []);

  // Handle category change
  const handleCategoryChange = useCallback((category: GameCategory) => {
    setActiveCategory(category);
    setSelectedGameId(null); // Clear selection when changing category
  }, []);

  // Handle game selection
  const handleSelectGame = useCallback((gameId: string) => {
    setSelectedGameId(gameId || null);
  }, []);

  // Handle opening a game
  const handleOpenGame = useCallback((gameId: string) => {
    const game = getGameById(gameId);
    if (game && game.status !== 'coming-soon') {
      setPlayingGameId(gameId);
    }
  }, []);

  // Handle exiting a game
  const handleExitGame = useCallback(() => {
    setPlayingGameId(null);
  }, []);

  // Handle play button click
  const handlePlayClick = useCallback(() => {
    if (selectedGameId) {
      handleOpenGame(selectedGameId);
    }
  }, [selectedGameId, handleOpenGame]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape exits current game
      if (e.key === 'Escape' && playingGameId) {
        e.preventDefault();
        handleExitGame();
        return;
      }

      // Don't handle other keys if playing
      if (playingGameId) return;

      // Enter opens selected game
      if (e.key === 'Enter' && selectedGameId) {
        e.preventDefault();
        handleOpenGame(selectedGameId);
        return;
      }

      // Tab cycles through categories
      if (e.key === 'Tab' && !e.shiftKey && e.target === document.body) {
        e.preventDefault();
        const currentIndex = CATEGORIES.findIndex(c => c.id === activeCategory);
        const nextIndex = (currentIndex + 1) % CATEGORIES.length;
        setActiveCategory(CATEGORIES[nextIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playingGameId, selectedGameId, activeCategory, handleExitGame, handleOpenGame]);

  // If a game is playing, show the game player
  if (playingGame) {
    return (
      <div className="h-full" style={{ overflow: 'hidden' }}>
        <GamePlayer game={playingGame} onExit={handleExitGame} />
      </div>
    );
  }

  // Otherwise show the launcher
  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      style={{ overflow: 'hidden' }}
    >
      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Category sidebar */}
        <CategorySidebar
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          gameCounts={gameCounts}
        />

        {/* Games grid */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          {/* Header with category info */}
          <div className="shrink-0 px-4 py-3 border-b border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                  <span>{CATEGORIES.find(c => c.id === activeCategory)?.icon}</span>
                  {CATEGORIES.find(c => c.id === activeCategory)?.label}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {CATEGORIES.find(c => c.id === activeCategory)?.description}
                </p>
              </div>
              <span className="text-sm text-gray-400">
                {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''}
              </span>
            </div>
          </div>

          {/* Grid area */}
          <GameGrid
            games={filteredGames}
            selectedGameId={selectedGameId}
            onSelect={handleSelectGame}
            onOpen={handleOpenGame}
          />
        </div>
      </div>

      {/* Bottom info bar */}
      <GameInfoBar
        game={selectedGame || null}
        onPlay={handlePlayClick}
      />

      {/* Keyboard hints */}
      <div className="shrink-0 px-4 py-1.5 bg-black/40 text-[10px] text-gray-500 flex items-center justify-center gap-4">
        <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">↑↓←→</kbd> Navigate</span>
        <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">Enter</kbd> Play</span>
        <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">Esc</kbd> Exit Game</span>
        <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">Tab</kbd> Categories</span>
      </div>
    </div>
  );
};

export default GamesApp;
