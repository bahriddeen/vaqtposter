import { BackgroundArt } from './backgrounds';
import type { PosterConfig } from './types';

const uzMonths = ['Yanvar','Fevral','Mart','Aprel','May','Iyun','Iyul','Avgust','Sentabr','Oktabr','Noyabr','Dekabr'];
const hijriMonths = ['Muharram','Safar','Rabiul-avval','Rabiul-oxir','Jumodul-avval','Jumodul-oxir','Rajab','Sha’bon','Ramazon','Shavvol','Zulqa’da','Zulhijja'];
function wrapText(text: string, maxWidth: number, fontSize: number, maxLines = 10): string[] {
  const avgCharWidth = fontSize * 0.58;
  const maxChars = Math.floor(maxWidth / avgCharWidth);
  const paragraphs = text.split('\n');
  const lines: string[] = [];
  for (const para of paragraphs) {
    const words = para.split(' ');
    let current = '';
    for (const word of words) {
      const test = current ? current + ' ' + word : word;
      if (test.length > maxChars && current) { lines.push(current); current = word; }
      else { current = test; }
    }
    if (current) lines.push(current);
  }
  return lines.length ? lines.slice(0, maxLines) : [''];
}
function posterDates() {
  const today = new Date();
  const gregorian = `${today.getDate()} ${uzMonths[today.getMonth()]} ${today.getFullYear()}`;
  const parts = new Intl.DateTimeFormat('en-u-ca-islamic', { day:'numeric', month:'numeric', year:'numeric' }).formatToParts(today);
  const value = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find(p => p.type === type)?.value || 0);
  const hijri = `${value('day')} ${hijriMonths[value('month') - 1] || 'Hijriy yil'}, ${value('year')}`;
  return { gregorian, hijri };
}

