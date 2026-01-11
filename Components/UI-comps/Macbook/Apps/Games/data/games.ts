/**
 * Games Registry
 * 
 * Central configuration file for all games in the system.
 * Adding a new game requires ONLY:
 * 1. Adding an entry here
 * 2. Creating the game component in /games/{game-id}/
 * 
 * The launcher automatically handles everything else.
 */

import { lazy } from 'react';
import { GameConfig, CategoryConfig } from '../types';

/**
 * Category definitions with metadata
 */
export const CATEGORIES: CategoryConfig[] = [
  {
    id: 'all',
    label: 'All Games',
    icon: '🎮',
    description: 'Browse all available games',
  },
  {
    id: '2d',
    label: '2D Games',
    icon: '👾',
    description: 'Classic arcade and 2D games',
  },
  {
    id: '3d',
    label: '3D Games',
    icon: '🎯',
    description: 'Immersive 3D experiences',
  },
  {
    id: 'lightweight',
    label: 'Quick Play',
    icon: '⚡',
    description: 'Fast, casual games',
  },
];

/**
 * Game registry - all games defined here
 * 
 * ADDING A NEW GAME:
 * 1. Create folder: /games/{your-game-id}/
 * 2. Create component: /games/{your-game-id}/{YourGame}.tsx
 * 3. Add entry below with lazy() import
 */
export const GAMES: GameConfig[] = [
  // ============================================
  // 2D GAMES
  // ============================================
  {
    id: 'snake',
    title: 'Snake',
    description: 'Classic snake game. Eat food, grow longer, avoid walls!',
    category: '2d',
    icon: '🐍',
    iconBg: 'bg-green-500',
    component: lazy(() => import('../games/snake/Snake')),
    status: 'stable',
    difficulty: 'easy',
    playTime: '5-10 min',
    controls: 'Arrow keys to move',
    tags: ['classic', 'arcade', 'retro'],
  },
  {
    id: 'pong',
    title: 'Pong',
    description: 'The original video game. Play against AI!',
    category: '2d',
    icon: '🏓',
    iconBg: 'bg-blue-500',
    component: lazy(() => import('../games/pong/Pong')),
    status: 'stable',
    difficulty: 'easy',
    playTime: '5 min',
    controls: 'W/S or Arrow keys',
    tags: ['classic', 'arcade', 'multiplayer'],
  },
  {
    id: 'breakout',
    title: 'Breakout',
    description: 'Break all the bricks with your paddle and ball!',
    category: '2d',
    icon: '🧱',
    iconBg: 'bg-orange-500',
    component: lazy(() => import('../games/breakout/Breakout')),
    status: 'beta',
    difficulty: 'medium',
    playTime: '10 min',
    controls: 'Left/Right arrows or mouse',
    tags: ['classic', 'arcade'],
  },

  // ============================================
  // 3D GAMES
  // ============================================
  {
    id: 'cuberunner',
    title: 'Cube Runner',
    description: 'Navigate through obstacles in 3D space',
    category: '3d',
    icon: '🎲',
    iconBg: 'bg-purple-500',
    component: lazy(() => import('../games/cuberunner/CubeRunner')),
    status: 'stable',
    difficulty: 'medium',
    playTime: '5 min',
    controls: 'Arrow keys or A/D',
    supportsFullscreen: true,
    minWidth: 600,
    minHeight: 400,
    tags: ['3d', 'endless-runner'],
  },

  // ============================================
  // LIGHTWEIGHT / QUICK GAMES
  // ============================================
  {
    id: 'tictactoe',
    title: 'Tic Tac Toe',
    description: 'Classic X and O game. Play against a friend or AI!',
    category: 'lightweight',
    icon: '⭕',
    iconBg: 'bg-pink-500',
    component: lazy(() => import('../games/tictactoe/TicTacToe')),
    status: 'stable',
    difficulty: 'easy',
    playTime: '2 min',
    controls: 'Click to place',
    tags: ['puzzle', 'strategy', 'multiplayer'],
  },
  {
    id: 'memory',
    title: 'Memory Match',
    description: 'Find matching pairs. Test your memory!',
    category: 'lightweight',
    icon: '🧠',
    iconBg: 'bg-yellow-500',
    component: lazy(() => import('../games/memory/Memory')),
    status: 'stable',
    difficulty: 'easy',
    playTime: '3-5 min',
    controls: 'Click cards to flip',
    tags: ['puzzle', 'memory', 'casual'],
  },
  {
    id: 'minesweeper',
    title: 'Minesweeper',
    description: 'Clear the minefield without triggering any mines!',
    category: 'lightweight',
    icon: '💣',
    iconBg: 'bg-gray-600',
    component: lazy(() => import('../games/minesweeper/Minesweeper')),
    status: 'beta',
    difficulty: 'medium',
    playTime: '5-15 min',
    controls: 'Click to reveal, Right-click to flag',
    tags: ['puzzle', 'strategy', 'classic'],
  },
];

/**
 * Get games filtered by category
 */
export function getGamesByCategory(category: GameConfig['category']): GameConfig[] {
  if (category === 'all') return GAMES.filter(g => g.status !== 'coming-soon');
  return GAMES.filter(g => g.category === category && g.status !== 'coming-soon');
}

/**
 * Get a single game by ID
 */
export function getGameById(id: string): GameConfig | undefined {
  return GAMES.find(g => g.id === id);
}

/**
 * Get games by status
 */
export function getGamesByStatus(status: GameConfig['status']): GameConfig[] {
  return GAMES.filter(g => g.status === status);
}

/**
 * Search games by title or tags
 */
export function searchGames(query: string): GameConfig[] {
  const lowerQuery = query.toLowerCase();
  return GAMES.filter(g => 
    g.title.toLowerCase().includes(lowerQuery) ||
    g.description.toLowerCase().includes(lowerQuery) ||
    g.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}
