# Config Persistence + Telegram Username Input — Design Spec

**Date:** 2026-08-18
**Status:** Approved

## Overview

Two related improvements to VaqtPoster:

1. **Persistence** — persist the entire `PosterConfig` to `localStorage` and restore it on load, so a returning user does not re-enter the Telegram username (or anything else) on every visit.
2. **Telegram input** — the `telegram` field already exists in `PosterConfig` and renders on the poster footer for both modes, but there is currently no UI to edit it (it is hardcoded to `@uchtegirmonmasjidi`). Add an editable field visible in both modes.

A third, smaller change: make the developer credit line in the header legible and clickable.

## Background / Current State

- `PosterConfig.telegram` is defined in `src/types.ts`, initialized in `src/App.tsx`, and rendered at `src/Poster.tsx:97` (the Telegram footer, common to both `namoz` and `iqtibos` modes).
- There is **no** persistence anywhere in the app today (`localStorage`/`sessionStorage` are unused). The header already claims *"Barcha o'zgarishlar saqlanadi"* ("all changes are saved"), which is currently false — reloading resets everything to `initial`.
- The developer credit is an inline `<span style={{fontSize:'10px',color:'#9aa39f'}}>` inside the header `<p>`, effectively invisible.

## Design

### 1. Persist the whole config

- Storage key: `vaqtposter.config.v1`.
- **Load** — lazy `useState` initializer:
  - `JSON.parse(localStorage.getItem(key))` inside `try/catch`.
  - Merge over `initial` (`{ ...initial, ...parsed }`) so any field missing from a stale/corrupt save falls back to its default.
  - Validate `prayers` is a 5-item array of well-shaped `Prayer` objects and `background` has a truthy `id`; otherwise fall back to `initial.prayers` / `initial.background`.
  - Any parse error → return `initial`.
- **Save** — `useEffect` on `[config]`:
  - `localStorage.setItem(key, JSON.stringify(config))` in `try/catch`.
  - On `QuotaExceededError`, retry once with `background.source` stripped when it is an uploaded `data:` URL (Unsplash `https://` sources are kept). This guarantees telegram + all text/toggles persist even if a huge uploaded photo would overflow the ~5 MB quota; the photo itself simply won't restore (user re-uploads).

No new dependencies. No new UI for save/load (auto-save).

### 2. Telegram username input (both modes)

- New `.card` titled **Telegram**, rendered in both `namoz` and `iqtibos` modes, placed between the mode-specific cards and the **Fon** card.
- Single `<input>` bound to `config.telegram` via the existing `update` helper: `maxLength={32}`, `placeholder="@username"`, with a character counter (matching existing cards).
- Numbering: Telegram card is `04`; **Fon** renumbers `04 → 05`. (The `03` gap in Namoz mode is pre-existing and out of scope.)
- No change to `Poster.tsx` — the footer already renders `config.telegram`.

### 3. Credit line (legible + clickable)

- Replace the inline 10px gray `<span>` with a `.credit` line:
  **`Dasturlovchi: Bahriddin · bahriddin.me@gmail.com`**, with the name + email wrapped in a single `mailto:bahriddin.me@gmail.com` link.
- New `.credit` CSS rules (11px, `font-weight:600`, green `#16866f` link with subtle underline, darker on hover), appended to `src/styles.css`.
- Stays inside the existing header `<p>`, so it continues to hide on mobile (`@media (max-width: 900px)` hides `.topbar p`) like the subtitle.
- No developer Telegram link — handle not provided.

## Components / Files Touched

| File | Change |
|------|--------|
| `src/App.tsx` | Lazy-init state from `localStorage`; `useEffect` auto-save; add Telegram card; renumber Fon `04→05`; replace credit `<span>` |
| `src/types.ts` | No change (field already exists) |
| `src/Poster.tsx` | No change |
| `src/styles.css` | Add `.credit` rules |
| `src/backgrounds.tsx` | No change |

## Error Handling

- Corrupt / unparseable / partial saved state → defaults, no crash.
- `localStorage` unavailable (private mode throwing on `setItem`) → swallowed by `try/catch`, app runs with in-memory state only.
- Quota exceeded → retry without uploaded photo source.

## Testing

- Type-check: `npx tsc --noEmit`.
- Manual: change telegram/mosque/quote → reload → values persist; set a huge uploaded background → reload → text persists, photo resets to a preset; corrupt the key in devtools → app loads with defaults; verify credit link opens the mail client.

## Out of Scope

- Hiding/removing the Telegram footer on the poster.
- Changing poster layout or any other UI.
- A developer Telegram link (no handle supplied).
