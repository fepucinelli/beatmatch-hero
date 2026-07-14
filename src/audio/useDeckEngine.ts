import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import type { Track } from '../types'
import { pitchPercentToPlaybackRate } from './pitch'

interface DeckAudioNodes {
  audio: HTMLAudioElement
  context: AudioContext
  source: MediaElementAudioSourceNode
  gain: GainNode
}

export interface DeckEngine {
  isPlaying: boolean
  currentTime: number
  duration: number
  load: (track: Track) => void
  play: () => void
  pause: () => void
  toggle: () => void
  cue: () => void
  setPitchPercent: (percent: number) => void
}

export function useDeckEngine(): DeckEngine {
  const nodesRef = useRef<DeckAudioNodes | null>(null)
  const objectUrlRef = useRef<string | null>(null)
  const pitchRef = useRef(0)

  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const getNodes = useCallback((): DeckAudioNodes => {
    if (nodesRef.current) return nodesRef.current

    const audio = new Audio()
    audio.preload = 'auto'
    const context = new AudioContext()
    const source = context.createMediaElementSource(audio)
    const gain = context.createGain()
    source.connect(gain)
    gain.connect(context.destination)

    const nodes: DeckAudioNodes = { audio, context, source, gain }
    nodesRef.current = nodes
    return nodes
  }, [])

  useEffect(() => {
    const nodes = getNodes()
    const { audio } = nodes

    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onLoadedMetadata = () => setDuration(audio.duration || 0)
    const onEnded = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoadedMetadata)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoadedMetadata)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [getNodes])

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current)
      nodesRef.current?.audio.pause()
      void nodesRef.current?.context.close()
      // Clear the cached graph so a remount (e.g. React StrictMode's
      // dev-mode mount/unmount/remount cycle) creates a fresh, open
      // AudioContext instead of reusing this now-closed one.
      nodesRef.current = null
    }
  }, [])

  const load = useCallback(
    (track: Track) => {
      const { audio } = getNodes()

      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
      }

      const url = URL.createObjectURL(track.blob)
      objectUrlRef.current = url
      audio.src = url
      audio.playbackRate = pitchPercentToPlaybackRate(pitchRef.current)
      setCurrentTime(0)
    },
    [getNodes],
  )

  const play = useCallback(() => {
    const nodes = getNodes()
    const start = () => {
      void nodes.audio.play()
    }
    if (nodes.context.state === 'suspended') {
      void nodes.context.resume().then(start)
    } else {
      start()
    }
  }, [getNodes])

  const pause = useCallback(() => {
    nodesRef.current?.audio.pause()
  }, [])

  const cue = useCallback(() => {
    const nodes = nodesRef.current
    if (!nodes) return
    nodes.audio.currentTime = 0
    setCurrentTime(0)
  }, [])

  const toggle = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const setPitchPercent = useCallback(
    (percent: number) => {
      pitchRef.current = percent
      const { audio } = getNodes()
      audio.playbackRate = pitchPercentToPlaybackRate(percent)
    },
    [getNodes],
  )

  return useMemo(
    () => ({ isPlaying, currentTime, duration, load, play, pause, toggle, cue, setPitchPercent }),
    [isPlaying, currentTime, duration, load, play, pause, toggle, cue, setPitchPercent],
  )
}
