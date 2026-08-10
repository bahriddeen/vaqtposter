import type { Background } from './types';

export const backgrounds: Background[] = [
  { id: 'emerald', name: 'Zumrad', light: false, kind: 'emerald' },
  { id: 'night', name: 'Tun', light: false, kind: 'night' },
  { id: 'sunset', name: 'Shafaq', light: false, kind: 'sunset' },
  { id: 'azure', name: 'Moviy', light: false, kind: 'azure' },
  { id: 'sand', name: 'Naqsh', light: true, kind: 'sand' },
  { id: 'light', name: 'Yorug‘', light: true, kind: 'light' },
  { id: 'bg11', name: 'Rasm 1', light: false, kind: 'upload', source: '/bg/11.jpg' },
  { id: 'bg12', name: 'Rasm 2', light: false, kind: 'upload', source: '/bg/12.jpg' },
  { id: 'bg13', name: 'Rasm 3', light: false, kind: 'upload', source: '/bg/13.jpg' },
  { id: 'bg14', name: 'Rasm 4', light: false, kind: 'upload', source: '/bg/14.jpg' },
  { id: 'bg15', name: 'Rasm 5', light: false, kind: 'upload', source: '/bg/15.jpg' },
  { id: 'bg16', name: 'Rasm 6', light: false, kind: 'upload', source: '/bg/16.jpg' },
  { id: 'bg17', name: 'Rasm 7', light: false, kind: 'upload', source: '/bg/17.jpg' },
  { id: 'bg18', name: 'Rasm 8', light: false, kind: 'upload', source: '/bg/18.jpg' },
  { id: 'bg19', name: 'Rasm 9', light: false, kind: 'upload', source: '/bg/19.jpg' },
];

function MosqueScene({ color, opacity = .22 }: { color: string; opacity?: number }) {
  return <g fill={color} opacity={opacity}>
    <g opacity=".42">
      <path d="M18 1165v-127h34c5-62 51-105 108-105s103 43 108 105h35v127Zm759 0v-127h34c5-62 51-105 108-105s103 43 108 105h35v127Z"/>
      <path d="M160 925v-48m759 48v-48" stroke={color} strokeWidth="8"/>
      <path d="M160 847a15 15 0 1 1-11 25 13 13 0 1 0 11-25Zm759 0a15 15 0 1 1-11 25 13 13 0 1 0 11-25Z"/>
    </g>
    {/* distant courtyard arcade */}
    <path d="M0 1165h1080v275H0Zm42 55v125h78v-125c0-52-78-52-78 0Zm124 0v125h78v-125c0-52-78-52-78 0Zm670 0v125h78v-125c0-52-78-52-78 0Zm124 0v125h78v-125c0-52-78-52-78 0Z" fillRule="evenodd" opacity=".55"/>
    {/* central prayer hall and main dome */}
    <path d="M260 1165V930h72c7-121 97-205 208-205s201 84 208 205h72v235Z"/>
    <path d="M348 930c9-102 88-175 192-175s183 73 192 175Z" opacity=".72"/>
    <rect x="488" y="675" width="104" height="58" rx="5"/>
    <path d="M540 610c-23 26-23 58 0 82 23-24 23-56 0-82Z"/>
    <circle cx="540" cy="606" r="6"/>
    <path d="M540 571a24 24 0 1 1-18 40 20 20 0 1 0 18-40Z"/>
    {/* paired minarets */}
    <path d="M135 1165V615h82v550Zm-16-550h114l-18-42h-78Zm17-57h80l-13-49h-54Zm18-65h48l-8-32h-32Zm13-47h22v-72h-22Z"/>
    <path d="M863 1165V615h82v550Zm-16-550h114l-18-42h-78Zm17-57h80l-13-49h-54Zm18-65h48l-8-32h-32Zm13-47h22v-72h-22Z"/>
    {/* minaret crowns and crescents */}
    <path d="M178 331a19 19 0 1 1-14 32 16 16 0 1 0 14-32Zm728 0a19 19 0 1 1-14 32 16 16 0 1 0 14-32Z"/>
    {/* arched doors and windows cut by background-colored low-opacity details */}
    <g fill="#fff" opacity=".16">
      <path d="M474 1165V1010c0-88 132-88 132 0v155Z"/>
      <path d="M355 1165v-108c0-57 78-57 78 0v108Zm292 0v-108c0-57 78-57 78 0v108Z"/>
      <path d="M158 760v-92c0-31 36-31 36 0v92Zm728 0v-92c0-31 36-31 36 0v92Z"/>
    </g>
    <g fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="4">
      <path d="M376 1002v79m328-79v79"/><circle cx="376" cy="990" r="9"/><circle cx="704" cy="990" r="9"/>
    </g>
    {/* architectural trim */}
    <g fill="none" stroke="#fff" strokeOpacity=".2" strokeWidth="7">
      <path d="M280 950h520M151 820h50M879 820h50M151 885h50M879 885h50"/>
      <path d="M455 913q85-108 170 0"/>
    </g>
    <path d="M220 1165h640l70 42H150Zm-100 58h840l70 48H50Z" opacity=".72"/>
  </g>;
}

