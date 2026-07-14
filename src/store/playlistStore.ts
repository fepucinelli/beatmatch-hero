import { create } from 'zustand'
import type { Playlist } from '../types'
import { deletePlaylist, getAllPlaylists, putPlaylist } from '../db/db'

interface PlaylistState {
  playlists: Playlist[]
  loaded: boolean
  init: () => Promise<void>
  createPlaylist: (name: string) => Promise<Playlist>
  renamePlaylist: (id: string, name: string) => Promise<void>
  removePlaylist: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  addTrack: (playlistId: string, trackId: string) => Promise<void>
  removeTrack: (playlistId: string, trackId: string) => Promise<void>
}

export const usePlaylistStore = create<PlaylistState>((set, get) => ({
  playlists: [],
  loaded: false,

  init: async () => {
    if (get().loaded) return
    const playlists = await getAllPlaylists()
    set({ playlists, loaded: true })
  },

  createPlaylist: async (name) => {
    const playlist: Playlist = {
      id: crypto.randomUUID(),
      name,
      trackIds: [],
      favorite: false,
      createdAt: Date.now(),
    }
    await putPlaylist(playlist)
    set((state) => ({ playlists: [playlist, ...state.playlists] }))
    return playlist
  },

  renamePlaylist: async (id, name) => {
    const playlist = get().playlists.find((p) => p.id === id)
    if (!playlist) return
    const updated = { ...playlist, name }
    await putPlaylist(updated)
    set((state) => ({ playlists: state.playlists.map((p) => (p.id === id ? updated : p)) }))
  },

  removePlaylist: async (id) => {
    await deletePlaylist(id)
    set((state) => ({ playlists: state.playlists.filter((p) => p.id !== id) }))
  },

  toggleFavorite: async (id) => {
    const playlist = get().playlists.find((p) => p.id === id)
    if (!playlist) return
    const updated = { ...playlist, favorite: !playlist.favorite }
    await putPlaylist(updated)
    set((state) => ({ playlists: state.playlists.map((p) => (p.id === id ? updated : p)) }))
  },

  addTrack: async (playlistId, trackId) => {
    const playlist = get().playlists.find((p) => p.id === playlistId)
    if (!playlist || playlist.trackIds.includes(trackId)) return
    const updated = { ...playlist, trackIds: [...playlist.trackIds, trackId] }
    await putPlaylist(updated)
    set((state) => ({ playlists: state.playlists.map((p) => (p.id === playlistId ? updated : p)) }))
  },

  removeTrack: async (playlistId, trackId) => {
    const playlist = get().playlists.find((p) => p.id === playlistId)
    if (!playlist) return
    const updated = { ...playlist, trackIds: playlist.trackIds.filter((id) => id !== trackId) }
    await putPlaylist(updated)
    set((state) => ({ playlists: state.playlists.map((p) => (p.id === playlistId ? updated : p)) }))
  },
}))
