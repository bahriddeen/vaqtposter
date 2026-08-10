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
