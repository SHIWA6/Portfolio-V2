/**
 * AddSongInput Component
 * 
 * Input field for adding YouTube URLs to the playlist.
 * Includes loading state and error handling.
 */

import React, { useState, useCallback, useRef } from 'react';
import { Plus, Loader2, Link, AlertCircle } from 'lucide-react';

interface AddSongInputProps {
  onAdd: (url: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

/**
 * Input component for adding songs via YouTube URL
 */
export const AddSongInput: React.FC<AddSongInputProps> = ({ onAdd, isLoading }) => {
  const [url, setUrl] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle form submission
  const handleSubmit = useCallback(
    async (e?: React.FormEvent) => {
      e?.preventDefault();
      
      const trimmedUrl = url.trim();
      if (!trimmedUrl) {
        setError('Please enter a YouTube URL');
        return;
      }

      setError(null);
      const result = await onAdd(trimmedUrl);

      if (result.success) {
        setUrl('');
        inputRef.current?.focus();
      } else {
        setError(result.error || 'Failed to add song');
      }
    },
    [url, onAdd]
  );

  // Handle input change
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value);
    if (error) setError(null);
  }, [error]);

  // Handle key down for Enter
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !isLoading) {
        handleSubmit();
      }
    },
    [handleSubmit, isLoading]
  );

  return (
    <div className="p-3 border-b border-white/10">
      <form onSubmit={handleSubmit} className="flex gap-2">
        {/* Input with icon */}
        <div className="relative flex-1">
          <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            ref={inputRef}
            type="text"
            value={url}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Paste YouTube URL..."
            disabled={isLoading}
            className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg
                       text-sm text-white placeholder-gray-500
                       focus:outline-none focus:border-green-500/50 focus:ring-1 focus:ring-green-500/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all"
          />
        </div>

        {/* Add button */}
        <button
          type="submit"
          disabled={isLoading || !url.trim()}
          className="px-4 py-2 bg-green-600 hover:bg-green-500 rounded-lg
                     text-white text-sm font-medium
                     disabled:bg-gray-700 disabled:cursor-not-allowed
                     transition-colors flex items-center gap-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="hidden sm:inline">Adding...</span>
            </>
          ) : (
            <>
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </>
          )}
        </button>
      </form>

      {/* Error message */}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-400 text-xs">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Hint */}
      <p className="mt-2 text-[10px] text-gray-600">
        Supports: youtube.com/watch, youtu.be, youtube.com/shorts
      </p>
    </div>
  );
};
