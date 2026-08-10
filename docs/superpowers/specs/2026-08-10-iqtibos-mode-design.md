# Iqtibos Mode with Tab Switcher — Design Spec

**Date:** 2026-08-10
**Status:** Approved

## Overview

Add an "Iqtibos" (Quote) poster mode to the existing VaqtPoster app, with a tab switcher in the top bar that toggles between "Namoz vaqtlari" and "Iqtibos" modes. The Iqtibos form mirrors the Namoz vaqtlari form layout and styling, allowing users to create quote posters with the same background, Liquid Glass, and customization options.

## Modes

| Field | Namoz vaqtlari | Iqtibos |
|-------|---------------|---------|
| `mode` | `'namoz'` | `'iqtibos'` |
| `title` | "Namoz Vaqtlari" | "Iqtibos" |
| Content | 5 prayer rows (name, azon, takbir) | quoteText, author, additionalInfo |
| Background, Liquid Glass, overlay, brightness, zoom | Same (shared) | Same (shared) |

Shared styling fields persist across mode switches. Content fields are mode-specific and preserved independently.

## Components

### 1. Tab Switcher (`ModeSwitcher`)
- Location: Top bar, between brand and description
- Two tabs: "Namoz vaqtlari" | "Iqtibos"
- Active tab: green highlight matching brand color (`#16866f`)
- Inactive tab: muted gray, hover effect
- Clicking a tab sets `mode` state

### 2. Iqtibos Form (inside `App.tsx` controls panel)
When `mode === 'iqtibos'`, renders three cards:
- **Card 01 — Iqtibos matni**: `<textarea>` for the quote text, max 500 characters, with character counter
- **Card 02 — Muallif**: `<input type="text">` for author name, max 80 characters
- **Card 03 — Qo'shimcha ma'lumot**: `<input type="text">` for additional info (book, date, context), max 120 characters

The Fon (Background), Liquid Glass, and Advanced Settings cards are shared — identical in both modes.

### 3. Iqtibos Poster SVG (`IqtibosPoster.tsx` or an alternative rendering path in `Poster.tsx`)
Same structure as the Namoz poster:
- Top: Title text
- Decorative line below title
- Card area (900×900 rounded rect with shadow and optional Liquid Glass):
  - Large quote text centered, with decorative quotation marks
  - "— Muallif" below the quote, right-aligned or centered
  - Additional info in smaller muted text at bottom of card
- Bottom: Telegram handle (left) and dates (right)
- Same background rendering, overlay, Liquid Glass effects

### 4. Types (`types.ts`)
```typescript
export type PosterMode = 'namoz' | 'iqtibos';

export type IqtibosContent = {
  quoteText: string;
  author: string;
  additionalInfo: string;
};

// PosterConfig gains:
// mode: PosterMode;
// quoteText: string;
// author: string;
// additionalInfo: string;
```

### 5. Downloads
- Namoz mode: `namoz-vaqtlari-<mosque-slug>.png`
- Iqtibos mode: `iqtibos-<author-slug>.png`

## Files Changed
- `src/types.ts` — Add PosterMode, IqtibosContent, extend PosterConfig
- `src/App.tsx` — ModeSwitcher in header, conditional form rendering, Iqtibos state handling
- `src/Poster.tsx` — Conditional rendering for Iqtibos poster layout
- `src/styles.css` — Tab switcher styles, quote textarea styles

## Non-Functional
- All processing remains client-side (no server uploads)
- SVG dimensions unchanged: 1080 × 1440
- Same export formats: SVG and PNG
- Responsive breakpoints preserved
