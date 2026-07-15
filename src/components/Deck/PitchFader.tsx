import { useCallback, useRef } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { DeckId, PitchRange } from '../../types'
import { clampPitchPercent } from '../../audio/pitch'
import './PitchFader.css'

interface PitchFaderProps {
  deck: DeckId
  value: number
  range: PitchRange
  onChange: (value: number) => void
}

const DETENT_WINDOW = 0.12

function formatPitch(value: number): string {
  const sign = value > 0.005 ? '+' : value < -0.005 ? '−' : ''
  return `${sign}${Math.abs(value).toFixed(1)}%`
}

interface TickMark {
  value: number
  major: boolean
}

function buildTicks(range: PitchRange): TickMark[] {
  // Labeled ticks every range/4 (2 for +/-8%, 4 for +/-16%), with an
  // unlabeled dash evenly spaced at the midpoint between each pair.
  const majorStep = range / 4
  const minorStep = majorStep / 2
  const ticks: TickMark[] = []
  for (let value = range; value >= -range; value -= minorStep) {
    const rounded = Math.round(value * 10) / 10
    ticks.push({ value: rounded, major: Math.round(rounded / majorStep) === rounded / majorStep })
  }
  return ticks
}

export function PitchFader({ deck, value, range, onChange }: PitchFaderProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const draggingRef = useRef(false)

  const valueFromClientY = useCallback(
    (clientY: number) => {
      const track = trackRef.current
      if (!track) return value
      const rect = track.getBoundingClientRect()
      const fraction = (clientY - rect.top) / rect.height
      const raw = (fraction * 2 - 1) * range
      const clamped = clampPitchPercent(raw, range)
      return Math.abs(clamped) < DETENT_WINDOW ? 0 : Math.round(clamped * 10) / 10
    },
    [range, value],
  )

  const handlePointerDown = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      draggingRef.current = true
      ;(event.target as HTMLElement).setPointerCapture(event.pointerId)
      onChange(valueFromClientY(event.clientY))
    },
    [onChange, valueFromClientY],
  )

  const handlePointerMove = useCallback(
    (event: ReactPointerEvent<HTMLDivElement>) => {
      if (!draggingRef.current) return
      onChange(valueFromClientY(event.clientY))
    },
    [onChange, valueFromClientY],
  )

  const handlePointerUp = useCallback((event: ReactPointerEvent<HTMLDivElement>) => {
    draggingRef.current = false
    ;(event.target as HTMLElement).releasePointerCapture(event.pointerId)
  }, [])

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      const step = event.shiftKey ? 1 : 0.1
      if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
        onChange(clampPitchPercent(Math.round((value + step) * 10) / 10, range))
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
        onChange(clampPitchPercent(Math.round((value - step) * 10) / 10, range))
      } else if (event.key === 'Home') {
        onChange(0)
      } else {
        return
      }
      event.preventDefault()
    },
    [onChange, range, value],
  )

  const fraction = (value + range) / (range * 2)
  const capPositionPercent = fraction * 100

  const ticks = buildTicks(range)

  return (
    <div className="pitch-fader" data-deck={deck}>
      <div className="pitch-fader__ticks" aria-hidden="true">
        {ticks.map((tick) => (
          <div className="pitch-fader__tick" key={tick.value} data-zero={tick.value === 0} data-major={tick.major}>
            <span className="pitch-fader__tick-mark" />
            {tick.major && (
              <span className="pitch-fader__tick-label">{tick.value > 0 ? `+${tick.value}` : tick.value}</span>
            )}
          </div>
        ))}
      </div>

      <div
        ref={trackRef}
        className="pitch-fader__track"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="pitch-fader__groove" />
        <div className="pitch-fader__center-line" />
        <div
          className="pitch-fader__cap"
          role="slider"
          tabIndex={0}
          aria-label={`Deck ${deck} pitch`}
          aria-valuemin={-range}
          aria-valuemax={range}
          aria-valuenow={value}
          aria-valuetext={formatPitch(value)}
          onKeyDown={handleKeyDown}
          style={{ top: `${capPositionPercent}%` }}
        >
          <div className="pitch-fader__cap-grip" />
        </div>
      </div>

      <div className="pitch-fader__readout">{formatPitch(value)}</div>
    </div>
  )
}
