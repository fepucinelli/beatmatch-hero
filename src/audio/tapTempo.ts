/**
 * Tap-tempo BPM calculation. Keeps a rolling window of recent taps and
 * resets the window if the gap between taps is too long to be the same track.
 */

const MAX_TAPS = 8
const RESET_GAP_MS = 2000

export class TapTempo {
  private taps: number[] = []

  tap(now: number = performance.now()): number | null {
    if (this.taps.length > 0 && now - this.taps[this.taps.length - 1] > RESET_GAP_MS) {
      this.taps = []
    }

    this.taps.push(now)
    if (this.taps.length > MAX_TAPS) {
      this.taps.shift()
    }

    return this.computeBpm()
  }

  reset(): void {
    this.taps = []
  }

  private computeBpm(): number | null {
    if (this.taps.length < 2) return null

    const intervals: number[] = []
    for (let i = 1; i < this.taps.length; i++) {
      intervals.push(this.taps[i] - this.taps[i - 1])
    }

    const avgInterval = intervals.reduce((sum, ms) => sum + ms, 0) / intervals.length
    if (avgInterval <= 0) return null

    return 60000 / avgInterval
  }
}
