# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install          # Install dependencies
npm run dev          # Start dev server (Vite, http://localhost:5173)
npm run build        # TypeScript check + production build
npx tsc --noEmit     # TypeScript type-check only
```

## Architecture

VaqtPoster is a single-page React + TypeScript + Vite app that generates prayer-time and quote posters as SVG, exportable to PNG. No router, no server — all state lives in React and exports happen client-side via `XMLSerializer` + canvas.

### State model

All configuration lives in one `PosterConfig` object (`src/types.ts`) held in `App.tsx` via `useState`. The `mode` field (`'namoz' | 'iqtibos'`) determines which form fields and which poster layout render. Both modes' data coexist in the same config object, so switching tabs preserves all state. The `update` helper is a generic single-key updater: `update('mosqueName', value)`.

### Poster rendering (`src/Poster.tsx`)

The poster is an `<svg viewBox="0 0 1080 1440">` rendered in the DOM. Export works by cloning the SVG node, serializing with `XMLSerializer`, then either downloading as `.svg` directly or rasterizing to PNG via a `<canvas>`. The `Poster` component conditionally renders either the namoz prayer-table layout or the iqtibos quote layout based on `config.mode`.

**Key poster internals:**
- `wrapText(text, maxWidth, fontSize, maxLines)` — word-wrap for quote text; respects `\n` as hard line breaks; max-width estimate uses `fontSize * 0.58` per char
- `useGlass = config.glassUI && config.liquidGlass` — only when both are on do Liquid Glass effects (glow, glass gradients, decorative paths) render. When `glassUI` is off, the card frame is hidden entirely (text directly on background). When `glassUI` is on but `liquidGlass` is off, the card shows with a flat fill.
- Brightness: overlay rects — black rect for values < 100, white rect for > 100, opacity scaled linearly
- Background: `<BackgroundArt>` SVG components or uploaded `<image>`, with `backgroundZoom` via centered scale transform

### Background art (`src/backgrounds.tsx`)

Six preset backgrounds (emerald, night, sunset, azure, sand, light) plus custom image upload. Each preset is an SVG composition with gradients, patterns, and a `MosqueScene` component. The `light` boolean on each background determines the text color palette (dark text on light backgrounds, white text on dark).

### Styling (`src/styles.css`)

Single minified-per-line CSS file. The glass-morphism material system (lines 6-9) uses `backdrop-filter`, inset box-shadows, and semi-transparent backgrounds on `.topbar`, `.card`, `.poster-wrap`, and export buttons. Two responsive breakpoints: 900px (tablet) and 540px (mobile).

### Mode switcher

A `.mode-switcher` in the header with two tab buttons. Active tab gets white background + green text (`#16866f`). The subtitle text below changes per mode.
