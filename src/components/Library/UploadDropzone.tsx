import { useCallback, useRef, useState } from 'react'
import type { DragEvent } from 'react'
import type { Track } from '../../types'
import { useLibraryStore } from '../../store/libraryStore'
import { readDuration } from '../../utils/audio'
import './UploadDropzone.css'

function stripExtension(name: string): string {
  return name.replace(/\.[^./]+$/, '')
}

export function UploadDropzone() {
  const addTrack = useLibraryStore((state) => state.addTrack)
  const [isDragging, setIsDragging] = useState(false)
  const [isImporting, setIsImporting] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const importFiles = useCallback(
    async (files: FileList | File[]) => {
      const audioFiles = Array.from(files).filter((file) => file.type.startsWith('audio/'))
      if (audioFiles.length === 0) return

      setIsImporting(true)
      for (const file of audioFiles) {
        const duration = await readDuration(file)
        const track: Track = {
          id: crypto.randomUUID(),
          name: stripExtension(file.name),
          blob: file,
          mimeType: file.type,
          duration,
          bpm: null,
          favorite: false,
          addedAt: Date.now(),
        }
        await addTrack(track)
      }
      setIsImporting(false)
    },
    [addTrack],
  )

  const handleDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      event.preventDefault()
      setIsDragging(false)
      void importFiles(event.dataTransfer.files)
    },
    [importFiles],
  )

  return (
    <div
      className="upload-dropzone"
      data-dragging={isDragging}
      onDragOver={(event) => {
        event.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') inputRef.current?.click()
      }}
    >
      <input
        ref={inputRef}
        type="file"
        accept="audio/*"
        multiple
        hidden
        onChange={(event) => {
          if (event.target.files) void importFiles(event.target.files)
          event.target.value = ''
        }}
      />
      <span className="upload-dropzone__icon">+</span>
      <span className="upload-dropzone__text">
        {isImporting ? 'Importing…' : 'Drop audio files or click to import'}
      </span>
    </div>
  )
}
