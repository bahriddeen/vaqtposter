import { useRef, useState } from 'react';
import { Download, ImagePlus, SlidersHorizontal, Sparkles, Upload, ChevronDown } from 'lucide-react';
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
  background:backgrounds[0], liquidGlass:true, overlay:22, backgroundPosition:'center', backgroundZoom:100, brightness:100,
  quoteText:'', author:'', additionalInfo:''
};

const slug = (s:string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');

export function App(){
  const [config,setConfig]=useState(initial); const [advanced,setAdvanced]=useState(false); const svgRef=useRef<SVGSVGElement>(null);
const setMode=(mode:PosterMode)=>setConfig(c=>({...c,mode,title:mode==='namoz'?'Namoz Vaqtlari':'Iqtibos'}));
  const update=<K extends keyof PosterConfig>(key:K,value:PosterConfig[K])=>setConfig(c=>({...c,[key]:value}));
  const editPrayer=(i:number,key:'azon'|'takbir',value:string)=>update('prayers',config.prayers.map((p,n)=>n===i?{...p,[key]:value}:p));
  const svgText=()=>{const node=svgRef.current!.cloneNode(true) as SVGSVGElement;node.setAttribute('width','1080');node.setAttribute('height','1440');return '<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(node)};
  const save=(blob:Blob,ext:string)=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);const fname=config.mode==='namoz'?`namoz-vaqtlari-${slug(config.mosqueName)||'masjid'}.${ext}`:`iqtibos-${slug(config.author)||'muallif'}.${ext}`;a.download=fname;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000)};
  const downloadSvg=()=>save(new Blob([svgText()],{type:'image/svg+xml;charset=utf-8'}),'svg');
  const downloadPng=()=>{const img=new Image();const url=URL.createObjectURL(new Blob([svgText()],{type:'image/svg+xml;charset=utf-8'}));img.onload=()=>{const c=document.createElement('canvas');c.width=1080;c.height=1440;c.getContext('2d')!.drawImage(img,0,0);c.toBlob(b=>b&&save(b,'png'),'image/png',1);URL.revokeObjectURL(url)};img.src=url};
  const upload=(file?:File)=>{if(!file)return;const reader=new FileReader();reader.onload=()=>update('background',{id:'upload',name:'Shaxsiy',light:false,kind:'upload',source:String(reader.result)});reader.readAsDataURL(file)};
  return <main>
    <header className="topbar"><div className="brand"><span className="brandmark">◒</span><span>Vaqt<span>Poster</span></span></div><div className="mode-switcher"><button className={config.mode==='namoz'?'active':''} onClick={()=>setMode('namoz')}>Namoz vaqtlari</button><button className={config.mode==='iqtibos'?'active':''} onClick={()=>setMode('iqtibos')}>Iqtibos</button></div><p>{config.mode==='namoz'?'Namoz jadvalini bir daqiqada tayyorlang':'Iqtiboslar uchun postlar tayyorlang'}</p><span className="saved">● &nbsp; Barcha o‘zgarishlar saqlanadi</span></header>
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
        <div className="card"><h2><span>04</span> Fon</h2><div className="backgrounds">{backgrounds.map(bg=><button key={bg.id} className={'bg-choice '+(config.background.id===bg.id?'active':'')} onClick={()=>update('background',bg)}><svg viewBox="0 0 1080 1440" preserveAspectRatio="xMidYMid slice"><BackgroundArt kind={bg.kind} light={bg.light}/></svg><span>{bg.name}</span></button>)}<label className="upload"><Upload size={20}/><span>Rasm yuklash</span><input type="file" accept="image/jpeg,image/png,image/webp" onChange={e=>upload(e.target.files?.[0])}/></label></div></div>
        <div className="card style-card"><div><h2><Sparkles size={19}/> Liquid Glass</h2><p>Zamonaviy shaffof shisha effekti</p></div><button className={'toggle '+(config.liquidGlass?'on':'')} onClick={()=>update('liquidGlass',!config.liquidGlass)} aria-label="Liquid Glass"><span/></button></div>
        <button className="advanced" onClick={()=>setAdvanced(!advanced)}><SlidersHorizontal size={18}/> Qo‘shimcha sozlamalar <ChevronDown className={advanced?'rotated':''} size={18}/></button>
        {advanced&&<div className="card range-card"><label>Qoplama <span>{config.overlay}%</span><input type="range" min="0" max="60" value={config.overlay} onChange={e=>update('overlay',+e.target.value)}/></label><label>Yorqinlik <span>{config.brightness}%</span><input type="range" min="60" max="130" value={config.brightness} onChange={e=>update('brightness',+e.target.value)}/></label><label>Kattalashtirish <span>{config.backgroundZoom}%</span><input type="range" min="100" max="150" value={config.backgroundZoom} onChange={e=>update('backgroundZoom',+e.target.value)}/></label></div>}
      </section>
      <aside className="preview-area"><div className="preview-title"><div><span className="eyebrow">JONLI KO‘RINISH</span><h2>Poster tayyor</h2></div><span className="dimensions">1080 × 1440 px</span></div><div className="poster-wrap"><Poster config={config} svgRef={svgRef}/></div><div className="exports"><button className="png" onClick={downloadPng}><Download size={20}/><span>PNG yuklab olish<small>Yuqori sifat · 1080 × 1440</small></span></button><button onClick={downloadSvg}><ImagePlus size={20}/><span>SVG yuklab olish<small>Vektor format</small></span></button></div><p className="privacy">🔒 Rasmlar qurilmangizda qayta ishlanadi va hech qayerga yuborilmaydi</p></aside>
    </div>
  </main>
}
