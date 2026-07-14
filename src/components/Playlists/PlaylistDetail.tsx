import { useMemo, useState } from 'react'
import type { DeckId } from '../../types'
import { usePlaylistStore } from '../../store/playlistStore'
import { useLibraryStore } from '../../store/libraryStore'
import { TrackRow } from '../Library/TrackRow'
import './PlaylistDetail.css'

interface PlaylistDetailProps {
  playlistId: string
  onLoadToDeck: (deck: DeckId, track: import('../../types').Track) => void
}

export function PlaylistDetail({ playlistId, onLoadToDeck }: PlaylistDetailProps) {
  const playlist = usePlaylistStore((state) => state.playlists.find((p) => p.id === playlistId))
  const addTrack = usePlaylistStore((state) => state.addTrack)
  const removeTrack = usePlaylistStore((state) => state.removeTrack)
  const allTracks = useLibraryStore((state) => state.tracks)
  const toggleFavorite = useLibraryStore((state) => state.toggleFavorite)
  const removeFromLibrary = useLibraryStore((state) => state.removeTrack)
  const [showAdd, setShowAdd] = useState(false)

  const playlistTracks = useMemo(() => {
    if (!playlist) return []
    return playlist.trackIds
      .map((id) => allTracks.find((t) => t.id === id))
      .filter((t): t is NonNullable<typeof t> => Boolean(t))
  }, [playlist, allTracks])

  const addableTracks = useMemo(() => {
    if (!playlist) return []
    return allTracks.filter((t) => !playlist.trackIds.includes(t.id))
  }, [playlist, allTracks])

  if (!playlist) return null

  return (
    <div className="playlist-detail">
      <div className="playlist-detail__header">
        <span className="playlist-detail__name">{playlist.name}</span>
        <button type="button" className="playlist-detail__add-toggle" onClick={() => setShowAdd((v) => !v)}>
          {showAdd ? 'Done' : '+ Add tracks'}
        </button>
      </div>

      {showAdd && (
        <div className="playlist-detail__add-list">
          {addableTracks.length === 0 && (
            <div className="playlist-detail__empty">All library tracks are already in this playlist</div>
          )}
          {addableTracks.map((track) => (
            <button
              type="button"
              key={track.id}
              className="playlist-detail__add-item"
              onClick={() => void addTrack(playlist.id, track.id)}
            >
              {track.name}
              <span className="playlist-detail__add-plus">+</span>
            </button>
          ))}
        </div>
      )}

      <div className="playlist-detail__list">
        {playlistTracks.length === 0 && <div className="playlist-detail__empty">This playlist is empty</div>}
        {playlistTracks.map((track) => (
          <TrackRow
            key={track.id}
            track={track}
            onToggleFavorite={toggleFavorite}
            onDelete={removeFromLibrary}
            onLoadToDeck={onLoadToDeck}
            trailingAction={
              <button
                type="button"
                className="playlist-detail__remove"
                onClick={() => void removeTrack(playlist.id, track.id)}
                aria-label="Remove from playlist"
              >
                −
              </button>
            }
          />
        ))}
      </div>
    </div>
  )
}
