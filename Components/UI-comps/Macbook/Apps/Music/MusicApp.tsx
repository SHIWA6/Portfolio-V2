/**
 * MusicApp Component
 * 
 * A fully-featured YouTube-based music player with:
 * - Spotify/Apple Music-inspired dark UI
 * - Playlist management with localStorage persistence
 * - YouTube IFrame Player API integration (audio-only illusion)
 * - Keyboard shortcuts (Space: play/pause, Arrow keys: next/previous)
 * 
 * Architecture:
 * - hooks/usePlaylist: Manages playlist state and localStorage
 * - hooks/useYouTubePlayer: Wraps YouTube IFrame Player API
 * - components/*: UI components (Player, Playlist, NowPlaying, AddSongInput)
 * - utils/*: YouTube URL parsing and metadata fetching
 * - types/*: TypeScript interfaces
 * 
 * Legal: Uses only embedded YouTube playback (no downloading/conversion)
 */

'use client';

import React, { useEffect, useCallback, useId, useRef } from 'react';
import { usePlaylist, useYouTubePlayer } from './hooks';
import { Player, Playlist, NowPlaying, AddSongInput } from './components';

/**
 * Main Music App component
 * Combines all sub-components and manages global keyboard shortcuts
 */
const MusicApp: React.FC = () => {
  // Generate unique ID for YouTube player container
  const playerId = useId().replace(/:/g, '-');
  const containerIdRef = `youtube-player-${playerId}`;
  const lastVideoIdRef = useRef<string | null>(null);

  // Initialize playlist hook
  const {
    playlist,
    currentTrack,
    currentIndex,
    addTrack,
    removeTrack,
    playTrack,
    nextTrack,
    previousTrack,
    resetToDefaults,
    isLoading,
  } = usePlaylist();

  // Initialize YouTube player hook
  const {
    isPlaying,
    isReady,
    currentTime,
    duration,
    volume,
    togglePlay,
    seek,
    setVolume,
    loadVideo,
    play,
  } = useYouTubePlayer(containerIdRef, nextTrack);

  // Load video when current track changes
  useEffect(() => {
    if (currentTrack && isReady) {
      loadVideo(currentTrack.videoId);
    }
  }, [currentTrack, isReady, loadVideo]);

  // Auto-play when a new track is added (using ref to track videoId changes)
  useEffect(() => {
    if (currentTrack && isReady) {
      const isNewTrack = lastVideoIdRef.current !== currentTrack.videoId;
      if (isNewTrack) {
        lastVideoIdRef.current = currentTrack.videoId;
        // Small delay to ensure video is loaded
        const timer = setTimeout(() => {
          play();
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [currentTrack, isReady, play]);

  // Handle track selection from playlist
  const handlePlayTrack = useCallback(
    (index: number) => {
      playTrack(index);
      // Video will be loaded by the useEffect above
    },
    [playTrack]
  );

  // Global keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowRight':
          e.preventDefault();
          nextTrack();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          previousTrack();
          break;
        case 'ArrowUp':
          e.preventDefault();
          setVolume(Math.min(100, volume + 10));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setVolume(Math.max(0, volume - 10));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePlay, nextTrack, previousTrack, setVolume, volume]);

  return (
    <div 
      className="h-full flex flex-col bg-gradient-to-b from-[#1a1a2e] to-[#16213e] text-white"
      style={{ overflow: 'hidden' }}
    >
      {/* Hidden YouTube Player Container */}
      <div 
        id={containerIdRef} 
        className="absolute opacity-0 pointer-events-none" 
        aria-hidden="true"
      />

      {/* Main content area */}
      <div className="flex-1 flex min-h-0">
        {/* Left Panel: Playlist */}
        <div className="w-64 shrink-0 flex flex-col border-r border-white/10 bg-black/20 min-h-0">
          {/* Add song input - fixed height */}
          <div className="shrink-0">
            <AddSongInput 
              onAdd={addTrack} 
              onResetToDefaults={resetToDefaults}
              isLoading={isLoading} 
            />
          </div>
          
          {/* Playlist - scrollable with isolation */}
          <div 
            className="flex-1 min-h-0"
            style={{ 
              overflowY: 'auto',
              overflowX: 'hidden',
              overscrollBehavior: 'contain',
            }}
          >
            <Playlist
              tracks={playlist}
              currentIndex={currentIndex}
              onPlay={handlePlayTrack}
              onRemove={removeTrack}
            />
          </div>
        </div>

        {/* Right Panel: Now Playing */}
        <div className="flex-1 flex flex-col min-w-0 min-h-0">
          <div 
            className="flex-1 min-h-0"
            style={{
              overflowY: 'auto',
              overflowX: 'hidden',
              overscrollBehavior: 'contain',
            }}
          >
            <NowPlaying track={currentTrack} isPlaying={isPlaying} />
          </div>
        </div>
      </div>

      {/* Bottom: Player controls */}
      <Player
        isPlaying={isPlaying}
        currentTime={currentTime}
        duration={duration}
        volume={volume}
        onPlayPause={togglePlay}
        onNext={nextTrack}
        onPrevious={previousTrack}
        onSeek={seek}
        onVolumeChange={setVolume}
        disabled={!currentTrack}
      />

      {/* Keyboard shortcuts hint */}
      <div className="px-4 py-1.5 bg-black/40 text-[10px] text-gray-500 flex items-center justify-center gap-4">
        <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">Space</kbd> Play/Pause</span>
        <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">←</kbd> Previous</span>
        <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">→</kbd> Next</span>
        <span><kbd className="px-1 py-0.5 bg-white/10 rounded text-[9px]">↑↓</kbd> Volume</span>
      </div>
    </div>
  );
};

export default MusicApp;