# Iqtibos Mode with Tab Switcher — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an "Iqtibos" quote poster mode with a tab switcher in the top bar, sharing background/customization settings with the existing Namoz vaqtlari mode.

**Architecture:** Extend the existing PosterConfig with Iqtibos fields and a mode discriminator. Add a two-tab switcher in the header. The App conditionally renders either the prayer-time form or the quote form. Poster.tsx conditionally renders either the prayer-table layout or the quote layout, reusing the same background/decorations.

**Tech Stack:** React 18, TypeScript, Vite, SVG (no new dependencies)

## Global Constraints

- All processing stays client-side; no server uploads
- SVG dimensions: 1080 × 1440 px (unchanged)
- Export formats: SVG and PNG (unchanged)
- Responsive breakpoints preserved
- Match existing code style: inline JSX, short variable names, same comment density
- No new files — all changes fit in the existing 4 source files

---

### Task 1: Extend types with Iqtibos fields and mode discriminator

**Files:**
- Modify: `src/types.ts` (entire file)

**Interfaces:**
- Produces: `PosterMode = 'namoz' | 'iqtibos'`, `IqtibosContent` type, updated `PosterConfig` with `mode`, `quoteText`, `author`, `additionalInfo`

- [ ] **Step 1: Add new types to types.ts**

Replace the contents of `src/types.ts`:

```typescript
export type Prayer = { name: string; azon: string; takbir: string };
export type PosterMode = 'namoz' | 'iqtibos';
export type IqtibosContent = { quoteText: string; author: string; additionalInfo: string };
export type Background = { id: string; name: string; light: boolean; kind: string; source?: string };
export type PosterConfig = {
  mode: PosterMode;
  mosqueName: string; title: string; prayers: Prayer[]; background: Background;
  liquidGlass: boolean; overlay: number; backgroundPosition: string;
  backgroundZoom: number; brightness: number; telegram: string;
  quoteText: string; author: string; additionalInfo: string;
};
```

- [ ] **Step 2: Commit**

```bash
git add src/types.ts
git commit -m "feat: add PosterMode and IqtibosContent types to PosterConfig"
```

---

### Task 2: Add initial Iqtibos state and tab switcher in App

**Files:**
- Modify: `src/App.tsx` (lines 1-37, entire file)
- Modify: `src/styles.css` (append tab switcher styles)

**Interfaces:**
- Consumes: `PosterMode`, updated `PosterConfig` from Task 1
- Produces: `setMode` callback, mode-aware `initial` config, `ModeSwitcher` in header, mode-conditional form rendering stubs

- [ ] **Step 1: Update initial state in App.tsx to include Iqtibos fields**

Edit `src/App.tsx` — change the `initial` object and add mode handling after state declarations:

Find:
```typescript
const initial: PosterConfig = { mosqueName:'Uch tegirmon jome masjidi', title:'Namoz Vaqtlari', telegram:'@uchtegirmonmasjidi', prayers:[
  {name:'Bomdod',azon:'04:20',takbir:'04:40'}, {name:'Peshin',azon:'12:35',takbir:'12:50'},
  {name:'Asr',azon:'17:15',takbir:'17:30'}, {name:'Shom',azon:'19:45',takbir:'19:50'}, {name:'Xufton',azon:'21:10',takbir:'21:25'}
], background:backgrounds[0], liquidGlass:true, overlay:22, backgroundPosition:'center', backgroundZoom:100, brightness:100 };
```

Replace with:
```typescript
const initial: PosterConfig = {
  mode:'namoz',
  mosqueName:'Uch tegirmon jome masjidi', title:'Namoz Vaqtlari', telegram:'@uchtegirmonmasjidi',
  prayers:[
    {name:'Bomdod',azon:'04:20',takbir:'04:40'}, {name:'Peshin',azon:'12:35',takbir:'12:50'},
    {name:'Asr',azon:'17:15',takbir:'17:30'}, {name:'Shom',azon:'19:45',takbir:'19:50'}, {name:'Xufton',azon:'21:10',takbir:'21:25'}
  ],
  background:backgrounds[0], liquidGlass:true, overlay:22, backgroundPosition:'center', backgroundZoom:100, brightness:100,
  quoteText:'', author:'', additionalInfo:''
};
```

- [ ] **Step 2: Add mode switch handler and update title on mode change**

Find:
```typescript
const [config,setConfig]=useState(initial); const [advanced,setAdvanced]=useState(false); const svgRef=useRef<SVGSVGElement>(null);
```

Replace with:
```typescript
const [config,setConfig]=useState(initial); const [advanced,setAdvanced]=useState(false); const svgRef=useRef<SVGSVGElement>(null);
const setMode=(mode:PosterMode)=>setConfig(c=>({...c,mode,title:mode==='namoz'?'Namoz Vaqtlari':'Iqtibos'}));
```

