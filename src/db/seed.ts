import type { Track } from '../types'
import { useLibraryStore } from '../store/libraryStore'
import { usePlaylistStore } from '../store/playlistStore'
import { readDuration } from '../utils/audio'

const DEFAULT_PLAYLIST_NAME = 'Royalty Free Songs'

const DEFAULT_TRACKS = [
  { url: '/audio/well-sames.mp3', name: 'Well - Sames' },
  { url: '/audio/mind-sames.mp3', name: 'Mind - Sames' },
]

let seedPromise: Promise<void> | null = null

export function seedDefaultPlaylist(): Promise<void> {
  if (!seedPromise) {
    seedPromise = runSeed()
  }
  return seedPromise
}

async function runSeed(): Promise<void> {
  await useLibraryStore.getState().init()
  await usePlaylistStore.getState().init()

  const alreadySeeded = usePlaylistStore.getState().playlists.some((p) => p.name === DEFAULT_PLAYLIST_NAME)
  if (alreadySeeded) return

  const trackIds: string[] = []
  for (const def of DEFAULT_TRACKS) {
    try {
      const response = await fetch(def.url)
      if (!response.ok) continue
      const blob = await response.blob()
      const duration = await readDuration(blob)
      const track: Track = {
        id: crypto.randomUUID(),
        name: def.name,
        blob,
        mimeType: blob.type || 'audio/mpeg',
        duration,
        bpm: null,
        favorite: false,
        addedAt: Date.now(),
      }
      await useLibraryStore.getState().addTrack(track)
      trackIds.push(track.id)
    } catch {
      // Skip a track that fails to fetch/decode rather than blocking the rest of the app.
    }
  }

  if (trackIds.length === 0) return

  const playlist = await usePlaylistStore.getState().createPlaylist(DEFAULT_PLAYLIST_NAME)
  for (const id of trackIds) {
    await usePlaylistStore.getState().addTrack(playlist.id, id)
  }
}
