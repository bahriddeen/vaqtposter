# Config Persistence + Telegram Input Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Persist the entire `PosterConfig` to `localStorage` (auto-save on change, restore on load), add an editable Telegram username field visible in both modes, and make the header developer credit legible + clickable.

**Architecture:** Two files change — `src/App.tsx` (state, persistence, new Telegram card, credit markup) and `src/styles.css` (`.credit` rule). Persistence is a lazy `useState` initializer (`loadConfig`) plus a `useEffect` on `[config]` (`saveConfig`) with a quota fallback that strips uploaded `data:` image sources. No new files, no new dependencies.

**Tech Stack:** React 18 + TypeScript + Vite. No test framework — verification is `npx tsc --noEmit` plus manual browser checks.

## Global Constraints

- TypeScript strict mode; `npx tsc --noEmit` must exit 0 after every task.
- No new npm dependencies.
- Storage key is exactly `vaqtposter.config.v1`.
- Telegram input `maxLength={32}`, placeholder `@username`.
- Copy stays Uzbek; match the existing compact code style (terse JSX, minified-per-line CSS).
- `src/types.ts`, `src/Poster.tsx`, `src/backgrounds.tsx` are NOT modified.

---

### Task 1: Add Telegram username input card (both modes)

**Files:**
- Modify: `src/App.tsx` (insert card between the mode-conditional block and the "Fon" card; renumber Fon)

**Interfaces:**
- Consumes: `config.telegram` (already on `PosterConfig`) and the existing `update` helper.
- Produces: nothing new — later tasks rely on `config.telegram` being editable here.

- [ ] **Step 1: Insert the Telegram card and renumber Fon**

In `src/App.tsx`, replace this exact block (the end of the mode conditional followed by the Fon card opening):

```tsx
        </>}
        <div className="card"><h2><span>04</span> Fon</h2>
```

with:

```tsx
        </>}
        <div className="card"><h2><span>04</span> Telegram</h2><label>Telegram username<input value={config.telegram} onChange={e=>update('telegram',e.target.value)} maxLength={32} placeholder="@username"/></label><small>{config.telegram.length}/32 belgi</small></div>
        <div className="card"><h2><span>05</span> Fon</h2>
```

(Use the Edit tool; `old_string` must include the leading 8 spaces and trailing `</h2>` exactly as shown. The `<span>04</span> Fon</h2>` string is unique in the file.)

- [ ] **Step 2: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0, no output.

- [ ] **Step 3: Manual verification**

Run: `npm run dev`, open http://localhost:5173.

- In **Namoz vaqtlari** mode, confirm a new "Telegram" card (badge `04`) sits above the "Fon" card (now `05`), with a text input showing `@uchtegirmonmasjidi`.
- Type into the field and confirm the poster footer's Telegram username (bottom-left, next to the Telegram logo) updates live.
- Switch to **Iqtibos** mode and confirm the same Telegram card is present and editable.

- [ ] **Step 4: Commit**

```bash
git add src/App.tsx
git commit -m "feat: add editable telegram username field in both modes"
```

---

### Task 2: Persist the whole config to localStorage

**Files:**
- Modify: `src/App.tsx` (import `useEffect`; add `STORAGE_KEY`, `loadConfig`, `saveConfig`; lazy-init state; add save effect)

**Interfaces:**
- Consumes: `initial` (`PosterConfig`), `backgrounds` (already imported from `./backgrounds`), `PosterConfig` type.
- Produces: module-scope `loadConfig(): PosterConfig` and `saveConfig(config: PosterConfig): void`, used by the App component in this same task.

- [ ] **Step 1: Add the `useEffect` import**

Replace:

```tsx
import { useRef, useState } from 'react';
```

with:

```tsx
import { useRef, useState, useEffect } from 'react';
```

- [ ] **Step 2: Add storage helpers after `initial`**

Replace this exact block (the last field of `initial` followed by its closing brace):

```tsx
  quoteText:'', author:'', additionalInfo:''
};
```

with:

```tsx
  quoteText:'', author:'', additionalInfo:''
};

const STORAGE_KEY = 'vaqtposter.config.v1';
const loadConfig = (): PosterConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const saved = JSON.parse(raw);
    const prayers = Array.isArray(saved.prayers) && saved.prayers.length === 5 && saved.prayers.every((p:any)=>p && typeof p.name==='string' && typeof p.azon==='string' && typeof p.takbir==='string') ? saved.prayers : initial.prayers;
    const background = saved.background && typeof saved.background.id==='string' && (saved.background.source || backgrounds.some(b=>b.id===saved.background.id)) ? saved.background : initial.background;
    return { ...initial, ...saved, prayers, background };
  } catch { return initial; }
};
const saveConfig = (config: PosterConfig) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); }
  catch {
    try {
      const stripped = config.background.source?.startsWith('data:') ? { ...config, background: { ...config.background, source: undefined } } : config;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stripped));
    } catch {}
  }
};
```

