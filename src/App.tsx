import { useEffect, useState } from 'react'
import type { DeckId, Track } from './types'
import { useDeckStore } from './store/deckStore'
import { useDeckEngine } from './audio/useDeckEngine'
import { seedDefaultPlaylist } from './db/seed'
import { Deck } from './components/Deck/Deck'
import { LibraryPanel } from './components/Library/LibraryPanel'
import { PlaylistList } from './components/Playlists/PlaylistList'
import { PlaylistDetail } from './components/Playlists/PlaylistDetail'
import './App.css'

type SidebarTab = 'library' | 'favorites' | 'playlists'

function App() {
  const engineA = useDeckEngine()
  const engineB = useDeckEngine()
  const loadTrack = useDeckStore((state) => state.loadTrack)

  useEffect(() => {
    void seedDefaultPlaylist()
  }, [])

  const [tab, setTab] = useState<SidebarTab>('library')
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null)

  const handleLoadToDeck = (deck: DeckId, track: Track) => {
    loadTrack(deck, track)
    const engine = deck === 'A' ? engineA : engineB
    engine.load(track)
  }

  return (
    <div className="app">
      <header className="app__header">
        <span className="app__logo">BEATMATCH HERO</span>
        <span className="app__tagline">turntable pitch trainer</span>
      </header>

      <main className="app__main">
        <section className="app__mixer">
          <Deck deck="A" engine={engineA} />
          <Deck deck="B" engine={engineB} />
        </section>

        <aside className="app__sidebar">
          <nav className="app__tabs">
            <button type="button" data-active={tab === 'library'} onClick={() => setTab('library')}>
              Library
            </button>
            <button type="button" data-active={tab === 'favorites'} onClick={() => setTab('favorites')}>
              Favorites
            </button>
            <button type="button" data-active={tab === 'playlists'} onClick={() => setTab('playlists')}>
              Playlists
            </button>
          </nav>

          <div className="app__sidebar-body">
            {tab === 'library' && <LibraryPanel onLoadToDeck={handleLoadToDeck} />}
            {tab === 'favorites' && <LibraryPanel onLoadToDeck={handleLoadToDeck} favoritesOnly />}
            {tab === 'playlists' && (
              <div className="app__playlists">
                <PlaylistList selectedId={selectedPlaylistId} onSelect={setSelectedPlaylistId} />
                {selectedPlaylistId && (
                  <PlaylistDetail playlistId={selectedPlaylistId} onLoadToDeck={handleLoadToDeck} />
                )}
              </div>
            )}
          </div>
        </aside>
      </main>
    </div>
  )
}

export default App
