/**
 * YouTube Music Player Type Definitions
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the music player system for type safety and IntelliSense support.
 */

/**
 * Represents a single track in the playlist
 * Contains all metadata fetched from YouTube oEmbed API
 */
export interface Track {
  /** Unique YouTube video ID (11 characters) */
  videoId: string;
  /** Video title from YouTube */
  title: string;
  /** Channel/artist name from YouTube */
  artist: string;
  /** Thumbnail URL (high quality) */
  thumbnail: string;
  /** Original YouTube URL provided by user */
  originalUrl: string;
  /** Timestamp when track was added */
  addedAt: number;
}

/**
 * YouTube oEmbed API response structure
 * Used for fetching video metadata without API key
 */
export interface YouTubeOEmbedResponse {
  title: string;
  author_name: string;
  author_url: string;
  type: string;
  height: number;
  width: number;
  version: string;
  provider_name: string;
  provider_url: string;
  thumbnail_height: number;
  thumbnail_width: number;
  thumbnail_url: string;
  html: string;
}

/**
 * Player state for the YouTube IFrame API
 */
export enum PlayerState {
  UNSTARTED = -1,
  ENDED = 0,
  PLAYING = 1,
  PAUSED = 2,
  BUFFERING = 3,
  CUED = 5,
}

/**
 * YouTube IFrame Player instance interface
 * Subset of the full YT.Player API we use
 */
export interface YouTubePlayer {
  playVideo: () => void;
  pauseVideo: () => void;
  stopVideo: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  setVolume: (volume: number) => void;
  getVolume: () => number;
  mute: () => void;
  unMute: () => void;
  isMuted: () => boolean;
  getPlayerState: () => PlayerState;
  getCurrentTime: () => number;
  getDuration: () => number;
  getVideoUrl: () => string;
  loadVideoById: (videoId: string, startSeconds?: number) => void;
  cueVideoById: (videoId: string, startSeconds?: number) => void;
  destroy: () => void;
}

/**
 * Configuration for the YouTube IFrame Player
 */
export interface PlayerConfig {
  height: string | number;
  width: string | number;
  videoId?: string;
  playerVars?: {
    autoplay?: 0 | 1;
    controls?: 0 | 1;
    disablekb?: 0 | 1;
    enablejsapi?: 0 | 1;
    fs?: 0 | 1;
    iv_load_policy?: 1 | 3;
    loop?: 0 | 1;
    modestbranding?: 0 | 1;
    origin?: string;
    playsinline?: 0 | 1;
    rel?: 0 | 1;
    showinfo?: 0 | 1;
  };
  events?: {
    onReady?: (event: { target: YouTubePlayer }) => void;
    onStateChange?: (event: { data: PlayerState; target: YouTubePlayer }) => void;
    onError?: (event: { data: number }) => void;
  };
}

/**
 * Playlist hook return type
 */
export interface UsePlaylistReturn {
  playlist: Track[];
  currentTrack: Track | null;
  currentIndex: number;
  addTrack: (url: string) => Promise<{ success: boolean; error?: string }>;
  removeTrack: (videoId: string) => void;
  playTrack: (index: number) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  clearPlaylist: () => void;
  isLoading: boolean;
}

/**
 * YouTube Player hook return type
 */
export interface UseYouTubePlayerReturn {
  isPlaying: boolean;
  isReady: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  loadVideo: (videoId: string) => void;
}

/**
 * Error types for the music player
 */
export type MusicPlayerError =
  | 'INVALID_URL'
  | 'DUPLICATE_TRACK'
  | 'FETCH_FAILED'
  | 'PLAYER_ERROR'
  | 'NETWORK_ERROR';

/**
 * Result type for operations that can fail
 */
export interface OperationResult<T = void> {
  success: boolean;
  data?: T;
  error?: MusicPlayerError;
  message?: string;
}
