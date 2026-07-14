import { useEffect, useMemo, useState } from 'react'
import type { DeckId, Track } from '../../types'
import { useLibraryStore } from '../../store/libraryStore'
import { UploadDropzone } from './UploadDropzone'
import { SearchBar } from './SearchBar'
import { TrackRow } from './TrackRow'
import './LibraryPanel.css'

interface LibraryPanelProps {
  onLoadToDeck: (deck: DeckId, track: Track) => void
  trailingAction?: (track: Track) => React.ReactNode
  favoritesOnly?: boolean
}

export function LibraryPanel({ onLoadToDeck, trailingAction, favoritesOnly = false }: LibraryPanelProps) {
  const init = useLibraryStore((state) => state.init)
  const tracks = useLibraryStore((state) => state.tracks)
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite)
  const removeTrack = useLibraryStore((state) => state.removeTrack)
  const [query, setQuery] = useState('')

  useEffect(() => {
    void init()
  }, [init])

  const filtered = useMemo(() => {
    const base = favoritesOnly ? tracks.filter((t) => t.favorite) : tracks
    if (!query.trim()) return base
    const q = query.toLowerCase()
    return base.filter((t) => t.name.toLowerCase().includes(q))
  }, [tracks, query, favoritesOnly])

  return (
    <div className="library-panel">
      {!favoritesOnly && <UploadDropzone />}
      <SearchBar value={query} onChange={setQuery} />
      <div className="library-panel__list">
        {filtered.length === 0 && (
          <div className="library-panel__empty">
            {favoritesOnly ? 'No favorites yet' : 'No tracks imported yet'}
          </div>
        )}
        {filtered.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            onToggleFavorite={toggleFavorite}
            onDelete={removeTrack}
            onLoadToDeck={onLoadToDeck}
            trailingAction={trailingAction?.(track)}
          />
        ))}
      </div>
    </div>
  )
}
