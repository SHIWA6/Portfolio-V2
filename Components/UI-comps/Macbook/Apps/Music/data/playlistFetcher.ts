/**
 * YouTube Playlist Fetcher
 * 
 * Extracts all video URLs from a YouTube playlist link.
 * Note: For production use, you'll need a YouTube Data API key.
 */

// Extract playlist ID from various YouTube playlist URL formats
export function extractPlaylistId(url: string): string | null {
  const patterns = [
    /[?&]list=([^&]+)/,
    /playlist\?list=([^&]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

// Fetch all video URLs from a playlist using YouTube Data API
export async function fetchPlaylistVideos(
  playlistUrl: string,
  apiKey: string
): Promise<string[]> {
  const playlistId = extractPlaylistId(playlistUrl);
  if (!playlistId) {
    throw new Error('Invalid playlist URL');
  }

  const videos: string[] = [];
  let nextPageToken = '';

  do {
    const apiUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${apiKey}${nextPageToken ? `&pageToken=${nextPageToken}` : ''}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    for (const item of data.items) {
      const videoId = item.contentDetails.videoId;
      videos.push(`https://youtu.be/${videoId}`);
    }

    nextPageToken = data.nextPageToken || '';
  } while (nextPageToken);

  return videos;
}

// Alternative: Extract video IDs from playlist page HTML (no API key needed)
// This is less reliable but works without an API key
export async function fetchPlaylistVideosNoApi(playlistUrl: string): Promise<string[]> {
  const playlistId = extractPlaylistId(playlistUrl);
  if (!playlistId) {
    throw new Error('Invalid playlist URL');
  }

  // Use a CORS proxy or server-side fetch for this
  const response = await fetch(`https://www.youtube.com/playlist?list=${playlistId}`);
  const html = await response.text();
  
  // Extract video IDs from the HTML
  const videoIdPattern = /"videoId":"([a-zA-Z0-9_-]{11})"/g;
  const videoIds = new Set<string>();
  let match;

  while ((match = videoIdPattern.exec(html)) !== null) {
    videoIds.add(match[1]);
  }

  return Array.from(videoIds).map(id => `https://youtu.be/${id}`);
}

// Example usage:
// const API_KEY = 'your-youtube-api-key';
// const playlistUrl = 'https://www.youtube.com/playlist?list=PLxxxxxxxx';
// const songs = await fetchPlaylistVideos(playlistUrl, API_KEY);
