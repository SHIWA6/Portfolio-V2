# Music Player - Default Songs Setup

## Overview

This music player now includes 10 default songs that are automatically loaded when a user opens the app for the first time. Users can still add their own songs and manage the playlist as before.

## How to Add Your Default Songs

1. Open the file: `Components/UI-comps/Macbook/Apps/Music/data/defaultSongs.ts`

2. Replace the placeholder URLs with your preferred YouTube URLs:

```typescript
export const defaultYouTubeUrls: string[] = [
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_1',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_2',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_3',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_4',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_5',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_6',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_7',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_8',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_9',
  'https://www.youtube.com/watch?v=YOUR_VIDEO_ID_10',
];
```

3. Supported URL formats:
   - `https://www.youtube.com/watch?v=VIDEO_ID`
   - `https://youtu.be/VIDEO_ID`
   - `https://www.youtube.com/shorts/VIDEO_ID`

## Features

### First-Time User Experience
- When a user visits the music player for the first time (no saved playlist in localStorage), the app automatically loads all 10 default songs
- Songs are fetched from YouTube and added to the playlist
- The first song starts playing automatically

### Returning Users
- Users who already have a saved playlist will see their existing songs
- Default songs are NOT loaded for returning users (preserves their custom playlist)

### Reset to Defaults Button
- A "Reset to Default Songs" button is available in the playlist panel
- Clicking this button will:
  - Clear the current playlist
  - Reload all 10 default songs
  - Start playing the first song
- Useful if users want to restore the original default playlist

### Adding Custom Songs
- Users can add any YouTube URL to the playlist
- Custom songs are mixed with default songs
- All songs are saved to localStorage
- Duplicate detection prevents the same song from being added twice

## Technical Details

### Files Modified/Created
1. **`data/defaultSongs.ts`** (NEW)
   - Contains the array of 10 default YouTube URLs
   - Easy to modify - just paste your URLs

2. **`hooks/usePlaylist.ts`** (UPDATED)
   - Added logic to load default songs on first initialization
   - Added `resetToDefaults()` function
   - Uses localStorage key `youtube-music-defaults-loaded` to track initialization

3. **`components/AddSongInput.tsx`** (UPDATED)
   - Added "Reset to Default Songs" button
   - New prop: `onResetToDefaults`

4. **`MusicApp.tsx`** (UPDATED)
   - Passes `resetToDefaults` function to AddSongInput component

5. **`types/index.ts`** (UPDATED)
   - Added `resetToDefaults` to `UsePlaylistReturn` interface

### How It Works
1. On app mount, `usePlaylist` checks localStorage for existing playlist
2. If no playlist exists AND defaults haven't been loaded before:
   - Fetches metadata for all 10 default URLs from YouTube
   - Creates Track objects with title, artist, thumbnail
   - Saves to playlist state and localStorage
   - Marks defaults as loaded (prevents re-loading on next visit)
3. If user clicks "Reset to Defaults":
   - Fetches fresh data for all default songs
   - Replaces current playlist
   - Sets first song as current

## Testing

To test the default songs feature:

1. **First Time User Test:**
   - Clear localStorage: `localStorage.clear()` in browser console
   - Refresh the page
   - Default songs should load automatically

2. **Reset Feature Test:**
   - Add some custom songs
   - Click "Reset to Default Songs"
   - Playlist should revert to the 10 defaults

3. **Persistence Test:**
   - Load the app with defaults
   - Add/remove songs
   - Refresh the page
   - Your custom playlist should persist (defaults don't reload)