- [ ] **Step 3: Add ModeSwitcher to the header**

In `src/App.tsx`, find the header line:
```tsx
<header className="topbar"><div className="brand"><span className="brandmark">◒</span><span>Vaqt<span>Poster</span></span></div><p>Namoz jadvalini bir daqiqada tayyorlang</p><span className="saved">● &nbsp; Barcha o‘zgarishlar saqlanadi</span></header>
```

Replace with:
```tsx
<header className="topbar"><div className="brand"><span className="brandmark">◒</span><span>Vaqt<span>Poster</span></span></div><div className="mode-switcher"><button className={config.mode==='namoz'?'active':''} onClick={()=>setMode('namoz')}>Namoz vaqtlari</button><button className={config.mode==='iqtibos'?'active':''} onClick={()=>setMode('iqtibos')}>Iqtibos</button></div><p>{config.mode==='namoz'?'Namoz jadvalini bir daqiqada tayyorlang':'Iqtiboslar uchun postlar tayyorlang'}</p><span className="saved">● &nbsp; Barcha o‘zgarishlar saqlanadi</span></header>
```

- [ ] **Step 4: Add tab switcher CSS to styles.css**

Append to `src/styles.css`:

```css
.mode-switcher{display:flex;background:rgba(0,0,0,.04);border-radius:10px;padding:3px;gap:2px}.mode-switcher button{border:0;background:transparent;color:#5c6762;font-size:12px;font-weight:600;padding:7px 16px;border-radius:8px;transition:all .2s}.mode-switcher button:hover{color:#26332e}.mode-switcher button.active{background:#fff;color:#147a66;box-shadow:0 1px 2px rgba(0,0,0,.08),0 1px 0 rgba(0,0,0,.04)}@media(max-width:900px){.mode-switcher button{font-size:11px;padding:6px 10px}}
```

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: add ModeSwitcher tab toggle in header with Iqtibos mode support"
```

---

### Task 3: Conditionally render Iqtibos form in place of prayer-time form

**Files:**
- Modify: `src/App.tsx` (the controls section, lines 25-37 area)
- Modify: `src/styles.css` (append textarea styles)

**Interfaces:**
- Consumes: `config.mode`, `config.quoteText`, `config.author`, `config.additionalInfo` from Tasks 1-2
- Produces: Iqtibos form UI with textarea and inputs, character counters

- [ ] **Step 1: Conditionally render Iqtibos form cards when mode is 'iqtibos'**

In `src/App.tsx`, find the controls section. The section that starts with the intro and card for mosque name (lines 27-29 area), and the prayer table (line 29). Replace the first two cards (Masjid + Namoz vaqtlari) with mode-conditional rendering.

Find:
```tsx
<section className="controls">
  <div className="intro"><div><span className="eyebrow">POSTER SOZLAMALARI</span><h1>Namoz vaqtlari</h1></div><div className="step">1 <span>/ 3</span></div></div>
  <div className="card"><h2><span>01</span> Masjid</h2><label>Masjid nomi<input value={config.mosqueName} onChange={e=>update('mosqueName',e.target.value)} maxLength={45}/></label><small>{config.mosqueName.length}/45 belgi</small></div>
  <div className="card"><h2><span>02</span> Namoz vaqtlari</h2><div className="table-head"><span>Namoz</span><span>Azon</span><span>Takbir</span></div>{config.prayers.map((p,i)=><div className="prayer-input" key={p.name}><b><i>{i+1}</i>{p.name}</b><input type="time" value={p.azon} onChange={e=>editPrayer(i,'azon',e.target.value)}/><input type="time" value={p.takbir} onChange={e=>editPrayer(i,'takbir',e.target.value)}/></div>)}</div>
