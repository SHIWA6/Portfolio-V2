/**
 * Playlist Component
 * 
 * Displays the list of tracks in the playlist with hover effects
 * and click-to-play functionality. Styled like Spotify/Apple Music.
 */

import React from 'react';
import { Music, X, Play } from 'lucide-react';
import { Track } from '../types';
import { truncateText } from '../utils';

interface PlaylistProps {
  tracks: Track[];
  currentIndex: number;
  onPlay: (index: number) => void;
  onRemove: (videoId: string) => void;
}

/**
 * Individual playlist item component
 */
const PlaylistItem: React.FC<{
  track: Track;
  index: number;
  isPlaying: boolean;
  onPlay: () => void;
  onRemove: () => void;
}> = ({ track, index, isPlaying, onPlay, onRemove }) => {
  return (
    <div
      className={`group flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all duration-200
                  ${isPlaying 
                    ? 'bg-white/10 border border-green-500/30' 
                    : 'hover:bg-white/5 border border-transparent'}`}
      onClick={onPlay}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onPlay()}
    >
      {/* Index / Play indicator */}
      <div className="w-6 flex items-center justify-center shrink-0">
        {isPlaying ? (
          <div className="flex items-center gap-0.5">
            <span className="w-0.5 h-3 bg-green-500 rounded-full animate-pulse" />
            <span className="w-0.5 h-4 bg-green-500 rounded-full animate-pulse delay-75" />
            <span className="w-0.5 h-2 bg-green-500 rounded-full animate-pulse delay-150" />
          </div>
        ) : (
          <>
            <span className="text-xs text-gray-500 group-hover:hidden">
              {index + 1}
            </span>
            <Play className="w-3 h-3 text-white hidden group-hover:block" fill="white" />
          </>
        )}
      </div>

      {/* Thumbnail */}
      <div className="w-10 h-10 rounded overflow-hidden shrink-0 bg-gray-800">
        {track.thumbnail ? (
          <img
            src={track.thumbnail}
            alt={track.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to medium quality if maxres fails
              const target = e.target as HTMLImageElement;
              if (target.src.includes('maxresdefault')) {
                target.src = track.thumbnail.replace('maxresdefault', 'mqdefault');
              }
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Music className="w-5 h-5 text-gray-600" />
          </div>
        )}
      </div>

      {/* Track info */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium truncate
                      ${isPlaying ? 'text-green-400' : 'text-white'}`}>
          {truncateText(track.title, 40)}
        </p>
        <p className="text-xs text-gray-400 truncate">
          {truncateText(track.artist, 30)}
        </p>
      </div>

      {/* Remove button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="p-1.5 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100
                   transition-opacity rounded-full hover:bg-white/10"
        aria-label={`Remove ${track.title}`}
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

/**
 * Playlist component that displays all tracks
 */
export const Playlist: React.FC<PlaylistProps> = ({
  tracks,
  currentIndex,
  onPlay,
  onRemove,
}) => {
  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4">
          <Music className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="text-lg font-semibold text-gray-300 mb-2">
          Your playlist is empty
        </h3>
        <p className="text-sm text-gray-500 max-w-xs">
          Add songs by pasting a YouTube URL above. Your playlist will be saved automatically.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header - fixed */}
      <div className="shrink-0 flex items-center justify-between px-3 py-2 border-b border-white/10">
        <h3 className="text-sm font-semibold text-gray-300">
          Playlist
        </h3>
        <span className="text-xs text-gray-500">
          {tracks.length} {tracks.length === 1 ? 'song' : 'songs'}
        </span>
      </div>

      {/* Track list - scrollable */}
      <div 
        className="flex-1 min-h-0 p-2 space-y-1"
        style={{
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
        }}
      >
        {tracks.map((track, index) => (
          <PlaylistItem
            key={track.videoId}
            track={track}
            index={index}
            isPlaying={index === currentIndex}
            onPlay={() => onPlay(index)}
            onRemove={() => onRemove(track.videoId)}
          />
        ))}
      </div>
    </div>
  );
};
