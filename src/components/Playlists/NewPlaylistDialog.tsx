import { useState } from 'react'
import './NewPlaylistDialog.css'

interface NewPlaylistDialogProps {
  onCreate: (name: string) => void
}

export function NewPlaylistDialog({ onCreate }: NewPlaylistDialogProps) {
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')

  const submit = () => {
    const trimmed = name.trim()
    if (trimmed) {
      onCreate(trimmed)
      setName('')
      setOpen(false)
    }
  }

  if (!open) {
    return (
      <button type="button" className="new-playlist-trigger" onClick={() => setOpen(true)}>
        + New playlist
      </button>
    )
  }

  return (
    <div className="new-playlist-form">
      <input
        autoFocus
        className="new-playlist-form__input"
        value={name}
        placeholder="Playlist name"
        onChange={(event) => setName(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Enter') submit()
          if (event.key === 'Escape') {
            setOpen(false)
            setName('')
          }
        }}
      />
      <button type="button" className="new-playlist-form__confirm" onClick={submit}>
        Add
      </button>
    </div>
  )
}
