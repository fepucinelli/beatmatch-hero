import { create } from 'zustand'
import type { Track } from '../types'
import { deleteTrack, getAllTracks, putTrack } from '../db/db'

interface LibraryState {
  tracks: Track[]
  loaded: boolean
  init: () => Promise<void>
  addTrack: (track: Track) => Promise<void>
  removeTrack: (id: string) => Promise<void>
  toggleFavorite: (id: string) => Promise<void>
  setBpm: (id: string, bpm: number | null) => Promise<void>
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  tracks: [],
  loaded: false,

  init: async () => {
    if (get().loaded) return
    const tracks = await getAllTracks()
    set({ tracks, loaded: true })
  },

  addTrack: async (track) => {
    await putTrack(track)
    set((state) => ({ tracks: [track, ...state.tracks] }))
  },

  removeTrack: async (id) => {
    await deleteTrack(id)
    set((state) => ({ tracks: state.tracks.filter((t) => t.id !== id) }))
  },

  toggleFavorite: async (id) => {
    const track = get().tracks.find((t) => t.id === id)
    if (!track) return
    const updated = { ...track, favorite: !track.favorite }
    await putTrack(updated)
    set((state) => ({ tracks: state.tracks.map((t) => (t.id === id ? updated : t)) }))
  },

  setBpm: async (id, bpm) => {
    const track = get().tracks.find((t) => t.id === id)
    if (!track) return
    const updated = { ...track, bpm }
    await putTrack(updated)
    set((state) => ({ tracks: state.tracks.map((t) => (t.id === id ? updated : t)) }))
  },
}))
