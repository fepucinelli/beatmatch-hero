/**
 * Pitch fader math. A real turntable pitch fader has no keylock: moving the
 * fader changes playbackRate directly, which shifts speed and pitch together.
 */

export function pitchPercentToPlaybackRate(pitchPercent: number): number {
  return 1 + pitchPercent / 100
}

export function playbackRateToPitchPercent(rate: number): number {
  return (rate - 1) * 100
}

export function effectiveBpm(baseBpm: number, pitchPercent: number): number {
  return baseBpm * pitchPercentToPlaybackRate(pitchPercent)
}

export function clampPitchPercent(value: number, range: number): number {
  return Math.min(range, Math.max(-range, value))
}
