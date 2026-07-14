import type { DeckId, Track } from '../../types'
import { formatTime } from '../../utils/time'
import './TrackRow.css'

interface TrackRowProps {
  track: Track
  onToggleFavorite: (id: string) => void
  onDelete: (id: string) => void
  onLoadToDeck: (deck: DeckId, track: Track) => void
  trailingAction?: React.ReactNode
}

export function TrackRow({ track, onToggleFavorite, onDelete, onLoadToDeck, trailingAction }: TrackRowProps) {
  return (
    <div className="track-row">
      <button
        type="button"
        className="track-row__favorite"
        data-active={track.favorite}
        onClick={() => onToggleFavorite(track.id)}
        aria-label={track.favorite ? 'Unfavorite track' : 'Favorite track'}
        aria-pressed={track.favorite}
      >
        ★
      </button>

      <div className="track-row__info">
        <span className="track-row__name">{track.name}</span>
        <span className="track-row__meta">
          {track.duration ? formatTime(track.duration) : '--:--'}
          {track.bpm ? ` · ${track.bpm.toFixed(1)} BPM` : ''}
        </span>
      </div>

      <div className="track-row__actions">
        <button type="button" className="track-row__deck-btn" data-deck="A" onClick={() => onLoadToDeck('A', track)}>
          → A
        </button>
        <button type="button" className="track-row__deck-btn" data-deck="B" onClick={() => onLoadToDeck('B', track)}>
          → B
        </button>
        {trailingAction}
        <button
          type="button"
          className="track-row__delete"
          onClick={() => onDelete(track.id)}
          aria-label="Delete track"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
