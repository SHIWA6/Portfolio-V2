/**
 * GameIcon Component
 * 
 * Renders a single game icon in the launcher grid.
 * Handles selection, double-click, and keyboard events.
 */

import React, { useCallback, memo } from 'react';
import { GameConfig } from '../types';

interface GameIconProps {
  game: GameConfig;
  isSelected: boolean;
  onSelect: (gameId: string) => void;
  onOpen: (gameId: string) => void;
  tabIndex: number;
}

export const GameIcon: React.FC<GameIconProps> = memo(({
  game,
  isSelected,
  onSelect,
  onOpen,
  tabIndex,
}) => {
  // Handle click (single = select)
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(game.id);
  }, [game.id, onSelect]);

  // Handle double-click (open game)
  const handleDoubleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (game.status !== 'coming-soon') {
      onOpen(game.id);
    }
  }, [game.id, game.status, onOpen]);

  // Handle keyboard
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && game.status !== 'coming-soon') {
      e.preventDefault();
      onOpen(game.id);
    }
  }, [game.id, game.status, onOpen]);

  const isComingSoon = game.status === 'coming-soon';

  return (
    <div
      className={`
        group flex flex-col items-center p-3 rounded-xl cursor-pointer
        transition-all duration-150 outline-none
        ${isSelected 
          ? 'bg-white/20 ring-2 ring-blue-400/50' 
          : 'hover:bg-white/10'}
        ${isComingSoon ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onKeyDown={handleKeyDown}
      tabIndex={tabIndex}
      role="button"
      aria-label={`${game.title}${isComingSoon ? ' (Coming Soon)' : ''}`}
      aria-pressed={isSelected}
    >
      {/* Icon container */}
      <div 
        className={`
          w-16 h-16 rounded-2xl flex items-center justify-center
          text-3xl shadow-lg transition-transform duration-150
          ${game.iconBg}
          ${!isComingSoon && 'group-hover:scale-105 group-active:scale-95'}
        `}
      >
        {game.icon}
      </div>

      {/* Label */}
      <span className={`
        mt-2 text-xs text-center font-medium max-w-20 truncate
        ${isSelected ? 'text-white' : 'text-gray-200'}
      `}>
        {game.title}
      </span>

      {/* Status badge */}
      {game.status === 'beta' && (
        <span className="mt-1 px-1.5 py-0.5 text-[9px] bg-yellow-500/80 text-black rounded-full font-semibold">
          BETA
        </span>
      )}
      {isComingSoon && (
        <span className="mt-1 px-1.5 py-0.5 text-[9px] bg-gray-500/80 text-white rounded-full font-semibold">
          SOON
        </span>
      )}
    </div>
  );
});

GameIcon.displayName = 'GameIcon';
