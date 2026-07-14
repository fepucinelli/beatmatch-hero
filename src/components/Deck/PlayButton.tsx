import type { DeckId } from '../../types'
import './PlayButton.css'

interface PlayButtonProps {
  deck: DeckId
  isPlaying: boolean
  disabled: boolean
  onToggle: () => void
}

export function PlayButton({ deck, isPlaying, disabled, onToggle }: PlayButtonProps) {
  return (
    <button
      type="button"
      className="play-button"
      data-deck={deck}
      data-playing={isPlaying}
      disabled={disabled}
      onClick={onToggle}
      aria-label={isPlaying ? `Pause deck ${deck}` : `Play deck ${deck}`}
      aria-pressed={isPlaying}
    >
      {isPlaying ? (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <rect x="6" y="5" width="4.5" height="14" rx="1" fill="currentColor" />
          <rect x="13.5" y="5" width="4.5" height="14" rx="1" fill="currentColor" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path d="M7.5 5.2v13.6c0 .9 1 1.5 1.8 1l11-6.8c.8-.5.8-1.6 0-2.1l-11-6.8c-.8-.5-1.8.1-1.8 1.1z" fill="currentColor" />
        </svg>
      )}
    </button>
  )
}