export function BackgroundArt({ kind, light }: { kind: string; light: boolean }) {
  if (kind === 'upload') return null;
  const colors: Record<string, [string,string,string]> = {
    emerald:['#061d18','#0c5d4b','#1a8066'], night:['#070c19','#162747','#274b72'],
    sunset:['#2b1839','#b54e50','#f6b65f'], azure:['#071c33','#0f5780','#41a4af'],
    sand:['#ede1c5','#f7f1e2','#cbb68c'], light:['#e7eee9','#fafcf9','#b7cfc5']
  };
  const c = colors[kind] || colors.emerald;
  return <>
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stopColor={c[0]}/><stop offset=".48" stopColor={c[1]}/><stop offset="1" stopColor={c[2]}/></linearGradient>
      <radialGradient id="glow"><stop stopColor={light?'#fff':'#b7ffe7'} stopOpacity=".48"/><stop offset="1" stopOpacity="0"/></radialGradient>
      <radialGradient id="warmGlow"><stop stopColor={kind==='sunset'?'#ffd897':'#b7e9ff'} stopOpacity=".38"/><stop offset="1" stopOpacity="0"/></radialGradient>
      <linearGradient id="horizon" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#fff" stopOpacity="0"/><stop offset="1" stopColor={light?'#7f6d4b':'#001a18'} stopOpacity=".34"/></linearGradient>
      <pattern id="pattern" width="112" height="112" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path d="M56 0 112 56 56 112 0 56Z" fill="none" stroke={light?'#6e6147':'#fff'} strokeOpacity=".075" strokeWidth="2"/><circle cx="56" cy="56" r="15" fill="none" stroke={light?'#6e6147':'#fff'} strokeOpacity=".065"/><path d="M56 28 84 56 56 84 28 56Z" fill="none" stroke={light?'#6e6147':'#fff'} strokeOpacity=".045"/></pattern>
      <filter id="atmosphere"><feGaussianBlur stdDeviation="28"/></filter>
    </defs>
    <rect width="1080" height="1440" fill="url(#bg)"/>
    <circle cx="120" cy="70" r="560" fill="url(#glow)"/>
    <circle cx="980" cy="1180" r="470" fill="url(#warmGlow)"/>
    <rect width="1080" height="1440" fill="url(#pattern)"/>
    <rect y="880" width="1080" height="560" fill="url(#horizon)"/>
    {kind === 'sunset' && <>
      <circle cx="795" cy="250" r="118" fill="#ffd89c" opacity=".5"/><circle cx="795" cy="250" r="190" fill="#ffcd8b" opacity=".16" filter="url(#atmosphere)"/>
      <MosqueScene color="#170f25" opacity={.78}/>
    </>}
    {kind === 'emerald' && <>
      <g fill="none" stroke="#fff" strokeOpacity=".055" strokeWidth="3"><path d="M-100 450Q200 50 500 450T1100 450"/><path d="M-100 500Q200 100 500 500T1100 500"/></g>
      <MosqueScene color="#001c17" opacity={.2}/>
    </>}
    {kind === 'night' && <>
      <g fill="#fff">{[[135,165,3],[310,98,2],[685,145,3],[895,84,2],[965,285,3],[525,250,2]].map(([x,y,r])=><circle key={`${x}-${y}`} cx={x} cy={y} r={r} opacity=".55"/>)}</g>
      <path d="M790 212a84 84 0 1 1-69-132 70 70 0 1 0 69 132Z" fill="#f8e6b1" opacity=".84"/>
      <MosqueScene color="#030914" opacity={.48}/>
    </>}
    {kind === 'azure' && <>
      <path d="M0 260C245 170 390 350 625 245c190-85 310-47 455 20V0H0Z" fill="#8ce0dd" opacity=".1"/>
      <path d="M0 1210c250-115 405 38 618-30 202-65 302-9 462 63v197H0Z" fill="#001e33" opacity=".18"/>
      <g fill="none" stroke="#b8ffff" strokeOpacity=".08" strokeWidth="3"><circle cx="920" cy="310" r="170"/><circle cx="920" cy="310" r="225"/><circle cx="920" cy="310" r="280"/></g>
      <MosqueScene color="#00283b" opacity={.14}/>
    </>}
    {kind === 'sand' && <>
      <MosqueScene color="#80683e" opacity={.13}/>
      <path d="M90 0v1440M990 0v1440" stroke="#8b7044" strokeOpacity=".06" strokeWidth="80"/>
    </>}
    {kind === 'light' && <>
      <path d="M110 1440V310c0-135 185-135 185 0v1130M785 1440V390c0-120 165-120 165 0v1050" fill="none" stroke="#457c6d" strokeOpacity=".07" strokeWidth="45"/>
      <circle cx="540" cy="720" r="390" fill="none" stroke="#477f70" strokeOpacity=".045" strokeWidth="80"/>
      <MosqueScene color="#376f61" opacity={.075}/>
    </>}
  </>;
}
