import { create } from 'zustand'
import type { DeckId, PitchRange, Track } from '../types'

interface SingleDeckState {
  track: Track | null
  pitchPercent: number
  range: PitchRange
  bpm: number | null
}

interface DeckState {
  decks: Record<DeckId, SingleDeckState>
  loadTrack: (deck: DeckId, track: Track) => void
  setPitchPercent: (deck: DeckId, percent: number) => void
  setRange: (deck: DeckId, range: PitchRange) => void
  setBpm: (deck: DeckId, bpm: number | null) => void
}

const emptyDeck: SingleDeckState = {
  track: null,
  pitchPercent: 0,
  range: 8,
  bpm: null,
}

export const useDeckStore = create<DeckState>((set) => ({
  decks: { A: { ...emptyDeck }, B: { ...emptyDeck } },

  loadTrack: (deck, track) =>
    set((state) => ({
      decks: {
        ...state.decks,
        [deck]: { ...state.decks[deck], track, bpm: track.bpm },
      },
    })),

  setPitchPercent: (deck, percent) =>
    set((state) => ({
      decks: { ...state.decks, [deck]: { ...state.decks[deck], pitchPercent: percent } },
    })),

  setRange: (deck, range) =>
    set((state) => ({
      decks: {
        ...state.decks,
        [deck]: {
          ...state.decks[deck],
          range,
          pitchPercent: Math.min(range, Math.max(-range, state.decks[deck].pitchPercent)),
        },
      },
    })),

  setBpm: (deck, bpm) =>
    set((state) => ({
      decks: { ...state.decks, [deck]: { ...state.decks[deck], bpm } },
    })),
}))
