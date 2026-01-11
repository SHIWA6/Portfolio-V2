/**
 * Games System Type Definitions
 * 
 * Central type definitions for the entire games system.
 * All games, categories, and components reference these types.
 */

import { ComponentType, LazyExoticComponent } from 'react';

/**
 * Game categories for organization
 */
export type GameCategory = '2d' | '3d' | 'lightweight' | 'all';

/**
 * Game difficulty levels
 */
export type GameDifficulty = 'easy' | 'medium' | 'hard';

/**
 * Game status for development tracking
 */
export type GameStatus = 'stable' | 'beta' | 'coming-soon';

/**
 * Props that all game components receive
 */
export interface GameComponentProps {
  /** Callback when game requests to exit */
  onExit?: () => void;
  /** Whether game is currently active/focused */
  isActive?: boolean;
  /** Request fullscreen mode (for 3D games) */
  onRequestFullscreen?: () => void;
}

/**
 * Game metadata configuration
 * This is the primary interface for registering games
 */
export interface GameConfig {
  /** Unique identifier for the game */
  id: string;
  /** Display title */
  title: string;
  /** Short description */
  description: string;
  /** Category for filtering */
  category: GameCategory;
  /** Icon - can be emoji, image URL, or component name */
  icon: string;
  /** Background color for icon container */
  iconBg: string;
  /** Lazy-loaded component */
  component: LazyExoticComponent<ComponentType<GameComponentProps>>;
  /** Development status */
  status: GameStatus;
  /** Difficulty level */
  difficulty?: GameDifficulty;
  /** Estimated play time */
  playTime?: string;
  /** Controls hint */
  controls?: string;
  /** Whether game supports fullscreen */
  supportsFullscreen?: boolean;
  /** Minimum recommended window size */
  minWidth?: number;
  minHeight?: number;
  /** Tags for search/filtering */
  tags?: string[];
}

/**
 * Category metadata for UI rendering
 */
export interface CategoryConfig {
  id: GameCategory;
  label: string;
  icon: string;
  description: string;
}

/**
 * Game session state (for future high scores, etc.)
 */
export interface GameSession {
  gameId: string;
  startTime: number;
  endTime?: number;
  score?: number;
  completed?: boolean;
}

/**
 * Games launcher view state
 */
export type LauncherView = 'grid' | 'list';

/**
 * Selected game state in launcher
 */
export interface SelectedGameState {
  gameId: string | null;
  isPlaying: boolean;
}
