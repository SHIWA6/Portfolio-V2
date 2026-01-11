/**
 * usePlaylist Hook
 * 
 * Manages the playlist state including adding, removing, and navigating tracks.
 * Persists playlist to localStorage for data persistence across sessions.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Track, UsePlaylistReturn } from '../types';
import { createTrackFromUrl, extractVideoId } from '../utils';
import { defaultYouTubeUrls } from '../data/defaultSongs';

const STORAGE_KEY = 'youtube-music-playlist';
const DEFAULTS_LOADED_KEY = 'youtube-music-defaults-loaded';

/**
 * Custom hook for managing the music playlist
 * 
 * Features:
 * - Add tracks from YouTube URLs
 * - Remove tracks from playlist
 * - Navigate between tracks
 * - Persist to localStorage
 * - Prevent duplicate tracks
 * 
 * @returns Playlist state and control functions
 */
export function usePlaylist(): UsePlaylistReturn {
  const [playlist, setPlaylist] = useState<Track[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);

  // Load playlist from localStorage on mount
  useEffect(() => {
    const loadPlaylist = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        const defaultsLoaded = localStorage.getItem(DEFAULTS_LOADED_KEY);
        
        if (stored) {
          // Load existing playlist from localStorage
          const parsed = JSON.parse(stored) as Track[];
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPlaylist(parsed);
            setCurrentIndex(0);
          }
        } else if (!defaultsLoaded) {
          // First time user - load default songs
          setIsLoading(true);
          const defaultTracks: Track[] = [];
          const loadedVideoIds = new Set<string>();
          
          for (const url of defaultYouTubeUrls) {
            try {
              // Skip duplicate URLs (same video ID)
              const videoId = extractVideoId(url);
              if (videoId && loadedVideoIds.has(videoId)) {
                console.warn('Skipping duplicate song:', url);
                continue;
              }
              
              const result = await createTrackFromUrl(url);
              if (result.success && result.data) {
                loadedVideoIds.add(result.data.videoId);
                defaultTracks.push(result.data);
              }
            } catch (error) {
              console.error('Failed to load default song:', url, error);
            }
          }
          
          if (defaultTracks.length > 0) {
            setPlaylist(defaultTracks);
            setCurrentIndex(0);
            // Mark that defaults have been loaded
            localStorage.setItem(DEFAULTS_LOADED_KEY, 'true');
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load playlist from localStorage:', error);
      } finally {
        setIsInitialized(true);
      }
    };
    
    loadPlaylist();
  }, []);

  // Persist playlist to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(playlist));
      } catch (error) {
        console.error('Failed to save playlist to localStorage:', error);
      }
    }
  }, [playlist, isInitialized]);

  // Current track derived from playlist and index
  const currentTrack = useMemo(() => {
    if (currentIndex >= 0 && currentIndex < playlist.length) {
      return playlist[currentIndex];
    }
    return null;
  }, [playlist, currentIndex]);

  /**
   * Adds a new track to the playlist from a YouTube URL
   * Automatically plays the newly added track
   */
  const addTrack = useCallback(
    async (url: string): Promise<{ success: boolean; error?: string }> => {
      // Check for duplicate before making API call
      const videoId = extractVideoId(url);
      if (!videoId) {
        return { success: false, error: 'Please enter a valid YouTube URL' };
      }

      const isDuplicate = playlist.some((track) => track.videoId === videoId);
      if (isDuplicate) {
        return { success: false, error: 'This song is already in your playlist' };
      }

      setIsLoading(true);

      try {
        const result = await createTrackFromUrl(url);

        if (!result.success || !result.data) {
          return { success: false, error: result.message };
        }

        const newTrack = result.data;

        setPlaylist((prev) => {
          const newPlaylist = [...prev, newTrack];
          // Set current index to the new track
          setCurrentIndex(newPlaylist.length - 1);
          return newPlaylist;
        });

        return { success: true };
      } catch (error) {
        console.error('Failed to add track:', error);
        return { success: false, error: 'An unexpected error occurred' };
      } finally {
        setIsLoading(false);
      }
    },
    [playlist]
  );

  /**
   * Removes a track from the playlist by video ID
   */
  const removeTrack = useCallback(
    (videoId: string) => {
      setPlaylist((prev) => {
        const index = prev.findIndex((track) => track.videoId === videoId);
        if (index === -1) return prev;

        const newPlaylist = prev.filter((track) => track.videoId !== videoId);

        // Adjust current index if necessary
        if (newPlaylist.length === 0) {
          setCurrentIndex(-1);
        } else if (index < currentIndex) {
          setCurrentIndex((curr) => curr - 1);
        } else if (index === currentIndex) {
          // If we removed the current track, play the next one or previous
          setCurrentIndex((curr) => Math.min(curr, newPlaylist.length - 1));
        }

        return newPlaylist;
      });
    },
    [currentIndex]
  );

  /**
   * Plays a specific track by index
   */
  const playTrack = useCallback(
    (index: number) => {
      if (index >= 0 && index < playlist.length) {
        setCurrentIndex(index);
      }
    },
    [playlist.length]
  );

  /**
   * Advances to the next track
   * Loops back to the start if at the end
   */
  const nextTrack = useCallback(() => {
    if (playlist.length === 0) return;

    setCurrentIndex((curr) => {
      if (curr < playlist.length - 1) {
        return curr + 1;
      }
      // Loop back to start
      return 0;
    });
  }, [playlist.length]);

  /**
   * Goes to the previous track
   * Loops to the end if at the start
   */
  const previousTrack = useCallback(() => {
    if (playlist.length === 0) return;

    setCurrentIndex((curr) => {
      if (curr > 0) {
        return curr - 1;
      }
      // Loop to end
      return playlist.length - 1;
    });
  }, [playlist.length]);

  /**
   * Clears the entire playlist
   */
  const clearPlaylist = useCallback(() => {
    setPlaylist([]);
    setCurrentIndex(-1);
  }, []);

  /**
   * Resets playlist to default songs
   */
  const resetToDefaults = useCallback(async () => {
    setIsLoading(true);
    const defaultTracks: Track[] = [];
    const loadedVideoIds = new Set<string>();
    
    try {
      for (const url of defaultYouTubeUrls) {
        try {
          // Skip duplicate URLs (same video ID)
          const videoId = extractVideoId(url);
          if (videoId && loadedVideoIds.has(videoId)) {
            console.warn('Skipping duplicate song:', url);
            continue;
          }
          
          const result = await createTrackFromUrl(url);
          if (result.success && result.data) {
            loadedVideoIds.add(result.data.videoId);
            defaultTracks.push(result.data);
          }
        } catch (error) {
          console.error('Failed to load default song:', url, error);
        }
      }
      
      if (defaultTracks.length > 0) {
        setPlaylist(defaultTracks);
        setCurrentIndex(0);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    playlist,
    currentTrack,
    currentIndex,
    addTrack,
    removeTrack,
    playTrack,
    nextTrack,
    previousTrack,
    clearPlaylist,
    resetToDefaults,
    isLoading,
  };
}
