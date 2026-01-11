/**
 * useYouTubePlayer Hook
 * 
 * Manages the YouTube IFrame Player API integration.
 * Provides a clean interface for controlling video playback.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { YouTubePlayer, PlayerState, UseYouTubePlayerReturn } from '../types';

// Extend Window interface to include YouTube IFrame API
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        config: {
          height?: string | number;
          width?: string | number;
          videoId?: string;
          playerVars?: Record<string, number | string>;
          events?: {
            onReady?: (event: { target: YouTubePlayer }) => void;
            onStateChange?: (event: { data: PlayerState; target: YouTubePlayer }) => void;
            onError?: (event: { data: number }) => void;
          };
        }
      ) => YouTubePlayer;
      PlayerState: typeof PlayerState;
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

// Flag to track if API is loaded
let isAPILoaded = false;
let apiLoadCallbacks: (() => void)[] = [];

/**
 * Loads the YouTube IFrame API script
 */
function loadYouTubeAPI(): Promise<void> {
  return new Promise((resolve) => {
    // If API is already loaded, resolve immediately
    if (isAPILoaded && window.YT?.Player) {
      resolve();
      return;
    }

    // Add callback to queue
    apiLoadCallbacks.push(resolve);

    // If script is already being loaded, just wait
    if (document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      return;
    }

    // Create and load the script
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.async = true;

    // Set up the callback
    window.onYouTubeIframeAPIReady = () => {
      isAPILoaded = true;
      apiLoadCallbacks.forEach((cb) => cb());
      apiLoadCallbacks = [];
    };

    document.head.appendChild(script);
  });
}

/**
 * Custom hook for YouTube IFrame Player
 * 
 * @param containerId - ID of the DOM element to embed the player
 * @param onTrackEnd - Callback when track ends
 * @returns Player state and control functions
 */
export function useYouTubePlayer(
  containerId: string,
  onTrackEnd?: () => void
): UseYouTubePlayerReturn {
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(80);
  const timeUpdateRef = useRef<number | null>(null);
  const pendingVideoRef = useRef<string | null>(null);
  const onTrackEndRef = useRef(onTrackEnd);
  const volumeRef = useRef(volume);

  // Keep refs up to date
  useEffect(() => {
    onTrackEndRef.current = onTrackEnd;
  }, [onTrackEnd]);

  useEffect(() => {
    volumeRef.current = volume;
  }, [volume]);

  // Initialize YouTube API and create player
  useEffect(() => {
    let isMounted = true;

    const initPlayer = async () => {
      await loadYouTubeAPI();

      if (!isMounted) return;

      // Check if container exists
      const container = document.getElementById(containerId);
      if (!container) {
        console.error(`Container with id "${containerId}" not found`);
        return;
      }

      // Create player instance
      playerRef.current = new window.YT.Player(containerId, {
        height: '0',
        width: '0',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          enablejsapi: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          playsinline: 1,
          rel: 0,
        },
        events: {
          onReady: (event) => {
            if (!isMounted) return;
            setIsReady(true);
            event.target.setVolume(volumeRef.current);

            // Load pending video if any
            if (pendingVideoRef.current) {
              event.target.loadVideoById(pendingVideoRef.current);
              pendingVideoRef.current = null;
            }
          },
          onStateChange: (event) => {
            if (!isMounted) return;

            switch (event.data) {
              case PlayerState.PLAYING:
                setIsPlaying(true);
                setDuration(event.target.getDuration());
                // Start time update interval
                if (timeUpdateRef.current) {
                  clearInterval(timeUpdateRef.current);
                }
                timeUpdateRef.current = window.setInterval(() => {
                  if (playerRef.current) {
                    try {
                      setCurrentTime(playerRef.current.getCurrentTime());
                    } catch {
                      // Player might be in invalid state
                    }
                  }
                }, 250);
                break;
              case PlayerState.PAUSED:
                setIsPlaying(false);
                if (timeUpdateRef.current) {
                  clearInterval(timeUpdateRef.current);
                  timeUpdateRef.current = null;
                }
                break;
              case PlayerState.ENDED:
                setIsPlaying(false);
                if (timeUpdateRef.current) {
                  clearInterval(timeUpdateRef.current);
                  timeUpdateRef.current = null;
                }
                onTrackEndRef.current?.();
                break;
              case PlayerState.BUFFERING:
                // Could add loading state here
                break;
            }
          },
          onError: (event) => {
            console.error('YouTube Player Error:', event.data);
            setIsPlaying(false);
          },
        },
      });
    };

    initPlayer();

    return () => {
      isMounted = false;
      if (timeUpdateRef.current) {
        clearInterval(timeUpdateRef.current);
        timeUpdateRef.current = null;
      }
      if (playerRef.current) {
        try {
          playerRef.current.destroy();
        } catch {
          // Player might already be destroyed
        }
        playerRef.current = null;
      }
    };
  }, [containerId]);

  // Playback controls
  const play = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.playVideo();
    }
  }, [isReady]);

  const pause = useCallback(() => {
    if (playerRef.current && isReady) {
      playerRef.current.pauseVideo();
    }
  }, [isReady]);

  const togglePlay = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const seek = useCallback(
    (time: number) => {
      if (playerRef.current && isReady) {
        playerRef.current.seekTo(time, true);
        setCurrentTime(time);
      }
    },
    [isReady]
  );

  const setVolume = useCallback(
    (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(100, newVolume));
      setVolumeState(clampedVolume);
      if (playerRef.current && isReady) {
        playerRef.current.setVolume(clampedVolume);
      }
    },
    [isReady]
  );

  const loadVideo = useCallback(
    (videoId: string) => {
      if (playerRef.current && isReady) {
        playerRef.current.loadVideoById(videoId);
        setCurrentTime(0);
        setDuration(0);
      } else {
        // Store for later when player is ready
        pendingVideoRef.current = videoId;
      }
    },
    [isReady]
  );

  return {
    isPlaying,
    isReady,
    currentTime,
    duration,
    volume,
    play,
    pause,
    togglePlay,
    seek,
    setVolume,
    loadVideo,
  };
}
