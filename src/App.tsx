import { useRef, useState, useEffect } from 'react';
import { Download, ImagePlus, SlidersHorizontal, Sparkles, Upload, ChevronDown, EyeOff, Search, Loader2 } from 'lucide-react';
import { BackgroundArt, backgrounds } from './backgrounds';
import { Poster } from './Poster';
import type { PosterConfig, PosterMode } from './types';

const initial: PosterConfig = {
  mode:'namoz',
  mosqueName:'Uch tegirmon jome masjidi', title:'Namoz Vaqtlari', telegram:'@uchtegirmonmasjidi',
  prayers:[
    {name:'Bomdod',azon:'04:20',takbir:'04:40'}, {name:'Peshin',azon:'12:35',takbir:'12:50'},
    {name:'Asr',azon:'17:15',takbir:'17:30'}, {name:'Shom',azon:'19:45',takbir:'19:50'}, {name:'Xufton',azon:'21:10',takbir:'21:25'}
  ],
  background:backgrounds[0], liquidGlass:true, glassUI:true, overlay:22, backgroundPosition:'center', backgroundZoom:100, brightness:100,
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

const slug = (s:string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export function App(){
  const [config,setConfig]=useState(loadConfig); const [advanced,setAdvanced]=useState(false); const svgRef=useRef<SVGSVGElement>(null);
  useEffect(()=>{saveConfig(config)},[config]);
const setMode=(mode:PosterMode)=>setConfig(c=>({...c,mode,title:mode==='namoz'?'Namoz Vaqtlari':'Iqtibos'}));
  const update=<K extends keyof PosterConfig>(key:K,value:PosterConfig[K])=>setConfig(c=>({...c,[key]:value}));
  const editPrayer=(i:number,key:'azon'|'takbir',value:string)=>update('prayers',config.prayers.map((p,n)=>n===i?{...p,[key]:value}:p));
  const svgText=()=>{const node=svgRef.current!.cloneNode(true) as SVGSVGElement;node.setAttribute('width','1080');node.setAttribute('height','1440');return '<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(node)};
  const save=(blob:Blob,ext:string)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);const fname=config.mode==='namoz'?`namoz-vaqtlari-${slug(config.mosqueName)||'masjid'}.${ext}`:`iqtibos-${slug(config.author)||'muallif'}.${ext}`;a.download=fname;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
  const downloadSvg=()=>save(new Blob([svgText()],{type:'image/svg+xml;charset=utf-8'}),'svg');
  const downloadPng=()=>{const c=document.createElement('canvas');c.width=1080;c.height=1440;const ctx=c.getContext('2d')!;const drawOverlay=()=>{const node=svgRef.current!.cloneNode(true) as SVGSVGElement;const bgImg=node.querySelector('image');if(bgImg)bgImg.remove();node.setAttribute('width','1080');node.setAttribute('height','1440');const svgStr='<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(node);const ov=new Image();ov.onload=()=>{ctx.drawImage(ov,0,0);c.toBlob(b=>b&&save(b,'png'),'image/png',1)};ov.src=URL.createObjectURL(new Blob([svgStr],{type:'image/svg+xml;charset=utf-8'}))};const src=config.background.source;if(src){const bg=new Image();bg.crossOrigin='anonymous';bg.onload=()=>{ctx.drawImage(bg,0,0,1080,1440);drawOverlay()};bg.src=src}else drawOverlay()};
  const upload=(file?:File)=>{if(!file)return;const reader=new FileReader();reader.onload=()=>update('background',{id:'upload',name:'Shaxsiy',light:false,kind:'upload',source:String(reader.result)});reader.readAsDataURL(file)};
  const [unsplashQ,setUnsplashQ]=useState('');const [unsplashR,setUnsplashR]=useState<any[]>([]);const [unsplashB,setUnsplashB]=useState(false);const unsplashT=useRef(0);
  const searchUnsplash=(q:string)=>{setUnsplashQ(q);clearTimeout(unsplashT.current);if(!q.trim()){setUnsplashR([]);return}unsplashT.current=setTimeout(async()=>{setUnsplashB(true);try{const r=await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=8&orientation=portrait`,{headers:{Authorization:`Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}`}});const d=await r.json();setUnsplashR(d.results||[])}catch{}setUnsplashB(false)},400)};
  const pickUnsplash=(img:any)=>{fetch(`https://api.unsplash.com/photos/${img.id}/download`,{method:'POST',headers:{Authorization:`Client-ID ${import.meta.env.VITE_UNSPLASH_KEY}`}}).catch(()=>{});update('background',{id:`unsplash-${img.id}`,name:img.user.name,light:img.color?false:false,kind:'upload',source:img.urls.regular})};
  return <main>
    <header className="topbar"><div className="brand"><span className="brandmark">◒</span><span>Vaqt<span>Poster</span></span></div><div className="mode-switcher"><button className={config.mode==='namoz'?'active':''} onClick={()=>setMode('namoz')}>Namoz vaqtlari</button><button className={config.mode==='iqtibos'?'active':''} onClick={()=>setMode('iqtibos')}>Iqtibos</button></div><p>{config.mode==='namoz'?'Namoz jadvalini bir daqiqada tayyorlang':'Iqtiboslar uchun postlar tayyorlang'}<br/><span className="credit">Dasturlovchi: <a href="mailto:bahriddin.me@gmail.com">Bahriddin · bahriddin.me@gmail.com</a></span></p><span className="saved">● &nbsp; Barcha o‘zgarishlar saqlanadi</span></header>
    <div className="workspace">
      <section className="controls">
        <div className="intro"><div><span className="eyebrow">POSTER SOZLAMALARI</span><h1>{config.mode==='namoz'?'Namoz vaqtlari':'Iqtibos'}</h1></div><div className="step">1 <span>/ 3</span></div></div>
        {config.mode==='namoz'?<>
          <div className="card"><h2><span>01</span> Masjid</h2><label>Masjid nomi<input value={config.mosqueName} onChange={e=>update('mosqueName',e.target.value)} maxLength={45}/></label><small>{config.mosqueName.length}/45 belgi</small></div>
          <div className="card"><h2><span>02</span> Namoz vaqtlari</h2><div className="table-head"><span>Namoz</span><span>Azon</span><span>Takbir</span></div>{config.prayers.map((p,i)=><div className="prayer-input" key={p.name}><b><i>{i+1}</i>{p.name}</b><input type="time" value={p.azon} onChange={e=>editPrayer(i,'azon',e.target.value)}/><input type="time" value={p.takbir} onChange={e=>editPrayer(i,'takbir',e.target.value)}/></div>)}</div>
        </>:<>
          <div className="card"><h2><span>01</span> Iqtibos matni</h2><textarea value={config.quoteText} onChange={e=>update('quoteText',e.target.value)} maxLength={500} placeholder="Iqtibos matnini kiriting..." rows={4}/><small>{config.quoteText.length}/500 belgi</small></div>
          <div className="card"><h2><span>02</span> Muallif</h2><label>Muallif ismi<input value={config.author} onChange={e=>update('author',e.target.value)} maxLength={50} placeholder="Kim aytgan?"/></label><small>{config.author.length}/50 belgi</small></div>
          <div className="card"><h2><span>03</span> Qo‘shimcha ma'lumot</h2><label>Kitob, sana yoki izoh<input value={config.additionalInfo} onChange={e=>update('additionalInfo',e.target.value)} maxLength={80} placeholder="Kitob nomi, sana..."/></label><small>{config.additionalInfo.length}/80 belgi</small></div>
        </>}
        <div className="card"><h2><span>04</span> Telegram</h2><label>Telegram username<input value={config.telegram} onChange={e=>update('telegram',e.target.value)} maxLength={32} placeholder="@username"/></label><small>{config.telegram.length}/32 belgi</small></div>
        <div className="card"><h2><span>05</span> Fon</h2><div className="backgrounds">{backgrounds.map(bg=><button key={bg.id} className={'bg-choice '+(config.background.id===bg.id?'active':'')} onClick={()=>update('background',bg)}><svg viewBox="0 0 1080 1440" preserveAspectRatio="xMidYMid slice">{bg.source?<image href={bg.source} width="1080" height="1440"/>:<BackgroundArt kind={bg.kind} light={bg.light}/>}</svg><span>{bg.name}</span></button>)}<label className="upload"><Upload size={20}/><span>Rasm yuklash</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>upload(e.target.files?.[0])}/></label></div>
        <div className="unsplash-search"><div className="unsplash-input"><Search size={14}/><input value={unsplashQ} onChange={e=>searchUnsplash(e.target.value)} placeholder="Unsplash’dan izlash... (tabiat, masjid, naqsh)"/>{unsplashB&&<Loader2 size={14} className="spin"/>}</div>{unsplashR.length>0&&<div className="unsplash-results">{unsplashR.map((img:any)=><button key={img.id} className={'unsplash-thumb '+(config.background.id===`unsplash-${img.id}`?'active':'')} onClick={()=>pickUnsplash(img)}><img src={img.urls.thumb} alt={img.alt_description||''} loading="lazy"/><span>{img.user.name}</span></button>)}</div>}</div></div>
        <div className="card style-card"><div><h2><Sparkles size={19}/> Liquid Glass</h2><p>Zamonaviy shaffof shisha effekti</p></div><button className={'toggle '+(config.liquidGlass?'on':'')} onClick={()=>update('liquidGlass',!config.liquidGlass)} aria-label="Liquid Glass"><span/></button></div>
        <div className="card style-card"><div><h2><EyeOff size={19}/> Shisha Interfeys</h2><p>To‘liq shisha rejimni o‘chirish</p></div><button className={'toggle '+(config.glassUI?'on':'')} onClick={()=>update('glassUI',!config.glassUI)} aria-label="Shisha Interfeys"><span/></button></div>
        <button className="advanced" onClick={()=>setAdvanced(!advanced)}><SlidersHorizontal size={18}/> Qo‘shimcha sozlamalar <ChevronDown className={advanced?'rotated':''} size={18}/></button>
        {advanced&&<div className="card range-card"><label>Qoplama <span>{config.overlay}%</span><input type="range" min="0" max="60" value={config.overlay} onChange={e=>update('overlay',+e.target.value)}/></label><label>Yorqinlik <span>{config.brightness}%</span><input type="range" min="60" max="130" value={config.brightness} onChange={e=>update('brightness',+e.target.value)}/></label><label>Kattalashtirish <span>{config.backgroundZoom}%</span><input type="range" min="100" max="150" value={config.backgroundZoom} onChange={e=>update('backgroundZoom',+e.target.value)}/></label></div>}
      </section>
      <aside className="preview-area"><div className="preview-title"><div><span className="eyebrow">JONLI KO‘RINISH</span><h2>Poster tayyor</h2></div><span className="dimensions">1080 × 1440 px</span></div><div className="poster-wrap"><Poster config={config} svgRef={svgRef}/></div><div className="exports"><button className="png" onClick={downloadPng}><Download size={20}/><span>PNG yuklab olish<small>Yuqori sifat · 1080 × 1440</small></span></button><button onClick={downloadSvg}><ImagePlus size={20}/><span>SVG yuklab olish<small>Vektor format</small></span></button></div><p className="privacy">🔒 Rasmlar qurilmangizda qayta ishlanadi va hech qayerga yuborilmaydi</p></aside>
    </div>
  </main>
}
