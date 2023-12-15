export enum AnchorLink {
  EXW = '#EXW',
  FOB = '#FOB',
  CIF = '#CIF',
  DDP = '#DDP',
  OCEAN = '#Ocean',
  AIR = '#Air',
}
export interface AnchorType {
  key: string
  href: AnchorLink
  title: string
}
export interface DataPage {
  id: number
  name: string
  anchor?: AnchorType[]
  component: JSX.Element
}
