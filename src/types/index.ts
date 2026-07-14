export type DeckId = 'A' | 'B'

export type PitchRange = 8 | 16

export interface Track {
  id: string
  name: string
  blob: Blob
  mimeType: string
  duration: number
  bpm: number | null
  favorite: boolean
  addedAt: number
}

export interface Playlist {
  id: string
  name: string
  trackIds: string[]
  favorite: boolean
  createdAt: number
}
