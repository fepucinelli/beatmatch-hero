# Beatmatch Hero

A minimalist, installable web app for practicing beatmatching — two turntable-style decks with real, continuous pitch/tempo faders, right in the browser. No streaming account, no backend: import your own tracks and train your ear.

**Live app:** [beatmatch-hero.vercel.app](https://beatmatch-hero.vercel.app)

## Why local files

Streaming APIs (Spotify, Deezer, YouTube) either don't expose raw audio for manipulation or are DRM-protected, so a pitch fader dragged against one of them can't actually change playback speed — at best it's cosmetic. Beatmatch Hero instead uses the **Web Audio API** directly against locally imported audio files, so every fader move produces a real, audible, continuous change in speed and pitch — exactly like a real turntable pitch fader (no keylock: speed up the track and the pitch rises with it, just like vinyl).

## Features

- **Two independent decks (A / B)**, each with:
  - A vertical pitch fader styled after real hardware — tick marks, center detent, draggable or keyboard-operable (`↑`/`↓`, `Shift` for larger steps, `Home` to reset)
  - Switchable pitch range: **±8%** (standard) or **±16%** (wide)
  - Play / Pause and a **Cue** button that returns to the beginning of the track
  - A spinning platter that only turns while playing, current time / total duration readout with a progress bar
  - Manual BPM entry plus **tap tempo**, with a live "effective BPM" readout (base BPM × pitch offset)
- **Local library** — drag-and-drop or click to import audio files, stored entirely in the browser (IndexedDB), searchable, with per-track favorites
- **Playlists** — create, rename, delete, add/remove tracks, favorite playlists
- **Installable PWA** — works fully offline once loaded, including previously imported tracks
- Ships with a starter playlist, **"Royalty Free Songs"**, pre-loaded with two tracks so there's something to mix on first launch

## Tech stack

- [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) + [Vite](https://vite.dev/)
- [Zustand](https://github.com/pmndrs/zustand) for state (decks, library, playlists)
- [idb](https://github.com/jakearchibald/idb) — IndexedDB wrapper for track blobs, metadata, and playlists
- Native **Web Audio API** (`HTMLAudioElement` → `MediaElementAudioSourceNode` → `GainNode`) for the pitch/tempo engine — no external DSP library
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) — offline service worker + installable manifest
- [Vitest](https://vitest.dev/) for unit tests
- Deployed on [Vercel](https://vercel.com/)

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL, import an audio file (or use the pre-loaded "Royalty Free Songs" playlist), load it onto a deck, and hit play.

### Other scripts

```bash
npm run build     # type-check + production build
npm run preview   # serve the production build locally
npm test          # run the unit test suite (Vitest)
npm run lint       # lint with oxlint
```

## Project structure

```
src/
  audio/        # pitch math, tap-tempo calculation, the per-deck Web Audio engine hook
  components/
    Deck/        # platter, pitch fader, play/cue buttons, BPM control
    Library/      # upload, search, track list
    Playlists/     # playlist list/detail, creation
  store/         # Zustand stores: decks, library, playlists
  db/            # IndexedDB schema/CRUD + first-run seed data
  utils/         # small shared helpers (time formatting, audio duration)
```

## Notes

- All audio processing happens client-side in the browser; imported tracks never leave the device.
- The pitch fader intentionally has **no keylock** — pitch moves with speed, matching real turntable/mixer behavior.
- The two bundled tracks in the default "Royalty Free Songs" playlist are included for out-of-the-box testing.