```

Replace with:
```tsx
<section className="controls">
  <div className="intro"><div><span className="eyebrow">POSTER SOZLAMALARI</span><h1>{config.mode==='namoz'?'Namoz vaqtlari':'Iqtibos'}</h1></div><div className="step">1 <span>/ 3</span></div></div>
  {config.mode==='namoz'?<>
    <div className="card"><h2><span>01</span> Masjid</h2><label>Masjid nomi<input value={config.mosqueName} onChange={e=>update('mosqueName',e.target.value)} maxLength={45}/></label><small>{config.mosqueName.length}/45 belgi</small></div>
    <div className="card"><h2><span>02</span> Namoz vaqtlari</h2><div className="table-head"><span>Namoz</span><span>Azon</span><span>Takbir</span></div>{config.prayers.map((p,i)=><div className="prayer-input" key={p.name}><b><i>{i+1}</i>{p.name}</b><input type="time" value={p.azon} onChange={e=>editPrayer(i,'azon',e.target.value)}/><input type="time" value={p.takbir} onChange={e=>editPrayer(i,'takbir',e.target.value)}/></div>)}</div>
  </>:<>
    <div className="card"><h2><span>01</span> Iqtibos matni</h2><textarea value={config.quoteText} onChange={e=>update('quoteText',e.target.value)} maxLength={500} placeholder="Iqtibos matnini kiriting..." rows={4}/><small>{config.quoteText.length}/500 belgi</small></div>
    <div className="card"><h2><span>02</span> Muallif</h2><label>Muallif ismi<input value={config.author} onChange={e=>update('author',e.target.value)} maxLength={80} placeholder="Kim aytgan?"/></label><small>{config.author.length}/80 belgi</small></div>
    <div className="card"><h2><span>03</span> Qo‘shimcha ma'lumot</h2><label>Kitob, sana yoki izoh<input value={config.additionalInfo} onChange={e=>update('additionalInfo',e.target.value)} maxLength={120} placeholder="Kitob nomi, sana..."/></label><small>{config.additionalInfo.length}/120 belgi</small></div>
  </>}
