import type { DeckId } from '../../types'
import { formatTime } from '../../utils/time'
import './Platter.css'

interface PlatterProps {
  deck: DeckId
  isPlaying: boolean
  trackName: string | null
  currentTime: number
  duration: number
}

export function Platter({ deck, isPlaying, trackName, currentTime, duration }: PlatterProps) {
  const progress = duration > 0 ? Math.min(1, currentTime / duration) : 0

  return (
    <div className="platter" data-deck={deck}>
      <div className="platter__disc" data-spinning={isPlaying}>
        <div className="platter__grooves" />
        <div className="platter__label">
          <span className="platter__label-deck">{deck}</span>
        </div>
      </div>
      <div className="platter__track-name">{trackName ?? 'NO TRACK LOADED'}</div>
      {trackName && (
        <div className="platter__time">
          <span className="platter__time-current">{formatTime(currentTime)}</span>
          <div className="platter__time-bar">
            <div className="platter__time-bar-fill" style={{ width: `${progress * 100}%` }} />
          </div>
          <span className="platter__time-total">{formatTime(duration)}</span>
        </div>
      )}
    </div>
  )
}