- [ ] **Step 3: Lazy-init state and add the save effect**

Replace this exact block:

```tsx
  const [config,setConfig]=useState(initial); const [advanced,setAdvanced]=useState(false); const svgRef=useRef<SVGSVGElement>(null);
const setMode=(mode:PosterMode)=>setConfig(c=>({...c,mode,title:mode==='namoz'?'Namoz Vaqtlari':'Iqtibos'}));
```

with:

```tsx
  const [config,setConfig]=useState(loadConfig); const [advanced,setAdvanced]=useState(false); const svgRef=useRef<SVGSVGElement>(null);
  useEffect(()=>{saveConfig(config)},[config]);
const setMode=(mode:PosterMode)=>setConfig(c=>({...c,mode,title:mode==='namoz'?'Namoz Vaqtlari':'Iqtibos'}));
```

Note: `useState(loadConfig)` passes the function as a lazy initializer (runs once), NOT the result of calling it.

- [ ] **Step 4: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0, no output.

- [ ] **Step 5: Manual verification**

Run: `npm run dev`, open http://localhost:5173.

- Change the Telegram username, mosque name, and a prayer time. Reload the page (Cmd/Ctrl+R). Confirm all three values persist.
- Set a preset background, toggle Liquid Glass off, reload — confirm they persist.
- Open devtools → Application → Local Storage, confirm key `vaqtposter.config.v1` exists and holds the config JSON.
- In devtools console, run `localStorage.setItem('vaqtposter.config.v1','{bad json')`, reload — confirm the app loads with defaults and no crash, and the header/credit still render.

- [ ] **Step 6: Commit**

```bash
git add src/App.tsx
git commit -m "feat: persist poster config to localStorage across visits"
```

---

### Task 3: Make the developer credit legible + clickable

**Files:**
- Modify: `src/App.tsx` (replace the credit `<span>` in the header)
- Modify: `src/styles.css` (append `.credit` rules)

**Interfaces:**
- Consumes: nothing new — pure markup + CSS.
- Produces: nothing new.

- [ ] **Step 1: Replace the credit markup**

In `src/App.tsx`, replace:

```tsx
<span style={{fontSize:'10px',color:'#9aa39f'}}>Dasturlovchi Bahriddin &nbsp; bahriddin.me@gmail.com</span>
```

with:

```tsx
<span className="credit">Dasturlovchi: <a href="mailto:bahriddin.me@gmail.com">Bahriddin · bahriddin.me@gmail.com</a></span>
```

- [ ] **Step 2: Append the `.credit` CSS rule**

In `src/styles.css`, append the following as a new line at the end of the file (after the `.unsplash-thumb.active:after{...}` line):

```css
.credit{font-size:11px;color:#55615b;font-weight:600}.credit a{color:#16866f;text-decoration:none;border-bottom:1px solid #bcd9cf}.credit a:hover{color:#0f6d59;border-bottom-color:#0f6d59}
```

(Use the Edit tool: match the final segment `...display:grid;place-items:center}` of the last `.unsplash-thumb.active:after{...}` line and append the new rule after it, or use `printf` to append a newline-terminated line.)

- [ ] **Step 3: Type-check**

Run: `npx tsc --noEmit`
Expected: exit 0, no output.

- [ ] **Step 4: Manual verification**

Run: `npm run dev`, open http://localhost:5173.

- In the header, confirm the line now reads "Dasturlovchi: Bahriddin · bahriddin.me@gmail.com", visibly larger/darker than before, with the email in green and underlined on hover.
- Click the link and confirm it opens the mail client targeting `bahriddin.me@gmail.com`.
- Resize the window below 900px and confirm the credit line hides (with the rest of `.topbar p`), matching existing behavior.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "style: make developer credit line legible and clickable"
```

---

## Self-Review Notes

- **Spec coverage:** Persistence (Task 2), Telegram input both modes (Task 1), credit line (Task 3), quota fallback + sanitize (Task 2), Fon renumber (Task 1). All spec sections covered.
- **Placeholder scan:** none — all code blocks are complete.
- **Type consistency:** `loadConfig`/`saveConfig` signatures match their call sites (`useState(loadConfig)`, `useEffect(()=>{saveConfig(config)},[config])`); `PosterConfig`, `initial`, `backgrounds`, and `update` are all pre-existing.
