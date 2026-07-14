import type { PitchRange } from '../../types'
import './RangeToggle.css'

interface RangeToggleProps {
  range: PitchRange
  onChange: (range: PitchRange) => void
}

export function RangeToggle({ range, onChange }: RangeToggleProps) {
  return (
    <div className="range-toggle" role="group" aria-label="Pitch range">
      <button
        type="button"
        className="range-toggle__option"
        data-active={range === 8}
        onClick={() => onChange(8)}
      >
        ±8
      </button>
      <button
        type="button"
        className="range-toggle__option"
        data-active={range === 16}
        onClick={() => onChange(16)}
      >
        ±16
      </button>
    </div>
  )
}
