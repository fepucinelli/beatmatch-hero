import { useEffect } from 'react'
import type { DeckId } from '../../types'
import { useDeckStore } from '../../store/deckStore'
import { useDeckEngine } from '../../audio/useDeckEngine'
import { PlayButton } from './PlayButton'
import { CueButton } from './CueButton'
import { Platter } from './Platter'
import { PitchFader } from './PitchFader'
import { RangeToggle } from './RangeToggle'
import { BpmControl } from './BpmControl'
import './Deck.css'

interface DeckProps {
  deck: DeckId
  engine: ReturnType<typeof useDeckEngine>
}

export function Deck({ deck, engine }: DeckProps) {
  const deckState = useDeckStore((state) => state.decks[deck])
  const setPitchPercent = useDeckStore((state) => state.setPitchPercent)
  const setRange = useDeckStore((state) => state.setRange)
  const setBpm = useDeckStore((state) => state.setBpm)

  useEffect(() => {
    engine.setPitchPercent(deckState.pitchPercent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deckState.pitchPercent])

  return (
    <div className="deck" data-deck={deck}>
      <div className="deck__header">
        <span className="deck__id">DECK {deck}</span>
        <div className="deck__screws">
          <span className="screw" />
          <span className="screw" />
        </div>
      </div>

      <Platter
        deck={deck}
        isPlaying={engine.isPlaying}
        trackName={deckState.track?.name ?? null}
        currentTime={engine.currentTime}
        duration={engine.duration}
      />

      <div className="deck__transport">
        <div className="deck__buttons">
          <PlayButton deck={deck} isPlaying={engine.isPlaying} disabled={!deckState.track} onToggle={engine.toggle} />
          <CueButton deck={deck} disabled={!deckState.track} onCue={engine.cue} />
        </div>
        <BpmControl
          deck={deck}
          bpm={deckState.bpm}
          pitchPercent={deckState.pitchPercent}
          onBpmChange={(bpm) => setBpm(deck, bpm)}
        />
      </div>

      <div className="deck__pitch-section">
        <PitchFader
          deck={deck}
          value={deckState.pitchPercent}
          range={deckState.range}
          onChange={(value) => setPitchPercent(deck, value)}
        />
        <RangeToggle range={deckState.range} onChange={(range) => setRange(deck, range)} />
      </div>
    </div>
  )
}
