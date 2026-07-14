import { useEffect } from 'react'
import { usePlaylistStore } from '../../store/playlistStore'
import { NewPlaylistDialog } from './NewPlaylistDialog'
import './PlaylistList.css'

interface PlaylistListProps {
  selectedId: string | null
  onSelect: (id: string) => void
}

export function PlaylistList({ selectedId, onSelect }: PlaylistListProps) {
  const init = usePlaylistStore((state) => state.init)
  const playlists = usePlaylistStore((state) => state.playlists)
  const createPlaylist = usePlaylistStore((state) => state.createPlaylist)
  const toggleFavorite = usePlaylistStore((state) => state.toggleFavorite)
  const removePlaylist = usePlaylistStore((state) => state.removePlaylist)

  useEffect(() => {
    void init()
  }, [init])

  return (
    <div className="playlist-list">
      <NewPlaylistDialog
        onCreate={async (name) => {
          const playlist = await createPlaylist(name)
          onSelect(playlist.id)
        }}
      />
      {playlists.length === 0 && <div className="playlist-list__empty">No playlists yet</div>}
      {playlists.map((playlist) => (
        <div
          key={playlist.id}
          className="playlist-list__item"
          data-active={playlist.id === selectedId}
          onClick={() => onSelect(playlist.id)}
        >
          <button
            type="button"
            className="playlist-list__favorite"
            data-active={playlist.favorite}
            onClick={(event) => {
              event.stopPropagation()
              void toggleFavorite(playlist.id)
            }}
            aria-label={playlist.favorite ? 'Unfavorite playlist' : 'Favorite playlist'}
          >
            ★
          </button>
          <span className="playlist-list__name">{playlist.name}</span>
          <span className="playlist-list__count">{playlist.trackIds.length}</span>
          <button
            type="button"
            className="playlist-list__delete"
            onClick={(event) => {
              event.stopPropagation()
              void removePlaylist(playlist.id)
            }}
            aria-label="Delete playlist"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  )
}
