/**
 * Games Index
 * 
 * Central export for all game components.
 * Used for lazy loading in the games registry.
 */

import { lazy } from 'react';

// Lazy-loaded game components
export const Snake = lazy(() => import('./snake'));
export const TicTacToe = lazy(() => import('./tictactoe'));
export const Memory = lazy(() => import('./memory'));
export const Pong = lazy(() => import('./pong'));
export const Minesweeper = lazy(() => import('./minesweeper'));
export const Breakout = lazy(() => import('./breakout'));
export const CubeRunner = lazy(() => import('./cuberunner'));

// Map of game IDs to lazy components
export const GAME_COMPONENTS = {
  'snake': Snake,
  'tictactoe': TicTacToe,
  'memory': Memory,
  'pong': Pong,
  'minesweeper': Minesweeper,
  'breakout': Breakout,
  'cuberunner': CubeRunner,
} as const;

export type GameId = keyof typeof GAME_COMPONENTS;
