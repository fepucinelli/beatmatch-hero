import { describe, expect, it } from 'vitest'
import {
  clampPitchPercent,
  effectiveBpm,
  pitchPercentToPlaybackRate,
  playbackRateToPitchPercent,
} from './pitch'

describe('pitchPercentToPlaybackRate', () => {
  it('maps 0% to a playback rate of 1', () => {
    expect(pitchPercentToPlaybackRate(0)).toBe(1)
  })

  it('maps +8% to 1.08', () => {
    expect(pitchPercentToPlaybackRate(8)).toBeCloseTo(1.08)
  })

  it('maps -8% to 0.92', () => {
    expect(pitchPercentToPlaybackRate(-8)).toBeCloseTo(0.92)
  })

  it('maps +16% to 1.16', () => {
    expect(pitchPercentToPlaybackRate(16)).toBeCloseTo(1.16)
  })
})

describe('playbackRateToPitchPercent', () => {
  it('is the inverse of pitchPercentToPlaybackRate', () => {
    for (const pct of [-16, -8, -3.4, 0, 5.5, 8, 16]) {
      expect(playbackRateToPitchPercent(pitchPercentToPlaybackRate(pct))).toBeCloseTo(pct)
    }
  })
})

describe('effectiveBpm', () => {
  it('returns base bpm unchanged at 0%', () => {
    expect(effectiveBpm(128, 0)).toBe(128)
  })

  it('scales bpm up with positive pitch', () => {
    expect(effectiveBpm(120, 8)).toBeCloseTo(129.6)
  })

  it('scales bpm down with negative pitch', () => {
    expect(effectiveBpm(120, -8)).toBeCloseTo(110.4)
  })
})

describe('clampPitchPercent', () => {
  it('clamps values above range', () => {
    expect(clampPitchPercent(20, 8)).toBe(8)
  })

  it('clamps values below negative range', () => {
    expect(clampPitchPercent(-20, 8)).toBe(-8)
  })

  it('passes through in-range values', () => {
    expect(clampPitchPercent(3.2, 8)).toBe(3.2)
  })
})
