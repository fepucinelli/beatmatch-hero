import type { DeckId } from '../../types'
import './CueButton.css'

interface CueButtonProps {
  deck: DeckId
  disabled: boolean
  onCue: () => void
}

export function CueButton({ deck, disabled, onCue }: CueButtonProps) {
  return (
    <button
      type="button"
      className="cue-button"
      data-deck={deck}
      disabled={disabled}
      onClick={onCue}
      aria-label={`Return deck ${deck} to the start of the track`}
    >
      <svg viewBox="0 0 24 24" width="14" height="14" aria-hidden="true">
        <rect x="5" y="5" width="2.4" height="14" rx="1" fill="currentColor" />
        <path d="M18 5.2v13.6c0 .9-1 1.5-1.8 1l-9-6.8c-.7-.5-.7-1.6 0-2.1l9-6.8c.8-.5 1.8.1 1.8 1.1z" fill="currentColor" />
      </svg>
      <span>CUE</span>
    </button>
  )
}
