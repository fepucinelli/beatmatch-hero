import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Track, Playlist } from '../types'

interface BeatmatchDB extends DBSchema {
  tracks: {
    key: string
    value: Track
    indexes: { 'by-addedAt': number }
  }
  playlists: {
    key: string
    value: Playlist
    indexes: { 'by-createdAt': number }
  }
}

let dbPromise: Promise<IDBPDatabase<BeatmatchDB>> | null = null

function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<BeatmatchDB>('beatmatch-hero', 1, {
      upgrade(db) {
        const tracks = db.createObjectStore('tracks', { keyPath: 'id' })
        tracks.createIndex('by-addedAt', 'addedAt')

        const playlists = db.createObjectStore('playlists', { keyPath: 'id' })
        playlists.createIndex('by-createdAt', 'createdAt')
      },
    })
  }
  return dbPromise
}

export async function getAllTracks(): Promise<Track[]> {
  const db = await getDB()
  const tracks = await db.getAllFromIndex('tracks', 'by-addedAt')
  return tracks.reverse()
}

export async function putTrack(track: Track): Promise<void> {
  const db = await getDB()
  await db.put('tracks', track)
}

export async function deleteTrack(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('tracks', id)
}

export async function getAllPlaylists(): Promise<Playlist[]> {
  const db = await getDB()
  const playlists = await db.getAllFromIndex('playlists', 'by-createdAt')
  return playlists.reverse()
}

export async function putPlaylist(playlist: Playlist): Promise<void> {
  const db = await getDB()
  await db.put('playlists', playlist)
}

export async function deletePlaylist(id: string): Promise<void> {
  const db = await getDB()
  await db.delete('playlists', id)
}