```

Note: the Fon (background) card, Liquid Glass toggle, and advanced settings remain below and are shared — no change needed there.

- [ ] **Step 2: Add textarea styles to styles.css**

Append to `src/styles.css`:

```css
.card textarea{display:block;width:100%;margin-top:8px;border:1px solid #d9dfdb;border-radius:9px;padding:12px 13px;outline:none;font:inherit;font-size:14px;resize:vertical;min-height:100px;background:rgba(255,255,255,.54);box-shadow:inset 0 1px 1px rgba(255,255,255,.9),0 4px 12px rgba(35,77,61,.035)}.card textarea:focus{border-color:#258a74;box-shadow:0 0 0 3px #dff0eb}.card textarea::placeholder{color:#aab5b0}
```

- [ ] **Step 3: Commit**

```bash
git add src/App.tsx src/styles.css
git commit -m "feat: add Iqtibos form with textarea and author inputs, conditional on mode"
```

---

### Task 4: Render Iqtibos poster layout in Poster.tsx

**Files:**
- Modify: `src/Poster.tsx` (entire file, adding conditional rendering for quote layout)
- Modify: `src/styles.css` (no changes — the poster is pure SVG)

**Interfaces:**
- Consumes: `config.mode`, `config.quoteText`, `config.author`, `config.additionalInfo` from Tasks 1-3
- Produces: Iqtibos SVG poster with quote text, author, additional info in the card area

- [ ] **Step 1: Add Iqtibos poster content rendering in Poster.tsx**

In `src/Poster.tsx`, find the poster content section (the `<g>` elements that render the card title, AZON/TAKBIR headers, and prayer rows). Replace the section between the `</g>` of the card rect (closing `</g>` after the Liquid Glass decorative paths) and the Telegram section at the bottom.

Find the block starting with:
```tsx
<g fill={ink}>
  <text x="480" y="385" fontSize="22" fontWeight="700" letterSpacing="4" fill={muted} textAnchor="middle">AZON</text>
  <text x="790" y="385" fontSize="22" fontWeight="700" letterSpacing="4" fill={muted} textAnchor="middle">TAKBIR</text>
  {prayers.map((p,i) => { const y=455+i*151; return <g key={p.name}>
    {i>0 && <line x1="145" y1={y-82} x2="935" y2={y-82} stroke={ink} strokeOpacity={liquidGlass?'.16':'.12'}/>} 
    <circle cx="166" cy={y-8} r="5" fill={darkText?'#238269':'#75ddbd'}/>
    <text x="195" y={y} fontSize="35" fontWeight="650">{p.name}</text>
    <text x="480" y={y+6} fontSize="54" fontWeight="750" letterSpacing="1" textAnchor="middle">{p.azon}</text>
    <text x="790" y={y+6} fontSize="54" fontWeight="750" letterSpacing="1" textAnchor="middle">{p.takbir}</text>
  </g>})}
</g>
```

Replace with:
```tsx
{config.mode==='namoz'?<g fill={ink}>
  <text x="480" y="385" fontSize="22" fontWeight="700" letterSpacing="4" fill={muted} textAnchor="middle">AZON</text>
  <text x="790" y="385" fontSize="22" fontWeight="700" letterSpacing="4" fill={muted} textAnchor="middle">TAKBIR</text>
  {prayers.map((p,i) => { const y=455+i*151; return <g key={p.name}>
    {i>0 && <line x1="145" y1={y-82} x2="935" y2={y-82} stroke={ink} strokeOpacity={liquidGlass?'.16':'.12'}/>} 
    <circle cx="166" cy={y-8} r="5" fill={darkText?'#238269':'#75ddbd'}/>
    <text x="195" y={y} fontSize="35" fontWeight="650">{p.name}</text>
    <text x="480" y={y+6} fontSize="54" fontWeight="750" letterSpacing="1" textAnchor="middle">{p.azon}</text>
    <text x="790" y={y+6} fontSize="54" fontWeight="750" letterSpacing="1" textAnchor="middle">{p.takbir}</text>
  </g>})}
</g>:<g fill={ink}>
  <text x="540" y="450" fontSize="72" fontWeight="200" fill={muted} textAnchor="middle" opacity=".6">"</text>
  {wrapText(config.quoteText,900,44).map((line,i)=><text key={i} x="540" y={530+i*52} fontSize="36" fontWeight="550" textAnchor="middle" letterSpacing="-.3" fill={ink}>{line}</text>)}
  <line x1="350" y1={780} x2="730" y2={780} stroke={muted} strokeOpacity=".4" strokeWidth="1"/>
  <text x="540" y="830" fontSize="27" fontWeight="600" textAnchor="middle" fill={ink}>— {config.author||'Muallif'}</text>
  {config.additionalInfo?<text x="540" y="870" fontSize="19" fontWeight="400" textAnchor="middle" fill={muted}>{config.additionalInfo}</text>:null}
</g>}
```

- [ ] **Step 2: Add the wrapText helper function at the top of Poster.tsx**

Add after the `hijriMonths` array (before `function posterDates()`):
```typescript
function wrapText(text: string, maxWidth: number, fontSize: number): string[] {
  const avgCharWidth = fontSize * 0.58;
  const maxChars = Math.floor(maxWidth / avgCharWidth);
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';
  for (const word of words) {
    const test = current ? current + ' ' + word : word;
    if (test.length > maxChars && current) { lines.push(current); current = word; }
    else { current = test; }
  }
  if (current) lines.push(current);
  return lines.length ? lines : [''];
}
```

- [ ] **Step 3: Verify the poster renders correctly in the browser**

Run the dev server and visually check both modes render:
```bash
npm run dev
```

Open in browser. Switch tabs — Namoz vaqtlari poster should render unchanged. Iqtibos poster should show quote text centered with decorative quote mark, author, and additional info.

- [ ] **Step 4: Commit**

```bash
git add src/Poster.tsx
git commit -m "feat: add Iqtibos poster SVG layout with quote text and author rendering"
```

---

### Task 5: Update download filenames per mode

**Files:**
- Modify: `src/App.tsx` (the `save` and download button area, lines 19-21)

**Interfaces:**
- Consumes: `config.mode`, `config.author`, `config.mosqueName` from Tasks 1-4
- Produces: mode-aware download filenames

- [ ] **Step 1: Update save function filename logic**

In `src/App.tsx`, find:
```typescript
const save=(blob:Blob,ext:string)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`namoz-vaqtlari-${slug(config.mosqueName)||'masjid'}.${ext}`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
```

Replace with:
```typescript
const save=(blob:Blob,ext:string)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);const fname=config.mode==='namoz'?`namoz-vaqtlari-${slug(config.mosqueName)||'masjid'}.${ext}`:`iqtibos-${slug(config.author)||'muallif'}.${ext}`;a.download=fname;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
```

- [ ] **Step 2: Commit**

```bash
git add src/App.tsx
git commit -m "feat: use mode-aware download filenames for namoz and iqtibos posters"
```

---

### Task 6: Verify end-to-end and final polish

**Files:**
- Read: `src/App.tsx`, `src/Poster.tsx`, `src/styles.css`, `src/types.ts`

**Interfaces:**
- Consumes: All completed tasks
- Produces: Verified working feature

- [ ] **Step 1: Run TypeScript compiler to check for errors**

```bash
npx tsc --noEmit
```

Expected: No errors. Fix any type errors if they appear.

- [ ] **Step 2: Build the project**

```bash
npm run build
```

Expected: Clean build with no errors.

- [ ] **Step 3: Visually verify in dev server**

```bash
npm run dev
```

Checklist:
- [ ] Tab switcher visible in header between brand and description
- [ ] Clicking "Namoz vaqtlari" shows prayer form, poster renders prayer table
- [ ] Clicking "Iqtibos" shows quote form (textarea, author, additional info), poster renders quote layout
- [ ] Switching tabs preserves background, Liquid Glass, and advanced settings
- [ ] Character counters update for quote text, author, additional info
- [ ] Background picker works in both modes
- [ ] Download buttons produce correct filenames per mode
- [ ] Responsive layout works (resize to mobile width)

- [ ] **Step 4: Commit any final fixes**

```bash
git add -A
git commit -m "chore: final polish and verification of Iqtibos mode"
```
