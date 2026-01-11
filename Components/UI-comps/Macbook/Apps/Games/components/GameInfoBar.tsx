/**
 * GameInfoBar Component
 * 
 * Shows details about the selected game at the bottom of the launcher.
 * Similar to Finder's path/info bar.
 */

import React from 'react';
import { GameConfig } from '../types';

interface GameInfoBarProps {
  game: GameConfig | null;
  onPlay: () => void;
}

export const GameInfoBar: React.FC<GameInfoBarProps> = ({ game, onPlay }) => {
  if (!game) {
    return (
      <div className="h-16 shrink-0 border-t border-white/10 bg-black/30 flex items-center justify-center px-4">
        <p className="text-sm text-gray-500">Select a game to see details</p>
      </div>
    );
  }

  const isComingSoon = game.status === 'coming-soon';

  return (
    <div className="h-16 shrink-0 border-t border-white/10 bg-black/30 flex items-center gap-4 px-4">
      {/* Icon */}
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${game.iconBg}`}>
        {game.icon}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-white truncate">
          {game.title}
          {game.status === 'beta' && (
            <span className="ml-2 text-[10px] bg-yellow-500/80 text-black px-1.5 py-0.5 rounded-full">
              BETA
            </span>
          )}
        </h4>
        <p className="text-xs text-gray-400 truncate">
          {game.description}
        </p>
      </div>

      {/* Meta info */}
      <div className="hidden sm:flex items-center gap-4 text-xs text-gray-400">
        {game.difficulty && (
          <span className="flex items-center gap-1">
            <span className="text-gray-500">Difficulty:</span>
            <span className={`
              ${game.difficulty === 'easy' ? 'text-green-400' : ''}
              ${game.difficulty === 'medium' ? 'text-yellow-400' : ''}
              ${game.difficulty === 'hard' ? 'text-red-400' : ''}
            `}>
              {game.difficulty}
            </span>
          </span>
        )}
        {game.playTime && (
          <span>
            <span className="text-gray-500">Time:</span> {game.playTime}
          </span>
        )}
      </div>

      {/* Play button */}
      <button
        onClick={onPlay}
        disabled={isComingSoon}
        className={`
          px-4 py-2 rounded-lg text-sm font-medium transition-colors
          ${isComingSoon 
            ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-400 text-white'}
        `}
      >
        {isComingSoon ? 'Coming Soon' : 'Play'}
      </button>
    </div>
  );
};