export function Poster({ config, svgRef }: { config: PosterConfig; svgRef?: React.Ref<SVGSVGElement> }) {
  const { background: bg, liquidGlass, glassUI, prayers } = config;
  const useGlass = glassUI && liquidGlass;
  const darkText = bg.light;
  const ink = darkText ? '#17201d' : '#ffffff';
  const muted = darkText ? '#44514c' : '#dbe9e4';
  const panel = darkText ? '#ffffff' : '#0a1c19';
  const dates = posterDates();
  const quoteLines = wrapText(config.quoteText, 860, 38);
  const quoteLineCount = Math.min(quoteLines.length, 10);
  const quoteBlockH = quoteLineCount * 52 + 40 + (config.author?50:0) + (config.additionalInfo?40:0);
  const quoteStartY = config.mode==='iqtibos'?Math.max(160,(1440-quoteBlockH)/2):530;
  const quoteDividerY = quoteStartY + quoteLineCount * 52 + 40;
  return <svg ref={svgRef} viewBox="0 0 1080 1440" xmlns="http://www.w3.org/2000/svg" role="img" aria-label={config.mode==='namoz'?'Namoz vaqtlari posteri':'Iqtibos posteri'} style={{fontFamily:'Inter, Arial, sans-serif'}}>
    <defs>
      <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="28" stdDeviation="34" floodColor="#001a13" floodOpacity=".32"/></filter>
      <filter id="softGlow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="48"/></filter>
      <linearGradient id="glassSurface" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#fff" stopOpacity={darkText?'.7':'.24'}/><stop offset=".38" stopColor={darkText?'#f6fffb':'#b7ffe9'} stopOpacity={darkText?'.48':'.08'}/><stop offset="1" stopColor={panel} stopOpacity={darkText?'.54':'.5'}/></linearGradient>
      <linearGradient id="glassEdge"><stop stopColor="#fff" stopOpacity=".78"/><stop offset=".45" stopColor="#fff" stopOpacity=".12"/><stop offset="1" stopColor="#98f5d9" stopOpacity=".34"/></linearGradient>
      <radialGradient id="panelLight" cx="20%" cy="5%"><stop stopColor="#fff" stopOpacity=".28"/><stop offset="1" stopColor="#fff" stopOpacity="0"/></radialGradient>
      <filter id="brightness"><feComponentTransfer><feFuncR type="linear" slope="1"/><feFuncG type="linear" slope="1"/><feFuncB type="linear" slope="1"/></feComponentTransfer></filter>
    </defs>
    <g transform={`translate(540 720) scale(${config.backgroundZoom/100}) translate(-540 -720)`}>
      {bg.source ? <image href={bg.source} width="1080" height="1440" preserveAspectRatio={`x${config.backgroundPosition === 'left'?'Min':config.backgroundPosition === 'right'?'Max':'Mid'}YMid slice`}/> : <BackgroundArt kind={bg.kind} light={bg.light}/>}
    </g>
    {config.brightness<100 && <rect width="1080" height="1440" fill="#000" opacity={(100-config.brightness)/200}/>}
    {config.brightness>100 && <rect width="1080" height="1440" fill="#fff" opacity={(config.brightness-100)/200}/>}
    <rect width="1080" height="1440" fill={darkText?'#fff':'#00120e'} opacity={config.overlay/100}/>
    {useGlass && <><ellipse cx="180" cy="315" rx="270" ry="170" fill="#b9ffe8" opacity=".16" filter="url(#softGlow)"/><ellipse cx="965" cy="1040" rx="260" ry="230" fill="#70cdb0" opacity=".13" filter="url(#softGlow)"/></>}
    {config.mode==='namoz' && <g fill={ink} textAnchor="middle">
      <text x="540" y="168" fontSize="76" fontWeight="750" letterSpacing="-2">{config.title}</text>
      <path d="M420 210H660" stroke={ink} strokeOpacity=".45" strokeWidth="2"/>
      <text x="540" y="270" fontSize="31" fontWeight="500" opacity=".9">{config.mosqueName}</text>
    </g>}
    {glassUI && <g filter="url(#shadow)">
      <rect x="90" y="320" width="900" height="900" rx="58" fill={useGlass?'url(#glassSurface)':panel} fillOpacity={useGlass?'1':darkText?'.9':'.84'} stroke={useGlass?'url(#glassEdge)':'#fff'} strokeOpacity={useGlass?'1':'.14'} strokeWidth={useGlass?'3':'2'}/>
      {useGlass && <>
        <rect x="101" y="331" width="878" height="878" rx="49" fill="none" stroke="#fff" strokeOpacity=".13" strokeWidth="2"/>
        <rect x="90" y="320" width="900" height="900" rx="58" fill="url(#panelLight)"/>
        <path d="M94 1035v100c0 42 32 72 75 72h172" fill="none" stroke="#a6f8dd" strokeOpacity=".24" strokeWidth="3" strokeLinecap="round"/>
      </>}
    </g>}
    {config.mode==='namoz'?<g fill={ink}>
      <text x="480" y="385" fontSize="22" fontWeight="700" letterSpacing="4" fill={muted} textAnchor="middle">AZON</text>
      <text x="790" y="385" fontSize="22" fontWeight="700" letterSpacing="4" fill={muted} textAnchor="middle">TAKBIR</text>
      {prayers.map((p,i) => { const y=455+i*151; return <g key={p.name}>
        {i>0 && <line x1="145" y1={y-82} x2="935" y2={y-82} stroke={ink} strokeOpacity={useGlass?'.16':'.12'}/>}
        <circle cx="166" cy={y-8} r="5" fill={darkText?'#238269':'#75ddbd'}/>
        <text x="195" y={y} fontSize="35" fontWeight="650">{p.name}</text>
        <text x="480" y={y+6} fontSize="54" fontWeight="750" letterSpacing="1" textAnchor="middle">{p.azon}</text>
        <text x="790" y={y+6} fontSize="54" fontWeight="750" letterSpacing="1" textAnchor="middle">{p.takbir}</text>
      </g>})}
    </g>:<g fill={ink}>
      {quoteLines.map((line,i)=><text key={i} x="540" y={quoteStartY + i*52} fontSize="38" fontWeight="600" textAnchor="middle" letterSpacing="-.3" fill={ink}>{line}</text>)}
      <line x1="350" y1={quoteDividerY} x2="730" y2={quoteDividerY} stroke={muted} strokeOpacity=".4" strokeWidth="1"/>
      {config.author?<text x="540" y={quoteDividerY + 50} fontSize="27" fontWeight="600" textAnchor="middle" fill={ink}>{config.author}</text>:null}
      {config.additionalInfo?<text x="540" y={quoteDividerY + (config.author?90:50)} fontSize="19" fontWeight="400" textAnchor="middle" fill={muted}>{config.additionalInfo}</text>:null}
    </g>}
    <g transform="translate(133 1337)" fill={ink} opacity=".9">
      <g transform="translate(-22 -22) scale(.9167)">
        <path fill="#29b6f6" d="M24 4A20 20 0 1 0 24 44A20 20 0 1 0 24 4Z"/>
        <path fill="#fff" d="M33.95 15 30.204 34.126s-.161.874-1.245.874c-.576 0-.873-.274-.873-.274l-8.114-6.733-3.97-2.001-5.095-1.355S10 24.375 10 23.625c0-.625.933-.923.933-.923l21.316-8.468S32.9 14 33.375 14C33.667 14 34 14.125 34 14.5c0 .25-.05.5-.05.5Z"/>
        <path fill="#b0bec5" d="m23 30.505-3.426 3.374s-.149.115-.348.12a.4.4 0 0 1-.219-.043l.964-5.965Z"/>
        <path fill="#cfd8dc" d="M29.897 18.196a.502.502 0 0 0-.701-.093L16 26s2.106 5.892 2.427 6.912c.322 1.021.58 1.045.58 1.045l.964-5.965 9.832-9.096a.501.501 0 0 0 .094-.7Z"/>
      </g>
      <text x="36" y="9" fontSize="25" fontWeight="600">{config.telegram}</text>
    </g>
    <g fill={ink} textAnchor="end"><text x="968" y="1333" fontSize="26" fontWeight="700">{dates.gregorian}</text><text x="968" y="1371" fontSize="20" fontWeight="500" opacity=".68">{dates.hijri}</text></g>
  </svg>;
}
