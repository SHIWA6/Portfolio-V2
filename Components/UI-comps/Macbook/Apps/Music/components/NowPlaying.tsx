/**
 * NowPlaying Component
 * 
 * Displays the currently playing track with large album art,
 * title, and artist. Styled with a premium, Spotify-like aesthetic.
 */

import React from 'react';
import { Music, ExternalLink } from 'lucide-react';
import { Track } from '../types';

interface NowPlayingProps {
  track: Track | null;
  isPlaying: boolean;
}

/**
 * Now Playing display component
 * Shows current track info or empty state
 */
export const NowPlaying: React.FC<NowPlayingProps> = ({ track, isPlaying }) => {
  if (!track) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6">
        <div className="w-48 h-48 rounded-xl bg-gradient-to-br from-gray-800 to-gray-900 
                        flex items-center justify-center shadow-2xl mb-6">
          <Music className="w-20 h-20 text-gray-700" />
        </div>
        <h2 className="text-xl font-bold text-gray-400">
          No track playing
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Add a song to get started
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      {/* Album art with glow effect */}
      <div className="relative group">
        {/* Glow background */}
        <div 
          className={`absolute inset-0 rounded-xl blur-2xl opacity-50 transition-opacity duration-500
                      ${isPlaying ? 'opacity-60' : 'opacity-30'}`}
          style={{
            backgroundImage: `url(${track.thumbnail})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        {/* Album art */}
        <div className={`relative w-48 h-48 rounded-xl overflow-hidden shadow-2xl
                        bg-gray-800 transition-transform duration-300
                        ${isPlaying ? 'scale-100' : 'scale-95'}`}>
          {track.thumbnail ? (
            <img
              src={track.thumbnail}
              alt={track.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.src.includes('maxresdefault')) {
                  target.src = track.thumbnail.replace('maxresdefault', 'mqdefault');
                }
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-16 h-16 text-gray-600" />
            </div>
          )}
          
          {/* Playing indicator overlay */}
          {isPlaying && (
            <div className="absolute bottom-2 right-2 flex items-center gap-0.5 p-1.5 
                           bg-black/60 rounded-full backdrop-blur-sm">
              <span className="w-0.5 h-2 bg-green-500 rounded-full animate-bounce" 
                    style={{ animationDelay: '0ms' }} />
              <span className="w-0.5 h-3 bg-green-500 rounded-full animate-bounce" 
                    style={{ animationDelay: '150ms' }} />
              <span className="w-0.5 h-2 bg-green-500 rounded-full animate-bounce" 
                    style={{ animationDelay: '300ms' }} />
            </div>
          )}
        </div>
      </div>

      {/* Track info */}
      <div className="mt-6 text-center max-w-full px-4">
        <h2 className="text-lg font-bold text-white truncate max-w-xs">
          {track.title}
        </h2>
        <p className="text-sm text-gray-400 mt-1 truncate max-w-xs">
          {track.artist}
        </p>
      </div>

      {/* YouTube link */}
      <a
        href={track.originalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300
                   transition-colors"
      >
        <span>Open on YouTube</span>
        <ExternalLink className="w-3 h-3" />
      </a>
    </div>
  );
};
