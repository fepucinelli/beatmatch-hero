import { describe, expect, it } from 'vitest'
import { TapTempo } from './tapTempo'

describe('TapTempo', () => {
  it('returns null after a single tap', () => {
    const tempo = new TapTempo()
    expect(tempo.tap(0)).toBeNull()
  })

  it('computes bpm from evenly spaced taps', () => {
    const tempo = new TapTempo()
    // 500ms between taps = 120 BPM
    tempo.tap(0)
    tempo.tap(500)
    const bpm = tempo.tap(1000)
    expect(bpm).toBeCloseTo(120)
  })

  it('averages across irregular taps', () => {
    const tempo = new TapTempo()
    tempo.tap(0)
    tempo.tap(490)
    tempo.tap(1010)
    const bpm = tempo.tap(1500)
    expect(bpm).toBeGreaterThan(115)
    expect(bpm).toBeLessThan(125)
  })

  it('resets the window after a long gap', () => {
    const tempo = new TapTempo()
    tempo.tap(0)
    tempo.tap(500)
    // huge gap should reset the rolling window
    tempo.tap(10000)
    const bpm = tempo.tap(10500)
    expect(bpm).toBeCloseTo(120)
  })

  it('reset() clears all taps', () => {
    const tempo = new TapTempo()
    tempo.tap(0)
    tempo.tap(500)
    tempo.reset()
    expect(tempo.tap(600)).toBeNull()
  })
})
