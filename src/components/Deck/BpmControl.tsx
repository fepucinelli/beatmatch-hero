import { useRef } from 'react'
import type { DeckId } from '../../types'
import { TapTempo } from '../../audio/tapTempo'
import { effectiveBpm } from '../../audio/pitch'
import './BpmControl.css'

interface BpmControlProps {
  deck: DeckId
  bpm: number | null
  pitchPercent: number
  onBpmChange: (bpm: number | null) => void
}

export function BpmControl({ deck, bpm, pitchPercent, onBpmChange }: BpmControlProps) {
  const tapTempoRef = useRef(new TapTempo())

  const handleTap = () => {
    const result = tapTempoRef.current.tap()
    if (result !== null) {
      onBpmChange(Math.round(result * 10) / 10)
    }
  }

  const handleManualChange = (raw: string) => {
    if (raw === '') {
      onBpmChange(null)
      return
    }
    const parsed = Number(raw)
    if (!Number.isNaN(parsed)) {
      onBpmChange(parsed)
    }
  }

  const effective = bpm != null ? effectiveBpm(bpm, pitchPercent) : null

  return (
    <div className="bpm-control" data-deck={deck}>
      <div className="bpm-control__row">
        <input
          className="bpm-control__input"
          type="number"
          inputMode="decimal"
          placeholder="---.-"
          step="0.1"
          value={bpm ?? ''}
          onChange={(event) => handleManualChange(event.target.value)}
          aria-label={`Deck ${deck} base BPM`}
        />
        <span className="bpm-control__unit">BPM</span>
      </div>
      <button type="button" className="bpm-control__tap" onClick={handleTap}>
        TAP
      </button>
      <div className="bpm-control__effective">{effective != null ? effective.toFixed(1) : '—'} eff.</div>
    </div>
  )
}
