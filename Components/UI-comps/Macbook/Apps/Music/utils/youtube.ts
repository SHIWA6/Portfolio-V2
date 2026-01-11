/**
 * YouTube URL Utilities
 * 
 * This module provides utilities for extracting video IDs from various
 * YouTube URL formats and fetching video metadata using the oEmbed API.
 */

import { YouTubeOEmbedResponse, Track, OperationResult } from '../types';

/**
 * Regular expressions for different YouTube URL formats
 * Supports: standard watch URLs, short URLs, embed URLs, and mobile URLs
 */
const YOUTUBE_URL_PATTERNS = [
  // Standard: https://www.youtube.com/watch?v=VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
  // Short: https://youtu.be/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
  // Embed: https://www.youtube.com/embed/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/,
  // Mobile: https://m.youtube.com/watch?v=VIDEO_ID
  /(?:https?:\/\/)?m\.youtube\.com\/watch\?(?:.*&)?v=([a-zA-Z0-9_-]{11})/,
  // Shorts: https://www.youtube.com/shorts/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/,
  // Live: https://www.youtube.com/live/VIDEO_ID
  /(?:https?:\/\/)?(?:www\.)?youtube\.com\/live\/([a-zA-Z0-9_-]{11})/,
  // Just the video ID (11 characters)
  /^([a-zA-Z0-9_-]{11})$/,
];

/**
 * Extracts the YouTube video ID from various URL formats
 * 
 * @param url - The YouTube URL or video ID
 * @returns The video ID or null if invalid
 * 
 * @example
 * extractVideoId('https://www.youtube.com/watch?v=dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
 * extractVideoId('https://youtu.be/dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
 * extractVideoId('dQw4w9WgXcQ') // 'dQw4w9WgXcQ'
 */
export function extractVideoId(url: string): string | null {
  if (!url || typeof url !== 'string') {
    return null;
  }

  const trimmedUrl = url.trim();

  for (const pattern of YOUTUBE_URL_PATTERNS) {
    const match = trimmedUrl.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Validates if a string is a valid YouTube video ID
 * 
 * @param videoId - The video ID to validate
 * @returns True if valid, false otherwise
 */
export function isValidVideoId(videoId: string): boolean {
  return /^[a-zA-Z0-9_-]{11}$/.test(videoId);
}

/**
 * Validates if a string is a valid YouTube URL
 * 
 * @param url - The URL to validate
 * @returns True if valid YouTube URL, false otherwise
 */
export function isValidYouTubeUrl(url: string): boolean {
  return extractVideoId(url) !== null;
}

/**
 * Fetches video metadata from YouTube oEmbed API
 * This method doesn't require an API key
 * 
 * @param videoId - The YouTube video ID
 * @returns Promise with the oEmbed response
 */
export async function fetchVideoMetadata(
  videoId: string
): Promise<OperationResult<YouTubeOEmbedResponse>> {
  if (!isValidVideoId(videoId)) {
    return {
      success: false,
      error: 'INVALID_URL',
      message: 'Invalid video ID provided',
    };
  }

  const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

  try {
    const response = await fetch(oEmbedUrl);

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'FETCH_FAILED',
          message: 'Video not found or is private',
        };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: YouTubeOEmbedResponse = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error('Failed to fetch video metadata:', error);
    return {
      success: false,
      error: 'NETWORK_ERROR',
      message: 'Failed to fetch video information. Please check your connection.',
    };
  }
}

/**
 * Creates a Track object from a YouTube URL
 * Fetches metadata and constructs the full track data
 * 
 * @param url - The YouTube URL
 * @returns Promise with the Track or error
 */
export async function createTrackFromUrl(url: string): Promise<OperationResult<Track>> {
  const videoId = extractVideoId(url);

  if (!videoId) {
    return {
      success: false,
      error: 'INVALID_URL',
      message: 'Please enter a valid YouTube URL',
    };
  }

  const metadataResult = await fetchVideoMetadata(videoId);

  if (!metadataResult.success || !metadataResult.data) {
    return {
      success: false,
      error: metadataResult.error || 'FETCH_FAILED',
      message: metadataResult.message || 'Failed to fetch video information',
    };
  }

  const { title, author_name } = metadataResult.data;

  // Get higher quality thumbnail if available
  const highQualityThumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  const track: Track = {
    videoId,
    title,
    artist: author_name,
    thumbnail: highQualityThumbnail,
    originalUrl: url,
    addedAt: Date.now(),
  };

  return {
    success: true,
    data: track,
  };
}

/**
 * Generates different quality thumbnail URLs for a video
 * 
 * @param videoId - The YouTube video ID
 * @returns Object with different quality thumbnail URLs
 */
export function getThumbnailUrls(videoId: string) {
  return {
    default: `https://img.youtube.com/vi/${videoId}/default.jpg`,        // 120x90
    medium: `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`,       // 320x180
    high: `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`,         // 480x360
    standard: `https://img.youtube.com/vi/${videoId}/sddefault.jpg`,     // 640x480
    maxres: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,   // 1280x720
  };
}

/**
 * Formats duration from seconds to MM:SS format
 * 
 * @param seconds - Duration in seconds
 * @returns Formatted time string
 */
export function formatDuration(seconds: number): string {
  if (!seconds || isNaN(seconds)) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Truncates text with ellipsis if too long
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated text
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
