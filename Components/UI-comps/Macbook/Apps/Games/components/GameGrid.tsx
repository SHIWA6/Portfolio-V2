/**
 * GameGrid Component
 * 
 * Renders games in a Finder-style grid layout.
 * Handles keyboard navigation between icons.
 */

import React, { useCallback, useRef, useEffect } from 'react';
import { GameConfig } from '../types';
import { GameIcon } from './GameIcon';

interface GameGridProps {
  games: GameConfig[];
  selectedGameId: string | null;
  onSelect: (gameId: string) => void;
  onOpen: (gameId: string) => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  selectedGameId,
  onSelect,
  onOpen,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef(4); // Will be calculated based on container width

  // Calculate columns based on grid width
  useEffect(() => {
    const updateColumns = () => {
      if (gridRef.current) {
        const width = gridRef.current.clientWidth;
        // Each icon is ~96px wide with gap
        columnsRef.current = Math.max(2, Math.floor(width / 100));
      }
    };

    updateColumns();
    window.addEventListener('resize', updateColumns);
    return () => window.removeEventListener('resize', updateColumns);
  }, []);

  // Keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!selectedGameId || games.length === 0) return;

    const currentIndex = games.findIndex(g => g.id === selectedGameId);
    if (currentIndex === -1) return;

    let newIndex = currentIndex;
    const cols = columnsRef.current;

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(currentIndex + 1, games.length - 1);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(currentIndex - 1, 0);
        break;
      case 'ArrowDown':
        e.preventDefault();
        newIndex = Math.min(currentIndex + cols, games.length - 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        newIndex = Math.max(currentIndex - cols, 0);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = games.length - 1;
        break;
      default:
        return;
    }

    if (newIndex !== currentIndex) {
      onSelect(games[newIndex].id);
      // Scroll into view if needed
      const iconElement = gridRef.current?.querySelector(`[data-game-id="${games[newIndex].id}"]`);
      iconElement?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [selectedGameId, games, onSelect]);

  // Click on empty space deselects
  const handleGridClick = useCallback((e: React.MouseEvent) => {
    if (e.target === gridRef.current) {
      onSelect('');
    }
  }, [onSelect]);

  if (games.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        <div className="text-center">
          <span className="text-4xl mb-2 block">🎮</span>
          <p>No games in this category yet</p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={gridRef}
      className="flex-1 min-h-0 p-4"
      style={{
        overflowY: 'auto',
        overflowX: 'hidden',
        overscrollBehavior: 'contain',
      }}
      onClick={handleGridClick}
      onKeyDown={handleKeyDown}
      role="listbox"
      aria-label="Games grid"
    >
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {games.map((game) => (
          <div key={game.id} data-game-id={game.id}>
            <GameIcon
              game={game}
              isSelected={selectedGameId === game.id}
              onSelect={onSelect}
              onOpen={onOpen}
              tabIndex={selectedGameId === game.id ? 0 : -1}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
