/**
 * GamePlayer Component
 * 
 * Container that renders the active game.
 * Handles Suspense loading and error boundaries.
 */

import React, { Suspense, useCallback } from 'react';
import { ArrowLeft, Maximize2 } from 'lucide-react';
import { GameConfig, GameComponentProps } from '../types';

interface GamePlayerProps {
  game: GameConfig;
  onExit: () => void;
}

/**
 * Loading fallback while game loads
 */
const GameLoadingFallback: React.FC<{ title: string }> = ({ title }) => (
  <div className="h-full flex flex-col items-center justify-center bg-gray-900">
    <div className="w-16 h-16 rounded-2xl bg-gray-800 flex items-center justify-center mb-4 animate-pulse">
      <span className="text-3xl">🎮</span>
    </div>
    <p className="text-white text-lg font-medium">Loading {title}...</p>
    <p className="text-gray-500 text-sm mt-1">Please wait</p>
    <div className="mt-4 w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
      <div className="h-full bg-blue-500 rounded-full animate-[loading_1s_ease-in-out_infinite]" 
           style={{ width: '30%' }} />
    </div>
  </div>
);

/**
 * Error fallback if game fails to load
 */
const GameErrorFallback: React.FC<{ onExit: () => void }> = ({ onExit }) => (
  <div className="h-full flex flex-col items-center justify-center bg-gray-900">
    <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center mb-4">
      <span className="text-3xl">❌</span>
    </div>
    <p className="text-white text-lg font-medium">Failed to load game</p>
    <p className="text-gray-500 text-sm mt-1">Something went wrong</p>
    <button
      onClick={onExit}
      className="mt-4 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg text-sm"
    >
      Back to Games
    </button>
  </div>
);

/**
 * Error Boundary for game crashes
 */
class GameErrorBoundary extends React.Component<
  { children: React.ReactNode; onExit: () => void },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; onExit: () => void }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Game Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <GameErrorFallback onExit={this.props.onExit} />;
    }
    return this.props.children;
  }
}

export const GamePlayer: React.FC<GamePlayerProps> = ({ game, onExit }) => {
  const GameComponent = game.component;

  // Handle fullscreen request
  const handleRequestFullscreen = useCallback(() => {
    // Could implement actual fullscreen here if needed
    console.log('Fullscreen requested');
  }, []);

  const gameProps: GameComponentProps = {
    onExit,
    isActive: true,
    onRequestFullscreen: handleRequestFullscreen,
  };

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* Game header bar */}
      <div className="h-10 shrink-0 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-3">
        <button
          onClick={onExit}
          className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Games</span>
        </button>

        <span className="text-sm font-medium text-white flex items-center gap-2">
          <span>{game.icon}</span>
          {game.title}
        </span>

        <div className="flex items-center gap-2">
          {game.controls && (
            <span className="text-xs text-gray-500 hidden sm:block">
              {game.controls}
            </span>
          )}
          {game.supportsFullscreen && (
            <button
              onClick={handleRequestFullscreen}
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Game content */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <GameErrorBoundary onExit={onExit}>
          <Suspense fallback={<GameLoadingFallback title={game.title} />}>
            <GameComponent {...gameProps} />
          </Suspense>
        </GameErrorBoundary>
      </div>
    </div>
  );
};
