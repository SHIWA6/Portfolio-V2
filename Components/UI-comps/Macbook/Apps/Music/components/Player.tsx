/**
 * Player Component
 * 
 * Renders the playback controls: play/pause, next, previous, seek bar, volume.
 * Styled with a Spotify-like dark aesthetic.
 */

import React, { useCallback } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Volume1 } from 'lucide-react';
import { formatDuration } from '../utils';

interface PlayerProps {
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  onPlayPause: () => void;
  onNext: () => void;
  onPrevious: () => void;
  onSeek: (time: number) => void;
  onVolumeChange: (volume: number) => void;
  disabled?: boolean;
}

/**
 * Player controls component with seek bar and volume slider
 */
export const Player: React.FC<PlayerProps> = ({
  isPlaying,
  currentTime,
  duration,
  volume,
  onPlayPause,
  onNext,
  onPrevious,
  onSeek,
  onVolumeChange,
  disabled = false,
}) => {
  // Handle seek bar change
  const handleSeek = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onSeek(parseFloat(e.target.value));
    },
    [onSeek]
  );

  // Handle volume change
  const handleVolume = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onVolumeChange(parseFloat(e.target.value));
    },
    [onVolumeChange]
  );

  // Get volume icon based on level
  const VolumeIcon = volume === 0 ? VolumeX : volume < 50 ? Volume1 : Volume2;

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-2 px-4 py-3 bg-black/30 backdrop-blur-sm">
      {/* Seek bar */}
      <div className="flex items-center gap-2">
        <span className="text-[10px] text-gray-400 w-8 text-right font-mono">
          {formatDuration(currentTime)}
        </span>
        <div className="relative flex-1 group">
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            disabled={disabled}
            className="w-full h-1 bg-gray-600 rounded-full appearance-none cursor-pointer
                       disabled:cursor-not-allowed disabled:opacity-50
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-0
                       [&::-webkit-slider-thumb]:h-0
                       [&::-webkit-slider-thumb]:opacity-0
                       group-hover:[&::-webkit-slider-thumb]:w-3
                       group-hover:[&::-webkit-slider-thumb]:h-3
                       group-hover:[&::-webkit-slider-thumb]:opacity-100
                       [&::-webkit-slider-thumb]:bg-white
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:transition-all
                       [&::-webkit-slider-thumb]:duration-150"
            style={{
              background: `linear-gradient(to right, #1db954 ${progress}%, #4b5563 ${progress}%)`,
            }}
            aria-label="Seek"
          />
        </div>
        <span className="text-[10px] text-gray-400 w-8 font-mono">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        {/* Playback controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onPrevious}
            disabled={disabled}
            className="p-1.5 text-gray-300 hover:text-white transition-colors
                       disabled:text-gray-600 disabled:cursor-not-allowed"
            aria-label="Previous track"
          >
            <SkipBack className="w-4 h-4" fill="currentColor" />
          </button>

          <button
            onClick={onPlayPause}
            disabled={disabled}
            className="p-2 bg-white rounded-full text-black hover:scale-105
                       transition-transform disabled:bg-gray-600 disabled:cursor-not-allowed"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4" fill="currentColor" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" fill="currentColor" />
            )}
          </button>

          <button
            onClick={onNext}
            disabled={disabled}
            className="p-1.5 text-gray-300 hover:text-white transition-colors
                       disabled:text-gray-600 disabled:cursor-not-allowed"
            aria-label="Next track"
          >
            <SkipForward className="w-4 h-4" fill="currentColor" />
          </button>
        </div>

        {/* Volume control */}
        <div className="flex items-center gap-2 group">
          <button
            onClick={() => onVolumeChange(volume === 0 ? 80 : 0)}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            aria-label={volume === 0 ? 'Unmute' : 'Mute'}
          >
            <VolumeIcon className="w-4 h-4" />
          </button>
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={handleVolume}
            className="w-20 h-1 bg-gray-600 rounded-full appearance-none cursor-pointer
                       [&::-webkit-slider-thumb]:appearance-none
                       [&::-webkit-slider-thumb]:w-0
                       [&::-webkit-slider-thumb]:h-0
                       [&::-webkit-slider-thumb]:opacity-0
                       group-hover:[&::-webkit-slider-thumb]:w-2.5
                       group-hover:[&::-webkit-slider-thumb]:h-2.5
                       group-hover:[&::-webkit-slider-thumb]:opacity-100
                       [&::-webkit-slider-thumb]:bg-white
                       [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:transition-all
                       [&::-webkit-slider-thumb]:duration-150"
            style={{
              background: `linear-gradient(to right, #9ca3af ${volume}%, #4b5563 ${volume}%)`,
            }}
            aria-label="Volume"
          />
        </div>
      </div>
    </div>
  );
};
